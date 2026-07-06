import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/features/core/components/Navbar";
import { CategoryStrip } from "@/features/core/components/CategoryStrip";
import { Footer } from "@/features/core/components/Footer";
import { ThemeProvider } from "@/features/core/components/ThemeProvider";
import { CartProvider } from "@/context/CartContext";
import { SmoothScroll } from "@/features/core/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "StopShop — Premium Bronze & Bartan Export",
  description:
    "India's finest bronze cookware & bartan, exported globally. Premium quality, trusted by international buyers.",
  keywords: "bronze cookware, bartan, export, premium kitchenware, handmade, copper, brass, StopShop",
  authors: [{ name: "StopShop" }],
  publisher: "StopShop",
  robots: "index, follow",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "StopShop — Premium Bronze & Bartan Export",
    description: "India's finest bronze cookware & bartan, exported globally. Premium quality, trusted by international buyers.",
    url: baseUrl,
    siteName: "StopShop",
    locale: "en_US",
    type: "website",
  },
};

import { MainLayout } from "@/features/core/components/MainLayout";
import { RegionProvider } from "@/context/RegionContext";
import { WishlistProvider } from "@/context/WishlistContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Disable browser scroll restoration BEFORE render to prevent hero flash on reload */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
              } catch (_) {}
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('stopshops-theme');
                if (saved === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans bg-surface text-body antialiased flex flex-col min-h-screen`}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <ThemeProvider>
          <RegionProvider>
            <CartProvider>
              <WishlistProvider>
                <SmoothScroll>
                  <Navbar />
                  <CategoryStrip />
                  <MainLayout>{children}</MainLayout>
                  <Footer />
                </SmoothScroll>
              </WishlistProvider>
            </CartProvider>
          </RegionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
