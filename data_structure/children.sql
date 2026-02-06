-- Table: children
-- Student records, linked to parent accounts
-- Phase 3 added: first_name, last_name, student_user_id, sponsor_id_code, legacy_child_id, legacy_class_name
-- Phase 3 auth migration: student_user_id now links to real auth.users accounts for RLS-protected sessions

CREATE TABLE public.children (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  first_name text,
  last_name text,
  class_name text,
  grade_info text,
  homeroom_teacher_id uuid REFERENCES public.teachers(id),
  goal_minutes integer NOT NULL DEFAULT 300,
  total_minutes integer NOT NULL DEFAULT 0,
  total_verified boolean DEFAULT false,
  verified_at timestamp with time zone,
  verified_by uuid,
  share_public_link boolean NOT NULL DEFAULT true,
  student_user_id uuid,                     -- links to student's own auth account
  sponsor_id_code text,                     -- short shareable code for sponsors
  legacy_child_id integer,                  -- old system PK
  legacy_class_name text,                   -- old class name for audit
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Unique sponsor code constraint (partial — only non-null)
CREATE UNIQUE INDEX children_sponsor_id_code_unique ON public.children (sponsor_id_code) WHERE sponsor_id_code IS NOT NULL;

-- Indexes for lookups
CREATE INDEX children_student_user_id_idx ON public.children (student_user_id) WHERE student_user_id IS NOT NULL;
CREATE INDEX children_legacy_child_id_idx ON public.children (legacy_child_id) WHERE legacy_child_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Parents can view their own children"
  ON public.children
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can insert their own children"
  ON public.children
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Parents can update their own children"
  ON public.children
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can delete their own children"
  ON public.children
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all children"
  ON public.children
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view their students"
  ON public.children
  FOR SELECT
  USING (can_teacher_view_child(auth.uid(), id));

CREATE POLICY "Public can view children with public links"
  ON public.children
  FOR SELECT
  USING (share_public_link = true);

-- Phase 3: Students can view their own record via real auth session
CREATE POLICY "Students can view their own record"
  ON public.children
  FOR SELECT
  USING (auth.uid() = student_user_id);
