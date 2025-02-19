import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET() {
  try {
    await prisma.$connect();
    
    return NextResponse.json({
      success: true,
      database: {
        url: process.env.DATABASE_URL?.slice(0, 35) + '...',
        connected: true
      },
      supabase: {
        configured: !!process.env.SUPABASE_URL
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Ukjent feil'
    }, { status: 500 });
  }
}
