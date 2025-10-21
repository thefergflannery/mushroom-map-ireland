import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Test if we can access the auth configuration
    const providers = authOptions.providers;
    
    return NextResponse.json({
      success: true,
      providers: providers.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
      })),
      hasSecret: !!authOptions.secret,
      sessionStrategy: authOptions.session?.strategy,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

