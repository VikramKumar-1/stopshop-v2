import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { RefreshCcw, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds | StopShop',
  description: 'Read StopShop\'s return and refund policy. Learn about our 7-day return window, eligibility for international returns, and refund processing for our handcrafted goods.',
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

const defaultPolicy = `# StopShop Return & Refund Policy

*Effective Date: August 2026*

At StopShop, we stand behind the quality of our premium bronze, brass, and copper kitchenware. Because our products are handcrafted and shipped internationally, we have specific guidelines regarding returns and refunds to ensure a fair process for both our customers and our artisan vendors.

---

## 1. Return Eligibility Window

You may request a return within **7 days** of receiving your order. To be eligible for a return, the item must be:
- Unused and in the exact same condition that you received it.
- In its original premium packaging, with all protective wrapping and tags intact.
- Accompanied by the original receipt or proof of purchase.

## 2. Non-Returnable Items

Due to hygiene and international shipping constraints, certain items cannot be returned:
- Items that have been used, washed, or altered in any way.
- Custom-engraved or personalized bulk orders.
- Items marked as "Final Sale" or purchased using a clearance discount code.

## 3. How to Initiate a Return

If you need to return an item, please follow these steps:
1. Contact our support team at **returns@stopshop.com** within 7 days of delivery.
2. Include your **Order ID** and clear photos of the item and its packaging.
3. If your return is approved, we will provide you with a Return Merchandise Authorization (RMA) number and detailed shipping instructions.

## 4. Return Shipping Costs

- **Customer Remorse / Change of Mind:** The customer is responsible for paying all return shipping costs, including any export/import duties incurred when shipping the item back to our facility in India. We highly recommend using a trackable shipping service.
- **Defective or Damaged Items:** If the product arrives severely damaged or is incorrect, StopShop will cover the return shipping costs or offer a full replacement at no extra charge.

## 5. Refund Processing

Once your return is received and inspected by our Quality Control team (usually within 24-48 hours of receipt):
- We will send you an email notifying you of the approval or rejection of your refund.
- If approved, your refund will be processed and automatically applied to your original method of payment within **5 to 10 business days**.
- Original shipping charges, international customs duties, and taxes paid are **non-refundable**.

## 6. Late or Missing Refunds

If you haven’t received a refund yet:
- First, check your bank account again.
- Contact your credit card company, as it may take some time before your refund is officially posted.
- If you’ve done all of this and still have not received your refund, please contact us at **support@stopshop.com**.

## 7. Contact Us

For any questions regarding our return and refund process, please reach out to our dedicated support team:
- **Email:** support@stopshop.com`;

export default async function RefundPolicyPage() {
  const settings = await prisma.adminSettings.findFirst();
  const rawPolicy = settings?.refundPolicy || defaultPolicy;

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-muted mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-orange-500 font-bold">Return & Refund Policy</span>
        </nav>

        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-500/10">
              <RefreshCcw size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-heading via-heading to-orange-500 tracking-tight">
              Return & Refund Policy
            </h1>
          </div>
          <p className="text-muted text-lg pl-18">Our guidelines for international returns, exchanges, and refunds.</p>
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
