import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Service to handle uploading a file from the client to the local filesystem (public/uploads/).
 * Keeps route handlers clean by encapsulating business logic in the feature layer.
 */
export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save path inside the public/uploads directory
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  
  // Ensure directory exists
  await mkdir(uploadDir, { recursive: true });

  // Generate unique name
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
  const filePath = path.join(uploadDir, filename);

  // Write file
  await writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}
