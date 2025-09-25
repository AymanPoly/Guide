'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, role: 'guest' | 'host', city: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          // Check if this is a new OAuth user and create profile if needed
          if (event === 'SIGNED_IN') {
            await handleOAuthUser(session.user)
          }
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleOAuthUser = async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_uid', user.id)
        .single()

      // If no profile exists, create one for OAuth user using the database function
      if (!existingProfile) {
        const { data, error } = await supabase.rpc('create_user_profile', {
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          user_role: 'guest', // Default role for OAuth users
          user_city: user.user_metadata?.city || 'Unknown',
          user_bio: null,
        })

        if (error) {
          console.error('Error creating OAuth profile:', error)
          // Fallback to direct insert if function fails
          await createProfileDirectly(user.id, user.user_metadata?.full_name || user.email?.split('@')[0] || 'User', 'guest', user.user_metadata?.city || 'Unknown')
        } else {
          console.log('OAuth profile created successfully with function')
        }
      }
    } catch (error) {
      console.error('Error handling OAuth user:', error)
    }
  }

  const createProfileDirectly = async (authUid: string, fullName: string, role: 'guest' | 'host', city: string, bio?: string) => {
    const { error } = await supabase
      .from('profiles')
      .insert({
        auth_uid: authUid,
        full_name: fullName,
        role,
        city,
        bio: bio || null,
      })

    if (error) {
      console.error('Direct profile creation error:', error)
      throw new Error(`Failed to create profile: ${error.message}`)
    }
  }

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_uid', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role: 'guest' | 'host', city: string) => {
    try {
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Wait for the auth session to be established
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Try to create profile using the database function first
        try {
          const { data: profileId, error: functionError } = await supabase.rpc('create_user_profile', {
            user_id: data.user.id,
            user_name: fullName,
            user_role: role,
            user_city: city,
            user_bio: null,
          })

          if (functionError) {
            console.warn('Function approach failed, trying direct insert:', functionError)
            // Fallback to direct insert
            await createProfileDirectly(data.user.id, fullName, role, city)
          } else {
            console.log('Profile created successfully using database function')
          }
        } catch (functionError) {
          console.warn('Function approach failed, trying direct insert:', functionError)
          // Fallback to direct insert
          await createProfileDirectly(data.user.id, fullName, role, city)
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  const signInWithGoogle = async () => {
    // Use production URL for redirect
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? 'https://verified-guide.netlify.app/auth/callback'
      : `${window.location.origin}/auth/callback`
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://verified-guide.netlify.app/auth/callback'
      }
    })

    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('auth_uid', user.id)

    if (error) throw error

    // Update local state
    setProfile(prev => prev ? { ...prev, ...updates } : null)
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
