# 🔐 Google OAuth Configuration Steps

## ✅ Environment Setup Complete!

Your `.env.local` file has been updated with your Google OAuth credentials:

```
GOOGLE_CLIENT_ID=620839782879-qhaeoi1morr44var3q1lq3okhaddh306.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## 🚀 Next Steps to Complete Setup

### 1. Configure Supabase Dashboard

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard
   - Select your project: `hzgywonmosfllhsnbnvp`

2. **Enable Google Provider**:
   - Go to **Authentication** → **Providers**
   - Find **Google** in the list
   - Toggle it to **Enabled**

3. **Add Your Credentials**:
   - **Client ID**: `620839782879-qhaeoi1morr44var3q1lq3okhaddh306.apps.googleusercontent.com`
   - **Client Secret**: `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`
   - **Redirect URL**: Should be pre-filled as:
     ```
     https://hzgywonmosfllhsnbnvp.supabase.co/auth/v1/callback
     ```

4. **Save Configuration**:
   - Click **Save** to apply changes

### 2. Configure Google Cloud Console

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Update OAuth 2.0 Client**:
   - Go to **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID: `620839782879-qhaeoi1morr44var3q1lq3okhaddh306.apps.googleusercontent.com`
   - Click **Edit**

3. **Add Authorized Redirect URIs**:
   ```
   https://hzgywonmosfllhsnbnvp.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```

4. **Add Authorized JavaScript Origins**:
   ```
   http://localhost:3000
   https://hzgywonmosfllhsnbnvp.supabase.co
   ```

5. **Save Changes**:
   - Click **Save** to apply changes

### 3. Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test Google Sign-In**:
   - Go to: http://localhost:3000/auth/login
   - Click **"Sign in with Google"**
   - Complete the OAuth flow
   - Verify you're redirected to the dashboard

3. **Test Google Sign-Up**:
   - Go to: http://localhost:3000/auth/register
   - Click **"Sign up with Google"**
   - Complete the OAuth flow
   - Verify profile is created automatically

## 🔍 Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" Error**:
   - Check that redirect URIs in Google Cloud Console match exactly
   - Ensure no trailing slashes or extra characters

2. **"invalid_client" Error**:
   - Verify Client ID and Client Secret are correct
   - Check that the OAuth consent screen is configured

3. **Profile Not Created**:
   - Check browser console for errors
   - Verify RLS policies allow profile creation
   - Check Supabase logs for authentication events

### Debug Steps

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs
   - Look for authentication events

2. **Check Browser Console**:
   - Open Developer Tools
   - Look for JavaScript errors during OAuth flow

3. **Verify Configuration**:
   - Ensure both Supabase and Google Cloud Console are configured
   - Check that redirect URIs match exactly

## ✅ Success Indicators

You'll know it's working when:
- ✅ Google sign-in button appears on login/register pages
- ✅ Clicking the button opens Google OAuth consent screen
- ✅ After granting permissions, you're redirected to your app
- ✅ Profile is created automatically for new users
- ✅ Existing users can sign in with Google
- ✅ No console errors during the OAuth flow

## 🎉 Ready to Test!

Your Google OAuth integration is now configured! Follow the steps above to complete the setup and start testing the Google sign-in functionality.

## 📚 Additional Resources

- **Full Setup Guide**: `GOOGLE_OAUTH_SETUP.md`
- **Implementation Summary**: `GOOGLE_AUTH_SUMMARY.md`
- **Troubleshooting Guide**: `TROUBLESHOOTING.md`
- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2

