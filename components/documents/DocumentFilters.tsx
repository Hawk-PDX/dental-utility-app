'use client'

import { DocumentCategory } from '@/lib/types/database'
import { useState } from 'react'

interface DocumentFiltersProps {
  onCategoryChange: (category: DocumentCategory | null) => void
  onSearchChange: (search: string) => void
  activeCategory: DocumentCategory | null
}

const categories: { value: DocumentCategory | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'policies', label: 'Policies' },
  { value: 'protocols', label: 'Protocols' },
  { value: 'forms', label: 'Forms' },
  { value: 'instructions', label: 'Instructions' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' },
]

export function DocumentFilters({
  onCategoryChange,
  onSearchChange,
  activeCategory,
}: DocumentFiltersProps) {
  const [search, setSearch] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    onSearchChange(value)
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={handleSearchChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
