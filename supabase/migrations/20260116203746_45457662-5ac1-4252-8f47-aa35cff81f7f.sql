-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON public.events;

-- Create more permissive policies for demo purposes
-- In production, these should require admin role authentication
CREATE POLICY "Anyone can insert events"
  ON public.events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update events"
  ON public.events FOR UPDATE
  USING (true);