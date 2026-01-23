-- Add student PIN column to children table for simple student login
ALTER TABLE public.children 
ADD COLUMN student_pin TEXT;

-- Create an index for faster PIN lookups
CREATE INDEX idx_children_student_pin ON public.children(student_pin) WHERE student_pin IS NOT NULL;

-- Add a comment explaining the column
COMMENT ON COLUMN public.children.student_pin IS 'Optional 4-6 digit PIN for student self-service login';