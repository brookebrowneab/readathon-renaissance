-- Table: children
-- Student records, linked to parent accounts

CREATE TABLE public.children (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  class_name text,
  grade_info text,
  homeroom_teacher_id uuid REFERENCES public.teachers(id),
  goal_minutes integer NOT NULL DEFAULT 300,
  total_minutes integer NOT NULL DEFAULT 0,
  total_verified boolean DEFAULT false,
  verified_at timestamp with time zone,
  verified_by uuid,
  share_public_link boolean NOT NULL DEFAULT true,
  student_login_enabled boolean NOT NULL DEFAULT false,
  student_username text,
  student_password_hash text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

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
