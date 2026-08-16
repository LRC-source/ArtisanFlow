import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from './UI';
import { Activity, TrendingUp, DollarSign, ArrowRight, Sparkles, Box, Plus, ShoppingBag, ShieldCheck, BarChart3, Package, Factory } from 'lucide-react';
import { useArtisanData } from './DataContext';
import { GlassHaloIcon } from './ui/GlassHaloIcon';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * ArtisanFlow Business Pulse - STATUS: COMPLETE ✅
 */

export const BusinessPulse: React.FC = () => {
  const navigate = useNavigate();
  const { demandInsights, businessProfile, inventory, orders } = useArtisanData();

  const criticalInsight = demandInsights.find(i => i.isCritical);
  const totalCritical = demandInsights.filter(i => i.isCritical).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-12"
    >
      {/* High-Fidelity Banner Architecture - REFINED LUXURY VAULT */}
      <div 
        className="relative w-full overflow-hidden py-24 px-12 md:px-20 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(106,44,145,0.2)]"
      >
        {/* Ombre Brand Background */}
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6A2C91_0%,transparent_60%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#C5A059_0%,transparent_60%)] opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_70%)] opacity-20"></div>
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Static Light Accents */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent"></div>
        <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#6A2C91]/30 to-transparent"></div>

        <div className="relative z-10 text-white flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center gap-4 mb-8 px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full"
          >
             <ShieldCheck size={20} className="text-[#C5A059]" />
             <span className="text-[12px] font-sans uppercase tracking-[0.4em] text-[#C5A059] font-bold">Secure Vault Access</span>
          </motion.div>

          <div className="mb-6">
            <h1 className="text-6xl md:text-8xl font-serif tracking-tighter text-white leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
              Artisan <span className="text-[#C5A059]">Flow</span> Vault
            </h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-white/70 text-lg md:text-xl font-sans font-light mb-12 max-w-3xl leading-relaxed italic"
          >
            "Precision intelligence for the modern artisan. Your operational legacy, <span className="text-white font-medium">secured and optimized</span>."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <button 
              onClick={() => navigate('/forecasting')}
              className="group relative overflow-hidden bg-[#C5A059] text-white px-10 py-5 rounded-2xl font-sans uppercase text-[12px] font-black tracking-[0.4em] transition-all duration-500 hover:shadow-[0_15px_30px_-10px_rgba(197,160,89,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-4">
                <Plus size={20} /> INITIATE FORECAST
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            <button 
              onClick={() => navigate('/business-pulse-check')}
              className="bg-white/5 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-sans uppercase text-[12px] font-black tracking-[0.4em] transition-all duration-500 hover:bg-white/10 hover:border-white/40"
            >
              SYSTEM DIAGNOSTIC
            </button>
          </motion.div>
        </div>

        {/* Static Decorative Elements */}
        <div className="absolute top-4 sm:p-10 left-20 w-32 h-32 border border-[#C5A059]/10 rounded-2xl rotate-12"></div>
        <div className="absolute bottom-10 right-20 w-48 h-48 border border-[#6A2C91]/10 rounded-full"></div>
      </div>

      {/* Diagnostic Card - Minimalist */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="p-4 sm:p-10 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 sm:p-8 relative group shadow-2xl"
      >
          <div className="flex items-center gap-4 sm:p-8">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10">
                  <BarChart3 size={28} strokeWidth={1.5} />
              </div>
              <div>
                  <h2 className="text-4xl font-serif text-white mb-4 tracking-tight">Everything is <span className="text-emerald-400">Running Smoothly</span></h2>
                  <p className="text-white/50 font-sans font-light text-lg max-w-2xl leading-relaxed">
                    Your stock is healthy, orders are moving, and your profits are protected. No urgent actions needed today.
                  </p>
              </div>
          </div>
          <Button 
            variant="premium"
            onClick={() => navigate('/business-pulse-check')}
            className="min-w-[220px] h-16 rounded-2xl flex items-center justify-center gap-3 group/btn shadow-xl"
          >
            RUN PULSE CHECK <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </Button>
      </motion.div>

      {/* VAULT ENTRY POINTS - Minimalist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="space-y-12"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-serif text-white tracking-tight">Vault Entry Points</h2>
          <div className="h-px flex-1 bg-white/5 mx-8"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-10">
            <QuickAccessCard 
              icon={Factory} 
              color="text-purple-400" 
              title="Operations Hub" 
              desc="Manufacturing, Orders & CRM" 
              image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
              action={() => navigate('/operations')} 
            />
            <QuickAccessCard 
              icon={DollarSign} 
              color="text-emerald-400" 
              title="Finance Hub" 
              desc="Budget & Projections" 
              image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
              action={() => navigate('/finance')} 
            />
            <QuickAccessCard 
              icon={Sparkles} 
              color="text-[#C5A059]" 
              title="Marketing Hub" 
              desc="Brand Voice & Strategy" 
              image="https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800"
              action={() => navigate('/marketing')} 
            />
            <QuickAccessCard 
              icon={ShieldCheck} 
              color="text-blue-400" 
              title="Profit Guard™" 
              desc="High-Precision Margin Analysis" 
              image="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
              action={() => navigate('/profit-guard')} 
            />
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatCard = ({ label, val, icon: Icon, color, bg, alert }: any) => (
  <Card className={`luxury-card flex flex-col h-full p-8 relative overflow-hidden group transition-all duration-500 ${alert ? 'animate-soft-success ring-1 ring-emerald-500/20' : ''}`}>
      <div className="mb-10">
          <span className={`text-[10px] font-sans font-medium uppercase tracking-[0.2em] ${alert ? 'text-emerald-600' : 'text-gray-400'}`}>{label}</span>
          <div className={`p-4 rounded-2xl w-fit mt-4 ${bg} ${color} shadow-sm group-hover:scale-105 transition-transform duration-500`}>
            <Icon size={24} strokeWidth={1.5} />
          </div>
      </div>
      <div className="mt-auto">
          <h2 className={`text-4xl font-serif tracking-tight ${alert ? 'text-emerald-700' : 'text-white font-bold'}`}>{val}</h2>
          <div className="h-8 mt-6 overflow-hidden">
             <svg viewBox="0 0 100 20" className={`w-full h-full opacity-30 ${alert ? 'animate-pulse' : ''}`}>
                 <path d="M0 15 Q 25 5 50 15 T 100 10" fill="none" stroke="currentColor" className={color} strokeWidth="2" />
             </svg>
          </div>
      </div>
  </Card>
);

const QuickAccessCard = ({ icon: Icon, color, title, desc, image, action }: any) => (
    <div 
      className="group p-0 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 hover:border-[#C5A059]/50 hover:shadow-2xl hover:shadow-black/50 transition-all duration-700 cursor-pointer relative overflow-hidden flex flex-col h-[500px]" 
      onClick={action}
    >
        {/* Image Section */}
        <div className="h-1/2 w-full overflow-hidden relative">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute top-6 left-6 group-hover:scale-110 transition-transform duration-500">
                <GlassHaloIcon icon={Icon} color={color === 'text-emerald-400' ? 'emerald' : color === 'text-purple-400' ? 'purple' : color === 'text-[#C5A059]' ? 'gold' : color === 'text-blue-400' ? 'cyan' : 'cyan'} size="md" />
            </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-12 flex flex-col flex-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 group-hover:bg-[#C5A059] transition-colors duration-500"></div>
            <h3 className="text-3xl font-serif text-white mb-4 tracking-tight group-hover:text-[#C5A059] transition-colors">{title}</h3>
            <p className="text-sm font-sans font-light text-white/50 uppercase tracking-[0.3em] mb-8 leading-relaxed">{desc}</p>
            <div className="mt-auto flex items-center gap-3 text-[11px] font-sans font-bold text-white/30 uppercase tracking-[0.25em] group-hover:text-[#C5A059] transition-colors">
                Enter Vault Module <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </div>
        </div>
    </div>
);
