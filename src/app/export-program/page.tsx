import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Export Program | StopShop",
  description: "StopShop's Export Program for international buyers to source authentic Indian products in bulk.",
};

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

async function getExportContent() {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${appUrl}/api/settings/public`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.settings?.exportProgramContent || null;
  } catch (e) {
    return null;
  }
}

export default async function ExportProgramPage() {
  const content = await getExportContent();

  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-heading tracking-tight">
            Stop<span className="text-orange-500">Shop</span> Export Program
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Your trusted partner for sourcing premium Indian kitchen, home, and lifestyle products directly from artisans in bulk.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-surface-card border border-border shadow-sm rounded-3xl p-8 md:p-12 prose prose-bronze max-w-none">
          {content ? (
            renderMarkdown(content)
          ) : (
            <div className="text-center py-12">
              <p className="text-muted">We are currently updating our Export Program details. Please check back later or contact us directly.</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-orange-500/10 border border-orange-500/20 rounded-3xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-heading">Ready to Source from India?</h2>
          <p className="text-muted max-w-xl mx-auto">
            Get in touch with our export specialists to discuss your bulk requirements, quality assurance processes, and international shipping options.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link 
              href="/contact" 
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
