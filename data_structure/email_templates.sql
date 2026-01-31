-- Table: email_templates
-- Admin-created email campaigns

CREATE TABLE public.email_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  recipient_filter text NOT NULL,
  status email_template_status NOT NULL DEFAULT 'draft',
  scheduled_for timestamp with time zone,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enum for email template status
-- CREATE TYPE email_template_status AS ENUM ('draft', 'scheduled', 'sent');

-- Enable Row Level Security
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all email templates"
  ON public.email_templates
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert email templates"
  ON public.email_templates
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update email templates"
  ON public.email_templates
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete email templates"
  ON public.email_templates
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));
