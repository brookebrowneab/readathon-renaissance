-- Table: teachers
-- Teacher records with class assignments

CREATE TABLE public.teachers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  name text NOT NULL,
  email text,
  grade_level text,
  teacher_type teacher_type NOT NULL DEFAULT 'homeroom',
  has_full_access boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  legacy_teacher_id integer,
  legacy_username text,
  legacy_default_val text
);

-- Enum for teacher type
-- CREATE TYPE teacher_type AS ENUM ('homeroom', 'partner', 'specials', 'staff');

-- Enable Row Level Security
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admins can see all teacher data including email
CREATE POLICY "Admins can view all teacher data"
  ON public.teachers
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Teachers can view their own record with email  
CREATE POLICY "Teachers can view their own record"
  ON public.teachers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Authenticated users can view basic teacher info (email still visible but restricted to auth'd users)
CREATE POLICY "Authenticated users can view active teachers basic info"
  ON public.teachers
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage all teachers"
  ON public.teachers
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Public-safe view that excludes email
CREATE OR REPLACE VIEW public.teachers_public_safe
WITH (security_invoker=on) AS
  SELECT id, name, grade_level, teacher_type, has_full_access, is_active, user_id, created_at, updated_at
  FROM public.teachers;
