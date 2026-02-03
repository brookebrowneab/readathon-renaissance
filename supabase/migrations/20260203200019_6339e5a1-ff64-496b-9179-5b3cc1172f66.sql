-- Drop and recreate view with security_invoker to fix security linter warning
DROP VIEW IF EXISTS public.children_public_safe;

CREATE VIEW public.children_public_safe
WITH (security_invoker = on) AS
SELECT 
  id,
  user_id,
  safe_display_name(name) as display_name,
  grade_info,
  class_name,
  goal_minutes,
  total_minutes,
  share_public_link,
  homeroom_teacher_id
FROM public.children
WHERE share_public_link = true;

-- Re-grant access to the view
GRANT SELECT ON public.children_public_safe TO anon, authenticated;