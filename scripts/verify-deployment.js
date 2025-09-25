#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks that all critical files are properly configured for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying deployment configuration...\n');

// Check if service worker exists
const swPath = path.join(__dirname, '..', 'app', 'sw.js');
if (fs.existsSync(swPath)) {
  console.log('✅ Service Worker found at app/sw.js');
} else {
  console.log('❌ Service Worker missing at app/sw.js');
}

// Check if manifest exists
const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  console.log('✅ Manifest found at public/manifest.json');
} else {
  console.log('❌ Manifest missing at public/manifest.json');
}

// Check if icons exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (fs.existsSync(iconsDir)) {
  const icons = fs.readdirSync(iconsDir);
  console.log(`✅ Icons directory found with ${icons.length} icons`);
} else {
  console.log('❌ Icons directory missing');
}

// Check netlify.toml
const netlifyPath = path.join(__dirname, '..', 'netlify.toml');
if (fs.existsSync(netlifyPath)) {
  console.log('✅ Netlify configuration found');
} else {
  console.log('❌ Netlify configuration missing');
}

// Check next.config.js
const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('✅ Next.js configuration found');
} else {
  console.log('❌ Next.js configuration missing');
}

console.log('\n🎉 Deployment verification complete!');
console.log('\nTo deploy:');
console.log('1. Run: npm run build');
console.log('2. Deploy the .next folder to your hosting platform');
console.log('3. Ensure all static files are served correctly');
