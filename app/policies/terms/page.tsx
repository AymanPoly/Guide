import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Guide',
  description: 'Guide\'s terms of service outlining the rules and guidelines for using our platform.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Agreement to Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By accessing and using Guide, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Use of the Platform</h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">Eligibility</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You must be at least 18 years old to use Guide. By using our platform, you represent that you meet this requirement.
              </p>

              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">Account Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>You are responsible for all activities under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Booking and Payments</h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">Booking Process</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>All bookings are subject to host approval</li>
                <li>Payment is required at the time of booking</li>
                <li>Prices are set by hosts and may change</li>
                <li>Additional fees may apply for special requests</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">Cancellation Policy</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Cancellation terms vary by experience. Guests and hosts must adhere to the specific cancellation policy 
                outlined in each experience listing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Host Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Provide accurate experience descriptions</li>
                <li>Maintain a safe and welcoming environment</li>
                <li>Honor all confirmed bookings</li>
                <li>Respond promptly to guest communications</li>
                <li>Comply with all local laws and regulations</li>
                <li>Obtain necessary permits and insurance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Guest Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Arrive on time for scheduled experiences</li>
                <li>Treat hosts and their property with respect</li>
                <li>Follow all safety instructions and guidelines</li>
                <li>Communicate any special needs in advance</li>
                <li>Leave honest and constructive reviews</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Prohibited Activities</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">You may not:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Use the platform for illegal activities</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Post false, misleading, or inappropriate content</li>
                <li>Attempt to circumvent our systems or policies</li>
                <li>Use automated tools to access the platform</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Disclaimers and Limitations</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Guide acts as a platform connecting hosts and guests. We do not guarantee the quality, safety, 
                or legality of experiences. Users participate at their own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Termination</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may suspend or terminate accounts that violate these terms or engage in prohibited activities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Changes to Terms</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We may update these terms from time to time. Continued use of the platform constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-300">
                For questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@guide.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  legal@guide.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
