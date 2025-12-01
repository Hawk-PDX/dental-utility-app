import { DocumentCategory } from '@/lib/types/database'

interface CategoryBadgeProps {
  category?: DocumentCategory
  className?: string
}

const categoryLabels: Record<DocumentCategory, string> = {
  policies: 'Policies',
  protocols: 'Protocols',
  forms: 'Forms',
  instructions: 'Instructions',
  insurance: 'Insurance',
  other: 'Other',
}

const categoryColors: Record<DocumentCategory, string> = {
  policies: 'bg-blue-100 text-blue-800',
  protocols: 'bg-green-100 text-green-800',
  forms: 'bg-purple-100 text-purple-800',
  instructions: 'bg-yellow-100 text-yellow-800',
  insurance: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  if (!category) return null

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[category]} ${className}`}
    >
      {categoryLabels[category]}
    </span>
  )
}
