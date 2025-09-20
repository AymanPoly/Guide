'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import toast from 'react-hot-toast'

interface FeedbackFormProps {
  bookingId: string
  experienceId: string
  hostId: string
  guestId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function FeedbackForm({ 
  bookingId, 
  experienceId, 
  hostId, 
  guestId,
  onSuccess, 
  onCancel 
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!guestId) {
      toast.error('User not authenticated. Please sign in again.')
      return
    }

    setLoading(true)

    try {
      const { supabase } = await import('@/lib/supabase')
      
      const { error } = await supabase
        .from('feedback')
        .insert({
          booking_id: bookingId,
          experience_id: experienceId,
          guest_id: guestId,
          host_id: hostId,
          rating,
          comment: comment.trim() || null,
        })

      if (error) throw error

      toast.success('Thank you for your feedback!')
      onSuccess?.()
    } catch (error: any) {
      console.error('Error submitting feedback:', error)
      toast.error(error.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const isFilled = starValue <= (hoveredRating || rating)
      
      return (
        <button
          key={i}
          type="button"
          className={`p-1 transition-colors ${
            isFilled ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400`}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      )
    })
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Very Good'
      case 5: return 'Excellent'
      default: return ''
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Share Your Experience
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Help other guests by sharing how your experience went. Your feedback is valuable!
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-1">
            {renderStars()}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {getRatingText(rating)}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comment (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input h-24 resize-none"
            placeholder="Tell others about your experience..."
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 characters
          </p>
        </div>

        <div className="flex space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
