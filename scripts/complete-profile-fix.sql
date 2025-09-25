-- Complete Profile Creation Fix
-- This script fixes the profile creation issue for both new and existing users

-- Step 1: Ensure the create_user_profile function exists and is properly configured
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

-- Step 2: Grant proper permissions
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile TO anon;

-- Step 3: Fix RLS policies
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

-- Step 4: Create profiles for existing users who don't have them
INSERT INTO public.profiles (auth_uid, full_name, role, city, bio)
SELECT 
  au.id,
  COALESCE(
    au.user_metadata->>'full_name',
    au.user_metadata->>'name',
    SPLIT_PART(au.email, '@', 1)
  ) as full_name,
  'guest' as role,
  'Unknown' as city,
  NULL as bio
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.auth_uid
WHERE p.auth_uid IS NULL
ON CONFLICT (auth_uid) DO NOTHING;

-- Step 5: Create a trigger to automatically create profiles for new users
-- This is optional but recommended for future users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile for new user
  PERFORM public.create_user_profile(
    NEW.id,
    COALESCE(
      NEW.user_metadata->>'full_name',
      NEW.user_metadata->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    'guest',
    'Unknown',
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger (uncomment if you want automatic profile creation)
-- Note: This requires ownership of the auth.users table
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Verification queries
SELECT 
  'Total authenticated users:' as metric,
  COUNT(*) as count
FROM auth.users

UNION ALL

SELECT 
  'Users with profiles:' as metric,
  COUNT(*) as count
FROM auth.users au
INNER JOIN public.profiles p ON au.id = p.auth_uid

UNION ALL

SELECT 
  'Users without profiles:' as metric,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.auth_uid
WHERE p.auth_uid IS NULL;
