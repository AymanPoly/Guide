'use client'

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text' | 'image' | 'button'
  className?: string
  count?: number
}

export default function LoadingSkeleton({ 
  type = 'card', 
  className = '', 
  count = 1 
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        )
      
      case 'list':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'text':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        )
      
      case 'image':
        return (
          <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}>
            <div className="aspect-video bg-gray-200 rounded-lg"></div>
          </div>
        )
      
      case 'button':
        return (
          <div className={`animate-pulse h-10 bg-gray-200 rounded ${className}`}></div>
        )
      
      default:
        return (
          <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
        )
    }
  }

  if (count > 1) {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            {renderSkeleton()}
          </div>
        ))}
      </div>
    )
  }

  return renderSkeleton()
}
