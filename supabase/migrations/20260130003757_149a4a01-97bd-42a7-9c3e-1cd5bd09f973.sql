-- Add class milestone settings columns to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS class_milestone_goal numeric NOT NULL DEFAULT 1000,
ADD COLUMN IF NOT EXISTS class_milestone_reward text NOT NULL DEFAULT 'Pizza party for the whole class!',
ADD COLUMN IF NOT EXISTS class_milestone_enabled boolean NOT NULL DEFAULT true;