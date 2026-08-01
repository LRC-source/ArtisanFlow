import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Input, Select, VaultBanner } from './UI';
import { TrendingUp, ArrowUpRight, DollarSign, Lock, RefreshCw, BarChart3, Upload, Plus, Trash2, AlertCircle, ArrowLeft, Crown, Sparkles, ChevronRight, History as HistoryIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useArtisanData } from './DataContext';
import { SubPageHeader } from './SubPageHeader';

// Fallback Mock Data if no operations exist
const ANALYTICS_DATA = [
    { name: 'Nov 17', val: 0 }, { name: 'Nov 21', val: 0 }, { name: 'Nov 25', val: 0 },
    { name: 'Nov 29', val: 0 }, { name: 'Dec 3', val: 0 }, { name: 'Dec 9', val: 0 },
    { name: 'Dec 14', val: 0 }
];

export const Forecasting = () => {
    const navigate = useNavigate();
    const { orders, inventory } = useArtisanData();

    let totalUnits = 0;
    orders.forEach(o => {
        if (o.items) {
            o.items.forEach(i => {
                totalUnits += i.qty || 0;
            });
        }
    });

    const activeUnits = totalUnits > 0 ? totalUnits : 640;
    const averageUnitsPerInterval = Math.round(activeUnits / 4);

    const averageMaterialCost = inventory.length > 0
        ? inventory.reduce((sum, item) => sum + (item.unitCost || 0), 0) / inventory.length
        : 14.50;

    const [aiScenario, setAiScenario] = React.useState('Baseline');

    const forecastData = Array.from({ length: 6 }).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + (index * 15));
        const name = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        let growthFactor = 1 + (index * 0.05);
        if (aiScenario === 'Aggressive') growthFactor += (index * 0.15);
        if (aiScenario === 'Conservative') growthFactor -= (index * 0.02);
        
        const projectedSold = Math.round(averageUnitsPerInterval * growthFactor);
        const projectedCost = Math.round(projectedSold * averageMaterialCost * 2.2);

        return {
            name,
            sold: projectedSold,
            cost: projectedCost
        };
    });

    const procurementSuggestions = [
        { item: 'Rosemary Extract', required: '240 oz', current: '50 oz', shortfall: '190 oz', cost: '$180.50' },
        { item: 'Glass Vials (50ml)', required: '500 units', current: '120 units', shortfall: '380 units', cost: '$342.00' },
        { item: 'Beeswax Blocks', required: '100 lbs', current: '80 lbs', shortfall: '20 lbs', cost: '$65.00' }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12 pb-24 max-w-[1600px] mx-auto p-8 md:p-16"
        >
             <SubPageHeader 
                title="Forecasting & Strategy"
                parentTitle="Operations"
                onBack={() => navigate(-1)}
                description="Establish predictive demand nodes and optimize manufacturing flow."
             />

             <VaultBanner 
                title="Forecasting Matrix"
                subtitle="Predictive logic engines activated. Reconciling historical data with future demand spikes."
                badge="Strategy Node Active"
             >
                <div className="flex gap-4">
                     <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 rounded-full px-10 shadow-2xl shadow-[#6A2C91]/20 transition-all font-sans font-medium text-[11px] tracking-[0.2em] uppercase" onClick={() => navigate('/forecasting')}>
                        <Plus size={16} className="mr-3" /> Initialize New Forecast
                     </Button>
                </div>
             </VaultBanner>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.2, duration: 0.6 }}
                 >
                     <Card className="luxury-card min-h-[400px] p-10 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]">
                         <h3 className="text-2xl font-serif text-white font-bold mb-8">Order Velocity Nodes</h3>
                         <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                             <Badge color="purple" className="rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50">30D Node</Badge>
                             <Badge color="gold" className="rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase shadow-sm border-[#C5A059]/20 text-[#C5A059]">90D Node</Badge>
                             <Badge color="purple" className="rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50">180D Node</Badge>
                             <Badge color="purple" className="rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50">Annual Cycle</Badge>
                         </div>
                         <div className="h-72">
                             <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={forecastData}>
                                     <defs>
                                         <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                                             <stop offset="5%" stopColor="#6A2C91" stopOpacity={0.4}/><stop offset="95%" stopColor="#6A2C91" stopOpacity={0}/>
                                         </linearGradient>
                                     </defs>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
                                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontWeight: 500}} dy={10}/>
                                     <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', fontFamily: 'Inter', fontSize: '12px', color: '#fff' }} 
                                     />
                                     <Area type="monotone" dataKey="sold" stroke="#6A2C91" fillOpacity={1} fill="url(#colorSold)" strokeWidth={2} />
                                 </AreaChart>
                             </ResponsiveContainer>
                         </div>
                     </Card>
                 </motion.div>

                 <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.3, duration: 0.6 }}
                 >
                     <Card className="luxury-card min-h-[400px] p-10 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]">
                         <div className="flex justify-between items-center mb-8">
                             <h3 className="text-2xl font-serif text-white font-bold">Raw Material Burn Rate</h3>
                             <div className="flex gap-2 bg-white/5 p-1.5 rounded-full border border-white/10">
                                 {['Baseline', 'Aggressive', 'Conservative'].map(sc => (
                                     <button 
                                         key={sc}
                                         onClick={() => setAiScenario(sc)}
                                         className={`px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${
                                             aiScenario === sc ? 'bg-[#C5A059] text-white shadow-lg shadow-amber-500/20' : 'text-white/40 hover:text-white/80'
                                         }`}
                                     >
                                         {sc}
                                     </button>
                                 ))}
                             </div>
                         </div>
                         <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                             <Badge color="purple" className="rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50">30D Node</Badge>
                             <Badge color="gold" className="rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase shadow-sm border-[#C5A059]/20 text-[#C5A059]">90D Node</Badge>
                             <Badge color="purple" className="rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50">180D Node</Badge>
                             <Badge color="purple" className="rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50">Annual Cycle</Badge>
                         </div>
                         <div className="h-72">
                             <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={forecastData}>
                                     <defs>
                                         <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                             <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/><stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                                         </linearGradient>
                                     </defs>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
                                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontWeight: 500}} dy={10}/>
                                     <Tooltip 
                                        formatter={(value) => `$${value}`} 
                                        contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', fontFamily: 'Inter', fontSize: '12px', color: '#fff' }}
                                     />
                                     <Area type="monotone" dataKey="cost" stroke="#C5A059" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} />
                                 </AreaChart>
                             </ResponsiveContainer>
                         </div>
                     </Card>
                 </motion.div>
             </div>

             {/* Material Procurement Suggestions */}
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.35, duration: 0.6 }}
             >
                 <Card className="luxury-card p-12 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]">
                     <h3 className="text-3xl font-serif text-white font-bold mb-10">Predicted Shortfalls & Procurement</h3>
                     <div className="overflow-x-auto">
                         <table className="w-full text-left border-collapse">
                             <thead>
                                 <tr className="border-b border-white/10 text-[10px] font-sans font-bold text-white/50 uppercase tracking-[0.3em]">
                                     <th className="pb-6 pl-4">Material Node</th>
                                     <th className="pb-6">Required (90D)</th>
                                     <th className="pb-6">Current Stock</th>
                                     <th className="pb-6 text-amber-500">Projected Shortfall</th>
                                     <th className="pb-6">Est. Cost</th>
                                     <th className="pb-6 text-right pr-4">Action</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {procurementSuggestions.map((item, idx) => (
                                     <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                         <td className="py-6 pl-4 font-serif text-white text-lg tracking-tight group-hover:text-[#C5A059] transition-colors">{item.item}</td>
                                         <td className="py-6 text-white/70 font-medium">{item.required}</td>
                                         <td className="py-6 text-white/70 font-medium">{item.current}</td>
                                         <td className="py-6 text-amber-500 font-bold">{item.shortfall}</td>
                                         <td className="py-6 text-emerald-400 font-bold">{item.cost}</td>
                                         <td className="py-6 text-right pr-4">
                                             <Button className="h-10 bg-white/10 hover:bg-[#6A2C91] text-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-6 transition-colors">Order Now</Button>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 </Card>
             </motion.div>

             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4, duration: 0.6 }}
             >
                 <Card className="luxury-card p-12 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]">
                     <h3 className="text-3xl font-serif text-white font-bold mb-10">Synaptic Alignment Matrix</h3>
                     <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={forecastData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontWeight: 500}} dy={10}/>
                                 <Tooltip 
                                     contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', fontFamily: 'Inter', fontSize: '12px', color: '#fff' }}
                                 />
                                 <Line type="monotone" dataKey="sold" stroke="#6A2C91" strokeWidth={3} dot={{r:4, fill:'#6A2C91', strokeWidth: 0}} activeDot={{r: 6}} />
                                 <Line type="monotone" dataKey="cost" stroke="#C5A059" strokeWidth={3} dot={{r:4, fill:'#C5A059', strokeWidth: 0}} activeDot={{r: 6}} />
                             </LineChart>
                          </ResponsiveContainer>
                     </div>
                     <div className="flex flex-wrap justify-center gap-10 mt-12 text-[10px] font-sans font-bold text-white/50 uppercase tracking-widest">
                         <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-[#6A2C91] shadow-[0_0_8px_#6A2C91]"></div> Order Velocity</span>
                         <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]"></div> Revenue Handshake</span>
                         <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]"></div> Material Burden</span>
                     </div>
                 </Card>
             </motion.div>

             <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5, duration: 0.6 }}
                 className="space-y-8"
             >
                <h3 className="text-3xl font-serif text-white font-bold flex items-center gap-4">
                    <div className="p-3 bg-[#C5A059]/10 rounded-xl"><HistoryIcon className="text-[#C5A059]" size={24} /></div> Historical Synthesis
                </h3>
                <div className="bg-black/40 backdrop-blur-xl rounded-[3rem] p-10 border border-white/5 shadow-2xl group hover:border-[#C5A059]/30 hover:bg-black/60 transition-all duration-500 cursor-pointer flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-[#C5A059] group-hover:opacity-[0.05] transition-opacity"><RefreshCw size={120} className="animate-spin-slow"/></div>
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#6A2C91] shadow-inner group-hover:scale-105 group-hover:bg-white/10 transition-all duration-700">
                            <RefreshCw size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <h4 className="text-2xl font-serif text-white tracking-tight group-hover:text-[#C5A059] transition-colors">Active Projection: Q4 Protocol</h4>
                                <Badge color="gold" className="text-[9px] px-3 py-1 shadow-sm font-sans tracking-widest uppercase border-[#C5A059]/20">Needs Review</Badge>
                            </div>
                            <p className="text-[11px] text-white/50 font-sans uppercase tracking-[0.2em]">Units Needed: <span className="text-white/90">110</span> • Created: Nov 25, 2025</p>
                        </div>
                    </div>
                    <div className="text-right relative z-10 w-full md:w-auto flex items-center gap-8 border-t border-white/5 md:border-0 pt-6 md:pt-0">
                         <div className="flex flex-col items-center md:items-end">
                             <p className="text-[10px] font-sans font-bold text-white/30 uppercase tracking-[0.3em] mb-2">Projected Settlement</p>
                             <p className="text-4xl font-serif text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(52,211,153,0.2)]">$1,976.70</p>
                         </div>
                         <div className="p-4 bg-white/5 text-white/30 rounded-2xl shadow-inner border border-white/5 group-hover:text-[#C5A059] group-hover:bg-white/10 transition-colors">
                            <ChevronRight size={24} />
                         </div>
                    </div>
                </div>
             </motion.div>
        </motion.div>
    );
};