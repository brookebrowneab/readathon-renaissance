-- Create payments table to track Square payment transactions
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pledge_id UUID REFERENCES public.pledges(id) ON DELETE SET NULL,
  class_pledge_id UUID REFERENCES public.class_pledges(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  square_payment_id TEXT,
  square_receipt_url TEXT,
  payment_method TEXT NOT NULL DEFAULT 'card',
  pledge_type TEXT NOT NULL, -- 'flat' or 'per_minute'
  payer_user_id UUID,
  payer_name TEXT,
  payer_email TEXT,
  student_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Admins can manage all payments
CREATE POLICY "Admins can manage all payments"
ON public.payments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own payments
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (payer_user_id = auth.uid());

-- Users can view payments for their children's pledges
CREATE POLICY "Parents can view payments for their children"
ON public.payments
FOR SELECT
USING (
  pledge_id IN (
    SELECT p.id FROM pledges p
    JOIN children c ON p.child_id = c.id
    WHERE c.user_id = auth.uid()
  )
);

-- Create index for faster lookups
CREATE INDEX idx_payments_pledge_id ON public.payments(pledge_id);
CREATE INDEX idx_payments_class_pledge_id ON public.payments(class_pledge_id);
CREATE INDEX idx_payments_payer_user_id ON public.payments(payer_user_id);
CREATE INDEX idx_payments_square_payment_id ON public.payments(square_payment_id);

-- Add trigger for updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();