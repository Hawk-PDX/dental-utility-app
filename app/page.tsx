import Link from 'next/link'
import { Activity, Calendar, FileText, MessageSquare, Users, X } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-gray-100">DentalHub</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register/doctor"
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-100 mb-6">
            Streamline Your Dental Practice
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            A comprehensive platform that simplifies patient management, appointments, and communication for modern dental practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register/doctor"
              className="px-8 py-4 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50"
            >
              Start as a Doctor
            </Link>
            <Link
              href="/register/patient"
              className="px-8 py-4 text-lg font-semibold bg-gray-800 text-blue-400 border-2 border-blue-500 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Join as a Patient
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-100 mb-12">
            Everything You Need in One Place
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Smart Scheduling"
              description="Manage appointments with calendar views by day, week, or month. Patients can request appointments seamlessly."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Patient Management"
              description="Track patient history, treatment plans, and dental records all in one secure location."
            />
            <FeatureCard
              icon={<X className="h-8 w-8" />}
              title="X-Ray Storage"
              description="Upload and organize patient x-rays with secure cloud storage and easy access."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8" />}
              title="Digital Intake Forms"
              description="Patients can complete intake forms digitally before their appointment, saving time."
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="Secure Messaging"
              description="Direct communication between doctors and patients with full message history."
            />
            <FeatureCard
              icon={<Activity className="h-8 w-8" />}
              title="Referral Network"
              description="Maintain a directory of referring doctors and track professional relationships."
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join dental professionals who trust DentalHub for their daily operations.
          </p>
          <Link
            href="/register/doctor"
            className="inline-block px-8 py-4 text-lg font-semibold bg-gray-900 text-blue-400 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      <footer className="bg-black border-t border-gray-800 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold text-gray-100">DentalHub</span>
              </div>
              <p className="text-sm">
                Streamlining dental practice management one clinic at a time.
              </p>
            </div>
            <div>
              <h3 className="text-gray-100 font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:support@dentalhub.com" className="hover:text-blue-400 transition-colors">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Report an Issue
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-100 font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li className="text-xs text-gray-500 mt-4">
                  HIPAA Compliant • Secure & Encrypted
                </li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-sm text-center">
            <p>© 2024 DentalHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-blue-500/50 transition-all">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}
