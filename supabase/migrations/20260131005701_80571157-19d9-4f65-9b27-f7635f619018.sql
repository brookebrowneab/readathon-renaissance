-- Add log_verification_thresholds column to events table
ALTER TABLE public.events 
ADD COLUMN log_verification_thresholds JSONB NOT NULL DEFAULT '{}';

-- Add verification_enabled flag to events
ALTER TABLE public.events 
ADD COLUMN log_verification_enabled BOOLEAN NOT NULL DEFAULT false;

-- Create log_verification_requests table
CREATE TABLE public.log_verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_log_id UUID NOT NULL REFERENCES public.reading_logs(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  minutes INTEGER NOT NULL,
  threshold_at_time INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  UNIQUE(reading_log_id)
);

-- Enable RLS on log_verification_requests
ALTER TABLE public.log_verification_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for log_verification_requests
-- Parents can view requests for their children
CREATE POLICY "Parents can view verification requests for their children"
ON public.log_verification_requests
FOR SELECT
USING (child_id IN (SELECT id FROM public.children WHERE user_id = auth.uid()));

-- Parents can update (approve/dismiss) requests for their children
CREATE POLICY "Parents can update verification requests for their children"
ON public.log_verification_requests
FOR UPDATE
USING (child_id IN (SELECT id FROM public.children WHERE user_id = auth.uid()));

-- Admins have full access
CREATE POLICY "Admins can manage all verification requests"
ON public.log_verification_requests
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create function to get verification threshold for a child's grade
CREATE OR REPLACE FUNCTION public.get_verification_threshold(p_child_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_grade TEXT;
  v_thresholds JSONB;
  v_threshold INTEGER;
  v_enabled BOOLEAN;
BEGIN
  -- Get the child's grade
  SELECT grade_info INTO v_grade FROM public.children WHERE id = p_child_id;
  
  -- Get active event's thresholds and enabled status
  SELECT log_verification_thresholds, log_verification_enabled 
  INTO v_thresholds, v_enabled
  FROM public.events 
  WHERE is_active = true 
  LIMIT 1;
  
  -- If verification is disabled, return NULL (no threshold)
  IF NOT COALESCE(v_enabled, false) THEN
    RETURN NULL;
  END IF;
  
  -- If no thresholds configured, return NULL
  IF v_thresholds IS NULL OR v_thresholds = '{}'::jsonb THEN
    RETURN NULL;
  END IF;
  
  -- Try to get grade-specific threshold
  IF v_grade IS NOT NULL AND v_thresholds ? v_grade THEN
    v_threshold := (v_thresholds ->> v_grade)::INTEGER;
  -- Fall back to default threshold
  ELSIF v_thresholds ? 'default' THEN
    v_threshold := (v_thresholds ->> 'default')::INTEGER;
  ELSE
    v_threshold := NULL;
  END IF;
  
  RETURN v_threshold;
END;
$$;

-- Create trigger function to manage verification requests
CREATE OR REPLACE FUNCTION public.manage_log_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_threshold INTEGER;
  v_needs_verification BOOLEAN;
BEGIN
  -- Handle DELETE: remove any verification request
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.log_verification_requests WHERE reading_log_id = OLD.id;
    RETURN OLD;
  END IF;
  
  -- For INSERT or UPDATE, check if verification is needed
  IF NEW.child_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get the threshold for this child's grade
  v_threshold := public.get_verification_threshold(NEW.child_id);
  
  -- If no threshold (verification disabled or not configured), remove any existing request
  IF v_threshold IS NULL THEN
    IF TG_OP = 'UPDATE' THEN
      DELETE FROM public.log_verification_requests WHERE reading_log_id = NEW.id;
    END IF;
    RETURN NEW;
  END IF;
  
  -- Check if minutes exceed threshold
  v_needs_verification := NEW.minutes > v_threshold;
  
  IF v_needs_verification THEN
    -- Create or update verification request
    INSERT INTO public.log_verification_requests (reading_log_id, child_id, minutes, threshold_at_time)
    VALUES (NEW.id, NEW.child_id, NEW.minutes, v_threshold)
    ON CONFLICT (reading_log_id) 
    DO UPDATE SET 
      minutes = EXCLUDED.minutes,
      threshold_at_time = EXCLUDED.threshold_at_time,
      -- Reset status to pending if minutes changed and was approved/dismissed
      status = CASE 
        WHEN log_verification_requests.status != 'pending' 
          AND log_verification_requests.minutes != EXCLUDED.minutes 
        THEN 'pending' 
        ELSE log_verification_requests.status 
      END,
      reviewed_at = CASE 
        WHEN log_verification_requests.status != 'pending' 
          AND log_verification_requests.minutes != EXCLUDED.minutes 
        THEN NULL 
        ELSE log_verification_requests.reviewed_at 
      END,
      reviewed_by = CASE 
        WHEN log_verification_requests.status != 'pending' 
          AND log_verification_requests.minutes != EXCLUDED.minutes 
        THEN NULL 
        ELSE log_verification_requests.reviewed_by 
      END;
  ELSE
    -- Minutes below threshold, remove any existing request
    DELETE FROM public.log_verification_requests WHERE reading_log_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on reading_logs
CREATE TRIGGER manage_log_verification_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.reading_logs
FOR EACH ROW
EXECUTE FUNCTION public.manage_log_verification();