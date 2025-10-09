'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../optimized-providers'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import Link from 'next/link'
import { Calendar, User, MessageCircle, Check, X, Send, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMessages } from '@/hooks/useMessages'

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  experiences: Database['public']['Tables']['experiences']['Row']
  profiles: Database['public']['Tables']['profiles']['Row']
  feedback?: {
    id: string
    booking_id: string
    experience_id: string
    guest_id: string
    host_id: string
    rating: number
    comment: string | null
    created_at: string
    updated_at: string
  }
}

export default function HostBookingsPage() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null)
  const [draftMessage, setDraftMessage] = useState('')
  const { messages, sendMessage } = useMessages(activeBookingId, profile?.id || null)

  useEffect(() => {
    if (profile) {
      fetchBookings()
    }
  }, [profile])

  // Set active booking ID to show messages for the first booking
  useEffect(() => {
    if (bookings.length > 0 && !activeBookingId) {
      setActiveBookingId(bookings[0].id)
    }
  }, [bookings, activeBookingId])

  const fetchBookings = async () => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          experiences (*),
          profiles (*),
          feedback (*)
        `)
        .eq('experiences.host_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)

      if (error) throw error

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ))

      toast.success(`Booking ${status} successfully`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update booking')
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const isFilled = i < rating
      return (
        <Star
          key={i}
          className={`h-4 w-4 ${
            isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      )
    })
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Requests</h2>
          <p className="text-gray-600">Manage booking requests for your experiences</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))
          ) : (
            (() => {
              const total = bookings.length
              const pending = bookings.filter(b => b.status === 'pending').length
              const confirmed = bookings.filter(b => b.status === 'confirmed').length
              const cancelled = bookings.filter(b => b.status === 'cancelled').length
              return (
                <>
                  <div className="card">
                    <p className="text-gray-600 text-sm">Total Bookings</p>
                    <p className="text-xl font-semibold">{total}</p>
                  </div>
                  <div className="card">
                    <p className="text-gray-600 text-sm">Pending</p>
                    <p className="text-xl font-semibold text-orange-600">{pending}</p>
                  </div>
                  <div className="card">
                    <p className="text-gray-600 text-sm">Confirmed</p>
                    <p className="text-xl font-semibold text-green-600">{confirmed}</p>
                  </div>
                  <div className="card">
                    <p className="text-gray-600 text-sm">Cancelled</p>
                    <p className="text-xl font-semibold text-red-600">{cancelled}</p>
                  </div>
                </>
              )
            })()
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No booking requests yet</h3>
            <p className="text-gray-600 mb-6">When guests book your experiences, they'll appear here</p>
            <Link href="/host/experiences" className="btn-primary">
              Manage Experiences
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
                    <p className="text-sm text-gray-600 mb-2">{booking.experiences.city}</p>
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
                      <p className="font-medium text-gray-900">{booking.profiles.full_name}</p>
                      <p className="text-sm text-gray-600">{booking.profiles.city}</p>
                    </div>
                  </div>

                  {booking.guest_message && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <MessageCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                        <p className="text-sm text-gray-700">{booking.guest_message}</p>
                      </div>
                    </div>
                  )}

                  {/* Messages thread */}
                  <div className="mt-2">
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
                          placeholder="Write a message to the guest..."
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
                  </div>

                  {booking.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        <span>Confirm</span>
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  {/* Feedback Section for Confirmed Bookings */}
                  {booking.status === 'confirmed' && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {booking.feedback ? (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-900">Guest Experience Feedback</h4>
                            <div className="flex items-center space-x-1">
                              {renderStars(booking.feedback.rating)}
                              <span className="text-sm text-gray-600 ml-1">
                                {booking.feedback.rating}/5
                              </span>
                            </div>
                          </div>
                          {booking.feedback.comment && (
                            <p className="text-sm text-gray-700 leading-relaxed">
                              "{booking.feedback.comment}"
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Feedback received on {new Date(booking.feedback.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <div className="flex items-center justify-center space-x-2 text-gray-500">
                            <Star className="h-4 w-4" />
                            <span className="text-sm">Waiting for guest feedback</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Guest can leave feedback after completing the experience
                          </p>
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

