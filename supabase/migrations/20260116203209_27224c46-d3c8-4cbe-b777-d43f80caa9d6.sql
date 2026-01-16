-- Create read-a-thon events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  last_log_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read events (public info)
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

-- Only admins can insert/update/delete events (for now, allow all authenticated users - can restrict later)
CREATE POLICY "Authenticated users can insert events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update events"
  ON public.events FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Create reading_logs table for current data
CREATE TABLE public.reading_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  minutes INTEGER NOT NULL,
  book_title TEXT,
  logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reading_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reading logs"
  ON public.reading_logs FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reading logs"
  ON public.reading_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create pledges table for current data
CREATE TABLE public.pledges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  sponsor_id UUID REFERENCES public.sponsors(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  pledge_type TEXT NOT NULL CHECK (pledge_type IN ('flat', 'per_minute')),
  amount DECIMAL(10,2) NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pledges"
  ON public.pledges FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert pledges"
  ON public.pledges FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Archive tables for old data
CREATE TABLE public.archived_reading_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_id UUID,
  event_id UUID,
  event_name TEXT,
  student_name TEXT NOT NULL,
  minutes INTEGER NOT NULL,
  book_title TEXT,
  logged_at DATE NOT NULL,
  archived_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.archived_reading_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view archived reading logs"
  ON public.archived_reading_logs FOR SELECT
  USING (true);

CREATE TABLE public.archived_pledges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_id UUID,
  event_id UUID,
  event_name TEXT,
  sponsor_name TEXT,
  student_name TEXT NOT NULL,
  pledge_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  archived_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.archived_pledges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view archived pledges"
  ON public.archived_pledges FOR SELECT
  USING (true);

-- Trigger for updated_at on events
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();