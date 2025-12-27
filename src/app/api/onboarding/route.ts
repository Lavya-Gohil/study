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
        subjects: true,
        examType: true,
        dailyHours: true,
        examDate: true,
        onboardingComplete: true,
      },
    })

    return NextResponse.json({
      subjects: user?.subjects || [],
      examType: user?.examType,
      dailyHours: user?.dailyHours,
      examDate: user?.examDate,
      onboardingComplete: user?.onboardingComplete || false,
    })
  } catch (error) {
    console.error('Get onboarding error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { examType, subjects, dailyHours, examDate } = await req.json()

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        examType,
        subjects,
        dailyHours: parseInt(dailyHours),
        examDate: new Date(examDate),
        onboardingComplete: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
