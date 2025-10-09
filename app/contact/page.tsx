import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Guide',
  description: 'Get in touch with the Guide team. We\'re here to help with any questions or support needs.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Get in Touch</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Have questions about Guide? Need help with your booking? Want to become a host? 
                We're here to help and would love to hear from you.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">General Inquiries</h3>
                  <p className="text-gray-600 dark:text-gray-300">hello@guide.com</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Support</h3>
                  <p className="text-gray-600 dark:text-gray-300">support@guide.com</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Host Applications</h3>
                  <p className="text-gray-600 dark:text-gray-300">hosts@guide.com</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Partnerships</h3>
                  <p className="text-gray-600 dark:text-gray-300">partners@guide.com</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">How do I book an experience?</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Browse our experiences, select one that interests you, and click "Book Now" to start the booking process.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">How do I become a host?</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Visit our host application page and submit your experience idea. Our team will review and get back to you.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">What if I need to cancel?</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Cancellation policies vary by experience. Check the specific experience details for cancellation terms.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">How do I contact my host?</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Once you've booked, you can message your host directly through our platform's messaging system.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">Response Time</h3>
            <p className="text-green-700 dark:text-green-300">
              We typically respond to all inquiries within 24 hours. For urgent matters, please mention "URGENT" in your subject line.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
