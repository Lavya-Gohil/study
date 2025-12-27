'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiMenu, FiX, FiClock, FiTrendingUp, FiTarget, FiPlay, FiPause, FiSquare } from 'react-icons/fi'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subjects, setSubjects] = useState<string[]>([])
  const [streak, setStreak] = useState(0)
  const [totalHours, setTotalHours] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  
  // Study Session States
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [sessionDuration, setSessionDuration] = useState(25)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router])

  useEffect(() => {
    if (isSessionActive && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            endSession()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isSessionActive, isPaused, timeRemaining])

  // Lock device in fullscreen when session starts
  useEffect(() => {
    if (isSessionActive) {
      document.documentElement.requestFullscreen?.()
      document.body.style.overflow = 'hidden'
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.()
      }
      document.body.style.overflow = 'auto'
    }
  }, [isSessionActive])

  const fetchData = async () => {
    try {
      const [onboardingRes, streakRes, analyticsRes] = await Promise.all([
        fetch('/api/onboarding'),
        fetch('/api/streak'),
        fetch('/api/analytics'),
      ])

      if (onboardingRes.ok) {
        const data = await onboardingRes.json()
        setSubjects(data.subjects || [])
      }

      if (streakRes.ok) {
        const data = await streakRes.json()
        setStreak(data.streak?.currentStreak || data.streak || 0)
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json()
        const total = data.dailyHours?.reduce((sum: number, day: any) => sum + day.hours, 0) || 0
        setTotalHours(Math.round(total))
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const startSession = async () => {
    if (!selectedSubject) return
    setTimeRemaining(sessionDuration * 60)
    setIsSessionActive(true)
    setIsPaused(false)

    // Record focus session start
    try {
      await fetch('/api/focus-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          duration: sessionDuration,
        }),
      })
    } catch (error) {
      console.error('Start session error:', error)
    }
  }

  const endSession = async () => {
    setIsSessionActive(false)
    setIsPaused(false)
    setSelectedSubject(null)
    if (timerRef.current) clearInterval(timerRef.current)

    // Update focus session end
    try {
      await fetch('/api/focus-session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          actualDuration: Math.round((sessionDuration * 60 - timeRemaining) / 60),
        }),
      })
    } catch (error) {
      console.error('End session error:', error)
    }

    fetchData()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
      </div>
    )
  }

  // Fullscreen Focus Mode
  if (isSessionActive) {
    return (
      <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50">
        <div className="text-center space-y-8">
          <div className="text-sm font-light tracking-widest uppercase opacity-60">
            {selectedSubject}
          </div>
          <div className="text-9xl font-light tracking-tight">
            {formatTime(timeRemaining)}
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition"
            >
              {isPaused ? <FiPlay className="w-6 h-6" /> : <FiPause className="w-6 h-6" />}
            </button>
            <button
              onClick={endSession}
              className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition"
            >
              <FiSquare className="w-6 h-6" />
            </button>
          </div>
          <div className="text-xs opacity-40 font-light">
            {isPaused ? 'Paused' : 'Focus Mode Active • Device Locked'}
          </div>
        </div>
      </div>
    )
  }

  // Session Setup Modal
  if (selectedSubject && !isSessionActive) {
    return (
      <div className="fixed inset-0 bg-white z-40 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-12">
          <div className="text-center space-y-2">
            <div className="text-sm font-light tracking-widest uppercase opacity-40">
              Study Session
            </div>
            <h2 className="text-4xl font-light">{selectedSubject}</h2>
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-light">{sessionDuration}</div>
              <div className="text-sm font-light tracking-wide opacity-60">minutes</div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setSessionDuration(Math.max(5, sessionDuration - 5))}
                className="flex-1 h-12 border border-black/10 rounded-full hover:bg-black/5 transition text-sm font-light"
              >
                - 5 min
              </button>
              <button
                onClick={() => setSessionDuration(Math.min(120, sessionDuration + 5))}
                className="flex-1 h-12 border border-black/10 rounded-full hover:bg-black/5 transition text-sm font-light"
              >
                + 5 min
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[15, 25, 45, 60, 90, 120].map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSessionDuration(duration)}
                  className={`h-10 rounded-full text-sm font-light transition ${
                    sessionDuration === duration
                      ? 'bg-black text-white'
                      : 'border border-black/10 hover:bg-black/5'
                  }`}
                >
                  {duration}m
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startSession}
              className="w-full h-14 bg-black text-white rounded-full hover:bg-black/90 transition font-light tracking-wide"
            >
              Start Session
            </button>
            <button
              onClick={() => setSelectedSubject(null)}
              className="w-full h-14 border border-black/10 rounded-full hover:bg-black/5 transition font-light tracking-wide"
            >
              Cancel
            </button>
          </div>

          <div className="text-xs text-center opacity-40 font-light leading-relaxed">
            Your device will enter focus mode. All notifications will be blocked and only this app will be accessible.
          </div>
        </div>
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-white">
      {/* Minimalist Header */}
      <header className="border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-light tracking-tight">Study</h1>
            <div className="hidden md:flex items-center gap-6 text-sm font-light">
              <button
                onClick={() => router.push('/analytics')}
                className="opacity-60 hover:opacity-100 transition"
              >
                Analytics
              </button>
              <button
                onClick={() => router.push('/calendar')}
                className="opacity-60 hover:opacity-100 transition"
              >
                Calendar
              </button>
              <button
                onClick={() => router.push('/practice')}
                className="opacity-60 hover:opacity-100 transition"
              >
                Practice
              </button>
              <button
                onClick={() => router.push('/notes')}
                className="opacity-60 hover:opacity-100 transition"
              >
                Notes
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition"
          >
            {showMenu ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Side Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowMenu(false)}>
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-8">
              <div className="flex items-center justify-between">
                <div className="text-sm font-light opacity-40">Menu</div>
                <button onClick={() => setShowMenu(false)}>
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    router.push('/analytics')
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-black/5 transition font-light"
                >
                  Analytics
                </button>
                <button
                  onClick={() => {
                    router.push('/calendar')
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-black/5 transition font-light"
                >
                  Calendar
                </button>
                <button
                  onClick={() => {
                    router.push('/notes')
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-black/5 transition font-light"
                >
                  Notes
                </button>
                <button
                  onClick={() => {
                    router.push('/practice')
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-black/5 transition font-light"
                >
                  Practice Questions
                </button>
                <button
                  onClick={() => {
                    router.push('/achievements')
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-black/5 transition font-light"
                >
                  Achievements
                </button>
                <button
                  onClick={() => {
                    router.push('/settings')
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-black/5 transition font-light"
                >
                  Settings
                </button>
              </div>

              <div className="pt-8 border-t border-black/5">
                <div className="space-y-1 mb-6">
                  <div className="text-xs font-light opacity-40">Account</div>
                  <div className="text-sm font-light">{session?.user?.email}</div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full h-10 border border-black/10 rounded-full hover:bg-black/5 transition text-sm font-light"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="space-y-2">
            <div className="text-4xl font-light">{streak}</div>
            <div className="text-sm font-light opacity-40 tracking-wide">Day Streak</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-light">{totalHours}</div>
            <div className="text-sm font-light opacity-40 tracking-wide">Hours Studied</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-light">{subjects.length}</div>
            <div className="text-sm font-light opacity-40 tracking-wide">Subjects</div>
          </div>
        </div>

        {/* Subjects */}
        <div className="space-y-6">
          <h2 className="text-sm font-light tracking-widest uppercase opacity-40">
            Your Subjects
          </h2>

          {subjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm font-light opacity-40 mb-6">No subjects yet</p>
              <button
                onClick={() => router.push('/onboarding')}
                className="h-12 px-8 bg-black text-white rounded-full hover:bg-black/90 transition text-sm font-light tracking-wide"
              >
                Add Subjects
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className="group relative h-32 rounded-2xl border border-black/10 hover:border-black/20 transition overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition" />
                  <div className="relative h-full flex flex-col items-start justify-between p-6">
                    <div className="text-2xl font-light">{subject}</div>
                    <div className="flex items-center gap-2 text-xs font-light opacity-40">
                      <FiPlay className="w-3 h-3" />
                      <span>Start Session</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
