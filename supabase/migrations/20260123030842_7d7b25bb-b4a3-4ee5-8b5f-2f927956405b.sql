-- Create function to update child's total_minutes when reading logs change
CREATE OR REPLACE FUNCTION public.update_child_total_minutes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    UPDATE public.children
    SET total_minutes = total_minutes + NEW.minutes,
        updated_at = now()
    WHERE id = NEW.child_id;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    UPDATE public.children
    SET total_minutes = GREATEST(0, total_minutes - OLD.minutes),
        updated_at = now()
    WHERE id = OLD.child_id;
    RETURN OLD;
  END IF;
  
  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    -- If child_id changed, update both old and new child
    IF OLD.child_id IS DISTINCT FROM NEW.child_id THEN
      -- Subtract from old child
      IF OLD.child_id IS NOT NULL THEN
        UPDATE public.children
        SET total_minutes = GREATEST(0, total_minutes - OLD.minutes),
            updated_at = now()
        WHERE id = OLD.child_id;
      END IF;
      -- Add to new child
      IF NEW.child_id IS NOT NULL THEN
        UPDATE public.children
        SET total_minutes = total_minutes + NEW.minutes,
            updated_at = now()
        WHERE id = NEW.child_id;
      END IF;
    ELSE
      -- Same child, just update the difference
      UPDATE public.children
      SET total_minutes = GREATEST(0, total_minutes + (NEW.minutes - OLD.minutes)),
          updated_at = now()
      WHERE id = NEW.child_id;
    END IF;
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create trigger on reading_logs table
DROP TRIGGER IF EXISTS update_child_minutes_on_log ON public.reading_logs;
CREATE TRIGGER update_child_minutes_on_log
  AFTER INSERT OR UPDATE OR DELETE ON public.reading_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_child_total_minutes();