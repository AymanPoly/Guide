import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center - Guide',
  description: 'Find answers to common questions about using Guide. Get help with bookings, hosting, and platform features.',
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Help Center</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Find answers to common questions about using Guide. Can't find what you're looking for? 
              <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline"> Contact our support team</a>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">For Guests</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">How do I book an experience?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Browse experiences, select your preferred date and time, and click "Book Now". 
                      You'll be guided through the secure payment process.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">How do I contact my host?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Once booked, use the messaging system in your account to communicate directly with your host.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">What if I need to cancel?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Cancellation policies vary by experience. Check the experience details for specific terms and contact support if needed.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">How do I leave a review?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      After your experience, you'll receive an email with a link to leave a review. You can also do this from your bookings page.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">For Hosts</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">How do I become a host?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Submit your host application with your experience idea. Our team will review and guide you through the verification process.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">How do I create an experience?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Use the host dashboard to create detailed listings with photos, descriptions, and availability.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">When do I get paid?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Payments are processed 24 hours after the experience completion, minus our service fee.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">How do I manage bookings?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Use your host dashboard to view, accept, and manage all your bookings in one place.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">Account & Security</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-1">How do I reset my password?</h3>
                  <p className="text-blue-700 dark:text-blue-300">Click "Forgot Password" on the login page and follow the email instructions.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-1">How do I update my profile?</h3>
                  <p className="text-blue-700 dark:text-blue-300">Go to your account settings to update your personal information and preferences.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-1">Is my payment information secure?</h3>
                  <p className="text-blue-700 dark:text-blue-300">Yes, we use industry-standard encryption and never store your full payment details.</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h2 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">Still Need Help?</h2>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Contact Support
                </a>
                <a 
                  href="mailto:support@guide.com" 
                  className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
