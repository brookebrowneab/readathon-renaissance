-- Add payment_status column to pledges table for tracking check payments
ALTER TABLE public.pledges
ADD COLUMN payment_status text NOT NULL DEFAULT 'pending';

-- Add expected_payment_method column
ALTER TABLE public.pledges
ADD COLUMN expected_payment_method text DEFAULT NULL;

-- Add index for filtering by payment status
CREATE INDEX idx_pledges_payment_status ON public.pledges(payment_status);

-- Update RLS to allow authenticated users to update their pledges
CREATE POLICY "Authenticated users can update pledges"
ON public.pledges
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);