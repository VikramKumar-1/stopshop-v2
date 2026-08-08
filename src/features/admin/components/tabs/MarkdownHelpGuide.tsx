import React from "react";

export function MarkdownHelpGuide() {
  return (
    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 space-y-2 mb-6">
      <h3 className="text-xs font-bold text-orange-600 flex items-center gap-1">
        📝 Markdown Formatting Guide
      </h3>
      <p className="text-[11px] text-muted leading-relaxed">
        Use these simple symbols to format your text. It will automatically be converted to beautiful styling on the public pages.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono mt-2 bg-surface p-3 rounded-lg border border-border">
        <div><span className="text-orange-500 font-bold"># Heading 1</span> <span className="text-muted ml-2">→ Main Title</span></div>
        <div><span className="text-orange-500 font-bold">## Heading 2</span> <span className="text-muted ml-2">→ Section Title</span></div>
        <div><span className="text-orange-500 font-bold">### Heading 3</span> <span className="text-muted ml-2">→ Subtitle</span></div>
        <div><span className="text-orange-500 font-bold">**Bold Text**</span> <span className="text-muted ml-2">→ <strong>Bold</strong></span></div>
        <div><span className="text-orange-500 font-bold">*Italic Text*</span> <span className="text-muted ml-2">→ <em>Italic</em></span></div>
        <div><span className="text-orange-500 font-bold">- List item</span> <span className="text-muted ml-2">→ Bullet point</span></div>
        <div><span className="text-orange-500 font-bold">---</span> <span className="text-muted ml-2">→ Horizontal Divider Line</span></div>
      </div>
    </div>
  );
}
