-- Test notification creation directly
-- Run this to test if notifications can be created

-- First, check if you have any users
SELECT 'Available users:' as info;
SELECT id, full_name, role FROM profiles LIMIT 5;

-- Test creating a notification (replace the user_id with a real one from above)
-- Uncomment and modify the line below with a real user ID
-- INSERT INTO notifications (user_id, type, title, message, data)
-- VALUES (
--   'YOUR_USER_ID_HERE'::uuid,
--   'booking_request',
--   'Test Booking Request',
--   'This is a test booking request notification.',
--   '{"test": true}'::jsonb
-- );

-- Check if the notification was created
SELECT 'All notifications:' as info;
SELECT id, user_id, type, title, message, read, created_at
FROM notifications 
ORDER BY created_at DESC;

-- Test the create_notification function
-- SELECT 'Testing create_notification function...' as status;
-- SELECT create_notification(
--   (SELECT id FROM profiles LIMIT 1),
--   'booking_request',
--   'Function Test',
--   'Testing the create_notification function.',
--   '{"function_test": true}'::jsonb
-- );

-- Check RLS policies
SELECT 'RLS policies for notifications:' as info;
SELECT policyname, cmd, permissive, roles, qual
FROM pg_policies 
WHERE tablename = 'notifications';
