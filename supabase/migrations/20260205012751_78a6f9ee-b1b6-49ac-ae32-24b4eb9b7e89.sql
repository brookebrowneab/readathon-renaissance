-- Create a separate table for student authentication credentials
-- This table is NOT publicly readable, unlike the children table

CREATE TABLE public.student_auth (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id uuid NOT NULL UNIQUE REFERENCES public.children(id) ON DELETE CASCADE,
  username text UNIQUE,
  password_hash text,
  login_enabled boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.student_auth ENABLE ROW LEVEL SECURITY;

-- Only parents can view/manage their children's auth credentials
CREATE POLICY "Parents can view their children auth"
  ON public.student_auth
  FOR SELECT
  USING (child_id IN (
    SELECT id FROM public.children WHERE user_id = auth.uid()
  ));

CREATE POLICY "Parents can insert their children auth"
  ON public.student_auth
  FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM public.children WHERE user_id = auth.uid()
  ));

CREATE POLICY "Parents can update their children auth"
  ON public.student_auth
  FOR UPDATE
  USING (child_id IN (
    SELECT id FROM public.children WHERE user_id = auth.uid()
  ));

CREATE POLICY "Parents can delete their children auth"
  ON public.student_auth
  FOR DELETE
  USING (child_id IN (
    SELECT id FROM public.children WHERE user_id = auth.uid()
  ));

-- Admins can manage all student auth records
CREATE POLICY "Admins can manage all student auth"
  ON public.student_auth
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updating timestamps
CREATE TRIGGER update_student_auth_updated_at
  BEFORE UPDATE ON public.student_auth
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing data from children table to student_auth
INSERT INTO public.student_auth (child_id, username, password_hash, login_enabled)
SELECT id, student_username, student_password_hash, student_login_enabled
FROM public.children
WHERE student_username IS NOT NULL OR student_password_hash IS NOT NULL OR student_login_enabled = true
ON CONFLICT (child_id) DO NOTHING;