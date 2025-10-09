'use client'

import Link from 'next/link'
import { useAuth } from '@/app/optimized-providers'
import { User, Home, Calendar } from 'lucide-react'

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
              <div className="flex items-center space-x-3">
             
                <Link 
                  href={profile?.role === 'host' ? '/host/bookings' : '/guest/bookings'} 
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Bookings</span>
                </Link>
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{profile?.full_name}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/auth/login" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                  Login
                </Link>
              
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

