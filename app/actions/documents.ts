'use server'

import { createClient } from '@/lib/supabase/server'
import { ClinicDocument, DocumentCategory } from '@/lib/types/database'
import { revalidatePath } from 'next/cache'

// Fetch all documents for a clinic with optional filters
export async function getClinicDocuments(
  clinicId: string,
  category?: DocumentCategory,
  search?: string
): Promise<{ data: ClinicDocument[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('clinic_documents')
      .select('*')
      .eq('clinic_id', clinicId)
      .order('updated_at', { ascending: false })

    // Apply category filter if provided
    if (category) {
      query = query.eq('category', category)
    }

    // Apply search filter if provided (searches title and tags)
    if (search && search.trim()) {
      query = query.or(`title.ilike.%${search}%,tags.cs.{${search}}`)
    }

    const { data, error } = await query

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch documents' }
  }
}

// Fetch a single document by ID
export async function getDocumentById(
  id: string
): Promise<{ data: ClinicDocument | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('clinic_documents')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch document' }
  }
}

// Create a new document
export async function createDocument(
  documentData: {
    clinic_id: string
    created_by: string
    title: string
    content: string
    category?: DocumentCategory
    is_template?: boolean
    is_shared_with_patients?: boolean
    tags?: string[]
  }
): Promise<{ data: ClinicDocument | null; error: string | null }> {
  try {
    const supabase = await createClient()

    // Validate required fields
    if (!documentData.title.trim()) {
      return { data: null, error: 'Title is required' }
    }

    if (!documentData.content.trim()) {
      return { data: null, error: 'Content is required' }
    }

    const { data, error } = await supabase
      .from('clinic_documents')
      .insert({
        clinic_id: documentData.clinic_id,
        created_by: documentData.created_by,
        title: documentData.title.trim(),
        content: documentData.content,
        category: documentData.category || null,
        is_template: documentData.is_template || false,
        is_shared_with_patients: documentData.is_shared_with_patients || false,
        tags: documentData.tags || [],
        version: 1,
      })
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    revalidatePath('/dashboard/doctor/documents')
    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to create document' }
  }
}

// Update an existing document
export async function updateDocument(
  id: string,
  updates: {
    title?: string
    content?: string
    category?: DocumentCategory
    is_template?: boolean
    is_shared_with_patients?: boolean
    tags?: string[]
  }
): Promise<{ data: ClinicDocument | null; error: string | null }> {
  try {
    const supabase = await createClient()

    // First, get the current document to increment version
    const { data: currentDoc, error: fetchError } = await supabase
      .from('clinic_documents')
      .select('version')
      .eq('id', id)
      .single()

    if (fetchError) {
      return { data: null, error: 'Document not found' }
    }

    // Prepare update data with incremented version
    const updateData: any = {
      ...updates,
      version: currentDoc.version + 1,
    }

    // Clean up any undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const { data, error } = await supabase
      .from('clinic_documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    revalidatePath('/dashboard/doctor/documents')
    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to update document' }
  }
}

// Delete a document
export async function deleteDocument(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('clinic_documents')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/doctor/documents')
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error: 'Failed to delete document' }
  }
}

// Duplicate a document (creates a copy)
export async function duplicateDocument(
  id: string
): Promise<{ data: ClinicDocument | null; error: string | null }> {
  try {
    const supabase = await createClient()

    // Get the original document
    const { data: original, error: fetchError } = await supabase
      .from('clinic_documents')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !original) {
      return { data: null, error: 'Document not found' }
    }

    // Get current user to set as creator of the copy
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: 'Not authenticated' }
    }

    // Create a copy with modified title
    const { data, error } = await supabase
      .from('clinic_documents')
      .insert({
        clinic_id: original.clinic_id,
        created_by: user.id,
        title: `${original.title} (Copy)`,
        content: original.content,
        category: original.category,
        is_template: original.is_template,
        is_shared_with_patients: false, // Reset sharing for copies
        tags: original.tags,
        version: 1, // New document starts at version 1
      })
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    revalidatePath('/dashboard/doctor/documents')
    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to duplicate document' }
  }
}

// Toggle patient sharing for a document
export async function togglePatientSharing(
  id: string,
  isShared: boolean
): Promise<{ data: ClinicDocument | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('clinic_documents')
      .update({ is_shared_with_patients: isShared })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    revalidatePath('/dashboard/doctor/documents')
    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to update sharing status' }
  }
}
