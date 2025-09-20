'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface Stats {
  totalExperiences: number
  publishedExperiences: number
  totalBookings: number
  pendingBookings: number
}

export function useStats(profile: Profile | null) {
  const [stats, setStats] = useState<Stats>({
    totalExperiences: 0,
    publishedExperiences: 0,
    totalBookings: 0,
    pendingBookings: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!profile) return

    try {
      setLoading(true)
      setError(null)

      // Fetch experiences stats
      const { data: experiences, error: expError } = await supabase
        .from('experiences')
        .select('id, published')
        .eq('host_id', profile.id)

      if (expError) throw expError

      const totalExperiences = experiences?.length || 0
      const publishedExperiences = experiences?.filter(exp => exp.published).length || 0

      // Fetch bookings stats
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          id, status,
          experiences!inner(host_id)
        `)
        .eq('experiences.host_id', profile.id)

      if (bookingError) throw bookingError

      const totalBookings = bookings?.length || 0
      const pendingBookings = bookings?.filter(booking => booking.status === 'pending').length || 0

      setStats({
        totalExperiences,
        publishedExperiences,
        totalBookings,
        pendingBookings
      })
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stats')
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }, [profile])

  useEffect(() => {
    if (profile) {
      fetchStats()
    }
  }, [profile, fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}
