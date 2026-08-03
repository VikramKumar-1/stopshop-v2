import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Truck, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | StopShop',
  description: 'Learn about StopShop\'s international shipping policy, delivery timelines, customs handling, and shipping charges for our premium bronze and brass products.',
};

export const dynamic = 'force-dynamic';

// A tiny parser to render basic markdown elements beautifully
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

const defaultPolicy = `# StopShop Shipping Policy

*Effective Date: August 2026*

Welcome to StopShop! We take pride in delivering India's finest premium bronze, brass, and copper kitchenware securely to your doorstep, anywhere in the world. Please review our shipping policy below to understand our processing times, shipping methods, and international logistics.

---

## 1. Order Processing Time

Every piece of our premium kitchenware is carefully inspected and securely packaged to ensure it reaches you in pristine condition.
- **Standard Processing:** All orders are processed and dispatched within **2 to 4 business days** from the date of order confirmation.
- **Custom/Bulk Orders:** Processing times for bulk export orders or custom engravings may take up of **7 to 10 business days**, depending on the size of the order.
- You will receive a shipment confirmation email with tracking information as soon as your order has been dispatched.

## 2. Shipping Destinations & Partners

We proudly ship globally! StopShop partners with premium, reliable international couriers (such as DHL, FedEx, and UPS) to ensure fast and secure delivery across international borders.

## 3. Shipping Rates & Delivery Estimates

Shipping charges for your order will be calculated and displayed at checkout based on the destination country and the volumetric weight of the package.

- **Domestic (India):** 3 - 5 Business Days
- **Middle East / UAE:** 5 - 8 Business Days
- **USA & Canada:** 7 - 12 Business Days
- **Europe & UK:** 7 - 12 Business Days
- **Rest of the World:** 10 - 15 Business Days

*Note: Delivery delays can occasionally occur due to international customs processing or extreme weather conditions.*

## 4. International Customs, Duties & Taxes

When exporting premium metalware internationally, customs policies vary widely from country to country.
- **DDU (Delivered Duty Unpaid):** StopShop is **not responsible** for any customs and taxes applied to your order. All fees imposed during or after shipping (tariffs, taxes, VAT, etc.) are the sole responsibility of the customer.

## 5. Damages and Missing Packages

We ensure that every item is wrapped in heavy-duty, impact-resistant packaging to protect the metal from denting or scratching during transit.
- If your package is severely damaged upon arrival, please **do not accept the delivery** and contact us immediately.
- If you find the product damaged after opening the package, please contact our support team within **48 hours** of delivery with clear unboxing photos and videos.

## 6. Contact Us

If you have any further questions regarding your shipment, please reach out to our dedicated logistics support team:
- **Email:** support@stopshop.com`;

export default async function ShippingPolicyPage() {
  const settings = await prisma.adminSettings.findFirst();
  const rawPolicy = settings?.shippingPolicy || defaultPolicy;

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-muted mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-orange-500 font-bold">Shipping Policy</span>
        </nav>

        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-500/10">
              <Truck size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-heading via-heading to-orange-500 tracking-tight">
              Shipping & Delivery
            </h1>
          </div>
          <p className="text-muted text-lg pl-18">Information about our domestic and international delivery processes.</p>
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
