-- Create class_pledges table for "Entire Class" pooled pledges (if not exists)
CREATE TABLE IF NOT EXISTS public.class_pledges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_user_id uuid NOT NULL,
  class_name text NOT NULL,
  teacher_id uuid REFERENCES public.teachers(id),
  event_id uuid REFERENCES public.events(id),
  pledge_type text NOT NULL CHECK (pledge_type IN ('flat', 'per_minute')),
  amount numeric NOT NULL CHECK (amount > 0),
  max_cap numeric CHECK (max_cap IS NULL OR max_cap > 0),
  is_paid boolean NOT NULL DEFAULT false,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on class_pledges
ALTER TABLE public.class_pledges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view class pledges" ON public.class_pledges;
DROP POLICY IF EXISTS "Authenticated users can create class pledges" ON public.class_pledges;
DROP POLICY IF EXISTS "Sponsors can update their class pledges" ON public.class_pledges;
DROP POLICY IF EXISTS "Sponsors can delete their unpaid class pledges" ON public.class_pledges;
DROP POLICY IF EXISTS "Admins can manage all class pledges" ON public.class_pledges;

-- RLS: Anyone can view class pledges (for transparency)
CREATE POLICY "Anyone can view class pledges"
ON public.class_pledges
FOR SELECT
USING (true);

-- RLS: Authenticated users can create class pledges
CREATE POLICY "Authenticated users can create class pledges"
ON public.class_pledges
FOR INSERT
WITH CHECK (auth.uid() = sponsor_user_id);

-- RLS: Sponsors can update their own pledges
CREATE POLICY "Sponsors can update their class pledges"
ON public.class_pledges
FOR UPDATE
USING (auth.uid() = sponsor_user_id);

-- RLS: Sponsors can delete their own unpaid pledges
CREATE POLICY "Sponsors can delete their unpaid class pledges"
ON public.class_pledges
FOR DELETE
USING (auth.uid() = sponsor_user_id AND is_paid = false);

-- RLS: Admins can manage all class pledges
CREATE POLICY "Admins can manage all class pledges"
ON public.class_pledges
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_class_pledges_class_name ON public.class_pledges(class_name);
CREATE INDEX IF NOT EXISTS idx_class_pledges_sponsor ON public.class_pledges(sponsor_user_id);
CREATE INDEX IF NOT EXISTS idx_class_pledges_event ON public.class_pledges(event_id);

-- Now create the function to calculate class fundraising total
CREATE OR REPLACE FUNCTION public.get_class_fundraising_total(p_class_name text, p_event_id uuid DEFAULT NULL)
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      -- Individual child pledges
      SELECT SUM(
        CASE 
          WHEN p.pledge_type = 'flat' THEN p.amount
          WHEN p.pledge_type = 'per_minute' THEN 
            p.amount * COALESCE(c.total_minutes, 0)
          ELSE 0
        END
      )
      FROM pledges p
      JOIN children c ON p.child_id = c.id
      WHERE c.class_name = p_class_name
        AND (p_event_id IS NULL OR p.event_id = p_event_id)
    ), 0
  ) + COALESCE(
    (
      -- Direct class pledges
      SELECT SUM(
        CASE 
          WHEN cp.pledge_type = 'flat' THEN cp.amount
          WHEN cp.pledge_type = 'per_minute' THEN 
            LEAST(
              cp.amount * COALESCE(
                (SELECT SUM(total_minutes) FROM children WHERE class_name = p_class_name),
                0
              ),
              COALESCE(cp.max_cap, cp.amount * COALESCE(
                (SELECT SUM(total_minutes) FROM children WHERE class_name = p_class_name),
                0
              ))
            )
          ELSE 0
        END
      )
      FROM class_pledges cp
      WHERE cp.class_name = p_class_name
        AND (p_event_id IS NULL OR cp.event_id = p_event_id)
    ), 0
  );
$$;