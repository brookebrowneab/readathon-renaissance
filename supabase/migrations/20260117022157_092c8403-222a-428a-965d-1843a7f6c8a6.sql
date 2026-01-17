-- Create enum for email template status
CREATE TYPE public.email_template_status AS ENUM ('draft', 'scheduled', 'sent');

-- Create enum for email log status
CREATE TYPE public.email_log_status AS ENUM ('pending', 'sent', 'failed');

-- Create email_templates table
CREATE TABLE public.email_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    recipient_filter text NOT NULL,
    status email_template_status NOT NULL DEFAULT 'draft',
    scheduled_for timestamptz,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create email_logs table
CREATE TABLE public.email_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid REFERENCES public.email_templates(id) ON DELETE SET NULL,
    recipient_email text NOT NULL,
    recipient_name text,
    recipient_type text,
    subject text NOT NULL,
    body text NOT NULL,
    status email_log_status NOT NULL DEFAULT 'pending',
    sent_at timestamptz,
    error_message text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_templates (admin only)
CREATE POLICY "Admins can view all email templates"
ON public.email_templates
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert email templates"
ON public.email_templates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update email templates"
ON public.email_templates
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete email templates"
ON public.email_templates
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- RLS policies for email_logs (admin only)
CREATE POLICY "Admins can view all email logs"
ON public.email_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert email logs"
ON public.email_logs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at on email_templates
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();