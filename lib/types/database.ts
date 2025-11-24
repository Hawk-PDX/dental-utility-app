export type UserRole = 'doctor' | 'patient'
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'
export type LinkStatus = 'pending' | 'active' | 'inactive'

export interface Profile {
  id: string
  role: UserRole
  email: string
  full_name: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Clinic {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  logo_url?: string
  primary_color: string
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  clinic_id?: string
  license_number?: string
  specialty?: string
  bio?: string
  created_at: string
}

export interface Patient {
  id: string
  date_of_birth?: string
  insurance_provider?: string
  insurance_policy_number?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_notes?: string
  dental_history?: string
  created_at: string
}

export interface DoctorPatientLink {
  id: string
  doctor_id: string
  patient_id: string
  status: LinkStatus
  created_at: string
}

export interface Appointment {
  id: string
  doctor_id: string
  patient_id: string
  appointment_date: string
  duration_minutes: number
  status: AppointmentStatus
  reason?: string
  notes?: string
  doctor_notes?: string
  created_at: string
  updated_at: string
}

export interface XRay {
  id: string
  patient_id: string
  doctor_id: string
  file_path: string
  file_name: string
  description?: string
  taken_date?: string
  notes?: string
  created_at: string
}

export interface IntakeForm {
  id: string
  patient_id: string
  doctor_id?: string
  form_data: Record<string, any>
  submitted_at: string
}

export interface ReferringDoctor {
  id: string
  doctor_id: string
  name: string
  specialty?: string
  clinic_name?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  subject?: string
  body: string
  read: boolean
  parent_message_id?: string
  created_at: string
}
