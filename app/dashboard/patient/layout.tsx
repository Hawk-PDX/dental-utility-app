import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader />
      {children}
    </div>
  )
}
