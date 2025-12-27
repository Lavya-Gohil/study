import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        xp: true, 
        level: true, 
        coins: true,
        achievements: {
          select: {
            achievementId: true,
            unlockedAt: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all achievements
    const achievements = await prisma.achievement.findMany({
      orderBy: { category: 'asc' },
    })

    // Create some default achievements if none exist
    if (achievements.length === 0) {
      const defaultAchievements = [
        {
          name: 'First Steps',
          description: 'Complete your first study session',
          icon: 'FiTarget',
          category: 'STUDY',
          requirement: 1,
          xpReward: 10,
          coinReward: 5,
        },
        {
          name: 'Study Streak',
          description: 'Maintain a 7-day study streak',
          icon: 'FiTrendingUp',
          category: 'STREAK',
          requirement: 7,
          xpReward: 50,
          coinReward: 25,
        },
        {
          name: 'Focus Master',
          description: 'Complete 10 focus sessions',
          icon: 'FiStar',
          category: 'FOCUS',
          requirement: 10,
          xpReward: 30,
          coinReward: 15,
        },
        {
          name: 'Century Club',
          description: 'Complete 100 tasks',
          icon: 'FiAward',
          category: 'MILESTONE',
          requirement: 100,
          xpReward: 100,
          coinReward: 50,
        },
        {
          name: 'Early Bird',
          description: 'Complete a study session before 8 AM',
          icon: 'FiTarget',
          category: 'STUDY',
          requirement: 1,
          xpReward: 20,
          coinReward: 10,
        },
        {
          name: 'Marathon Runner',
          description: 'Study for 5 hours in a single day',
          icon: 'FiTarget',
          category: 'STUDY',
          requirement: 5,
          xpReward: 40,
          coinReward: 20,
        },
        {
          name: 'Perfect Week',
          description: 'Complete all tasks for 7 days straight',
          icon: 'FiTrendingUp',
          category: 'STREAK',
          requirement: 7,
          xpReward: 75,
          coinReward: 35,
        },
        {
          name: 'Deep Focus',
          description: 'Complete a 2-hour focus session without breaks',
          icon: 'FiStar',
          category: 'FOCUS',
          requirement: 120,
          xpReward: 60,
          coinReward: 30,
        },
      ]

      await prisma.achievement.createMany({
        data: defaultAchievements,
      })

      // Fetch the newly created achievements
      const newAchievements = await prisma.achievement.findMany({
        orderBy: { category: 'asc' },
      })

      return NextResponse.json({
        achievements: newAchievements,
        userAchievements: user.achievements,
        stats: {
          totalXP: user.xp || 0,
          totalCoins: user.coins || 0,
          level: user.level || 1,
          unlockedCount: user.achievements.length,
        },
      })
    }

    return NextResponse.json({
      achievements,
      userAchievements: user.achievements,
      stats: {
        totalXP: user.xp || 0,
        totalCoins: user.coins || 0,
        level: user.level || 1,
        unlockedCount: user.achievements.length,
      },
    })
  } catch (error) {
    console.error('Achievements API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
