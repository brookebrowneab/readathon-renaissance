-- Table: pledges
-- Individual student pledges from sponsors/parents

CREATE TABLE public.pledges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id uuid REFERENCES public.children(id),
  event_id uuid REFERENCES public.events(id),
  sponsor_id uuid REFERENCES public.sponsors(id),
  student_name text NOT NULL,
  pledge_type text NOT NULL,
  amount numeric NOT NULL,
  expected_payment_method text,
  is_paid boolean NOT NULL DEFAULT false,
  payment_status text NOT NULL DEFAULT 'pending',
  final_amount numeric,
  finalized_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view pledges"
  ON public.pledges
  FOR SELECT
  USING (true);

CREATE POLICY "Parents can insert pledges for their children"
  ON public.pledges
  FOR INSERT
  WITH CHECK ((child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  )) OR (auth.uid() IS NOT NULL));

CREATE POLICY "Parents can update their children's pledges"
  ON public.pledges
  FOR UPDATE
  USING ((child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  )) OR (sponsor_id IN (
    SELECT sponsors.id FROM sponsors WHERE sponsors.user_id = auth.uid()
  )));

CREATE POLICY "Parents can delete their children's pledges"
  ON public.pledges
  FOR DELETE
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));
