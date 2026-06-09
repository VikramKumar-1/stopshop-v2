import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const gitStatus = execSync('git status').toString();
    const gitLog = execSync('git log -n 5 --oneline').toString();
    return NextResponse.json({ success: true, status: gitStatus, log: gitLog });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack });
  }
}
