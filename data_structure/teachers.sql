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
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enum for teacher type
-- CREATE TYPE teacher_type AS ENUM ('homeroom', 'partner', 'specials', 'staff');

-- Enable Row Level Security
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active teachers"
  ON public.teachers
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all teachers"
  ON public.teachers
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
