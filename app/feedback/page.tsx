import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feedback - Guide',
  description: 'Share your feedback about Guide. We value your input and use it to improve our platform.',
}

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Share Your Feedback</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Your feedback helps us improve Guide and create better experiences for everyone. 
              Whether you're a guest, host, or just someone who's used our platform, we'd love to hear from you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">Guest Feedback</h2>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  Share your experience as a guest. How was your booking process? Did you enjoy your experience?
                </p>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Experience quality and authenticity</li>
                  <li>• Host communication and hospitality</li>
                  <li>• Booking and payment process</li>
                  <li>• Platform usability and features</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h2 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">Host Feedback</h2>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Help us improve the host experience. What tools do you need? How can we better support you?
                </p>
                <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                  <li>• Host dashboard and tools</li>
                  <li>• Guest communication features</li>
                  <li>• Payment and payout process</li>
                  <li>• Marketing and promotion support</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-8">
              <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4">Platform Feedback</h2>
              <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                General feedback about Guide's features, design, and functionality.
              </p>
              <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
                <li>• New feature requests</li>
                <li>• User interface improvements</li>
                <li>• Mobile app experience</li>
                <li>• Search and discovery features</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">How to Submit Feedback</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Email Us</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Send your feedback to <strong>feedback@guide.com</strong> with a clear subject line describing your feedback type.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">In-App Feedback</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Use the feedback form in your account settings for quick, categorized feedback submission.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Social Media</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Follow us on social media and share your thoughts using #GuideFeedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">Thank You</h3>
              <p className="text-purple-700 dark:text-purple-300">
                Every piece of feedback is valuable to us. We read every message and use your input to make Guide better for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
