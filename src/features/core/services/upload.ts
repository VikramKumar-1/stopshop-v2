import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// Ensure you have CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Service to handle uploading a file from the client to Cloudinary.
 * Keeps route handlers clean by encapsulating business logic in the feature layer.
 */
export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

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
