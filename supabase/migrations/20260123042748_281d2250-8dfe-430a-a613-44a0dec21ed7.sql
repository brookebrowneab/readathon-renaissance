-- Drop the overly permissive policies on events table
DROP POLICY IF EXISTS "Anyone can insert events" ON public.events;
DROP POLICY IF EXISTS "Anyone can update events" ON public.events;

-- Create proper admin-only policies for INSERT and UPDATE
CREATE POLICY "Admins can insert events" 
ON public.events 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update events" 
ON public.events 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Add DELETE policy for admins (was missing)
CREATE POLICY "Admins can delete events" 
ON public.events 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));