-- Add child_id column to reading_logs to link with children table
ALTER TABLE public.reading_logs 
ADD COLUMN child_id UUID REFERENCES public.children(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX idx_reading_logs_child_id ON public.reading_logs(child_id);

-- Drop existing policies that we'll replace
DROP POLICY IF EXISTS "Anyone can view reading logs" ON public.reading_logs;
DROP POLICY IF EXISTS "Authenticated users can insert reading logs" ON public.reading_logs;

-- Parents can view their children's reading logs
CREATE POLICY "Parents can view their children's reading logs"
ON public.reading_logs
FOR SELECT
USING (
  child_id IN (SELECT id FROM public.children WHERE user_id = auth.uid())
);

-- Parents can insert reading logs for their children
CREATE POLICY "Parents can insert reading logs for their children"
ON public.reading_logs
FOR INSERT
WITH CHECK (
  child_id IN (SELECT id FROM public.children WHERE user_id = auth.uid())
);

-- Parents can update their children's reading logs
CREATE POLICY "Parents can update their children's reading logs"
ON public.reading_logs
FOR UPDATE
USING (
  child_id IN (SELECT id FROM public.children WHERE user_id = auth.uid())
);

-- Parents can delete their children's reading logs
CREATE POLICY "Parents can delete their children's reading logs"
ON public.reading_logs
FOR DELETE
USING (
  child_id IN (SELECT id FROM public.children WHERE user_id = auth.uid())
);

-- Admins can view all reading logs
CREATE POLICY "Admins can view all reading logs"
ON public.reading_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Public can view reading logs for children with public links (for sponsor pages)
CREATE POLICY "Public can view reading logs for public children"
ON public.reading_logs
FOR SELECT
USING (
  child_id IN (SELECT id FROM public.children WHERE share_public_link = true)
);