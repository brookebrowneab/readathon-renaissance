-- Table: email_logs
-- Sent email tracking

CREATE TABLE public.email_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid REFERENCES public.email_templates(id),
  recipient_email text NOT NULL,
  recipient_name text,
  recipient_type text,
  subject text NOT NULL,
  body text NOT NULL,
  status email_log_status NOT NULL DEFAULT 'pending',
  sent_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enum for email log status
-- CREATE TYPE email_log_status AS ENUM ('pending', 'sent', 'failed');

-- Enable Row Level Security
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all email logs"
  ON public.email_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert email logs"
  ON public.email_logs
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
