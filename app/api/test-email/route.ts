import { NextResponse } from 'next/server';

export async function GET() {
  const emailConfig = {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD ? '***configured***' : 'missing',
    from: process.env.EMAIL_FROM,
  };

  return NextResponse.json({
    emailConfigured: !!(emailConfig.host && emailConfig.user && emailConfig.pass),
    config: emailConfig,
  });
}
