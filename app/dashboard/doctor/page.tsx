import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Activity, Calendar, Users, X, FileText, MessageSquare, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function DoctorDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: doctor } = await supabase
    .from('doctors')
    .select('*, clinics(*)')
    .eq('id', user.id)
    .single()

  const today = new Date().toISOString().split('T')[0]
  const { count: todayAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('doctor_id', user.id)
    .gte('appointment_date', today)
    .lt('appointment_date', new Date(Date.now() + 86400000).toISOString())

  const { count: totalPatients } = await supabase
    .from('doctor_patient_links')
    .select('*', { count: 'exact', head: true })
    .eq('doctor_id', user.id)
    .eq('status', 'active')

  const { count: unreadMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', user.id)
    .eq('read', false)

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {doctor?.clinics?.name || 'DentalHub'}
                </h1>
                <p className="text-sm text-gray-500">Welcome, Dr. {profile?.full_name?.split(' ')[1] || profile?.full_name}</p>
              </div>
            </div>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Calendar className="h-6 w-6" />}
            label="Today's Appointments"
            value={todayAppointments || 0}
            color="blue"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            label="Total Patients"
            value={totalPatients || 0}
            color="green"
          />
          <StatCard
            icon={<MessageSquare className="h-6 w-6" />}
            label="Unread Messages"
            value={unreadMessages || 0}
            color="purple"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              href="/dashboard/doctor/appointments"
              icon={<Calendar className="h-8 w-8" />}
              title="Appointments"
              description="Manage your schedule"
            />
            <ActionCard
              href="/dashboard/doctor/patients"
              icon={<Users className="h-8 w-8" />}
              title="Patients"
              description="View patient records"
            />
            <ActionCard
              href="/dashboard/doctor/xrays"
              icon={<X className="h-8 w-8" />}
              title="X-Rays"
              description="Upload and manage x-rays"
            />
            <ActionCard
              href="/dashboard/doctor/referrals"
              icon={<FileText className="h-8 w-8" />}
              title="Referring Doctors"
              description="Manage your referral network"
            />
            <ActionCard
              href="/dashboard/doctor/messages"
              icon={<MessageSquare className="h-8 w-8" />}
              title="Messages"
              description="Communicate with patients"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600">No recent activity to display.</p>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: 'blue' | 'green' | 'purple'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  )
}

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="text-blue-600 mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  )
}
