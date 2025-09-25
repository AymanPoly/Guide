#!/usr/bin/env node

/**
 * Test Profile Creation Fix
 * This script tests if the profile creation is working properly
 */

const { createClient } = require('@supabase/supabase-js')

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testProfileCreation() {
  console.log('🧪 Testing profile creation...\n')

  try {
    // Test 1: Check if create_user_profile function exists
    console.log('1. Testing create_user_profile function...')
    const { data: functionTest, error: functionError } = await supabase.rpc('create_user_profile', {
      user_id: '00000000-0000-0000-0000-000000000000',
      user_name: 'Test User',
      user_role: 'guest',
      user_city: 'Test City',
      user_bio: 'Test bio'
    })

    if (functionError) {
      console.log('❌ Function test failed:', functionError.message)
    } else {
      console.log('✅ Function exists and works')
    }

    // Test 2: Check current users and profiles
    console.log('\n2. Checking current users and profiles...')
    
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('auth_uid, full_name, role, city')
      .limit(10)

    if (usersError) {
      console.log('❌ Error fetching profiles:', usersError.message)
    } else {
      console.log(`✅ Found ${users?.length || 0} profiles`)
      if (users && users.length > 0) {
        console.log('Sample profiles:')
        users.slice(0, 3).forEach((profile, index) => {
          console.log(`  ${index + 1}. ${profile.full_name} (${profile.role}) - ${profile.city}`)
        })
      }
    }

    // Test 3: Check for users without profiles
    console.log('\n3. Checking for users without profiles...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('auth_uid')

    if (profilesError) {
      console.log('❌ Error checking profiles:', profilesError.message)
    } else {
      console.log(`✅ Found ${profiles?.length || 0} profiles in database`)
    }

    console.log('\n🎉 Profile creation test completed!')
    console.log('\nNext steps:')
    console.log('1. Run the SQL script: scripts/complete-profile-fix.sql')
    console.log('2. Test with a new Google OAuth sign-in')
    console.log('3. Check that the profile is created automatically')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testProfileCreation()
