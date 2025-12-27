'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiMoon, FiSun, FiBell, FiMail, FiClock, FiSave, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [studyReminders, setStudyReminders] = useState(true)
  const [breakReminders, setBreakReminders] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Load dark mode preference from localStorage on mount
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchUserSettings()
    }
  }, [status, router])

  useEffect(() => {
    // Apply dark mode to document and save to localStorage
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.body.style.backgroundColor = '#111827'
      document.body.style.color = '#ffffff'
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  const fetchUserSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setName(data.name || '')
        setEmail(data.email || '')
        setDarkMode(data.darkMode || false)
        setStudyReminders(data.studyReminders ?? true)
        setBreakReminders(data.breakReminders ?? true)
        setEmailNotifications(data.emailNotifications || false)
      }
    } catch (error) {
      console.error('Fetch settings error:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          darkMode,
          studyReminders,
          breakReminders,
          emailNotifications,
        }),
      })

      if (res.ok) {
        toast.success('Settings saved!')
        if (darkMode !== (session?.user as any)?.darkMode) {
          // Apply dark mode
          document.documentElement.classList.toggle('dark', darkMode)
        }
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      console.error('Save settings error:', error)
      toast.error('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Account deleted')
        await signOut({ callbackUrl: '/' })
      } else {
        toast.error('Failed to delete account')
      }
    } catch (error) {
      console.error('Delete account error:', error)
      toast.error('An error occurred')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-blue-600">Settings</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <FiMoon className="w-5 h-5 text-gray-600" /> : <FiSun className="w-5 h-5 text-gray-600" />}
                <div>
                  <div className="font-medium text-gray-900">Dark Mode</div>
                  <div className="text-sm text-gray-500">Toggle between light and dark themes</div>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiClock className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Study Reminders</div>
                    <div className="text-sm text-gray-500">Get reminded to study daily</div>
                  </div>
                </div>
                <button
                  onClick={() => setStudyReminders(!studyReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    studyReminders ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      studyReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBell className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Break Reminders</div>
                    <div className="text-sm text-gray-500">Get reminded to take breaks</div>
                  </div>
                </div>
                <button
                  onClick={() => setBreakReminders(!breakReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    breakReminders ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      breakReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiMail className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email Notifications</div>
                    <div className="text-sm text-gray-500">Receive weekly progress reports</div>
                  </div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
            >
              <FiSave className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h2>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 font-medium"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
