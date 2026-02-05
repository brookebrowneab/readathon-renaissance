-- Remove deprecated credential columns from children table
-- Credentials are now stored securely in the student_auth table

ALTER TABLE public.children 
  DROP COLUMN IF EXISTS student_username,
  DROP COLUMN IF EXISTS student_password_hash,
  DROP COLUMN IF EXISTS student_login_enabled;