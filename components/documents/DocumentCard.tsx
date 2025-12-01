'use client'

import { ClinicDocument } from '@/lib/types/database'
import { CategoryBadge } from './CategoryBadge'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface DocumentCardProps {
  document: ClinicDocument
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onToggleShare: (id: string, isShared: boolean) => void
}

export function DocumentCard({
  document,
  onDelete,
  onDuplicate,
  onToggleShare,
}: DocumentCardProps) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this document?')) {
      onDelete(document.id)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link
            href={`/dashboard/doctor/documents/${document.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600"
          >
            {document.title}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <CategoryBadge category={document.category} />
            {document.is_template && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Template
              </span>
            )}
          </div>
        </div>
      </div>

      {document.tags && document.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {document.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500 mb-4">
        Updated {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })} · v
        {document.version}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/doctor/documents/${document.id}`}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Edit
        </Link>
        <button
          onClick={() => onDuplicate(document.id)}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700"
        >
          Duplicate
        </button>
        <button
          onClick={() => onToggleShare(document.id, !document.is_shared_with_patients)}
          className={`px-3 py-1.5 text-sm font-medium ${
            document.is_shared_with_patients
              ? 'text-green-600 hover:text-green-700'
              : 'text-gray-600 hover:text-gray-700'
          }`}
        >
          {document.is_shared_with_patients ? 'Shared' : 'Share'}
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
