-- Quick fix: Disable RLS on feedback table to allow free submission
-- Run this if you already have the feedback table created

-- Disable RLS on feedback table
ALTER TABLE public.feedback DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view feedback" ON public.feedback;
DROP POLICY IF EXISTS "Guests can insert feedback for their confirmed bookings" ON public.feedback;
DROP POLICY IF EXISTS "Guests can update their own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Guests can delete their own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Guests can view feedback for experiences they booked" ON public.feedback;
DROP POLICY IF EXISTS "Hosts can view feedback for their experiences" ON public.feedback;
DROP POLICY IF EXISTS "Anyone can view published feedback" ON public.feedback;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'feedback';
