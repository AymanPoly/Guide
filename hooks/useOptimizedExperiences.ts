'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Experience = Database['public']['Tables']['experiences']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

interface ExperiencesState {
  experiences: Experience[]
  loading: boolean
  error: string | null
}

// Simple in-memory cache with TTL + sessionStorage persistence
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

function getPersistedCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !parsed.timestamp || !parsed.ttl) return null
    if (Date.now() - parsed.timestamp > parsed.ttl) {
      sessionStorage.removeItem(key)
      return null
    }
    return parsed.data as T
  } catch {
    return null
  }
}

function setPersistedCache<T>(key: string, data: T, ttl: number) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({ data, timestamp: Date.now(), ttl })
    )
  } catch {
    // ignore storage errors (quota, privacy, etc.)
  }
}

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

function setCachedData<T>(key: string, data: T, ttl: number = 2 * 60 * 1000) { // 2 minutes default
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
  setPersistedCache(key, data, ttl)
}

export function useOptimizedExperiences() {
  const [state, setState] = useState<ExperiencesState>({
    experiences: [],
    loading: true,
    error: null
  })

  const fetchExperiences = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'experiences:published:v1'
    const cached = getCachedData<Experience[]>(cacheKey)
    
    // Return cached data if available and not forcing refresh
    if (cached && !forceRefresh) {
      setState(prev => ({ 
        ...prev, 
        experiences: cached,
        loading: false,
        error: null
      }))
      return cached
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase
        .from('experiences')
        .select(`
          id, title, description, city, price, image_url, image_alt_text, created_at,
          profiles (full_name, verified)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(0, 11) // fetch first page fast

      if (error) throw error

      const experiences = data || []
      
      // Cache for 2 minutes
      setCachedData(cacheKey, experiences, 2 * 60 * 1000)
      
      setState(prev => ({ 
        ...prev, 
        experiences,
        loading: false,
        error: null
      }))

      return experiences
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch experiences'
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false
      }))
      throw err
    }
  }, [])

  const searchExperiences = useCallback((city: string) => {
    if (!city.trim()) return state.experiences
    
    // Use cached search results if available
    const searchKey = `search:v1:${city.toLowerCase()}`
    const cached = getCachedData<Experience[]>(searchKey)
    
    if (cached) {
      return cached
    }

    const filtered = state.experiences.filter(exp =>
      exp.city.toLowerCase().includes(city.toLowerCase())
    )

    // Cache search results for 1 minute
    setCachedData(searchKey, filtered, 60 * 1000)
    
    return filtered
  }, [state.experiences])

  const getExperienceById = useCallback((id: string) => {
    // Check cache first
    const cacheKey = `experience:v1:${id}`
    const cached = getCachedData<Experience>(cacheKey)
    
    if (cached) {
      return cached
    }

    // Find in current experiences
    const experience = state.experiences.find(exp => exp.id === id)
    
    if (experience) {
      // Cache individual experience for 5 minutes
      setCachedData(cacheKey, experience, 5 * 60 * 1000)
    }
    
    return experience
  }, [state.experiences])

  const prefetchExperience = useCallback(async (id: string) => {
    const cacheKey = `experience:v1:${id}`
    const cached = getCachedData<Experience>(cacheKey)
    
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('experiences')
        .select(`
          *,
          profiles (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      // Cache for 5 minutes
      setCachedData(cacheKey, data, 5 * 60 * 1000)
      
      return data
    } catch (error) {
      console.error('Error prefetching experience:', error)
      return null
    }
  }, [])

  const invalidateCache = useCallback(() => {
    cache.clear()
  }, [])

  const updateExperienceInCache = useCallback((updatedExperience: Experience) => {
    // Update main cache
    const mainCacheKey = 'experiences:published:v1'
    const cached = getCachedData<Experience[]>(mainCacheKey)
    
    if (cached) {
      const updated = cached.map(exp => 
        exp.id === updatedExperience.id ? updatedExperience : exp
      )
      setCachedData(mainCacheKey, updated, 2 * 60 * 1000)
    }

    // Update individual experience cache
    const individualCacheKey = `experience:${updatedExperience.id}`
    setCachedData(individualCacheKey, updatedExperience, 5 * 60 * 1000)

    // Update state
    setState(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === updatedExperience.id ? updatedExperience : exp
      )
    }))
  }, [])

  // Initialize with cached data if available
  useEffect(() => {
    const cacheKey = 'experiences:published'
    const cached = getCachedData<Experience[]>(cacheKey)
    
    if (cached) {
      setState(prev => ({ 
        ...prev, 
        experiences: cached,
        loading: false
      }))
    }
    
    // Always fetch fresh data in background
    fetchExperiences()
  }, [fetchExperiences])

  // Memoized values to prevent unnecessary re-renders
  const memoizedState = useMemo(() => state, [state.experiences.length, state.loading, state.error])

  return {
    ...memoizedState,
    refetch: () => fetchExperiences(true),
    searchExperiences,
    getExperienceById,
    prefetchExperience,
    invalidateCache,
    updateExperienceInCache
  }
}
