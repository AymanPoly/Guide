# Notification Debug Guide

## Issue: Booking notifications not being created

### Step 1: Check if notifications table exists
Run this in Supabase SQL Editor:
```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'notifications'
) as table_exists;
```

### Step 2: Check table structure
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;
```

### Step 3: Check RLS policies
```sql
SELECT policyname, cmd, permissive, roles, qual
FROM pg_policies 
WHERE tablename = 'notifications';
```

### Step 4: Test notification creation manually
```sql
-- First, get a user ID
SELECT id, full_name FROM profiles LIMIT 1;

-- Then create a test notification (replace USER_ID with actual ID)
INSERT INTO notifications (user_id, type, title, message, data)
VALUES (
  'USER_ID_HERE'::uuid,
  'booking_request',
  'Test Notification',
  'This is a test notification.',
  '{"test": true}'::jsonb
);
```

### Step 5: Check browser console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try to send a booking request
4. Look for console logs from the notification creation

### Step 6: If RLS is causing issues
Run the no-RLS version:
```sql
\i supabase/notifications-schema-no-rls.sql
```

### Step 7: Check recent bookings and notifications
```sql
-- Check recent bookings
SELECT id, experience_id, guest_id, status, created_at
FROM bookings 
ORDER BY created_at DESC 
LIMIT 5;

-- Check recent notifications
SELECT id, user_id, type, title, message, read, created_at
FROM notifications 
ORDER BY created_at DESC 
LIMIT 10;
```

### Common Issues and Solutions:

1. **Table doesn't exist**: Run `supabase/notifications-schema.sql`
2. **RLS blocking inserts**: Use `supabase/notifications-schema-no-rls.sql`
3. **Foreign key constraint**: Make sure the user_id exists in profiles table
4. **Function doesn't exist**: Check if `create_notification` function was created
5. **Permission issues**: Check if the user has INSERT permissions

### Debug Scripts Available:
- `scripts/debug-booking-notifications.sql` - Comprehensive debugging
- `scripts/test-notification-creation.sql` - Test notification creation
- `supabase/notifications-schema-no-rls.sql` - Version without RLS for testing
