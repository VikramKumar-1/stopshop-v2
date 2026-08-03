"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs = () => {
  const pathname = usePathname();

  // Hide on homepage, products list, product detail page, and dashboard paths (vendor, admin)
  if (
    !pathname ||
    pathname === "/" ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/product") ||
    pathname.startsWith("/vendor") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/worker") ||
    pathname.startsWith("/shipping-policy") ||
    pathname.startsWith("/returns") ||
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/terms-and-conditions")
  ) {
    return null;
  }

  // Split path into segments
  const segments = pathname.split("/").filter((segment) => segment !== "");

  // Generate breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    
    // Capitalize and format the display name (e.g. "kitchen-racks" -> "Kitchen Racks")
    const displayName = decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      name: displayName,
      href,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 text-[11px] sm:text-xs font-semibold text-muted"
    >
      <ol 
        itemScope 
        itemType="https://schema.org/BreadcrumbList" 
        className="flex items-center gap-1.5 flex-wrap list-none p-0 m-0"
      >
        {/* Home Item */}
        <li 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem" 
          className="flex items-center gap-1.5"
        >
          <Link
            itemProp="item"
            href="/"
            className="flex items-center gap-1 hover:text-orange-500 transition-colors"
          >
            <Home size={12} className="shrink-0" />
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            <ChevronRight size={10} className="text-muted/40 shrink-0 select-none" />
            <li 
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem" 
              className="flex items-center gap-1.5"
            >
              {item.isLast ? (
                <div className="flex items-center">
                  <span 
                    itemProp="name" 
                    className="text-heading font-bold truncate max-w-[150px] sm:max-w-[250px]"
                  >
                    {item.name}
                  </span>
                  <link itemProp="item" href={item.href} />
                </div>
              ) : (
                <Link
                  itemProp="item"
                  href={item.href}
                  className="hover:text-orange-500 transition-colors truncate max-w-[150px]"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}
              <meta itemProp="position" content={(index + 2).toString()} />
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
