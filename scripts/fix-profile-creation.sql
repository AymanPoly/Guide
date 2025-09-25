-- Fix Profile Creation Issue
-- This script ensures that the create_user_profile function exists and works properly

-- Create a secure function to handle profile creation
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_name TEXT,
  user_role TEXT,
  user_city TEXT,
  user_bio TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Insert the profile (bypasses RLS due to SECURITY DEFINER)
  INSERT INTO public.profiles (auth_uid, full_name, role, city, bio)
  VALUES (user_id, user_name, user_role, user_city, user_bio)
  RETURNING id INTO profile_id;
  
  RETURN profile_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;

-- Also grant to anon users (for signup process)
GRANT EXECUTE ON FUNCTION public.create_user_profile TO anon;

-- Create a simpler RLS policy for profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation for authenticated users" ON public.profiles;

-- Create new policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = auth_uid);

-- No INSERT policy needed since we use the function
-- The function bypasses RLS with SECURITY DEFINER

-- Test the function with a dummy call (commented out)
-- SELECT public.create_user_profile(
--   '00000000-0000-0000-0000-000000000000'::UUID,
--   'Test User',
--   'guest',
--   'Test City',
--   'Test bio'
-- );
