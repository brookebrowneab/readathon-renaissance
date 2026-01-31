-- Table: site_content
-- Admin-editable site content

CREATE TABLE public.site_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL,
  value text NOT NULL DEFAULT '',
  content_type text NOT NULL DEFAULT 'text',
  description text,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view site content"
  ON public.site_content
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site content"
  ON public.site_content
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
