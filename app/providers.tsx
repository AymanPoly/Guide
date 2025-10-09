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

      // If no profile exists, create one for OAuth user
      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            auth_uid: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            role: 'guest', // Default role for OAuth users
            city: user.user_metadata?.city || 'Unknown',
            bio: null,
          })

        if (profileError) {
          console.error('Error creating OAuth profile:', profileError)
        } else {
          console.log('OAuth profile created successfully')
        }
      }
    } catch (error) {
      console.error('Error handling OAuth user:', error)
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
    // First, sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      // Wait a moment for the auth session to be established
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create profile with the authenticated user's session
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          auth_uid: data.user.id,
          full_name: fullName,
          role,
          city,
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        throw new Error(`Failed to create profile: ${profileError.message}`)
      }
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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear all local state
      setUser(null)
      setProfile(null)
      setLoading(false)
      
      // Clear session storage
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
        localStorage.removeItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token')
      }
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
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
