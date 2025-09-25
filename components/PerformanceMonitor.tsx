'use client'

import { useEffect, useState, useRef } from 'react'
import { Activity, Zap, Clock, Wifi, WifiOff } from 'lucide-react'

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
  loadTime: number
  memoryUsage: number
  networkStatus: 'online' | 'offline' | 'slow'
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    loadTime: 0,
    memoryUsage: 0,
    networkStatus: 'online'
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const observerRef = useRef<PerformanceObserver | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Monitor network status
    const updateNetworkStatus = () => {
      if (!navigator.onLine) {
        setMetrics(prev => ({ ...prev, networkStatus: 'offline' }))
      } else {
        // Check connection speed
        const connection = (navigator as any).connection
        if (connection) {
          const effectiveType = connection.effectiveType
          setMetrics(prev => ({ 
            ...prev, 
            networkStatus: effectiveType === 'slow-2g' || effectiveType === '2g' ? 'slow' : 'online'
          }))
        } else {
          setMetrics(prev => ({ ...prev, networkStatus: 'online' }))
        }
      }
    }

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)
    updateNetworkStatus()

    // Monitor performance metrics
    const measurePerformance = () => {
      if (typeof window.performance === 'undefined') return

      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paintEntries = performance.getEntriesByType('paint')
      
      // First Contentful Paint
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      const fcp = fcpEntry ? fcpEntry.startTime : 0

      // Largest Contentful Paint (if supported)
      let lcp = 0
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            lcp = lastEntry.startTime
          })
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        } catch (e) {
          console.warn('LCP not supported')
        }
      }

      // Time to First Byte
      const ttfb = navigation.responseStart - navigation.requestStart

      // Load time
      const loadTime = navigation.loadEventEnd - navigation.navigationStart

      // Memory usage (if supported)
      let memoryUsage = 0
      if ('memory' in performance) {
        const memory = (performance as any).memory
        memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
      }

      setMetrics(prev => ({
        ...prev,
        fcp,
        lcp,
        ttfb,
        loadTime,
        memoryUsage
      }))
    }

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
    }

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              const fid = entry.processingStart - entry.startTime
              setMetrics(prev => ({ ...prev, fid }))
            }
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
              setMetrics(prev => ({ ...prev, cls: clsValue }))
            }
          })
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })

        observerRef.current = fidObserver
      } catch (e) {
        console.warn('Core Web Vitals not supported')
      }
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
      window.removeEventListener('load', measurePerformance)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const getPerformanceScore = (metric: keyof PerformanceMetrics, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 },
      loadTime: { good: 3000, poor: 5000 }
    }

    const threshold = thresholds[metric]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  const getScoreColor = (score: 'good' | 'needs-improvement' | 'poor') => {
    switch (score) {
      case 'good': return 'text-green-600'
      case 'needs-improvement': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
    }
  }

  const getScoreIcon = (score: 'good' | 'needs-improvement' | 'poor') => {
    switch (score) {
      case 'good': return '🟢'
      case 'needs-improvement': return '🟡'
      case 'poor': return '🔴'
    }
  }

  const formatMetric = (metric: keyof PerformanceMetrics, value: number) => {
    switch (metric) {
      case 'fcp':
      case 'lcp':
      case 'ttfb':
      case 'loadTime':
        return `${Math.round(value)}ms`
      case 'cls':
        return value.toFixed(3)
      case 'memoryUsage':
        return `${Math.round(value * 100)}%`
      default:
        return value.toString()
    }
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200 flex items-center justify-center z-40"
        title="Performance Monitor"
      >
        <Activity className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Performance</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <Zap className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            ×
          </button>
        </div>
      </div>

      {/* Network Status */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {metrics.networkStatus === 'online' ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : metrics.networkStatus === 'offline' ? (
              <WifiOff className="h-4 w-4 text-red-500" />
            ) : (
              <Wifi className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-sm text-gray-700">Network</span>
          </div>
          <span className={`text-sm font-medium ${
            metrics.networkStatus === 'online' ? 'text-green-600' : 
            metrics.networkStatus === 'offline' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {metrics.networkStatus}
          </span>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Core Web Vitals</h4>
        <div className="space-y-2">
          {[
            { key: 'fcp', label: 'First Contentful Paint' },
            { key: 'lcp', label: 'Largest Contentful Paint' },
            { key: 'fid', label: 'First Input Delay' },
            { key: 'cls', label: 'Cumulative Layout Shift' }
          ].map(({ key, label }) => {
            const value = metrics[key as keyof PerformanceMetrics] as number
            const score = getPerformanceScore(key as keyof PerformanceMetrics, value)
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {formatMetric(key as keyof PerformanceMetrics, value)}
                  </span>
                  <span className={`text-xs ${getScoreColor(score)}`}>
                    {getScoreIcon(score)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Additional Metrics */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 animate-fade-in-down">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Metrics</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Time to First Byte</span>
              <span className="text-xs text-gray-500">
                {formatMetric('ttfb', metrics.ttfb)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Load Time</span>
              <span className="text-xs text-gray-500">
                {formatMetric('loadTime', metrics.loadTime)}
              </span>
            </div>
            {metrics.memoryUsage > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Memory Usage</span>
                <span className="text-xs text-gray-500">
                  {formatMetric('memoryUsage', metrics.memoryUsage)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}