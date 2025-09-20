'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Experience = Database['public']['Tables']['experiences']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('experiences')
        .select(`
          *,
          profiles (*)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setExperiences(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch experiences')
    } finally {
      setLoading(false)
    }
  }

  const searchExperiences = (city: string) => {
    if (!city.trim()) return experiences
    
    return experiences.filter(exp =>
      exp.city.toLowerCase().includes(city.toLowerCase())
    )
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  return {
    experiences,
    loading,
    error,
    refetch: fetchExperiences,
    searchExperiences
  }
}

