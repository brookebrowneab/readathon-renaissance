-- Table: sponsors
-- Sponsor profile records

CREATE TABLE public.sponsors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  first_name text,
  last_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Sponsors can view their own profile"
  ON public.sponsors
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Sponsors can insert their own profile"
  ON public.sponsors
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sponsors can update their own profile"
  ON public.sponsors
  FOR UPDATE
  USING (auth.uid() = user_id);
