import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

interface DashboardHeaderProps {
  title?: string
  showLogo?: boolean
  className?: string
}

export async function DashboardHeader({ 
  title, 
  showLogo = true,
  className = ''
}: DashboardHeaderProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Fetch user's profile to determine role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let logoUrl = '/logos/practices/ws_endo_logo.svg' // default fallback
  let practiceName = 'Practice'

  if (profile?.role === 'doctor') {
    // Get doctor's clinic and logo
    const { data: doctor } = await supabase
      .from('doctors')
      .select(`
        clinic_id,
        clinics (
          name,
          logo_url
        )
      `)
      .eq('id', user.id)
      .single()
    
    const clinic = doctor?.clinics as unknown as { name: string; logo_url: string } | null
    if (clinic?.logo_url) {
      logoUrl = clinic.logo_url
      practiceName = clinic.name || practiceName
    }
  } else if (profile?.role === 'patient') {
    // Get patient's primary doctor's clinic logo
    const { data: link } = await supabase
      .from('doctor_patient_links')
      .select(`
        doctors!inner (
          clinic_id,
          clinics (
            name,
            logo_url
          )
        )
      `)
      .eq('patient_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: true })
      .limit(1)
      .single()
    
    const doctors = link?.doctors as unknown as { clinics: { name: string; logo_url: string } } | null
    if (doctors?.clinics?.logo_url) {
      logoUrl = doctors.clinics.logo_url
      practiceName = doctors.clinics.name || practiceName
    }
  }

  return (
    <header className={`border-b border-gray-800 bg-gray-900 px-4 py-4 ${className}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {showLogo && (
            <div className="flex items-center gap-4">
              <Image
                src={logoUrl}
                alt={`${practiceName} logo`}
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </div>
          )}
          {title && (
            <h1 className="text-xl font-semibold text-gray-100">{title}</h1>
          )}
        </div>
      </div>
    </header>
  )
}
