-- View: children_public_safe
-- Privacy-safe view for sponsor access to child data
-- Returns display_name (First Name + Last Initial) instead of full name
-- Excludes sensitive fields (student auth is in separate student_auth table)

-- Function to transform full name to safe display name
CREATE OR REPLACE FUNCTION public.safe_display_name(full_name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  parts text[];
  first_name text;
  last_initial text;
BEGIN
  IF full_name IS NULL OR full_name = '' THEN
    RETURN 'Reader';
  END IF;
  
  parts := string_to_array(trim(full_name), ' ');
  first_name := parts[1];
  
  IF array_length(parts, 1) > 1 THEN
    last_initial := left(parts[array_length(parts, 1)], 1) || '.';
    RETURN first_name || ' ' || last_initial;
  ELSE
    RETURN first_name;
  END IF;
END;
$$;

-- Create public-safe view with security_invoker
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

-- Grant access to the view
GRANT SELECT ON public.children_public_safe TO anon, authenticated;
