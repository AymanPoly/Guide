-- Image Upload Schema Update
-- This adds image support to the experiences table

-- Add image_url column to experiences table
ALTER TABLE public.experiences 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_alt_text column for accessibility
ALTER TABLE public.experiences 
ADD COLUMN IF NOT EXISTS image_alt_text TEXT;

-- Create storage bucket for experience images
INSERT INTO storage.buckets (id, name, public)
VALUES ('experience-images', 'experience-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for experience images
CREATE POLICY "Anyone can view experience images" ON storage.objects
FOR SELECT USING (bucket_id = 'experience-images');

CREATE POLICY "Authenticated users can upload experience images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'experience-images' AND
  auth.role() = 'authenticated' AND
  auth.uid() IN (
    SELECT auth_uid FROM public.profiles 
    WHERE id IN (
      SELECT host_id FROM public.experiences 
      WHERE id::text = (storage.foldername(name))[2]
    )
  )
);

CREATE POLICY "Hosts can update their own experience images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'experience-images' AND
  auth.role() = 'authenticated' AND
  auth.uid() IN (
    SELECT auth_uid FROM public.profiles 
    WHERE id IN (
      SELECT host_id FROM public.experiences 
      WHERE id::text = (storage.foldername(name))[2]
    )
  )
);

CREATE POLICY "Hosts can delete their own experience images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'experience-images' AND
  auth.role() = 'authenticated' AND
  auth.uid() IN (
    SELECT auth_uid FROM public.profiles 
    WHERE id IN (
      SELECT host_id FROM public.experiences 
      WHERE id::text = (storage.foldername(name))[2]
    )
  )
);

-- Add comment to the new columns
COMMENT ON COLUMN public.experiences.image_url IS 'URL of the main image for the experience';
COMMENT ON COLUMN public.experiences.image_alt_text IS 'Alt text for the experience image (accessibility)';

-- Create a function to generate unique image names
CREATE OR REPLACE FUNCTION generate_image_name(experience_id UUID, file_extension TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN experience_id::text || '/' || gen_random_uuid()::text || '.' || file_extension;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION generate_image_name TO authenticated;
