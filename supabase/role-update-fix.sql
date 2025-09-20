-- Role Update Functionality
-- This adds the ability to update user roles from 'guest' to 'host' and vice versa

-- Create a function to update user role securely
CREATE OR REPLACE FUNCTION public.update_user_role(
  new_role TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate the new role
  IF new_role NOT IN ('guest', 'host') THEN
    RAISE EXCEPTION 'Invalid role. Must be either "guest" or "host"';
  END IF;

  -- Update the user's role
  UPDATE public.profiles 
  SET 
    role = new_role,
    updated_at = NOW()
  WHERE auth_uid = auth.uid();

  -- Check if the update was successful
  IF FOUND THEN
    RETURN TRUE;
  ELSE
    RAISE EXCEPTION 'Profile not found or update failed';
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_user_role TO authenticated;

-- Create a function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE auth_uid = auth.uid();
  
  RETURN user_role;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_role TO authenticated;

-- Ensure the existing UPDATE policy allows role updates
-- The existing policy should already allow this, but let's make sure
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = auth_uid);

-- Add a comment to the profiles table about role updates
COMMENT ON COLUMN public.profiles.role IS 'User role: guest (can book experiences) or host (can create and manage experiences). Can be updated by the user.';
