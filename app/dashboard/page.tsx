'use client'

import { useAuth } from '../optimized-providers'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Plus, User, Settings, MapPin } from 'lucide-react'
import { useStats } from '@/hooks/useStats'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const { stats, loading: statsLoading } = useStats(profile)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Remove loading state - show content immediately

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">Guide</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <button 
                onClick={async () => {
                  if (confirm('Are you sure you want to sign out?')) {
                    try {
                      await signOut()
                      toast.success('Signed out successfully')
                      router.push('/auth/login')
                    } catch (error: any) {
                      toast.error('Failed to sign out: ' + (error.message || 'Unknown error'))
                    }
                  }
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.full_name}!
          </h2>
          <p className="text-gray-600">
            {profile.role === 'host' ? 'Manage your experiences and bookings' : 'Discover and book amazing local experiences'}
          </p>
        </div>

        {/* Role-based Dashboard */}
        {profile.role === 'host' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/host/experiences/new" className="flex items-center space-x-3 p-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors">
                  <Plus className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Add New Experience</span>
                </Link>
                <Link href="/host/experiences" className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Manage Experiences</span>
                </Link>
                <Link href="/host/bookings" className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">View Bookings</span>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Experiences</span>
                  <span className="font-semibold">{stats?.totalExperiences || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Published</span>
                  <span className="font-semibold">{stats?.publishedExperiences || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold">{stats?.totalBookings || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Requests</span>
                  <span className="font-semibold text-orange-600">{stats?.pendingBookings || 0}</span>
                </div>
              </div>
            </div>

            {/* Profile Status */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Profile Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Verification</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="text-sm">{profile.city}</span>
                </div>
                <Link href="/profile/settings" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/" className="flex items-center space-x-3 p-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Browse Experiences</span>
                </Link>
                <Link href="/guest/bookings" className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">My Bookings</span>
                </Link>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No bookings yet</p>
                <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm">
                  Start exploring experiences
                </Link>
              </div>
            </div>

            {/* Profile */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">{profile.full_name}</p>
                    <p className="text-sm text-gray-600">{profile.city}</p>
                  </div>
                </div>
                <Link href="/profile/settings" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
