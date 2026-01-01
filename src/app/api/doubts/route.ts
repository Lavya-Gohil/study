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

    // All users have unlimited doubts access
    const { question, subject } = await req.json()

    // Generate a simple educational response
    const answer = `Thank you for your question about ${subject}. For detailed help with "${question}", please:
1. Review your textbook chapter on this topic
2. Check the practice questions in your study materials
3. Discuss with your study group or teacher
4. Try breaking down the problem into smaller steps

Tip: Practice similar problems to strengthen your understanding!`

    const doubt = await prisma.doubt.create({
      data: {
        userId: session.user.id,
        question,
        answer: answer || '',
        subject,
        resolved: true,
      },
    })

    return NextResponse.json({ doubt })
  } catch (error) {
    console.error('Doubt solver error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doubts = await prisma.doubt.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({ doubts })
  } catch (error) {
    console.error('Get doubts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
