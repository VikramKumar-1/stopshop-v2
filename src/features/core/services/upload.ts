import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

// Configure Cloudinary
// Ensure you have CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Service to handle uploading a file from the client.
 * Uses process.env.STORAGE_PROVIDER to determine where to store the file.
 * Defaults to 'cloudinary' if not set. Supports 'local' for Hostinger/VPS deployment.
 */
export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const provider = process.env.STORAGE_PROVIDER || 'cloudinary';

  if (provider === 'local') {
    // 1. Create the public/uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // 2. Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, ''); // sanitize
    const fileName = `${uniqueSuffix}-${originalName}`;
    const filePath = path.join(uploadDir, fileName);

    // 3. Write file to disk
    await fs.writeFile(filePath, buffer);

    // 4. Return the public URL
    return `/uploads/${fileName}`;
  }

  // Fallback to Cloudinary (Default)
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'stopshops_products' },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new Error(`Failed to upload image to Cloudinary: ${error.message}`));
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Unknown error during upload"));
        }
      }
    );

    // Write the buffer to the stream and end it
    uploadStream.end(buffer);
  });
}
