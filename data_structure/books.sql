-- Table: books
-- Book catalog for reading log enrichment

CREATE TABLE public.books (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  author text,
  isbn text,
  cover_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view books"
  ON public.books
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add books"
  ON public.books
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
