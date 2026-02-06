-- Table: student_auth
-- Secure student login metadata (RLS-protected, separate from children table)
-- Phase 3: Student authentication now uses real auth.users accounts (via student_user_id on children).
-- This table retains metadata (username, login_enabled) and legacy password_hash for unmigrated students.
-- New students get real auth accounts created via the student-set-password edge function.

CREATE TABLE public.student_auth (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id uuid NOT NULL UNIQUE REFERENCES public.children(id),
  username text,
  password_hash text,                       -- Legacy: bcrypt hash for unmigrated students
  login_enabled boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Unique username constraint (partial — only non-null)
CREATE UNIQUE INDEX student_auth_username_unique ON public.student_auth (username) WHERE username IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.student_auth ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Parents can view their children auth"
  ON public.student_auth
  FOR SELECT
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Parents can insert their children auth"
  ON public.student_auth
  FOR INSERT
  WITH CHECK (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Parents can update their children auth"
  ON public.student_auth
  FOR UPDATE
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Parents can delete their children auth"
  ON public.student_auth
  FOR DELETE
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all student auth"
  ON public.student_auth
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
