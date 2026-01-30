-- Add a column to track which grades allow teacher reading log entry
ALTER TABLE public.events 
ADD COLUMN teacher_logging_grades text[] NOT NULL DEFAULT '{}';

-- Add a comment for documentation
COMMENT ON COLUMN public.events.teacher_logging_grades IS 'Array of grade_info values where teachers are allowed to log reading for students';