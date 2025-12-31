'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiCheckCircle, FiX, FiRefreshCw, FiLock, FiPlay } from 'react-icons/fi'
import { Button, Card, CardContent, IconButton, Typography } from '@mui/material'

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
  
  // Configuration state
  const [configStep, setConfigStep] = useState<'setup' | 'practicing'>('setup')
  const [numQuestions, setNumQuestions] = useState<number>(10)
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('mixed')
  const [isDeviceLocked, setIsDeviceLocked] = useState(false)
  
  // Practice state
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [subjects, setSubjects] = useState<string[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchSubjects()
    }
  }, [status, router])

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/onboarding')
      if (res.ok) {
        const data = await res.json()
        setSubjects(data.subjects || [])
      }
    } catch (error) {
      console.error('Fetch subjects error:', error)
    } finally {
      setLoading(false)
    }
  }

  const startPractice = async () => {
    try {
      setLoading(true)
      
      // Build query params
      const params = new URLSearchParams()
      if (selectedSubject !== 'all') params.append('subject', selectedSubject)
      if (selectedDifficulty !== 'mixed') params.append('difficulty', selectedDifficulty)
      params.append('limit', numQuestions.toString())

      const res = await fetch(`/api/questions?${params}`)
      if (res.ok) {
        const data = await res.json()
        setQuestions(data.questions || [])
        setConfigStep('practicing')
        
        // Enable device lock (fullscreen mode)
        try {
          const elem = document.documentElement
          if (elem.requestFullscreen) {
            await elem.requestFullscreen()
            setIsDeviceLocked(true)
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error)
        }
      }
    } catch (error) {
      console.error('Start practice error:', error)
    } finally {
      setLoading(false)
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        setIsDeviceLocked(false)
      }
    } catch (error) {
      console.log('Exit fullscreen error:', error)
    }
  }

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

  const resetQuiz = async () => {
    await exitFullscreen()
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore({ correct: 0, total: 0 })
    setConfigStep('setup')
    setQuestions([])
  }

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="w-3 h-3 bg-slate-900 rounded-full animate-pulse" />
      </div>
    )
  }

  // Configuration Setup Screen
  if (configStep === 'setup') {
    const hasSubjects = subjects.length > 0

    return (
      <div className="app-shell p-4">
        <div className="max-w-2xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center mb-8 pt-6">
            <IconButton
              onClick={() => router.push('/dashboard')}
              className="glass-pill"
              sx={{ width: 44, height: 44 }}
            >
              <FiArrowLeft className="w-6 h-6" />
            </IconButton>
            <Typography variant="h5" className="ml-4 text-slate-900 font-bold">
              Configure Practice Session
            </Typography>
          </div>

          <Card className="glass-card glass-shimmer rounded-3xl">
            <CardContent className="p-8 space-y-8">
            {!hasSubjects && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-slate-600">
                Add subjects first to unlock practice sessions.
                <button
                  onClick={() => router.push('/onboarding')}
                  className="ml-3 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Complete onboarding →
                </button>
              </div>
            )}
            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium mb-3">
                How many questions do you want to practice?
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[5, 10, 20, 30].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNumQuestions(num)}
                    className={`py-3 px-4 rounded-xl border-2 transition-all ${
                      numQuestions === num
                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.min(120, Math.max(1, parseInt(e.target.value) || 10)))}
                className="mt-3 w-full px-4 py-2 rounded-xl glass-input"
                placeholder="Or enter custom number (1-120)"
                min="1"
                max="120"
              />
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Choose subject
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedSubject('all')}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    selectedSubject === 'all'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  🎯 All Subjects (Mixed)
                </button>
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`py-3 px-4 rounded-xl border-2 transition-all ${
                      selectedSubject === subject
                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {subject === 'Physics' && '⚛️ '}
                    {subject === 'Mathematics' && '📐 '}
                    {subject === 'Chemistry' && '🧪 '}
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Choose difficulty level
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'mixed', label: '🎲 Mixed (All Levels)', color: 'purple' },
                  { value: 'easy', label: '😊 Easy', color: 'green' },
                  { value: 'medium', label: '🤔 Medium', color: 'yellow' },
                  { value: 'hard', label: '🔥 Hard', color: 'red' },
                ].map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => setSelectedDifficulty(diff.value)}
                    className={`py-3 px-4 rounded-xl border-2 transition-all ${
                      selectedDifficulty === diff.value
                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-4">
              <Button
                onClick={startPractice}
                disabled={loading || !hasSubjects}
                className="glass-button glass-button-primary rounded-xl font-semibold shadow-lg"
                sx={{ width: '100%', py: 2, textTransform: 'none' }}
              >
                <FiPlay className="w-5 h-5" />
                <span className="ml-2">Start Practice</span>
                <FiLock className="w-4 h-4 opacity-70" />
              </Button>
              <p className="text-center text-sm text-slate-500 mt-3">
                🔒 Device will be locked in fullscreen mode during practice
              </p>
            </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { value: '120+', label: 'Total Questions', color: 'text-blue-600' },
              { value: '3', label: 'Subjects', color: 'text-purple-600' },
              { value: 'JEE', label: 'Exam Pattern', color: 'text-green-600' },
            ].map((item) => (
              <Card key={item.label} className="glass-card rounded-2xl">
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-sm text-slate-600">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Practice Screen (Fullscreen Locked Mode)
  if (configStep === 'practicing') {
    const currentQuestion = questions[currentIndex]
    const isFinished = currentIndex === questions.length - 1 && showResult

    if (!currentQuestion) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl mb-4">No questions available</p>
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200"
            >
              Back to Setup
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <FiLock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Device Locked</span>
              </div>
              <div className="text-sm text-white/70">
                Question {currentIndex + 1} of {questions.length}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {score.correct}/{score.total}
              </div>
              <div className="text-sm text-white/70">Correct</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-8">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Subject & Difficulty Badge */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="px-3 py-1 bg-blue-500/30 rounded-full text-sm font-medium">
                {currentQuestion.subject}
              </span>
              <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm font-medium capitalize">
                {currentQuestion.difficulty}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {currentQuestion.topic}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-semibold mb-8 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-4 mb-6">
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
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all transform hover:scale-102 ${
                      showCorrect
                        ? 'border-green-400 bg-green-500/20'
                        : showWrong
                        ? 'border-red-400 bg-red-500/20'
                        : isSelected
                        ? 'border-white bg-white/20'
                        : 'border-white/30 bg-white/5 hover:bg-white/10'
                    } disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex-1">{option}</span>
                      {showCorrect && (
                        <FiCheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 ml-3" />
                      )}
                      {showWrong && (
                        <FiX className="w-6 h-6 text-red-400 flex-shrink-0 ml-3" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {showResult && (
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FiCheckCircle className="w-5 h-5 mr-2 text-blue-400" />
                  Explanation
                </h3>
                <p className="text-white/90">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              {!isFinished ? (
                <button
                  onClick={nextQuestion}
                  disabled={!showResult}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Next Question →
                </button>
              ) : (
                <div className="flex items-center space-x-4 w-full">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 px-8 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 border border-white/30"
                  >
                    <FiRefreshCw className="w-5 h-5" />
                    <span>New Practice</span>
                  </button>
                  <button
                    onClick={async () => {
                      await exitFullscreen()
                      router.push('/dashboard')
                    }}
                    className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Final Score */}
          {isFinished && (
            <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
              <h2 className="text-3xl font-bold mb-4">Practice Complete! 🎉</h2>
              <div className="text-6xl font-bold mb-2">
                {Math.round((score.correct / score.total) * 100)}%
              </div>
              <p className="text-xl text-white/80 mb-6">
                You got {score.correct} out of {score.total} correct
              </p>
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full font-semibold">
                {score.correct / score.total >= 0.8
                  ? '🌟 Excellent Work!'
                  : score.correct / score.total >= 0.6
                  ? '👍 Good Job!'
                  : '💪 Keep Practicing!'}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
