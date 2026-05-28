import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/features/core/components/Navbar";
import { CategoryStrip } from "@/features/core/components/CategoryStrip";
import { Footer } from "@/features/core/components/Footer";
import { ThemeProvider } from "@/features/core/components/ThemeProvider";

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
        className={`${inter.variable} ${outfit.variable} font-sans bg-surface text-body antialiased`}
      >
        <ThemeProvider>
          <div className="fixed top-0 left-0 right-0 z-40 w-full lg:contents">
            <Navbar />
            <CategoryStrip />
          </div>
          <main className="overflow-x-hidden w-full pt-[146px] sm:pt-[172px] lg:pt-0">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
