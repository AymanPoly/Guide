-- Unified Permissions Schema
-- This makes hosts have the same "normal" permissions as guests
-- All authenticated users can perform the same actions regardless of role

-- Drop existing role-based policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view published experiences" ON public.experiences;
DROP POLICY IF EXISTS "Hosts can view their own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Hosts can insert their own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Hosts can update their own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Hosts can delete their own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Guests can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Hosts can view bookings for their experiences" ON public.bookings;
DROP POLICY IF EXISTS "Guests can insert their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Hosts can update bookings for their experiences" ON public.bookings;

-- Unified RLS Policies for profiles
-- All authenticated users have the same permissions
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = auth_uid);

CREATE POLICY "Authenticated users can create profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = auth_uid);

-- Unified RLS Policies for experiences
-- All authenticated users can create, view, update, and delete experiences
CREATE POLICY "Anyone can view published experiences" ON public.experiences
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can view all experiences" ON public.experiences
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create experiences" ON public.experiences
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update experiences" ON public.experiences
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete experiences" ON public.experiences
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Unified RLS Policies for bookings
-- All authenticated users can view, create, and update bookings
CREATE POLICY "Authenticated users can view all bookings" ON public.bookings
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete bookings" ON public.bookings
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Update storage policies for experience images to be more permissive
DROP POLICY IF EXISTS "Anyone can view experience images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload experience images" ON storage.objects;
DROP POLICY IF EXISTS "Hosts can update their own experience images" ON storage.objects;
DROP POLICY IF EXISTS "Hosts can delete their own experience images" ON storage.objects;

-- Unified storage policies for experience images
CREATE POLICY "Anyone can view experience images" ON storage.objects
FOR SELECT USING (bucket_id = 'experience-images');

CREATE POLICY "Authenticated users can upload experience images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'experience-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update experience images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'experience-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete experience images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'experience-images' AND
  auth.role() = 'authenticated'
);

-- Add comments to explain the unified approach
COMMENT ON TABLE public.profiles IS 'User profiles with unified permissions - all authenticated users have the same access rights';
COMMENT ON TABLE public.experiences IS 'Experiences with unified permissions - all authenticated users can create, view, update, and delete';
COMMENT ON TABLE public.bookings IS 'Bookings with unified permissions - all authenticated users can create, view, update, and delete';

-- Create a function to check if user is authenticated (for consistency)
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_authenticated TO authenticated;

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
