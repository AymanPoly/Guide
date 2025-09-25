# 🔧 Profile Creation Fix - Complete Solution

## 🐛 **The Problem**
Users are successfully authenticating with Google OAuth but their profiles are not being created in the `profiles` table. This happens because:

1. **RLS (Row Level Security) policies** are blocking direct INSERT operations
2. **Profile creation logic** was using direct INSERT instead of the secure database function
3. **Existing authenticated users** don't have profiles created

## ✅ **The Solution**

### **Step 1: Database Function Setup**
Run the SQL script to create the secure profile creation function:

```sql
-- Apply this to your Supabase database
-- File: scripts/complete-profile-fix.sql
```

### **Step 2: Code Changes Made**
Updated `hooks/useOptimizedAuth.ts` to use the database function:

```typescript
// Before (❌ Direct INSERT - blocked by RLS)
const { error } = await supabase
  .from('profiles')
  .insert({
    auth_uid: user.id,
    full_name: user.user_metadata?.full_name || 'User',
    role: 'guest',
    city: 'Unknown',
    bio: null,
    verified: false
  })

// After (✅ Database function - bypasses RLS)
const { data: profileId, error } = await supabase.rpc('create_user_profile', {
  user_id: user.id,
  user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
  user_role: 'guest',
  user_city: 'Unknown',
  user_bio: null
})
```

### **Step 3: Fix Existing Users**
Run the script to create profiles for existing authenticated users:

```sql
-- This creates profiles for users who are authenticated but don't have profiles
-- File: scripts/create-missing-profiles.sql
```

## 🚀 **How to Apply the Fix**

### **Option 1: Quick Fix (Recommended)**
1. **Apply the database function:**
   ```bash
   # Run this SQL in your Supabase SQL Editor
   cat scripts/complete-profile-fix.sql
   ```

2. **Deploy the code changes:**
   ```bash
   npm run build
   # Deploy to your hosting platform
   ```

3. **Test with a new Google OAuth sign-in**

### **Option 2: Manual Database Setup**
1. Go to your Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `scripts/complete-profile-fix.sql`
3. Run the script
4. Verify the function exists in Database → Functions

### **Option 3: Test First**
1. Run the test script:
   ```bash
   node scripts/test-profile-creation.js
   ```
2. Apply the fix if tests pass
3. Deploy the updated code

## 🔍 **Verification Steps**

### **1. Check Database Function**
```sql
-- In Supabase SQL Editor
SELECT public.create_user_profile(
  '00000000-0000-0000-0000-000000000000'::UUID,
  'Test User',
  'guest',
  'Test City',
  'Test bio'
);
```

### **2. Check Existing Users**
```sql
-- See which users don't have profiles
SELECT 
  au.id as auth_uid,
  au.email,
  au.user_metadata->>'full_name' as full_name
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.auth_uid
WHERE p.auth_uid IS NULL;
```

### **3. Test New User Sign-in**
1. Sign out of your app
2. Sign in with Google OAuth
3. Check that a profile is created in the `profiles` table
4. Verify the profile has the correct data

## 📊 **Expected Results**

### **Before Fix:**
- ✅ Users authenticate successfully
- ❌ No profiles created in `profiles` table
- ❌ App shows "No profile found" errors

### **After Fix:**
- ✅ Users authenticate successfully
- ✅ Profiles created automatically
- ✅ App works with full functionality
- ✅ Existing users get profiles created

## 🛠️ **Files Modified**

1. **`hooks/useOptimizedAuth.ts`** - Updated profile creation logic
2. **`scripts/complete-profile-fix.sql`** - Database function and policies
3. **`scripts/create-missing-profiles.sql`** - Fix existing users
4. **`scripts/test-profile-creation.js`** - Test script

## 🔧 **Troubleshooting**

### **If profiles still aren't created:**
1. Check Supabase logs for errors
2. Verify the `create_user_profile` function exists
3. Check RLS policies are correct
4. Test the function manually in SQL Editor

### **If you get permission errors:**
1. Ensure you're the owner of the database
2. Check that the function has proper grants
3. Verify the SECURITY DEFINER setting

### **If existing users still don't have profiles:**
1. Run the `create-missing-profiles.sql` script
2. Check for any constraint violations
3. Verify the user IDs match between auth.users and profiles

## 🎯 **Success Criteria**

- [ ] `create_user_profile` function exists in database
- [ ] New Google OAuth sign-ins create profiles automatically
- [ ] Existing authenticated users have profiles
- [ ] No RLS permission errors in logs
- [ ] App functionality works completely

## 📝 **Notes**

- The database function uses `SECURITY DEFINER` to bypass RLS
- Profiles are created with default values (role: 'guest', city: 'Unknown')
- The function is granted to both `authenticated` and `anon` roles
- Existing users get profiles created retroactively
