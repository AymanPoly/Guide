'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth'
import { User } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, fullName: string, role?: 'guest' | 'host') => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ success: boolean; error: any }>
  signInWithGoogle: () => Promise<{ data: any; error: any }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error: any }>
  refetchProfile: () => Promise<Profile | null>
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function OptimizedProviders({ children }: { children: ReactNode }) {
  const authData = useOptimizedAuth()

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  )
}
