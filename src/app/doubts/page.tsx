'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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

      if (response.status === 403) {
        const data = await response.json()
        alert(data.error)
        return
      }

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-blue-600">AI Doubt Solver</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {session?.user?.subscriptionStatus === 'free' && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-medium">
                  📝 Free Plan: {doubtsToday}/3 doubts used today
                </p>
                {doubtsToday >= 3 && (
                  <p className="text-sm text-blue-600 mt-1">
                    Upgrade to Premium for unlimited doubts!
                  </p>
                )}
              </div>
              {doubtsToday >= 3 && (
                <button
                  onClick={() => router.push('/pricing')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Upgrade Now
                </button>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your doubt or question here..."
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !question}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Solving...' : 'Get Answer'}
            </button>
          </form>

          {answer && (
            <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
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
