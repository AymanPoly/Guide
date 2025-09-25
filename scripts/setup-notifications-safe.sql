-- Safe setup script for notifications system
-- This script safely sets up notifications without foreign key violations

-- First, run the notifications schema
\i supabase/notifications-schema.sql

-- Verify the table was created
SELECT 'Notifications table created successfully' as status;

-- Check table structure
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- Verify RLS policies
SELECT 'RLS policies created:' as status;
SELECT policyname, cmd, permissive
FROM pg_policies 
WHERE tablename = 'notifications';

-- Check if there are any existing users
SELECT 'Existing users in profiles table:' as status;
SELECT COUNT(*) as user_count FROM profiles;

-- Show sample users (if any exist)
SELECT id, full_name, role, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 3;

-- Test notification creation only if users exist
DO $$
DECLARE
    user_count INTEGER;
    sample_user_id UUID;
BEGIN
    -- Check if there are any users
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    IF user_count > 0 THEN
        -- Get a sample user ID
        SELECT id INTO sample_user_id FROM profiles LIMIT 1;
        
        -- Create a test notification
        PERFORM create_notification(
            sample_user_id,
            'welcome',
            'Welcome to Guide!',
            'Thank you for joining Guide. Start exploring amazing local experiences!',
            '{"test": true}'::jsonb
        );
        
        RAISE NOTICE 'Test notification created successfully for user: %', sample_user_id;
        
        -- Test mark all read function
        PERFORM mark_all_notifications_read(sample_user_id);
        RAISE NOTICE 'Mark all read function tested successfully';
        
    ELSE
        RAISE NOTICE 'No users found in profiles table. Skipping notification tests.';
        RAISE NOTICE 'Create a user account first, then notifications will work automatically.';
    END IF;
END $$;

-- Show final status
SELECT 'Notifications system setup completed!' as status;
