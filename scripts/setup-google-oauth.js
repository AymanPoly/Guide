// Google OAuth Setup Helper Script
// This script helps you configure Google OAuth for your Supabase project

console.log('🔐 Google OAuth Setup Helper\n');

console.log('📋 Setup Checklist:');
console.log('1. ✅ Create Google Cloud Console project');
console.log('2. ✅ Enable Google+ API');
console.log('3. ✅ Create OAuth 2.0 credentials');
console.log('4. ✅ Configure authorized redirect URIs');
console.log('5. ✅ Enable Google provider in Supabase');
console.log('6. ✅ Add Client ID and Secret to Supabase\n');

console.log('🔗 Required URLs:');
console.log('Authorized JavaScript Origins:');
console.log('  - http://localhost:3000 (development)');
console.log('  - https://your-domain.com (production)\n');

console.log('Authorized Redirect URIs:');
console.log('  - https://your-project-ref.supabase.co/auth/v1/callback');
console.log('  - http://localhost:3000/auth/callback (development)');
console.log('  - https://your-domain.com/auth/callback (production)\n');

console.log('📝 Steps to Complete:');
console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
console.log('2. Create a new project or select existing');
console.log('3. Enable Google+ API');
console.log('4. Create OAuth 2.0 credentials');
console.log('5. Add the redirect URIs listed above');
console.log('6. Copy Client ID and Client Secret');
console.log('7. Go to Supabase Dashboard → Authentication → Providers');
console.log('8. Enable Google provider and add your credentials\n');

console.log('🧪 Testing:');
console.log('1. Start your app: npm run dev');
console.log('2. Go to /auth/login or /auth/register');
console.log('3. Click "Sign in with Google" or "Sign up with Google"');
console.log('4. Complete the OAuth flow');
console.log('5. Verify you\'re redirected to the dashboard\n');

console.log('📚 Documentation:');
console.log('- Full setup guide: GOOGLE_OAUTH_SETUP.md');
console.log('- Supabase Auth docs: https://supabase.com/docs/guides/auth');
console.log('- Google OAuth docs: https://developers.google.com/identity/protocols/oauth2\n');

console.log('🚀 Your app is ready for Google OAuth!');
console.log('Just follow the setup steps above to enable it.');

