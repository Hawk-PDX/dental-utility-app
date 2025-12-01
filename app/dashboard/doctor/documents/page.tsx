'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClinicDocument, DocumentCategory } from '@/lib/types/database'
import {
  getClinicDocuments,
  deleteDocument,
  duplicateDocument,
  togglePatientSharing,
} from '@/app/actions/documents'
import { DocumentCard } from '@/components/documents/DocumentCard'
import { DocumentFilters } from '@/components/documents/DocumentFilters'
import { createClient } from '@/lib/supabase/client'

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<ClinicDocument[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<ClinicDocument[]>([])
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clinicId, setClinicId] = useState<string | null>(null)

  useEffect(() => {
    fetchDoctorClinicId()
  }, [])

  useEffect(() => {
    if (clinicId) {
      fetchDocuments()
    }
  }, [clinicId])

  useEffect(() => {
    filterDocuments()
  }, [documents, activeCategory, searchTerm])

  const fetchDoctorClinicId = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Not authenticated')
        return
      }

      const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .select('clinic_id')
        .eq('id', user.id)
        .single()

      if (doctorError || !doctor?.clinic_id) {
        setError('No clinic associated with account')
        return
      }

      setClinicId(doctor.clinic_id)
    } catch (err) {
      setError('Failed to fetch clinic information')
    }
  }

  const fetchDocuments = async () => {
    if (!clinicId) return

    setIsLoading(true)
    setError(null)

    const { data, error } = await getClinicDocuments(clinicId)

    if (error) {
      setError(error)
    } else {
      setDocuments(data || [])
    }

    setIsLoading(false)
  }

  const filterDocuments = () => {
    let filtered = [...documents]

    if (activeCategory) {
      filtered = filtered.filter((doc) => doc.category === activeCategory)
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(term) ||
          doc.tags?.some((tag) => tag.toLowerCase().includes(term))
      )
    }

    setFilteredDocuments(filtered)
  }

  const handleDelete = async (id: string) => {
    const { success, error } = await deleteDocument(id)

    if (error) {
      alert(`Failed to delete document: ${error}`)
    } else {
      setDocuments(documents.filter((doc) => doc.id !== id))
    }
  }

  const handleDuplicate = async (id: string) => {
    const { data, error } = await duplicateDocument(id)

    if (error) {
      alert(`Failed to duplicate document: ${error}`)
    } else if (data) {
      setDocuments([data, ...documents])
    }
  }

  const handleToggleShare = async (id: string, isShared: boolean) => {
    const { data, error } = await togglePatientSharing(id, isShared)

    if (error) {
      alert(`Failed to update sharing: ${error}`)
    } else if (data) {
      setDocuments(documents.map((doc) => (doc.id === id ? data : doc)))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading documents...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-gray-600">
            Manage your clinic's policies, protocols, and templates
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/doctor/documents/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Document
        </button>
      </div>

      <div className="mb-6">
        <DocumentFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onSearchChange={setSearchTerm}
        />
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {documents.length === 0
              ? 'No documents yet. Create your first document to get started.'
              : 'No documents match your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onToggleShare={handleToggleShare}
            />
          ))}
        </div>
      )}
    </div>
  )
}
