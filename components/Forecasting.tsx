import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Input, Select } from './UI';
import { TrendingUp, ArrowUpRight, DollarSign, Lock, RefreshCw, BarChart3, Upload, Plus, Trash2, AlertCircle, ArrowLeft, Crown, Sparkles, ChevronRight, History as HistoryIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const ANALYTICS_DATA = [
    { name: 'Nov 17', val: 0 }, { name: 'Nov 21', val: 0 }, { name: 'Nov 25', val: 0 },
    { name: 'Nov 29', val: 0 }, { name: 'Dec 3', val: 0 }, { name: 'Dec 9', val: 0 },
    { name: 'Dec 14', val: 0 }
];

const FORECAST_DATA = [
  { name: 'Oct 1', sold: 98, cost: 1400 },
  { name: 'Oct 15', sold: 112, cost: 1600 },
  { name: 'Nov 1', sold: 95, cost: 1350 },
  { name: 'Nov 15', sold: 135, cost: 2100 },
  { name: 'Dec 1', sold: 102, cost: 1500 },
  { name: 'Dec 15', sold: 90, cost: 1200 },
];

export const Forecasting = () => {
    const navigate = useNavigate();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12 pb-24 max-w-7xl mx-auto p-8"
        >
             <div className="flex flex-col gap-2">
                 <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-400 hover:text-[#6A2C91] mb-6 font-sans text-xs uppercase tracking-widest transition-colors w-fit">
                   <ArrowLeft size={16} /> Back
                 </button>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div>
                          <div className="flex items-center gap-3">
                              <h1 className="text-4xl font-serif text-white font-bold tracking-tight">Forecasting & Strategy</h1>
                              <Badge color="gold">Beta</Badge>
                          </div>
                          <p className="text-stone-500 font-sans font-light mt-2 text-lg">Establish predictive demand nodes and optimize manufacturing flow.</p>
                     </div>
                     <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white h-14 rounded-full px-8 shadow-md transition-all font-sans font-medium text-sm tracking-wide" onClick={() => navigate('/forecasting')}>
                        <Plus size={18} className="mr-2" /> Initialize New Forecast
                     </Button>
                 </div>
             </div>

             {/* Charts Row 1 */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                 >
                     <Card className="luxury-card min-h-[400px] p-8">
                         <h3 className="text-xl font-serif text-white font-bold mb-8">Order Velocity Nodes</h3>
                         <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                             <Badge color="gray" className="rounded-full px-4 py-1.5 font-sans text-[10px] tracking-widest uppercase">30D Node</Badge>
                             <Badge color="gold" className="rounded-full px-4 py-1.5 font-sans text-[10px] tracking-widest uppercase shadow-sm">90D Node</Badge>
                             <Badge color="gray" className="rounded-full px-4 py-1.5 font-sans text-[10px] tracking-widest uppercase">180D Node</Badge>
                             <Badge color="gray" className="rounded-full px-4 py-1.5 font-sans text-[10px] tracking-widest uppercase">Annual Cycle</Badge>
                         </div>
                         <div className="h-72">
                             <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={FORECAST_DATA}>
                                     <defs>
                                         <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                                             <stop offset="5%" stopColor="#6A2C91" stopOpacity={0.2}/><stop offset="95%" stopColor="#6A2C91" stopOpacity={0}/>
                                         </linearGradient>
                                     </defs>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5"/>
                                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 11, fill: '#78716C', fontWeight: 500}} dy={10}/>
                                     <Tooltip 
                                        contentStyle={{ borderRadius: '1rem', border: '1px solid #E5E5E5', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontFamily: 'Inter', fontSize: '12px' }} 
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
                     transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                 >
                     <Card className="luxury-card min-h-[400px] p-8">
                         <h3 className="text-xl font-serif text-white font-bold mb-8">Raw Material Burn Rate</h3>
                         <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                             <Badge color="gray" className="rounded-full px-4 py-1.5 font-sans text-[10px] tracking-widest uppercase">30D Node</Badge>
                             <Badge color="gold" className="rounded-full px-4 py-1.5 font-sans text-[10px] tracking-widest uppercase shadow-sm">90D Node</Badge>
                             <Badge color="gray" className="rounded-full px-4 py-1.5 font-sans text-[10px] tracking-widest uppercase">180D Node</Badge>
                             <Badge color="gray" className="rounded-full px-4 py-1.5 font-sans text-[10px] tracking-widest uppercase">Annual Cycle</Badge>
                         </div>
                         <div className="h-72">
                             <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={FORECAST_DATA}>
                                     <defs>
                                         <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                             <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2}/><stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                                         </linearGradient>
                                     </defs>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5"/>
                                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 11, fill: '#78716C', fontWeight: 500}} dy={10}/>
                                     <Tooltip 
                                        formatter={(value) => `$${value}`} 
                                        contentStyle={{ borderRadius: '1rem', border: '1px solid #E5E5E5', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontFamily: 'Inter', fontSize: '12px' }}
                                     />
                                     <Area type="monotone" dataKey="cost" stroke="#C5A059" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} />
                                 </AreaChart>
                             </ResponsiveContainer>
                         </div>
                     </Card>
                 </motion.div>
             </div>

             {/* Combined Overview */}
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
             >
                 <Card className="luxury-card p-10">
                     <h3 className="text-2xl font-serif text-white font-bold mb-8">Synaptic Alignment Matrix</h3>
                     <div className="h-96 mt-6">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={FORECAST_DATA}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5"/>
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 11, fill: '#78716C', fontWeight: 500}} dy={10}/>
                                 <Tooltip 
                                     contentStyle={{ borderRadius: '1rem', border: '1px solid #E5E5E5', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontFamily: 'Inter', fontSize: '12px' }}
                                 />
                                 <Line type="monotone" dataKey="sold" stroke="#6A2C91" strokeWidth={3} dot={{r:4, fill:'#6A2C91', strokeWidth: 0}} activeDot={{r: 6}} />
                                 <Line type="monotone" dataKey="cost" stroke="#C5A059" strokeWidth={3} dot={{r:4, fill:'#C5A059', strokeWidth: 0}} activeDot={{r: 6}} />
                             </LineChart>
                          </ResponsiveContainer>
                     </div>
                     <div className="flex flex-wrap justify-center gap-10 mt-12 text-xs font-sans font-medium text-stone-500 uppercase tracking-widest">
                         <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-[#6A2C91] shadow-sm"></div> Order Velocity</span>
                         <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-sm"></div> Revenue Handshake</span>
                         <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-[#C5A059] shadow-sm"></div> Material Burden</span>
                     </div>
                 </Card>
             </motion.div>

             {/* Recent Forecasts */}
             <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                 className="space-y-8"
             >
                <h3 className="text-2xl font-serif text-white font-bold flex items-center gap-3">
                    <HistoryIcon className="text-[#C5A059]" size={24} /> Historical Synthesis
                </h3>
                <div className="bg-stone-50/50 rounded-[2rem] p-8 border border-stone-100 shadow-sm group hover:bg-white hover:shadow-md transition-all duration-500 cursor-pointer flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-stone-900 group-hover:opacity-[0.05] transition-opacity"><RefreshCw size={120} className="animate-spin-slow"/></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#6A2C91] shadow-sm group-hover:scale-105 transition-transform">
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <h4 className="text-xl font-serif text-white font-bold tracking-tight">Active Projection: Q4 Protocol</h4>
                                <Badge color="gold" className="text-[10px] px-3 py-1 shadow-sm font-sans tracking-widest uppercase">Needs Review</Badge>
                            </div>
                            <p className="text-sm text-stone-500 font-sans font-light">Units Needed: <span className="text-stone-900 font-medium">110</span> • Created: Nov 25, 2025</p>
                        </div>
                    </div>
                    <div className="text-right relative z-10 w-full md:w-auto flex items-center gap-8 border-t md:border-0 pt-6 md:pt-0 border-stone-200/50">
                         <div className="flex flex-col items-center md:items-end">
                             <p className="text-xs font-sans text-stone-400 uppercase tracking-widest mb-1">Projected Settlement</p>
                             <p className="text-3xl font-serif text-stone-900 tracking-tight">$1,976.70</p>
                         </div>
                         <div className="p-3 bg-white text-stone-400 rounded-full shadow-sm group-hover:text-[#6A2C91] transition-colors">
                            <ChevronRight size={20} />
                         </div>
                    </div>
                </div>
             </motion.div>
        </motion.div>
    );
};

export const ForecastGenerator = () => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col pb-32 max-w-7xl mx-auto p-8"
    >
        <div className="mb-10">
            <button onClick={() => window.history.back()} className="flex items-center gap-2 text-stone-400 hover:text-[#6A2C91] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
              <ArrowLeft size={16} /> Back to Hub
            </button>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full md:w-1/2">
                <div className="luxury-card bg-white p-12 text-center relative overflow-hidden group">
                    <div className="absolute top-8 right-8">
                        <Badge color="purple" className="px-4 py-1.5 shadow-sm font-sans tracking-widest uppercase text-[10px]">Premium Protocol</Badge>
                    </div>
                    <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8 text-[#C5A059] shadow-sm group-hover:scale-105 transition-transform duration-700">
                        <Crown size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-serif text-white font-bold mb-4 tracking-tight flex items-center justify-center gap-3">
                        <Lock size={24} className="text-[#6A2C91]" /> AI Forecasting
                    </h2>
                    <p className="text-stone-500 mb-12 max-w-lg mx-auto font-sans font-light text-lg leading-relaxed">
                        Authorize the Flow Architect protocol to activate 90-day predictive demand planning.
                    </p>

                    <div className="bg-stone-50/50 rounded-3xl p-10 mb-12 text-left border border-stone-100 shadow-sm group-hover:bg-white transition-all">
                        <h4 className="text-xs font-sans text-white font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                           <RefreshCw size={16} className="text-[#6A2C91] animate-spin-slow"/> Protocol Capabilities
                        </h4>
                        <ul className="space-y-6">
                            {['90-Day AI Demand Synthesizer', 'Dynamic Safety Stock Logic', 'Real-Time Margin Integrity Protection', 'Optimal Sourcing Timeline', 'Risk Anomaly Detection'].map(item => (
                                <li key={item} className="flex items-center gap-4 text-sm font-sans font-medium text-stone-700 group/li">
                                    <div className="w-6 h-6 rounded-full bg-purple-50 text-[#6A2C91] flex items-center justify-center text-[10px] shadow-sm group-hover/li:bg-[#6A2C91] group-hover/li:text-white transition-all">✓</div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-stone-900 rounded-3xl p-8 flex items-center justify-between mb-10 shadow-lg">
                        <div className="text-left">
                            <p className="text-[10px] font-sans text-stone-400 uppercase tracking-widest mb-1">Subscription Matrix</p>
                            <p className="text-3xl font-serif text-white tracking-tight">$99<span className="text-sm font-sans font-light text-stone-400 ml-1">/mo</span></p>
                        </div>
                        <Badge color="gold" className="px-4 py-1.5 shadow-sm font-sans tracking-widest uppercase text-[10px]">7-Day Free Trial Node</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Button className="h-14 rounded-full bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-medium text-xs tracking-wide shadow-md transition-all">Initialize Trial Node</Button>
                        <Button variant="outline" className="h-14 rounded-full border-stone-200 text-stone-600 font-sans font-medium text-xs tracking-wide hover:bg-stone-50 transition-colors">View Matrices</Button>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-8 font-sans uppercase tracking-widest">No settlement info required for trial initialization.</p>
                </div>
            </div>
        </div>
    </motion.div>
);

export const ReorderSuggestions = () => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col pb-32 max-w-7xl mx-auto p-8"
    >
        <div className="mb-10">
            <button onClick={() => window.history.back()} className="flex items-center gap-2 text-stone-400 hover:text-[#6A2C91] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
              <ArrowLeft size={16} /> Back to Hub
            </button>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full md:w-1/2">
                <div className="luxury-card bg-white p-12 text-center relative overflow-hidden group">
                     <div className="absolute top-8 right-8">
                        <Badge color="purple" className="px-4 py-1.5 shadow-sm font-sans tracking-widest uppercase text-[10px]">Architecture Protocol</Badge>
                    </div>
                     <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8 text-[#C5A059] shadow-sm group-hover:scale-105 transition-transform duration-700">
                        <Crown size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-serif text-white font-bold mb-4 tracking-tight flex items-center justify-center gap-3">
                        <Lock size={24} className="text-[#6A2C91]" /> Reorder Optimization
                    </h2>
                    <p className="text-stone-500 mb-12 max-w-lg mx-auto font-sans font-light text-lg leading-relaxed">
                        Activate intelligent sourcing protocols to reconcile inventory burn with supplier lead times.
                    </p>
                     <div className="bg-stone-50/50 rounded-3xl p-10 mb-12 text-left border border-stone-100 shadow-sm group-hover:bg-white transition-all">
                        <h4 className="text-xs font-sans text-white font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                           <Sparkles size={16} className="text-[#C5A059] animate-pulse"/> Optimization Nodes
                        </h4>
                        <ul className="space-y-6">
                            {['Automated Reorder Synthesis', 'Supplier Comparative Analysis', 'Bulk Discount Optimization Logic', 'Lead Time Burn Rate Analytics', 'Global Sourcing Risk Assessment'].map(item => (
                                <li key={item} className="flex items-center gap-4 text-sm font-sans font-medium text-stone-700 group/li">
                                    <div className="w-6 h-6 rounded-full bg-purple-50 text-[#6A2C91] flex items-center justify-center text-[10px] shadow-sm group-hover/li:bg-[#6A2C91] group-hover/li:text-white transition-all">✓</div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-stone-900 rounded-3xl p-8 flex items-center justify-between mb-10 shadow-lg">
                        <div className="text-left">
                            <p className="text-[10px] font-sans text-stone-400 uppercase tracking-widest mb-1">Subscription Matrix</p>
                            <p className="text-3xl font-serif text-white tracking-tight">$99<span className="text-sm font-sans font-light text-stone-400 ml-1">/mo</span></p>
                        </div>
                        <Badge color="gold" className="px-4 py-1.5 shadow-sm font-sans tracking-widest uppercase text-[10px]">7-Day Free Trial Node</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Button className="h-14 rounded-full bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-medium text-xs tracking-wide shadow-md transition-all">Establish Secure Handshake</Button>
                        <Button variant="outline" className="h-14 rounded-full border-stone-200 text-stone-600 font-sans font-medium text-xs tracking-wide hover:bg-stone-50 transition-colors">Analyze Plan</Button>
                    </div>
                     <p className="text-[10px] text-stone-400 mt-8 font-sans uppercase tracking-widest">No settlement info required for protocol initialization.</p>
                </div>
            </div>
        </div>
    </motion.div>
);