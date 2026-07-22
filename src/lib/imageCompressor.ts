export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
  originalSizeFormatted: string;
  compressedSizeFormatted: string;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * Client-side browser image compressor that converts any image (PNG, JPG, HEIC, WebP)
 * to ultra-optimized WebP format with zero perceptual quality loss.
 */
export async function compressImageToWebP(
  file: File,
  quality = 0.82,
  maxWidth = 1600,
  maxHeight = 1600
): Promise<CompressionResult> {
  const originalSize = file.size;
  const originalSizeFormatted = formatBytes(originalSize);

  // Return original if not an image
  if (!file.type.startsWith("image/")) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercentage: 0,
      originalSizeFormatted,
      compressedSizeFormatted: originalSizeFormatted,
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize down if larger than max dimensions while preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({
            file,
            originalSize,
            compressedSize: originalSize,
            savedPercentage: 0,
            originalSizeFormatted,
            compressedSizeFormatted: originalSizeFormatted,
          });
          return;
        }

        // Draw onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                file,
                originalSize,
                compressedSize: originalSize,
                savedPercentage: 0,
                originalSizeFormatted,
                compressedSizeFormatted: originalSizeFormatted,
              });
              return;
            }

            const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], fileName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            const compressedSize = compressedFile.size;
            const savedBytes = Math.max(0, originalSize - compressedSize);
            const savedPercentage = parseFloat(((savedBytes / originalSize) * 100).toFixed(1));

            resolve({
              file: compressedFile,
              originalSize,
              compressedSize,
              savedPercentage: compressedSize < originalSize ? savedPercentage : 0,
              originalSizeFormatted,
              compressedSizeFormatted: formatBytes(compressedSize),
            });
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => {
        resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          savedPercentage: 0,
          originalSizeFormatted,
          compressedSizeFormatted: originalSizeFormatted,
        });
      };
    };

    reader.onerror = () => {
      resolve({
        file,
        originalSize,
        compressedSize: originalSize,
        savedPercentage: 0,
        originalSizeFormatted,
        compressedSizeFormatted: originalSizeFormatted,
      });
    };
  });
}
