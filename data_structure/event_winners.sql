-- Table: event_winners
-- Competition results storage

CREATE TABLE public.event_winners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES public.events(id),
  child_id uuid REFERENCES public.children(id),
  class_name text,
  grade_info text NOT NULL,
  winner_type text NOT NULL,
  total_minutes integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.event_winners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view event winners"
  ON public.event_winners
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage event winners"
  ON public.event_winners
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
