'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { useAuth } from '@/app/optimized-providers'

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  experiences: Database['public']['Tables']['experiences']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row']
  }
  profiles: Database['public']['Tables']['profiles']['Row']
}

export function useBookings() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    if (!profile) return

    try {
      setLoading(true)
      setError(null)
      
      let query = supabase
        .from('bookings')
        .select(`
          *,
          experiences (
            *,
            profiles (*)
          ),
          profiles (*)
        `)

      if (profile.role === 'guest') {
        query = query.eq('guest_id', profile.id)
      } else if (profile.role === 'host') {
        query = query.eq('experiences.host_id', profile.id)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings')
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

      return true
    } catch (err: any) {
      setError(err.message || 'Failed to update booking')
      return false
    }
  }

  useEffect(() => {
    if (profile) {
      fetchBookings()
    }
  }, [profile])

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateBookingStatus
  }
}

