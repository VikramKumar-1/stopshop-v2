'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Truck, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Banknote, Store } from 'lucide-react';

export default function BecomeVendorPage() {
  const benefits = [
    {
      title: "Global Reach",
      description: "We export your products internationally. Your local craftsmanship gets a global stage and international buyers without you lifting a finger.",
      icon: Globe,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Zero Logistics Headache",
      description: "You pack it, we pick it up. We handle all complex international shipping, customs clearance, and last-mile delivery to the customer.",
      icon: Truck,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      title: "Premium Margins",
      description: "We position your products as luxury export items, ensuring you get the high margins and respect your craftsmanship deserves.",
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "Secure Payouts",
      description: "Get paid securely and on time directly into your bank account for every completed international order. No chasing payments.",
      icon: Banknote,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  const steps = [
    {
      title: "Register Your Business",
      description: "Fill out our vendor registration form with your business details and product portfolio.",
    },
    {
      title: "Quality Review",
      description: "Our team reviews your products to ensure they meet our premium export standards.",
    },
    {
      title: "List & Sell",
      description: "Get access to your custom Vendor Dashboard to list products and track sales.",
    },
    {
      title: "We Ship, You Earn",
      description: "Receive orders, pack them, and we handle the rest while you get paid.",
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-surface to-surface-card pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Store size={14} /> Sell on StopShop
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-heading tracking-tight mb-6">
              Export India's Finest <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                To The World
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted mb-10 leading-relaxed">
              Join our exclusive network of premium bronze, brass, and copper artisans. 
              We handle the international logistics, marketing, and customs. You just focus on the craft.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/vendor/register"
                className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Register as Vendor <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-surface-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-heading mb-4">Why Partner With Us?</h2>
            <p className="text-muted max-w-2xl mx-auto">We eliminate the friction of international trade so you can scale your business effortlessly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-surface p-8 rounded-3xl border border-border hover:border-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/5 group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${benefit.bgColor} ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3">{benefit.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-extrabold text-heading mb-4">How It Works</h2>
            <p className="text-muted max-w-2xl mx-auto">Four simple steps to start exporting your premium products globally.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-24 right-24 h-0.5 bg-border -z-10" />
            
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto bg-surface-card border-4 border-surface shadow-xl rounded-full flex items-center justify-center mb-6 relative z-10">
                  <span className="text-3xl font-black text-orange-500">{idx + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-heading mb-3">{step.title}</h3>
                <p className="text-sm text-muted">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link 
              href="/vendor/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-heading text-surface font-bold rounded-2xl shadow-xl transition-transform hover:scale-105"
            >
              Apply to Sell Now <ShieldCheck size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
