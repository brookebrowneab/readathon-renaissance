
ALTER TABLE public.teachers
  ADD COLUMN IF NOT EXISTS legacy_teacher_id integer,
  ADD COLUMN IF NOT EXISTS legacy_username text,
  ADD COLUMN IF NOT EXISTS legacy_default_val text;
