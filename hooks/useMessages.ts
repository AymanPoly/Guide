'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Message = Database['public']['Tables']['messages']['Row']

export function useMessages(bookingId: string | null, currentProfileId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!bookingId) return
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [bookingId])

  const sendMessage = useCallback(async (body: string) => {
    if (!bookingId || !currentProfileId || !body.trim()) return { success: false }
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          booking_id: bookingId,
          sender_profile_id: currentProfileId,
          body: body.trim()
        })
        .select()

      if (error) throw error
      if (data && data[0]) {
        setMessages(prev => [...prev, data[0] as Message])
      }
      return { success: true }
    } catch (err) {
      return { success: false }
    }
  }, [bookingId, currentProfileId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  useEffect(() => {
    if (!bookingId) return
    const channel = supabase
      .channel(`messages-${bookingId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [bookingId])

  return { messages, loading, error, fetchMessages, sendMessage }
}


