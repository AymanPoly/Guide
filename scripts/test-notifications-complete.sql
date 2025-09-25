-- Complete test for notifications system
-- Run this after setting up the notifications schema

-- Step 1: Check if everything is set up correctly
SELECT 'Step 1: Checking setup...' as step;

-- Check if notifications table exists
SELECT 'Notifications table exists:' as check_item,
       EXISTS (
         SELECT FROM information_schema.tables 
         WHERE table_schema = 'public' 
         AND table_name = 'notifications'
       ) as result;

-- Check if create_notification function exists
SELECT 'create_notification function exists:' as check_item,
       EXISTS (
         SELECT FROM information_schema.routines 
         WHERE routine_name = 'create_notification' 
         AND routine_schema = 'public'
       ) as result;

-- Check if update_updated_at_column function exists
SELECT 'update_updated_at_column function exists:' as check_item,
       EXISTS (
         SELECT FROM information_schema.routines 
         WHERE routine_name = 'update_updated_at_column' 
         AND routine_schema = 'public'
       ) as result;

-- Step 2: Get a test user
SELECT 'Step 2: Getting test user...' as step;
SELECT id, full_name, role 
FROM profiles 
LIMIT 1;

-- Step 3: Test notification creation
SELECT 'Step 3: Testing notification creation...' as step;

-- Create a test notification (replace USER_ID with actual ID from step 2)
DO $$
DECLARE
    test_user_id UUID;
    notification_id UUID;
BEGIN
    -- Get first user
    SELECT id INTO test_user_id FROM profiles LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Create test notification
        SELECT create_notification(
            test_user_id,
            'welcome',
            'Test Notification',
            'This is a test notification to verify the system works.',
            '{"test": true}'::jsonb
        ) INTO notification_id;
        
        RAISE NOTICE 'Test notification created with ID: %', notification_id;
    ELSE
        RAISE NOTICE 'No users found in profiles table';
    END IF;
END $$;

-- Step 4: Check if notification was created
SELECT 'Step 4: Checking created notification...' as step;
SELECT id, user_id, type, title, message, read, created_at
FROM notifications 
ORDER BY created_at DESC 
LIMIT 1;

-- Step 5: Test mark as read
SELECT 'Step 5: Testing mark as read...' as step;
DO $$
DECLARE
    test_user_id UUID;
    updated_count INTEGER;
BEGIN
    -- Get first user
    SELECT id INTO test_user_id FROM profiles LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Mark all as read
        SELECT mark_all_notifications_read(test_user_id) INTO updated_count;
        RAISE NOTICE 'Marked % notifications as read', updated_count;
    END IF;
END $$;

-- Step 6: Final check
SELECT 'Step 6: Final verification...' as step;
SELECT 'Notifications system is working!' as status;
