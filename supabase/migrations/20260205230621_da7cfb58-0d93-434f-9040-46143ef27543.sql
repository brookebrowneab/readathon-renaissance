
-- Phase 1: Replace all Postgres enums with text columns

-- Step 1: Create new has_role with explicit cast
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
      AND role::text = _role
  )
$$;

-- Step 2: Update ALL RLS policies (including missed ones)

-- sponsor_invitations
DROP POLICY IF EXISTS "Admins can manage all invitations" ON public.sponsor_invitations;
CREATE POLICY "Admins can manage all invitations" ON public.sponsor_invitations FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- storage.objects
DROP POLICY IF EXISTS "Admins can upload event logos" ON storage.objects;
CREATE POLICY "Admins can upload event logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-logos' AND has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update event logos" ON storage.objects;
CREATE POLICY "Admins can update event logos" ON storage.objects FOR UPDATE USING (bucket_id = 'event-logos' AND has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete event logos" ON storage.objects;
CREATE POLICY "Admins can delete event logos" ON storage.objects FOR DELETE USING (bucket_id = 'event-logos' AND has_role(auth.uid(), 'admin'));

-- children
DROP POLICY IF EXISTS "Admins can view all children" ON public.children;
CREATE POLICY "Admins can view all children" ON public.children FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- email_templates
DROP POLICY IF EXISTS "Admins can delete email templates" ON public.email_templates;
CREATE POLICY "Admins can delete email templates" ON public.email_templates FOR DELETE USING (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can insert email templates" ON public.email_templates;
CREATE POLICY "Admins can insert email templates" ON public.email_templates FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update email templates" ON public.email_templates;
CREATE POLICY "Admins can update email templates" ON public.email_templates FOR UPDATE USING (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can view all email templates" ON public.email_templates;
CREATE POLICY "Admins can view all email templates" ON public.email_templates FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- log_verification_requests
DROP POLICY IF EXISTS "Admins can manage all verification requests" ON public.log_verification_requests;
CREATE POLICY "Admins can manage all verification requests" ON public.log_verification_requests FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- reading_logs
DROP POLICY IF EXISTS "Admins can view all reading logs" ON public.reading_logs;
CREATE POLICY "Admins can view all reading logs" ON public.reading_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- teachers
DROP POLICY IF EXISTS "Admins can manage all teachers" ON public.teachers;
CREATE POLICY "Admins can manage all teachers" ON public.teachers FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can view all teacher data" ON public.teachers;
CREATE POLICY "Admins can view all teacher data" ON public.teachers FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- teacher_class_assignments
DROP POLICY IF EXISTS "Admins can manage class assignments" ON public.teacher_class_assignments;
CREATE POLICY "Admins can manage class assignments" ON public.teacher_class_assignments FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- user_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- payments
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
CREATE POLICY "Admins can manage all payments" ON public.payments FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- event_winners
DROP POLICY IF EXISTS "Admins can manage event winners" ON public.event_winners;
CREATE POLICY "Admins can manage event winners" ON public.event_winners FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- site_content
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- email_logs
DROP POLICY IF EXISTS "Admins can insert email logs" ON public.email_logs;
CREATE POLICY "Admins can insert email logs" ON public.email_logs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can view all email logs" ON public.email_logs;
CREATE POLICY "Admins can view all email logs" ON public.email_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- student_auth
DROP POLICY IF EXISTS "Admins can manage all student auth" ON public.student_auth;
CREATE POLICY "Admins can manage all student auth" ON public.student_auth FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- events
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- class_pledges
DROP POLICY IF EXISTS "Admins can manage all class pledges" ON public.class_pledges;
CREATE POLICY "Admins can manage all class pledges" ON public.class_pledges FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Step 3: Drop the old has_role(uuid, app_role) overload
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Step 4: Drop view before altering teacher_type
DROP VIEW IF EXISTS public.teachers_public_safe;

-- Step 5: Alter enum columns to text
ALTER TABLE public.user_roles ALTER COLUMN role TYPE text USING role::text;
ALTER TABLE public.teachers ALTER COLUMN teacher_type TYPE text USING teacher_type::text;
ALTER TABLE public.teachers ALTER COLUMN teacher_type SET DEFAULT 'homeroom';
ALTER TABLE public.email_logs ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE public.email_logs ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE public.email_templates ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE public.email_templates ALTER COLUMN status SET DEFAULT 'draft';

-- Step 6: Recreate view
CREATE OR REPLACE VIEW public.teachers_public_safe
WITH (security_invoker=on) AS
  SELECT id, name, grade_level, teacher_type, has_full_access, is_active, user_id, created_at, updated_at
  FROM public.teachers;

-- Step 7: Clean up has_role (remove cast now that column is text)
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

-- Step 8: Change events array/jsonb columns to text
ALTER TABLE public.events ALTER COLUMN teacher_logging_grades TYPE text USING array_to_string(teacher_logging_grades, ',');
ALTER TABLE public.events ALTER COLUMN teacher_logging_grades SET DEFAULT '';
ALTER TABLE public.events ALTER COLUMN log_verification_thresholds TYPE text USING log_verification_thresholds::text;
ALTER TABLE public.events ALTER COLUMN log_verification_thresholds SET DEFAULT '{}';

-- Step 9: Update get_verification_threshold for text column
CREATE OR REPLACE FUNCTION public.get_verification_threshold(p_child_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- Step 10: Drop enum types
DROP TYPE IF EXISTS public.app_role;
DROP TYPE IF EXISTS public.teacher_type;
DROP TYPE IF EXISTS public.email_log_status;
DROP TYPE IF EXISTS public.email_template_status;
