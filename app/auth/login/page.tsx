'use client'

import { useState } from 'react'
import { useAuth } from '../../optimized-providers'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import GoogleSignInButton from '@/components/GoogleSignInButton'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const router = useRouter()
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      // The redirect will happen automatically
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <h2 className="text-xl text-gray-600">Sign in to your Guide account</h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl border border-gray-100">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-8">
                Continue with your Google account for a seamless experience
              </p>
            </div>

            <div>
              <GoogleSignInButton
                onClick={handleGoogleSignIn}
                loading={googleLoading}
                text="Sign in with Google"
                loadingText="Signing in..."
              />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
