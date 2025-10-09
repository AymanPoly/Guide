'use client'

import { useState } from 'react'
import { useAuth } from '../../optimized-providers'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import GoogleSignInButton from '@/components/GoogleSignInButton'

export default function RegisterPage() {
  const { signInWithGoogle } = useAuth()
  const router = useRouter()
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      // The redirect will happen automatically
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up with Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Guide</h1>
          <h2 className="text-xl text-gray-600">Create your account and start exploring</h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl border border-gray-100">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-8">
                Get started with your Google account for instant access
              </p>
            </div>

            <div>
              <GoogleSignInButton
                onClick={handleGoogleSignUp}
                loading={googleLoading}
                text="Sign up with Google"
                loadingText="Signing up..."
              />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
