'use client'

import { useState, useEffect, useRef } from 'react'
import { BarChart3, TrendingUp, Users, Eye, MousePointer, Clock, Star, Heart } from 'lucide-react'

interface UserBehavior {
  pageViews: number
  sessionDuration: number
  clickEvents: number
  scrollDepth: number
  searchQueries: string[]
  favoriteActions: string[]
  timeOnPage: Record<string, number>
  deviceInfo: {
    type: 'mobile' | 'tablet' | 'desktop'
    browser: string
    os: string
  }
}

interface AnalyticsEvent {
  type: 'page_view' | 'click' | 'scroll' | 'search' | 'favorite' | 'booking' | 'share'
  data: any
  timestamp: number
  userId?: string
  sessionId: string
}

interface UserAnalyticsProps {
  userId?: string
  sessionId: string
  onEvent?: (event: AnalyticsEvent) => void
  className?: string
}

export default function UserAnalytics({ 
  userId, 
  sessionId, 
  onEvent,
  className = '' 
}: UserAnalyticsProps) {
  const [behavior, setBehavior] = useState<UserBehavior>({
    pageViews: 0,
    sessionDuration: 0,
    clickEvents: 0,
    scrollDepth: 0,
    searchQueries: [],
    favoriteActions: [],
    timeOnPage: {},
    deviceInfo: {
      type: 'desktop',
      browser: 'unknown',
      os: 'unknown'
    }
  })

  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const startTimeRef = useRef<number>(Date.now())
  const lastActivityRef = useRef<number>(Date.now())
  const scrollDepthRef = useRef<number>(0)

  // Track page view
  useEffect(() => {
    const trackPageView = () => {
      const event: AnalyticsEvent = {
        type: 'page_view',
        data: {
          url: window.location.href,
          title: document.title,
          referrer: document.referrer
        },
        timestamp: Date.now(),
        userId,
        sessionId
      }

      setEvents(prev => [...prev, event])
      onEvent?.(event)

      setBehavior(prev => ({
        ...prev,
        pageViews: prev.pageViews + 1,
        timeOnPage: {
          ...prev.timeOnPage,
          [window.location.pathname]: 0
        }
      }))
    }

    trackPageView()
  }, [userId, sessionId, onEvent])

  // Track device info
  useEffect(() => {
    const getDeviceInfo = () => {
      const userAgent = navigator.userAgent
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isTablet = /iPad|Android(?=.*Mobile)/i.test(userAgent)
      
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
      if (isMobile) deviceType = 'mobile'
      else if (isTablet) deviceType = 'tablet'

      let browser = 'unknown'
      if (userAgent.includes('Chrome')) browser = 'Chrome'
      else if (userAgent.includes('Firefox')) browser = 'Firefox'
      else if (userAgent.includes('Safari')) browser = 'Safari'
      else if (userAgent.includes('Edge')) browser = 'Edge'

      let os = 'unknown'
      if (userAgent.includes('Windows')) os = 'Windows'
      else if (userAgent.includes('Mac')) os = 'macOS'
      else if (userAgent.includes('Linux')) os = 'Linux'
      else if (userAgent.includes('Android')) os = 'Android'
      else if (userAgent.includes('iOS')) os = 'iOS'

      return { type: deviceType, browser, os }
    }

    setBehavior(prev => ({
      ...prev,
      deviceInfo: getDeviceInfo()
    }))
  }, [])

  // Track session duration
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const sessionDuration = now - startTimeRef.current
      
      setBehavior(prev => ({
        ...prev,
        sessionDuration: Math.floor(sessionDuration / 1000)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Track clicks
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const eventData = {
        element: target.tagName,
        className: target.className,
        id: target.id,
        text: target.textContent?.slice(0, 50),
        x: event.clientX,
        y: event.clientY
      }

      const analyticsEvent: AnalyticsEvent = {
        type: 'click',
        data: eventData,
        timestamp: Date.now(),
        userId,
        sessionId
      }

      setEvents(prev => [...prev, analyticsEvent])
      onEvent?.(analyticsEvent)

      setBehavior(prev => ({
        ...prev,
        clickEvents: prev.clickEvents + 1,
        lastActivity: Date.now()
      }))
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [userId, sessionId, onEvent])

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollDepth = Math.round((scrollTop / scrollHeight) * 100)

      if (scrollDepth > scrollDepthRef.current) {
        scrollDepthRef.current = scrollDepth
        
        setBehavior(prev => ({
          ...prev,
          scrollDepth: Math.max(prev.scrollDepth, scrollDepth)
        }))

        const analyticsEvent: AnalyticsEvent = {
          type: 'scroll',
          data: { depth: scrollDepth },
          timestamp: Date.now(),
          userId,
          sessionId
        }

        setEvents(prev => [...prev, analyticsEvent])
        onEvent?.(analyticsEvent)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [userId, sessionId, onEvent])

  // Track search queries
  const trackSearch = (query: string) => {
    const analyticsEvent: AnalyticsEvent = {
      type: 'search',
      data: { query },
      timestamp: Date.now(),
      userId,
      sessionId
    }

    setEvents(prev => [...prev, analyticsEvent])
    onEvent?.(analyticsEvent)

    setBehavior(prev => ({
      ...prev,
      searchQueries: [...prev.searchQueries, query].slice(-10) // Keep last 10
    }))
  }

  // Track favorite actions
  const trackFavorite = (action: string) => {
    const analyticsEvent: AnalyticsEvent = {
      type: 'favorite',
      data: { action },
      timestamp: Date.now(),
      userId,
      sessionId
    }

    setEvents(prev => [...prev, analyticsEvent])
    onEvent?.(analyticsEvent)

    setBehavior(prev => ({
      ...prev,
      favoriteActions: [...prev.favoriteActions, action].slice(-10)
    }))
  }

  // Track booking events
  const trackBooking = (experienceId: string, action: string) => {
    const analyticsEvent: AnalyticsEvent = {
      type: 'booking',
      data: { experienceId, action },
      timestamp: Date.now(),
      userId,
      sessionId
    }

    setEvents(prev => [...prev, analyticsEvent])
    onEvent?.(analyticsEvent)
  }

  // Track share events
  const trackShare = (platform: string, content: string) => {
    const analyticsEvent: AnalyticsEvent = {
      type: 'share',
      data: { platform, content },
      timestamp: Date.now(),
      userId,
      sessionId
    }

    setEvents(prev => [...prev, analyticsEvent])
    onEvent?.(analyticsEvent)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getEngagementScore = () => {
    const score = 
      (behavior.pageViews * 10) +
      (behavior.clickEvents * 2) +
      (behavior.scrollDepth / 10) +
      (behavior.searchQueries.length * 5) +
      (behavior.favoriteActions.length * 3)
    
    return Math.min(100, Math.round(score))
  }

  const getTopSearches = () => {
    const searchCounts = behavior.searchQueries.reduce((acc, query) => {
      acc[query] = (acc[query] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(searchCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-4 left-4 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200 flex items-center justify-center z-40 ${className}`}
        title="Analytics Dashboard"
      >
        <BarChart3 className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-4 left-4 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fade-in-up ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">User Analytics</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          ×
        </button>
      </div>

      {/* Analytics Content */}
      <div className="p-4 space-y-4">
        {/* Engagement Score */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Engagement Score</span>
            <span className="text-2xl font-bold text-primary-600">{getEngagementScore()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getEngagementScore()}%` }}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{behavior.pageViews}</div>
            <div className="text-xs text-gray-500">Page Views</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{formatDuration(behavior.sessionDuration)}</div>
            <div className="text-xs text-gray-500">Session Time</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-2">
              <MousePointer className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{behavior.clickEvents}</div>
            <div className="text-xs text-gray-500">Clicks</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto mb-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{behavior.scrollDepth}%</div>
            <div className="text-xs text-gray-500">Scroll Depth</div>
          </div>
        </div>

        {/* Search Analytics */}
        {behavior.searchQueries.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Top Searches</h4>
            <div className="space-y-1">
              {getTopSearches().map(([query, count], index) => (
                <div key={query} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 truncate">{query}</span>
                  <span className="text-gray-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Device Info */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Device Info</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Type: {behavior.deviceInfo.type}</div>
            <div>Browser: {behavior.deviceInfo.browser}</div>
            <div>OS: {behavior.deviceInfo.os}</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {events.slice(-5).reverse().map((event, index) => (
              <div key={index} className="text-xs text-gray-600 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'click' ? 'bg-blue-500' :
                  event.type === 'search' ? 'bg-green-500' :
                  event.type === 'favorite' ? 'bg-red-500' :
                  'bg-gray-500'
                }`} />
                <span className="truncate">
                  {event.type.replace('_', ' ')} - {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Analytics hook for easy integration
export function useAnalytics(userId?: string) {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  
  const trackEvent = (type: AnalyticsEvent['type'], data: any) => {
    const event: AnalyticsEvent = {
      type,
      data,
      timestamp: Date.now(),
      userId,
      sessionId
    }
    
    // Send to analytics service
    console.log('Analytics Event:', event)
    
    // You can integrate with services like Google Analytics, Mixpanel, etc.
    // Example: gtag('event', type, data)
  }

  const trackPageView = (url: string, title: string) => {
    trackEvent('page_view', { url, title })
  }

  const trackClick = (element: string, context: string) => {
    trackEvent('click', { element, context })
  }

  const trackSearch = (query: string, results: number) => {
    trackEvent('search', { query, results })
  }

  const trackBooking = (experienceId: string, step: string) => {
    trackEvent('booking', { experienceId, step })
  }

  const trackShare = (platform: string, content: string) => {
    trackEvent('share', { platform, content })
  }

  return {
    sessionId,
    trackEvent,
    trackPageView,
    trackClick,
    trackSearch,
    trackBooking,
    trackShare
  }
}
