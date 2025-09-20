'use client'

import { useEffect } from 'react'
import { registerServiceWorker, showInstallPrompt } from '@/lib/pwa'

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    registerServiceWorker()
    
    // Show install prompt
    showInstallPrompt()
  }, [])

  return <>{children}</>
}

