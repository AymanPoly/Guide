'use client'

import { useEffect, useState } from 'react'

interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
  className?: string
}

export default function ProgressIndicator({ 
  steps, 
  currentStep, 
  className = '' 
}: ProgressIndicatorProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const percentage = ((currentStep + 1) / steps.length) * 100
    setProgress(percentage)
  }, [currentStep, steps.length])

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
              ${index <= currentStep 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={`
              mt-2 text-xs text-center max-w-20
              ${index <= currentStep ? 'text-primary-600 font-medium' : 'text-gray-500'}
            `}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Linear progress bar for simple progress indication
interface LinearProgressProps {
  progress: number // 0-100
  color?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  className?: string
}

export function LinearProgress({ 
  progress, 
  color = 'primary', 
  size = 'md',
  showPercentage = false,
  className = ''
}: LinearProgressProps) {
  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  }

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}
