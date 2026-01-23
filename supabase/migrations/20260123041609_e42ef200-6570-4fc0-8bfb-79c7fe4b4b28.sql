-- Add student login fields to children table
ALTER TABLE public.children 
ADD COLUMN student_username text UNIQUE,
ADD COLUMN student_password_hash text,
ADD COLUMN student_login_enabled boolean NOT NULL DEFAULT false;

-- Create index on username for fast lookups
CREATE INDEX idx_children_student_username ON public.children(student_username) WHERE student_username IS NOT NULL;

-- Drop the old PIN index since we're moving to username/password
DROP INDEX IF EXISTS idx_children_student_pin;

-- Note: student_pin column can be kept for backwards compatibility or removed later