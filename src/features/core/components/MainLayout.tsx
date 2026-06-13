"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Breadcrumbs } from "./Breadcrumbs";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/vendor") || pathname.startsWith("/admin");
  const isNoStripPage = pathname.startsWith("/product") || pathname === "/contact" || pathname.startsWith("/profile") || pathname === "/cart" || pathname === "/checkout";

  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  // When pathname changes (navigation completes), finish the loading bar
  useEffect(() => {
    if (active) {
      setProgress(100);
      const timer = setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Intercept standard internal links clicks to start the top loading bar
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");

        if (
          href &&
          href.startsWith("/") &&
          !href.startsWith("//") &&
          targetAttr !== "_blank" &&
          e.button === 0 && // Left-click only
          !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey // No modifier keys
        ) {
          if (href !== window.location.pathname) {
            setActive(true);
            setProgress(15);

            // Animate progress up gradually to 90%
            const interval = setInterval(() => {
              setProgress((prev) => {
                if (prev >= 90) {
                  clearInterval(interval);
                  return 90;
                }
                return prev + Math.floor(Math.random() * 10) + 5;
              });
            }, 80);

            const timeout = setTimeout(() => {
              clearInterval(interval);
            }, 8000);

            (window as any)._loadingTimer = { interval, timeout };
          }
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => {
      document.removeEventListener("click", handleLinkClick);
      if ((window as any)._loadingTimer) {
        clearInterval((window as any)._loadingTimer.interval);
        clearTimeout((window as any)._loadingTimer.timeout);
      }
    };
  }, [active]);

  let ptClass = "pt-[95px] lg:pt-0";
  if (isDashboard) {
    ptClass = "pt-14 lg:pt-20";
  } else if (isNoStripPage) {
    ptClass = "pt-[95px] lg:pt-0";
  }

  return (
    <>
      {/* Global Top Progress Loading Bar */}
      {active && (
        <div 
          className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 z-[99999] transition-all duration-300 ease-out"
          style={{ 
            width: `${progress}%`, 
            boxShadow: "0 0 10px rgba(249, 115, 22, 0.7), 0 0 5px rgba(249, 115, 22, 0.4)" 
          }}
        />
      )}
      
      <main className={`overflow-x-clip w-full flex-1 min-h-[75vh] ${ptClass}`} style={{ flex: 1 }}>
        <Breadcrumbs />
        {children}
      </main>
    </>
  );
};

