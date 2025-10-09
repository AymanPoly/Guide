'use client'

import { useState, useEffect } from 'react'
import { Star, User, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Feedback = {
  id: string
  booking_id: string
  experience_id: string
  guest_id: string
  host_id: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
  profiles: Database['public']['Tables']['profiles']['Row']
}

interface FeedbackDisplayProps {
  experienceId: string
  showAll?: boolean
  maxItems?: number
}

export default function FeedbackDisplay({ 
  experienceId, 
  showAll = false, 
  maxItems = 3 
}: FeedbackDisplayProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(false)
  const [showAllFeedback, setShowAllFeedback] = useState(showAll)

  useEffect(() => {
    fetchFeedback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceId])

  const fetchFeedback = async () => {
    try {
      // The correct way to join profiles is to specify the foreign key: guest_id
      // so we use profiles!guest_id(*)
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          profiles:profiles!guest_id(*)
        `)
        .eq('experience_id', experienceId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeedback(data || [])
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const isFilled = i < rating
      return (
        <Star
          key={i}
          className={`h-4 w-4 ${
            isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      )
    })
  }

  const getAverageRating = () => {
    if (feedback.length === 0) return 0
    const total = feedback.reduce((sum, f) => sum + f.rating, 0)
    return Math.round((total / feedback.length) * 10) / 10
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    feedback.forEach(f => {
      distribution[f.rating as keyof typeof distribution]++
    })
    return distribution
  }

  const displayFeedback = showAllFeedback ? feedback : feedback.slice(0, maxItems)

  // Remove loading state - show content immediately

  if (feedback.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to share your experience!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {getAverageRating().toFixed(1)}
            </h3>
            <div className="flex items-center space-x-1 mb-1">
              {renderStars(Math.round(getAverageRating()))}
            </div>
            <p className="text-sm text-gray-600">
              Based on {feedback.length} review{feedback.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = getRatingDistribution()[rating as keyof ReturnType<typeof getRatingDistribution>]
            const percentage = feedback.length > 0 ? (count / feedback.length) * 100 : 0
            
            return (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-4">{rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">
          Reviews ({feedback.length})
        </h4>
        
        {displayFeedback.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {review.profiles?.full_name}
                  </p>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {review.comment && (
              <p className="text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        ))}

        {!showAllFeedback && feedback.length > maxItems && (
          <button
            onClick={() => setShowAllFeedback(true)}
            className="w-full py-3 text-primary-600 hover:text-primary-700 font-medium border border-primary-200 rounded-lg hover:border-primary-300 transition-colors"
          >
            Show all {feedback.length} reviews
          </button>
        )}
      </div>
    </div>
  )
}
