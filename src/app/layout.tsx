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

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await import("next/headers").then(m => m.headers());
  const currentPath = headersList.get("x-current-path") || "/";

  return {
    metadataBase: new URL(baseUrl),
    title: "StopShop — Premium Bronze & Bartan Export",
    description:
      "India's finest bronze cookware & bartan, exported globally. Premium quality, trusted by international buyers.",
    keywords: "bronze cookware, bartan, export, premium kitchenware, handmade, copper, brass, StopShop",
    authors: [{ name: "StopShop" }],
    publisher: "StopShop",
    robots: "index, follow",
    alternates: {
      canonical: `${baseUrl}${currentPath}`,
    },
    openGraph: {
      title: "StopShop — Premium Bronze & Bartan Export",
      description: "India's finest bronze cookware & bartan, exported globally. Premium quality, trusted by international buyers.",
      url: `${baseUrl}${currentPath}`,
      siteName: "StopShop",
      locale: "en_US",
      type: "website",
    },
  };
}

import { MainLayout } from "@/features/core/components/MainLayout";
import { RegionProvider } from "@/context/RegionContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { headers, cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const cookieStore = cookies();
  
  const cookieRegion = cookieStore.get("stopshop_region")?.value;
  const cfCountry = headersList.get("cf-ipcountry");
  const vercelCountry = headersList.get("x-vercel-ip-country");
  
  const serverRegion = (cookieRegion || cfCountry || vercelCountry || "IN").toUpperCase();
  
  let footerData = null;
  try {
    const { prisma } = await import("@/lib/db");
    const settings = await prisma.adminSettings.findFirst();
    if (settings) {
      footerData = {
        footerAboutText: settings.footerAboutText || "",
        footerContacts: settings.footerContacts || [],
        footerSocialLinks: settings.footerSocialLinks || []
      };
    }
  } catch (e) {
    console.error("Failed to fetch footer data in layout:", e);
  }

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
          <RegionProvider initialRegion={serverRegion}>
            <CartProvider>
              <WishlistProvider>
                <SmoothScroll>
                  <Navbar />
                  <CategoryStrip />
                  <ErrorBoundary>
                    <MainLayout>{children}</MainLayout>
                  </ErrorBoundary>
                  <Footer footerData={footerData} />
                </SmoothScroll>
              </WishlistProvider>
            </CartProvider>
          </RegionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
