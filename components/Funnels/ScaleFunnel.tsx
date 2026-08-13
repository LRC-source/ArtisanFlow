'use client';

import React from 'react';
import { useFunnelMetrics } from '../../hooks/useFunnelMetrics';
import { motion } from 'framer-motion';

import { 
  BarChart3, 
  Factory, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Workflow, 
  CheckCircle2, 
  ArrowRight,
  PackageCheck,
  AlertTriangle
} from 'lucide-react';

const ScaleFunnel = () => {
  const { trackCtaClick } = useFunnelMetrics();
  const router = null;

  const handleCTA = () => {
    router.push('/auth?tier=Margin%20Protection%20Pro');
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000" 
            alt="Industrial manufacturing background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-[#0a0a0a]"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-900 to-[#1a1a1a] border border-[#333] px-4 py-2 rounded-full mb-8">
              <Factory className="w-4 h-4 text-[#d4af37]" />
              <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">For Scaling Manufacturers & Wholesale Brands</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Stop <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">Margin Erosion</span> in its Tracks.
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto font-light">
              Unify your multi-channel inventory, crush production bottlenecks, and protect your wholesale margins with industrial-grade precision.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleCTA}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b38b22] text-black font-bold rounded-lg text-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center group"
              >
                Lock In Your Profit Margins
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-sm text-gray-500 sm:ml-4">Zero-risk 14-day deployment.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section (Execution Conflict) */}
      <section className="py-24 bg-[#111] border-y border-[#222]">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">The Cost of Scale is <span className="text-red-500">Chaos</span></h2>
              <p className="text-xl text-gray-400">As volume increases, legacy systems break down.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 sm:p-8">
              {[
                {
                  icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
                  title: "Wholesale Margin Erosion",
                  desc: "Volume discounts and unoptimized supplier terms are quietly eating away at your bottom line while overhead scales linearly."
                },
                {
                  icon: <Layers className="w-8 h-8 text-orange-500" />,
                  title: "Multi-Channel Desync",
                  desc: "Overselling on B2B portals while stock sits idle in retail warehouses. Inventory data that's 24 hours out of date."
                },
                {
                  icon: <Workflow className="w-8 h-8 text-yellow-500" />,
                  title: "Production Bottlenecks",
                  desc: "Raw material shortages stalling entire production lines because procurement disconnected from demand forecasting."
                }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="bg-gradient-to-b from-[#1a1a1a] to-[#111] p-4 sm:p-8 rounded-xl border border-[#333] hover:border-[#d4af37]/30 transition-colors">
                  <div className="mb-6 bg-black w-16 h-16 rounded-full flex items-center justify-center border border-[#333]">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Industrial-Strength <span className="text-[#d4af37]">Control</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Artisan Flow provides the high-tech infrastructure needed to scale manufacturing without sacrificing margins.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <ShieldCheck className="w-6 h-6 text-[#d4af37] mr-3" />
                Margin Protection Engine (Profit Guard)
              </h3>
              <p className="text-gray-400 mb-6 text-lg">
                Automatically calculate landed costs down to the cent. Our Profit Guard system alerts you when wholesale tiers fall below your minimum acceptable margin threshold before the PO is approved.
              </p>
              <ul className="space-y-4">
                {['Dynamic landed cost calculations', 'Supplier price variance alerts', 'Automated tiered pricing enforcement'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-[#d4af37] mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden border border-[#333] shadow-2xl shadow-[#d4af37]/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" alt="Data dashboard" className="w-full h-auto" />
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden border border-[#333] shadow-2xl shadow-[#d4af37]/10 order-2 lg:order-1"
            >
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000" alt="Warehouse logistics" className="w-full h-auto" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <PackageCheck className="w-6 h-6 text-[#d4af37] mr-3" />
                Omnichannel Sync & Production Routing
              </h3>
              <p className="text-gray-400 mb-6 text-lg">
                Connect B2B wholesale portals, DTC storefronts, and physical warehouse locations in a unified, real-time ledger. Route production demands automatically based on predictive velocity.
              </p>
              <ul className="space-y-4">
                {['Sub-second global inventory sync', 'BOM (Bill of Materials) explosion forecasting', 'Automated reorder point triggers'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-[#d4af37] mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-[#0a0a0a] border-y border-[#222]">
        <div className="container mx-auto px-4">
           <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#d4af37] font-semibold tracking-widest uppercase text-sm mb-4">Trusted by Industry Leaders</p>
            <h2 className="text-3xl font-bold text-white mb-10">Managing $500M+ in Wholesale GMV</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-4 sm:p-8 max-w-4xl mx-auto">
            <div className="bg-[#111] p-4 sm:p-8 rounded-xl border border-[#333] relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-24 h-24" />
              </div>
              <p className="text-lg text-gray-300 italic mb-6 relative z-10">"Before Artisan Flow, our B2B portal was constantly out of sync with our main warehouse, leading to cancelled orders and furious distributors. Now, our inventory is unified, and our margins are up 14% due to the Profit Guard system."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full mr-4 border border-[#d4af37]/50 flex items-center justify-center font-bold text-white">MR</div>
                <div>
                  <h4 className="font-bold text-white">Marcus R.</h4>
                  <p className="text-sm text-[#d4af37]">VP Operations, Atlas Manufacturing</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] p-4 sm:p-8 rounded-xl border border-[#333] relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                <BarChart3 className="w-24 h-24" />
              </div>
              <p className="text-lg text-gray-300 italic mb-6 relative z-10">"The BOM forecasting alone paid for the system in the first month. We no longer have production lines sitting idle waiting for raw materials. It's a complete game-changer for physical product scaling."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full mr-4 border border-[#d4af37]/50 flex items-center justify-center font-bold text-white">SL</div>
                <div>
                  <h4 className="font-bold text-white">Sarah L.</h4>
                  <p className="text-sm text-[#d4af37]">Supply Chain Director, Nexa Goods</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1500] to-[#0a0a0a] z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Build a <span className="text-[#d4af37]">Resilient</span> Supply Chain?
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-xl text-gray-400 mb-10"
          >
            Deploy Artisan Flow and take total control of your manufacturing, wholesale channels, and margins today.
          </motion.p>
          <motion.button 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             onClick={handleCTA}
             className="px-10 py-5 bg-gradient-to-r from-[#d4af37] to-[#b38b22] text-black font-bold rounded-lg text-xl hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center mx-auto group"
          >
            Lock In Your Profit Margins
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <p className="mt-6 text-gray-500">Includes white-glove onboarding for enterprise accounts.</p>
        </div>
      </section>
    </div>
  );
};

export default ScaleFunnel;



