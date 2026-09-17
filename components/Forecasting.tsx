import React from 'react';
import { ContextualTutorialModal } from './ContextualTutorialModal';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Select, Modal, DashboardBanner } from './UI';
import { toast } from 'sonner';
import { RefreshCw, AlertCircle, ChevronRight, History as HistoryIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { useArtisanData } from './DataContext';
import { SubPageHeader } from './SubPageHeader';
import { GlassHaloIcon } from './ui/GlassHaloIcon';

export const Forecasting = () => {
    const navigate = useNavigate();
    const { orders, inventory } = useArtisanData();

    const hasInventory = inventory.length > 0;
    const hasOrders = orders.length > 0;

    let totalUnits = 0;
    orders.forEach(o => {
        if (o.items) {
            o.items.forEach(i => {
                totalUnits += i.qty || 0;
            });
        }
    });

    // Only use real data — no fake fallbacks
    const averageUnitsPerInterval = hasOrders ? Math.round(totalUnits / 4) : 0;

    const averageMaterialCost = hasInventory
        ? inventory.reduce((sum, item) => sum + (item.unitCost || 0), 0) / inventory.length
        : 0;

    const [aiScenario, setAiScenario] = React.useState('Baseline');
    const [showForecastModal, setShowForecastModal] = React.useState(false);

    const forecastData = Array.from({ length: 6 }).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + (index * 15));
        const name = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        let growthFactor = 1 + (index * 0.05);
        if (aiScenario === 'Aggressive') growthFactor += (index * 0.15);
        if (aiScenario === 'Conservative') growthFactor -= (index * 0.02);
        
        const projectedSold = Math.round(averageUnitsPerInterval * growthFactor);
        const projectedCost = Math.round(projectedSold * averageMaterialCost * 2.2);

        return { name, sold: projectedSold, cost: projectedCost };
    });

    const procurementSuggestions = (inventory || [])
        .filter(item => (item.quantity || 0) <= (item.minThreshold || 5))
        .map(item => {
            const required = (item.minThreshold || 5) * 2;
            const current = item.quantity || 0;
            const shortfall = Math.max(0, required - current);
            const cost = shortfall * (item.unitCost || 0);
            return {
                item: item.name,
                required,
                current,
                shortfall,
                cost: `$${cost.toFixed(2)}`
            };
        });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-8 pb-16"
        >
            <ContextualTutorialModal pageKey="forecasting" title="Forecasting & Inventory Projections" />
            <SubPageHeader
                title="Predictive Forecasting Hub"
                subtitle="Project material demands, order velocity, and production bottlenecks in real-time."
                actionText="INITIALIZE NEW FORECAST"
                onAction={() => setShowForecastModal(true)}
            />
            <DashboardBanner
                title="Material & Demand Forecasting"
                subtitle="Simulate inventory depletion scenarios based on historical sales velocity."
            />

            {/* Modal for Initialize New Forecast */}
            <Modal
                isOpen={showForecastModal}
                onClose={() => setShowForecastModal(false)}
                title="Initialize New Forecast Model"
            >
                <div className="space-y-6">
                    <p className="text-white/70 text-sm">
                        Select your forecasting parameters to simulate material requirement planning across custom sales horizons.
                    </p>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Scenario Model</label>
                        <Select
                            value={aiScenario}
                            onChange={(e) => setAiScenario(e.target.value)}
                            options={[
                                { value: 'Baseline', label: 'Baseline Growth (5%/period)' },
                                { value: 'Aggressive', label: 'Aggressive Scale (20%/period)' },
                                { value: 'Conservative', label: 'Conservative Preservation (3%/period)' },
                            ]}
                        />
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                        <div className="text-xs text-white/50 uppercase tracking-widest font-bold">Active Inventory items</div>
                        <div className="text-lg font-bold text-white">{inventory.length} raw materials trackable</div>
                        <div className="text-xs text-[#C5A059] font-medium">
                            {hasOrders ? `Averaging ${averageUnitsPerInterval} units projected per cycle.` : 'No historical orders detected. Run baseline model.'}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <Button onClick={() => setShowForecastModal(false)} variant="secondary">Cancel</Button>
                        <Button
                            onClick={() => {
                                setShowForecastModal(false);
                                toast.success(`Forecast model set to ${aiScenario}`);
                            }}
                            className="bg-[#6A2C91] text-white hover:bg-[#5a257a]"
                        >
                            Apply Model
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Top Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2rem]">
                    <div className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1">Projected Demand</div>
                    <div className="text-3xl font-bold text-white">{averageUnitsPerInterval * 6} units</div>
                    <div className="text-xs text-purple-400 mt-2">Next 90-day cycle</div>
                </Card>
                <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2rem]">
                    <div className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1">Estimated Material Cost</div>
                    <div className="text-3xl font-bold text-[#C5A059]">${(averageUnitsPerInterval * 6 * averageMaterialCost * 2.2).toFixed(2)}</div>
                    <div className="text-xs text-amber-400/70 mt-2">Required raw inventory</div>
                </Card>
                <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2rem]">
                    <div className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1">Shortfall Risk</div>
                    <div className="text-3xl font-bold text-emerald-400">{procurementSuggestions.length} items</div>
                    <div className="text-xs text-white/40 mt-2">Below reorder threshold</div>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <Card className="luxury-card min-h-[250px] sm:min-h-[300px] w-full max-w-full overflow-hidden p-3.5 sm:p-6 lg:p-12 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                            <h3 className="text-lg sm:text-2xl lg:text-3xl text-white mb-4 font-display font-medium uppercase tracking-widest">Projected Sales Volume</h3>
                            <Badge color="purple">{aiScenario} Model</Badge>
                        </div>
                        <div className="h-[220px] sm:h-[320px] lg:h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={forecastData}>
                                    <defs>
                                        <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6A2C91" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#6A2C91" stopOpacity={0}/>
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
                    <Card className="luxury-card min-h-[250px] sm:min-h-[300px] w-full max-w-full overflow-hidden p-3.5 sm:p-6 lg:p-12 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                            <h3 className="text-lg sm:text-2xl lg:text-3xl text-white mb-4 font-display font-medium uppercase tracking-widest">Raw Material Burn Rate</h3>
                            <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 sm:p-2 rounded-[1rem] sm:rounded-full border border-white/10">
                                {['Baseline', 'Aggressive', 'Conservative'].map(sc => (
                                    <button 
                                        key={sc}
                                        onClick={() => setAiScenario(sc)}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${
                                            aiScenario === sc ? 'bg-[#C5A059] text-white shadow-lg shadow-amber-500/20' : 'text-white sm:text-white/40 hover:text-white/80'
                                        }`}
                                    >
                                        {sc}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mb-6 sm:mb-10 text-white/40 font-sans text-[10px] tracking-widest uppercase">
                            <span>30 DAYS</span>
                            <span>&bull;</span>
                            <span>90 DAYS</span>
                            <span>&bull;</span>
                            <span>180 DAYS</span>
                            <span>&bull;</span>
                            <span>ANNUAL CYCLE</span>
                        </div>
                        <div className="h-[220px] sm:h-[320px] lg:h-[400px] w-full mt-4 sm:mt-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={forecastData}>
                                    <defs>
                                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
            >
                <Card className="luxury-card p-4 sm:p-8 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]">
                    <h3 className="text-lg sm:text-2xl lg:text-3xl text-white mb-4 font-display font-medium uppercase tracking-widest">Predicted Shortfalls &amp; Procurement</h3>
                    {!hasInventory ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                            <AlertCircle size={32} className="text-white/20" />
                            <p className="text-white/40 text-sm font-serif italic font-light">No inventory data yet.</p>
                            <p className="text-white/30 text-xs font-serif italic font-light">Add raw materials to Inventory Hub to enable shortfall forecasting.</p>
                            <Button onClick={() => navigate('/inventory')} className="mt-2 bg-[#6A2C91] hover:bg-[#5a257a] text-white rounded-full px-8 py-2 font-sans font-bold text-[10px] uppercase tracking-widest">Add Inventory</Button>
                        </div>
                    ) : procurementSuggestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <AlertCircle size={24} className="text-emerald-400" />
                            </div>
                            <p className="text-white/60 text-sm font-serif italic font-light">All raw materials are above reorder thresholds.</p>
                            <p className="text-white/30 text-xs font-serif italic font-light">No shortfalls predicted at this time. Check back as stock levels change.</p>
                        </div>
                    ) : (
                        <div className="w-full">
                            {/* Mobile View: Stacked Cards */}
                            <div className="block sm:hidden space-y-4">
                                {procurementSuggestions.map((item, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-white text-base font-bold font-sans">{item.item}</span>
                                            <span className="text-emerald-400 font-bold text-sm">{item.cost}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div><span className="text-white/50 block">Required</span><span className="text-white">{item.required}</span></div>
                                            <div><span className="text-white/50 block">In Stock</span><span className="text-white">{item.current}</span></div>
                                        </div>
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                                            <div className="text-amber-500 font-bold text-xs"><span className="text-white/50 block font-normal">Shortfall</span>{item.shortfall}</div>
                                            <Button onClick={() => navigate('/supplier_manager')} className="h-8 bg-white/10 hover:bg-[#6A2C91] text-white border-none rounded-lg text-[9px] font-black uppercase tracking-widest px-4">Order</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Desktop View: Table */}
                            <div className="hidden sm:block overflow-x-auto w-full"><table className="w-full min-w-[650px] text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-[10px] font-sans font-bold text-white/50 uppercase tracking-[0.3em]">
                                        <th className="pb-6 pl-4">Material</th>
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
                                            <td className="py-6 pl-4 font-serif text-white text-base leading-relaxed tracking-tight group-hover:text-[#C5A059] transition-colors">{item.item}</td>
                                            <td className="py-6 text-white/70 font-medium">{item.required}</td>
                                            <td className="py-6 text-white/70 font-medium">{item.current}</td>
                                            <td className="py-6 text-amber-500 font-bold">{item.shortfall}</td>
                                            <td className="py-6 text-emerald-400 font-bold">{item.cost}</td>
                                            <td className="py-6 text-right pr-4">
                                                <Button onClick={() => navigate('/supplier_manager')} className="h-10 bg-white/10 hover:bg-[#6A2C91] text-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-6 transition-colors">Order Now</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table></div>
                        </div>
                    )}
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <Card className="luxury-card p-4 sm:p-8 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]">
                    <h3 className="text-lg sm:text-2xl lg:text-3xl text-white mb-4 font-display font-medium uppercase tracking-widest">Synaptic Alignment Matrix</h3>
                    <div className="h-[220px] sm:h-[320px] lg:h-[400px] w-full mt-4">
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
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 lg:mt-12 text-[10px] font-sans font-bold text-white sm:text-white/50 uppercase tracking-widest">
                        <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-[#6A2C91] shadow-[0_0_8px_#6A2C91]"></div> Order Velocity</span>
                        <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]"></div> Revenue Handshake</span>
                        <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]"></div> Material Burden</span>
                    </div>
                </Card>
            </motion.div>

            {hasOrders && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="space-y-8"
                >
                   <h3 className="text-lg sm:text-2xl lg:text-3xl text-white mb-4 font-display font-medium uppercase tracking-widest">
                       <GlassHaloIcon icon={HistoryIcon} color="gold" size="md" /> Historical Synthesis
                   </h3>
                   <div className="bg-black/40 backdrop-blur-xl rounded-[3rem] p-3.5 sm:p-6 lg:p-12 border border-white/5 shadow-2xl group hover:border-[#C5A059]/30 hover:bg-black/60 transition-all duration-500 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-3.5 sm:p-6 lg:p-12 opacity-[0.02] text-[#C5A059] group-hover:opacity-[0.05] transition-opacity"><RefreshCw size={120} className="animate-spin-slow"/></div>
                       <div className="flex items-center gap-3 sm:gap-6 relative z-10">
                           <GlassHaloIcon icon={RefreshCw} color="purple" size="xl" className="group-hover:scale-105 transition-all duration-700" />
                           <div>
                               <div className="flex items-center gap-3 sm:gap-4 mb-3">
                                   <h4 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black text-white mb-4 font-sans">Active Projection: Q4 Protocol</h4>
                                   <Badge color="gold" className="text-[9px] px-3 py-1 shadow-sm uppercase border-[#C5A059]/20 font-cta font-semibold tracking-[0.08em]">Needs Review</Badge>
                               </div>
                               <p className="text-[11px] text-white sm:text-white/50 font-sans uppercase tracking-[0.2em]">Units Needed: <span className="text-white/90">110</span> • Created: Nov 25, 2025</p>
                           </div>
                       </div>
                       <div className="text-left sm:text-right relative z-10 w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border-t border-white/5 sm:border-0 pt-4 sm:pt-0">
                            <div className="flex flex-col items-center md:items-end">
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-2 font-serif italic font-light">Projected Settlement</p>
                                <p className="text-sm sm:text-base font-black text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(52,211,153,0.2)] font-sans">$1,976.70</p>
                            </div>
                            <GlassHaloIcon icon={ChevronRight} color="gold" size="md" className="group-hover:bg-white/10 transition-colors" />
                       </div>
                   </div>
                </motion.div>
            )}
        </motion.div>
    );
};
