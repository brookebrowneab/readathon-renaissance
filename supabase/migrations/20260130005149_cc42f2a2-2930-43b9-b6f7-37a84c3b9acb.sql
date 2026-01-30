-- Add milestone support to class_pledges table
ALTER TABLE public.class_pledges 
ADD COLUMN IF NOT EXISTS milestone_minutes_target integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_unlocked boolean NOT NULL DEFAULT false;

-- Add comment explaining the pledge types
COMMENT ON COLUMN public.class_pledges.pledge_type IS 'flat = fixed donation, milestone = unlocks when class reaches milestone_minutes_target';
COMMENT ON COLUMN public.class_pledges.milestone_minutes_target IS 'For milestone pledges: the class total minutes required to unlock this pledge';
COMMENT ON COLUMN public.class_pledges.is_unlocked IS 'Whether a milestone pledge has been unlocked (class reached target)';

-- Create a function to get privacy-safe class reading stats
CREATE OR REPLACE FUNCTION public.get_class_reading_stats(p_class_name text)
RETURNS TABLE (
  total_minutes integer,
  total_books bigint,
  student_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(SUM(c.total_minutes), 0)::integer as total_minutes,
    COALESCE((
      SELECT COUNT(DISTINCT rl.book_id) 
      FROM reading_logs rl 
      JOIN children ch ON rl.child_id = ch.id 
      WHERE ch.class_name = p_class_name AND rl.book_id IS NOT NULL
    ), 0) as total_books,
    COUNT(c.id) as student_count
  FROM children c
  WHERE c.class_name = p_class_name;
$$;

-- Create a function to get class milestone pledges status
CREATE OR REPLACE FUNCTION public.get_class_milestone_status(p_class_name text, p_event_id uuid DEFAULT NULL)
RETURNS TABLE (
  total_pledged numeric,
  total_unlocked numeric,
  next_milestone_minutes integer,
  next_milestone_amount numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class_minutes integer;
BEGIN
  -- Get current class reading minutes
  SELECT COALESCE(SUM(total_minutes), 0)::integer INTO v_class_minutes
  FROM children WHERE class_name = p_class_name;

  RETURN QUERY
  SELECT 
    -- Total amount pledged (flat + milestone)
    COALESCE(SUM(cp.amount), 0) as total_pledged,
    -- Total unlocked (flat donations + unlocked milestones)
    COALESCE(SUM(
      CASE 
        WHEN cp.pledge_type = 'flat' THEN cp.amount
        WHEN cp.pledge_type = 'milestone' AND v_class_minutes >= COALESCE(cp.milestone_minutes_target, 0) THEN cp.amount
        ELSE 0
      END
    ), 0) as total_unlocked,
    -- Next milestone to reach
    MIN(CASE 
      WHEN cp.pledge_type = 'milestone' AND v_class_minutes < COALESCE(cp.milestone_minutes_target, 0) 
      THEN cp.milestone_minutes_target 
      ELSE NULL 
    END) as next_milestone_minutes,
    -- Amount unlocked at next milestone
    (
      SELECT SUM(cp2.amount) 
      FROM class_pledges cp2 
      WHERE cp2.class_name = p_class_name 
        AND cp2.pledge_type = 'milestone'
        AND cp2.milestone_minutes_target = (
          SELECT MIN(cp3.milestone_minutes_target) 
          FROM class_pledges cp3 
          WHERE cp3.class_name = p_class_name 
            AND cp3.pledge_type = 'milestone' 
            AND v_class_minutes < COALESCE(cp3.milestone_minutes_target, 0)
            AND (p_event_id IS NULL OR cp3.event_id = p_event_id)
        )
        AND (p_event_id IS NULL OR cp2.event_id = p_event_id)
    ) as next_milestone_amount
  FROM class_pledges cp
  WHERE cp.class_name = p_class_name
    AND (p_event_id IS NULL OR cp.event_id = p_event_id);
END;
$$;