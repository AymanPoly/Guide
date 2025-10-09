import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline Access - Guide',
  description: 'Learn about Guide\'s offline capabilities and how to access your bookings and experiences without internet.',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Offline Access</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Guide works offline! Download our PWA (Progressive Web App) to access your bookings, 
              experience details, and host information even without an internet connection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">For Guests</h2>
                <ul className="text-blue-700 dark:text-blue-300 space-y-2">
                  <li>• View your upcoming bookings</li>
                  <li>• Access experience details and directions</li>
                  <li>• Contact information for your hosts</li>
                  <li>• Emergency contact details</li>
                  <li>• Offline maps and navigation</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h2 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">For Hosts</h2>
                <ul className="text-green-700 dark:text-green-300 space-y-2">
                  <li>• Manage your upcoming experiences</li>
                  <li>• View guest information and special requests</li>
                  <li>• Access your experience materials and notes</li>
                  <li>• Emergency procedures and contacts</li>
                  <li>• Offline guest check-in tools</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-8">
              <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4">How to Enable Offline Access</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-100 mb-2">Install the PWA</h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Look for the "Install Guide" prompt in your browser, or use the install button in your account settings.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-100 mb-2">Sync Your Data</h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    When online, your bookings and experience details are automatically synced for offline access.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-100 mb-2">Download Content</h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Use the "Download for Offline" feature to save experience materials, maps, and important documents.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800 mb-8">
              <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">Offline Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">Available Offline</h3>
                  <ul className="text-purple-700 dark:text-purple-300 space-y-1 text-sm">
                    <li>• Your bookings and reservations</li>
                    <li>• Experience details and descriptions</li>
                    <li>• Host contact information</li>
                    <li>• Emergency contacts</li>
                    <li>• Downloaded maps and directions</li>
                    <li>• Experience materials and checklists</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">Requires Internet</h3>
                  <ul className="text-purple-700 dark:text-purple-300 space-y-1 text-sm">
                    <li>• Making new bookings</li>
                    <li>• Sending messages</li>
                    <li>• Updating profile information</li>
                    <li>• Processing payments</li>
                    <li>• Syncing new data</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Tips for Offline Use</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">1</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Plan ahead:</strong> Download your upcoming experience details while you have internet access.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">2</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Save important info:</strong> Download maps, directions, and host contact details for easy access.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">3</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Check sync status:</strong> Look for the sync indicator to ensure your data is up to date.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
