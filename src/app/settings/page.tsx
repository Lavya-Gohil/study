'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiMoon, FiSun, FiBell, FiMail, FiClock, FiSave, FiTrash2 } from 'react-icons/fi'
import { IconButton } from '@mui/material'
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
  const saveTimer = useRef<NodeJS.Timeout | null>(null)

  const handleDarkModeToggle = () => {
    const newValue = !darkMode
    setDarkMode(newValue)
    document.documentElement.classList.toggle('dark', newValue)
    localStorage.setItem('darkMode', String(newValue))
    
    // Save to server
    setTimeout(() => {
      fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ darkMode: newValue }),
      }).catch(err => console.error('Failed to save dark mode:', err))
    }, 100)
  }

  useEffect(() => {
    // Load dark mode from localStorage immediately
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    document.documentElement.classList.toggle('dark', savedDarkMode)
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchUserSettings()
    }
  }, [status, router])

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

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
        if (darkMode !== (session?.user as any)?.darkMode) {
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

  const queueSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      handleSave()
    }, 450)
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
      <div className="app-shell flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <nav className="glass-nav">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <IconButton
              onClick={() => router.push('/dashboard')}
              className="glass-pill"
              sx={{ width: 44, height: 44 }}
            >
              <FiArrowLeft className="w-6 h-6" />
            </IconButton>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    queueSave()
                  }}
                  className="w-full px-4 py-2 rounded-xl glass-input text-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2 rounded-xl bg-slate-100/60 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!darkMode ? <FiMoon className="w-5 h-5 text-slate-600" /> : <FiSun className="w-5 h-5 text-slate-600" />}
                <div>
                  <div className="font-medium text-slate-900">Dark Mode</div>
                  <div className="text-sm text-slate-500">Toggle between light and dark themes</div>
                </div>
              </div>
                <button
                onClick={handleDarkModeToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-slate-300'
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
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiClock className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-medium text-slate-900">Study Reminders</div>
                    <div className="text-sm text-slate-500">Get reminded to study daily</div>
                  </div>
                </div>
                <button
                onClick={() => {
                  setStudyReminders(!studyReminders)
                  queueSave()
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  studyReminders ? 'bg-blue-600' : 'bg-slate-300'
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
                  <FiBell className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-medium text-slate-900">Break Reminders</div>
                    <div className="text-sm text-slate-500">Get reminded to take breaks</div>
                  </div>
                </div>
                <button
                onClick={() => {
                  setBreakReminders(!breakReminders)
                  queueSave()
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  breakReminders ? 'bg-blue-600' : 'bg-slate-300'
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
                  <FiMail className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-medium text-slate-900">Email Notifications</div>
                    <div className="text-sm text-slate-500">Receive weekly progress reports</div>
                  </div>
                </div>
                <button
                onClick={() => {
                  setEmailNotifications(!emailNotifications)
                  queueSave()
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-blue-600' : 'bg-slate-300'
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
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FiSave className="w-4 h-4" />
              {saving ? 'Saving…' : 'Changes saved automatically'}
            </div>
          </div>

          {/* Subscription */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Subscription</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Current Plan</div>
                  <div className="text-sm text-slate-500">
                    Premium - All Features Unlocked
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-600">
                You have full access to all features including unlimited subjects and doubts.
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card rounded-2xl p-6 border border-red-200/70 bg-red-50/70">
            <h2 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h2>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition flex items-center gap-2 font-medium"
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
