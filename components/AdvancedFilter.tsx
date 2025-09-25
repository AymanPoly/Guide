'use client'

import { useState, useEffect } from 'react'
import { Filter, X, ChevronDown, MapPin, DollarSign, Star, Clock } from 'lucide-react'

interface FilterOption {
  id: string
  label: string
  value: any
  count?: number
}

interface FilterGroup {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  options: FilterOption[]
  type: 'checkbox' | 'radio' | 'range' | 'select'
  multiple?: boolean
}

interface AdvancedFilterProps {
  filters: FilterGroup[]
  onFilterChange: (filters: Record<string, any>) => void
  className?: string
}

export default function AdvancedFilter({ 
  filters, 
  onFilterChange, 
  className = '' 
}: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const handleFilterChange = (groupId: string, value: any, multiple: boolean = false) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev }
      
      if (multiple) {
        if (!newFilters[groupId]) {
          newFilters[groupId] = []
        }
        
        if (newFilters[groupId].includes(value)) {
          newFilters[groupId] = newFilters[groupId].filter((v: any) => v !== value)
        } else {
          newFilters[groupId] = [...newFilters[groupId], value]
        }
        
        if (newFilters[groupId].length === 0) {
          delete newFilters[groupId]
        }
      } else {
        if (newFilters[groupId] === value) {
          delete newFilters[groupId]
        } else {
          newFilters[groupId] = value
        }
      }
      
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    onFilterChange({})
  }

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length
  }

  const renderFilterGroup = (group: FilterGroup) => {
    const isExpanded = expandedGroups.has(group.id)
    const Icon = group.icon

    return (
      <div key={group.id} className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleGroup(group.id)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900">{group.label}</span>
            {activeFilters[group.id] && (
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                {Array.isArray(activeFilters[group.id]) 
                  ? activeFilters[group.id].length 
                  : 1
                }
              </span>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`} />
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 animate-fade-in-down">
            {group.type === 'checkbox' && (
              <div className="space-y-2">
                {group.options.map((option) => (
                  <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters[group.id]?.includes(option.value) || false}
                      onChange={() => handleFilterChange(group.id, option.value, true)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                    {option.count && (
                      <span className="text-xs text-gray-500">({option.count})</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {group.type === 'radio' && (
              <div className="space-y-2">
                {group.options.map((option) => (
                  <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={group.id}
                      checked={activeFilters[group.id] === option.value}
                      onChange={() => handleFilterChange(group.id, option.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                    {option.count && (
                      <span className="text-xs text-gray-500">({option.count})</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {group.type === 'range' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            )}

            {group.type === 'select' && (
              <select
                value={activeFilters[group.id] || ''}
                onChange={(e) => handleFilterChange(group.id, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All {group.label}</option>
                {group.options.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label} {option.count && `(${option.count})`}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            {getActiveFilterCount()}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in-down">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Filter Experiences</h3>
              <div className="flex items-center space-x-2">
                {getActiveFilterCount() > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filter Groups */}
            <div className="max-h-96 overflow-y-auto">
              {filters.map(renderFilterGroup)}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Predefined filter configurations
export const experienceFilters: FilterGroup[] = [
  {
    id: 'location',
    label: 'Location',
    icon: MapPin,
    type: 'checkbox',
    multiple: true,
    options: [
      { id: 'marrakech', label: 'Marrakech', value: 'marrakech', count: 12 },
      { id: 'casablanca', label: 'Casablanca', value: 'casablanca', count: 8 },
      { id: 'fes', label: 'Fes', value: 'fes', count: 6 },
      { id: 'rabat', label: 'Rabat', value: 'rabat', count: 4 }
    ]
  },
  {
    id: 'price',
    label: 'Price Range',
    icon: DollarSign,
    type: 'radio',
    options: [
      { id: 'under-50', label: 'Under $50', value: 'under-50', count: 15 },
      { id: '50-100', label: '$50 - $100', value: '50-100', count: 20 },
      { id: '100-200', label: '$100 - $200', value: '100-200', count: 12 },
      { id: 'over-200', label: 'Over $200', value: 'over-200', count: 8 }
    ]
  },
  {
    id: 'rating',
    label: 'Rating',
    icon: Star,
    type: 'radio',
    options: [
      { id: '4-plus', label: '4+ Stars', value: '4-plus', count: 25 },
      { id: '3-plus', label: '3+ Stars', value: '3-plus', count: 18 },
      { id: '2-plus', label: '2+ Stars', value: '2-plus', count: 5 }
    ]
  },
  {
    id: 'duration',
    label: 'Duration',
    icon: Clock,
    type: 'checkbox',
    multiple: true,
    options: [
      { id: 'half-day', label: 'Half Day', value: 'half-day', count: 10 },
      { id: 'full-day', label: 'Full Day', value: 'full-day', count: 15 },
      { id: 'multi-day', label: 'Multi Day', value: 'multi-day', count: 8 }
    ]
  }
]
