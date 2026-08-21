import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, DollarSign, Calculator, 
  TrendingUp, ArrowLeft, Zap, Target, PieChart, 
  BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, Input, Button, Badge, VaultBanner } from './UI';
import { useArtisanData } from './DataContext';
import { SubPageHeader } from './SubPageHeader';

export const ProfitGuardPage = () => {
    const navigate = useNavigate();
    const { userTier } = useArtisanData();
    const [materialCost, setMaterialCost] = useState<number>(150);
    const [units, setUnits] = useState<number>(50);
    const [plannedPrice, setPlannedPrice] = useState<number>(6.60);

    const costPerUnit = units > 0 ? materialCost / units : 0;
    const recommendedPrice = costPerUnit * 2.2;
    const currentMultiplier = costPerUnit > 0 ? plannedPrice / costPerUnit : 0;
    const isWarning = currentMultiplier < 2.0;
    const profitPerUnit = plannedPrice - costPerUnit;
    const totalProfit = profitPerUnit * units;
    const marginPercentage = plannedPrice > 0 ? (profitPerUnit / plannedPrice) * 100 : 0;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3.5 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 lg:space-y-12 max-w-7xl mx-auto pb-12 sm:pb-20 lg:pb-32"
        >
            <SubPageHeader 
                title="Profit Guard™"
                parentTitle="Dashboard"
                onBack={() => navigate('/command-center')}
                description="High-precision margin protection and profitability diagnostics."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
                {/* Input Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="luxury-card bg-white/5 border border-white/10 p-3.5 sm:p-6 lg:p-12 shadow-sm rounded-3xl">
                        <h3 className="text-lg sm:text-2xl lg:text-3xl font-sans font-bold uppercase tracking-widest text-white sm:text-white/50 mb-8">Production Inputs</h3>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-widest mb-3">Total Material Cost</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white sm:text-white/40 font-serif text-sm sm:text-base lg:text-xl text-white sm:text-slate-400 leading-relaxed sm:text-lg">$</span>
                                    <Input 
                                        type="number" 
                                        value={materialCost} 
                                        onChange={(e) => setMaterialCost(Number(e.target.value))}
                                        className="pl-10 w-auto mx-auto py-1 px-3 text-[10px] bg-black/40 border-white/10 rounded-2xl font-serif text-white text-sm sm:text-base md:text-3xl sm:text-5xl lg:text-7xl font-black focus:border-[#6A2C91]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-widest mb-3">Batch Units</label>
                                <Input 
                                    type="number" 
                                    value={units} 
                                    onChange={(e) => setUnits(Number(e.target.value))}
                                    className="w-auto mx-auto py-1 px-3 text-[10px] bg-black/40 border-white/10 rounded-2xl font-serif text-white text-sm sm:text-base md:text-3xl sm:text-5xl lg:text-7xl font-black focus:border-[#6A2C91]"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-widest mb-3">Proposed Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white sm:text-white/40 font-serif text-sm sm:text-base lg:text-xl text-white sm:text-slate-400 leading-relaxed sm:text-lg">$</span>
                                    <Input 
                                        type="number" 
                                        value={plannedPrice} 
                                        onChange={(e) => setPlannedPrice(Number(e.target.value))}
                                        className="pl-10 w-auto mx-auto py-1 px-3 text-[10px] bg-black/40 border-white/10 rounded-2xl font-serif text-white text-sm sm:text-base md:text-3xl sm:text-5xl lg:text-7xl font-black focus:border-[#6A2C91]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 sm:p-5 lg:p-6 border border-white/10 shadow-sm rounded-3xl transition-colors duration-500 ${isWarning ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                        <div className="flex items-center gap-3 sm:gap-4 mb-6">
                            <div className={`p-3 rounded-2xl ${isWarning ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                {isWarning ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                            </div>
                            <h4 className={`font-serif text-sm sm:text-base lg:text-xl text-white sm:text-slate-400 leading-relaxed sm:text-lg ${isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {isWarning ? 'Margin Risk Detected' : 'Profitability Secure'}
                            </h4>
                        </div>
                        <p className={`text-sm font-sans font-light leading-relaxed ${isWarning ? 'text-amber-400/80' : 'text-emerald-400/80'}`}>
                            {isWarning 
                                ? 'Your current markup is below the 2.2x artisanal benchmark. Consider optimizing material sourcing or adjusting wholesale positioning.' 
                                : 'Your margins are healthy and aligned with premium brand standards. This batch is cleared for high-efficiency production.'}
                        </p>
                    </div>
                </div>

                {/* Analysis Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                        <AnalysisCard 
                            title="Unit Cost" 
                            value={`$${costPerUnit.toFixed(2)}`} 
                            subtitle="Production Floor"
                            icon={Calculator}
                        />
                        <AnalysisCard 
                            title="Target Price (2.2x)" 
                            value={`$${recommendedPrice.toFixed(2)}`} 
                            subtitle="Artisanal Benchmark"
                            icon={Target}
                            highlight
                        />
                        <AnalysisCard 
                            title="Profit Per Unit" 
                            value={`$${profitPerUnit.toFixed(2)}`} 
                            subtitle="Net Contribution"
                            icon={TrendingUp}
                        />
                        <AnalysisCard 
                            title="Margin Percentage" 
                            value={`${marginPercentage.toFixed(1)}%`} 
                            subtitle="Efficiency Rating"
                            icon={PieChart}
                        />
                    </div>

                    <div className="p-[1.5px] rounded-[3rem] bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <div className="p-3.5 sm:p-6 lg:p-12 border-none shadow-sm bg-[#0A0A0A] rounded-[3rem] relative overflow-hidden">
                            <div className="flex flex-col md:flex-col sm:flex-col sm:flex-row justify-between items-start md:items-center gap-3 sm:gap-6 relative z-10">
                                <div>
                                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-sans font-bold uppercase tracking-widest text-white sm:text-white/50 mb-2">Total Batch Profitability</h3>
                                    <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2 text-emerald-400 font-sans font-bold text-xs uppercase tracking-widest mb-2">
                                        <ArrowUpRight size={14} /> Healthy Yield
                                    </div>
                                    <div className="h-2 w-full sm:w-48 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${isWarning ? 'bg-amber-400' : 'bg-emerald-500'}`}
                                            style={{ width: `${Math.min(marginPercentage * 1.5, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 sm:mt-8 lg:mt-12 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                                <StatMini label="Markup" value={`${currentMultiplier.toFixed(2)}x`} />
                                <StatMini label="Break Even" value={`${Math.ceil(materialCost / plannedPrice)} Units`} />
                                <StatMini label="ROI" value={`${((totalProfit / materialCost) * 100).toFixed(0)}%`} />
                            </div>
                        </div>
                    </div>

                    <div className="p-3.5 sm:p-6 lg:p-12 bg-white/5 rounded-[2rem] border border-white/10">
                        <h6 className="text-[10px] font-sans font-bold text-white sm:text-white/50 uppercase tracking-[0.3em] mb-4">Strategic Recommendations</h6>
                        <ul className="space-y-3 text-sm font-sans font-light text-white sm:text-white/70">
                            <li className="flex items-start gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isWarning ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                                {isWarning 
                                    ? "Consider reducing raw material waste or renegotiating supplier contracts to lower unit cost." 
                                    : "Current margin is healthy. Consider scaling production to leverage economies of scale."}
                            </li>
                            <li className="flex items-start gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isWarning ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                                {isWarning 
                                    ? "Target price adjustment recommended to reach 2.2x multiplier for sustainable growth." 
                                    : "Explore premium positioning to further increase markup without volume loss."}
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-center justify-center gap-3 w-auto">
                        <Button onClick={() => toast.success('Exporting financial report...')} className="flex-1 py-3 px-6 bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] text-white rounded-[2rem] font-sans font-bold text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-all shadow-2xl">
                            Commit Batch to Production
                        </Button>
                        <Button onClick={() => toast.info('Syncing with Square financials...')} variant="outline" className="h-16 px-10 border-white/20 bg-white/5 rounded-[2rem] font-sans font-bold text-white text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                            Export Diagnostic
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const AnalysisCard = ({ title, value, subtitle, icon: Icon, highlight }: any) => (
    <div className={`p-4 sm:p-5 lg:p-6 rounded-3xl border transition-all duration-500 hover:shadow-2xl ${highlight ? 'bg-gradient-to-br from-[#6A2C91]/20 to-transparent border-[#6A2C91]/30' : 'bg-white/5 border-white/10'}`}>
        <div className="flex justify-between items-start mb-6">
            <div className={`relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-[1rem] bg-white/[0.05] border border-white/20 backdrop-blur-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] z-10`}>
                <span className={`absolute inset-0 rounded-[1rem] bg-gradient-to-r from-white/10 to-white/5 opacity-40 blur-md`}></span>
                <Icon size={20} className={`${highlight ? 'text-[#C5A059]' : 'text-white sm:text-white/70'} relative z-10`} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-white sm:text-white/40">{subtitle}</span>
        </div>
        <h4 className="text-sm font-sans font-bold text-white mb-1">{title}</h4>
        <p className={`text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight ${highlight ? 'text-[#C5A059]' : 'text-white'}`}>{value}</p>
    </div>
);

const StatMini = ({ label, value }: any) => (
    <div>
        <p className="text-sm sm:text-base text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-white sm:text-white/40 mb-1">{label}</p>
        <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{value}</p>
    </div>
);
