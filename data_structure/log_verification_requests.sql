-- Table: log_verification_requests
-- Reading log verification tracking

CREATE TABLE public.log_verification_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reading_log_id uuid NOT NULL UNIQUE REFERENCES public.reading_logs(id),
  child_id uuid NOT NULL REFERENCES public.children(id),
  minutes integer NOT NULL,
  threshold_at_time integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.log_verification_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Parents can view verification requests for their children"
  ON public.log_verification_requests
  FOR SELECT
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Parents can update verification requests for their children"
  ON public.log_verification_requests
  FOR UPDATE
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all verification requests"
  ON public.log_verification_requests
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
