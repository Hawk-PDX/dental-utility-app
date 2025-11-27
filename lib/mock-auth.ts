/**
 * Mock Authentication for Testing
 * This bypasses Supabase for local development testing
 */

export const MOCK_USERS = {
  doctor: {
    id: 'mock-doctor-id',
    email: 'doctor@test.com',
    password: 'doctor123',
    profile: {
      role: 'doctor',
      full_name: 'Dr. Sarah Johnson',
      phone: '(555) 123-4567',
    },
    doctor: {
      license_number: 'DDS-12345',
      specialty: 'General Dentistry',
      clinic_id: 'mock-clinic-id',
      clinics: {
        id: 'mock-clinic-id',
        name: 'Bright Smiles Dental',
        address: '123 Main St, Portland, OR 97201',
        phone: '(555) 987-6543',
        email: 'info@brightsmiles.com',
      },
    },
  },
  patient: {
    id: 'mock-patient-id',
    email: 'patient@test.com',
    password: 'patient123',
    profile: {
      role: 'patient',
      full_name: 'John Smith',
      phone: '(555) 555-5555',
    },
    patient: {
      date_of_birth: '1990-05-15',
      insurance: 'Blue Cross',
    },
  },
}

export function getMockUser(email: string, password: string) {
  if (email === MOCK_USERS.doctor.email && password === MOCK_USERS.doctor.password) {
    return MOCK_USERS.doctor
  }
  if (email === MOCK_USERS.patient.email && password === MOCK_USERS.patient.password) {
    return MOCK_USERS.patient
  }
  return null
}

export function setMockSession(user: typeof MOCK_USERS.doctor | typeof MOCK_USERS.patient) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mock-auth-user', JSON.stringify(user))
  }
}

export function getMockSession() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mock-auth-user')
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export function clearMockSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mock-auth-user')
  }
}

// Mock counts for dashboard stats
export const MOCK_STATS = {
  doctor: {
    todayAppointments: 5,
    totalPatients: 142,
    unreadMessages: 3,
  },
  patient: {
    upcomingAppointments: 2,
    linkedDoctors: 1,
    unreadMessages: 1,
  },
}
