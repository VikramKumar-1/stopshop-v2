"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Mail, Phone, MapPin, LifeBuoy, Instagram, Facebook, Youtube, Twitter, Linkedin, Link as LinkIcon, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { HelpSupportModal } from "./HelpSupportModal";

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
    { href: "/terms-and-conditions", label: "Terms & Conditions" },
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
  { name: "Instagram", href: "#", icon: <Instagram size={18} /> },
  { name: "Facebook", href: "#", icon: <Facebook size={18} /> },
  { name: "YouTube", href: "#", icon: <Youtube size={18} /> },
  { name: "Twitter", href: "#", icon: <Twitter size={18} /> },
];

function getSocialIcon(url: string, fallbackName?: string) {
  const lowerUrl = (url || "").toLowerCase();
  const lowerName = (fallbackName || "").toLowerCase();
  
  if (lowerUrl.includes("instagram.com") || lowerName.includes("instagram")) return <Instagram size={18} />;
  if (lowerUrl.includes("facebook.com") || lowerName.includes("facebook")) return <Facebook size={18} />;
  if (lowerUrl.includes("youtube.com") || lowerName.includes("youtube")) return <Youtube size={18} />;
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com") || lowerName.includes("twitter")) return <Twitter size={18} />;
  if (lowerUrl.includes("linkedin.com") || lowerName.includes("linkedin")) return <Linkedin size={18} />;
  if (lowerUrl.includes("whatsapp.com") || lowerName.includes("whatsapp")) return <Phone size={18} />;
  
  return <LinkIcon size={18} />;
}

export const Footer = ({ footerData }: { footerData?: any }) => {
  const pathname = usePathname();
  if (pathname.startsWith("/worker")) return null;
  const isDashboard = pathname.startsWith("/vendor") || pathname.startsWith("/admin");
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  if (isDashboard) {
    return (
      <>
        <HelpSupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
        <footer className="bg-surface-card border-t border-border mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-heading text-sm">
                Stop<span className="text-orange-500">Shop</span> <span className="font-normal text-xs text-muted">Artisan Partner</span>
              </span>
            </div>
            <div className="flex items-center gap-6 font-semibold">
              <button 
                type="button" 
                onClick={() => setIsSupportOpen(true)}
                className="hover:text-orange-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LifeBuoy size={14} className="text-orange-500" />
                <span>Help & Support</span>
              </button>
              <a href="#" className="hover:text-heading transition-colors">Seller Policies</a>
              <a href="#" className="hover:text-heading transition-colors">Terms of Service</a>
            </div>
            <p className="text-[11px]">
              &copy; {new Date().getFullYear()} StopShop. Artisan Partner Portal • Made in India 🇮🇳
            </p>
          </div>
        </footer>
      </>
    );
  }

  const isCheckoutStatusPage = pathname.startsWith("/checkout/success") || pathname.startsWith("/checkout/failure");

  return (
    <>
    <footer className={`bg-bronze-950 text-bronze-100 [contain:paint] ${isCheckoutStatusPage ? "hidden md:block" : ""}`}>
      {/* Mobile only Hero CTA */}
      <div className="md:hidden bg-surface text-body px-4 py-8 border-b border-border">
        <h2 className="text-3xl font-display font-bold tracking-tight leading-[1.1] text-heading mb-6">
          India&apos;s Finest
          <br />
          <span className="text-orange-500">Kitchen & Home</span>
          <br />
          Essentials Crafted for the
          <br />
          World
        </h2>

        <div className="flex flex-col gap-3">
          <Link
            href="/contact"
            className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/20 text-sm"
          >
            Request a Quote
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/about"
            className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white border border-border/60 dark:bg-surface-card text-heading font-semibold text-sm shadow-sm"
          >
            Explore Export Program
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6 sm:gap-8 lg:gap-10">

          {/* Brand — full width on mobile, 2 cols on lg */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.webp" 
                alt="StopShop Logo" 
                className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-2xl object-contain shadow-md group-hover:scale-105 transition-transform shrink-0"
              />
              <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
                Stop<span className="text-bronze-400">Shop</span>
              </span>
            </Link>
            <p className="text-bronze-300 max-w-sm leading-relaxed text-sm">
              {footerData?.footerAboutText || "India's premium marketplace for kitchen, home, and lifestyle products. Trusted by buyers across 20+ countries for quality and authenticity."}
            </p>

            {/* Contact info */}
            <div className="space-y-2.5">
              {footerData?.footerContacts?.filter((c: any) => c.isVisible).length > 0 ? (
                footerData.footerContacts.filter((c: any) => c.isVisible).map((contact: any, i: number) => (
                  <div key={contact.id || i} className="flex items-center gap-3 text-sm">
                    {contact.type === "email" && <Mail size={14} className="text-bronze-400 flex-shrink-0" />}
                    {contact.type === "phone" && <Phone size={14} className="text-bronze-400 flex-shrink-0" />}
                    {contact.type === "address" && <MapPin size={14} className="text-bronze-400 flex-shrink-0" />}
                    <span className="text-bronze-300">{contact.value}</span>
                  </div>
                ))
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              {footerData?.footerSocialLinks?.filter((s: any) => s.isVisible).length > 0 ? (
                footerData.footerSocialLinks.filter((s: any) => s.isVisible).map((social: any, i: number) => (
                  <a
                    key={social.id || i}
                    href={social.url}
                    className="w-9 h-9 rounded-lg bg-bronze-900 hover:bg-bronze-800 flex items-center justify-center text-sm transition-colors text-bronze-300 hover:text-white"
                    aria-label={social.name}
                    title={social.name}
                  >
                    {getSocialIcon(social.url, social.name)}
                  </a>
                ))
              ) : (
                socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-9 h-9 rounded-lg bg-bronze-900 hover:bg-bronze-800 flex items-center justify-center text-sm transition-colors text-bronze-300 hover:text-white"
                    aria-label={social.name}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))
              )}
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
              <li>
                <button
                  type="button"
                  onClick={() => setIsSupportOpen(true)}
                  className="text-bronze-400 hover:text-bronze-200 transition-colors text-sm cursor-pointer text-left"
                >
                  Help & Support
                </button>
              </li>
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
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-y-2.5 gap-x-4 sm:space-y-2.5 sm:gap-y-0 sm:gap-x-0">
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
      <div className="border-t border-bronze-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-bronze-400">
          
          <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} StopShop Inc. All rights reserved.</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 font-semibold">
            <p className="font-normal text-bronze-400">
              Designed & Developed by{" "}
              <a 
                href="https://www.globalwebify.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-bronze-200 font-medium hover:text-orange-400 transition-colors"
              >
                Global Webify
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
    <HelpSupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </>
  );
};
