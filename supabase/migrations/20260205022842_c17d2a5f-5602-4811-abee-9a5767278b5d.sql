-- Create a public-safe view for teachers that excludes email
CREATE OR REPLACE VIEW public.teachers_public_safe
WITH (security_invoker=on) AS
  SELECT 
    id,
    name,
    grade_level,
    teacher_type,
    has_full_access,
    is_active,
    user_id,
    created_at,
    updated_at
    -- email is intentionally excluded for privacy
  FROM public.teachers;

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view active teachers" ON public.teachers;

-- Create policy: Admins can see all teacher data including email
CREATE POLICY "Admins can view all teacher data"
  ON public.teachers
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy: Teachers can view their own record with email
CREATE POLICY "Teachers can view their own record"
  ON public.teachers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create policy: Authenticated users can view non-email teacher data via the view
-- The view uses security_invoker so it respects RLS - we need a policy for the view to work
CREATE POLICY "Authenticated users can view active teachers basic info"
  ON public.teachers
  FOR SELECT
  TO authenticated
  USING (is_active = true);