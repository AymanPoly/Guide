'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Home, User, Settings, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface FloatingActionButtonProps {
  userRole?: 'guest' | 'host'
  className?: string
}

export default function FloatingActionButton({ 
  userRole = 'guest',
  className = ''
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Hide FAB when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: User,
      label: 'Profile',
      href: '/dashboard',
      color: 'bg-green-500 hover:bg-green-600'
    },
    ...(userRole === 'host' ? [{
      icon: Plus,
      label: 'Add Experience',
      href: '/host/experiences/new',
      color: 'bg-primary-500 hover:bg-primary-600'
    }] : []),
    {
      icon: MessageCircle,
      label: 'Messages',
      href: '/messages',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/profile/settings',
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ]

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Menu Items */}
      <div className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {menuItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-full text-white shadow-lg
              ${item.color} transition-all duration-200 transform hover:scale-105
              animate-slide-in-right
            `}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setIsOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={toggleMenu}
        className={`
          w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform
          ${isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-primary-600 hover:bg-primary-700 hover:scale-110'
          }
          flex items-center justify-center text-white
        `}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Simple FAB for single action
interface SimpleFABProps {
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  label?: string
  color?: string
  className?: string
}

export function SimpleFAB({ 
  icon: Icon, 
  onClick, 
  label,
  color = 'bg-primary-600 hover:bg-primary-700',
  className = ''
}: SimpleFABProps) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg
        ${color} text-white transition-all duration-200 transform hover:scale-110
        flex items-center justify-center z-50 ${className}
      `}
      title={label}
    >
      <Icon className="h-6 w-6" />
    </button>
  )
}
