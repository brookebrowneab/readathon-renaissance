-- Table: reading_logs
-- Individual reading session records
-- Phase 3: Added student RLS policies for CRUD via real auth sessions

CREATE TABLE public.reading_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id uuid REFERENCES public.children(id),
  event_id uuid REFERENCES public.events(id),
  student_name text NOT NULL,
  minutes integer NOT NULL,
  logged_at date NOT NULL DEFAULT CURRENT_DATE,
  book_id uuid REFERENCES public.books(id),
  book_title text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reading_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Parents can view their children's reading logs"
  ON public.reading_logs
  FOR SELECT
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Parents can insert reading logs for their children"
  ON public.reading_logs
  FOR INSERT
  WITH CHECK (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Parents can update their children's reading logs"
  ON public.reading_logs
  FOR UPDATE
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Parents can delete their children's reading logs"
  ON public.reading_logs
  FOR DELETE
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all reading logs"
  ON public.reading_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view their students reading logs"
  ON public.reading_logs
  FOR SELECT
  USING (can_teacher_view_child(auth.uid(), child_id));

CREATE POLICY "Public can view reading logs for public children"
  ON public.reading_logs
  FOR SELECT
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.share_public_link = true
  ));

-- Phase 3: Students can CRUD their own reading logs via real auth sessions
CREATE POLICY "Students can view their own reading logs"
  ON public.reading_logs
  FOR SELECT
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.student_user_id = auth.uid()
  ));

CREATE POLICY "Students can insert their own reading logs"
  ON public.reading_logs
  FOR INSERT
  WITH CHECK (child_id IN (
    SELECT children.id FROM children WHERE children.student_user_id = auth.uid()
  ));

CREATE POLICY "Students can update their own reading logs"
  ON public.reading_logs
  FOR UPDATE
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.student_user_id = auth.uid()
  ));

CREATE POLICY "Students can delete their own reading logs"
  ON public.reading_logs
  FOR DELETE
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.student_user_id = auth.uid()
  ));
