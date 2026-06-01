"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Breadcrumbs } from "./Breadcrumbs";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/vendor") || pathname.startsWith("/admin");
  const isNoStripPage = pathname.startsWith("/product") || pathname === "/contact" || pathname.startsWith("/profile") || pathname === "/cart";

  let ptClass = "pt-[146px] sm:pt-[172px] lg:pt-0";
  if (isDashboard) {
    ptClass = "pt-14 lg:pt-20";
  } else if (isNoStripPage) {
    ptClass = "pt-[88px] lg:pt-[112px]";
  }

  return (
    <main className={`overflow-x-clip w-full flex-1 min-h-[75vh] ${ptClass}`} style={{ flex: 1 }}>
      <Breadcrumbs />
      {children}
    </main>
  );
};
