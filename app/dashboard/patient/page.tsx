'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Activity, Calendar, FileText, MessageSquare, UserPlus, LogOut } from 'lucide-react'
import { getMockSession, clearMockSession, MOCK_STATS, MOCK_USERS } from '@/lib/mock-auth'

export default function PatientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<typeof MOCK_USERS.patient | null>(null)

  useEffect(() => {
    const session = getMockSession()
    if (!session || session.profile.role !== 'patient') {
      router.push('/login')
      return
    }
    setUser(session)
  }, [router])

  const handleSignOut = () => {
    clearMockSession()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  const profile = user.profile
  const upcomingAppointments = MOCK_STATS.patient.upcomingAppointments
  const unreadMessages = MOCK_STATS.patient.unreadMessages
  const linkedDoctors = MOCK_STATS.patient.linkedDoctors

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-gray-100">DentalHub</h1>
                <p className="text-sm text-gray-400">Welcome, {profile?.full_name}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
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
          <div className="bg-blue-950/50 border border-blue-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Get Started</h3>
            <p className="text-blue-400 mb-4">
              Link with your dentist to access appointments, records, and communicate securely.
            </p>
            <Link
              href="/dashboard/patient/link-dentist"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Link Dentist
            </Link>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Quick Actions</h2>
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

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-100 mb-4">Recent Activity</h2>
          <p className="text-gray-400">No recent activity to display.</p>
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
    blue: 'bg-blue-950 text-blue-400',
    green: 'bg-green-950 text-green-400',
    purple: 'bg-purple-950 text-purple-400',
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-100 mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
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
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 hover:bg-gray-800 transition-all"
    >
      <div className="text-blue-400 mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </Link>
  )
}
