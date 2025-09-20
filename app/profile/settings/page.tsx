'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../optimized-providers'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, User, MapPin, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import RoleSwitch from '@/components/RoleSwitch'

export default function ProfileSettingsPage() {
  const { profile, updateProfile, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    city: '',
    bio: '',
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        city: profile.city,
        bio: profile.bio || '',
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(formData)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out')
    }
  }

  const handleRoleChange = (newRole: 'guest' | 'host') => {
    // The RoleSwitch component handles the actual update
    // This callback can be used for additional actions if needed
    console.log(`Role changed to: ${newRole}`)
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Update your profile information and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Role Management */}
          <RoleSwitch 
            currentRole={profile.role} 
            onRoleChange={handleRoleChange}
          />

          {/* Profile Information */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="label">
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="city" className="label">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="bio" className="label">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="input resize-none"
                  placeholder="Tell others about yourself..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Account Information */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Account Information</span>
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium text-gray-900">Role</p>
                  <p className="text-sm text-gray-600">
                    {profile.role === 'host' ? 'Experience Host' : 'Guest'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  profile.role === 'host' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {profile.role}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium text-gray-900">Verification Status</p>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Verification is done via email or WhatsApp.<br />
                    Please contact <a href="mailto:ayman.timjicht@e-polytechnique.ma" className="underline text-blue-600">ayman.timjicht@e-polytechnique.ma</a> or WhatsApp <a href="https://wa.me/212641208443" className="underline text-green-600">+212641208443</a>.
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  profile.verified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {profile.verified ? 'Verified' : 'Pending'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium text-gray-900">Member Since</p>
                  <p className="text-sm text-gray-600">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-200">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Account Actions</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Sign Out</p>
                  <p className="text-sm text-gray-600">Sign out of your account</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="btn-secondary text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
