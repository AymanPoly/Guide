'use client'

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'text' | 'image' | 'button'
  lines?: number
  className?: string
}

export default function SkeletonLoader({ 
  variant = 'card', 
  lines = 3, 
  className = '' 
}: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`card animate-pulse ${className}`}>
            <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="flex justify-between items-center pt-3">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        )
      
      case 'list':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
              <div 
                key={i} 
                className={`h-3 bg-gray-200 rounded animate-pulse ${
                  i === lines - 1 ? 'w-3/4' : 'w-full'
                }`}
              ></div>
            ))}
          </div>
        )
      
      case 'image':
        return (
          <div className={`aspect-video bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
        )
      
      case 'button':
        return (
          <div className={`h-10 bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
        )
      
      default:
        return (
          <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`}></div>
        )
    }
  }

  return renderSkeleton()
}

// Skeleton grid for multiple cards
export function SkeletonGrid({ 
  count = 6, 
  className = '' 
}: { 
  count?: number
  className?: string 
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLoader key={i} variant="card" />
      ))}
    </div>
  )
}
