import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  // Check admin authentication
  const authError = await adminAuthMiddleware(request);
  if (authError) return authError;

  try {
    const total = await prisma.question.count();

    const byExamType = await prisma.question.groupBy({
      by: ['examType'],
      _count: true,
    });

    const bySubject = await prisma.question.groupBy({
      by: ['subject'],
      _count: true,
    });

    const byDifficulty = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: true,
    });

    // Calculate specific exam counts
    const jeeMain = byExamType.find((e: any) => e.examType === 'JEE_Main')?._count || 0;
    const jeeAdvanced = byExamType.find((e: any) => e.examType === 'JEE_Advanced')?._count || 0;
    const neet = byExamType.find((e: any) => e.examType === 'NEET')?._count || 0;
    const cbse10 = byExamType.find((e: any) => e.examType === 'CBSE_10')?._count || 0;
    const cbse12 = byExamType.find((e: any) => e.examType === 'CBSE_12')?._count || 0;

    return NextResponse.json({
      total,
      jeeMain,
      jeeAdvanced,
      neet,
      cbse: cbse10 + cbse12,
      byExamType,
      bySubject,
      byDifficulty,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
