'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Activity } from 'lucide-react'
import { getMockUser, setMockSession } from '@/lib/mock-auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('handleLogin called', { email, password })
    setLoading(true)
    setError('')

    try {
      // Mock authentication
      const user = getMockUser(email, password)
      console.log('User found:', user)
      
      if (!user) {
        throw new Error('Invalid email or password')
      }

      setMockSession(user)

      const dashboardPath = user.profile.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'
      console.log('Redirecting to:', dashboardPath)
      // Use window.location for hard redirect to ensure localStorage is set
      window.location.href = dashboardPath
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-10 w-10 text-blue-400" />
            <span className="text-2xl font-bold text-gray-100">DentalHub</span>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-100 mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-6">Sign in to access your account</p>

          {/* Test Credentials Info */}
          <div className="mb-6 p-4 bg-blue-950/50 border border-blue-800 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-300 mb-2">Test Credentials</h3>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-blue-400 font-medium">Doctor Account:</p>
                <p className="text-gray-400">Email: doctor@test.com</p>
                <p className="text-gray-400">Password: doctor123</p>
              </div>
              <div className="mt-2 pt-2 border-t border-blue-900">
                <p className="text-blue-400 font-medium">Patient Account:</p>
                <p className="text-gray-400">Email: patient@test.com</p>
                <p className="text-gray-400">Password: patient123</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/register/doctor" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up as a doctor
              </Link>
              {' or '}
              <Link href="/register/patient" className="text-blue-400 hover:text-blue-300 font-medium">
                patient
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
