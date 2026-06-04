import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/features/core/services/upload";

/**
 * Controller Route for file uploading.
 * Delegates the file writing logic to the feature/service layer.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
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
