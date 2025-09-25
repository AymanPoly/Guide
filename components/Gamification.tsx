'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, Heart, MapPin, Calendar, Users, Zap, Crown, Target, Award } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  requirement: number
  current: number
  unlocked: boolean
  unlockedAt?: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  points: number
  unlocked: boolean
  unlockedAt?: Date
  category: 'explorer' | 'social' | 'booking' | 'review' | 'special'
}

interface UserStats {
  totalBookings: number
  totalReviews: number
  totalFavorites: number
  citiesVisited: string[]
  experiencesCompleted: number
  daysActive: number
  consecutiveDays: number
  level: number
  experience: number
  nextLevelExp: number
}

interface GamificationProps {
  userId: string
  stats: UserStats
  onBadgeUnlocked?: (badge: Badge) => void
  onAchievementUnlocked?: (achievement: Achievement) => void
  className?: string
}

export default function Gamification({ 
  userId, 
  stats, 
  onBadgeUnlocked,
  onAchievementUnlocked,
  className = '' 
}: GamificationProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'badges' | 'achievements' | 'leaderboard'>('badges')

  // Initialize badges
  useEffect(() => {
    const initialBadges: Badge[] = [
      {
        id: 'first_booking',
        name: 'First Steps',
        description: 'Make your first booking',
        icon: Calendar,
        color: 'bg-blue-500',
        requirement: 1,
        current: stats.totalBookings,
        unlocked: stats.totalBookings >= 1,
        rarity: 'common'
      },
      {
        id: 'explorer',
        name: 'Explorer',
        description: 'Visit 3 different cities',
        icon: MapPin,
        color: 'bg-green-500',
        requirement: 3,
        current: stats.citiesVisited.length,
        unlocked: stats.citiesVisited.length >= 3,
        rarity: 'rare'
      },
      {
        id: 'reviewer',
        name: 'Reviewer',
        description: 'Write 5 reviews',
        icon: Star,
        color: 'bg-yellow-500',
        requirement: 5,
        current: stats.totalReviews,
        unlocked: stats.totalReviews >= 5,
        rarity: 'common'
      },
      {
        id: 'loyal_customer',
        name: 'Loyal Customer',
        description: 'Make 10 bookings',
        icon: Heart,
        color: 'bg-red-500',
        requirement: 10,
        current: stats.totalBookings,
        unlocked: stats.totalBookings >= 10,
        rarity: 'epic'
      },
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Favorite 20 experiences',
        icon: Users,
        color: 'bg-purple-500',
        requirement: 20,
        current: stats.totalFavorites,
        unlocked: stats.totalFavorites >= 20,
        rarity: 'rare'
      },
      {
        id: 'world_traveler',
        name: 'World Traveler',
        description: 'Visit 10 different cities',
        icon: Trophy,
        color: 'bg-orange-500',
        requirement: 10,
        current: stats.citiesVisited.length,
        unlocked: stats.citiesVisited.length >= 10,
        rarity: 'legendary'
      },
      {
        id: 'streak_master',
        name: 'Streak Master',
        description: 'Be active for 7 consecutive days',
        icon: Zap,
        color: 'bg-indigo-500',
        requirement: 7,
        current: stats.consecutiveDays,
        unlocked: stats.consecutiveDays >= 7,
        rarity: 'epic'
      },
      {
        id: 'completionist',
        name: 'Completionist',
        description: 'Complete 50 experiences',
        icon: Target,
        color: 'bg-pink-500',
        requirement: 50,
        current: stats.experiencesCompleted,
        unlocked: stats.experiencesCompleted >= 50,
        rarity: 'legendary'
      }
    ]

    setBadges(initialBadges)
  }, [stats])

  // Initialize achievements
  useEffect(() => {
    const initialAchievements: Achievement[] = [
      {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Book your first experience within 24 hours of signing up',
        icon: Calendar,
        points: 100,
        unlocked: stats.daysActive <= 1 && stats.totalBookings >= 1,
        category: 'booking'
      },
      {
        id: 'city_hopper',
        name: 'City Hopper',
        description: 'Book experiences in 5 different cities',
        icon: MapPin,
        points: 250,
        unlocked: stats.citiesVisited.length >= 5,
        category: 'explorer'
      },
      {
        id: 'review_expert',
        name: 'Review Expert',
        description: 'Write detailed reviews for 10 experiences',
        icon: Star,
        points: 200,
        unlocked: stats.totalReviews >= 10,
        category: 'review'
      },
      {
        id: 'social_connector',
        name: 'Social Connector',
        description: 'Share 5 experiences with friends',
        icon: Users,
        points: 150,
        unlocked: false, // This would need to be tracked separately
        category: 'social'
      },
      {
        id: 'loyalty_champion',
        name: 'Loyalty Champion',
        description: 'Maintain a 30-day activity streak',
        icon: Crown,
        points: 500,
        unlocked: stats.consecutiveDays >= 30,
        category: 'special'
      },
      {
        id: 'experience_master',
        name: 'Experience Master',
        description: 'Complete 100 different experiences',
        icon: Award,
        points: 1000,
        unlocked: stats.experiencesCompleted >= 100,
        category: 'special'
      }
    ]

    setAchievements(initialAchievements)
  }, [stats])

  // Check for new unlocks
  useEffect(() => {
    badges.forEach(badge => {
      if (!badge.unlocked && badge.current >= badge.requirement) {
        const updatedBadge = { ...badge, unlocked: true, unlockedAt: new Date() }
        setBadges(prev => prev.map(b => b.id === badge.id ? updatedBadge : b))
        onBadgeUnlocked?.(updatedBadge)
      }
    })

    achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.unlocked) {
        const updatedAchievement = { ...achievement, unlocked: true, unlockedAt: new Date() }
        setAchievements(prev => prev.map(a => a.id === achievement.id ? updatedAchievement : a))
        onAchievementUnlocked?.(updatedAchievement)
      }
    })
  }, [badges, achievements, onBadgeUnlocked, onAchievementUnlocked])

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50'
      case 'rare': return 'border-blue-300 bg-blue-50'
      case 'epic': return 'border-purple-300 bg-purple-50'
      case 'legendary': return 'border-yellow-300 bg-yellow-50'
    }
  }

  const getRarityIcon = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return '⚪'
      case 'rare': return '🔵'
      case 'epic': return '🟣'
      case 'legendary': return '🟡'
    }
  }

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'explorer': return 'text-green-600'
      case 'social': return 'text-blue-600'
      case 'booking': return 'text-purple-600'
      case 'review': return 'text-yellow-600'
      case 'special': return 'text-red-600'
    }
  }

  const unlockedBadges = badges.filter(b => b.unlocked)
  const lockedBadges = badges.filter(b => !b.unlocked)
  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0)

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 flex items-center justify-center z-40 ${className}`}
        title="Achievements & Badges"
      >
        <Trophy className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fade-in-up max-h-96 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">Achievements</h3>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Level {stats.level}
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          ×
        </button>
      </div>

      {/* Progress Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Experience Points</span>
          <span className="text-sm text-gray-500">{stats.experience}/{stats.nextLevelExp} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(stats.experience / stats.nextLevelExp) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Total Points: {totalPoints}</span>
          <span>Badges: {unlockedBadges.length}/{badges.length}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'badges', label: 'Badges', count: unlockedBadges.length },
          { id: 'achievements', label: 'Achievements', count: unlockedAchievements.length },
          { id: 'leaderboard', label: 'Leaderboard', count: 0 }
        ].map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-1 py-3 px-4 text-sm transition-colors duration-200 ${
              activeTab === id
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{label}</span>
            {count > 0 && (
              <span className="bg-primary-100 text-primary-800 text-xs px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {activeTab === 'badges' && (
          <div className="space-y-3">
            {/* Unlocked Badges */}
            {unlockedBadges.map(badge => (
              <div key={badge.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className={`w-10 h-10 ${badge.color} rounded-full flex items-center justify-center`}>
                  <badge.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{badge.name}</h4>
                    <span className="text-xs">{getRarityIcon(badge.rarity)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                  {badge.unlockedAt && (
                    <p className="text-xs text-green-600">
                      Unlocked {badge.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Locked Badges */}
            {lockedBadges.map(badge => (
              <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <badge.icon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-700">{badge.name}</h4>
                    <span className="text-xs">{getRarityIcon(badge.rarity)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{badge.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-gray-400 h-1 rounded-full"
                        style={{ width: `${(badge.current / badge.requirement) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {badge.current}/{badge.requirement}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-3">
            {/* Unlocked Achievements */}
            {unlockedAchievements.map(achievement => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <achievement.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                    <span className="text-sm font-semibold text-yellow-600">+{achievement.points} XP</span>
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(achievement.category)} bg-opacity-20`}>
                      {achievement.category}
                    </span>
                    {achievement.unlockedAt && (
                      <span className="text-xs text-yellow-600">
                        Unlocked {achievement.unlockedAt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Locked Achievements */}
            {lockedAchievements.map(achievement => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <achievement.icon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-700">{achievement.name}</h4>
                    <span className="text-sm text-gray-500">+{achievement.points} XP</span>
                  </div>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(achievement.category)} bg-opacity-20`}>
                    {achievement.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Leaderboard</h4>
            <p className="text-sm text-gray-600">
              Coming soon! Compete with other users and climb the rankings.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Gamification hook for easy integration
export function useGamification(userId: string) {
  const [stats, setStats] = useState<UserStats>({
    totalBookings: 0,
    totalReviews: 0,
    totalFavorites: 0,
    citiesVisited: [],
    experiencesCompleted: 0,
    daysActive: 0,
    consecutiveDays: 0,
    level: 1,
    experience: 0,
    nextLevelExp: 100
  })

  const updateStats = (updates: Partial<UserStats>) => {
    setStats(prev => {
      const newStats = { ...prev, ...updates }
      
      // Calculate level based on experience
      const newLevel = Math.floor(newStats.experience / 100) + 1
      const newNextLevelExp = newLevel * 100
      
      return {
        ...newStats,
        level: newLevel,
        nextLevelExp: newNextLevelExp
      }
    })
  }

  const addExperience = (points: number) => {
    setStats(prev => ({
      ...prev,
      experience: prev.experience + points
    }))
  }

  const recordBooking = (city: string) => {
    setStats(prev => ({
      ...prev,
      totalBookings: prev.totalBookings + 1,
      citiesVisited: prev.citiesVisited.includes(city) 
        ? prev.citiesVisited 
        : [...prev.citiesVisited, city],
      experiencesCompleted: prev.experiencesCompleted + 1
    }))
    addExperience(50)
  }

  const recordReview = () => {
    setStats(prev => ({
      ...prev,
      totalReviews: prev.totalReviews + 1
    }))
    addExperience(25)
  }

  const recordFavorite = () => {
    setStats(prev => ({
      ...prev,
      totalFavorites: prev.totalFavorites + 1
    }))
    addExperience(10)
  }

  return {
    stats,
    updateStats,
    addExperience,
    recordBooking,
    recordReview,
    recordFavorite
  }
}
