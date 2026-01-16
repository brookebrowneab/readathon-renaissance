-- Create demo admin user (this will create auth user and profile via trigger)
-- Note: Using Supabase's auth.users directly requires service role, so we'll insert the role after user creation

-- First, we need to use a workaround: create the user via signup simulation
-- The password hash below is for 'password' using bcrypt
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '00000000-0000-0000-0000-000000000000',
  'demo@janneyschool.org',
  crypt('password', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"display_name": "Demo Admin"}',
  false,
  'authenticated',
  'authenticated',
  ''
);

-- Add admin role for this user
INSERT INTO public.user_roles (user_id, role)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin');