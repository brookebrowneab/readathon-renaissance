-- Create sponsors table for authenticated sponsors
CREATE TABLE public.sponsors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Sponsors can view their own profile
CREATE POLICY "Sponsors can view their own profile" 
ON public.sponsors 
FOR SELECT 
USING (auth.uid() = user_id);

-- Sponsors can insert their own profile
CREATE POLICY "Sponsors can insert their own profile" 
ON public.sponsors 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Sponsors can update their own profile
CREATE POLICY "Sponsors can update their own profile" 
ON public.sponsors 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sponsors_updated_at
BEFORE UPDATE ON public.sponsors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();