-- Table: archived_pledges
-- Historical pledges after event close

CREATE TABLE public.archived_pledges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_id uuid,
  event_id uuid,
  event_name text,
  student_name text NOT NULL,
  sponsor_name text,
  pledge_type text NOT NULL,
  amount numeric NOT NULL,
  is_paid boolean NOT NULL DEFAULT false,
  archived_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.archived_pledges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view archived pledges"
  ON public.archived_pledges
  FOR SELECT
  USING (true);
