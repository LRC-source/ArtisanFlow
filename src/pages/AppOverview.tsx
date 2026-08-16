import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Factory, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Card, Button } from '../../components/UI';

export const AppOverview = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Free Audit",
      price: "$0/mo",
      description: "Baseline access to start organizing your artisanal business.",
      features: ["Inventory Hub", "Recipe Builder (BOM)", "Basic Production Workflow", "CRM", "Lola AI Assistant"],
      locked: ["Operations Command Center", "Quality Control", "Marketing Studio", "Profit Guard™"]
    },
    {
      name: "Artisan Flow Basic",
      price: "$29/mo",
      description: "The complete ecosystem for scaling makers and botanical formulators.",
      features: ["Operations Command Center", "Full Marketing Hub (Social, Blog, Video)", "Finance Projections", "Supplier Management", "Quality Control"],
      locked: ["Profit Guard™", "Inventory Forecasting"]
    },
    {
      name: "Margin Protection Pro",
      price: "$99/mo",
      description: "Enterprise-grade analytics to protect your margins at scale.",
      features: ["Profit Guard™", "Predictive Inventory Forecasting", "Real-time Anomaly Detection", "White-glove Support"],
      locked: []
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#C5A059] selection:text-white font-sans overflow-x-hidden pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles size={14} className="text-[#C5A059]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">Artisan Flow Ecosystem</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6 leading-tight">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#E2C685]">Capability Map</span>
          </h1>
          <p className="text-lg text-white/50 leading-relaxed font-light">
            Bridging the gap between raw industrial precision and artisanal craftsmanship. Explore the modules that will scale your formulation business.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          
          <Card className="p-10 border-white/5 bg-black/40 backdrop-blur-xl rounded-[2rem] hover:border-[#C5A059]/30 transition-colors duration-500">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <Factory size={24} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-serif mb-4">Operations Hub</h3>
            <p className="text-white/50 font-light leading-relaxed mb-6">
              Manage your precise formulations via the Recipe Builder (BOM), schedule production batches, and let the Batch Deduction Engine automatically decrement raw materials.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-white/70"><CheckCircle2 size={16} className="text-[#C5A059] mr-3" /> Raw Material Ledger</li>
              <li className="flex items-center text-sm text-white/70"><CheckCircle2 size={16} className="text-[#C5A059] mr-3" /> Kanban Workflow</li>
            </ul>
          </Card>

          <Card className="p-10 border-white/5 bg-black/40 backdrop-blur-xl rounded-[2rem] hover:border-[#C5A059]/30 transition-colors duration-500">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <DollarSign size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-2xl font-serif mb-4">Finance Hub & Profit Guard™</h3>
            <p className="text-white/50 font-light leading-relaxed mb-6">
              AI-assisted cash flow analysis. Upgrade to Margin Protection Pro for high-precision margin anomaly detection and predictive inventory forecasting.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-white/70"><CheckCircle2 size={16} className="text-[#C5A059] mr-3" /> Financial Projections</li>
              <li className="flex items-center text-sm text-white/70"><CheckCircle2 size={16} className="text-[#C5A059] mr-3" /> Margin Protection Pro</li>
            </ul>
          </Card>

        </div>

        {/* Tiers Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif tracking-tight mb-4">Ecosystem Tiers</h2>
            <p className="text-white/50 font-light">Choose the access level that matches your growth.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <div key={idx} className={`p-8 rounded-[2rem] border ${idx === 1 ? 'border-[#C5A059]/50 bg-[#C5A059]/5' : 'border-white/5 bg-black/40'} flex flex-col relative overflow-hidden`}>
                {idx === 1 && <div className="absolute top-0 right-0 bg-[#C5A059] text-black text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1 rounded-bl-xl">Most Popular</div>}
                
                <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
                <div className="text-3xl font-light tracking-tight mb-4">{tier.price}</div>
                <p className="text-sm text-white/50 font-light mb-8 flex-1">{tier.description}</p>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">Included Features</div>
                    <ul className="space-y-3">
                      {tier.features.map((feat, i) => (
                        <li key={i} className="flex items-start text-sm text-white/80">
                          <CheckCircle2 size={16} className="text-[#C5A059] mr-3 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {tier.locked.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 pt-4 border-t border-white/5">Locked Elements</div>
                      <ul className="space-y-3 opacity-50">
                        {tier.locked.map((feat, i) => (
                          <li key={i} className="flex items-start text-sm text-white/60">
                            <Lock size={14} className="text-gray-500 mr-3 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Button 
                  variant={idx === 1 ? 'premium' : 'outline'} 
                  onClick={() => navigate('/auth')}
                  className="w-full h-12 rounded-xl"
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
