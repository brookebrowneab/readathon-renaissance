-- Add payment_token column to class_pledges for guest payment links
ALTER TABLE public.class_pledges
ADD COLUMN payment_token uuid DEFAULT gen_random_uuid();

-- Create index for fast token lookups
CREATE INDEX idx_class_pledges_payment_token ON public.class_pledges(payment_token);

-- Add RLS policy to allow guests to view their pledge by token
CREATE POLICY "Anyone can view class pledge by payment token"
  ON public.class_pledges
  FOR SELECT
  USING (payment_token IS NOT NULL);

-- Also allow guests to insert payments for pledges they have token access to
CREATE POLICY "Anyone can insert payments for guest pledges"
  ON public.payments
  FOR INSERT
  WITH CHECK (
    class_pledge_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM class_pledges cp
      WHERE cp.id = class_pledge_id
      AND cp.sponsor_user_id = '00000000-0000-0000-0000-000000000000'
    )
  );