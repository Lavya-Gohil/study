'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiCheckCircle, FiX, FiRefreshCw } from 'react-icons/fi'

interface Question {
  id: string
  subject: string
  topic: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  year?: number
}

export default function PracticePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [subjects, setSubjects] = useState<string[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router])

  const fetchData = async () => {
    try {
      const [questionsRes, subjectsRes] = await Promise.all([
        fetch(`/api/questions${selectedSubject !== 'all' ? `?subject=${selectedSubject}` : ''}`),
        fetch('/api/onboarding'),
      ])

      if (questionsRes.ok) {
        const data = await questionsRes.json()
        setQuestions(data.questions || [])
      }

      if (subjectsRes.ok) {
        const data = await subjectsRes.json()
        setSubjects(data.subjects || [])
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedSubject])

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    const isCorrect = answerIndex === questions[currentIndex].correctAnswer
    if (isCorrect) {
      setScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }))
    } else {
      setScore((prev) => ({ ...prev, total: prev.total + 1 }))
    }
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const resetQuiz = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore({ correct: 0, total: 0 })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black/5">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-light tracking-tight">Practice</h1>
          </div>
          <div className="text-sm font-light opacity-60">
            {score.correct}/{score.total} correct
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Subject Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`h-10 px-6 rounded-full text-sm font-light transition ${
              selectedSubject === 'all'
                ? 'bg-black text-white'
                : 'border border-black/10 hover:bg-black/5'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`h-10 px-6 rounded-full text-sm font-light transition ${
                selectedSubject === subject
                  ? 'bg-black text-white'
                  : 'border border-black/10 hover:bg-black/5'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm font-light opacity-40 mb-6">No questions available yet</p>
            <p className="text-xs font-light opacity-30">Questions will be added soon</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-light opacity-60">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="border border-black/10 rounded-2xl p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs font-light opacity-40">
                  <span>{currentQuestion.subject}</span>
                  <span>•</span>
                  <span>{currentQuestion.topic}</span>
                  {currentQuestion.year && (
                    <>
                      <span>•</span>
                      <span>JEE {currentQuestion.year}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="capitalize">{currentQuestion.difficulty}</span>
                </div>
                <h2 className="text-2xl font-light leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = index === currentQuestion.correctAnswer
                  const showCorrect = showResult && isCorrect
                  const showWrong = showResult && isSelected && !isCorrect

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-xl text-left transition ${
                        showCorrect
                          ? 'bg-green-50 border-2 border-green-500'
                          : showWrong
                          ? 'bg-red-50 border-2 border-red-500'
                          : isSelected
                          ? 'border-2 border-black'
                          : 'border border-black/10 hover:border-black/20'
                      } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-light">{option}</span>
                        {showCorrect && <FiCheckCircle className="w-5 h-5 text-green-600" />}
                        {showWrong && <FiX className="w-5 h-5 text-red-600" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              {showResult && (
                <div className="pt-6 border-t border-black/10 space-y-2">
                  <div className="text-sm font-light opacity-40">Explanation</div>
                  <p className="font-light leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={resetQuiz}
                className="h-12 px-6 border border-black/10 rounded-full hover:bg-black/5 transition text-sm font-light flex items-center gap-2"
              >
                <FiRefreshCw className="w-4 h-4" />
                Reset
              </button>
              {showResult && currentIndex < questions.length - 1 && (
                <button
                  onClick={nextQuestion}
                  className="h-12 px-8 bg-black text-white rounded-full hover:bg-black/90 transition text-sm font-light"
                >
                  Next Question
                </button>
              )}
              {showResult && currentIndex === questions.length - 1 && (
                <div className="text-sm font-light opacity-60">
                  Quiz completed! Score: {score.correct}/{score.total}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
