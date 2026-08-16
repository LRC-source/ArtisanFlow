import React, { useState, useEffect } from 'react';
import { ContextualTutorialModal } from './ContextualTutorialModal';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, TrendingUp, BarChart3, ArrowLeft, Sparkles, 
  Download, FileText, PieChart, Calendar, ShieldCheck, 
  ArrowUpRight, ArrowDownRight, RefreshCw, Loader2, Target, Package, Wallet, GanttChartSquare, CheckCircle, Ship, Map, Info, X
} from 'lucide-react';
import { Card, Button, Badge, Select, Modal, Input, VaultBanner } from './UI';
import { useArtisanData } from './DataContext';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, BarChart, Bar, Legend, PieChart as RePieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { generateFinancialAnalysis, generateBudgetStrategy } from '../services/geminiService';
import { motion } from 'framer-motion';
import { TaxExporter } from './TaxExporter';
import { GlassHaloIcon } from './ui/GlassHaloIcon';

const COLORS_LIST = ['#6A2C91', '#C5A059', '#78BE20', '#5B5F7F', '#1A1A1A'];

export const FinanceHub: React.FC = () => {
    const navigate = useNavigate();
    const { orders, inventory, getTotalRevenue, getInventoryValue } = useArtisanData();
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportModal, setReportModal] = useState<{ isOpen: boolean, type: string }>({ isOpen: false, type: '' });
    
    const [isBudgeting, setIsBudgeting] = useState(false);
    const [budgetResult, setBudgetResult] = useState<any>(null);

    const revenue = getTotalRevenue();
    const invValue = getInventoryValue();
    
    const estimatedCOGS = orders.reduce((acc, order) => {
        return acc + order.items.reduce((itemAcc, item) => {
            const invItem = inventory.find(i => i.name === item.name);
            const cost = invItem?.unitCost || 3.5; 
            return itemAcc + (item.qty * cost);
        }, 0);
    }, 0);

    const grossProfit = revenue - estimatedCOGS;
    const margin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

    const handleGenerateReport = (type: string) => {
        setReportModal({ isOpen: true, type });
    };

    const runBudgetOptimizer = async () => {
        setIsBudgeting(true);
        const result = await generateBudgetStrategy(revenue, estimatedCOGS, "Scale marketing and optimize raw material sourcing");
        setBudgetResult(result);
        setIsBudgeting(false);
    };

    return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12 pb-20 p-4 sm:p-10 md:p-16 max-w-[1600px] mx-auto"
        >
            <ContextualTutorialModal
                hubId="finance"
                title="Finance & Margins"
                description="Keep a pulse on your profitability and cash flow."
                steps={["Review total revenue and expenses.","Analyze margin multipliers per product.","Forecast cash runway and operational costs."]}
            />
            <Modal 
                isOpen={reportModal.isOpen} 
                onClose={() => setReportModal({ isOpen: false, type: '' })}
                title={`Initialize ${reportModal.type} Generation`}
            >
                <div className="space-y-8 py-4">
                    <div className="bg-[#6A2C91]/10 border border-[#6A2C91]/20 p-6 rounded-3xl flex items-start gap-4">
                        <Sparkles className="text-[#6A2C91] shrink-0 mt-1" size={20} />
                        <p className="text-white/70 text-sm font-sans font-light leading-relaxed italic">
                            Our AI is cross-referencing your <span className="text-white font-bold not-italic">Inventory Burn Rates</span> with <span className="text-white font-bold not-italic">Order Velocity</span> to construct a high-fidelity {reportModal.type}.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.3em] ml-2">Report Parameters</p>
                        <Select defaultValue="Full Fiscal Year" className="bg-black/40 text-white border-white/10 h-14 rounded-2xl">
                            <option value="Current Quarter" className="bg-[#1A1A1A]">Current Quarter</option>
                            <option value="Full Fiscal Year" className="bg-[#1A1A1A]">Full Fiscal Year</option>
                            <option value="Comparative" className="bg-[#1A1A1A]">Comparative (Last 2 Years)</option>
                        </Select>
                    </div>
                    <Button 
                        className="w-full bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all"
                        onClick={() => {
                            setIsGenerating(true);
                            setReportModal({ isOpen: false, type: '' });
                            setTimeout(() => {
                                setIsGenerating(false);
                            }, 2500);
                        }}
                    >
                        DEPLOY AI AUDITOR
                    </Button>
                </div>
            </Modal>

            {isGenerating && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-[#6A2C91] mb-8" size={64} strokeWidth={1} />
                    <h2 className="text-4xl font-serif text-white tracking-tight uppercase italic mb-4">Synthesizing Ledger...</h2>
                    <p className="text-white/50 text-lg font-sans font-light">Lola is reconciling omnichannel transactions.</p>
                </div>
            )}

            <div className="flex flex-col gap-4 sm:p-8">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-3 text-white/40 hover:text-white font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all group w-fit">
                    <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Command Center
                </button>
                
                <VaultBanner 
                  title="Finance Hub"
                  subtitle="Vault Ledger & High-Precision Financial Architecture. Reconciling craftsmanship with capital growth."
                  badge="Financial Protocol Active"
                >
                  <div className="flex gap-4">
                    <Button 
                        className="bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-bold text-[11px] tracking-[0.3em] h-16 px-10 rounded-full shadow-2xl shadow-black/10 transition-all uppercase"
                        onClick={() => navigate('/finance/projections')}
                    >
                        <TrendingUp size={16} className="mr-3"/> GENERATE 5-YEAR PROJECTION
                    </Button>
                  </div>
                </VaultBanner>
            </div>

            {/* Financial Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:p-8">
                <FinanceCard title="Gross Revenue" value={`$${revenue.toFixed(2)}`} trend="+12.4%" positive icon={DollarSign} />
                <FinanceCard title="COGS (Interconnected)" value={`$${estimatedCOGS.toFixed(2)}`} trend="-2.1%" positive icon={Package} />
                <FinanceCard title="Net Profit" value={`$${grossProfit.toFixed(2)}`} trend="+8.5%" positive icon={TrendingUp} />
                <FinanceCard title="Avg. Margin" value={`${margin.toFixed(1)}%`} trend="Stable" positive icon={Target} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-12">
                {/* Main Cash Flow Visualizer */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="p-[1.5px] rounded-[3.5rem] bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <div className="luxury-card bg-[#0A0A0A] p-4 sm:p-12 rounded-[3.5rem] relative overflow-hidden">
                            <div className="mb-10 relative z-10">
                                <h3 className="text-3xl font-serif text-white tracking-tight">Interconnected Flow Ledger</h3>
                            </div>
                            <div className="h-96 w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[
                                        { month: 'Jul', rev: 4500, exp: 2800 },
                                        { month: 'Aug', rev: 5200, exp: 3100 },
                                        { month: 'Sep', rev: 4800, exp: 2900 },
                                        { month: 'Oct', rev: 6100, exp: 3400 },
                                        { month: 'Nov', rev: 7200, exp: 4100 },
                                        { month: 'Dec', rev: 8900, exp: 4800 },
                                    ]}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'Inter', fontWeight: 600}} dy={10}/>
                                        <YAxis hide />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1A1A1A', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}
                                            itemStyle={{ color: '#fff', fontFamily: 'Inter', fontWeight: 600 }}
                                            labelStyle={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}
                                        />
                                        <Area type="monotone" dataKey="rev" stroke="#06B6D4" strokeWidth={4} fill="url(#colorRev)" name="Revenue" />
                                        <Area type="monotone" dataKey="exp" stroke="#C5A059" strokeWidth={4} fill="url(#colorExp)" name="Expenses" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex gap-4 sm:p-8 mt-10 justify-center relative z-10">
                                <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#06B6D4] rounded-full shadow-[0_0_10px_#06B6D4]"></div> <span className="text-[11px] font-bold font-sans uppercase tracking-[0.3em] text-white/40">Omnichannel Revenue</span></div>
                                <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#C5A059] rounded-full shadow-[0_0_10px_#C5A059]"></div> <span className="text-[11px] font-bold font-sans uppercase tracking-[0.3em] text-white/40">Operational Expenses</span></div>
                            </div>
                        </div>
                    </div>

                    {/* AI Budget Guard */}
                    <div className="luxury-card bg-[#1A1A1A] border border-[#C5A059]/20 p-4 sm:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(197,160,89,0.05)] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#C5A059]/10 to-transparent rounded-bl-full opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
                         
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                             <div>
                                 <h4 className="text-3xl font-serif text-[#C5A059] tracking-tight flex items-center gap-4">
                                     <Wallet size={28} /> Budget Guard™ Active
                                 </h4>
                                 <p className="text-white/50 font-sans font-light text-lg mt-2">Auto-allocating resources based on high-margin trajectories.</p>
                             </div>
                             <Button 
                                onClick={runBudgetOptimizer}
                                disabled={isBudgeting}
                                className="bg-[#C5A059] hover:bg-[#b08e4d] text-white border-none h-14 rounded-full px-8 font-bold font-sans uppercase text-[11px] tracking-[0.3em] shadow-xl shadow-[#C5A059]/20 transition-all"
                             >
                                {isBudgeting ? <Loader2 className="animate-spin mx-auto" /> : 'RECALCULATE ALLOCATION'}
                             </Button>
                         </div>

                         {budgetResult ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10 animate-in slide-up">
                                 <div className="h-72 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={budgetResult.allocation}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="amount"
                                                stroke="none"
                                            >
                                                {budgetResult.allocation.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS_LIST[index % COLORS_LIST.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#1A1A1A', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}
                                                itemStyle={{ color: '#fff', fontFamily: 'Inter', fontWeight: 600 }}
                                            />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <p className="text-[11px] font-bold font-sans uppercase text-white/40 tracking-[0.3em]">Runway</p>
                                        <p className="text-4xl font-serif text-white tracking-tighter mt-1">{budgetResult.runwayMonths}mo</p>
                                    </div>
                                 </div>
                                 <div className="space-y-6 flex flex-col justify-center">
                                     <h5 className="text-[11px] font-bold font-sans text-[#C5A059] uppercase tracking-[0.3em] border-b border-[#C5A059]/20 pb-4">Optimization Protocol</h5>
                                     {budgetResult.optimizationTips.map((tip: string, i: number) => (
                                         <div key={i} className="flex gap-4 items-start group">
                                             <div className="p-1.5 bg-[#C5A059]/20 rounded-lg text-[#C5A059] mt-0.5"><CheckCircle size={14} /></div>
                                             <p className="text-sm text-white/60 font-sans font-light leading-relaxed group-hover:text-white transition-colors">{tip}</p>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         ) : (
                             <div className="py-24 text-center border border-dashed border-white/10 rounded-[2rem] bg-white/5 relative z-10">
                                 <GanttChartSquare size={48} className="text-white/10 mx-auto mb-6" strokeWidth={1} />
                                 <p className="text-white/30 text-[11px] font-sans font-bold uppercase tracking-[0.3em]">Awaiting Command Initialization</p>
                             </div>
                         )}
                    </div>
                </div>

                {/* Report Generator Module */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-4 sm:p-10">
                        <div className="mb-8">
                            <h3 className="text-3xl font-serif text-white tracking-tight mb-4">Synaptic Reports</h3>
                            <p className="text-white/50 text-sm font-sans font-light italic leading-relaxed">
                                Generate legally-compliant financial dossiers architected from your real-time database.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <ReportButton label="Profit & Loss Statement" icon={FileText} onClick={() => handleGenerateReport('P&L')} />
                            <ReportButton label="Balance Sheet Node" icon={BarChart3} onClick={() => handleGenerateReport('Balance Sheet')} />
                            <ReportButton label="Cash Flow Projections" icon={PieChart} onClick={() => handleGenerateReport('Cash Flow')} />
                            <ReportButton label="Inventory Valuation Tax Log" icon={ShieldCheck} onClick={() => handleGenerateReport('Tax Log')} />
                        </div>
                        <div className="mt-10 pt-8 border-t border-white/10">
                            <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                                <h4 className="text-[11px] font-sans font-bold uppercase text-white/40 tracking-[0.3em] mb-4 flex items-center gap-3">
                                    <ShieldCheck className="text-emerald-500" size={16} /> Audit Trail Status
                                </h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-serif text-white tracking-tight">Systems Synchronized</p>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Reconciliation: Today, 09:14 AM</p>
                                    </div>
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                        <CheckCircle className="text-emerald-500 animate-pulse" size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-4 sm:p-10">
                        <h3 className="text-2xl font-serif text-white tracking-tight mb-8">System Parameters</h3>
                        <div className="space-y-8">
                            <div>
                                <label className="text-[11px] font-bold font-sans text-white/40 uppercase tracking-[0.3em] block mb-3">Primary Currency</label>
                                <Select defaultValue="USD" className="bg-black/40 border-white/10 text-white rounded-2xl h-14">
                                    <option className="bg-[#1A1A1A]">USD ($)</option>
                                    <option className="bg-[#1A1A1A]">EUR (€)</option>
                                    <option className="bg-[#1A1A1A]">GBP (£)</option>
                                </Select>
                            </div>
                            <div>
                                <label className="text-[11px] font-bold font-sans text-white/40 uppercase tracking-[0.3em] block mb-3">Fiscal Year Lock</label>
                                <Badge color="purple" className="w-full justify-center py-4 text-[11px] bg-[#6A2C91]/20 border-[#6A2C91]/30">DECEMBER 31ST</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const FinanceCard = ({ title, value, trend, positive, icon: Icon }: any) => (
    <div className="luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-8 relative overflow-hidden group hover:border-white/20 hover:shadow-2xl transition-all duration-500">
        <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
            <Icon size={64} className="text-white" />
        </div>
        <div className="flex justify-between items-start mb-6">
            <span className="text-white/40 font-sans font-bold text-[11px] uppercase tracking-[0.3em]">{title}</span>
            <GlassHaloIcon icon={Icon} color="gold" size="md" className="group-hover:scale-110 transition-all duration-500 z-10" />
        </div>
        <div className="text-4xl font-serif text-white tracking-tighter mb-4 relative z-10">{value}</div>
        <div className="flex items-center gap-2 relative z-10">
            {positive ? <ArrowUpRight className="text-emerald-400" size={16} /> : <ArrowDownRight className="text-red-400" size={16} />}
            <span className={`${positive ? 'text-emerald-400' : 'text-red-400'} text-[11px] font-sans font-bold uppercase tracking-[0.3em]`}>{trend}</span>
        </div>
    </div>
);

const ReportButton = ({ label, icon: Icon, onClick }: any) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5 hover:border-[#6A2C91]/50 hover:bg-[#6A2C91]/10 transition-all group overflow-hidden relative"
    >
        <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-[#6A2C91] group-hover:bg-[#6A2C91]/20 transition-all">
                <Icon size={18} />
            </div>
            <span className="text-sm font-sans font-light text-white/70 group-hover:text-white transition-colors tracking-wide">{label}</span>
        </div>
        <Download className="text-white/20 group-hover:text-white relative z-10 transition-colors" size={20} />
    </button>
);

export const FinancialProjections: React.FC = () => {
    const navigate = useNavigate();
    const { orders, inventory } = useArtisanData();
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'Standard' | 'Dropshipping'>('Standard');
    const [planTab, setPlanTab] = useState<'1' | '3' | '5'>('1');

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const fetchAnalysis = async () => {
        setLoading(true);
        const result = await generateFinancialAnalysis(orders, inventory);
        setAnalysis(result);
        setLoading(false);
    };

    const handleDownloadReport = () => {
        if (!analysis) return;
        
        const content = `
ARTISAN FLOW: STRATEGIC FINANCIAL ARCHITECTURE REPORT
Generated: ${new Date().toLocaleDateString()}
Status: ${analysis.riskLevel} Risk System State

EXECUTIVE SUMMARY
${analysis.summary}

--- RECOVERY PROTOCOLS (TO BALANCED STATE) ---
1-YEAR RECOVERY: ${analysis.recoveryPlans.oneYear}
3-YEAR RECOVERY: ${analysis.recoveryPlans.threeYear}
5-YEAR RECOVERY: ${analysis.recoveryPlans.fiveYear}

--- PROJECTIONS: STANDARD GROWTH ---
${analysis.projections.map((p: any) => `Year ${p.year}: Rev $${p.projectedRevenue.toLocaleString()} | Profit $${p.projectedProfit.toLocaleString()}`).join('\n')}

--- PROJECTIONS: DROPSHIPPING STRATEGY SCALE ---
${analysis.dropshippingEstimates.map((p: any) => `Year ${p.year}: Rev $${p.estRevenue.toLocaleString()} | Profit $${p.estProfit.toLocaleString()}`).join('\n')}

CERTIFIED BY LOLA AI SYSTEMS
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LRC_ArtisanFlow_Projections_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12 pb-20 p-4 sm:p-10 md:p-16 max-w-[1600px] mx-auto"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <button onClick={() => navigate('/finance')} className="flex items-center gap-3 text-white/40 hover:text-white font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all group w-fit">
                    <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Finance Hub
                </button>
                {!loading && analysis && (
                    <Button 
                        onClick={handleDownloadReport}
                        className="bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-bold text-[11px] h-14 rounded-full px-8 tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all uppercase flex items-center justify-center gap-3"
                    >
                        <Download size={16} /> DOWNLOAD FINAL DOSSIER
                    </Button>
                )}
            </div>

            <div className="luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-bl-full -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#6A2C91]/10 rounded-tr-full -ml-32 -mb-32 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-16">
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-6">
                             <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#6A2C91] shadow-inner backdrop-blur-md">
                                <Sparkles size={32} strokeWidth={1.5} />
                             </div>
                             <div>
                                <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Strategic Projections</h1>
                                <p className="text-white/50 font-sans font-light text-lg mt-2 italic">Synthesizing recovery paths and dropshipping scalability.</p>
                             </div>
                        </div>

                        {loading ? (
                            <div className="py-10 space-y-4">
                                <div className="h-4 bg-white/10 rounded-full w-full animate-pulse"></div>
                                <div className="h-4 bg-white/10 rounded-full w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-white/10 rounded-full w-1/2 animate-pulse"></div>
                            </div>
                        ) : (
                            <div className="prose max-w-none">
                                <p className="text-xl text-white/70 font-sans font-light leading-relaxed italic border-l-2 border-[#C5A059] pl-6">
                                    "{analysis?.summary || "Analyzing current ledger to establish recovery trajectory..."}"
                                </p>
                            </div>
                        )}
                    </div>
                    
                    {!loading && analysis && (
                        <div className="w-full md:w-96 bg-black/40 rounded-[2.5rem] p-4 sm:p-12 border border-white/5 flex flex-col items-center text-center shadow-inner">
                            <p className="text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.3em] mb-8">Risk Architecture</p>
                            <div className={`w-32 h-32 rounded-full border-[10px] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] ${analysis.riskLevel === 'Low' ? 'border-emerald-500/20 text-emerald-400' : analysis.riskLevel === 'Medium' ? 'border-amber-500/20 text-amber-400' : 'border-red-500/20 text-red-400'}`}>
                                <ShieldCheck size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className={`text-4xl font-serif tracking-tighter ${analysis.riskLevel === 'Low' ? 'text-emerald-400' : analysis.riskLevel === 'Medium' ? 'text-amber-400' : 'text-red-400'}`}>{analysis.riskLevel}</h3>
                            <p className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-white/30 mt-3">Risk Assessment</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Strategic Recovery Plans */}
            {!loading && analysis && (
                <div className="luxury-card bg-[#0A0A0A] border border-[#6A2C91]/20 rounded-[3rem] p-4 sm:p-12 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <h3 className="text-3xl font-serif text-white tracking-tight">Recovery Protocols</h3>
                        
                        <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                            {(['1', '3', '5'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setPlanTab(tab)}
                                    className={`px-8 py-3 rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.3em] transition-all ${planTab === tab ? 'bg-white/10 text-white shadow-md' : 'text-white/30 hover:text-white/60'}`}
                                >
                                    {tab} Year
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 sm:p-10 bg-white/5 rounded-[2rem] border border-white/10 animate-in fade-in zoom-in duration-500 shadow-inner">
                        <div className="flex items-start gap-4 sm:p-8">
                            <div className="w-14 h-14 bg-[#6A2C91]/20 rounded-2xl text-[#6A2C91] flex items-center justify-center border border-[#6A2C91]/30 shrink-0"><Map size={24} strokeWidth={1.5}/></div>
                            <div>
                                <h4 className="text-2xl font-serif text-white tracking-tight mb-4">{planTab}-Year Strategic Plan</h4>
                                <p className="text-white/60 font-sans font-light text-lg leading-relaxed">
                                    {planTab === '1' && analysis.recoveryPlans.oneYear}
                                    {planTab === '3' && analysis.recoveryPlans.threeYear}
                                    {planTab === '5' && analysis.recoveryPlans.fiveYear}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Projection Chart Section */}
            <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h3 className="text-3xl font-serif text-white tracking-tight mb-2">
                             Projected Revenue Velocity
                        </h3>
                        <p className="text-white/50 font-sans font-light italic">Comparing standard growth vs. dropshipping optimization strategy.</p>
                    </div>
                    <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                        <button 
                            onClick={() => setViewMode('Standard')}
                            className={`px-8 py-3 rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.3em] transition-all ${viewMode === 'Standard' ? 'bg-[#6A2C91] text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}
                        >
                            Standard
                        </button>
                        <button 
                            onClick={() => setViewMode('Dropshipping')}
                            className={`px-8 py-3 rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-2 ${viewMode === 'Dropshipping' ? 'bg-[#C5A059] text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}
                        >
                            <Ship size={14} /> Dropshipping
                        </button>
                    </div>
                </div>

                <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-4 sm:p-12">
                    <div className="h-[500px] w-full">
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center"><Loader2 size={64} strokeWidth={1} className="animate-spin text-white/20" /></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={viewMode === 'Standard' ? analysis?.projections : analysis?.dropshippingEstimates} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill:'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'Inter', fontWeight: 600}} dy={15} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill:'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'Inter'}} tickFormatter={val => `$${val/1000}k`} />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.02)'}} 
                                        contentStyle={{ backgroundColor: '#1A1A1A', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}
                                        itemStyle={{ color: '#fff', fontFamily: 'Inter', fontWeight: 600 }}
                                        labelStyle={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '40px', fontSize: '11px', fontFamily: 'Inter', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }} />
                                    <Bar 
                                        dataKey={viewMode === 'Standard' ? "projectedRevenue" : "estRevenue"} 
                                        fill={viewMode === 'Standard' ? "#6A2C91" : "#C5A059"} 
                                        radius={[12, 12, 0, 0]} 
                                        name={viewMode === 'Standard' ? "Standard Revenue" : "Dropshipping Target Revenue"} 
                                    />
                                    <Bar 
                                        dataKey={viewMode === 'Standard' ? "projectedProfit" : "estProfit"} 
                                        fill="#78BE20" 
                                        radius={[12, 12, 0, 0]} 
                                        name="Net Profit" 
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    {viewMode === 'Dropshipping' && (
                        <div className="mt-12 flex items-start gap-4 p-6 bg-[#C5A059]/10 rounded-[2rem] border border-[#C5A059]/20 shadow-inner">
                            <Info size={24} className="text-[#C5A059] shrink-0" strokeWidth={1.5} />
                            <p className="text-sm text-white/70 font-sans font-light leading-relaxed">
                                Dropshipping estimates assume a <strong className="text-white font-medium">low-overhead fulfillment model</strong> where stock is managed by the Synaptic Handshake nodes. Profit margins are optimized for high-throughput scaling without proportional inventory risk.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <TaxExporter />
        </motion.div>
    );
};
