import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

function getSecret() {
  const secret = process.env.JWT_SECRET || "";
  return new TextEncoder().encode(secret);
}

export async function POST(req: Request) {
  try {
    const token = cookies().get('stopshop_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { ip } = await req.json();
    if (!ip) return NextResponse.json({ error: 'IP is required' }, { status: 400 });

    await prisma.iPBlacklist.delete({
      where: { ip }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unban API Error:", error);
    return NextResponse.json({ error: 'Failed to unban IP' }, { status: 500 });
  }
}
