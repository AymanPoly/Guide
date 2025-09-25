'use client'

import { useState, useEffect, useMemo } from 'react'
import { Star, MapPin, Clock, Users, TrendingUp, Heart, Bookmark } from 'lucide-react'
import { Database } from '@/lib/supabase'

type Experience = Database['public']['Tables']['experiences']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

interface UserPreferences {
  preferredCities: string[]
  priceRange: { min: number; max: number }
  experienceTypes: string[]
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'any'
  groupSize: 'solo' | 'couple' | 'group' | 'any'
  activityLevel: 'low' | 'medium' | 'high'
}

interface RecommendationEngine {
  experiences: Experience[]
  userPreferences: UserPreferences
  userHistory: string[]
  similarUsers: string[]
}

export default function SmartRecommendations({ 
  experiences, 
  userPreferences, 
  userHistory = [],
  similarUsers = []
}: RecommendationEngine) {
  const [recommendations, setRecommendations] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'personalized' | 'trending' | 'nearby'>('personalized')

  // Collaborative filtering algorithm
  const collaborativeFiltering = useMemo(() => {
    if (similarUsers.length === 0) return []

    const similarUserExperiences = experiences.filter(exp => 
      similarUsers.some(userId => 
        userHistory.includes(exp.id) || 
        exp.profiles.id === userId
      )
    )

    // Calculate similarity scores
    const scoredExperiences = similarUserExperiences.map(exp => {
      let score = 0
      
      // City preference match
      if (userPreferences.preferredCities.includes(exp.city)) {
        score += 3
      }
      
      // Price range match
      const price = parseInt(exp.price)
      if (price >= userPreferences.priceRange.min && price <= userPreferences.priceRange.max) {
        score += 2
      }
      
      // Experience type match
      if (userPreferences.experienceTypes.some(type => 
        exp.title.toLowerCase().includes(type.toLowerCase()) ||
        exp.description.toLowerCase().includes(type.toLowerCase())
      )) {
        score += 2
      }
      
      return { ...exp, score }
    })

    return scoredExperiences
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }, [experiences, userPreferences, similarUsers, userHistory])

  // Content-based filtering
  const contentBasedFiltering = useMemo(() => {
    return experiences
      .filter(exp => {
        // City preference
        const cityMatch = userPreferences.preferredCities.length === 0 || 
          userPreferences.preferredCities.includes(exp.city)
        
        // Price range
        const price = parseInt(exp.price)
        const priceMatch = price >= userPreferences.priceRange.min && 
          price <= userPreferences.priceRange.max
        
        // Experience type
        const typeMatch = userPreferences.experienceTypes.length === 0 ||
          userPreferences.experienceTypes.some(type => 
            exp.title.toLowerCase().includes(type.toLowerCase()) ||
            exp.description.toLowerCase().includes(type.toLowerCase())
          )
        
        return cityMatch && priceMatch && typeMatch
      })
      .slice(0, 6)
  }, [experiences, userPreferences])

  // Trending experiences
  const trendingExperiences = useMemo(() => {
    return experiences
      .sort((a, b) => {
        // Sort by creation date (newer first) and add some randomness
        const dateScore = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        const randomScore = Math.random() * 1000
        return dateScore + randomScore
      })
      .slice(0, 6)
  }, [experiences])

  // Nearby experiences (mock implementation)
  const nearbyExperiences = useMemo(() => {
    return experiences
      .filter(exp => userPreferences.preferredCities.includes(exp.city))
      .slice(0, 6)
  }, [experiences, userPreferences])

  useEffect(() => {
    setLoading(true)
    
    const timer = setTimeout(() => {
      switch (activeTab) {
        case 'personalized':
          setRecommendations(collaborativeFiltering)
          break
        case 'trending':
          setRecommendations(trendingExperiences)
          break
        case 'nearby':
          setRecommendations(nearbyExperiences)
          break
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [activeTab, collaborativeFiltering, trendingExperiences, nearbyExperiences])

  const getRecommendationReason = (experience: Experience) => {
    const reasons = []
    
    if (userPreferences.preferredCities.includes(experience.city)) {
      reasons.push('Matches your preferred cities')
    }
    
    const price = parseInt(experience.price)
    if (price >= userPreferences.priceRange.min && price <= userPreferences.priceRange.max) {
      reasons.push('Fits your budget')
    }
    
    if (userHistory.includes(experience.id)) {
      reasons.push('You\'ve shown interest before')
    }
    
    if (similarUsers.some(userId => experience.profiles.id === userId)) {
      reasons.push('Liked by similar users')
    }
    
    return reasons[0] || 'Recommended for you'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'personalized', label: 'For You', icon: Heart },
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'nearby', label: 'Nearby', icon: MapPin }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-600">
              {activeTab === 'personalized' 
                ? 'Complete your profile to get personalized recommendations'
                : 'Check back later for new experiences'
              }
            </p>
          </div>
        ) : (
          recommendations.map((experience, index) => (
            <div key={experience.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {experience.image_url ? (
                    <img
                      src={experience.image_url}
                      alt={experience.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {experience.title}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {experience.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{experience.city}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>2-4 hours</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>Small group</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary-600">
                          ${experience.price}
                        </div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors duration-200">
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recommendation Reason */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full" />
                      <span className="text-xs text-primary-600 font-medium">
                        {getRecommendationReason(experience)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {recommendations.length > 0 && (
        <div className="text-center">
          <button className="btn-primary">
            Load More Recommendations
          </button>
        </div>
      )}
    </div>
  )
}

// Recommendation preferences component
interface RecommendationPreferencesProps {
  preferences: UserPreferences
  onUpdate: (preferences: UserPreferences) => void
}

export function RecommendationPreferences({ preferences, onUpdate }: RecommendationPreferencesProps) {
  const [localPreferences, setLocalPreferences] = useState(preferences)

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    const updated = { ...localPreferences, [key]: value }
    setLocalPreferences(updated)
    onUpdate(updated)
  }

  const cities = ['Marrakech', 'Casablanca', 'Fes', 'Rabat', 'Tangier', 'Agadir']
  const experienceTypes = ['Cultural', 'Adventure', 'Food', 'Nature', 'History', 'Art']
  const timeSlots = [
    { value: 'morning', label: 'Morning (6AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
    { value: 'evening', label: 'Evening (6PM - 12AM)' },
    { value: 'any', label: 'Any time' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendation Preferences</h3>
        <p className="text-sm text-gray-600">
          Help us personalize your experience recommendations
        </p>
      </div>

      {/* Preferred Cities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Cities
        </label>
        <div className="flex flex-wrap gap-2">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => {
                const updated = localPreferences.preferredCities.includes(city)
                  ? localPreferences.preferredCities.filter(c => c !== city)
                  : [...localPreferences.preferredCities, city]
                updatePreference('preferredCities', updated)
              }}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                localPreferences.preferredCities.includes(city)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range (per person)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={localPreferences.priceRange.min}
            onChange={(e) => updatePreference('priceRange', {
              ...localPreferences.priceRange,
              min: parseInt(e.target.value) || 0
            })}
            className="input w-24"
            placeholder="Min"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            value={localPreferences.priceRange.max}
            onChange={(e) => updatePreference('priceRange', {
              ...localPreferences.priceRange,
              max: parseInt(e.target.value) || 1000
            })}
            className="input w-24"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Experience Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience Types
        </label>
        <div className="flex flex-wrap gap-2">
          {experienceTypes.map(type => (
            <button
              key={type}
              onClick={() => {
                const updated = localPreferences.experienceTypes.includes(type)
                  ? localPreferences.experienceTypes.filter(t => t !== type)
                  : [...localPreferences.experienceTypes, type]
                updatePreference('experienceTypes', updated)
              }}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                localPreferences.experienceTypes.includes(type)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Time of Day */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Time
        </label>
        <div className="space-y-2">
          {timeSlots.map(slot => (
            <label key={slot.value} className="flex items-center space-x-3">
              <input
                type="radio"
                name="timeOfDay"
                value={slot.value}
                checked={localPreferences.timeOfDay === slot.value}
                onChange={() => updatePreference('timeOfDay', slot.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{slot.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
