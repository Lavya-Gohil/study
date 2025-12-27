import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const streak = await prisma.streak.findUnique({
      where: { userId: session.user.id },
    })

    if (!streak) {
      // Create streak if doesn't exist
      const newStreak = await prisma.streak.create({
        data: { userId: session.user.id },
      })
      return NextResponse.json({ 
        streak: newStreak.currentStreak,
        streakData: newStreak 
      })
    }

    return NextResponse.json({ 
      streak: streak.currentStreak,
      streakData: streak 
    })
  } catch (error) {
    console.error('Streak error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
