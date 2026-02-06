-- Database Functions

-- Check if user has a specific role (text-based, no enum)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Check if teacher can view a specific child
CREATE OR REPLACE FUNCTION public.can_teacher_view_child(teacher_user_id uuid, child_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM teachers t
    JOIN children c ON c.id = child_id
    WHERE t.user_id = teacher_user_id
    AND t.is_active = true
    AND (
      -- Staff/librarian with full access can see everyone
      t.has_full_access = true
      -- Homeroom teacher can see their students
      OR c.homeroom_teacher_id = t.id
      -- Partner teacher assigned to specific homerooms
      OR c.homeroom_teacher_id IN (
        SELECT tca.homeroom_teacher_id 
        FROM teacher_class_assignments tca 
        WHERE tca.teacher_id = t.id
      )
      -- Partner teacher assigned to entire grade (no specific homeroom assignments)
      OR (
        t.teacher_type = 'partner' 
        AND t.grade_level IS NOT NULL
        AND c.grade_info = t.grade_level
        AND NOT EXISTS (
          SELECT 1 FROM teacher_class_assignments tca 
          WHERE tca.teacher_id = t.id
        )
      )
    )
  )
$$;

-- Get total minutes for a class
CREATE OR REPLACE FUNCTION public.get_class_total_minutes(p_class_name text)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(SUM(total_minutes), 0)::integer
  FROM children
  WHERE class_name = p_class_name
    AND class_name IS NOT NULL;
$$;

-- Get total minutes for a grade
CREATE OR REPLACE FUNCTION public.get_grade_total_minutes(p_grade_info text)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(SUM(total_minutes), 0)::integer
  FROM children
  WHERE grade_info = p_grade_info
    AND grade_info IS NOT NULL;
$$;

-- Get reading stats for a class
CREATE OR REPLACE FUNCTION public.get_class_reading_stats(p_class_name text)
RETURNS TABLE(total_minutes integer, total_books bigint, student_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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

-- Get favorite books for a class
CREATE OR REPLACE FUNCTION public.get_class_favorite_books(p_class_name text, p_limit integer DEFAULT 5)
RETURNS TABLE(book_title text, read_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    rl.book_title,
    COUNT(*) as read_count
  FROM reading_logs rl
  JOIN children c ON rl.child_id = c.id
  WHERE c.class_name = p_class_name
    AND rl.book_title IS NOT NULL
    AND rl.book_title != ''
  GROUP BY rl.book_title
  ORDER BY read_count DESC, rl.book_title ASC
  LIMIT p_limit;
$$;

-- Get favorite books for a grade
CREATE OR REPLACE FUNCTION public.get_grade_favorite_books(p_grade_info text, p_limit integer DEFAULT 5)
RETURNS TABLE(book_title text, read_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    rl.book_title,
    COUNT(*) as read_count
  FROM reading_logs rl
  JOIN children c ON rl.child_id = c.id
  WHERE c.grade_info = p_grade_info
    AND rl.book_title IS NOT NULL
    AND rl.book_title != ''
  GROUP BY rl.book_title
  ORDER BY read_count DESC, rl.book_title ASC
  LIMIT p_limit;
$$;

-- Get fundraising total for a class
CREATE OR REPLACE FUNCTION public.get_class_fundraising_total(p_class_name text, p_event_id uuid DEFAULT NULL)
RETURNS numeric
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (
      SELECT SUM(
        CASE 
          WHEN p.pledge_type = 'flat' THEN p.amount
          WHEN p.pledge_type = 'per_minute' THEN 
            p.amount * COALESCE(c.total_minutes, 0)
          ELSE 0
        END
      )
      FROM pledges p
      JOIN children c ON p.child_id = c.id
      WHERE c.class_name = p_class_name
        AND (p_event_id IS NULL OR p.event_id = p_event_id)
    ), 0
  ) + COALESCE(
    (
      SELECT SUM(
        CASE 
          WHEN cp.pledge_type = 'flat' THEN cp.amount
          WHEN cp.pledge_type = 'per_minute' THEN 
            LEAST(
              cp.amount * COALESCE(
                (SELECT SUM(total_minutes) FROM children WHERE class_name = p_class_name),
                0
              ),
              COALESCE(cp.max_cap, cp.amount * COALESCE(
                (SELECT SUM(total_minutes) FROM children WHERE class_name = p_class_name),
                0
              ))
            )
          ELSE 0
        END
      )
      FROM class_pledges cp
      WHERE cp.class_name = p_class_name
        AND (p_event_id IS NULL OR cp.event_id = p_event_id)
    ), 0
  );
$$;

-- Get milestone status for a class
CREATE OR REPLACE FUNCTION public.get_class_milestone_status(p_class_name text, p_event_id uuid DEFAULT NULL)
RETURNS TABLE(total_pledged numeric, total_unlocked numeric, next_milestone_minutes integer, next_milestone_amount numeric)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_class_minutes integer;
BEGIN
  SELECT COALESCE(SUM(total_minutes), 0)::integer INTO v_class_minutes
  FROM children WHERE class_name = p_class_name;

  RETURN QUERY
  SELECT 
    COALESCE(SUM(cp.amount), 0) as total_pledged,
    COALESCE(SUM(
      CASE 
        WHEN cp.pledge_type = 'flat' THEN cp.amount
        WHEN cp.pledge_type = 'milestone' AND v_class_minutes >= COALESCE(cp.milestone_minutes_target, 0) THEN cp.amount
        ELSE 0
      END
    ), 0) as total_unlocked,
    MIN(CASE 
      WHEN cp.pledge_type = 'milestone' AND v_class_minutes < COALESCE(cp.milestone_minutes_target, 0) 
      THEN cp.milestone_minutes_target 
      ELSE NULL 
    END) as next_milestone_minutes,
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

-- Get verification threshold for a child
-- Note: log_verification_thresholds is stored as text (JSON string) in the events table
CREATE OR REPLACE FUNCTION public.get_verification_threshold(p_child_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_grade TEXT;
  v_thresholds_text TEXT;
  v_thresholds JSONB;
  v_threshold INTEGER;
  v_enabled BOOLEAN;
BEGIN
  SELECT grade_info INTO v_grade FROM public.children WHERE id = p_child_id;
  SELECT log_verification_thresholds, log_verification_enabled
  INTO v_thresholds_text, v_enabled
  FROM public.events WHERE is_active = true LIMIT 1;
  IF NOT COALESCE(v_enabled, false) THEN RETURN NULL; END IF;
  IF v_thresholds_text IS NULL OR v_thresholds_text = '' OR v_thresholds_text = '{}' THEN RETURN NULL; END IF;
  v_thresholds := v_thresholds_text::jsonb;
  IF v_grade IS NOT NULL AND v_thresholds ? v_grade THEN
    v_threshold := (v_thresholds ->> v_grade)::INTEGER;
  ELSIF v_thresholds ? 'default' THEN
    v_threshold := (v_thresholds ->> 'default')::INTEGER;
  ELSE
    v_threshold := NULL;
  END IF;
  RETURN v_threshold;
END;
$$;

-- Update updated_at column trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update child total minutes trigger function
CREATE OR REPLACE FUNCTION public.update_child_total_minutes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.children
    SET total_minutes = total_minutes + NEW.minutes, updated_at = now()
    WHERE id = NEW.child_id;
    RETURN NEW;
  END IF;
  IF TG_OP = 'DELETE' THEN
    UPDATE public.children
    SET total_minutes = GREATEST(0, total_minutes - OLD.minutes), updated_at = now()
    WHERE id = OLD.child_id;
    RETURN OLD;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    IF OLD.child_id IS DISTINCT FROM NEW.child_id THEN
      IF OLD.child_id IS NOT NULL THEN
        UPDATE public.children
        SET total_minutes = GREATEST(0, total_minutes - OLD.minutes), updated_at = now()
        WHERE id = OLD.child_id;
      END IF;
      IF NEW.child_id IS NOT NULL THEN
        UPDATE public.children
        SET total_minutes = total_minutes + NEW.minutes, updated_at = now()
        WHERE id = NEW.child_id;
      END IF;
    ELSE
      UPDATE public.children
      SET total_minutes = GREATEST(0, total_minutes + (NEW.minutes - OLD.minutes)), updated_at = now()
      WHERE id = NEW.child_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Manage log verification trigger function
CREATE OR REPLACE FUNCTION public.manage_log_verification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_threshold INTEGER;
  v_needs_verification BOOLEAN;
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.log_verification_requests WHERE reading_log_id = OLD.id;
    RETURN OLD;
  END IF;
  IF NEW.child_id IS NULL THEN RETURN NEW; END IF;
  v_threshold := public.get_verification_threshold(NEW.child_id);
  IF v_threshold IS NULL THEN
    IF TG_OP = 'UPDATE' THEN
      DELETE FROM public.log_verification_requests WHERE reading_log_id = NEW.id;
    END IF;
    RETURN NEW;
  END IF;
  v_needs_verification := NEW.minutes > v_threshold;
  IF v_needs_verification THEN
    INSERT INTO public.log_verification_requests (reading_log_id, child_id, minutes, threshold_at_time)
    VALUES (NEW.id, NEW.child_id, NEW.minutes, v_threshold)
    ON CONFLICT (reading_log_id) 
    DO UPDATE SET 
      minutes = EXCLUDED.minutes,
      threshold_at_time = EXCLUDED.threshold_at_time,
      status = CASE 
        WHEN log_verification_requests.status != 'pending' 
          AND log_verification_requests.minutes != EXCLUDED.minutes 
        THEN 'pending' ELSE log_verification_requests.status END,
      reviewed_at = CASE 
        WHEN log_verification_requests.status != 'pending' 
          AND log_verification_requests.minutes != EXCLUDED.minutes 
        THEN NULL ELSE log_verification_requests.reviewed_at END,
      reviewed_by = CASE 
        WHEN log_verification_requests.status != 'pending' 
          AND log_verification_requests.minutes != EXCLUDED.minutes 
        THEN NULL ELSE log_verification_requests.reviewed_by END;
  ELSE
    DELETE FROM public.log_verification_requests WHERE reading_log_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Handle new user trigger function (creates profile on signup)
-- Phase 3 update: now also populates phone from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;

-- Safe display name function (first name + last initial)
CREATE OR REPLACE FUNCTION public.safe_display_name(full_name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN full_name IS NULL OR full_name = '' THEN 'Reader'
    WHEN position(' ' in full_name) > 0 THEN
      split_part(full_name, ' ', 1) || ' ' || left(split_part(full_name, ' ', 2), 1) || '.'
    ELSE full_name
  END;
$$;
