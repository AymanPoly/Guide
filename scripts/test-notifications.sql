-- Test script for notifications system
-- Run this after you have created a user account

-- Check if notifications table exists
SELECT 'Checking notifications table...' as status;

-- Show table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 'Checking RLS policies...' as status;
SELECT policyname, cmd, permissive
FROM pg_policies 
WHERE tablename = 'notifications';

-- Get your user ID (replace with your actual user ID)
SELECT 'Your user ID:' as info, id, full_name, role 
FROM profiles 
WHERE auth_uid = auth.uid();

-- Create a test notification (this will work if you're logged in)
SELECT 'Creating test notification...' as status;
SELECT create_notification(
    (SELECT id FROM profiles WHERE auth_uid = auth.uid()),
    'welcome',
    'Test Notification',
    'This is a test notification to verify the system is working!',
    '{"test": true}'::jsonb
) as notification_id;

-- Check your notifications
SELECT 'Your notifications:' as status;
SELECT id, type, title, message, read, created_at
FROM notifications 
WHERE user_id = (SELECT id FROM profiles WHERE auth_uid = auth.uid())
ORDER BY created_at DESC;

-- Test mark all as read
SELECT 'Testing mark all as read...' as status;
SELECT mark_all_notifications_read(
    (SELECT id FROM profiles WHERE auth_uid = auth.uid())
) as updated_count;

-- Check notifications again (should all be read now)
SELECT 'Notifications after marking as read:' as status;
SELECT id, type, title, read, created_at
FROM notifications 
WHERE user_id = (SELECT id FROM profiles WHERE auth_uid = auth.uid())
ORDER BY created_at DESC;
