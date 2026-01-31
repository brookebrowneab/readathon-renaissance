-- Table: teacher_class_assignments
-- Links non-homeroom teachers to classes

CREATE TABLE public.teacher_class_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid NOT NULL REFERENCES public.teachers(id),
  homeroom_teacher_id uuid NOT NULL REFERENCES public.teachers(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.teacher_class_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Teachers can view their assignments"
  ON public.teacher_class_assignments
  FOR SELECT
  USING ((teacher_id IN (
    SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
  )) OR (homeroom_teacher_id IN (
    SELECT teachers.id FROM teachers WHERE teachers.user_id = auth.uid()
  )));

CREATE POLICY "Admins can manage class assignments"
  ON public.teacher_class_assignments
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
