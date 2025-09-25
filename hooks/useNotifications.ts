'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Notification {
  id: string
  user_id: string
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'new_message' | 'new_feedback' | 'experience_published' | 'experience_unpublished' | 'welcome'
  title: string
  message: string
  data: any
  read: boolean
  created_at: string
  updated_at: string
}

export interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  refreshNotifications: () => Promise<void>
}

export function useNotifications(userId: string | null): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setNotifications(data || [])
      setError(null)
    } catch (err: any) {
      console.error('Error fetching notifications:', err)
      setError(err.message || 'Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (err: any) {
      console.error('Error marking notification as read:', err)
      setError(err.message || 'Failed to mark notification as read')
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err)
      setError(err.message || 'Failed to mark all notifications as read')
    }
  }, [userId])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      )
    } catch (err: any) {
      console.error('Error deleting notification:', err)
      setError(err.message || 'Failed to delete notification')
    }
  }, [])

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications
  }
}

// Helper function to create notifications
export async function createNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  data?: any
): Promise<void> {
  try {
    console.log('createNotification called with:', { userId, type, title, message, data })
    
    const { data: result, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data: data || null
      })
      .select()

    if (error) {
      console.error('Supabase error creating notification:', error)
      throw error
    }
    
    console.log('Notification created successfully:', result)
  } catch (err: any) {
    console.error('Error creating notification:', err)
    throw err
  }
}
