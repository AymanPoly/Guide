-- NOTE: The following line is commented out to avoid "must be owner of table users" error.
-- If you are the owner of the auth.users table, you may uncomment it.
-- ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
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
CREATE TABLE IF NOT EXISTS public.experiences (
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
CREATE TABLE IF NOT EXISTS public.bookings (
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

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = auth_uid);

CREATE POLICY "Authenticated users can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = auth_uid);

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
