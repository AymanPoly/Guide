'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ArrowRight, ArrowLeft, Check, Star, MapPin, MessageCircle } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  content?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

interface UserOnboardingProps {
  steps: OnboardingStep[]
  onComplete: () => void
  onSkip: () => void
  isActive: boolean
}

export default function UserOnboarding({ 
  steps, 
  onComplete, 
  onSkip, 
  isActive 
}: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && steps.length > 0) {
      setIsVisible(true)
      highlightTargetElement(steps[currentStep].target)
    }
  }, [isActive, currentStep, steps])

  const highlightTargetElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      setTargetElement(element)
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const completeOnboarding = () => {
    setIsVisible(false)
    onComplete()
  }

  const skipOnboarding = () => {
    setIsVisible(false)
    onSkip()
  }

  if (!isVisible || !isActive) return null

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={skipOnboarding}
      />

      {/* Spotlight */}
      {targetElement && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: targetElement.offsetTop - 8,
            left: targetElement.offsetLeft - 8,
            width: targetElement.offsetWidth + 16,
            height: targetElement.offsetHeight + 16,
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            boxShadow: '0 0 0 4px rgba(14, 165, 233, 0.2)',
            animation: 'pulse 2s infinite'
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl p-6 max-w-sm animate-fade-in-up"
        style={{
          top: targetElement ? `${targetElement.offsetTop + targetElement.offsetHeight + 20}px` : '50%',
          left: targetElement ? `${targetElement.offsetLeft}px` : '50%',
          transform: targetElement ? 'none' : 'translate(-50%, -50%)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">
                {currentStep + 1}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={skipOnboarding}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {currentStepData.description}
          </p>
          {currentStepData.content}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={skipOnboarding}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Skip
            </button>
            <button
              onClick={nextStep}
              className="flex items-center space-x-1 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
              {currentStep === steps.length - 1 ? (
                <Check className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// Predefined onboarding steps for the Guide app
export const guideOnboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Guide!',
    description: 'Let\'s take a quick tour to help you get started with finding amazing local experiences.',
    target: 'body',
    position: 'top',
    content: (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Star className="h-4 w-4 text-yellow-500" />
        <span>Discover authentic local experiences</span>
      </div>
    )
  },
  {
    id: 'search',
    title: 'Search for Experiences',
    description: 'Use the search bar to find experiences by city. You can also browse all available experiences.',
    target: '[data-search-bar]',
    position: 'bottom',
    content: (
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 Tip: Try searching for cities like "Marrakech" or "Casablanca"
        </p>
      </div>
    )
  },
  {
    id: 'experience-card',
    title: 'Explore Experiences',
    description: 'Click on any experience card to view details, see photos, and read reviews from other travelers.',
    target: '[data-experience-card]:first-child',
    position: 'right',
    content: (
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <MapPin className="h-3 w-3" />
          <span>Location</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-3 w-3" />
          <span>Rating</span>
        </div>
      </div>
    )
  },
  {
    id: 'booking',
    title: 'Book Your Experience',
    description: 'Once you find an experience you like, click to view details and book directly with the host.',
    target: '[data-booking-button]',
    position: 'top',
    content: (
      <div className="bg-green-50 p-3 rounded-lg">
        <p className="text-xs text-green-800">
          ✅ All hosts are verified and experiences are authentic
        </p>
      </div>
    )
  },
  {
    id: 'messaging',
    title: 'Connect with Hosts',
    description: 'Use our messaging system to ask questions, coordinate details, and get to know your host before your experience.',
    target: '[data-messaging-button]',
    position: 'left',
    content: (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <MessageCircle className="h-4 w-4" />
        <span>Real-time messaging with hosts</span>
      </div>
    )
  },
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Set up your profile to help hosts get to know you and to receive personalized recommendations.',
    target: '[data-profile-button]',
    position: 'bottom',
    content: (
      <div className="bg-purple-50 p-3 rounded-lg">
        <p className="text-xs text-purple-800">
          🎯 Complete profiles get better recommendations
        </p>
      </div>
    )
  }
]

// Onboarding hook
export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [isOnboardingActive, setIsOnboardingActive] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem('onboardingCompleted')
    if (completed === 'true') {
      setHasCompletedOnboarding(true)
    }
  }, [])

  const startOnboarding = () => {
    setIsOnboardingActive(true)
  }

  const completeOnboarding = () => {
    setIsOnboardingActive(false)
    setHasCompletedOnboarding(true)
    localStorage.setItem('onboardingCompleted', 'true')
  }

  const skipOnboarding = () => {
    setIsOnboardingActive(false)
    setHasCompletedOnboarding(true)
    localStorage.setItem('onboardingCompleted', 'true')
  }

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false)
    setIsOnboardingActive(false)
    localStorage.removeItem('onboardingCompleted')
  }

  return {
    hasCompletedOnboarding,
    isOnboardingActive,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  }
}
