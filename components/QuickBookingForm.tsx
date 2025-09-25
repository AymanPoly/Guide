'use client'

import { useState } from 'react'
import { Calendar, User, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { createNotification } from '@/hooks/useNotifications'

interface QuickBookingFormProps {
  experienceId: string
  hostId: string
  experienceTitle: string
  onSuccess?: () => void
}

export default function QuickBookingForm({ 
  experienceId, 
  hostId, 
  experienceTitle,
  onSuccess 
}: QuickBookingFormProps) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const quickMessages = [
    "I'd love to book this experience!",
    "This looks amazing, count me in!",
    "I'm interested in booking this experience.",
    "Can I book this for next week?"
  ]

  const handleQuickMessage = (quickMsg: string) => {
    setMessage(quickMsg)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error('Please add a message')
      return
    }

    setLoading(true)

    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Please sign in to book experiences')
        return
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('auth_uid', user.id)
        .single()

      if (!profile) {
        toast.error('Profile not found')
        return
      }

      // Create booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          experience_id: experienceId,
          guest_id: profile.id,
          guest_message: message.trim(),
        })
        .select()
        .single()

      if (error) throw error

      // Create notification for host
      try {
        await createNotification(
          hostId,
          'booking_request',
          'New Booking Request',
          `${profile.full_name} has requested to book "${experienceTitle}".`,
          { 
            booking_id: data.id, 
            experience_id: experienceId,
            guest_id: profile.id,
            guest_name: profile.full_name
          }
        )
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError)
        // Don't fail the booking if notification fails
      }

      toast.success('Booking request sent! The host will contact you soon.')
      setMessage('')
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to send booking request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold">Quick Booking</h3>
      </div>

      {/* Quick message buttons */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Quick messages:</p>
        <div className="flex flex-wrap gap-2">
          {quickMessages.map((msg, index) => (
            <button
              key={index}
              onClick={() => handleQuickMessage(msg)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {msg}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message to host
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Tell the host about your interest..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{loading ? 'Sending...' : 'Send Booking Request'}</span>
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        The host will contact you within 24 hours
      </div>
    </div>
  )
}
