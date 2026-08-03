import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { FileText, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | StopShop',
  description: 'Read the terms of service and conditions for using StopShop. Discover our guidelines for purchasing, shipping, and using our premium artisan marketplace.',
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

const defaultPolicy = `# StopShop Terms & Conditions

*Effective Date: August 2026*

Welcome to StopShop. These Terms and Conditions govern your use of our website and the purchase of our premium bronze, brass, and copper products. By accessing or using our platform, you agree to be bound by these terms.

---

## 1. Acceptance of Terms

By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions. These Terms apply to all users of the site, including browsers, vendors, customers, merchants, and contributors of content.

## 2. Global Export Platform

StopShop acts as a premium international marketplace, connecting Indian artisans with global buyers. 
- You understand that products are shipped from India and may be subject to the laws, regulations, and customs duties of the destination country.
- StopShop acts as an intermediary for artisans but guarantees the quality and fulfillment of every premium product sold on our platform.

## 3. Pricing and Payments

- All prices are subject to change without notice. We reserve the right to modify or discontinue any product.
- Prices may be displayed in your local currency, but final checkout may be processed in USD or INR depending on the payment gateway.
- You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.

## 4. Product Descriptions & Craftsmanship

We sell handcrafted, premium metalware.
- **Variations:** Because our bronze, brass, and copper products are handmade by artisans, slight variations in weight, color, or finish are normal and represent the authenticity of the craft. They are not considered defects.
- We have made every effort to display the colors and images of our products accurately, but we cannot guarantee that your computer monitor's display will be completely accurate.

## 5. Intellectual Property

All content included on this site, such as text, graphics, logos, images, audio clips, digital downloads, and data compilations is the property of StopShop or its content suppliers and protected by international copyright laws.

## 6. Prohibited Uses

You are prohibited from using the site or its content:
- For any unlawful purpose or to solicit others to perform unlawful acts.
- To violate any international, federal, or state regulations, rules, or laws.
- To infringe upon or violate our intellectual property rights or the intellectual property rights of others.

## 7. Limitation of Liability

In no case shall StopShop, our directors, officers, employees, affiliates, agents, contractors, or artisans be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, arising from your use of any of the service or any products procured using the service.

## 8. Governing Law

These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.

## 9. Contact Information

Questions about the Terms of Service should be sent to us at:
- **Email:** legal@stopshop.com`;

export default async function TermsPage() {
  const settings = await prisma.adminSettings.findFirst();
  const rawPolicy = settings?.termsPolicy || defaultPolicy;

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-muted mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-orange-500 font-bold">Terms & Conditions</span>
        </nav>

        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-500/10">
              <FileText size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-heading via-heading to-orange-500 tracking-tight">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-muted text-lg pl-18">The rules and guidelines for using StopShop.</p>
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
