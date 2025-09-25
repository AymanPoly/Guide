import Link from 'next/link'
import { MapPin, User, Star, Image as ImageIcon } from 'lucide-react'
import { Database } from '@/lib/supabase'
import OptimizedImage from './OptimizedImage'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Experience = Database['public']['Tables']['experiences']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

interface ExperienceCardProps {
  experience: Experience
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const [avgRating, setAvgRating] = useState<number | null>(null)
  const [ratingsCount, setRatingsCount] = useState<number>(0)

  useEffect(() => {
    let isMounted = true
    const fetchAverage = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('rating')
          .eq('experience_id', experience.id)

        if (error) throw error

        const ratings = (data || []).map(r => r.rating as number)
        if (!isMounted) return
        if (ratings.length === 0) {
          setAvgRating(null)
          setRatingsCount(0)
          return
        }
        const sum = ratings.reduce((a, b) => a + b, 0)
        setAvgRating(Math.round((sum / ratings.length) * 10) / 10)
        setRatingsCount(ratings.length)
      } catch {
        if (!isMounted) return
        setAvgRating(null)
        setRatingsCount(0)
      }
    }

    fetchAverage()
    return () => { isMounted = false }
  }, [experience.id])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <Link
      href={`/experiences/${experience.id}`}
      className="card hover:shadow-lg transition-shadow duration-200"
    > 
    <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
      {experience.image_url ? (
        <img
          src={experience.image_url}
          alt={experience.image_alt_text || experience.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <ImageIcon className="h-12 w-12 text-gray-400" />
        </div>
      )}
    </div>
     
      <h4 className="font-semibold text-lg mb-2 line-clamp-2">{experience.title}</h4>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{experience.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>{experience.city}</span>
        </div>
        <span className="font-semibold text-primary-600">${experience.price}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Host */}
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{experience.profiles.full_name}</p>
            {experience.profiles.verified && (
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-500">Verified</span>
              </div>
            )}
          </div>
          {/* Rating */}
          <div className="ml-3 flex items-center space-x-1 text-xs text-gray-600">
            {avgRating !== null ? (
              <>
                <div className="flex items-center space-x-0.5">
                  {renderStars(avgRating)}
                </div>
                <span className="font-semibold text-gray-800">{avgRating.toFixed(1)}</span>
                <span>({ratingsCount})</span>
              </>
            ) : (
              <span className="text-gray-400">No reviews</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

