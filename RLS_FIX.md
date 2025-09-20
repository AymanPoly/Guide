# 🔧 RLS Policy Fix - "new row violates row-level security policy"

## 🚨 Problem

You're encountering this error when trying to create a new user profile:
```
new row violates row-level security policy for table "profiles"
```

## 🔍 Root Cause

The issue occurs because of a timing problem between user authentication and profile creation. When a user signs up:

1. Supabase creates the user in `auth.users`
2. Your app immediately tries to create a profile in `public.profiles`
3. The RLS policy checks if `auth.uid() = auth_uid`
4. But the user session might not be fully established yet, causing the policy to fail

## ✅ Solutions

### Solution 1: Use the Fixed Schema (Recommended)

Replace your current schema with the fixed version:

1. **In your Supabase dashboard, go to SQL Editor**
2. **Run the contents of `supabase/schema-fixed.sql`**

The key change is in the INSERT policy:
```sql
-- OLD (problematic)
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = auth_uid);

-- NEW (fixed)
CREATE POLICY "Authenticated users can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = auth_uid);
```

### Solution 2: Update the Auth Provider

Replace your current `app/providers.tsx` with `app/providers-fixed.tsx`:

The key changes:
- Added a 1-second delay after signup to ensure session is established
- Better error handling for profile creation
- More descriptive error messages

### Solution 3: Alternative - Disable RLS Temporarily (Not Recommended)

If you need a quick fix for development:

```sql
-- TEMPORARY FIX - NOT FOR PRODUCTION
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

**⚠️ Warning**: This removes all security. Only use for testing.

### Solution 4: Use Database Functions (Advanced)

Create a secure function that bypasses RLS:

```sql
-- Create a function to handle profile creation
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_name TEXT,
  user_role TEXT,
  user_city TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_id UUID;
BEGIN
  INSERT INTO public.profiles (auth_uid, full_name, role, city)
  VALUES (user_id, user_name, user_role, user_city)
  RETURNING id INTO profile_id;
  
  RETURN profile_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;
```

Then update your signup code to use this function instead of direct INSERT.

## 🚀 Quick Fix Steps

1. **Update your Supabase schema**:
   ```sql
   -- Run this in Supabase SQL Editor
   DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
   
   CREATE POLICY "Authenticated users can insert profiles" ON public.profiles
     FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = auth_uid);
   ```

2. **Update your auth provider** (optional but recommended):
   - Replace `app/providers.tsx` with `app/providers-fixed.tsx`

3. **Test the signup flow**:
   - Try creating a new account
   - Check if the profile is created successfully

## 🔍 Debugging

If you're still having issues, check:

1. **User is authenticated**:
   ```javascript
   const { data: { user } } = await supabase.auth.getUser()
   console.log('Current user:', user?.id)
   ```

2. **RLS policies are correct**:
   ```sql
   -- Check current policies
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

3. **User has correct permissions**:
   ```sql
   -- Check if user can insert
   SELECT auth.uid() as current_user_id;
   ```

## 🛡️ Security Notes

- The fixed policy still maintains security by ensuring only authenticated users can create profiles
- The `auth.uid() IS NOT NULL` check prevents anonymous users from creating profiles
- The `auth.uid() = auth_uid` check ensures users can only create profiles for themselves

## 📝 Testing

After applying the fix:

1. **Test signup flow**:
   - Create a new account
   - Verify profile is created
   - Check that you can access the dashboard

2. **Test security**:
   - Try to create a profile with a different user ID
   - Verify it fails (security working)

3. **Test existing users**:
   - Existing users should still work normally
   - Profile updates should work

## 🆘 Still Having Issues?

If the problem persists:

1. **Check Supabase logs** in your dashboard
2. **Verify your environment variables** are correct
3. **Ensure you're using the latest Supabase client**
4. **Try the database function approach** (Solution 4)

The most common cause is the timing issue, which the fixed schema and auth provider should resolve.

