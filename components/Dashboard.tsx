import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Package, Activity, AlertTriangle, Zap, ArrowRight, TrendingUp, Sparkles, Factory, User, CheckCircle2, Circle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { GlassHaloIcon } from './ui/GlassHaloIcon';
import { motion } from 'framer-motion';
import { Badge, Button, VaultBanner } from './UI';
import { useArtisanData } from './DataContext';

const DATA = [
  { name: 'Mon', val: 4000 },
  { name: 'Tue', val: 3000 },
  { name: 'Wed', val: 2000 },
  { name: 'Thu', val: 2780 },
  { name: 'Fri', val: 1890 },
  { name: 'Sat', val: 2390 },
  { name: 'Sun', val: 3490 }
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const { getTotalRevenue } = useArtisanData();
  const hasData = getTotalRevenue() > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-10 lg:space-y-12 max-w-7xl mx-auto"
    >
      <VaultBanner 
        title="Command Center"
        subtitle="The pulse of your artisan enterprise is currently optimized. Strategic nodes are stable."
        badge="Architect Authorization Confirmed"
      >
        <Button 
            onClick={() => navigate('/business-pulse')}
            className="bg-[#6A2C91] hover:bg-[#5a257a] text-white rounded-full px-12 py-6 font-sans font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all flex items-center gap-3 sm:gap-4 group"
        >
            Run Diagnostic <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </Button>
      </VaultBanner>

      {!hasData && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mt-6">
              <h3 className="text-xl font-serif font-black text-white mb-4">Guided Setup</h3>
              <p className="text-sm text-white/50 mb-6">Complete these steps to get your store up and running.</p>
              <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl cursor-pointer hover:bg-black/60 transition-colors" onClick={() => navigate('/settings/integrations')}>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                          <CheckCircle2 size={16} />
                      </div>
                      <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">Connect Storefront</h4>
                          <p className="text-xs text-white/40">Link Shopify, WooCommerce, or Etsy.</p>
                      </div>
                      <ArrowRight size={16} className="text-white/20" />
                  </div>
                  <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl cursor-pointer hover:bg-black/60 transition-colors" onClick={() => navigate('/inventory')}>
                      <div className="w-8 h-8 rounded-full bg-white/5 text-white/40 flex items-center justify-center border border-white/10">
                          <Circle size={16} />
                      </div>
                      <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">Add Inventory</h4>
                          <p className="text-xs text-white/40">Import your raw materials and stock.</p>
                      </div>
                      <ArrowRight size={16} className="text-white/20" />
                  </div>
                  <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl cursor-pointer hover:bg-black/60 transition-colors" onClick={() => navigate('/recipes')}>
                      <div className="w-8 h-8 rounded-full bg-white/5 text-white/40 flex items-center justify-center border border-white/10">
                          <Circle size={16} />
                      </div>
                      <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">Create Recipes</h4>
                          <p className="text-xs text-white/40">Build your BOMs and formulations.</p>
                      </div>
                      <ArrowRight size={16} className="text-white/20" />
                  </div>
              </div>
          </div>
      )}

      {/* Primary Navigation Portals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 sm:p-10">
        <MainNodePortal 
            title="Marketing Studio" 
            path="/marketing"
            icon={Sparkles} 
            iconColor="magenta"
            delay={0.3} 
            color="from-purple-600/40 to-indigo-600/40"
            shadow="shadow-purple-900/40"
        />
        <MainNodePortal 
            title="Manufacturing" 
            path="/recipes"
            icon={Factory} 
            iconColor="cyan"
            delay={0.4} 
            color="from-emerald-600/40 to-teal-600/40"
            shadow="shadow-emerald-900/40"
        />
        <MainNodePortal 
            title="CRM Hub" 
            path="/operations/crm"
            icon={User} 
            iconColor="purple"
            delay={0.5} 
            color="from-blue-600/40 to-cyan-600/40"
            shadow="shadow-blue-900/40"
        />
        <MainNodePortal 
            title="Orders & Finance" 
            path="/finance"
            icon={TrendingUp} 
            iconColor="gold"
            delay={0.6} 
            color="from-[#C5A059]/40 to-amber-600/40"
            shadow="shadow-amber-900/40"
        />
      </div>

      {/* Charts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 sm:p-12">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="lg:col-span-2 p-[1.5px] rounded-[3rem] bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] relative shadow-[0_0_20px_rgba(168,85,247,0.2)]"
        >
          <div className="luxury-card bg-[#0A0A0A] border-none p-4 sm:p-12 rounded-[3rem] relative overflow-hidden group w-full h-full">
              <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
              <div>
                  <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">Revenue Trajectory</h3>
                  <p className="text-[11px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.2em] mt-2">7-Day rolling performance audit</p>
              </div>
              <GlassHaloIcon icon={TrendingUp} color="gold" size="lg" className="group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="w-full min-h-[300px] sm:py-8 sm:py-16 px-4 sm:px-8 sm:min-h-[320px] h-auto w-full max-w-full overflow-hidden">
            {!hasData ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                        <TrendingUp size={32} />
                    </div>
                    <p className="text-white/60 font-medium">Awaiting first sale data...</p>
                    <p className="text-white/40 text-sm">Your revenue chart will appear here once you process an order.</p>
                </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6A2C91" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6A2C91" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter', fontWeight: 500 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter', fontWeight: 500 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#fff', fontFamily: 'Inter', fontWeight: 600, fontSize: '14px' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}
                    cursor={{ stroke: '#6A2C91', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="val" stroke="#6A2C91" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
          </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="luxury-card bg-[#1A1A1A] p-4 sm:p-12 rounded-[3rem] relative overflow-hidden flex flex-col justify-between group shadow-2xl shadow-purple-900/10"
        >
          <div className="absolute top-0 right-0 w-full sm:w-64 h-[180px] sm:h-64 bg-gradient-to-br from-[#6A2C91]/20 to-transparent rounded-bl-full opacity-30 -mr-16 -mt-8 sm:mt-12 lg:mt-16"></div>
          <div>
              <div className="flex items-center gap-5 mb-10 relative z-10">
                <GlassHaloIcon icon={Zap} color="gold" size="lg" className="group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">Synaptic Insights</h3>
              </div>
              <div className="space-y-10 relative z-10">
                <div className="group/item">
                    <p className="text-[10px] font-sans font-bold text-stone-500 uppercase tracking-[0.3em] mb-4">Inventory Protocol</p>
                    <p className="text-sm sm:text-base text-white sm:text-slate-400 leading-relaxed text-stone-300 font-sans font-light leading-relaxed border-l-2 border-[#C5A059] pl-6 group-hover/item:border-white transition-all duration-500">Reorder <strong className="text-white font-medium">Lavender Oil</strong> by Tuesday to prevent supply chain disruption.</p>
                </div>
                <div className="group/item">
                    <p className="text-[10px] font-sans font-bold text-stone-500 uppercase tracking-[0.3em] mb-4">Margin Strategy</p>
                    <p className="text-sm sm:text-base text-white sm:text-slate-400 leading-relaxed text-stone-300 font-sans font-light leading-relaxed border-l-2 border-[#6A2C91] pl-6 group-hover/item:border-white transition-all duration-500">Overall manufacturing margins increased by <strong className="text-white font-medium">4.2%</strong> this audit cycle.</p>
                </div>
              </div>
          </div>
          <button onClick={() => navigate('/forecasting')} className="w-full mt-6 sm:mt-8 lg:mt-12 py-6 border border-white/10 rounded-full hover:bg-white/5 text-white font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all relative z-10 flex items-center justify-center gap-3 sm:gap-4 group/btn overflow-hidden">
            <span className="relative z-10">View Strategic Forecast</span>
            <ArrowRight size={16} className="relative z-10 group-hover/btn:translate-x-2 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const MainNodePortal = ({ title, path, icon, color, shadow, delay, iconColor }: any) => {
  const navigate = useNavigate();
  return (
      <motion.button
          onClick={() => navigate(path)}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay, duration: 0.6, type: 'spring', stiffness: 100 }}
          className={`relative group h-[180px] sm:h-64 rounded-[3rem] p-1 overflow-hidden shadow-2xl ${shadow}`}
      >
          {/* Glass edge layer */}
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-white/20 to-transparent p-[1px]">
              <div className="absolute inset-0 rounded-[3rem] bg-black/60 backdrop-blur-2xl h-full w-full"></div>
          </div>
          
          {/* Core glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-40 group-hover:opacity-80 transition-opacity duration-700 blur-2xl`}></div>
          
          {/* Inner Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-3.5 sm:p-6 lg:p-12 border border-white/10 rounded-[3rem] bg-black/40 shadow-inner overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              
              <div className="mb-6 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] grayscale-0 group-hover:scale-125 transition-transform duration-700 ease-out">
                  <GlassHaloIcon icon={icon} color={iconColor} size="lg" className="w-12 h-12 sm:w-20 sm:h-20 [&>svg]:w-10 [&>svg]:h-10" />
              </div>
              
              <h3 className="text-lg sm:text-2xl lg:text-3xl text-white sm:text-slate-400 leading-relaxed font-serif text-white font-bold tracking-tight text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-white transition-colors">
                  {title}
              </h3>
              
              <div className="mt-6 flex items-center gap-2 text-[9px] font-sans font-black text-white sm:text-white/40 uppercase tracking-[0.3em] group-hover:text-white/80 transition-colors">
                  Initialize <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
              </div>
          </div>
      </motion.button>
  );
};
