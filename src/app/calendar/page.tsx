'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Card, CardContent, IconButton, Typography } from '@mui/material'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchPlans()
    }
  }, [status, router, currentMonth])

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/calendar')
      if (res.ok) {
        const data = await res.json()
        setPlans(data.plans)
      }
    } catch (error) {
      console.error('Fetch plans error:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDay = monthStart.getDay()
  const daysToShow = [...Array(startDay).fill(null), ...daysInMonth]

  const getPlanForDate = (date: Date) => {
    return plans.find((plan) => {
      const planDate = new Date(plan.date)
      return isSameDay(planDate, date)
    })
  }

  const getStudyHoursForDate = (date: Date) => {
    const plan = getPlanForDate(date)
    if (!plan) return 0
    const tasks = plan.tasks as any[]
    return tasks.reduce((sum, t) => sum + (t.completed ? t.duration : 0), 0)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const plan = getPlanForDate(date)
    setSelectedPlan(plan)
  }

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
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
            <Typography variant="h5" className="text-slate-900 font-bold">
              Study Calendar
            </Typography>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 glass-card rounded-2xl">
            <CardContent className="p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <IconButton
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="glass-pill"
                sx={{ width: 40, height: 40 }}
              >
                <FiChevronLeft className="w-6 h-6" />
              </IconButton>
              <Typography variant="h5" className="text-slate-900 font-bold">
                {format(currentMonth, 'MMMM yyyy')}
              </Typography>
              <IconButton
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="glass-pill"
                sx={{ width: 40, height: 40 }}
              >
                <FiChevronRight className="w-6 h-6" />
              </IconButton>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {daysToShow.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }

                const hours = getStudyHoursForDate(day)
                const hasData = hours > 0
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isToday = isSameDay(day, new Date())

                return (
                  <button
                    key={day.toString()}
                    onClick={() => handleDateClick(day)}
                  className={`aspect-square p-2 rounded-lg border-2 transition relative ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : isToday
                      ? 'border-blue-400'
                      : 'border-slate-200 hover:border-slate-300'
                  } ${!isSameMonth(day, currentMonth) ? 'opacity-40' : ''}`}
                >
                  <div className="text-sm font-medium text-slate-900">
                    {format(day, 'd')}
                  </div>
                    {hasData && (
                      <div
                        className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
                          hours >= 4 ? 'bg-green-500' : hours >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>4+ hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>2-4 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>&lt;2 hours</span>
              </div>
            </div>

            {plans.length === 0 && !loading && (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-600">
                No study plans yet. Complete onboarding to generate daily plans.
              </div>
            )}
            </CardContent>
          </Card>

          {/* Selected Day Details */}
          <Card className="glass-card rounded-2xl">
            <CardContent className="p-6">
              <Typography variant="h6" className="text-slate-900 font-bold mb-4">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </Typography>

            {selectedPlan ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Hours</span>
                  <span className="text-lg font-bold text-blue-600">
                    {selectedPlan.totalHours}h
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Tasks</h4>
                  <div className="space-y-2">
                    {(selectedPlan.tasks as any[]).map((task: any, index: number) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          task.completed ? 'bg-green-50 border border-green-200' : 'bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{task.subject}</div>
                            <div className="text-sm text-slate-600">{task.topic}</div>
                          </div>
                          <div className="text-sm font-medium text-slate-500">
                            {task.duration}h
                          </div>
                        </div>
                        {task.completed && (
                          <div className="mt-1 text-xs text-green-600 font-medium">✓ Completed</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : selectedDate ? (
              <p className="text-slate-500 text-center py-8">No study plan for this day</p>
            ) : (
              <p className="text-slate-500 text-center py-8">Click a date to view details</p>
            )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
