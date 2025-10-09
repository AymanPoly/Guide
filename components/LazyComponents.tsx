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

// Wrapper components without loading states
export function ImageUploadWithSuspense(props: any) {
  return <LazyImageUpload {...props} />
}

export function SearchBarWithSuspense(props: any) {
  return <LazySearchBar {...props} />
}

export function RoleSwitchWithSuspense(props: any) {
  return <LazyRoleSwitch {...props} />
}

export function InstallPromptWithSuspense(props: any) {
  return <LazyInstallPrompt {...props} />
}

// Page wrappers without loading states
export function DashboardWithSuspense(props: any) {
  return <LazyDashboard {...props} />
}

export function HostExperiencesWithSuspense(props: any) {
  return <LazyHostExperiences {...props} />
}

export function HostBookingsWithSuspense(props: any) {
  return <LazyHostBookings {...props} />
}

export function GuestBookingsWithSuspense(props: any) {
  return <LazyGuestBookings {...props} />
}
