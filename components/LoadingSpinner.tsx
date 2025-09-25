interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  variant?: 'default' | 'dots' | 'pulse' | 'skeleton'
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  text, 
  variant = 'default',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-pulse`}></div>
        )
      case 'skeleton':
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        )
      default:
        return (
          <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-primary-600 ${sizeClasses[size]}`}></div>
        )
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {renderSpinner()}
      {text && (
        <p className="mt-4 text-gray-600 animate-pulse text-sm font-medium">
          {text}
        </p>
      )}
    </div>
  )
}

