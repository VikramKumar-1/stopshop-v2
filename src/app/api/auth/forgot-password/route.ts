import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendMail } from '@/lib/mailer';
import { forgotPasswordLimiter, getClientIp } from '@/lib/rateLimit';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateCheck = forgotPasswordLimiter.check(ip);
    
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return NextResponse.json({ message: 'If that email is registered, we have sent a password reset OTP.' });
    }

    const otp = generateOTP();
    // Expiry 10 mins from now
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetOtp: otp,
        resetOtpExpiry: expiry,
      },
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You recently requested to reset your password. Use the following 6-digit OTP to proceed:</p>
        <h3 style="background-color: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 2px;">${otp}</h3>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <br />
        <p>Thanks,</p>
        <p>StopShop Team</p>
      </div>
    `;

    await sendMail(email, 'StopShop - Password Reset OTP', emailHtml);

    return NextResponse.json({ message: 'If that email is registered, we have sent a password reset OTP.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
