-- Welcome notification trigger for new users
-- This automatically creates a welcome notification when a new profile is created

-- Create function to send welcome notification
CREATE OR REPLACE FUNCTION send_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create welcome notification for new user
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (
    NEW.id,
    'welcome',
    'Welcome to Guide!',
    'Thank you for joining Guide! Start exploring amazing local experiences and connect with hosts worldwide.',
    jsonb_build_object(
      'welcome', true,
      'user_role', NEW.role,
      'created_at', NOW()
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS welcome_notification_trigger ON public.profiles;

-- Create trigger for new profile creation
CREATE TRIGGER welcome_notification_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_notification();

-- Test the trigger (this will only work if you have a profiles table)
-- You can test this by creating a new user account
