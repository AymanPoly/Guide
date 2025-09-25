'use client'

import Link from 'next/link'
import { useAuth } from '@/app/optimized-providers'
import { User, Plus, Home } from 'lucide-react'

export default function Header() {
  const { user, profile } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-600">
              Guide
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <Home className="h-5 w-5" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
                <Link href="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{profile?.full_name}</span>
                </Link>
                {profile?.role === 'host' && (
                  <Link href="/host/experiences/new" className="btn-primary flex items-center space-x-1">
                    <Plus className="h-4 w-4" />
                    <span>Add Experience</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login" className="btn-secondary">Login</Link>
                <Link href="/auth/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

