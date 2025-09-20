-- Simplified Feedback/Reviews schema for LocalExp
-- This version has simpler RLS policies for easier debugging

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one feedback per booking
  UNIQUE(booking_id)
);

-- Enable RLS on feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view feedback" ON public.feedback;
DROP POLICY IF EXISTS "Guests can insert feedback for their confirmed bookings" ON public.feedback;
DROP POLICY IF EXISTS "Guests can update their own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Guests can delete their own feedback" ON public.feedback;

-- Simple RLS Policies for feedback

-- 1. Anyone can view feedback (public reviews)
CREATE POLICY "Anyone can view feedback" ON public.feedback
  FOR SELECT USING (true);

-- 2. Guests can insert feedback for their own confirmed bookings
CREATE POLICY "Guests can insert feedback for their confirmed bookings" ON public.feedback
  FOR INSERT WITH CHECK (
    -- Check if the current user is the guest
    guest_id = (
      SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
    )
    -- Check if the booking exists and is confirmed
    AND booking_id IN (
      SELECT id FROM public.bookings 
      WHERE guest_id = (
        SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
      )
      AND status = 'confirmed'
    )
  );

-- 3. Guests can update their own feedback
CREATE POLICY "Guests can update their own feedback" ON public.feedback
  FOR UPDATE USING (
    guest_id = (
      SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
    )
  );

-- 4. Guests can delete their own feedback
CREATE POLICY "Guests can delete their own feedback" ON public.feedback
  FOR DELETE USING (
    guest_id = (
      SELECT id FROM public.profiles WHERE auth_uid = auth.uid()
    )
  );

-- Create trigger for updated_at (drop first to avoid conflicts)
DROP TRIGGER IF EXISTS update_feedback_updated_at ON public.feedback;
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_experience_id ON public.feedback(experience_id);
CREATE INDEX IF NOT EXISTS idx_feedback_guest_id ON public.feedback(guest_id);
CREATE INDEX IF NOT EXISTS idx_feedback_host_id ON public.feedback(host_id);
CREATE INDEX IF NOT EXISTS idx_feedback_booking_id ON public.feedback(booking_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);
