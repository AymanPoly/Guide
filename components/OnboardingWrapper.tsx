'use client'

import { useEffect } from 'react'
import UserOnboarding from './UserOnboarding'
import { useOnboarding } from './UserOnboarding'
import { guideOnboardingSteps } from './UserOnboarding'

export default function OnboardingWrapper() {
  const { 
    hasCompletedOnboarding, 
    isOnboardingActive, 
    startOnboarding, 
    completeOnboarding, 
    skipOnboarding 
  } = useOnboarding()

  // Auto-start onboarding for new users
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      // Delay to ensure page is loaded
      const timer = setTimeout(() => {
        startOnboarding()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCompletedOnboarding, startOnboarding])

  return (
    <UserOnboarding
      steps={guideOnboardingSteps}
      onComplete={completeOnboarding}
      onSkip={skipOnboarding}
      isActive={isOnboardingActive}
    />
  )
}
