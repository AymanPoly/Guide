'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../../optimized-providers'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'

type Experience = Database['public']['Tables']['experiences']['Row']

export default function EditExperiencePage() {
  const params = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    price: '',
    contact_method: 'whatsapp' as 'whatsapp' | 'email',
    published: false,
    image_url: '',
    image_alt_text: '',
  })

  useEffect(() => {
    if (params.id) {
      fetchExperience(params.id as string)
    }
  }, [params.id])

  const fetchExperience = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setFormData({
        title: data.title,
        description: data.description,
        city: data.city,
        price: data.price,
        contact_method: data.contact_method,
        published: data.published,
        image_url: data.image_url || '',
        image_alt_text: data.image_alt_text || '',
      })
    } catch (error) {
      console.error('Error fetching experience:', error)
      toast.error('Experience not found')
      router.push('/host/experiences')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !params.id) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from('experiences')
        .update({
          title: formData.title,
          description: formData.description,
          city: formData.city,
          price: formData.price,
          contact_method: formData.contact_method,
          published: formData.published,
          image_url: formData.image_url,
          image_alt_text: formData.image_alt_text,
        })
        .eq('id', params.id)

      if (error) throw error

      toast.success('Experience updated successfully!')
      router.push('/host/experiences')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update experience')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = (imageUrl: string, altText: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: imageUrl,
      image_alt_text: altText,
    }))
  }

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      image_url: '',
      image_alt_text: '',
    }))
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/host/experiences" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Experiences</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Experience</h1>
          <p className="text-gray-600">Update your experience details and settings.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Experience Image */}
            <div>
              <label className="label">
                Experience Image
              </label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                currentImageUrl={formData.image_url}
                currentAltText={formData.image_alt_text}
                experienceId={params.id as string}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="title" className="label">
                Experience Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Traditional Cooking Class in My Kitchen"
              />
            </div>

            <div>
              <label htmlFor="description" className="label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="input resize-none"
                placeholder="Describe what guests will experience, what they'll learn, and what makes it special..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="label">
                  City *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Tokyo, Paris, New York"
                />
              </div>

              <div>
                <label htmlFor="price" className="label">
                  Price *
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., $50 per person, €30 for 2 people"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact_method" className="label">
                Preferred Contact Method *
              </label>
              <select
                id="contact_method"
                name="contact_method"
                required
                value={formData.contact_method}
                onChange={handleChange}
                className="input"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                Publish this experience (make it visible to guests)
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/host/experiences" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Updating...' : 'Update Experience'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
