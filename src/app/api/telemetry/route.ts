import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, message, details, level } = body;

    // Validate
    if (!category || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Save Telemetry Log
    await prisma.systemLog.create({
      data: {
        category,
        message,
        level: level || "ERROR",
        details: details || {}
      }
    });
    
    // AUTO-BAN LOGIC
    if (category === 'MALICIOUS_PAYLOAD' && details?.ip) {
      // Upsert to avoid unique constraint errors if they attack multiple times
      await prisma.iPBlacklist.upsert({
        where: { ip: details.ip },
        update: {},
        create: {
          ip: details.ip,
          reason: 'WAF: Malicious Payload Injection'
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telemetry Error:", error);
    // Silent fail so we don't cause infinite loops of errors
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
