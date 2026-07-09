import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import os from 'os';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function getSecret() {
  const secret = process.env.JWT_SECRET || "";
  return new TextEncoder().encode(secret);
}

export async function GET(req: Request) {
  try {
    // 1. Authenticate Admin
    const token = cookies().get('stopshop_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Measure Database Latency
    const dbStart = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Math.round(performance.now() - dbStart);

    // 3. Fetch Admin Settings (Lockdown Mode)
    const settings = await prisma.adminSettings.findUnique({ where: { id: 1 } });
    if (!settings) throw new Error("Admin settings not found");

    // 4. Server Node.js Metrics
    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();
    const memoryUsagePercent = Math.round(((totalMemory - freeMemory) / totalMemory) * 100);
    const uptime = os.uptime(); // in seconds

    // 5. Intelligent Diagnostics & Traffic Metrics
    // Look at last 24 hours
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const recentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: yesterday } },
      select: { id: true, status: true, paymentStatus: true, shiprocketStatus: true, shiprocketOrderId: true }
    });

    const recentReturns = await prisma.returnRequest.findMany({
      where: { createdAt: { gte: yesterday } },
      select: { id: true, status: true, createdAt: true }
    });

    // 5.3 Advanced Telemetry (UI Bugs & Attacks) - Keep for 4 days
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    
    const recentLogs = await prisma.systemLog.findMany({
      where: { createdAt: { gte: fourDaysAgo }, resolved: false },
      orderBy: { createdAt: 'desc' }
    });

    // 5.1 Detect Traffic
    const activeCheckouts = recentOrders.filter(o => o.status === 'PENDING' && o.paymentStatus === 'PENDING').length;
    const completedOrders = recentOrders.filter(o => o.status !== 'PENDING' && o.paymentStatus === 'COMPLETED').length;

    // 5.2 Diagnostic Bugs
    const diagnostics = [];

    // Bug 1: Ghost Payments
    const ghostPayments = recentOrders.filter(o => o.paymentStatus === 'COMPLETED' && o.status === 'PENDING');
    if (ghostPayments.length > 0) {
      diagnostics.push({
        severity: 'CRITICAL',
        title: 'Ghost Payments Detected',
        description: `${ghostPayments.length} order(s) received payment but the status is stuck at PENDING.`,
        impact: 'Customers have paid but their orders will not be processed.',
        recommendation: 'Check Razorpay dashboard for these transactions. Manually update order status to CONFIRMED.',
      });
    }

    // Bug 2: Broken Logistics Sync
    const unsyncedOrders = recentOrders.filter(o => o.status === 'CONFIRMED' && !o.shiprocketOrderId);
    if (unsyncedOrders.length > 0) {
      diagnostics.push({
        severity: 'WARNING',
        title: 'Shiprocket Sync Failed',
        description: `${unsyncedOrders.length} order(s) are CONFIRMED but have no Shiprocket ID.`,
        impact: 'Vendors cannot ship these items because no AWB is generated.',
        recommendation: 'Click "Retry Sync" on the orders, or check Shiprocket API credentials in settings.',
      });
    }

    // Bug 3: Ignored Returns (SLA Breach)
    const SLA_HOURS = 24;
    const slaBreachDate = new Date();
    slaBreachDate.setHours(slaBreachDate.getHours() - SLA_HOURS);
    const stuckReturns = recentReturns.filter(r => r.status === 'PENDING' && new Date(r.createdAt) < slaBreachDate);
    
    if (stuckReturns.length > 0) {
      diagnostics.push({
        severity: 'INFO',
        title: 'Return SLA Breached',
        description: `${stuckReturns.length} return request(s) have been pending for over ${SLA_HOURS} hours.`,
        impact: 'Poor customer experience and potential negative reviews.',
        recommendation: 'Approve or Reject these returns immediately in the Returns tab.',
      });
    }

    const uiCrashes = recentLogs.filter(l => l.category === 'FRONTEND_CRASH');
    for (const crash of uiCrashes.slice(0, 5)) {
      diagnostics.push({
        severity: 'WARNING',
        title: 'Frontend UI Crash',
        description: `Error Message: ${crash.message}`,
        impact: 'A user experienced a broken screen or unclickable button.',
        recommendation: `Stack Trace/Details: ${JSON.stringify(crash.details).substring(0, 150)}...`,
      });
    }

    // --- AUTO-LOCKDOWN DEFENSE (DEFCON 1) ---
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCrashes = recentLogs.filter(l => l.category === 'API_CRASH' && l.createdAt >= oneMinuteAgo).length;
    if (recentCrashes > 10 && !settings.lockdownMode) {
       await prisma.adminSettings.update({
         where: { id: settings.id },
         data: { lockdownMode: true }
       });
       settings.lockdownMode = true; // Update local state for response
       
       await prisma.systemLog.create({
         data: {
           category: 'SYSTEM_LOCKDOWN',
           level: 'CRITICAL',
           message: `AUTO-LOCKDOWN INITIATED: Detected ${recentCrashes} backend crashes in 60s. System paused.`,
         }
       });
    }

    const attacks = recentLogs.filter(l => l.category === 'BRUTE_FORCE' || l.category === '404_SCAN' || l.category === 'API_CRASH' || l.category === 'MALICIOUS_PAYLOAD' || l.category === 'SYSTEM_LOCKDOWN');
    for (const attack of attacks.slice(0, 5)) {
      const isCrash = attack.category === 'API_CRASH';
      
      let fixMessage = "";
      if (attack.category === 'BRUTE_FORCE') {
         fixMessage = `Block IP ${(attack.details as any)?.ip || 'Unknown'} in your firewall/Cloudflare immediately.`;
      } else if (attack.category === '404_SCAN') {
         fixMessage = `A bot is scanning for vulnerabilities. Ignore or enable Cloudflare 'Under Attack' mode.`;
      } else if (attack.category === 'MALICIOUS_PAYLOAD') {
         fixMessage = `WAF automatically banned IP ${(attack.details as any)?.ip || 'Unknown'} for injecting an SQL/XSS Payload.`;
      } else {
         fixMessage = `Developer action required. Check backend server logs for the exact line of code failing.`;
      }

      diagnostics.push({
        id: attack.id,
        timestamp: attack.createdAt,
        severity: 'CRITICAL',
        title: isCrash ? 'Backend API 500 Crash' : (attack.category === 'SYSTEM_LOCKDOWN' ? 'DEFCON 1: AUTO-LOCKDOWN' : 'Active Security Threat'),
        description: attack.message,
        impact: isCrash ? 'A backend process failed completely (e.g., failed to save data).' : 'Potential automated attack detected.',
        recommendation: fixMessage,
      });
    }

    const pingApi = async (url: string) => {
      const start = performance.now();
      try {
        await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
      } catch (e) {}
      return Math.round(performance.now() - start);
    };

    const [razorpayMs, shiprocketMs] = await Promise.all([
      pingApi('https://api.razorpay.com/v1/'),
      pingApi('https://apiv2.shiprocket.in/v1/')
    ]);

    // --- FETCH BANNED IPs (Last 4 days) ---
    const bannedIps = await prisma.iPBlacklist.findMany({
      where: { createdAt: { gte: fourDaysAgo } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: {
        lockdownMode: settings.lockdownMode,
        server: {
          dbLatencyMs,
          memoryUsagePercent,
          uptimeSeconds: uptime,
        },
        traffic: {
          activeCheckouts,
          completedOrders,
        },
        services: {
          razorpayPingMs: razorpayMs,
          shiprocketPingMs: shiprocketMs,
        },
        diagnostics,
        bannedIps
      }
    });

  } catch (error) {
    console.error("Health API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch health data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Toggle Lockdown Mode
  try {
    const token = cookies().get('stopshop_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { lockdownMode } = await req.json();

    const updated = await prisma.adminSettings.update({
      where: { id: 1 },
      data: { lockdownMode: Boolean(lockdownMode) }
    });

    return NextResponse.json({ success: true, lockdownMode: updated.lockdownMode });
  } catch (error) {
    console.error("Health API Error:", error);
    return NextResponse.json({ error: 'Failed to toggle lockdown' }, { status: 500 });
  }
}
