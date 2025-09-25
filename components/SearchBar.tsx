'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, MapPin, Clock } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
  showRecentSearches?: boolean
  className?: string
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search by city...", 
  suggestions = [],
  onSuggestionClick,
  showRecentSearches = true,
  className = ''
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (newValue: string) => {
    onChange(newValue)
    setShowSuggestions(newValue.length > 0)
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    
    // Add to recent searches
    const updated = [suggestion, ...recentSearches.filter(s => s !== suggestion)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
    
    if (onSuggestionClick) {
      onSuggestionClick(suggestion)
    }
  }

  const clearSearch = () => {
    onChange('')
    inputRef.current?.focus()
  }

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase())
  )

  const displaySuggestions = value.length > 0 ? filteredSuggestions : recentSearches

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
          isFocused ? 'text-primary-600' : 'text-gray-400'
        }`} />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            setShowSuggestions(true)
          }}
          className={`
            w-full pl-10 pr-10 py-3 rounded-lg border-2 transition-all duration-200
            ${isFocused 
              ? 'border-primary-500 ring-2 ring-primary-200' 
              : 'border-gray-200 hover:border-gray-300'
            }
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            bg-white shadow-sm
          `}
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (displaySuggestions.length > 0 || showRecentSearches) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {value.length === 0 && recentSearches.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <Clock className="h-3 w-3 mr-1" />
                Recent Searches
              </div>
            </div>
          )}
          
          {displaySuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center"
            >
              <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{suggestion}</span>
            </button>
          ))}
          
          {displaySuggestions.length === 0 && value.length > 0 && (
            <div className="px-4 py-3 text-gray-500 text-sm">
              No suggestions found for "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

