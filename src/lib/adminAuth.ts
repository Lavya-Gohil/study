import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function adminAuthMiddleware(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // Allow any logged-in user for now (TEMPORARY - remove in production)
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: Please sign in' },
      { status: 401 }
    );
  }
  
  // Check if admin email (keep this for future)
  const adminEmails = ['gohil.lavya@gmail.com'];
  const isAdmin = adminEmails.includes(session.user?.email || '');
  
  if (!isAdmin) {
    console.log('Non-admin access attempt from:', session.user?.email);
    // For now, allow access anyway - remove this line in production
    // return NextResponse.json(
    //   { error: 'Unauthorized: Admin access only' },
    //   { status: 403 }
    // );
  }
  
  return null;
}
