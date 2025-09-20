'use client'

import { Chrome } from 'lucide-react'

interface GoogleSignInButtonProps {
  onClick: () => void
  loading: boolean
  text: string
  loadingText: string
  className?: string
}

export default function GoogleSignInButton({
  onClick,
  loading,
  text,
  loadingText,
  className = ''
}: GoogleSignInButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <Chrome className="h-5 w-5 mr-2" />
      {loading ? loadingText : text}
    </button>
  )
}

