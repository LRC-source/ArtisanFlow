import React from 'react';
import { useFunnelMetrics } from '../../hooks/useFunnelMetrics';
import { motion } from 'framer-motion';
import { ArrowRight, Beaker, CheckCircle2, Leaf, ShieldCheck, Search, Scale, FileSignature, Star, Quote } from 'lucide-react';



const ApothecaryFunnel = () => {
  const { trackCtaClick } = useFunnelMetrics();
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-gray-100 font-sans selection:bg-emerald-900 selection:text-emerald-100">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#0a0f0d]/80 backdrop-blur-md border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-semibold tracking-wide text-white">Artisan Flow</span>
          </div>
          <a 
            href="/auth?tier=Artisan%20Flow%20Basic"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
          >
            Start Formulating
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-[#0a0f0d] to-[#0a0f0d] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=2000" 
            alt="Apothecary formulation" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="max-w-3xl"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-800/50 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-emerald-300 text-sm font-medium tracking-wide uppercase">For Botanical & Clean Beauty Brands</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-light tracking-tight text-white mb-6 leading-tight">
              Precision in every <br />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">botanical drop.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-gray-400 mb-10 leading-relaxed font-light max-w-2xl">
              Elevate your apothecary formulations with clinical precision. Scale recipes effortlessly, track every organic ingredient, and ensure flawless regulatory compliance for your small-batch cosmetics.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/auth?tier=Artisan%20Flow%20Basic"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] group"
              >
                Standardize Your Recipes
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-[#0d1411]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light mb-6">
                The formulation chaos <br />
                <span className="font-semibold text-emerald-400">stifling your growth.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 font-light leading-relaxed">
                As your clean beauty brand grows, the margin for error shrinks. Spreadsheets and notebooks can't keep up with the demands of scaling organic formulations while maintaining strict batch integrity.
              </p>
              
              <ul className="space-y-6">
                {[
                  { title: "Scaling Errors", desc: "Manual calculations lead to inconsistent batches and wasted precious ingredients.", icon: Scale },
                  { title: "Compliance Nightmares", desc: "Tracking lot numbers and expiration dates across multiple botanical sources is a logistical headache.", icon: ShieldCheck },
                  { title: "Lost Formula Variations", desc: "Struggling to track iterations of your hero product's formulation history.", icon: FileSignature }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-900/20 border border-red-900/50 flex items-center justify-center text-red-400">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm font-light">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-transparent rounded-3xl blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=1200" 
                alt="Messy formulation process" 
                className="relative rounded-3xl border border-gray-800 shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-5xl font-light mb-6">
              Clinical precision for <br />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">botanical artisans.</span>
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Artisan Flow provides the exact tools needed to standardize your recipes, trace every ingredient, and formulate with absolute confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:p-8">
            {[
              { 
                title: "Dynamic Recipe Scaling", 
                desc: "Instantly scale your formulations from 1oz prototypes to 10-gallon production runs with perfect mathematical precision.",
                icon: Beaker 
              },
              { 
                title: "Ingredient Traceability", 
                desc: "Track lot numbers, supplier COAs, and expiration dates for every botanical extract and carrier oil in your inventory.",
                icon: Search 
              },
              { 
                title: "Regulatory Batch Records", 
                desc: "Generate compliant batch records automatically. Know exactly what went into every bottle you sell.",
                icon: FileSignature 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-4 sm:p-8 rounded-3xl bg-[#0d1411] border border-emerald-900/30 hover:border-emerald-500/50 transition-colors group"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-900/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-[#0d1411] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <Quote className="w-12 h-12 text-emerald-500/50 mx-auto mb-8" />
          <h3 className="text-2xl lg:text-4xl font-light text-white mb-10 leading-relaxed">
            "Artisan Flow completely transformed how we manage our apothecary lines. The ability to scale our complex herbal serums precisely has saved us thousands in wasted ingredients. It's the clinical backbone our botanical brand needed."
          </h3>
          <div className="flex items-center justify-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" 
              alt="Sarah Jenkins" 
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30"
            />
            <div className="text-left">
              <p className="text-white font-medium">Sarah Jenkins</p>
              <p className="text-emerald-400 text-sm font-light">Founder, Botanica Clinical</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-4 sm:p-12 md:p-20 rounded-[3rem] bg-gradient-to-b from-[#0d1411] to-[#0a0f0d] border border-emerald-900/50 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615397323283-7c337b5879ea?auto=format&fit=crop&q=80&w=1200')] opacity-5 bg-cover bg-center"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-light text-white mb-6">
                Ready to elevate your formulations?
              </h2>
              <p className="text-xl text-gray-400 font-light mb-10 max-w-2xl mx-auto">
                Join the visionary apothecaries and clean beauty brands standardizing their production with Artisan Flow.
              </p>
              <a 
                href="/auth?tier=Artisan%20Flow%20Basic"
                className="inline-flex items-center justify-center px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-medium rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] group"
              >
                Standardize Your Recipes
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="mt-6 text-sm text-gray-500 font-light">
                Start for free. No credit card required.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ApothecaryFunnel;



