"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Breadcrumbs } from "./Breadcrumbs";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboard = (pathname.startsWith("/vendor") && !pathname.startsWith("/vendor-shop")) || pathname.startsWith("/admin");
  const isNoStripPage = pathname.startsWith("/product") || pathname === "/contact" || pathname.startsWith("/profile") || pathname === "/cart" || pathname === "/checkout" || pathname.startsWith("/store") || pathname.startsWith("/vendor-shop");

  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const prevPathRef = useRef(pathname);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<{ interval: NodeJS.Timer; timeout: NodeJS.Timer } | null>(null);

  // Cleanup helper
  const finishLoading = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current.interval as any);
      clearTimeout(timerRef.current.timeout as any);
      timerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
    setProgress(100);
    setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 300);
  };

  // When pathname changes, finish loading bar
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (active) {
        finishLoading();
      }
    }
  }, [pathname, active]);

  // Intercept standard internal links clicks to start the top loading bar
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // If the click was on a button (like Add to Cart), skip loading bar
      if (target.closest("button")) return;
      
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");

        if (
          href &&
          href.startsWith("/") &&
          !href.startsWith("//") &&
          targetAttr !== "_blank" &&
          e.button === 0 &&
          !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
        ) {
          if (href !== window.location.pathname) {
            setActive(true);
            setProgress(15);

            // Clear any previous timers
            if (timerRef.current) {
              clearInterval(timerRef.current.interval as any);
              clearTimeout(timerRef.current.timeout as any);
            }

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

            timerRef.current = { interval, timeout };

            // Safety net: if bar is still active after 5 seconds, force finish
            if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
            safetyTimerRef.current = setTimeout(() => {
              finishLoading();
            }, 5000);
          }
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  let ptClass = "pt-[95px] lg:pt-[105px]";
  if (pathname.startsWith("/worker")) {
    ptClass = "pt-0";
  } else if (isDashboard) {
    ptClass = "pt-14 lg:pt-0";
  } else if (isNoStripPage) {
    ptClass = "pt-[95px] lg:pt-[65px]";
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
      
      <main className={`overflow-x-clip w-full flex-1 min-h-[85vh] ${ptClass}`} style={{ flex: 1, minHeight: "85vh" }}>
        <Breadcrumbs />
        {children}
      </main>
    </>
  );
};

