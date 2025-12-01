'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ClinicDocument, DocumentCategory } from '@/lib/types/database'
import {
  getDocumentById,
  createDocument,
  updateDocument,
} from '@/app/actions/documents'
import { DocumentForm } from '@/components/documents/DocumentForm'
import { createClient } from '@/lib/supabase/client'

export default function DocumentEditPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = params.id as string
  const isNewDocument = documentId === 'new'

  const [document, setDocument] = useState<ClinicDocument | null>(null)
  const [isLoading, setIsLoading] = useState(!isNewDocument)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clinicId, setClinicId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  useEffect(() => {
    if (!isNewDocument && userId) {
      fetchDocument()
    }
  }, [documentId, userId])

  const fetchUserInfo = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Not authenticated')
        return
      }

      setUserId(user.id)

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
      setError('Failed to fetch user information')
    }
  }

  const fetchDocument = async () => {
    setIsLoading(true)
    setError(null)

    const { data, error } = await getDocumentById(documentId)

    if (error) {
      setError(error)
    } else {
      setDocument(data)
    }

    setIsLoading(false)
  }

  const handleSubmit = async (formData: {
    title: string
    content: string
    category?: DocumentCategory
    is_template: boolean
    is_shared_with_patients: boolean
    tags: string[]
  }) => {
    if (!clinicId || !userId) {
      alert('Missing required information')
      return
    }

    setIsSaving(true)

    if (isNewDocument) {
      const { data, error } = await createDocument({
        clinic_id: clinicId,
        created_by: userId,
        ...formData,
      })

      if (error) {
        alert(`Failed to create document: ${error}`)
        setIsSaving(false)
      } else {
        router.push('/dashboard/doctor/documents')
      }
    } else {
      const { data, error } = await updateDocument(documentId, formData)

      if (error) {
        alert(`Failed to update document: ${error}`)
        setIsSaving(false)
      } else {
        router.push('/dashboard/doctor/documents')
      }
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/doctor/documents')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isNewDocument ? 'Create Document' : 'Edit Document'}
        </h1>
        <p className="mt-1 text-gray-600">
          {isNewDocument
            ? 'Create a new document for your clinic'
            : 'Update document details and content'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <DocumentForm
          initialData={document || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </div>
    </div>
  )
}
