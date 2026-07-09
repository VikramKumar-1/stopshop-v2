import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Cache this endpoint for 60 seconds so middleware doesn't hammer the DB
export const revalidate = 60;

export async function GET() {
  try {
    const banned = await prisma.iPBlacklist.findMany({
      select: { ip: true }
    });
    
    // Return array of banned IP strings
    const ipList = banned.map(b => b.ip);
    
    return NextResponse.json(ipList);
  } catch (error) {
    // If DB fails, return empty array so WAF doesn't block normal users
    return NextResponse.json([]);
  }
}
