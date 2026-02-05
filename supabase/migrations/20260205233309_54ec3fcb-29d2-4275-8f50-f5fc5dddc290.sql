
-- Add RLS policies for students (who have real auth accounts via student_user_id)

-- Students can view their own child record
CREATE POLICY "Students can view their own record"
  ON public.children
  FOR SELECT
  USING (auth.uid() = student_user_id);

-- Students can view their own reading logs
CREATE POLICY "Students can view their own reading logs"
  ON public.reading_logs
  FOR SELECT
  USING (child_id IN (
    SELECT id FROM children WHERE student_user_id = auth.uid()
  ));

-- Students can insert reading logs for themselves
CREATE POLICY "Students can insert their own reading logs"
  ON public.reading_logs
  FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM children WHERE student_user_id = auth.uid()
  ));

-- Students can update their own reading logs
CREATE POLICY "Students can update their own reading logs"
  ON public.reading_logs
  FOR UPDATE
  USING (child_id IN (
    SELECT id FROM children WHERE student_user_id = auth.uid()
  ));

-- Students can delete their own reading logs
CREATE POLICY "Students can delete their own reading logs"
  ON public.reading_logs
  FOR DELETE
  USING (child_id IN (
    SELECT id FROM children WHERE student_user_id = auth.uid()
  ));

-- Students can view books (for book selector)
CREATE POLICY "Students can view books"
  ON public.books
  FOR SELECT
  USING (true);
