// Environment Setup Script
// This script helps you set up your .env.local file

const fs = require('fs');
const path = require('path');

console.log('🔧 Environment Setup Helper\n');

// Check if .env.local exists
const envLocalPath = path.join(__dirname, '../.env.local');
const envTemplatePath = path.join(__dirname, '../env.local.template');

if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local already exists');
  console.log('📝 Current content:');
  console.log('─'.repeat(50));
  console.log(fs.readFileSync(envLocalPath, 'utf8'));
  console.log('─'.repeat(50));
} else {
  console.log('❌ .env.local not found');
  console.log('📋 Creating .env.local from template...\n');
  
  if (fs.existsSync(envTemplatePath)) {
    const templateContent = fs.readFileSync(envTemplatePath, 'utf8');
    fs.writeFileSync(envLocalPath, templateContent);
    console.log('✅ .env.local created successfully!');
    console.log('📝 Content:');
    console.log('─'.repeat(50));
    console.log(templateContent);
    console.log('─'.repeat(50));
  } else {
    console.log('❌ Template file not found');
  }
}

console.log('\n🔐 Your Google OAuth Credentials:');
console.log('Client ID: 620839782879-qhaeoi1morr44var3q1lq3okhaddh306.apps.googleusercontent.com');
console.log('Client Secret: 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\n');

console.log('📋 Next Steps:');
console.log('1. ✅ Google OAuth credentials added to .env.local');
console.log('2. 🔧 Add your Supabase credentials to .env.local');
console.log('3. 🌐 Configure Google OAuth in Supabase Dashboard');
console.log('4. 🧪 Test the Google sign-in functionality\n');

console.log('🔗 Supabase Dashboard Configuration:');
console.log('1. Go to: https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to Authentication → Providers');
console.log('4. Enable Google provider');
console.log('5. Add your Client ID and Client Secret');
console.log('6. Save configuration\n');

console.log('🌐 Google Cloud Console Configuration:');
console.log('1. Go to: https://console.cloud.google.com/');
console.log('2. Select your project');
console.log('3. Go to APIs & Services → Credentials');
console.log('4. Edit your OAuth 2.0 Client ID');
console.log('5. Add these Authorized Redirect URIs:');
console.log('   - https://your-project-ref.supabase.co/auth/v1/callback');
console.log('   - http://localhost:3000/auth/callback (for development)');
console.log('6. Save changes\n');

console.log('🧪 Testing:');
console.log('1. Run: npm run dev');
console.log('2. Go to: http://localhost:3000/auth/login');
console.log('3. Click "Sign in with Google"');
console.log('4. Complete the OAuth flow');
console.log('5. Verify you\'re redirected to the dashboard\n');

console.log('📚 Documentation:');
console.log('- Setup Guide: GOOGLE_OAUTH_SETUP.md');
console.log('- Summary: GOOGLE_AUTH_SUMMARY.md');
console.log('- Troubleshooting: TROUBLESHOOTING.md\n');

console.log('🎉 Environment setup complete!');

