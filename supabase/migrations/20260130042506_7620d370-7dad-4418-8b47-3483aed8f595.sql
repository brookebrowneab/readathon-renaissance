-- Add grade_level column to teachers table
ALTER TABLE public.teachers 
ADD COLUMN grade_level text;

COMMENT ON COLUMN public.teachers.grade_level IS 
'Grade level for partner teachers assigned to an entire grade (e.g., "1st", "2nd")';

-- Update the can_teacher_view_child function to support grade-level partner teachers
CREATE OR REPLACE FUNCTION public.can_teacher_view_child(teacher_user_id UUID, child_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM teachers t
    JOIN children c ON c.id = child_id
    WHERE t.user_id = teacher_user_id
    AND t.is_active = true
    AND (
      -- Staff/librarian with full access can see everyone
      t.has_full_access = true
      -- Homeroom teacher can see their students
      OR c.homeroom_teacher_id = t.id
      -- Partner teacher assigned to specific homerooms
      OR c.homeroom_teacher_id IN (
        SELECT tca.homeroom_teacher_id 
        FROM teacher_class_assignments tca 
        WHERE tca.teacher_id = t.id
      )
      -- Partner teacher assigned to entire grade (no specific homeroom assignments)
      OR (
        t.teacher_type = 'partner' 
        AND t.grade_level IS NOT NULL
        AND c.grade_info = t.grade_level
        AND NOT EXISTS (
          SELECT 1 FROM teacher_class_assignments tca 
          WHERE tca.teacher_id = t.id
        )
      )
    )
  )
$$;