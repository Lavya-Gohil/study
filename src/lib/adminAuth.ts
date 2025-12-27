import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function adminAuthMiddleware(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.email !== 'gohil.lavya@gmail.com') {
    return NextResponse.json(
      { error: 'Unauthorized: Admin access only' },
      { status: 403 }
    );
  }
  
  return null;
}
