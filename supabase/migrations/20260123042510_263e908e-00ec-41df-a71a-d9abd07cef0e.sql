-- Remove deprecated student_pin column
ALTER TABLE public.children DROP COLUMN IF EXISTS student_pin;