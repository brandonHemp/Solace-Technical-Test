import { NextResponse } from 'next/server';

export async function GET() {
  const currentTime = new Date().toISOString();
  
  return NextResponse.json({
    status: 'healthy',
    timestamp: currentTime,
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: !!process.env.DATABASE_URL,
      url: process.env.DATABASE_URL ? 'configured' : 'not configured'
    }
  });
} 