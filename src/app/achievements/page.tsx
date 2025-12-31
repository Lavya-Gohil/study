'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiAward, FiTrendingUp, FiStar, FiTarget } from 'react-icons/fi'
import { IconButton } from '@mui/material'

export default function AchievementsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [achievements, setAchievements] = useState<any[]>([])
  const [userAchievements, setUserAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalXP: 0, totalCoins: 0, level: 1, unlockedCount: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchAchievements()
    }
  }, [status, router])

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements')
      if (res.ok) {
        const data = await res.json()
        setAchievements(data.achievements)
        setUserAchievements(data.userAchievements)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Fetch achievements error:', error)
    } finally {
      setLoading(false)
    }
  }

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some((ua) => ua.achievementId === achievementId)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'STUDY':
        return 'bg-blue-100 text-blue-600'
      case 'STREAK':
        return 'bg-orange-100 text-orange-600'
      case 'FOCUS':
        return 'bg-purple-100 text-purple-600'
      case 'MILESTONE':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'STUDY':
        return FiTarget
      case 'STREAK':
        return FiTrendingUp
      case 'FOCUS':
        return FiStar
      case 'MILESTONE':
        return FiAward
      default:
        return FiAward
    }
  }

  if (status === 'loading' || loading) {
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
            <h1 className="text-2xl font-bold text-slate-900">Achievements</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Level', value: stats.level, accent: 'from-blue-500 to-blue-600' },
            { label: 'Total XP', value: stats.totalXP, accent: 'from-purple-500 to-purple-600' },
            { label: 'Coins', value: stats.totalCoins, accent: 'from-amber-500 to-amber-600' },
            { label: 'Unlocked', value: `${stats.unlockedCount}/${achievements.length}`, accent: 'from-emerald-500 to-emerald-600' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${stat.accent}`}>
              <div className="text-sm opacity-90 mb-1">{stat.label}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id)
            const CategoryIcon = getCategoryIcon(achievement.category)

            return (
              <div
                key={achievement.id}
                className={`glass-card rounded-2xl p-6 transition ${
                  unlocked ? 'border-2 border-green-400' : 'opacity-70'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      unlocked ? getCategoryColor(achievement.category) : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <CategoryIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-900">{achievement.name}</h3>
                      {unlocked && (
                        <div className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                          ✓ Unlocked
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{achievement.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-purple-600">
                        <FiStar className="w-4 h-4" />
                        <span className="font-medium">+{achievement.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <span className="font-bold">🪙</span>
                        <span className="font-medium">+{achievement.coinReward}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No achievements available yet.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="glass-button glass-button-primary rounded-full px-6 py-2"
            >
              Start a session
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
