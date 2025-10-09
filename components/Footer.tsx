"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/optimized-providers'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const { user, profile } = useAuth()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  const navLinkClass = (href: string) =>
    `${isActive(href) ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-600 dark:text-gray-400'} hover:text-gray-900 dark:hover:text-gray-200`
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-semibold text-gray-900 dark:text-gray-100" aria-label="Guide home">
              Guide
            </Link>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Authentic local experiences platform. Discover, book, and enjoy unique activities with trusted hosts.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wide">Product</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/" className={navLinkClass('/')}>Explore Experiences</Link></li>
              {user && (
                <li>
                  <Link 
                    href={profile?.role === 'host' ? '/host/bookings' : '/guest/bookings'} 
                    className={navLinkClass(profile?.role === 'host' ? '/host/bookings' : '/guest/bookings')}
                  >
                    Your Bookings
                  </Link>
                </li>
              )}
              <li><Link href="/profile/settings" className={navLinkClass('/profile/settings')}>Account Settings</Link></li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wide">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/about" className={navLinkClass('/about')}>About</Link></li>
              <li><Link href="/updates" className={navLinkClass('/updates')}>Updates</Link></li>
              <li><Link href="/contact" className={navLinkClass('/contact')}>Contact</Link></li>
              <li><Link href="/feedback" className={navLinkClass('/feedback')}>Feedback</Link></li>
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wide">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/help" className={navLinkClass('/help')}>Help Center</Link></li>
              <li><Link href="/policies/privacy" className={navLinkClass('/policies/privacy')}>Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className={navLinkClass('/policies/terms')}>Terms of Service</Link></li>
              <li><Link href="/offline" className={navLinkClass('/offline')}>Offline Access</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-gray-200 dark:border-gray-800 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">© {currentYear} Guide. All rights reserved.</p>
          <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-gray-200" aria-label="X (Twitter)">
              {/* X icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M13.545 10.94 20.03 3h-1.54l-5.64 6.64L7.82 3H3l6.845 9.66L3 21h1.54l6.02-7.08L16.18 21H21l-7.455-10.06ZM11.3 12.82l-.7-.98-5.56-7.8h2.39l4.49 6.3.7.98 5.83 8.18h-2.39l-4.86-6.7Z"/></svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-gray-200" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.486 2 12.021c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.218.682-.485 0-.239-.009-.87-.014-1.707-2.782.607-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.464-1.11-1.464-.908-.622.069-.61.069-.61 1.004.071 1.532 1.035 1.532 1.035.892 1.53 2.341 1.088 2.91.833.091-.651.35-1.089.636-1.34-2.221-.253-4.555-1.114-4.555-4.957 0-1.095.39-1.99 1.029-2.69-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.027A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.027 2.748-1.027.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.69 0 3.853-2.338 4.701-4.566 4.95.36.31.68.921.68 1.856 0 1.338-.012 2.418-.012 2.748 0 .269.18.581.688.482A10.026 10.026 0 0 0 22 12.021C22 6.486 17.523 2 12 2Z" clipRule="evenodd"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-gray-200" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.329-.027-3.039-1.852-3.039-1.853 0-2.136 1.447-2.136 2.944v5.664H9.352V9h3.414v1.561h.047c.476-.897 1.637-1.847 3.368-1.847 3.602 0 4.267 2.37 4.267 5.455v6.283zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556v11.452z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}



