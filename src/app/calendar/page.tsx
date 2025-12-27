'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-blue-600">Study Calendar</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
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
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!isSameMonth(day, currentMonth) ? 'opacity-40' : ''}`}
                  >
                    <div className="text-sm font-medium text-gray-900">
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
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
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
          </div>

          {/* Selected Day Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>

            {selectedPlan ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Hours</span>
                  <span className="text-lg font-bold text-blue-600">
                    {selectedPlan.totalHours}h
                  </span>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Tasks</h4>
                  <div className="space-y-2">
                    {(selectedPlan.tasks as any[]).map((task: any, index: number) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          task.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{task.subject}</div>
                            <div className="text-sm text-gray-600">{task.topic}</div>
                          </div>
                          <div className="text-sm font-medium text-gray-500">
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
              <p className="text-gray-500 text-center py-8">No study plan for this day</p>
            ) : (
              <p className="text-gray-500 text-center py-8">Click a date to view details</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
