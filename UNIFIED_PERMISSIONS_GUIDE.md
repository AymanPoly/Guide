# 🔄 Unified Permissions Implementation Guide

## 🎯 Overview
This guide shows you how to make hosts have the same "normal" permissions as guests, removing role-based restrictions while maintaining basic security.

## 🚀 Quick Implementation

### Step 1: Apply Unified Policies
1. Go to your **Supabase Dashboard → SQL Editor**
2. Run the contents of `supabase/simple-unified-policies.sql`
3. This removes role-based restrictions and makes all authenticated users equal

### Step 2: Test the Changes
1. Try creating experiences as both guest and host users
2. Try viewing and managing bookings as both roles
3. Verify that both roles now have the same permissions

## 🔄 What Changed

### Before (Role-Based Permissions)
- **Guests**: Could only view published experiences and create bookings
- **Hosts**: Could create/manage experiences and view bookings for their experiences
- **Restrictions**: Role-based access control with different permissions

### After (Unified Permissions)
- **All Users**: Can create, view, update, and delete experiences
- **All Users**: Can create, view, update, and delete bookings
- **All Users**: Can manage their own profiles
- **No Role Restrictions**: Everyone has the same permissions

## 🛠️ Policy Changes

### Profiles Table
```sql
-- Before: Role-based profile access
-- After: All authenticated users have same access
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = auth_uid);

CREATE POLICY "Authenticated users can create profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = auth_uid);
```

### Experiences Table
```sql
-- Before: Only hosts could create/manage experiences
-- After: All authenticated users can manage experiences
CREATE POLICY "Authenticated users can view all experiences" ON public.experiences
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create experiences" ON public.experiences
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update experiences" ON public.experiences
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete experiences" ON public.experiences
  FOR DELETE USING (auth.uid() IS NOT NULL);
```

### Bookings Table
```sql
-- Before: Guests could only manage their own bookings, hosts could manage bookings for their experiences
-- After: All authenticated users can manage all bookings
CREATE POLICY "Authenticated users can view all bookings" ON public.bookings
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete bookings" ON public.bookings
  FOR DELETE USING (auth.uid() IS NOT NULL);
```

### Storage (Images)
```sql
-- Before: Only hosts could manage experience images
-- After: All authenticated users can manage experience images
CREATE POLICY "Authenticated users can manage experience images" ON storage.objects
FOR ALL USING (
  bucket_id = 'experience-images' AND
  auth.uid() IS NOT NULL
);
```

## 🎨 UI Impact

### What Users Can Now Do
- **Create Experiences**: Both guests and hosts can create experiences
- **Manage All Experiences**: Anyone can edit/delete any experience
- **View All Bookings**: Anyone can see all bookings
- **Manage All Bookings**: Anyone can create/update/delete bookings
- **Upload Images**: Anyone can upload images to any experience

### Dashboard Changes
- **Guest Dashboard**: Now shows options to create experiences
- **Host Dashboard**: Same functionality as before, but now guests have it too
- **Navigation**: All users see the same navigation options

## 🔒 Security Considerations

### What's Still Secure
- **Authentication Required**: Only authenticated users can perform actions
- **Profile Ownership**: Users can only update their own profiles
- **Basic Access Control**: Anonymous users still can't access protected data

### What's More Open
- **Experience Management**: Anyone can manage any experience
- **Booking Management**: Anyone can manage any booking
- **Image Management**: Anyone can manage any image

## 🧪 Testing the Changes

### Test 1: Experience Creation
1. **As a Guest**:
   - Go to `/host/experiences/new`
   - Create an experience
   - Verify it's created successfully

2. **As a Host**:
   - Create another experience
   - Verify both experiences are visible

### Test 2: Experience Management
1. **As a Guest**:
   - Go to `/host/experiences`
   - Try editing a host's experience
   - Try deleting an experience

2. **As a Host**:
   - Try editing a guest's experience
   - Verify all experiences are manageable

### Test 3: Booking Management
1. **As a Guest**:
   - Go to `/host/bookings`
   - View all bookings
   - Try updating booking status

2. **As a Host**:
   - Go to `/guest/bookings`
   - View all bookings
   - Try creating new bookings

### Test 4: Image Management
1. **As a Guest**:
   - Edit any experience
   - Upload/change images
   - Verify image changes work

## 🔧 Customization Options

### Option 1: Keep Some Restrictions
If you want to keep some basic restrictions, you can modify the policies:

```sql
-- Only allow users to edit their own experiences
CREATE POLICY "Users can update their own experiences" ON public.experiences
  FOR UPDATE USING (
    host_id IN (
      SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
    )
  );
```

### Option 2: Add Audit Logging
Track who makes changes:

```sql
-- Add audit columns
ALTER TABLE public.experiences ADD COLUMN last_modified_by UUID;
ALTER TABLE public.bookings ADD COLUMN last_modified_by UUID;

-- Update on changes
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Option 3: Soft Delete
Instead of hard deletes, use soft deletes:

```sql
-- Add deleted columns
ALTER TABLE public.experiences ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE public.bookings ADD COLUMN deleted_at TIMESTAMP;

-- Update policies to exclude deleted records
CREATE POLICY "Authenticated users can view active experiences" ON public.experiences
  FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);
```

## 🚨 Important Notes

### Data Integrity
- **No Ownership**: Experiences and bookings no longer have strict ownership
- **Shared Responsibility**: All users share responsibility for data integrity
- **Backup Recommended**: Consider backing up data before applying changes

### User Experience
- **Confusion**: Users might be confused by the new permissions
- **Training**: Consider updating user documentation
- **UI Updates**: You might want to update the UI to reflect new permissions

### Performance
- **No Impact**: Performance should remain the same
- **Queries**: Same queries, just different access patterns

## 🐛 Troubleshooting

### If policies don't apply:
1. **Check policy creation**:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

2. **Verify RLS is enabled**:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```

3. **Test authentication**:
   ```sql
   SELECT auth.uid() as current_user_id;
   ```

### If users can't access data:
1. **Check user authentication**: Ensure users are properly logged in
2. **Check policy conditions**: Verify the policy conditions are correct
3. **Check user permissions**: Ensure users have the authenticated role

## 📊 Monitoring

### Track Changes
Consider adding monitoring to track who makes changes:

```sql
-- Create audit table
CREATE TABLE audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  old_values JSONB,
  new_values JSONB
);
```

## ✅ Success Checklist

- [ ] Old role-based policies dropped
- [ ] New unified policies created
- [ ] Storage policies updated
- [ ] Guests can create experiences
- [ ] Hosts can manage all experiences
- [ ] All users can manage all bookings
- [ ] Image upload works for all users
- [ ] No permission errors in console
- [ ] All functionality works as expected

## 🎯 Next Steps

After implementing unified permissions:

1. **Update Documentation**: Update user guides and help text
2. **UI Updates**: Consider updating the UI to reflect new permissions
3. **User Training**: Inform users about the new capabilities
4. **Monitoring**: Set up monitoring for data changes
5. **Backup Strategy**: Implement regular backups

The unified permissions system is now implemented, giving all authenticated users the same level of access!
