-- Setup script for feedback system
-- Run this in your Supabase SQL editor to add the feedback functionality

-- First, run the feedback schema
\i supabase/feedback-schema.sql

-- Verify the table was created
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'feedback' 
ORDER BY ordinal_position;

-- Test the RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'feedback';
