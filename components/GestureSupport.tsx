'use client'

import { useEffect, useRef, useState } from 'react'
import { SwipeLeft, SwipeRight, SwipeUp, SwipeDown, RotateCw, ZoomIn } from 'lucide-react'

interface GestureConfig {
  swipeThreshold: number
  swipeVelocity: number
  pinchThreshold: number
  rotationThreshold: number
  longPressDuration: number
}

interface GestureCallbacks {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinchIn?: () => void
  onPinchOut?: () => void
  onRotate?: (angle: number) => void
  onLongPress?: () => void
  onDoubleTap?: () => void
}

interface GestureSupportProps {
  children: React.ReactNode
  config?: Partial<GestureConfig>
  callbacks?: GestureCallbacks
  className?: string
}

const defaultConfig: GestureConfig = {
  swipeThreshold: 50,
  swipeVelocity: 0.3,
  pinchThreshold: 0.1,
  rotationThreshold: 15,
  longPressDuration: 500
}

export default function GestureSupport({ 
  children, 
  config = {}, 
  callbacks = {},
  className = ''
}: GestureSupportProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [gestureState, setGestureState] = useState({
    isTracking: false,
    startX: 0,
    startY: 0,
    startTime: 0,
    lastX: 0,
    lastY: 0,
    startDistance: 0,
    startAngle: 0,
    longPressTimer: null as NodeJS.Timeout | null
  })

  const finalConfig = { ...defaultConfig, ...config }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      const now = Date.now()
      
      setGestureState(prev => ({
        ...prev,
        isTracking: true,
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: now,
        lastX: touch.clientX,
        lastY: touch.clientY
      }))

      // Long press detection
      const longPressTimer = setTimeout(() => {
        callbacks.onLongPress?.()
      }, finalConfig.longPressDuration)

      setGestureState(prev => ({ ...prev, longPressTimer }))

      // Multi-touch gestures
      if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        const angle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        )

        setGestureState(prev => ({
          ...prev,
          startDistance: distance,
          startAngle: angle
        }))
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!gestureState.isTracking) return

      const touch = e.touches[0]
      const now = Date.now()
      const deltaX = touch.clientX - gestureState.startX
      const deltaY = touch.clientY - gestureState.startY
      const velocity = Math.sqrt(
        Math.pow(touch.clientX - gestureState.lastX, 2) + 
        Math.pow(touch.clientY - gestureState.lastY, 2)
      ) / (now - gestureState.startTime)

      setGestureState(prev => ({
        ...prev,
        lastX: touch.clientX,
        lastY: touch.clientY
      }))

      // Multi-touch gestures
      if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        const angle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        )

        // Pinch gesture
        const scaleChange = distance / gestureState.startDistance
        if (Math.abs(scaleChange - 1) > finalConfig.pinchThreshold) {
          if (scaleChange > 1) {
            callbacks.onPinchOut?.()
          } else {
            callbacks.onPinchIn?.()
          }
        }

        // Rotation gesture
        const angleChange = angle - gestureState.startAngle
        if (Math.abs(angleChange) > finalConfig.rotationThreshold * Math.PI / 180) {
          callbacks.onRotate?.(angleChange)
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!gestureState.isTracking) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - gestureState.startX
      const deltaY = touch.clientY - gestureState.startY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const duration = Date.now() - gestureState.startTime
      const velocity = distance / duration

      // Clear long press timer
      if (gestureState.longPressTimer) {
        clearTimeout(gestureState.longPressTimer)
      }

      // Swipe detection
      if (distance > finalConfig.swipeThreshold && velocity > finalConfig.swipeVelocity) {
        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)

        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0) {
            callbacks.onSwipeRight?.()
          } else {
            callbacks.onSwipeLeft?.()
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            callbacks.onSwipeDown?.()
          } else {
            callbacks.onSwipeUp?.()
          }
        }
      } else if (distance < 10 && duration < 300) {
        // Double tap detection
        const now = Date.now()
        if (now - (gestureState as any).lastTap < 300) {
          callbacks.onDoubleTap?.()
        }
        setGestureState(prev => ({ ...prev, lastTap: now }))
      }

      setGestureState(prev => ({
        ...prev,
        isTracking: false,
        longPressTimer: null
      }))
    }

    // Mouse events for desktop
    const handleMouseDown = (e: MouseEvent) => {
      const now = Date.now()
      setGestureState(prev => ({
        ...prev,
        isTracking: true,
        startX: e.clientX,
        startY: e.clientY,
        startTime: now,
        lastX: e.clientX,
        lastY: e.clientY
      }))
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!gestureState.isTracking) return
      setGestureState(prev => ({
        ...prev,
        lastX: e.clientX,
        lastY: e.clientY
      }))
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!gestureState.isTracking) return

      const deltaX = e.clientX - gestureState.startX
      const deltaY = e.clientY - gestureState.startY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const duration = Date.now() - gestureState.startTime
      const velocity = distance / duration

      if (distance > finalConfig.swipeThreshold && velocity > finalConfig.swipeVelocity) {
        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)

        if (absX > absY) {
          if (deltaX > 0) {
            callbacks.onSwipeRight?.()
          } else {
            callbacks.onSwipeLeft?.()
          }
        } else {
          if (deltaY > 0) {
            callbacks.onSwipeDown?.()
          } else {
            callbacks.onSwipeUp?.()
          }
        }
      }

      setGestureState(prev => ({ ...prev, isTracking: false }))
    }

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })
    element.addEventListener('mousedown', handleMouseDown)
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseup', handleMouseUp)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('mousedown', handleMouseDown)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseup', handleMouseUp)
    }
  }, [gestureState, finalConfig, callbacks])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

// Gesture indicator component
interface GestureIndicatorProps {
  gesture: string
  isVisible: boolean
  position: { x: number; y: number }
}

export function GestureIndicator({ gesture, isVisible, position }: GestureIndicatorProps) {
  const getGestureIcon = (gesture: string) => {
    switch (gesture) {
      case 'swipe-left': return <SwipeLeft className="h-6 w-6" />
      case 'swipe-right': return <SwipeRight className="h-6 w-6" />
      case 'swipe-up': return <SwipeUp className="h-6 w-6" />
      case 'swipe-down': return <SwipeDown className="h-6 w-6" />
      case 'pinch-in': return <ZoomIn className="h-6 w-6" />
      case 'pinch-out': return <ZoomIn className="h-6 w-6" />
      case 'rotate': return <RotateCw className="h-6 w-6" />
      default: return null
    }
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x - 24,
        top: position.y - 24,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="bg-primary-600 text-white rounded-full p-2 shadow-lg animate-pulse">
        {getGestureIcon(gesture)}
      </div>
    </div>
  )
}

// Gesture tutorial component
export function GestureTutorial() {
  const [currentGesture, setCurrentGesture] = useState(0)
  const gestures = [
    { name: 'Swipe Left', description: 'Go to previous experience', icon: <SwipeLeft className="h-8 w-8" /> },
    { name: 'Swipe Right', description: 'Go to next experience', icon: <SwipeRight className="h-8 w-8" /> },
    { name: 'Swipe Up', description: 'Show more details', icon: <SwipeUp className="h-8 w-8" /> },
    { name: 'Swipe Down', description: 'Close details', icon: <SwipeDown className="h-8 w-8" /> },
    { name: 'Pinch', description: 'Zoom in/out on images', icon: <ZoomIn className="h-8 w-8" /> },
    { name: 'Long Press', description: 'Show quick actions', icon: <RotateCw className="h-8 w-8" /> }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Gesture Controls</h3>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {gestures[currentGesture].icon}
          </div>
          <h4 className="font-medium text-gray-900">{gestures[currentGesture].name}</h4>
          <p className="text-sm text-gray-600 mt-2">{gestures[currentGesture].description}</p>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentGesture(prev => Math.max(0, prev - 1))}
            disabled={currentGesture === 0}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex space-x-2">
            {gestures.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentGesture ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentGesture(prev => Math.min(gestures.length - 1, prev + 1))}
            disabled={currentGesture === gestures.length - 1}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
