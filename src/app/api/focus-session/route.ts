import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
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

    const { subject, duration } = await req.json()

    const focusSession = await prisma.focusSession.create({
      data: {
        userId: user.id,
        subject,
        duration,
        type: 'deep-focus',
        startTime: new Date(),
        completed: false,
      },
    })

    return NextResponse.json({ session: focusSession })
  } catch (error) {
    console.error('Focus session POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
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

    const { subject, actualDuration } = await req.json()

    // Update the most recent session
    const latestSession = await prisma.focusSession.findFirst({
      where: {
        userId: user.id,
        subject,
      },
      orderBy: {
        startTime: 'desc',
      },
    })

    if (latestSession) {
      await prisma.focusSession.update({
        where: { id: latestSession.id },
        data: { duration: actualDuration },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Focus session PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
