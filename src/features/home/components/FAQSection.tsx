"use client";
import { motion } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import React, { useState } from "react";

const faqs = [
  {
    question: "Do you export internationally?",
    answer: "Yes! We export to 20+ countries including UAE, UK, USA, Germany, Qatar, Saudi Arabia, and more. We handle all export documentation, customs clearance, and provide door-to-door delivery with real-time tracking.",
  },
  {
    question: "Do you accept bulk orders?",
    answer: "Absolutely. We offer tiered pricing for bulk orders starting from 50+ units. We serve retailers, wholesalers, hospitality businesses, and restaurant chains worldwide. Contact us for a custom bulk quote.",
  },
  {
    question: "Are products quality checked?",
    answer: "Every single product goes through a multi-stage quality inspection process before packaging. We check for material purity, finish quality, weight consistency, and durability to meet international standards.",
  },
  {
    question: "How is packaging handled?",
    answer: "We use premium export-grade packaging designed to withstand long-distance international shipping. Each item is individually wrapped with protective layers, bubble packaging, and placed in reinforced cartons to prevent any damage.",
  },
  {
    question: "What materials do you work with?",
    answer: "We offer products in Brass, Copper, Steel, Ceramic, and Glass. Each material is sourced from specialized artisan clusters across India, ensuring authenticity and premium craftsmanship.",
  },
  {
    question: "How can I become a vendor on StopShop?",
    answer: "If you're an artisan, manufacturer, or brand producing quality Indian kitchen, home, or lifestyle products, you can apply to become a vendor. Visit our 'Become a Vendor' page or contact us directly to get started.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-6 md:py-8 relative overflow-hidden bg-surface">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-bronze-500/[0.04] rounded-full blur-[200px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-xs font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase mb-4"
          >
            <HelpCircle size={14} className="text-bronze-500" />
            Have Questions?
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-heading mb-3">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? "bg-surface-card border-bronze-500/20 shadow-md shadow-bronze-500/[0.04]" 
                    : "bg-surface-card/50 border-bronze-500/10 hover:border-bronze-500/15"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <h3 className={`text-sm sm:text-base font-semibold transition-colors ${
                    isOpen ? "text-heading" : "text-heading/80"
                  }`}>
                    {faq.question}
                  </h3>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isOpen 
                      ? "bg-bronze-500/15 text-bronze-500 rotate-0" 
                      : "bg-surface-card text-muted"
                  }`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                {/* Answer — animated */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                    <p className="text-xs sm:text-sm text-body leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
