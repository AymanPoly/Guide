-- Debug script for booking notifications
-- Run this to check if notifications are being created properly

-- Check if notifications table exists
SELECT 'Checking notifications table...' as status;
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'notifications'
) as table_exists;

-- Check table structure
SELECT 'Table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 'RLS policies:' as info;
SELECT policyname, cmd, permissive, roles, qual
FROM pg_policies 
WHERE tablename = 'notifications';

-- Check if create_notification function exists
SELECT 'Checking create_notification function...' as status;
SELECT routine_name, routine_type, data_type
FROM information_schema.routines 
WHERE routine_name = 'create_notification' 
AND routine_schema = 'public';

-- Check recent bookings
SELECT 'Recent bookings:' as info;
SELECT id, experience_id, guest_id, status, created_at
FROM bookings 
ORDER BY created_at DESC 
LIMIT 5;

-- Check recent notifications
SELECT 'Recent notifications:' as info;
SELECT id, user_id, type, title, message, read, created_at
FROM notifications 
ORDER BY created_at DESC 
LIMIT 10;

-- Check if there are any booking_request notifications
SELECT 'Booking request notifications:' as info;
SELECT id, user_id, type, title, message, data, created_at
FROM notifications 
WHERE type = 'booking_request'
ORDER BY created_at DESC;

-- Test notification creation manually (replace with actual user ID)
-- SELECT 'Testing notification creation...' as status;
-- SELECT create_notification(
--   (SELECT host_id FROM experiences LIMIT 1),
--   'booking_request',
--   'Test Booking Request',
--   'This is a test booking request notification.',
--   '{"test": true}'::jsonb
-- );

-- Check for any errors in the logs (if accessible)
SELECT 'Setup complete. Check the results above for any issues.' as status;
