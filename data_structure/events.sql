-- Table: events
-- The central configuration for a read-a-thon event

CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  last_log_date date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  school_name text NOT NULL DEFAULT 'Lincoln Elementary',
  goal_minutes integer NOT NULL DEFAULT 500,
  timezone text NOT NULL DEFAULT 'America/New_York',
  accept_checks boolean NOT NULL DEFAULT true,
  accept_cards boolean NOT NULL DEFAULT true,
  payment_address text NOT NULL DEFAULT 'Lincoln Elementary PTA
Read-a-thon Fund
123 School Street
Anytown, ST 12345',
  send_reminders boolean NOT NULL DEFAULT true,
  reminder_days integer NOT NULL DEFAULT 7,
  class_milestone_enabled boolean NOT NULL DEFAULT true,
  class_milestone_goal numeric NOT NULL DEFAULT 1000,
  class_milestone_reward text NOT NULL DEFAULT 'Pizza party for the whole class!',
  teacher_logging_grades text[] NOT NULL DEFAULT '{}',
  logo_url text,
  logo_date_x_offset numeric DEFAULT 0,
  log_verification_enabled boolean NOT NULL DEFAULT false,
  log_verification_thresholds jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view events"
  ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert events"
  ON public.events
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update events"
  ON public.events
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete events"
  ON public.events
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));
