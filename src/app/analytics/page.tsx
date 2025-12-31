'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FiArrowLeft, FiTrendingUp, FiClock, FiTarget, FiAward } from 'react-icons/fi'
import { Card, CardContent, IconButton, Typography } from '@mui/material'

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444']

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchAnalytics()
    }
  }, [status, router])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics')
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading analytics...</div>
      </div>
    )
  }

  const stats = [
    { icon: FiClock, label: 'Total Study Hours', value: analytics?.totalHours || 0, badge: 'bg-blue-100 text-blue-700' },
    { icon: FiTarget, label: 'Tasks Completed', value: analytics?.completedTasks || 0, badge: 'bg-emerald-100 text-emerald-700' },
    { icon: FiTrendingUp, label: 'Current Streak', value: analytics?.currentStreak || 0, badge: 'bg-purple-100 text-purple-700' },
    { icon: FiAward, label: 'Level', value: analytics?.level || 1, badge: 'bg-amber-100 text-amber-700' },
  ]
  const hasActivity =
    (analytics?.totalHours || 0) > 0 ||
    (analytics?.completedTasks || 0) > 0 ||
    (analytics?.focusSessions || []).length > 0

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
              Analytics Dashboard
            </Typography>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card rounded-2xl">
              <CardContent className="flex items-center justify-between">
                <div>
                  <Typography variant="body2" className="text-slate-600 mb-1">
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" className="text-slate-900 font-bold">
                    {stat.value}
                  </Typography>
                </div>
                <div className={`p-3 rounded-xl ${stat.badge}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!hasActivity && (
          <div className="glass-card rounded-2xl p-8 text-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No activity yet</h3>
            <p className="text-slate-600 mb-6">
              Start a focus session to see your analytics here.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="glass-button glass-button-primary rounded-full px-6 py-2"
            >
              Start Session
            </button>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Study Hours Chart */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Study Hours (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.dailyHours || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Distribution */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Subject Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.subjectDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="hours"
                >
                  {(analytics?.subjectDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Focus Sessions */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Focus Sessions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.focusSessions || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sessions" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Rate */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Task Completion Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.completionRate || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  )
}
