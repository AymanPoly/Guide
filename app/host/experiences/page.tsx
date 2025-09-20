'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../optimized-providers'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, Edit, Eye, EyeOff, Trash2, Image as ImageIcon, Star, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

type Experience = Database['public']['Tables']['experiences']['Row'] & {
  image_url?: string | null
  image_alt_text?: string | null
}

export default function HostExperiencesPage() {
  const { profile } = useAuth()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      fetchExperiences()
    }
  }, [profile])

  const fetchExperiences = async () => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('host_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setExperiences(data || [])
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .update({ published: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setExperiences(prev => prev.map(exp => 
        exp.id === id ? { ...exp, published: !currentStatus } : exp
      ))

      toast.success(`Experience ${!currentStatus ? 'published' : 'unpublished'}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update experience')
    }
  }

  const deleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id)

      if (error) throw error

      setExperiences(prev => prev.filter(exp => exp.id !== id))
      toast.success('Experience deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete experience')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experiences...</p>
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
              <Link href="/host/experiences/new" className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Experience</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Experiences</h2>
          <p className="text-gray-600">Manage your published and draft experiences</p>
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
              const total = experiences.length
              const published = experiences.filter(e => e.published).length
              const drafts = total - published
              const recent = experiences.slice(0, 5).length
              return (
                <>
                  <div className="card">
                    <p className="text-gray-600 text-sm">Total Experiences</p>
                    <p className="text-xl font-semibold">{total}</p>
                  </div>
                  <div className="card">
                    <p className="text-gray-600 text-sm">Published</p>
                    <p className="text-xl font-semibold">{published}</p>
                  </div>
                  <div className="card">
                    <p className="text-gray-600 text-sm">Drafts</p>
                    <p className="text-xl font-semibold">{drafts}</p>
                  </div>
                  <div className="card">
                    <p className="text-gray-600 text-sm">Recent (last 5)</p>
                    <p className="text-xl font-semibold">{recent}</p>
                  </div>
                </>
              )
            })()
          )}
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences yet</h3>
            <p className="text-gray-600 mb-6">Create your first experience to start connecting with travelers</p>
            <Link href="/host/experiences/new" className="btn-primary">
              Create Your First Experience
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience) => (
              <div key={experience.id} className="card">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {experience.image_url ? (
                    <img
                      src={experience.image_url}
                      alt={experience.image_alt_text || experience.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{experience.title}</h3>
                  <button
                    onClick={() => togglePublished(experience.id, experience.published)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${
                      experience.published 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                    title={`Click to ${experience.published ? 'unpublish' : 'publish'} this experience`}
                  >
                    {experience.published ? 'Published' : 'Draft'}
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{experience.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{experience.city}</span>
                  <span className="font-semibold text-primary-600">${experience.price}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => togglePublished(experience.id, experience.published)}
                      className={`p-2 rounded-lg transition-colors ${
                        experience.published 
                          ? 'text-orange-600 hover:bg-orange-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={experience.published ? 'Unpublish' : 'Publish'}
                    >
                      {experience.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <Link
                      href={`/host/experiences/${experience.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteExperience(experience.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(experience.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Feedback Summary + Toggle */}
                <HostExperienceFeedback experienceId={experience.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HostExperienceFeedback({ experienceId }: { experienceId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<Array<{ id: string; rating: number; comment: string | null; created_at: string; profiles: { full_name: string } }>>([])

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('id,rating,comment,created_at,profiles:profiles(full_name)')
          .eq('experience_id', experienceId)
          .order('created_at', { ascending: false })
        if (error) throw error
        if (!mounted) return
        const normalized = (data || []).map((row: any) => ({
          id: row.id as string,
          rating: row.rating as number,
          comment: (row.comment ?? null) as string | null,
          created_at: row.created_at as string,
          profiles: { full_name: row.profiles?.full_name as string }
        }))
        setFeedback(normalized)
      } catch {
        if (!mounted) return
        setFeedback([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [experienceId])

  const average = useMemo(() => {
    if (feedback.length === 0) return null
    const sum = feedback.reduce((s, f) => s + f.rating, 0)
    return Math.round((sum / feedback.length) * 10) / 10
  }, [feedback])

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          {average !== null ? (
            <>
              <span className="font-semibold">{average.toFixed(1)}</span>
              <span className="text-gray-500">({feedback.length} reviews)</span>
            </>
          ) : (
            <span className="text-gray-400">No reviews yet</span>
          )}
        </div>
        <button
          onClick={() => setOpen(v => !v)}
          className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          {open ? 'Hide feedback' : 'Show all feedback'}
        </button>
      </div>
      {open && (
        <div className="mt-3 space-y-3 max-h-56 overflow-y-auto pr-1">
          {loading ? (
            <p className="text-sm text-gray-500">Loading feedback...</p>
          ) : feedback.length === 0 ? (
            <p className="text-sm text-gray-500">No feedback yet.</p>
          ) : (
            feedback.map(f => (
              <div key={f.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < f.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{new Date(f.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{f.profiles?.full_name || 'Guest'}</p>
                {f.comment && (
                  <p className="text-sm text-gray-700 mt-1">{f.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

