
-- Phase 2: Add new columns to profiles table
-- username: unique login identifier (nullable for existing users until set)
-- email: user's email (nullable, for denormalized access without auth.users)
-- first_name, last_name: split name fields for legacy compatibility
-- user_type: 'parent', 'sponsor', 'teacher', 'admin' (text, nullable)
-- is_active: soft delete / deactivation flag
-- legacy_user_id: integer PK from the legacy system

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS legacy_user_id integer;

-- Add unique constraint on username (only when not null)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique ON public.profiles (username) WHERE username IS NOT NULL;

-- Add index on legacy_user_id for import lookups
CREATE INDEX IF NOT EXISTS profiles_legacy_user_id_idx ON public.profiles (legacy_user_id) WHERE legacy_user_id IS NOT NULL;

-- Add index on email for lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email) WHERE email IS NOT NULL;

-- Add index on user_type for filtered queries
CREATE INDEX IF NOT EXISTS profiles_user_type_idx ON public.profiles (user_type) WHERE user_type IS NOT NULL;
