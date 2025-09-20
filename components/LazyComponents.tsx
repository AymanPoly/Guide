'use client'

import { lazy, Suspense } from 'react'
import LoadingSpinner from './LoadingSpinner'

// Lazy load heavy components
export const LazyImageUpload = lazy(() => import('./ImageUpload'))
export const LazySearchBar = lazy(() => import('./SearchBar'))
export const LazyRoleSwitch = lazy(() => import('./RoleSwitch'))
export const LazyInstallPrompt = lazy(() => import('./InstallPrompt'))

// Lazy load page components
export const LazyDashboard = lazy(() => import('../app/dashboard/page'))
export const LazyHostExperiences = lazy(() => import('../app/host/experiences/page'))
export const LazyHostBookings = lazy(() => import('../app/host/bookings/page'))
export const LazyGuestBookings = lazy(() => import('../app/guest/bookings/page'))

// Wrapper components with loading states
export function ImageUploadWithSuspense(props: any) {
  return (
    <Suspense fallback={<LoadingSpinner size="sm" text="Loading upload..." />}>
      <LazyImageUpload {...props} />
    </Suspense>
  )
}

export function SearchBarWithSuspense(props: any) {
  return (
    <Suspense fallback={<div className="h-12 bg-gray-200 animate-pulse rounded-lg" />}>
      <LazySearchBar {...props} />
    </Suspense>
  )
}

export function RoleSwitchWithSuspense(props: any) {
  return (
    <Suspense fallback={<div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />}>
      <LazyRoleSwitch {...props} />
    </Suspense>
  )
}

export function InstallPromptWithSuspense(props: any) {
  return (
    <Suspense fallback={null}>
      <LazyInstallPrompt {...props} />
    </Suspense>
  )
}

// Page wrappers
export function DashboardWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    }>
      <LazyDashboard {...props} />
    </Suspense>
  )
}

export function HostExperiencesWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading experiences..." />
      </div>
    }>
      <LazyHostExperiences {...props} />
    </Suspense>
  )
}

export function HostBookingsWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading bookings..." />
      </div>
    }>
      <LazyHostBookings {...props} />
    </Suspense>
  )
}

export function GuestBookingsWithSuspense(props: any) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading bookings..." />
      </div>
    }>
      <LazyGuestBookings {...props} />
    </Suspense>
  )
}
