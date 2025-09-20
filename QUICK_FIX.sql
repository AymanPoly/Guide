-- QUICK FIX for RLS Policy Error
-- Run this in your Supabase SQL Editor to immediately fix the profile creation issue

-- Drop the existing problematic INSERT policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation for authenticated users" ON public.profiles;

-- Create a more permissive INSERT policy that handles timing issues
CREATE POLICY "Allow profile creation for authenticated users" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Alternative: If you want to be more restrictive but still handle timing issues
-- Uncomment the following and comment out the above if you prefer:
-- CREATE POLICY "Authenticated users can create profiles" ON public.profiles
--   FOR INSERT WITH CHECK (
--     auth.uid() IS NOT NULL AND 
--     auth.uid() = auth_uid AND
--     auth.role() = 'authenticated'
--   );

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow profile creation for authenticated users';