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
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all study plans for the user
    const studyPlans = await prisma.studyPlan.findMany({
      where: { userId: user.id },
      orderBy: { date: 'asc' },
    })

    // Format the plans with calculated total hours
    const plans = studyPlans.map((plan: any) => {
      const tasks = plan.tasks as any[]
      const totalHours = tasks.reduce((sum, task) => sum + (task.duration || 0), 0)
      return {
        date: plan.date,
        tasks: tasks,
        totalHours,
      }
    })

    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Calendar API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
