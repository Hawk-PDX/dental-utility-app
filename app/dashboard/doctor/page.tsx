'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Activity, Calendar, Users, X, FileText, MessageSquare, LogOut } from 'lucide-react'
import { getMockSession, clearMockSession, MOCK_STATS, MOCK_USERS } from '@/lib/mock-auth'

export default function DoctorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<typeof MOCK_USERS.doctor | null>(null)

  useEffect(() => {
    const session = getMockSession()
    if (!session || session.profile.role !== 'doctor') {
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
  const doctor = user.doctor
  const todayAppointments = MOCK_STATS.doctor.todayAppointments
  const totalPatients = MOCK_STATS.doctor.totalPatients
  const unreadMessages = MOCK_STATS.doctor.unreadMessages

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-gray-100">
                  {doctor?.clinics?.name || 'DentalHub'}
                </h1>
                <p className="text-sm text-gray-400">Welcome, Dr. {profile?.full_name?.split(' ')[1] || profile?.full_name}</p>
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
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Quick Actions</h2>
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
