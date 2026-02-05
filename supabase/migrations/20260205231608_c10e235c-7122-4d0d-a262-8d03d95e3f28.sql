
-- Phase 3: Children table expansion for legacy import and richer student data

-- Add first_name and last_name (split from 'name')
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS last_name text;

-- Add student_user_id for linking students to their own auth accounts (future student portal)
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS student_user_id uuid;

-- Add sponsor_id_code: a short shareable code sponsors can use to find a child
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS sponsor_id_code text;

-- Add legacy columns for import mapping
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS legacy_child_id integer;
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS legacy_class_name text;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS children_sponsor_id_code_unique 
  ON public.children (sponsor_id_code) WHERE sponsor_id_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS children_student_user_id_idx 
  ON public.children (student_user_id) WHERE student_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS children_legacy_child_id_idx 
  ON public.children (legacy_child_id) WHERE legacy_child_id IS NOT NULL;
