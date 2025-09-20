-- Simple Unified Policies
-- Makes hosts have the same permissions as guests
-- Removes role-based restrictions while maintaining basic security

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

-- Simple unified policies for profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = auth_uid);

CREATE POLICY "Authenticated users can create profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = auth_uid);

-- Simple unified policies for experiences
-- All authenticated users can do everything with experiences
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

-- Simple unified policies for bookings
-- All authenticated users can do everything with bookings
CREATE POLICY "Authenticated users can view all bookings" ON public.bookings
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete bookings" ON public.bookings
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Update storage policies to be more permissive
DROP POLICY IF EXISTS "Anyone can view experience images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload experience images" ON storage.objects;
DROP POLICY IF EXISTS "Hosts can update their own experience images" ON storage.objects;
DROP POLICY IF EXISTS "Hosts can delete their own experience images" ON storage.objects;

-- Simple unified storage policies
CREATE POLICY "Anyone can view experience images" ON storage.objects
FOR SELECT USING (bucket_id = 'experience-images');

CREATE POLICY "Authenticated users can manage experience images" ON storage.objects
FOR ALL USING (
  bucket_id = 'experience-images' AND
  auth.uid() IS NOT NULL
);

-- Verify the changes
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
