-- Debug script for feedback RLS policies
-- Run this to check if the policies are working correctly

-- 1. Check if feedback table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'feedback' 
ORDER BY ordinal_position;

-- 2. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'feedback';

-- 3. Check if user is authenticated and has a profile
SELECT 
  auth.uid() as current_user_id,
  p.id as profile_id,
  p.full_name,
  p.role
FROM public.profiles p
WHERE p.auth_uid = auth.uid();

-- 4. Check user's bookings
SELECT 
  b.id as booking_id,
  b.status,
  b.created_at,
  e.title as experience_title
FROM public.bookings b
JOIN public.experiences e ON b.experience_id = e.id
WHERE b.guest_id = (
  SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
)
ORDER BY b.created_at DESC;

-- 5. Test the INSERT policy logic
SELECT 
  'Policy Test' as test_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE auth_uid = auth.uid()
    ) THEN 'User has profile: YES'
    ELSE 'User has profile: NO'
  END as profile_check,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE guest_id = (
        SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
      )
      AND status = 'confirmed'
    ) THEN 'Has confirmed bookings: YES'
    ELSE 'Has confirmed bookings: NO'
  END as booking_check;
