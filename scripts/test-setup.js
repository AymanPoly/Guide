// Test script to verify project setup
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing project setup...\n');

const tests = [
  {
    name: 'Package.json exists',
    test: () => fs.existsSync('package.json'),
    fix: 'Run npm init to create package.json'
  },
  {
    name: 'Environment example exists',
    test: () => fs.existsSync('env.example'),
    fix: 'Create env.example file with Supabase configuration'
  },
  {
    name: 'Supabase schema exists',
    test: () => fs.existsSync('supabase/schema.sql'),
    fix: 'Create supabase/schema.sql with database schema'
  },
  {
    name: 'PWA manifest exists',
    test: () => fs.existsSync('public/manifest.json'),
    fix: 'Create public/manifest.json for PWA'
  },
  {
    name: 'Service worker exists',
    test: () => fs.existsSync('public/sw.js'),
    fix: 'Create public/sw.js for offline functionality'
  },
  {
    name: 'Icons directory exists',
    test: () => fs.existsSync('public/icons'),
    fix: 'Create public/icons directory and generate icons'
  },
  {
    name: 'App directory structure',
    test: () => fs.existsSync('app') && fs.existsSync('app/page.tsx'),
    fix: 'Create Next.js app directory structure'
  },
  {
    name: 'Components directory',
    test: () => fs.existsSync('components'),
    fix: 'Create components directory'
  },
  {
    name: 'Lib directory',
    test: () => fs.existsSync('lib') && fs.existsSync('lib/supabase.ts'),
    fix: 'Create lib directory with Supabase configuration'
  },
  {
    name: 'Tailwind config',
    test: () => fs.existsSync('tailwind.config.js'),
    fix: 'Create tailwind.config.js'
  },
  {
    name: 'TypeScript config',
    test: () => fs.existsSync('tsconfig.json'),
    fix: 'Create tsconfig.json'
  }
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  try {
    if (test.test()) {
      console.log(`✅ ${test.name}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      console.log(`   Fix: ${test.fix}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${test.name} (Error: ${error.message})`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Your project is ready to go.');
  console.log('\nNext steps:');
  console.log('1. Copy env.example to .env.local');
  console.log('2. Add your Supabase credentials to .env.local');
  console.log('3. Run the SQL schema in your Supabase dashboard');
  console.log('4. Run npm install');
  console.log('5. Run npm run dev');
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues above before proceeding.');
}

// Check for common issues
console.log('\n🔍 Checking for common issues...');

// Check if .env.local exists
if (!fs.existsSync('.env.local')) {
  console.log('⚠️  .env.local not found. Copy from env.example and add your Supabase credentials.');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('⚠️  node_modules not found. Run npm install to install dependencies.');
}

// Check package.json for required dependencies
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['next', 'react', '@supabase/supabase-js'];
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies?.[dep]);
  
  if (missingDeps.length > 0) {
    console.log(`⚠️  Missing dependencies: ${missingDeps.join(', ')}`);
  }
}

console.log('\n✨ Setup check complete!');

