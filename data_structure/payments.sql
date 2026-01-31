-- Table: payments
-- Payment records for pledges

CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pledge_id uuid REFERENCES public.pledges(id),
  class_pledge_id uuid REFERENCES public.class_pledges(id),
  pledge_type text NOT NULL,
  amount numeric NOT NULL,
  payment_method text NOT NULL DEFAULT 'card',
  payer_user_id uuid,
  payer_name text,
  payer_email text,
  student_name text,
  square_payment_id text,
  square_receipt_url text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own payments"
  ON public.payments
  FOR SELECT
  USING (payer_user_id = auth.uid());

CREATE POLICY "Parents can view payments for their children"
  ON public.payments
  FOR SELECT
  USING (pledge_id IN (
    SELECT p.id FROM pledges p
    JOIN children c ON p.child_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all payments"
  ON public.payments
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
