'use client'

import { useState } from 'react'
import { useAuth } from '@/app/optimized-providers'
import { User, Users, AlertTriangle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface RoleSwitchProps {
  currentRole: 'guest' | 'host'
  onRoleChange?: (newRole: 'guest' | 'host') => void
}

export default function RoleSwitch({ currentRole, onRoleChange }: RoleSwitchProps) {
  const { updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingRole, setPendingRole] = useState<'guest' | 'host' | null>(null)

  const handleRoleChange = async (newRole: 'guest' | 'host') => {
    if (newRole === currentRole) return

    setPendingRole(newRole)
    setShowConfirmation(true)
  }

  const confirmRoleChange = async () => {
    if (!pendingRole) return

    setLoading(true)
    try {
      await updateProfile({ role: pendingRole })
      
      toast.success(`Role updated to ${pendingRole}!`, {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      })
      
      // Call the callback if provided
      onRoleChange?.(pendingRole)
      
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Failed to update role. Please try again.')
    } finally {
      setLoading(false)
      setShowConfirmation(false)
      setPendingRole(null)
    }
  }

  const cancelRoleChange = () => {
    setShowConfirmation(false)
    setPendingRole(null)
  }

  const getRoleIcon = (role: 'guest' | 'host') => {
    return role === 'host' ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />
  }

  const getRoleDescription = (role: 'guest' | 'host') => {
    return role === 'host' 
      ? 'Create and manage experiences for guests'
      : 'Discover and book amazing local experiences'
  }

  const getRoleBenefits = (role: 'guest' | 'host') => {
    return role === 'host' 
      ? ['Create experiences', 'Manage bookings', 'Earn money', 'Build your brand']
      : ['Book experiences', 'Save favorites', 'Leave reviews', 'Get recommendations']
  }

  if (showConfirmation && pendingRole) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">Confirm Role Change</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You're about to change your role from <span className="font-medium">{currentRole}</span> to <span className="font-medium">{pendingRole}</span>.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              {getRoleIcon(pendingRole)}
              <span className="font-medium capitalize">{pendingRole} Benefits:</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              {getRoleBenefits(pendingRole).map((benefit, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={confirmRoleChange}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>{loading ? 'Updating...' : 'Confirm Change'}</span>
          </button>
          <button
            onClick={cancelRoleChange}
            disabled={loading}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Account Role</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${
          currentRole === 'host' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {getRoleIcon(currentRole)}
          <span className="capitalize">{currentRole}</span>
        </span>
      </div>

      <p className="text-gray-600 mb-6">
        {getRoleDescription(currentRole)}
      </p>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Switch to:</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Guest Role Option */}
          <button
            onClick={() => handleRoleChange('guest')}
            disabled={currentRole === 'guest' || loading}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              currentRole === 'guest'
                ? 'border-green-300 bg-green-50 cursor-not-allowed'
                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Guest</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Discover and book amazing local experiences
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Book experiences</li>
              <li>• Save favorites</li>
              <li>• Leave reviews</li>
            </ul>
          </button>

          {/* Host Role Option */}
          <button
            onClick={() => handleRoleChange('host')}
            disabled={currentRole === 'host' || loading}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              currentRole === 'host'
                ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <User className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Host</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Create and manage experiences for guests
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Create experiences</li>
              <li>• Manage bookings</li>
              <li>• Earn money</li>
            </ul>
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Important Note</h4>
            <p className="text-sm text-amber-700 mt-1">
              Changing your role will affect your dashboard and available features. 
              You can switch between roles at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
