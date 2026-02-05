-- Table: profiles
-- Extended user profile information
-- Phase 2 added: username, email, first_name, last_name, user_type, is_active, legacy_user_id

CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  display_name text,
  avatar_url text,
  phone text,
  username text,
  email text,
  first_name text,
  last_name text,
  user_type text,                          -- 'parent', 'sponsor', 'teacher', 'admin'
  is_active boolean NOT NULL DEFAULT true,
  legacy_user_id integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Unique username constraint (partial — only non-null)
CREATE UNIQUE INDEX profiles_username_unique ON public.profiles (username) WHERE username IS NOT NULL;

-- Indexes for common lookups
CREATE INDEX profiles_legacy_user_id_idx ON public.profiles (legacy_user_id) WHERE legacy_user_id IS NOT NULL;
CREATE INDEX profiles_email_idx ON public.profiles (email) WHERE email IS NOT NULL;
CREATE INDEX profiles_user_type_idx ON public.profiles (user_type) WHERE user_type IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));
