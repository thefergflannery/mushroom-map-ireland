import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const accountCount = await prisma.account.count();
    const sessionCount = await prisma.session.count();
    
    return NextResponse.json({
      database: {
        connected: true,
        userCount,
        accountCount,
        sessionCount,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasEmailConfig: !!(process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD),
      }
    });
  } catch (error) {
    return NextResponse.json({
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }, { status: 500 });
  }
}
