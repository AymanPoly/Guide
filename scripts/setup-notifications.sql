-- Setup script for notifications system
-- Run this in your Supabase SQL editor to add the notifications functionality

-- First, run the notifications schema
\i supabase/notifications-schema.sql

-- Verify the table was created
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- Test the RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'notifications';

-- Test the notification creation function with a real user ID
-- First, let's see if there are any existing users
SELECT id, full_name, role FROM profiles LIMIT 5;

-- Test the notification creation function (only if users exist)
-- Replace 'YOUR_USER_ID_HERE' with an actual user ID from the query above
-- SELECT create_notification(
--   'YOUR_USER_ID_HERE'::uuid,
--   'welcome',
--   'Welcome to Guide!',
--   'Thank you for joining Guide. Start exploring amazing local experiences!',
--   '{"test": true}'::jsonb
-- );

-- Test the mark all read function (only if users exist)
-- SELECT mark_all_notifications_read('YOUR_USER_ID_HERE'::uuid);
