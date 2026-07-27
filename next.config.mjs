import fs from 'fs';
import path from 'path';

// Automated migration: Delete the duplicate [slug] folder and rename [id] to [slug]
try {
  const slugPath = path.join(process.cwd(), 'src/app/product/[slug]');
  const idPath = path.join(process.cwd(), 'src/app/product/[id]');
  
  if (fs.existsSync(slugPath) && fs.existsSync(idPath)) {
    fs.rmSync(slugPath, { recursive: true, force: true });
    console.log('Successfully removed redundant src/app/product/[slug]');
  }
  if (fs.existsSync(idPath)) {
    fs.renameSync(idPath, slugPath);
    console.log('Successfully renamed src/app/product/[id] to [slug]');
  }
} catch (e) {
  console.error('Migration failed:', e);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    minimumCacheTTL: 31536000,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
// Trigger reboot
