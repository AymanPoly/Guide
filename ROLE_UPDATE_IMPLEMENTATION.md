# 🔄 Role Update Implementation Guide

## 🎯 Overview
This guide shows you how to implement the ability for users to switch between 'guest' and 'host' roles in your application.

## 🚀 Quick Implementation

### Step 1: Update Database Schema
1. Go to your **Supabase Dashboard → SQL Editor**
2. Run the contents of `supabase/role-update-fix.sql`
3. This creates secure database functions for role updates

### Step 2: Update Auth Provider
Replace your current `app/providers.tsx` with `app/providers-with-role-update.tsx`:

```bash
# Backup current provider
cp app/providers.tsx app/providers-backup.tsx

# Replace with role-update version
cp app/providers-with-role-update.tsx app/providers.tsx
```

### Step 3: Update Profile Settings
The profile settings page has been updated to include the role switch component.

## 🛠️ What's Been Added

### 1. Database Functions
- **`update_user_role(new_role)`**: Securely updates user role with validation
- **`get_user_role()`**: Gets current user role
- Both functions use `SECURITY DEFINER` for controlled access

### 2. RoleSwitch Component
- **Location**: `components/RoleSwitch.tsx`
- **Features**:
  - Visual role comparison
  - Confirmation dialog
  - Benefits explanation
  - Error handling
  - Loading states

### 3. Enhanced Auth Provider
- **New Method**: `updateRole(newRole: 'guest' | 'host')`
- **Fallback**: Uses database function first, falls back to direct update
- **Error Handling**: Comprehensive error handling and logging

### 4. Updated Profile Settings
- **Role Management Section**: Prominent role switch at the top
- **Visual Feedback**: Clear role indicators and benefits
- **Confirmation Flow**: Prevents accidental role changes

## 🎨 UI Features

### Role Switch Component
```tsx
<RoleSwitch 
  currentRole={profile.role} 
  onRoleChange={handleRoleChange}
/>
```

**Features**:
- ✅ Current role display with badge
- ✅ Role comparison cards
- ✅ Benefits explanation
- ✅ Confirmation dialog
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications

### Role Benefits Display
- **Guest**: Book experiences, Save favorites, Leave reviews
- **Host**: Create experiences, Manage bookings, Earn money, Build brand

## 🔒 Security Features

### Database Level
- **Validation**: Only 'guest' or 'host' roles allowed
- **Authentication**: Only authenticated users can update roles
- **Ownership**: Users can only update their own roles
- **Audit Trail**: `updated_at` timestamp automatically updated

### Application Level
- **Confirmation**: Users must confirm role changes
- **Error Handling**: Graceful fallbacks if database function fails
- **State Management**: Local state updated immediately after successful change

## 🧪 Testing the Implementation

### Test 1: Role Switch UI
1. Go to `/profile/settings`
2. You should see the "Account Role" section at the top
3. Click on the opposite role to see the confirmation dialog
4. Confirm the change

### Test 2: Role Change Flow
1. Start as a 'guest' user
2. Switch to 'host' role
3. Verify dashboard changes (should show host features)
4. Switch back to 'guest'
5. Verify dashboard changes (should show guest features)

### Test 3: Database Verification
```sql
-- Check if role was updated
SELECT id, auth_uid, full_name, role, updated_at 
FROM public.profiles 
WHERE auth_uid = auth.uid();
```

## 🔧 Customization Options

### 1. Role Benefits
Edit the `getRoleBenefits` function in `RoleSwitch.tsx`:
```tsx
const getRoleBenefits = (role: 'guest' | 'host') => {
  return role === 'host' 
    ? ['Create experiences', 'Manage bookings', 'Earn money', 'Build your brand']
    : ['Book experiences', 'Save favorites', 'Leave reviews', 'Get recommendations']
}
```

### 2. Role Descriptions
Edit the `getRoleDescription` function:
```tsx
const getRoleDescription = (role: 'guest' | 'host') => {
  return role === 'host' 
    ? 'Create and manage experiences for guests'
    : 'Discover and book amazing local experiences'
}
```

### 3. Role Icons
Change the icons in the `getRoleIcon` function:
```tsx
const getRoleIcon = (role: 'guest' | 'host') => {
  return role === 'host' ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />
}
```

## 🚨 Important Notes

### Role Change Impact
- **Dashboard**: Changes immediately based on new role
- **Navigation**: Header shows different options for hosts vs guests
- **Permissions**: Access to host-only features changes
- **Data**: Existing bookings/experiences remain intact

### Database Considerations
- **Existing Data**: Role changes don't affect existing bookings or experiences
- **Performance**: Database functions are optimized for quick role updates
- **Backup**: Always backup your database before implementing changes

## 🐛 Troubleshooting

### If role updates fail:
1. **Check database functions exist**:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'update_user_role';
   ```

2. **Verify RLS policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

3. **Check user permissions**:
   ```sql
   SELECT auth.uid() as current_user_id;
   ```

### If UI doesn't update:
1. **Check auth provider**: Ensure you're using the updated provider
2. **Check component import**: Verify RoleSwitch is imported correctly
3. **Check console errors**: Look for JavaScript errors in browser console

## 📱 Mobile Responsiveness

The RoleSwitch component is fully responsive:
- **Mobile**: Single column layout
- **Tablet**: Two-column layout
- **Desktop**: Full two-column layout with detailed benefits

## 🎯 Next Steps

After implementing role updates, consider:

1. **Role-based Analytics**: Track role changes and usage patterns
2. **Role Verification**: Add verification process for hosts
3. **Role Limits**: Implement limits on role changes (e.g., once per day)
4. **Role History**: Track role change history for audit purposes
5. **Role-specific Onboarding**: Different onboarding flows for each role

## ✅ Success Checklist

- [ ] Database functions created and working
- [ ] Auth provider updated with updateRole method
- [ ] RoleSwitch component added to profile settings
- [ ] Role changes work without errors
- [ ] Dashboard updates based on new role
- [ ] Confirmation dialog works properly
- [ ] Error handling works for failed updates
- [ ] Mobile responsiveness verified

The role update functionality is now fully implemented and ready to use!
