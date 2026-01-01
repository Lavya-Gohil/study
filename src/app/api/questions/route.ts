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

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const subject = searchParams.get('subject')
    const examType = searchParams.get('examType')
    const difficulty = searchParams.get('difficulty')

    const where: any = {}
    if (subject) where.subject = subject
    if (examType) where.examType = examType
    if (difficulty) where.difficulty = difficulty

    const questions = await prisma.question.findMany({
      where,
      take: 50,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Questions fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
