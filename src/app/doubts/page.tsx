'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { IconButton } from '@mui/material'
import { FiArrowLeft } from 'react-icons/fi'

export default function DoubtsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [subject, setSubject] = useState('Mathematics')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [doubtsToday, setDoubtsToday] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchDoubtsToday()
    }
  }, [status, router])

  const fetchDoubtsToday = async () => {
    try {
      const res = await fetch('/api/doubts')
      if (res.ok) {
        const data = await res.json()
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayCount = data.doubts.filter((d: any) => 
          new Date(d.createdAt) >= today
        ).length
        setDoubtsToday(todayCount)
      }
    } catch (error) {
      console.error('Fetch doubts error:', error)
    }
  }

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science']
  // All users have unlimited access

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAnswer('')

    try {
      const response = await fetch('/api/doubts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, subject }),
      })

      if (response.ok) {
        const data = await response.json()
        setAnswer(data.doubt.answer)
        setDoubtsToday(prev => prev + 1)
      }
    } catch (error) {
      console.error('Doubt solver error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <nav className="glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <IconButton
              onClick={() => router.push('/dashboard')}
              className="glass-pill"
              sx={{ width: 44, height: 44 }}
            >
              <FiArrowLeft className="w-6 h-6" />
            </IconButton>
            <h1 className="text-2xl font-bold text-slate-900">AI Doubt Solver</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="glass-card glass-shimmer rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 rounded-xl glass-select"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your doubt or question here..."
                rows={6}
                className="w-full p-3 rounded-xl glass-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !question}
              className="w-full py-3 glass-button glass-button-primary rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Solving...' : 'Get Answer'}
            </button>
          </form>

          {answer && (
            <div className="mt-8 p-6 bg-purple-50/80 rounded-2xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">
                Answer:
              </h3>
              <div className="text-gray-800 whitespace-pre-wrap">{answer}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
