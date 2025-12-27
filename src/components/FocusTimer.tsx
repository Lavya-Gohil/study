'use client'

import { useState, useEffect } from 'react'

interface FocusTimerProps {
  onComplete: () => void
}

export default function FocusTimer({ onComplete }: FocusTimerProps) {
  const [mode, setMode] = useState<'pomodoro' | 'deep-focus'>('pomodoro')
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    
    if (mode === 'pomodoro' && !isBreak) {
      // Switch to break
      setIsBreak(true)
      setTimeLeft(5 * 60) // 5 minute break
    } else if (mode === 'pomodoro' && isBreak) {
      // End of break
      setIsBreak(false)
      setTimeLeft(25 * 60)
      onComplete()
    } else {
      // Deep focus completed
      onComplete()
    }
  }

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    if (mode === 'pomodoro') {
      setTimeLeft(25 * 60)
    } else {
      setTimeLeft(60 * 60) // 60 minutes for deep focus
    }
  }

  const switchMode = (newMode: 'pomodoro' | 'deep-focus') => {
    setMode(newMode)
    setIsRunning(false)
    setIsBreak(false)
    if (newMode === 'pomodoro') {
      setTimeLeft(25 * 60)
    } else {
      setTimeLeft(60 * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = mode === 'pomodoro'
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((60 * 60 - timeLeft) / (60 * 60)) * 100

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchMode('pomodoro')}
          className={`flex-1 py-2 rounded-lg font-medium transition ${
            mode === 'pomodoro'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => switchMode('deep-focus')}
          className={`flex-1 py-2 rounded-lg font-medium transition ${
            mode === 'deep-focus'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Deep Focus
        </button>
      </div>

      {isBreak && (
        <div className="text-center mb-4 text-green-600 font-medium">
          Break Time! ☕
        </div>
      )}

      <div className="relative mb-8">
        <svg className="w-64 h-64 mx-auto transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="112"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="128"
            cy="128"
            r="112"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 112}`}
            strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
            className={isBreak ? 'text-green-500' : mode === 'pomodoro' ? 'text-blue-600' : 'text-purple-600'}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold text-gray-800">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className={`px-8 py-3 rounded-lg font-medium text-white ${
              mode === 'pomodoro' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="px-8 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 font-medium text-white"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="px-8 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium text-gray-800"
        >
          Reset
        </button>
      </div>

      {mode === 'deep-focus' && isRunning && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800 text-center">
            🔒 Distraction lock active. Stay focused!
          </p>
        </div>
      )}
    </div>
  )
}
