-- Quick check for notifications setup
-- Run this to see what's missing

-- Check if notifications table exists
SELECT 'Notifications table exists:' as check_type, 
       EXISTS (
         SELECT FROM information_schema.tables 
         WHERE table_schema = 'public' 
         AND table_name = 'notifications'
       ) as result;

-- Check table structure if it exists
SELECT 'Table columns:' as check_type, 
       string_agg(column_name || ' (' || data_type || ')', ', ') as result
FROM information_schema.columns 
WHERE table_name = 'notifications' 
AND table_schema = 'public';

-- Check RLS status
SELECT 'RLS enabled:' as check_type,
       relrowsecurity as result
FROM pg_class 
WHERE relname = 'notifications' 
AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Check if create_notification function exists
SELECT 'create_notification function exists:' as check_type,
       EXISTS (
         SELECT FROM information_schema.routines 
         WHERE routine_name = 'create_notification' 
         AND routine_schema = 'public'
       ) as result;

-- Check if there are any users
SELECT 'Users in profiles table:' as check_type,
       COUNT(*) as result
FROM profiles;

-- Check if there are any experiences
SELECT 'Experiences in database:' as check_type,
       COUNT(*) as result
FROM experiences;

-- Check recent bookings
SELECT 'Recent bookings:' as check_type,
       COUNT(*) as result
FROM bookings 
WHERE created_at > NOW() - INTERVAL '1 day';

-- Check if any notifications exist
SELECT 'Existing notifications:' as check_type,
       COUNT(*) as result
FROM notifications;
