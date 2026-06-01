import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/features/core/components/Navbar";
import { CategoryStrip } from "@/features/core/components/CategoryStrip";
import { Footer } from "@/features/core/components/Footer";
import { ThemeProvider } from "@/features/core/components/ThemeProvider";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "StopShop — Premium Bronze & Bartan Export",
  description:
    "India's finest bronze cookware & bartan, exported globally. Premium quality, trusted by international buyers.",
};

import { MainLayout } from "@/features/core/components/MainLayout";
import { RegionProvider } from "@/context/RegionContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
              <div className="fixed top-0 left-0 right-0 z-40 w-full lg:contents">
                <Navbar />
                <CategoryStrip />
              </div>
              <MainLayout>{children}</MainLayout>
              <Footer />
            </CartProvider>
          </RegionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
