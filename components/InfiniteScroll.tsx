'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface InfiniteScrollProps {
  children: React.ReactNode
  hasMore: boolean
  loadMore: () => void
  loading: boolean
  threshold?: number
  rootMargin?: string
  className?: string
}

export default function InfiniteScroll({
  children,
  hasMore,
  loadMore,
  loading,
  threshold = 0.1,
  rootMargin = '100px',
  className = ''
}: InfiniteScrollProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    setIsIntersecting(entry.isIntersecting)
    
    if (entry.isIntersecting && hasMore && !loading) {
      loadMore()
    }
  }, [hasMore, loading, loadMore])

  useEffect(() => {
    if (typeof window === 'undefined') return

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    })

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, threshold, rootMargin])

  return (
    <div className={className}>
      {children}
      
      {/* Intersection Observer Sentinel */}
      <div ref={sentinelRef} className="h-4" />
      
      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner variant="dots" text="Loading more experiences..." />
        </div>
      )}
      
      {/* End of Content */}
      {!hasMore && !loading && (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm">You've reached the end!</p>
        </div>
      )}
    </div>
  )
}

// Hook for infinite scroll logic
export function useInfiniteScroll<T>(
  fetchData: (page: number) => Promise<T[]>,
  initialData: T[] = [],
  pageSize: number = 10
) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      const newData = await fetchData(page + 1)
      
      if (newData.length === 0) {
        setHasMore(false)
      } else {
        setData(prev => [...prev, ...newData])
        setPage(prev => prev + 1)
        
        // If we got less than pageSize, we've reached the end
        if (newData.length < pageSize) {
          setHasMore(false)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, fetchData, pageSize])

  const reset = useCallback(() => {
    setData(initialData)
    setPage(0)
    setHasMore(true)
    setError(null)
  }, [initialData])

  return {
    data,
    loading,
    hasMore,
    error,
    loadMore,
    reset
  }
}
