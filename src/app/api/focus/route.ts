import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, duration, type } = await req.json()

    const focusSession = await prisma.focusSession.create({
      data: {
        userId: session.user.id,
        subject,
        duration,
        type,
        startTime: new Date(),
      },
    })

    return NextResponse.json({ session: focusSession })
  } catch (error) {
    console.error('Focus session error:', error)
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

    const { sessionId } = await req.json()

    const focusSession = await prisma.focusSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        endTime: new Date(),
      },
    })

    return NextResponse.json({ session: focusSession })
  } catch (error) {
    console.error('Complete session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
