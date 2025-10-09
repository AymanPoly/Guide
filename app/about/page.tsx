import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Guide',
  description: 'Learn about Guide, the authentic local experiences platform connecting travelers with trusted hosts.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">About Guide</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Guide is a comprehensive platform connecting travelers with vetted local hosts for authentic, 
              personalized experiences. We believe that the best way to explore a destination is through 
              the eyes of someone who lives there.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              To create meaningful connections between travelers and local communities, fostering cultural 
              exchange and authentic experiences that go beyond typical tourist attractions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li>Curated local experiences hosted by verified community members</li>
              <li>Secure booking system with real-time messaging</li>
              <li>Community-driven feedback and rating system</li>
              <li>Offline access for seamless travel experiences</li>
              <li>Support for both guests and hosts throughout their journey</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Authenticity</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every experience is genuine, created by locals who are passionate about sharing their culture.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Safety</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All hosts are carefully vetted and verified to ensure safe, secure experiences.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Community</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We foster connections that benefit both travelers and local communities.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Sustainability</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Supporting local economies and promoting responsible tourism practices.
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">Join Our Community</h3>
              <p className="text-blue-700 dark:text-blue-300">
                Whether you're a traveler seeking authentic experiences or a local wanting to share your culture, 
                Guide is here to connect you with meaningful experiences that create lasting memories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
