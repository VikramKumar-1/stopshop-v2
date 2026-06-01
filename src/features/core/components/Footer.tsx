"use client";
import Link from "next/link";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

const footerLinks = {
  company: [
    { href: "/about", label: "About StopShop" },
    { href: "/export-program", label: "Export Program" },
    { href: "/become-vendor", label: "Become a Vendor" },
    { href: "/contact", label: "Contact Us" },
  ],
  policies: [
    { href: "/shipping-policy", label: "Shipping Policy" },
    { href: "/returns", label: "Returns & Refunds" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
  categories: [
    { href: "/category/kitchen-utility", label: "Kitchen Utility" },
    { href: "/category/brass-cookware", label: "Brass Cookware" },
    { href: "/category/copper-products", label: "Copper Products" },
    { href: "/category/home-living", label: "Home Living" },
    { href: "/category/pooja-collection", label: "Pooja Collection" },
  ],
};

const socialLinks = [
  { name: "Instagram", href: "#", icon: "📸" },
  { name: "Facebook", href: "#", icon: "👤" },
  { name: "YouTube", href: "#", icon: "🎥" },
  { name: "WhatsApp", href: "#", icon: "💬" },
];

export const Footer = () => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/vendor") || pathname.startsWith("/admin");

  if (isDashboard) {
    return (
      <footer className="bg-surface-card border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-heading text-sm">
              Stop<span className="text-orange-500">Shop</span> <span className="font-normal text-xs text-muted">Artisan Partner</span>
            </span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <a href="/vendor/dashboard" className="hover:text-heading transition-colors">Dashboard Support</a>
            <a href="#" className="hover:text-heading transition-colors">Seller Policies</a>
            <a href="#" className="hover:text-heading transition-colors">Terms of Service</a>
          </div>
          <p className="text-[11px]">
            &copy; {new Date().getFullYear()} StopShop. Artisan Partner Portal • Made in India 🇮🇳
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-bronze-950 text-bronze-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Brand — full width on mobile, 2 cols on lg */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo4.jpg" 
                alt="StopShop Logo" 
                className="w-14 h-14 bg-white rounded-2xl p-1.5 object-contain border border-bronze-800 shadow-md"
              />
              <span className="text-xl font-display font-bold tracking-tight text-white">
                Stop<span className="text-bronze-400">Shop</span>
              </span>
            </Link>
            <p className="text-bronze-300 max-w-sm leading-relaxed text-sm">
              India&apos;s premium marketplace for kitchen, home, and lifestyle products. Trusted by buyers across 20+ countries for quality and authenticity.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={14} className="text-bronze-400 flex-shrink-0" />
                <span className="text-bronze-300">export@stopshop.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={14} className="text-bronze-400 flex-shrink-0" />
                <span className="text-bronze-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={14} className="text-bronze-400 flex-shrink-0" />
                <span className="text-bronze-300">India</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-bronze-900 hover:bg-bronze-800 flex items-center justify-center text-sm transition-colors"
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 sm:mb-5">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-bronze-400 hover:text-bronze-200 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 sm:mb-5">
              Policies
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.policies.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-bronze-400 hover:text-bronze-200 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 sm:mb-5">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-bronze-400 hover:text-bronze-200 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-bronze-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-bronze-500">
            &copy; {new Date().getFullYear()} StopShop. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-bronze-500">
            <span>GST: XXXXXXXXXXXXXXX</span>
            <span>•</span>
            <span>MSME Registered</span>
            <span>•</span>
            <span>Made with pride in India 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
