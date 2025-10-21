import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    // Get user count
    const userCount = await prisma.user.count();
    const accountCount = await prisma.account.count();
    const sessionCount = await prisma.session.count();
    
    // Get all users with their accounts
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
        sessions: true,
      },
    });
    
    return NextResponse.json({
      session: session ? {
        user: session.user,
        expires: session.expires,
      } : null,
      database: {
        userCount,
        accountCount,
        sessionCount,
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          handle: user.handle,
          role: user.role,
          accountCount: user.accounts.length,
          sessionCount: user.sessions.length,
          accounts: user.accounts.map(acc => ({
            provider: acc.provider,
            providerAccountId: acc.providerAccountId,
          })),
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
