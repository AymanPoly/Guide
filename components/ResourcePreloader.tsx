'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ResourcePreloader() {
  const router = useRouter()

  useEffect(() => {
    // Preload critical fonts
    const preloadFonts = () => {
      const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      ]
      
      fontLinks.forEach(href => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'style'
        link.href = href
        link.onload = () => {
          link.rel = 'stylesheet'
        }
        document.head.appendChild(link)
      })
    }

    // Preload critical images
    const preloadImages = () => {
      const criticalImages = [
        '/icons/icon-192x192.svg',
        '/icons/icon-512x512.svg'
      ]
      
      criticalImages.forEach(src => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = src
        document.head.appendChild(link)
      })
    }

    // Prefetch likely next pages
    const prefetchPages = () => {
      const likelyPages = [
        '/auth/login',
        '/auth/register',
        '/dashboard'
      ]
      
      likelyPages.forEach(href => {
        router.prefetch(href)
      })
    }

    // Preload critical resources
    preloadFonts()
    preloadImages()
    
    // Prefetch pages after a short delay
    const timer = setTimeout(prefetchPages, 2000)
    
    return () => clearTimeout(timer)
  }, [router])

  return null
}
