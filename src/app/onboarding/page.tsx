'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const EXAM_TYPES = ['JEE Main', 'JEE Advanced', 'SAT', 'Class 10 Boards', 'Class 12 Boards', 'NEET', 'Other']
const COMMON_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science']

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  const [formData, setFormData] = useState({
    examType: '',
    subjects: [] as string[],
    dailyHours: 4,
    examDate: '',
  })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSubject = (subject: string) => {
    const isFreeUser = !session?.user?.subscriptionStatus || session?.user?.subscriptionStatus === 'free'
    const maxSubjects = isFreeUser ? 3 : 10
    
    setFormData(prev => {
      const isRemoving = prev.subjects.includes(subject)
      const canAdd = prev.subjects.length < maxSubjects
      
      if (!isRemoving && !canAdd) {
        alert(`Free plan limited to ${maxSubjects} subjects. Upgrade to Premium for unlimited subjects!`)
        return prev
      }
      
      return {
        ...prev,
        subjects: isRemoving
          ? prev.subjects.filter(s => s !== subject)
          : [...prev.subjects, subject]
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 mx-1 rounded ${
                  s <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 1 && 'What exam are you preparing for?'}
            {step === 2 && 'Which subjects will you study?'}
            {step === 3 && 'How many hours can you study daily?'}
            {step === 4 && 'When is your exam?'}
          </h2>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            {EXAM_TYPES.map((exam) => (
              <button
                key={exam}
                onClick={() => setFormData({ ...formData, examType: exam })}
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  formData.examType === exam
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-3">
            {COMMON_SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={`p-4 rounded-lg border-2 transition ${
                  formData.subjects.includes(subject)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl font-bold text-blue-600">
                {formData.dailyHours}
              </span>
              <span className="text-2xl text-gray-600 ml-2">hours/day</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={formData.dailyHours}
              onChange={(e) =>
                setFormData({ ...formData, dailyHours: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-gray-500 text-center">
              Recommended: 4-6 hours for optimal retention
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <input
              type="date"
              value={formData.examDate}
              onChange={(e) =>
                setFormData({ ...formData, examDate: e.target.value })
              }
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none text-lg"
            />
            {formData.examDate && (
              <p className="text-center text-gray-600">
                {Math.ceil(
                  (new Date(formData.examDate).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{' '}
                days until your exam
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (step === 4) {
                handleSubmit()
              } else {
                setStep(step + 1)
              }
            }}
            disabled={
              (step === 1 && !formData.examType) ||
              (step === 2 && formData.subjects.length === 0) ||
              (step === 4 && !formData.examDate) ||
              loading
            }
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 4 ? (loading ? 'Setting up...' : 'Get Started') : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
