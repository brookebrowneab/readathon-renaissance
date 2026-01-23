-- Create teacher type enum
CREATE TYPE public.teacher_type AS ENUM ('homeroom', 'partner', 'specials', 'staff');

-- Create teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  teacher_type teacher_type NOT NULL DEFAULT 'homeroom',
  has_full_access BOOLEAN NOT NULL DEFAULT false, -- For staff, librarian, principal
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class assignments for partner teachers
CREATE TABLE public.teacher_class_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  homeroom_teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, homeroom_teacher_id)
);

-- Add homeroom_teacher_id to children table
ALTER TABLE public.children 
ADD COLUMN homeroom_teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_class_assignments ENABLE ROW LEVEL SECURITY;

-- Teachers table policies
CREATE POLICY "Anyone can view active teachers"
  ON public.teachers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all teachers"
  ON public.teachers FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Teacher class assignments policies
CREATE POLICY "Admins can manage class assignments"
  ON public.teacher_class_assignments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers can view their assignments"
  ON public.teacher_class_assignments FOR SELECT
  USING (
    teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid())
    OR homeroom_teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid())
  );

-- Add teacher role to app_role enum if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'teacher' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'teacher';
  END IF;
END $$;

-- Create function for teachers to view their students
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
      -- Partner teacher can see students of their assigned homeroom teachers
      OR c.homeroom_teacher_id IN (
        SELECT tca.homeroom_teacher_id 
        FROM teacher_class_assignments tca 
        WHERE tca.teacher_id = t.id
      )
    )
  )
$$;

-- Add RLS policy for teachers to view children
CREATE POLICY "Teachers can view their students"
  ON public.children FOR SELECT
  USING (can_teacher_view_child(auth.uid(), id));

-- Add RLS policy for teachers to view reading logs of their students
CREATE POLICY "Teachers can view their students reading logs"
  ON public.reading_logs FOR SELECT
  USING (can_teacher_view_child(auth.uid(), child_id));

-- Trigger for updated_at
CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();