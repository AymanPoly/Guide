'use client'

import { useEffect } from 'react'

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLink = document.createElement('link')
      fontLink.rel = 'preload'
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      fontLink.as = 'style'
      document.head.appendChild(fontLink)

      // Preload critical images
      const criticalImages = [
        '/images/hero-bg.jpg',
        '/images/logo.png'
      ]

      criticalImages.forEach(src => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = src
        link.as = 'image'
        document.head.appendChild(link)
      })
    }

    // Optimize scroll performance
    const optimizeScroll = () => {
      let ticking = false
      
      const updateScroll = () => {
        // Throttle scroll events
        ticking = false
      }

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateScroll)
          ticking = true
        }
      }

      window.addEventListener('scroll', requestTick, { passive: true })
      
      return () => window.removeEventListener('scroll', requestTick)
    }

    // Prefetch likely next pages
    const prefetchNextPages = () => {
      const links = document.querySelectorAll('a[href^="/"]')
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement
            const href = link.getAttribute('href')
            if (href && !document.querySelector(`link[href="${href}"]`)) {
              const prefetchLink = document.createElement('link')
              prefetchLink.rel = 'prefetch'
              prefetchLink.href = href
              document.head.appendChild(prefetchLink)
            }
            observer.unobserve(link)
          }
        })
      })

      links.forEach(link => observer.observe(link))
    }

    // Initialize optimizations
    preloadCriticalResources()
    const cleanupScroll = optimizeScroll()
    prefetchNextPages()

    return () => {
      cleanupScroll()
    }
  }, [])

  return null
}
