-- Create a function to get class totals (returns aggregate data only, privacy-safe)
CREATE OR REPLACE FUNCTION public.get_class_total_minutes(p_class_name text)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(total_minutes), 0)::integer
  FROM children
  WHERE class_name = p_class_name
    AND class_name IS NOT NULL;
$$;

-- Create a function to get grade totals (returns aggregate data only, privacy-safe)
CREATE OR REPLACE FUNCTION public.get_grade_total_minutes(p_grade_info text)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(total_minutes), 0)::integer
  FROM children
  WHERE grade_info = p_grade_info
    AND grade_info IS NOT NULL;
$$;