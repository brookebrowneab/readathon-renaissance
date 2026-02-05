-- Update handle_new_user to also save phone from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;