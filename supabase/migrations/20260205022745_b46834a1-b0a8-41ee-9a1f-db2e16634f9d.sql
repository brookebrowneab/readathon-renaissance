-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view pledges" ON public.pledges;

-- Create a new policy that only allows authenticated users to view pledges
CREATE POLICY "Authenticated users can view pledges"
  ON public.pledges
  FOR SELECT
  TO authenticated
  USING (true);