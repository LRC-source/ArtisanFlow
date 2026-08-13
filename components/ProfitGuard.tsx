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
            className="p-4 sm:p-8 space-y-12 max-w-7xl mx-auto pb-32"
        >
            <SubPageHeader 
                title="Profit Guard™"
                parentTitle="Dashboard"
                onBack={() => navigate('/command-center')}
                description="High-precision margin protection and profitability diagnostics."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-8">
                {/* Input Section */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-4 sm:p-8 border-none shadow-sm bg-white rounded-3xl">
                        <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-white mb-8">Production Inputs</h3>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-3">Total Material Cost</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-serif text-xl">$</span>
                                    <Input 
                                        type="number" 
                                        value={materialCost} 
                                        onChange={(e) => setMaterialCost(Number(e.target.value))}
                                        className="pl-10 h-14 bg-stone-50/50 border-stone-100 rounded-2xl font-serif text-2xl focus:ring-purple-500/10"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-3">Batch Units</label>
                                <Input 
                                    type="number" 
                                    value={units} 
                                    onChange={(e) => setUnits(Number(e.target.value))}
                                    className="h-14 bg-stone-50/50 border-stone-100 rounded-2xl font-serif text-2xl focus:ring-purple-500/10"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-3">Proposed Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-serif text-xl">$</span>
                                    <Input 
                                        type="number" 
                                        value={plannedPrice} 
                                        onChange={(e) => setPlannedPrice(Number(e.target.value))}
                                        className="pl-10 h-14 bg-stone-50/50 border-stone-100 rounded-2xl font-serif text-2xl focus:ring-purple-500/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className={`p-8 border-none shadow-sm rounded-3xl transition-colors duration-500 ${isWarning ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-3 rounded-2xl ${isWarning ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {isWarning ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                            </div>
                            <h4 className={`font-serif text-xl ${isWarning ? 'text-amber-900' : 'text-emerald-900'}`}>
                                {isWarning ? 'Margin Risk Detected' : 'Profitability Secure'}
                            </h4>
                        </div>
                        <p className={`text-sm font-sans font-light leading-relaxed ${isWarning ? 'text-amber-700/80' : 'text-emerald-700/80'}`}>
                            {isWarning 
                                ? 'Your current markup is below the 2.2x artisanal benchmark. Consider optimizing material sourcing or adjusting wholesale positioning.' 
                                : 'Your margins are healthy and aligned with premium brand standards. This batch is cleared for high-efficiency production.'}
                        </p>
                    </Card>
                </div>

                {/* Analysis Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <Card className="p-4 sm:p-10 border-none shadow-sm bg-white rounded-[2.5rem] relative overflow-hidden">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:p-8 relative z-10">
                            <div>
                                <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-white mb-2">Total Batch Profitability</h3>
                                <p className="text-6xl font-serif text-stone-900 tracking-tighter">${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2 text-emerald-600 font-sans font-bold text-xs uppercase tracking-widest mb-2">
                                    <ArrowUpRight size={14} /> Healthy Yield
                                </div>
                                <div className="h-2 w-48 bg-stone-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${isWarning ? 'bg-amber-400' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min(marginPercentage * 1.5, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 pt-8 border-t border-stone-50 grid grid-cols-3 gap-4 sm:p-8">
                            <StatMini label="Markup" value={`${currentMultiplier.toFixed(2)}x`} />
                            <StatMini label="Break Even" value={`${Math.ceil(materialCost / plannedPrice)} Units`} />
                            <StatMini label="ROI" value={`${((totalProfit / materialCost) * 100).toFixed(0)}%`} />
                        </div>
                    </Card>

                    <div className="p-4 sm:p-8 bg-white/50 rounded-[2rem] border border-stone-100">
                        <h6 className="text-[10px] font-sans font-bold text-white uppercase tracking-[0.3em] mb-4">Strategic Recommendations</h6>
                        <ul className="space-y-3 text-sm font-sans font-light text-stone-600">
                            <li className="flex items-start gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                {isWarning 
                                    ? "Consider reducing raw material waste or renegotiating supplier contracts to lower unit cost." 
                                    : "Current margin is healthy. Consider scaling production to leverage economies of scale."}
                            </li>
                            <li className="flex items-start gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                {isWarning 
                                    ? "Target price adjustment recommended to reach 2.2x multiplier for sustainable growth." 
                                    : "Explore premium positioning to further increase markup without volume loss."}
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-4">
                        <Button onClick={() => toast.success('Exporting financial report...')} className="flex-1 h-16 bg-[#1A1A1A] text-white rounded-2xl font-sans font-bold text-[11px] uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg shadow-black/5">
                            Commit Batch to Production
                        </Button>
                        <Button onClick={() => toast.info('Syncing with Square financials...')} variant="outline" className="h-16 px-10 border-stone-200 rounded-2xl font-sans font-bold text-[11px] uppercase tracking-widest hover:bg-stone-50 transition-all">
                            Export Diagnostic
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const AnalysisCard = ({ title, value, subtitle, icon: Icon, highlight }: any) => (
    <div className={`p-8 rounded-3xl border border-stone-100 transition-all duration-500 hover:shadow-md ${highlight ? 'bg-purple-50/30 border-purple-100' : 'bg-white'}`}>
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl ${highlight ? 'bg-purple-100 text-[#6A2C91]' : 'bg-stone-50 text-stone-400'}`}>
                <Icon size={20} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">{subtitle}</span>
        </div>
        <h4 className="text-sm font-sans font-medium text-white font-bold mb-1">{title}</h4>
        <p className={`text-3xl font-serif tracking-tight ${highlight ? 'text-[#6A2C91]' : 'text-stone-900'}`}>{value}</p>
    </div>
);

const StatMini = ({ label, value }: any) => (
    <div>
        <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 mb-1">{label}</p>
        <p className="text-xl font-serif text-stone-900">{value}</p>
    </div>
);
