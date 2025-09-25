'use client'

import { useEffect, useState } from 'react'
import { Eye, EyeOff, Volume2, VolumeX, Type, MousePointer } from 'lucide-react'

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  focusVisible: boolean
}

export default function AccessibilityEnhancer() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: false,
    focusVisible: true
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load saved settings from localStorage
    const saved = localStorage.getItem('accessibilitySettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }

    // Check for system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches

    setSettings(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast
    }))
  }, [])

  useEffect(() => {
    // Apply accessibility settings
    applyAccessibilitySettings(settings)
    
    // Save to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings))
  }, [settings])

  const applyAccessibilitySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement

    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Large text
    if (newSettings.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Screen reader optimizations
    if (newSettings.screenReader) {
      root.classList.add('screen-reader-optimized')
    } else {
      root.classList.remove('screen-reader-optimized')
    }

    // Keyboard navigation
    if (newSettings.keyboardNavigation) {
      root.classList.add('keyboard-navigation')
    } else {
      root.classList.remove('keyboard-navigation')
    }

    // Focus visible
    if (newSettings.focusVisible) {
      root.classList.add('focus-visible')
    } else {
      root.classList.remove('focus-visible')
    }
  }

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: false,
      focusVisible: true
    }
    setSettings(defaultSettings)
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center"
        aria-label="Accessibility Settings"
      >
        <MousePointer className="h-6 w-6" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Accessibility Settings</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <EyeOff className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">High Contrast</span>
              </div>
              <button
                onClick={() => toggleSetting('highContrast')}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.highContrast ? 'bg-primary-600' : 'bg-gray-300'
                }`}
                aria-label="Toggle high contrast"
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Type className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Large Text</span>
              </div>
              <button
                onClick={() => toggleSetting('largeText')}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.largeText ? 'bg-primary-600' : 'bg-gray-300'
                }`}
                aria-label="Toggle large text"
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.largeText ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <VolumeX className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Reduced Motion</span>
              </div>
              <button
                onClick={() => toggleSetting('reducedMotion')}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.reducedMotion ? 'bg-primary-600' : 'bg-gray-300'
                }`}
                aria-label="Toggle reduced motion"
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Screen Reader</span>
              </div>
              <button
                onClick={() => toggleSetting('screenReader')}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.screenReader ? 'bg-primary-600' : 'bg-gray-300'
                }`}
                aria-label="Toggle screen reader optimizations"
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.screenReader ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MousePointer className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Keyboard Navigation</span>
              </div>
              <button
                onClick={() => toggleSetting('keyboardNavigation')}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.keyboardNavigation ? 'bg-primary-600' : 'bg-gray-300'
                }`}
                aria-label="Toggle keyboard navigation"
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.keyboardNavigation ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={resetSettings}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Keyboard navigation hook
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip link functionality
      if (event.key === 'Tab' && event.shiftKey) {
        // Handle skip links
        const skipLinks = document.querySelectorAll('[data-skip-link]')
        if (skipLinks.length > 0) {
          // Focus management for skip links
        }
      }

      // Escape key to close modals
      if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('[data-modal-open="true"]')
        openModals.forEach(modal => {
          const closeButton = modal.querySelector('[data-modal-close]')
          if (closeButton instanceof HTMLElement) {
            closeButton.click()
          }
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}

// Focus trap hook
export function useFocusTrap(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return

    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const firstFocusableElement = document.querySelector(focusableElements) as HTMLElement
    const focusableContent = document.querySelectorAll(focusableElements)
    const lastFocusableElement = focusableContent[focusableContent.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstFocusableElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])
}
