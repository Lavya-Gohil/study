import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfWeek, subDays, format } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        streaks: true,
      },
    })

    // Get last 7 days data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      date.setHours(0, 0, 0, 0)
      return date
    })

    // Daily hours
    const dailyHours = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)
        
        const sessions = await prisma.focusSession.findMany({
          where: {
            userId: session.user.id,
            startTime: {
              gte: date,
              lt: nextDay,
            },
            completed: true,
          },
        })

        const hours = sessions.reduce((sum: number, s: any) => sum + (s.duration / 60), 0)
        
        return {
          day: format(date, 'EEE'),
          hours: Math.round(hours * 10) / 10,
        }
      })
    )

    // Subject distribution
    const allSessions = await prisma.focusSession.findMany({
      where: {
        userId: session.user.id,
        completed: true,
      },
    })

    const subjectHours: { [key: string]: number } = {}
    allSessions.forEach((session: any) => {
      subjectHours[session.subject] = (subjectHours[session.subject] || 0) + session.duration / 60
    })

    const subjectDistribution = Object.entries(subjectHours).map(([name, hours]) => ({
      name,
      hours: Math.round(hours * 10) / 10,
    }))

    // Focus sessions count
    const focusSessions = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)
        
        const count = await prisma.focusSession.count({
          where: {
            userId: session.user.id,
            startTime: {
              gte: date,
              lt: nextDay,
            },
            completed: true,
          },
        })

        return {
          day: format(date, 'EEE'),
          sessions: count,
        }
      })
    )

    // Completion rate
    const completionRate = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)
        
        const plans = await prisma.studyPlan.findMany({
          where: {
            userId: session.user.id,
            date: {
              gte: date,
              lt: nextDay,
            },
          },
        })

        let totalTasks = 0
        let completedTasks = 0

        plans.forEach((plan: any) => {
          const tasks = plan.tasks as any[]
          totalTasks += tasks.length
          completedTasks += tasks.filter((t) => t.completed).length
        })

        return {
          day: format(date, 'EEE'),
          rate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        }
      })
    )

    // Total stats
    const totalHours = dailyHours.reduce((sum, d) => sum + d.hours, 0)
    const allPlans = await prisma.studyPlan.findMany({
      where: { userId: session.user.id },
    })
    
    let totalCompletedTasks = 0
    allPlans.forEach((plan: any) => {
      const tasks = plan.tasks as any[]
      totalCompletedTasks += tasks.filter((t: any) => t.completed).length
    })

    return NextResponse.json({
      totalHours: Math.round(totalHours * 10) / 10,
      completedTasks: totalCompletedTasks,
      currentStreak: user?.streaks[0]?.currentStreak || 0,
      level: user?.level || 1,
      dailyHours,
      subjectDistribution,
      focusSessions,
      completionRate,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
