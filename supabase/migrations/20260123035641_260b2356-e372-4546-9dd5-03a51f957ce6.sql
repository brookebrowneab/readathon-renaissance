-- Create books table for reusable book library
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  isbn TEXT UNIQUE,
  title TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add book_id reference to reading_logs
ALTER TABLE public.reading_logs 
ADD COLUMN book_id UUID REFERENCES public.books(id);

-- Create index for ISBN lookups
CREATE INDEX idx_books_isbn ON public.books(isbn) WHERE isbn IS NOT NULL;

-- Enable RLS on books
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Everyone can view books (shared library)
CREATE POLICY "Anyone can view books" 
ON public.books 
FOR SELECT 
USING (true);

-- Authenticated users can add books
CREATE POLICY "Authenticated users can add books" 
ON public.books 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Add comment
COMMENT ON TABLE public.books IS 'Shared library of books with ISBN, author, and cover info';