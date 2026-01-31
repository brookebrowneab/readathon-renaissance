-- Table: archived_reading_logs
-- Historical reading logs after event close

CREATE TABLE public.archived_reading_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_id uuid,
  event_id uuid,
  event_name text,
  student_name text NOT NULL,
  minutes integer NOT NULL,
  logged_at date NOT NULL,
  book_title text,
  archived_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.archived_reading_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view archived reading logs"
  ON public.archived_reading_logs
  FOR SELECT
  USING (true);
