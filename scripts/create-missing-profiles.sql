-- Create Missing Profiles for Existing Users
-- This script creates profiles for users who are authenticated but don't have profiles

-- First, let's see which users don't have profiles
SELECT 
  au.id as auth_uid,
  au.email,
  au.user_metadata->>'full_name' as full_name,
  au.created_at as auth_created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.auth_uid
WHERE p.auth_uid IS NULL
ORDER BY au.created_at;

-- Create profiles for users who don't have them
-- This uses the create_user_profile function to bypass RLS
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
WHERE p.auth_uid IS NULL;

-- Verify the results
SELECT 
  'After fix - Users with profiles:' as status,
  COUNT(*) as count
FROM auth.users au
INNER JOIN public.profiles p ON au.id = p.auth_uid

UNION ALL

SELECT 
  'After fix - Users without profiles:' as status,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.auth_uid
WHERE p.auth_uid IS NULL;
