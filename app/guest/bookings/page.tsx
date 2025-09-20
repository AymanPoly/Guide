'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../optimized-providers'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import Link from 'next/link'
import { Calendar, MapPin, User, MessageCircle, Send, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMessages } from '@/hooks/useMessages'
import FeedbackForm from '@/components/FeedbackForm'

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  experiences: Database['public']['Tables']['experiences']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row']
  }
}

export default function GuestBookingsPage() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null)
  const [draftMessage, setDraftMessage] = useState('')
  const [showFeedbackForm, setShowFeedbackForm] = useState<string | null>(null)
  const [existingFeedback, setExistingFeedback] = useState<Record<string, boolean>>({})
  const { messages, sendMessage } = useMessages(activeBookingId, profile?.id || null)

  useEffect(() => {
    if (profile) {
      fetchBookings()
      checkExistingFeedback()
    }
  }, [profile])

  const checkExistingFeedback = async () => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('booking_id')
        .eq('guest_id', profile.id)

      if (error) throw error

      const feedbackMap: Record<string, boolean> = {}
      data?.forEach(feedback => {
        feedbackMap[feedback.booking_id] = true
      })
      setExistingFeedback(feedbackMap)
    } catch (error) {
      console.error('Error checking existing feedback:', error)
    }
  }

  const fetchBookings = async () => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          experiences (
            *,
            profiles (*)
          )
        `)
        .eq('guest_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
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
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h2>
          <p className="text-gray-600">Track your experience bookings and their status</p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start exploring amazing local experiences</p>
            <Link href="/" className="btn-primary">
              Browse Experiences
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {booking.experiences.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.experiences.city}</span>
                      </div>
                      <span className="font-semibold text-primary-600">${booking.experiences.price}</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.experiences.profiles.full_name}</p>
                      <p className="text-sm text-gray-600">Host</p>
                    </div>
                  </div>

                  {booking.guest_message && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <MessageCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Your message:</p>
                          <p className="text-sm text-gray-600">{booking.guest_message}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Messages thread */}
                  <div className="mt-2">
                    <button
                      className="text-sm text-primary-600 hover:underline"
                      onClick={() => setActiveBookingId(activeBookingId === booking.id ? null : booking.id)}
                    >
                      {activeBookingId === booking.id ? 'Hide messages' : 'Show messages'}
                    </button>

                    {activeBookingId === booking.id && (
                      <div className="mt-3">
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {messages.length === 0 ? (
                            <p className="text-sm text-gray-500">No messages yet.</p>
                          ) : (
                            messages.map(m => (
                              <div key={m.id} className={`text-sm ${m.sender_profile_id === profile?.id ? 'text-right' : 'text-left'}`}>
                                <span className={`inline-block px-3 py-2 rounded-lg ${m.sender_profile_id === profile?.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                  {m.body}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="mt-3 flex items-center space-x-2">
                          <input
                            value={draftMessage}
                            onChange={(e) => setDraftMessage(e.target.value)}
                            className="input flex-1"
                            placeholder="Write a message to the host..."
                          />
                          <button
                            className="btn-primary inline-flex items-center"
                            onClick={async () => {
                              const text = draftMessage.trim()
                              if (!text) return
                              const ok = await sendMessage(text)
                              if (ok.success) setDraftMessage('')
                              else toast.error('Failed to send')
                            }}
                          >
                            <Send className="h-4 w-4 mr-1" /> Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-600">
                    
                    {booking.status === 'confirmed' && (
                      <p className="text-green-600 font-medium mt-1">
                        Your booking is confirmed! The host will contact you soon.
                      </p>
                    )}
                    {booking.status === 'cancelled' && (
                      <p className="text-red-600 font-medium mt-1">
                        This booking was declined by the host.
                      </p>
                    )}
                    {booking.status === 'pending' && (
                      <p className="text-yellow-600 font-medium mt-1">
                        Waiting for host confirmation...
                      </p>
                    )}
                  </div>

                  {/* Feedback Section for Confirmed Bookings */}
                  {booking.status === 'confirmed' && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {existingFeedback[booking.id] ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">Thank you for your feedback!</span>
                        </div>
                      ) : (
                        <div>
                          {!showFeedbackForm ? (
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                How was your experience? Share your feedback to help other guests.
                              </p>
                              <button
                                onClick={() => setShowFeedbackForm(booking.id)}
                                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                              >
                                <Star className="h-4 w-4" />
                                <span>Leave Feedback</span>
                              </button>
                            </div>
                          ) : (
                            <div className="mt-3">
                              <FeedbackForm
                                bookingId={booking.id}
                                experienceId={booking.experience_id}
                                hostId={booking.experiences.host_id}
                                guestId={profile?.id || ''}
                                onSuccess={() => {
                                  setShowFeedbackForm(null)
                                  setExistingFeedback(prev => ({
                                    ...prev,
                                    [booking.id]: true
                                  }))
                                }}
                                onCancel={() => setShowFeedbackForm(null)}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

