'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth'
import { useOptimizedExperiences } from '@/hooks/useOptimizedExperiences'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, MapPin, User, Star, MessageCircle, Mail, Phone, Image as ImageIcon, Edit, Eye, EyeOff, Trash2 } from 'lucide-react'
import OptimizedImage from '@/components/OptimizedImage'
import FeedbackDisplay from '@/components/FeedbackDisplay'
import toast from 'react-hot-toast'

type Experience = Database['public']['Tables']['experiences']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
  image_url?: string | null
  image_alt_text?: string | null
}

export default function ExperienceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useOptimizedAuth()
  const { getExperienceById, prefetchExperience } = useOptimizedExperiences()
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingMessage, setBookingMessage] = useState('')
  const [showEditForm, setShowEditForm] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchExperience(params.id as string)
    }
  }, [params.id])

  const fetchExperience = async (id: string) => {
    try {
      setLoading(true)
      
      // Try to get from cache first
      const cachedExperience = getExperienceById(id)
      if (cachedExperience) {
        setExperience(cachedExperience)
        setLoading(false)
        return
      }

      // If not in cache, fetch and cache it
      const data = await prefetchExperience(id)
      if (data) {
        setExperience(data)
      } else {
        toast.error('Experience not found')
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching experience:', error)
      toast.error('Experience not found')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile || !experience) return

    setBookingLoading(true)

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          experience_id: experience.id,
          guest_id: profile.id,
          guest_message: bookingMessage,
        })

      if (error) throw error

      toast.success('Booking request sent! The host will contact you soon.')
      setShowBookingForm(false)
      setBookingMessage('')
      
      // Redirect guest to booking page
      router.push('/guest/bookings')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send booking request')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleTogglePublish = async () => {
    if (!experience) return

    setEditLoading(true)
    try {
      const { error } = await supabase
        .from('experiences')
        .update({ published: !experience.published })
        .eq('id', experience.id)

      if (error) throw error

      setExperience(prev => prev ? { ...prev, published: !prev.published } : null)
      toast.success(experience.published ? 'Experience unpublished' : 'Experience published')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update experience')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!experience) return
    const confirm = window.confirm('Are you sure you want to delete this experience? This action cannot be undone.')
    if (!confirm) return

    setEditLoading(true)
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experience.id)

      if (error) throw error

      toast.success('Experience deleted')
      router.push('/host/experiences')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete experience')
    } finally {
      setEditLoading(false)
    }
  }

  const isOwner = profile && experience && profile.id === experience.host_id

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experience...</p>
        </div>
      </div>
    )
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience not found</h2>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            
            {/* Owner Controls */}
            {isOwner && (
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  experience.published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {experience.published ? 'Published' : 'Draft'}
                </span>
                
                <button
                  onClick={handleTogglePublish}
                  disabled={editLoading}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    experience.published
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  } disabled:opacity-50`}
                >
                  {experience.published ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span>Unpublish</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>Publish</span>
                    </>
                  )}
                </button>
                
                <Link
                  href={`/host/experiences/${experience.id}/edit`}
                  className="flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>

                <button
                  onClick={handleDelete}
                  disabled={editLoading}
                  className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden">
                {experience.image_url ? (
                  <OptimizedImage
                    src={experience.image_url}
                    alt={experience.image_alt_text || experience.title}
                    className="w-full h-full"
                    priority={true}
                    placeholder="blur"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{experience.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{experience.city}</span>
                </div>
                <div className="text-2xl font-bold text-primary-600">${experience.price}</div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">About this experience</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {experience.description}
                </p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card mt-6">
              <FeedbackDisplay experienceId={experience.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Host Info */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Meet your host</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{experience.profiles.full_name}</h4>
                  {experience.profiles.verified && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">Verified Host</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{experience.profiles.bio}</p>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{experience.profiles.city}</span>
              </div>
            </div>

            {/* Contact & Booking */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Contact & Booking</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  {experience.contact_method === 'whatsapp' ? (
                    <Phone className="h-4 w-4 text-green-600" />
                  ) : (
                    <Mail className="h-4 w-4 text-blue-600" />
                  )}
                  <span className="text-gray-600">
                    Contact via {experience.contact_method === 'whatsapp' ? 'WhatsApp' : 'Email'}
                  </span>
                </div>
              </div>

              {user ? (
                isOwner ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">This is your experience</p>
                      <div className="space-y-2">
                        <Link
                          href={`/host/experiences/${experience.id}/edit`}
                          className="w-full btn-primary flex items-center justify-center"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Experience
                        </Link>
                        <Link
                          href="/host/bookings"
                          className="w-full btn-secondary flex items-center justify-center"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          View Bookings
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : profile?.role === 'guest' ? (
                  <div>
                    {!showBookingForm ? (
                      <button
                        onClick={() => setShowBookingForm(true)}
                        className="w-full btn-primary"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Request Booking
                      </button>
                    ) : (
                      <form onSubmit={handleBooking} className="space-y-4">
                        <div>
                          <label htmlFor="message" className="label">
                            Message to host
                          </label>
                          <textarea
                            id="message"
                            value={bookingMessage}
                            onChange={(e) => setBookingMessage(e.target.value)}
                            className="input h-24 resize-none"
                            placeholder="Tell the host about your group size, preferred dates, or any questions..."
                            required
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowBookingForm(false)}
                            className="flex-1 btn-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={bookingLoading}
                            className="flex-1 btn-primary disabled:opacity-50"
                          >
                            {bookingLoading ? 'Sending...' : 'Send Request'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    <p className="text-sm">You're a host. Switch to guest mode to book experiences.</p>
                  </div>
                )
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Sign in to book this experience</p>
                  <Link href="/auth/login" className="btn-primary w-full">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

