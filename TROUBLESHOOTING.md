# 🚨 RLS Policy Troubleshooting Guide

## Current Issue
```
Failed to create profile: new row violates row-level security policy for table "profiles"
```

## 🔧 Solution Options (Try in Order)

### Option 1: Quick Fix - Disable RLS Temporarily (Development Only)

**⚠️ WARNING: Only for development/testing. Never use in production!**

```sql
-- Run this in Supabase SQL Editor
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

**Test**: Try creating a new account. If it works, the issue is definitely with RLS policies.

**After testing, re-enable RLS**:
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Option 2: Use the Ultimate Fix (Recommended)

Run this in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase/schema-ultimate-fix.sql
```

This creates a more permissive policy that should work.

### Option 3: Function-Based Approach (Most Reliable)

1. **Run the function setup**:
   ```sql
   -- Copy and paste the contents of supabase/function-based-fix.sql
   ```

2. **Update your auth provider**:
   - Replace `app/providers.tsx` with `app/providers-function-based.tsx`

This approach bypasses RLS entirely for profile creation using a secure database function.

### Option 4: Manual Profile Creation (Debugging)

If all else fails, you can manually create profiles in the Supabase dashboard:

1. Go to Table Editor → profiles
2. Click "Insert" → "Insert row"
3. Fill in the details manually
4. This helps verify the table structure is correct

## 🔍 Debugging Steps

### Step 1: Check Current User Authentication

Add this to your signup function to debug:

```javascript
const signUp = async (email, password, fullName, role, city) => {
  // Sign up user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error

  if (data.user) {
    // Debug: Check if user is authenticated
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    console.log('Current user after signup:', currentUser?.id)
    console.log('Data user ID:', data.user.id)
    
    // Debug: Check auth.uid() in database
    const { data: authCheck } = await supabase.rpc('auth.uid')
    console.log('Auth UID from database:', authCheck)
    
    // Try to create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        auth_uid: data.user.id,
        full_name: fullName,
        role,
        city,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      throw new Error(`Failed to create profile: ${profileError.message}`)
    }
  }
}
```

### Step 2: Check RLS Policies

Run this query to see current policies:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
```

### Step 3: Test Policy Manually

```sql
-- Test if the policy works
SELECT auth.uid() as current_user_id;

-- Try to insert a test profile (replace with actual user ID)
INSERT INTO public.profiles (auth_uid, full_name, role, city)
VALUES ('your-user-id-here', 'Test User', 'guest', 'Test City');
```

### Step 4: Check User Session

```javascript
// Add this to your app to check session status
useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Current session:', session)
    console.log('User ID:', session?.user?.id)
  }
  
  checkSession()
}, [])
```

## 🚀 Quick Resolution Steps

1. **Try Option 1 first** (disable RLS temporarily) to confirm the issue
2. **If that works**, try Option 2 (ultimate fix)
3. **If still failing**, use Option 3 (function-based approach)
4. **Test thoroughly** with a new account creation

## 📋 Common Causes

1. **Timing Issue**: User session not established when profile creation happens
2. **Policy Too Restrictive**: RLS policy doesn't allow the operation
3. **Authentication State**: User not properly authenticated
4. **Database Permissions**: User doesn't have proper permissions

## ✅ Success Indicators

You'll know it's working when:
- New account creation completes without errors
- Profile appears in the profiles table
- User can access the dashboard
- No RLS policy errors in console

## 🆘 Still Stuck?

If none of these solutions work:

1. **Check Supabase logs** in your dashboard
2. **Verify your Supabase project settings**
3. **Ensure you're using the correct API keys**
4. **Try creating a fresh Supabase project** and running the schema

The function-based approach (Option 3) is the most reliable and should work in all cases.

