'use client'

import { ClinicDocument, DocumentCategory } from '@/lib/types/database'
import { useState } from 'react'
import { MarkdownPreview } from './MarkdownPreview'

interface DocumentFormProps {
  initialData?: ClinicDocument
  onSubmit: (data: {
    title: string
    content: string
    category?: DocumentCategory
    is_template: boolean
    is_shared_with_patients: boolean
    tags: string[]
  }) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const categoryOptions: { value: DocumentCategory; label: string }[] = [
  { value: 'policies', label: 'Policies' },
  { value: 'protocols', label: 'Protocols' },
  { value: 'forms', label: 'Forms' },
  { value: 'instructions', label: 'Instructions' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' },
]

export function DocumentForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: DocumentFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [category, setCategory] = useState<DocumentCategory | ''>(
    initialData?.category || ''
  )
  const [isTemplate, setIsTemplate] = useState(initialData?.is_template || false)
  const [isShared, setIsShared] = useState(initialData?.is_shared_with_patients || false)
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '')
  const [showPreview, setShowPreview] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    await onSubmit({
      title,
      content,
      category: category || undefined,
      is_template: isTemplate,
      is_shared_with_patients: isShared,
      tags,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Document title"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as DocumentCategory)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="policy, standard, required"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
        {showPreview ? (
          <div className="w-full min-h-[300px] p-4 border border-gray-300 rounded-lg bg-gray-50">
            <MarkdownPreview content={content} />
          </div>
        ) : (
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="Enter document content. Supports basic markdown formatting."
          />
        )}
      </div>

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isTemplate}
            onChange={(e) => setIsTemplate(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Mark as template</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Share with patients</span>
        </label>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Document' : 'Create Document'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
