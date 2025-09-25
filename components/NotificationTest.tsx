'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { createNotification } from '@/hooks/useNotifications'
import { useAuth } from '@/app/optimized-providers'

export default function NotificationTest() {
  const { profile } = useAuth()
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<string>('')

  const testNotificationCreation = async () => {
    if (!profile) {
      setResult('No profile found - please log in')
      return
    }

    setTesting(true)
    setResult('Testing...')

    try {
      // Test 1: Direct Supabase insert
      console.log('Test 1: Direct Supabase insert')
      const { data: directData, error: directError } = await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          type: 'welcome',
          title: 'Direct Test',
          message: 'This is a direct Supabase test notification.',
          data: { test: 'direct' }
        })
        .select()

      if (directError) {
        console.error('Direct insert error:', directError)
        setResult(`Direct insert failed: ${directError.message}`)
        return
      }

      console.log('Direct insert success:', directData)
      setResult('Direct insert: SUCCESS')

      // Test 2: Using createNotification function
      console.log('Test 2: Using createNotification function')
      await createNotification(
        profile.id,
        'welcome',
        'Function Test',
        'This is a test using the createNotification function.',
        { test: 'function' }
      )

      console.log('Function test success')
      setResult('Both tests: SUCCESS - Notifications are working!')

    } catch (error: any) {
      console.error('Test error:', error)
      setResult(`Test failed: ${error.message}`)
    } finally {
      setTesting(false)
    }
  }

  const checkNotifications = async () => {
    if (!profile) {
      setResult('No profile found - please log in')
      return
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        setResult(`Error fetching notifications: ${error.message}`)
        return
      }

      setResult(`Found ${data?.length || 0} notifications. Latest: ${data?.[0]?.title || 'None'}`)
    } catch (error: any) {
      setResult(`Error: ${error.message}`)
    }
  }

  if (!profile) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please log in to test notifications</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Notification System Test</h3>
      
      <div className="space-y-2">
        <button
          onClick={testNotificationCreation}
          disabled={testing}
          className="btn-primary disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Test Notification Creation'}
        </button>
        
        <button
          onClick={checkNotifications}
          className="btn-secondary"
        >
          Check My Notifications
        </button>
      </div>

      {result && (
        <div className="p-3 bg-white border rounded-lg">
          <p className="text-sm font-mono">{result}</p>
        </div>
      )}

      <div className="text-xs text-gray-600">
        <p>User ID: {profile.id}</p>
        <p>Role: {profile.role}</p>
      </div>
    </div>
  )
}
