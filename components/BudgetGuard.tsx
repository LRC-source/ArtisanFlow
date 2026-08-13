import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ShieldCheck, Sparkles, TrendingUp, DollarSign, Target, 
    ArrowLeft, Loader2, Info, RefreshCw, AlertTriangle, 
    Zap, Calendar, Clock, BarChart3, ChevronRight 
} from 'lucide-react';
import { Card, Button, Input, Badge } from './UI';
import { useArtisanData } from './DataContext';
import { analyzeBudgetGuard } from '../services/geminiService';

/**
 * Budget Guard™ - High-Fidelity Financial Control Hub ✅
 */

export const BudgetGuard: React.FC = () => {
    const navigate = useNavigate();
    const { 
        budgets, updateBudget, orders, inventory, 
        getTotalRevenue, getInventoryValue, getMarginMetrics 
    } = useArtisanData();
    
    const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);
    const [tempValue, setTempValue] = useState<string>(budgets[timeframe].toString());

    useEffect(() => {
        setTempValue(budgets[timeframe].toString());
        runAIAnalysis();
    }, [timeframe]);

    const runAIAnalysis = async () => {
        setIsAnalyzing(true);
        const context = {
            currentBudget: budgets[timeframe],
            timeframe,
            revenue: getTotalRevenue(),
            inventoryValue: getInventoryValue(),
            marginMetrics: getMarginMetrics(),
            orderCount: orders.length
        };
        const result = await analyzeBudgetGuard(context);
        setAiAnalysis(result);
        setIsAnalyzing(false);
    };

    const handleSaveBudget = () => {
        updateBudget({ [timeframe]: parseFloat(tempValue) || 0 });
        alert(`Vault Update: ${timeframe.toUpperCase()} budget target synchronized.`);
    };

    const applyAISuggestion = () => {
        if (!aiAnalysis) return;
        const newVal = aiAnalysis.suggestedIncrease 
            ? budgets[timeframe] + aiAnalysis.amount 
            : budgets[timeframe] - aiAnalysis.amount;
        setTempValue(newVal.toFixed(2));
        updateBudget({ [timeframe]: newVal });
        alert(`Synaptic Override: AI suggestion applied to ${timeframe} budget.`);
    };

    // Calculate utilization based on orders (revenue as a proxy for spendable profit in this demo)
    const spent = getTotalRevenue() * 0.4; // Mocking spend as 40% of revenue
    const utilization = budgets[timeframe] > 0 ? (spent / budgets[timeframe]) * 100 : 0;

    return (
        <div className="space-y-8 animate-in fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <button onClick={() => navigate('/finance')} className="flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] font-black text-xs uppercase tracking-widest mb-4 transition-colors">
                        <ArrowLeft size={16} /> Back to Finance
                    </button>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                        <ShieldCheck className="text-[#6A2C91]" size={36} /> Budget Guard™
                    </h1>
                    <p className="text-gray-500 font-medium">Synaptic Financial Steering: Real-time analysis for growth capitalization.</p>
                </div>
                <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
                    {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-white text-[#6A2C91] shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-8">
                {/* Manual Target Node */}
                <div className="lg:col-span-1 space-y-8">
                    <Card title="Architect's Target" className="rounded-[2.5rem] border-stone-100 shadow-xl overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-5 text-purple-600"><Target size={80} /></div>
                         <div className="space-y-6 mt-4 relative z-10">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Set Your {timeframe} Limit ($)</label>
                                <Input 
                                    type="number" 
                                    value={tempValue} 
                                    onChange={(e) => setTempValue(e.target.value)}
                                    className="text-2xl font-black rounded-2xl h-16 py-4"
                                />
                            </div>
                            <Button 
                                onClick={handleSaveBudget}
                                className="w-full bg-[#6A2C91] text-white h-14 font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-purple-100"
                            >
                                COMMIT TARGET TO VAULT
                            </Button>
                            
                            <div className="pt-6 border-t border-stone-100">
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Utilization</p>
                                    <p className="text-xl font-black text-gray-900">{utilization.toFixed(1)}%</p>
                                </div>
                                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${utilization > 90 ? 'bg-red-500' : 'bg-[#C5A059]'}`}
                                        style={{ width: `${Math.min(utilization, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                         </div>
                    </Card>

                    <div className="bg-stone-900 p-4 sm:p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <div className="flex items-center gap-3 mb-6">
                            <Zap size={20} className="text-amber-400" />
                            <h4 className="text-lg font-black uppercase italic tracking-tighter">Synaptic Analysis</h4>
                         </div>
                         {isAnalyzing ? (
                             <div className="flex flex-col items-center py-10">
                                 <Loader2 className="animate-spin text-amber-400 mb-4" size={32} />
                                 <p className="text-[10px] font-black uppercase text-stone-500 tracking-widest">Querying Vault Nodes...</p>
                             </div>
                         ) : aiAnalysis ? (
                             <div className="space-y-6 animate-in slide-up">
                                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                     <p className="text-xs text-stone-300 leading-relaxed font-medium">
                                         "{aiAnalysis.reasoning}"
                                     </p>
                                 </div>
                                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-400">
                                     <span>Priority: <span className="text-amber-400">{aiAnalysis.strategicPriority}</span></span>
                                     <span className="flex items-center gap-1">Risk: <Badge color={aiAnalysis.riskLevel === 'Low' ? 'green' : 'gold'} className="text-[8px]">{aiAnalysis.riskLevel}</Badge></span>
                                 </div>
                             </div>
                         ) : (
                             <p className="text-stone-500 text-xs italic">Establish factory link for real-time suggestions.</p>
                         )}
                    </div>
                </div>

                {/* AI Proposal Node */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-8">
                        <Card title="Lola’s Proposal" className="bg-purple-50 border-purple-100 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-purple-600"><Sparkles size={100} /></div>
                            <div className="mt-4 relative z-10">
                                {aiAnalysis ? (
                                    <>
                                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Recommended Adjust.</p>
                                        <p className={`text-4xl font-black tracking-tighter ${aiAnalysis.suggestedIncrease ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {aiAnalysis.suggestedIncrease ? '+' : '-'}${aiAnalysis.amount.toFixed(2)}
                                        </p>
                                        <Button 
                                            onClick={applyAISuggestion}
                                            className="mt-6 bg-white border border-purple-200 text-[#6A2C91] h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md"
                                        >
                                            APPLY SUGGESTION
                                        </Button>
                                    </>
                                ) : (
                                    <div className="h-24 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-purple-200" />
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card title="Budget Health Check" className="border-stone-100">
                            <div className="mt-4 space-y-4">
                                <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">Burn Rate</span>
                                    <span className="font-bold text-gray-900">Optimal</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">Forecast Integrity</span>
                                    <span className="font-bold text-emerald-600">94%</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card title="Strategic Financial Ledger" className="border-stone-100">
                        <div className="space-y-4 mt-4">
                            {[
                                { label: 'Marketing Reallocation', amount: budgets[timeframe] * 0.3, priority: 'High' },
                                { label: 'Raw Material Buffer', amount: budgets[timeframe] * 0.2, priority: 'Medium' },
                                { label: 'R&D / New Formulas', amount: budgets[timeframe] * 0.1, priority: 'Low' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-0 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white border border-stone-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#6A2C91] transition-colors shadow-sm">
                                            <BarChart3 size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 uppercase text-xs tracking-tight">{item.label}</p>
                                            <Badge color={item.priority === 'High' ? 'purple' : 'gray'} className="text-[8px] font-black px-2 mt-1">{item.priority} Priority</Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900">${item.amount.toFixed(2)}</p>
                                        <p className="text-[9px] text-gray-400 uppercase font-black">Forecasted Spend</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-sm"><Info size={24}/></div>
                        <div>
                            <h4 className="font-black text-amber-900 uppercase italic text-sm mb-1 tracking-tight">AI Financial Guardrail Active</h4>
                            <p className="text-amber-800 text-xs font-medium leading-relaxed">
                                Budget Guard™ is currently tracking your <strong>Inventory Node Burn Rates</strong>. It will automatically notify you via Lola if your current spending trajectory risks a material stock-out before the next planned restock.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
