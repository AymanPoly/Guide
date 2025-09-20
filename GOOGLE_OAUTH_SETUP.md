# 🔐 Google OAuth Setup Guide

## Overview

This guide will help you set up Google Sign-In for your Authentic Local Experiences app using Supabase Auth.

## 🚀 Quick Setup Steps

### 1. Create Google OAuth App

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name: "Authentic Local Experiences" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and press "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Authentic Local Experiences Web"

5. **Configure Authorized Redirect URIs**
   - Add these URIs:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback (for development)
     ```
   - Replace `your-project-ref` with your actual Supabase project reference

6. **Get Your Credentials**
   - Copy the **Client ID** and **Client Secret**
   - Keep these secure!

### 2. Configure Supabase

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to "Authentication" → "Providers"

2. **Enable Google Provider**
   - Find "Google" in the list
   - Toggle it to "Enabled"

3. **Add Google Credentials**
   - **Client ID**: Paste your Google Client ID
   - **Client Secret**: Paste your Google Client Secret
   - **Redirect URL**: Should be pre-filled as:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```

4. **Save Configuration**
   - Click "Save" to apply changes

### 3. Update Your App

The app has already been updated with Google OAuth functionality:

- ✅ **Auth Provider**: Updated to handle Google sign-in
- ✅ **Login Page**: Added Google sign-in button
- ✅ **Register Page**: Added Google sign-up button
- ✅ **Callback Page**: Created to handle OAuth redirects
- ✅ **Profile Creation**: Automatically creates profiles for Google users

### 4. Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test Google Sign-In**:
   - Go to `/auth/login` or `/auth/register`
   - Click "Sign in with Google" or "Sign up with Google"
   - Complete the Google OAuth flow
   - Verify you're redirected to the dashboard

## 🔧 Configuration Details

### Environment Variables

No additional environment variables are needed for Google OAuth. Supabase handles the OAuth flow internally.

### Redirect URLs

Make sure these URLs are configured in both Google Cloud Console and Supabase:

**Development:**
```
http://localhost:3000/auth/callback
```

**Production:**
```
https://your-domain.com/auth/callback
```

### Google Cloud Console Settings

**Authorized JavaScript Origins:**
```
http://localhost:3000
https://your-domain.com
```

**Authorized Redirect URIs:**
```
https://your-project-ref.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
```

## 🎨 UI Components

### Google Sign-In Button

The Google sign-in button is styled consistently with your app:

```tsx
<button
  onClick={handleGoogleSignIn}
  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
>
  <Chrome className="h-5 w-5 mr-2" />
  Sign in with Google
</button>
```

### Loading States

Both login and register pages include loading states for Google authentication:

- Button shows "Signing in..." or "Signing up..." during the process
- Button is disabled during the OAuth flow
- Error handling with toast notifications

## 🔄 OAuth Flow

1. **User clicks Google sign-in button**
2. **Redirected to Google OAuth consent screen**
3. **User grants permissions**
4. **Google redirects to Supabase callback**
5. **Supabase processes the OAuth response**
6. **User is redirected to your app's callback page**
7. **App checks for existing profile and creates one if needed**
8. **User is redirected to dashboard**

## 👤 Profile Creation for Google Users

When a Google user signs in for the first time:

- **Full Name**: Extracted from Google profile
- **Email**: From Google account
- **Role**: Defaults to "guest"
- **City**: Defaults to "Unknown" (user can update later)
- **Bio**: Empty (user can add later)

Users can update their profile information in the settings page.

## 🛠️ Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" Error**
   - Check that redirect URIs in Google Cloud Console match exactly
   - Ensure no trailing slashes or extra characters

2. **"invalid_client" Error**
   - Verify Client ID and Client Secret are correct
   - Check that the OAuth consent screen is configured

3. **Profile Not Created**
   - Check browser console for errors
   - Verify RLS policies allow profile creation
   - Check Supabase logs for authentication events

4. **Redirect Loop**
   - Ensure callback page is properly configured
   - Check that redirect URLs are correct

### Debug Steps

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs
   - Look for authentication events

2. **Check Browser Console**:
   - Open Developer Tools
   - Look for JavaScript errors during OAuth flow

3. **Test OAuth URLs**:
   - Verify Google OAuth URLs are accessible
   - Check Supabase callback URL

### Testing Checklist

- [ ] Google OAuth app created and configured
- [ ] Supabase Google provider enabled
- [ ] Redirect URIs configured correctly
- [ ] OAuth consent screen configured
- [ ] Test sign-in flow works
- [ ] Test sign-up flow works
- [ ] Profile created automatically
- [ ] User redirected to dashboard
- [ ] Error handling works properly

## 🚀 Production Deployment

### Update Redirect URLs

When deploying to production:

1. **Update Google Cloud Console**:
   - Add production domain to authorized origins
   - Add production callback URL

2. **Update Supabase**:
   - No changes needed (uses same callback URL)

3. **Test Production Flow**:
   - Verify OAuth works on production domain
   - Test both sign-in and sign-up flows

## 📱 Mobile Considerations

The Google OAuth flow works on mobile devices:

- **Mobile browsers**: Full OAuth flow
- **PWA**: Works when installed
- **Deep linking**: Can be configured for mobile apps

## 🔒 Security Notes

- **HTTPS Required**: OAuth requires HTTPS in production
- **Secure Storage**: Client secrets are stored securely in Supabase
- **Token Management**: Supabase handles token refresh automatically
- **Profile Data**: Only basic profile info is requested from Google

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## ✅ Setup Complete!

Your app now supports Google Sign-In! Users can:

- Sign up with Google (creates profile automatically)
- Sign in with Google (existing users)
- Update their profile information
- Use all app features normally

The integration is seamless and provides a better user experience for authentication.

