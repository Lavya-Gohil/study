import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Simple task templates for each subject
const generateSimpleTasks = (subjects: string[], dailyHours: number, maxTasks: number) => {
  const topics = [
    'Review previous concepts',
    'Practice numerical problems',
    'Theory revision',
    'Solve practice questions',
    'Mock test preparation',
    'Formula revision',
  ]

  const tasks = []
  const hoursPerSubject = Math.floor(dailyHours / Math.min(subjects.length, 3))

  for (let i = 0; i < Math.min(maxTasks, subjects.length * 2); i++) {
    const subject = subjects[i % subjects.length]
    const topic = topics[i % topics.length]
    
    tasks.push({
      subject,
      topic,
      duration: hoursPerSubject || 1,
      completed: false,
    })
  }

  return tasks.slice(0, maxTasks)
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    const isFreeUser = !user?.subscriptionStatus || user.subscriptionStatus === 'free'

    if (!user?.onboardingComplete) {
      return NextResponse.json(
        { error: 'Please complete onboarding first' },
        { status: 400 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingPlan = await prisma.studyPlan.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: today,
        },
      },
    })

    if (existingPlan) {
      return NextResponse.json({ plan: existingPlan })
    }

    // Generate new plan with simple tasks
    const maxTasks = isFreeUser ? 3 : 10
    const tasks = generateSimpleTasks(
      user.subjects.slice(0, isFreeUser ? 3 : user.subjects.length),
      user.dailyHours!,
      maxTasks
    )

    const plan = await prisma.studyPlan.create({
      data: {
        userId: session.user.id,
        date: today,
        tasks,
        totalHours: user.dailyHours!,
      },
    })

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Study plan error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, taskIndex, completed } = await req.json()

    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId },
    })

    if (!plan || plan.userId !== session.user.id) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const tasks = plan.tasks as any[]
    tasks[taskIndex].completed = completed

    const allCompleted = tasks.every((t) => t.completed)

    const updatedPlan = await prisma.studyPlan.update({
      where: { id: planId },
      data: {
        tasks,
        completed: allCompleted,
      },
    })

    // Update streak if plan completed
    if (allCompleted) {
      const streak = await prisma.streak.findUnique({
        where: { userId: session.user.id },
      })

      if (streak) {
        const today = new Date()
        const lastStudy = streak.lastStudyDate
        let newStreak = streak.currentStreak

        if (lastStudy) {
          const diffDays = Math.floor(
            (today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24)
          )
          
          if (diffDays === 1) {
            newStreak += 1
          } else if (diffDays > 1) {
            newStreak = 1
          }
        } else {
          newStreak = 1
        }

        await prisma.streak.update({
          where: { userId: session.user.id },
          data: {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, streak.longestStreak),
            lastStudyDate: today,
            totalDays: streak.totalDays + 1,
          },
        })
      }
    }

    return NextResponse.json({ plan: updatedPlan })
  } catch (error) {
    console.error('Update plan error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
