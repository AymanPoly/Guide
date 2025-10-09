import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Guide',
  description: 'Guide\'s privacy policy explaining how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Introduction</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Guide ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Profile information and preferences</li>
                <li>Payment and billing information</li>
                <li>Communication history with hosts/guests</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">Usage Information</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our platform</li>
                <li>Search queries and booking history</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Provide and improve our services</li>
                <li>Process bookings and payments</li>
                <li>Facilitate communication between hosts and guests</li>
                <li>Send important updates and notifications</li>
                <li>Prevent fraud and ensure platform safety</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Information Sharing</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>With hosts/guests as necessary for bookings</li>
                <li>With service providers who assist our operations</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Data Security</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
                <li>Secure payment processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Opt out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300">
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@guide.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  privacy@guide.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
