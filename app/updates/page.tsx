import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Updates - Guide',
  description: 'Stay updated with the latest features, improvements, and news from Guide.',
}

export default function UpdatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Platform Updates</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Stay informed about the latest improvements, new features, and important announcements from Guide.
            </p>

            <div className="space-y-8">
              <article className="border-l-4 border-blue-500 pl-6">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded">
                    Latest
                  </span>
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString()}
                  </time>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Enhanced Offline Experience
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We've improved our offline capabilities with better sync, faster loading, and more reliable access to your bookings when you're without internet.
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Faster offline data synchronization</li>
                  <li>• Improved offline maps and navigation</li>
                  <li>• Better error handling for offline scenarios</li>
                </ul>
              </article>

              <article className="border-l-4 border-green-500 pl-6">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                    Feature
                  </span>
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </time>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  New Host Dashboard
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Hosts now have access to an improved dashboard with better analytics, streamlined booking management, and enhanced communication tools.
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Real-time booking notifications</li>
                  <li>• Enhanced guest communication tools</li>
                  <li>• Improved analytics and insights</li>
                </ul>
              </article>

              <article className="border-l-4 border-purple-500 pl-6">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded">
                    Improvement
                  </span>
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </time>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Enhanced Security Features
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We've implemented additional security measures to protect your data and ensure safe transactions on our platform.
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Enhanced payment security</li>
                  <li>• Improved account verification</li>
                  <li>• Better fraud detection</li>
                </ul>
              </article>

              <article className="border-l-4 border-orange-500 pl-6">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded">
                    Announcement
                  </span>
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </time>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Mobile App Coming Soon
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We're excited to announce that our native mobile apps for iOS and Android are in development and will be available soon.
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Native iOS and Android apps</li>
                  <li>• Push notifications for bookings</li>
                  <li>• Enhanced mobile experience</li>
                </ul>
              </article>
            </div>

            <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">Stay Updated</h2>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Want to be the first to know about new features and updates? Follow us on social media or subscribe to our newsletter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Subscribe to Updates
                </a>
                <a 
                  href="/feedback" 
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  Suggest Features
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
