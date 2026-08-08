import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/features/core/services/upload";
import { requireAuth } from "@/lib/auth";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";

// Rate limit: 20 uploads per 5 minutes per IP
const uploadLimiter = createRateLimiter({ windowMs: 5 * 60 * 1000, max: 20 });

// Allowed image MIME types
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/jpg",
]);

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Controller Route for file uploading.
 * SECURED: Requires authentication, restricts file types to images only, enforces 5MB limit.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check — must be logged in
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    // 2. Rate limiting
    const ip = getClientIp(req);
    const rateLimitResult = uploadLimiter.check(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many uploads. Please wait and try again." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 3. File type check — images only
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed." },
        { status: 400 }
      );
    }

    // 4. File size check — max 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Call feature layer service logic
    const url = await uploadFile(file);

    return NextResponse.json({ 
      success: true, 
      url 
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to upload file" 
    }, { status: 500 });
  }
}
