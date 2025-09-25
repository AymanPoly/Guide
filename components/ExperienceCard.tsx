'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

function setCachedData<T>(key: string, data: T, ttl: number = 5 * 60 * 1000) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

export function useOptimizedAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  })

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const cacheKey = `profile:${userId}`
    const cached = getCachedData<Profile>(cacheKey)
    
    if (cached) {
      return cached
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_uid', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      // Cache for 5 minutes
      setCachedData(cacheKey, data, 5 * 60 * 1000)
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }, [])

  const handleOAuthUser = useCallback(async (user: User) => {
    console.log('🔍 Handling OAuth user:', user.email, 'ID:', user.id)
    
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_uid', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error checking existing profile:', fetchError)
        return
      }

      console.log('🔍 Existing profile check:', existingProfile ? 'Found' : 'Not found')

      if (!existingProfile) {
        console.log('🔨 Creating new profile for OAuth user...')
        const { error } = await supabase
          .from('profiles')
          .insert({
            auth_uid: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            role: 'guest',
            city: 'Unknown',
            bio: null,
            verified: false
          })

        if (error) {
          console.error('❌ Error creating Google OAuth profile:', error)
          console.error('Full error details:', JSON.stringify(error, null, 2))
        } else {
          console.log('✅ Google OAuth profile created successfully for user:', user.email)
        }
      }
    } catch (error) {
      console.error('Error handling OAuth user:', error)
    }
  }, [])

  const initializeAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      // Get initial session and profile in parallel
      const [sessionResult] = await Promise.allSettled([
        supabase.auth.getSession()
      ])

      if (sessionResult.status === 'fulfilled') {
        const { data: { session } } = sessionResult.value
        
        if (session?.user) {
          // Fetch profile in parallel with auth state change listener setup
          const profilePromise = fetchProfile(session.user.id)
          
          setState(prev => ({ 
            ...prev, 
            user: session.user,
            loading: false 
          }))

          // Update profile when it loads
          const profile = await profilePromise
          setState(prev => ({ 
            ...prev, 
            profile,
            loading: false 
          }))
        } else {
          setState(prev => ({ 
            ...prev, 
            user: null,
            profile: null,
            loading: false 
          }))
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to initialize authentication',
        loading: false 
      }))
    }
  }, [fetchProfile])

  useEffect(() => {
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, 'User:', session?.user?.email)
        
        if (session?.user) {
          // Handle OAuth users
          if (event === 'SIGNED_IN') {
            console.log('👤 New sign-in detected, handling OAuth user...')
            await handleOAuthUser(session.user)
          }
          
          // Fetch profile in parallel
          const profile = await fetchProfile(session.user.id)
          
          setState(prev => ({ 
            ...prev, 
            user: session.user,
            profile,
            loading: false,
            error: null
          }))
        } else {
          setState(prev => ({ 
            ...prev, 
            user: null,
            profile: null,
            loading: false,
            error: null
          }))
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [initializeAuth, handleOAuthUser, fetchProfile])

  const signUp = useCallback(async (email: string, password: string, fullName: string, role: 'guest' | 'host' = 'guest') => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })

      if (error) throw error

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            auth_uid: data.user.id,
            full_name: fullName,
            email: email,
            role: role,
            verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }

      return { data, error: null }
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
      return { data: null, error }
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
      return { data: null, error }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await supabase.auth.signOut()
      
      // Clear cache
      cache.clear()
      
      setState(prev => ({ 
        ...prev, 
        user: null,
        profile: null,
        loading: false,
        error: null
      }))
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
      return { data: null, error }
    }
  }, [])

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!state.profile) return { success: false, error: 'No profile found' }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', state.profile.id)
        .select()
        .single()

      if (error) throw error

      // Update cache
      const cacheKey = `profile:${state.profile.auth_uid}`
      setCachedData(cacheKey, data, 5 * 60 * 1000)

      setState(prev => ({ 
        ...prev, 
        profile: data,
        loading: false,
        error: null
      }))

      return { success: true, error: null }
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
      return { success: false, error }
    }
  }, [state.profile])

  // Memoized values to prevent unnecessary re-renders
  const memoizedState = useMemo(() => state, [state.user?.id, state.profile?.id, state.loading, state.error])

  return {
    ...memoizedState,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    updateProfile,
    refetchProfile: () => state.user ? fetchProfile(state.user.id) : Promise.resolve(null)
  }
}
