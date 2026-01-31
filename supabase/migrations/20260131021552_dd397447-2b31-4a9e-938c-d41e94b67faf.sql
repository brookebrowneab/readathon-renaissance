-- Add phone column to profiles table for parents
ALTER TABLE public.profiles
ADD COLUMN phone text;

-- Add phone column to sponsors table
ALTER TABLE public.sponsors
ADD COLUMN phone text;