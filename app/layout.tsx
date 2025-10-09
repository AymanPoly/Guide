import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { OptimizedProviders } from './optimized-providers'
import { Toaster } from 'react-hot-toast'
import { PWAProvider } from './pwa-provider'
import ErrorBoundary from '@/components/ErrorBoundary'
import { InstallPromptWithSuspense } from '@/components/LazyComponents'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import ResourcePreloader from '@/components/ResourcePreloader'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Guide - Authentic Local Experiences Platform',
  description: 'Guide is a comprehensive platform connecting travelers with vetted local hosts for authentic, personalized experiences. Discover unique activities, book with confidence, and create lasting memories through our secure booking system, real-time messaging, and community-driven feedback system.',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Guide',
  },
  icons: {
    icon: '/icons/icon-192x192.svg',
    apple: '/icons/icon-192x192.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Guide" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <OptimizedProviders>
            <PWAProvider>
              {children}
              <Footer />
              <Toaster position="top-center" />
              <InstallPromptWithSuspense />
              <PerformanceMonitor />
              <ResourcePreloader />
            </PWAProvider>
          </OptimizedProviders>
        </ErrorBoundary>
      </body>
    </html>
  )
}