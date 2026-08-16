import React, { useState } from 'react';
import { Activity, Layers, Truck, CheckCircle, ClipboardList, Package, ShieldCheck, DollarSign, Calculator, AlertTriangle, Crown, Search, TrendingUp } from 'lucide-react';
import { Card, Input, Button, Badge, LockedNode } from './UI';
import { GlassHaloIcon } from './ui/GlassHaloIcon';
import { useArtisanData } from './DataContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const MarginGuard = () => {
    const { userTier } = useArtisanData();
    const [materialCost, setMaterialCost] = useState<number>(150);
    const [units, setUnits] = useState<number>(50);
    const [plannedPrice, setPlannedPrice] = useState<number>(6.60);

    const costPerUnit = units > 0 ? materialCost / units : 0;
    const recommendedPrice = costPerUnit * 2.2;
    const currentMultiplier = costPerUnit > 0 ? plannedPrice / costPerUnit : 0;
    const isWarning = currentMultiplier < 2.0;

    return (
        <div className="mb-16 p-[1.5px] rounded-[3rem] bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] relative shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <Card title="Margin Guard™ Protection" className="luxury-card shadow-2xl shadow-black/20 overflow-hidden relative rounded-[3rem] border-none bg-[#0A0A0A] backdrop-blur-3xl p-4 sm:p-10 w-full h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                <div className="space-y-10">
                    <div className={`p-8 rounded-[2rem] transition-all duration-700 border ${isWarning ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                        <label className="flex items-center gap-4 text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.3em] mb-6">
                            <DollarSign size={18} className={isWarning ? 'text-amber-500' : 'text-[#C5A059]'} strokeWidth={1.5} /> 
                            Material Cost
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-serif text-2xl">$</span>
                            <Input 
                                type="number" 
                                value={materialCost} 
                                onChange={(e) => setMaterialCost(Number(e.target.value))}
                                className={`font-serif text-3xl bg-white/5 border-white/10 rounded-2xl pl-10 pr-6 py-5 shadow-sm transition-all ${isWarning ? 'border-amber-500/50 focus:border-amber-500 focus:ring-amber-500/10' : 'focus:border-[#6A2C91] focus:ring-[#6A2C91]/10'}`}
                            />
                        </div>
                        {isWarning && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 flex items-center gap-3 py-3 px-4 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20"
                            >
                                <AlertTriangle size={16} strokeWidth={1.5} />
                                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Margin Warning Level</span>
                            </motion.div>
                        )}
                    </div>
                    <div className="p-4 sm:p-8">
                        <label className="block text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.3em] mb-6">Total Batch Units</label>
                        <Input 
                            type="number" 
                            value={units} 
                            onChange={(e) => setUnits(Number(e.target.value))}
                            className="font-serif text-3xl bg-white/5 border-white/10 rounded-2xl px-6 py-5 shadow-sm focus:border-[#6A2C91] focus:ring-[#6A2C91]/10 transition-all"
                            placeholder="e.g. 100"
                        />
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-4 sm:p-10 shadow-inner h-full flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#6A2C91] opacity-[0.03] rounded-bl-full -mr-12 -mt-12 group-hover:opacity-10 transition-opacity duration-1000"></div>
                    <div className="flex items-center gap-4 text-[#C5A059] mb-10 relative z-10">
                        <Calculator size={24} strokeWidth={1.2} />
                        <h4 className="font-sans font-bold text-[11px] uppercase tracking-[0.3em]">Wholesale Engine</h4>
                    </div>
                    <div className="space-y-8 relative z-10">
                        <div className="flex justify-between items-center border-b border-white/5 pb-6">
                            <span className="text-base font-sans font-light text-white/60">Unit Cost:</span>
                            <span className="font-serif text-2xl text-white tracking-tight">${costPerUnit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-6">
                            <span className="text-base font-sans font-light text-white/60">2.2x Target Price:</span>
                            <span className="font-serif text-2xl text-emerald-400 tracking-tight">${recommendedPrice.toFixed(2)}</span>
                        </div>
                        <div className="pt-6">
                            <label className="block text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.3em] mb-4">Proposed Wholesale Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-serif text-2xl">$</span>
                                <Input 
                                    type="number" 
                                    value={plannedPrice} 
                                    onChange={(e) => setPlannedPrice(Number(e.target.value))}
                                    className="font-serif text-3xl bg-white/5 border-white/10 rounded-2xl pl-10 pr-6 py-5 shadow-sm focus:border-[#6A2C91] focus:ring-[#6A2C91]/10 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-full flex flex-col">
                    <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => {}}>
                      <div className={`flex-1 rounded-[2.5rem] border border-transparent p-10 flex flex-col items-center justify-center text-center transition-all duration-1000 shadow-inner ${isWarning ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-lg transition-transform duration-700 hover:scale-110 ${isWarning ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                              {isWarning ? <AlertTriangle size={36} strokeWidth={1.2} /> : <ShieldCheck size={36} strokeWidth={1.2} />}
                          </div>
                          <h5 className={`font-serif text-3xl mb-3 tracking-tighter ${isWarning ? 'text-amber-500' : 'text-emerald-400'}`}>
                              {isWarning ? 'Low Margin' : 'Margin Secure'}
                          </h5>
                          <p className="text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] mb-8">Planned Profitability</p>
                          <Badge color={isWarning ? 'gold' : 'green'} className="text-[12px] font-sans font-bold px-8 py-3 uppercase tracking-[0.3em] rounded-full shadow-xl">
                              {currentMultiplier.toFixed(2)}x Markup
                          </Badge>
                      </div>
                      <div className="sticky bottom-4 z-50 md:static p-4 md:p-0 bg-[#0A0A0A]/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border border-white/10 md:border-none rounded-3xl md:rounded-none shadow-2xl md:shadow-none mt-10 w-full">
                          <Button onClick={() => toast.info('Accessing live production nodes...')} className="w-full bg-white text-black hover:bg-white/90 h-16 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/10 transition-all group overflow-hidden relative">
                              <span className="relative z-10">Commit To Production</span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          </Button>
                      </div>
                    </LockedNode>
                </div>
            </div>
        </Card>
        </div>
    );
};

export const Operations = () => {
  const { userTier } = useArtisanData();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-32"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:p-10">
        <div>
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="flex items-center gap-4 mb-6"
            >
                <Badge color="purple" className="px-5 py-2 shadow-sm font-sans font-bold tracking-[0.3em] uppercase text-[10px]">Operations Hub</Badge>
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-serif text-white tracking-tighter mb-6 leading-none">Command Center</h1>
            <p className="text-white/60 font-sans font-light text-xl max-w-2xl leading-relaxed">Precision management of production queues, proprietary formulas, and strategic supply nodes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:p-10">
          <HubNode icon={ClipboardList} title="Production Queue" desc="Real-time orchestration of active manufacturing batches and archival schedules." delay={0.3} />
          <HubNode icon={Package} title="Formula Manager" desc="High-precision BOM management and proprietary recipe encryption." delay={0.4} />
          
          <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => {}}>
             <HubNode icon={Crown} title="Strategic Intel" desc="AI-driven market positioning and competitor margin diagnostics." color="text-[#C5A059]" bg="bg-white/5" delay={0.5} />
          </LockedNode>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="p-4 sm:p-10 bg-emerald-500/5 border border-emerald-500/20 rounded-[3rem] flex items-center gap-4 sm:p-8"
      >
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
              <CheckCircle size={28} strokeWidth={1.2} />
          </div>
          <div>
              <h4 className="text-emerald-400 font-serif text-2xl tracking-tight mb-2">Omnichannel Sync Secure</h4>
              <p className="text-base font-sans font-light text-emerald-400/60">No bottlenecks detected in current workflow pipelines. Strategic nodes are synchronized.</p>
          </div>
      </motion.div>
    </motion.div>
  );
};

const HubNode = ({ icon: Icon, title, desc, color = "text-[#6A2C91]", bg = "bg-white/5", delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 1 }}
    className={`luxury-card ${bg} p-12 rounded-[3rem] hover:-translate-y-2 transition-all duration-700 cursor-pointer group flex flex-col h-full relative overflow-hidden shadow-2xl shadow-black/20`}
  >
      <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-[0.05] rounded-bl-full -mr-12 -mt-12 group-hover:opacity-10 transition-opacity duration-700"></div>
      <GlassHaloIcon icon={Icon} color="cyan" size="lg" className="w-20 h-20 group-hover:scale-110 transition-transform duration-700 mb-10 z-10 [&>svg]:w-8 [&>svg]:h-8" />
      <h3 className="text-3xl font-serif text-white mb-4 tracking-tight relative z-10 leading-none">{title}</h3>
      <p className="text-base text-white/50 font-sans font-light leading-relaxed relative z-10">{desc}</p>
  </motion.div>
);
