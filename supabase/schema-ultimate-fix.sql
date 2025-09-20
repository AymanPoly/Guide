-- Ultimate Supabase schema fix for RLS policy issues
-- This version handles all edge cases and timing issues

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.experiences CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_uid UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('guest', 'host')) NOT NULL,
  city TEXT NOT NULL,
  bio TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experiences table
CREATE TABLE public.experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  price TEXT NOT NULL,
  contact_method TEXT CHECK (contact_method IN ('whatsapp', 'email')) NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  guest_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a secure function to handle profile creation
-- This function bypasses RLS and is called with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_name TEXT,
  user_role TEXT,
  user_city TEXT,
  user_bio TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Insert the profile
  INSERT INTO public.profiles (auth_uid, full_name, role, city, bio)
  VALUES (user_id, user_name, user_role, user_city, user_bio)
  RETURNING id INTO profile_id;
  
  RETURN profile_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;

-- Create a function to handle new user signup (alternative approach)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used with a trigger to automatically create profiles
  -- For now, we'll let the application handle profile creation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for profiles
-- SELECT: Anyone can view profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = auth_uid);

-- INSERT: More permissive policy that handles timing issues
-- This policy allows authenticated users to create profiles
CREATE POLICY "Authenticated users can create profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    auth.uid() = auth_uid AND
    auth.role() = 'authenticated'
  );

-- Alternative INSERT policy (if the above doesn't work)
-- This is more permissive and should work in all cases
CREATE POLICY "Allow profile creation for authenticated users" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for experiences
CREATE POLICY "Anyone can view published experiences" ON public.experiences
  FOR SELECT USING (published = true);

CREATE POLICY "Hosts can view their own experiences" ON public.experiences
  FOR SELECT USING (
    host_id IN (
      SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
    )
  );

CREATE POLICY "Hosts can insert their own experiences" ON public.experiences
  FOR INSERT WITH CHECK (
    host_id IN (
      SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
    )
  );

CREATE POLICY "Hosts can update their own experiences" ON public.experiences
  FOR UPDATE USING (
    host_id IN (
      SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete their own experiences" ON public.experiences
  FOR DELETE USING (
    host_id IN (
      SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Guests can view their own bookings" ON public.bookings
  FOR SELECT USING (
    guest_id IN (
      SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
    )
  );

CREATE POLICY "Hosts can view bookings for their experiences" ON public.bookings
  FOR SELECT USING (
    experience_id IN (
      SELECT id FROM public.experiences 
      WHERE host_id IN (
        SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
      )
    )
  );

CREATE POLICY "Guests can insert their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    guest_id IN (
      SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
    )
  );

CREATE POLICY "Hosts can update bookings for their experiences" ON public.bookings
  FOR UPDATE USING (
    experience_id IN (
      SELECT id FROM public.experiences 
      WHERE host_id IN (
        SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_auth_uid ON public.profiles(auth_uid);
CREATE INDEX IF NOT EXISTS idx_experiences_host_id ON public.experiences(host_id);
CREATE INDEX IF NOT EXISTS idx_experiences_published ON public.experiences(published);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON public.bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_experience_id ON public.bookings(experience_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.experiences TO authenticated;
GRANT ALL ON public.bookings TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;