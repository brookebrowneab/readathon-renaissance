-- Table: class_pledges
-- Class-level pledges with milestone support

CREATE TABLE public.class_pledges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_name text NOT NULL,
  teacher_id uuid REFERENCES public.teachers(id),
  event_id uuid REFERENCES public.events(id),
  sponsor_user_id uuid NOT NULL,
  pledge_type text NOT NULL,
  amount numeric NOT NULL,
  max_cap numeric,
  milestone_minutes_target integer,
  is_unlocked boolean NOT NULL DEFAULT false,
  is_paid boolean NOT NULL DEFAULT false,
  payment_status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.class_pledges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view class pledges"
  ON public.class_pledges
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create class pledges"
  ON public.class_pledges
  FOR INSERT
  WITH CHECK (auth.uid() = sponsor_user_id);

CREATE POLICY "Sponsors can update their class pledges"
  ON public.class_pledges
  FOR UPDATE
  USING (auth.uid() = sponsor_user_id);

CREATE POLICY "Sponsors can delete their unpaid class pledges"
  ON public.class_pledges
  FOR DELETE
  USING ((auth.uid() = sponsor_user_id) AND (is_paid = false));

CREATE POLICY "Admins can manage all class pledges"
  ON public.class_pledges
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
