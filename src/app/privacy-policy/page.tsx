import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | StopShop',
  description: 'Understand how StopShop collects, uses, and protects your personal data. Read our privacy policy for secure online shopping and data processing.',
};

export const dynamic = 'force-dynamic';

function parseInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-heading font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements = [];
  let currentList = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('- ')) {
      currentList.push(<li key={`li-${i}`} className="mb-2 text-muted leading-relaxed">{parseInline(line.slice(2))}</li>);
      continue;
    } else if (currentList.length > 0) {
      elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 mb-6 marker:text-orange-500">{currentList}</ul>);
      currentList = [];
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 mt-10 mb-6">
          {parseInline(line.slice(2))}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-extrabold text-heading mt-12 mb-5 flex items-center gap-3">
          <div className="w-1.5 h-7 bg-gradient-to-b from-orange-500 to-orange-300 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
          {parseInline(line.slice(3))}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-xl font-bold text-heading mt-8 mb-3 flex items-center gap-2">
          <ChevronRight size={16} className="text-orange-500" />
          {parseInline(line.slice(4))}
        </h3>
      );
    } else if (line.trim() === '---') {
      elements.push(<hr key={i} className="my-10 border-border/60" />);
    } else if (line.trim() !== '') {
      elements.push(<p key={i} className="mb-4 text-muted leading-relaxed text-[15px]">{parseInline(line)}</p>);
    }
  }

  if (currentList.length > 0) {
    elements.push(<ul key="ul-end" className="space-y-2 mb-6">{currentList}</ul>);
  }

  return elements;
}

const defaultPolicy = `# StopShop Privacy Policy

*Effective Date: August 2026*

At StopShop, protecting your privacy and securing your personal information is our highest priority. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website, purchase our premium bronze, brass, and copper products, or interact with our artisan vendors.

---

## 1. Information We Collect

We collect information to provide a seamless, personalized shopping experience and to ensure your high-value shipments reach you securely.
- **Personal Information:** Name, email address, shipping and billing address, and phone number when you create an account or place an order.
- **Payment Information:** We process payments via secure, encrypted third-party gateways (e.g., Stripe, Razorpay). StopShop does **not** store your full credit card numbers on our servers.
- **Browsing Data:** IP address, browser type, device identifiers, and website interaction data collected automatically via cookies and similar tracking technologies.

## 2. How We Use Your Information

Your data allows us to operate our global export business efficiently:
- To process, fulfill, and ship your orders internationally.
- To communicate with you regarding order updates, tracking numbers, and customer support inquiries.
- To improve our website design, product offerings, and user experience.
- To send promotional emails or newsletters (only if you have explicitly opted in).

## 3. Data Sharing & Third Parties

StopShop respects your privacy. We do not sell your personal data to advertisers. However, we do share necessary information with trusted partners to operate our business:
- **Logistics Partners:** (DHL, FedEx) to facilitate international delivery and customs clearance.
- **Payment Processors:** To securely authorize and capture your payments.
- **Artisan Vendors:** Vendors receive only the shipping and order details necessary to fulfill your specific purchase. They do not receive your payment details.

## 4. Cookies and Tracking Technologies

We use cookies to remember your preferences (e.g., currency, wishlist items) and to analyze traffic on our platform. 
- You can manage or disable cookies through your browser settings, though this may limit your ability to use certain features on StopShop, such as the shopping cart.

## 5. Security Measures

We employ industry-standard security protocols to protect your personal information:
- All sensitive data transmitted between your browser and our servers is encrypted using Secure Socket Layer (SSL) technology.
- Our databases are secured behind robust firewalls and strict access controls.

## 6. Your Rights & Choices

Depending on your location (such as under the GDPR or CCPA), you may have the right to:
- Access the personal data we hold about you.
- Request correction of inaccurate data.
- Request the deletion of your personal data from our systems.
- Opt-out of marketing communications at any time.

## 7. Contact Us

If you have any questions or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer:
- **Email:** privacy@stopshop.com
- **Address:** StopShop Headquarters, India`;

export default async function PrivacyPolicyPage() {
  const settings = await prisma.adminSettings.findFirst();
  const rawPolicy = settings?.privacyPolicy || defaultPolicy;

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-muted mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-orange-500 font-bold">Privacy Policy</span>
        </nav>

        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-500/10">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-heading via-heading to-orange-500 tracking-tight">
              Privacy Policy
            </h1>
          </div>
          <p className="text-muted text-lg pl-18">How we collect, use, and protect your personal information.</p>
        </div>

        <div className="bg-surface-card border border-border/50 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-orange-500/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 relative overflow-hidden">
          {/* Subtle background glow in the card */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <article className="prose-custom text-muted relative z-10">
            {renderMarkdown(rawPolicy)}
          </article>
        </div>
      </div>
    </div>
  );
}
