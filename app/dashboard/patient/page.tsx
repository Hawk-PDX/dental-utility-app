import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Activity, Calendar, FileText, MessageSquare, UserPlus, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function PatientDashboard() {
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

  const now = new Date().toISOString()
  const { count: upcomingAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', user.id)
    .gte('appointment_date', now)
    .eq('status', 'scheduled')

  const { count: unreadMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', user.id)
    .eq('read', false)

  const { count: linkedDoctors } = await supabase
    .from('doctor_patient_links')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', user.id)
    .eq('status', 'active')

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
                <h1 className="text-xl font-bold text-gray-900">DentalHub</h1>
                <p className="text-sm text-gray-500">Welcome, {profile?.full_name}</p>
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
            label="Upcoming Appointments"
            value={upcomingAppointments || 0}
            color="blue"
          />
          <StatCard
            icon={<UserPlus className="h-6 w-6" />}
            label="Linked Dentists"
            value={linkedDoctors || 0}
            color="green"
          />
          <StatCard
            icon={<MessageSquare className="h-6 w-6" />}
            label="Unread Messages"
            value={unreadMessages || 0}
            color="purple"
          />
        </div>

        {linkedDoctors === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Get Started</h3>
            <p className="text-blue-700 mb-4">
              Link with your dentist to access appointments, records, and communicate securely.
            </p>
            <Link
              href="/dashboard/patient/link-dentist"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Link Dentist
            </Link>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              href="/dashboard/patient/appointments"
              icon={<Calendar className="h-8 w-8" />}
              title="Appointments"
              description="View and request appointments"
            />
            <ActionCard
              href="/dashboard/patient/records"
              icon={<FileText className="h-8 w-8" />}
              title="Medical Records"
              description="View your dental records"
            />
            <ActionCard
              href="/dashboard/patient/intake"
              icon={<FileText className="h-8 w-8" />}
              title="Intake Forms"
              description="Complete digital forms"
            />
            <ActionCard
              href="/dashboard/patient/messages"
              icon={<MessageSquare className="h-8 w-8" />}
              title="Messages"
              description="Contact your dentist"
            />
            <ActionCard
              href="/dashboard/patient/link-dentist"
              icon={<UserPlus className="h-8 w-8" />}
              title="Link Dentist"
              description="Connect with your dentist"
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
