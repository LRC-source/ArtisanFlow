import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Input, Select, Modal, DashboardBanner } from './UI';
import { toast } from 'sonner';
import { 
  DollarSign, AlertTriangle, ShieldCheck, Clock, ArrowRight, 
  Sparkles, Package, Factory, Users, CreditCard, ChevronRight, 
  Search, Filter, RefreshCw, CheckCircle2, ArrowUpRight, Zap, 
  Tag, Mail, FileText, Lock, Unlock, BarChart3, Layers, RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useArtisanData } from './DataContext';
import { SubPageHeader } from './SubPageHeader';
import { GlassHaloIcon } from './ui/GlassHaloIcon';
import { TrappedCashAsset, INITIAL_TRAPPED_CASH_DATA } from '../src/data/mockArtisanFlowData';

export type TrappedCategory = 'All' | 'Raw Material' | 'Finished Goods' | 'B2B Invoice' | 'Supplier Terms';

export const QualityControl: React.FC = () => {
  const navigate = useNavigate();
  const { qualityChecks, addQualityCheck, inventory } = useArtisanData();

  // Decoupled Local State Initialized with Centralized Mock Data
  const [cashAssets, setCashAssets] = useState<TrappedCashAsset[]>(INITIAL_TRAPPED_CASH_DATA);

  // Filter & UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<TrappedCategory>('All');
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [selectedRecoveryItem, setSelectedRecoveryItem] = useState<TrappedCashAsset | null>(null);

  // Active Action Modals
  const [activeActionModal, setActiveActionModal] = useState<'clearance' | 'batch' | 'invoice' | 'terms' | null>(null);

  // Reset Mock Data Helper
  const handleResetMockData = () => {
    setCashAssets(INITIAL_TRAPPED_CASH_DATA);
    setSearchTerm('');
    setCategoryFilter('All');
    toast.info('Trapped Cash Audit mock data reset to initial constants.');
  };

  // Dynamic Trapped Cash Statistics Aggregated from State
  const totalTrappedCapital = useMemo(() => {
    return cashAssets.reduce((sum, item) => sum + item.amountTrapped, 0);
  }, [cashAssets]);

  const totalRecoverableCapital = useMemo(() => {
    return cashAssets.reduce((sum, item) => sum + item.potentialCashRecoverable, 0);
  }, [cashAssets]);

  const liquidityScore = useMemo(() => {
    const score = Math.max(35, Math.min(95, 100 - Math.round(totalTrappedCapital / 1000) - 8));
    return score;
  }, [totalTrappedCapital]);

  // Pillar 1: Dead & Slow Finished Goods
  const deadFinishedGoodsVal = useMemo(() => {
    return cashAssets
      .filter(i => i.category === 'Finished Goods')
      .reduce((sum, i) => sum + i.amountTrapped, 0);
  }, [cashAssets]);

  // Pillar 2: Surplus Raw Ingredients
  const surplusRawIngredientsVal = useMemo(() => {
    return cashAssets
      .filter(i => i.category === 'Raw Material')
      .reduce((sum, i) => sum + i.amountTrapped, 0);
  }, [cashAssets]);

  // Pillar 3: Aged Accounts Receivable
  const agedReceivablesVal = useMemo(() => {
    return cashAssets
      .filter(i => i.category === 'B2B Invoice')
      .reduce((sum, i) => sum + i.amountTrapped, 0);
  }, [cashAssets]);

  // Pillar 4: Unoptimized Supplier Payment Terms
  const unoptimizedPayablesVal = useMemo(() => {
    return cashAssets
      .filter(i => i.category === 'Supplier Terms')
      .reduce((sum, i) => sum + i.amountTrapped, 0);
  }, [cashAssets]);

  // Dynamic Filtered Table Matrix
  const filteredMatrixItems = useMemo(() => {
    return cashAssets.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.recommendedAction.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.skuCode && item.skuCode.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [cashAssets, searchTerm, categoryFilter]);

  // Handle Execute Recovery Trigger
  const handleExecuteRecovery = (item: TrappedCashAsset) => {
    setSelectedRecoveryItem(item);
  };

  const handleConfirmRecoveryAction = () => {
    if (!selectedRecoveryItem) return;

    // Dynamically update cashAssets state by executing recovery
    setCashAssets(prev => prev.filter(a => a.id !== selectedRecoveryItem.id));

    toast.success(`Recovery Protocol Executed for ${selectedRecoveryItem.name}!`, {
      description: `Action: "${selectedRecoveryItem.recommendedAction}". Unlocked $${selectedRecoveryItem.potentialCashRecoverable.toLocaleString()} in working capital.`
    });
    setSelectedRecoveryItem(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto pb-24"
    >
      <SubPageHeader 
        title="Trapped Cash Audit & Capital Recovery"
        parentTitle="Financial Integrity"
        onBack={() => navigate('/')}
        description="Identify illiquid raw materials, slow-moving inventory, aged receivables, and optimize cash conversion cycles."
      />

      <DashboardBanner 
        title="Capital Liberation Engine"
        subtitle="Turn dormant stock and delayed wholesale invoices into immediate working capital."
        badge="Trapped Cash Audit 2.0 Active"
      />

      {/* TRAPPED CASH HEADLINE BANNER */}
      <Card className="luxury-card p-6 sm:p-10 bg-black/60 backdrop-blur-2xl border-white/10 rounded-[3rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-[#C5A059] pointer-events-none">
          <DollarSign size={200} />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-amber-400/80 uppercase font-bold tracking-[0.2em]">
              <Sparkles size={16} className="text-[#C5A059]" /> Total Illiquid Capital Identified
            </div>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-sans tracking-tight">
              ${totalTrappedCapital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/50 font-serif italic font-light">
              Potential Recoverable Working Capital: <span className="text-emerald-400 font-bold not-italic">${totalRecoverableCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </p>
          </div>

          <div className="w-full lg:w-72 bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60 font-bold uppercase tracking-wider">Liquidity Circulation Score</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">{liquidityScore}/100</span>
            </div>

            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${liquidityScore}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${liquidityScore >= 70 ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]' : 'bg-amber-400 shadow-[0_0_12px_#fbbf24]'}`}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-white/40">
              <span>Low Liquidity</span>
              <span className="text-emerald-400 font-bold">Moderate Efficiency</span>
              <span>Optimal</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Button 
              onClick={handleResetMockData}
              variant="secondary"
              className="w-full sm:w-auto rounded-full text-xs font-bold uppercase tracking-wider py-3.5 px-5 flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} /> Reset Data
            </Button>
            <Button 
              onClick={() => setShowStrategyModal(true)}
              className="w-full sm:w-auto bg-[#6A2C91] hover:bg-[#5a257a] text-white py-4 px-8 rounded-full text-xs font-bold uppercase tracking-[0.15em] shadow-2xl shadow-[#6A2C91]/40 flex items-center justify-center gap-3"
            >
              <Unlock size={18} className="text-[#C5A059]" /> Unlock Strategy
            </Button>
          </div>
        </div>
      </Card>

      {/* KEY BREAKDOWN CARDS (THE 4 PILLARS OF TRAPPED CASH) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2.5rem] flex flex-col justify-between hover:border-purple-500/40 transition-all group">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">1. Slow Finished Goods</span>
              <GlassHaloIcon icon={Package} color="magenta" size="sm" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 mb-2 font-sans tracking-tight">
              ${deadFinishedGoodsVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/50 font-serif italic mb-4">Stock with no sales in &gt;60/90 days.</p>
          </div>
          <Button 
            onClick={() => setActiveActionModal('clearance')}
            className="w-full bg-white/10 hover:bg-[#6A2C91] text-white border-none rounded-xl text-[10px] font-bold uppercase tracking-widest py-2.5 flex items-center justify-center gap-2"
          >
            <Tag size={14} /> Create Clearance Promo
          </Button>
        </Card>

        <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2.5rem] flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">2. Surplus Raw Botanicals</span>
              <GlassHaloIcon icon={Factory} color="cyan" size="sm" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 mb-2 font-sans tracking-tight">
              ${surplusRawIngredientsVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/50 font-serif italic mb-4">Excess raw stock &gt;120 days demand.</p>
          </div>
          <Button 
            onClick={() => setActiveActionModal('batch')}
            className="w-full bg-white/10 hover:bg-[#06B6D4] text-white border-none rounded-xl text-[10px] font-bold uppercase tracking-widest py-2.5 flex items-center justify-center gap-2"
          >
            <Factory size={14} /> Schedule Production Run
          </Button>
        </Card>

        <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2.5rem] flex flex-col justify-between hover:border-[#C5A059]/40 transition-all group">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">3. Aged Accounts Receivable</span>
              <GlassHaloIcon icon={Users} color="gold" size="sm" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#C5A059] mb-2 font-sans tracking-tight">
              ${agedReceivablesVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/50 font-serif italic mb-4">Wholesale/B2B invoices past 30+ days.</p>
          </div>
          <Button 
            onClick={() => setActiveActionModal('invoice')}
            className="w-full bg-white/10 hover:bg-[#C5A059] text-white border-none rounded-xl text-[10px] font-bold uppercase tracking-widest py-2.5 flex items-center justify-center gap-2"
          >
            <Mail size={14} /> Send Payment Reminder
          </Button>
        </Card>

        <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2.5rem] flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">4. Vendor Terms Optimization</span>
              <GlassHaloIcon icon={CreditCard} color="emerald" size="sm" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mb-2 font-sans tracking-tight">
              ${unoptimizedPayablesVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/50 font-serif italic mb-4">Early vendor payouts without term leverage.</p>
          </div>
          <Button 
            onClick={() => setActiveActionModal('terms')}
            className="w-full bg-white/10 hover:bg-emerald-600 text-white border-none rounded-xl text-[10px] font-bold uppercase tracking-widest py-2.5 flex items-center justify-center gap-2"
          >
            <FileText size={14} /> Negotiate Terms Template
          </Button>
        </Card>
      </div>

      {/* DYNAMIC TRAPPED CASH MATRIX & DIAGNOSTIC TABLE */}
      <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2.5rem] space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl text-white font-display font-medium uppercase tracking-widest">Trapped Capital Diagnostic Matrix</h3>
            <p className="text-xs text-white/40">Prioritized asset liquidation, invoice collection, and carrying cost recovery.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-3 text-white/40" />
              <Input 
                placeholder="Search illiquid asset..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-black/60 border-white/10 text-white rounded-full text-xs py-2"
              />
            </div>

            <Select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as TrappedCategory)}
              className="bg-black/60 border-white/10 text-white rounded-full text-xs py-2 px-4 w-auto"
            >
              <option value="All" className="bg-black text-white">All Classifications</option>
              <option value="Raw Material" className="bg-black text-white">Raw Material</option>
              <option value="Finished Goods" className="bg-black text-white">Finished Goods</option>
              <option value="B2B Invoice" className="bg-black text-white">B2B Invoice</option>
              <option value="Supplier Terms" className="bg-black text-white">Supplier Terms</option>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em]">
                <th className="py-4 pl-4">Asset / Category Name</th>
                <th className="py-4">Classification</th>
                <th className="py-4">Dollars Trapped</th>
                <th className="py-4">Holding Time</th>
                <th className="py-4">Monthly Carrying Loss</th>
                <th className="py-4">Recommended Unlocking Action</th>
                <th className="py-4">Potential Recoverable</th>
                <th className="py-4 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatrixItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-white/40 text-sm italic">
                    No trapped capital assets match search criteria.
                  </td>
                </tr>
              ) : (
                filteredMatrixItems.map(item => {
                  let badgeColor: 'cyan' | 'purple' | 'gold' | 'amber' = 'cyan';
                  if (item.category === 'Finished Goods') badgeColor = 'purple';
                  if (item.category === 'B2B Invoice') badgeColor = 'gold';
                  if (item.category === 'Supplier Terms') badgeColor = 'amber';

                  return (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-4 pl-4">
                        <div className="text-white text-sm font-bold group-hover:text-[#C5A059] transition-colors">{item.name}</div>
                        <div className="text-[10px] text-white/40 font-mono">{item.skuCode} &bull; {item.clientOrSupplier}</div>
                      </td>

                      <td className="py-4">
                        <Badge color={badgeColor} className="text-[9px] px-2.5 py-1 uppercase font-bold tracking-wider">
                          {item.category}
                        </Badge>
                      </td>

                      <td className="py-4 font-mono text-sm text-red-400 font-bold">
                        ${item.amountTrapped.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-4 font-mono text-xs text-white/70">
                        {item.daysIdle} Days Idle
                      </td>

                      <td className="py-4 font-mono text-xs text-amber-400 font-bold">
                        -${item.monthlyCarryingCost.toFixed(2)}/mo
                      </td>

                      <td className="py-4 text-xs text-white/80 max-w-xs leading-snug font-medium">
                        {item.recommendedAction}
                      </td>

                      <td className="py-4 font-mono text-sm text-emerald-400 font-bold">
                        ${item.potentialCashRecoverable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-4 text-right pr-4">
                        <Button 
                          onClick={() => handleExecuteRecovery(item)}
                          className="h-8 bg-white/10 hover:bg-[#6A2C91] text-white border-none rounded-xl text-[9px] font-bold uppercase tracking-widest px-3 transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <Zap size={12} className="text-[#C5A059]" /> Execute Recovery
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CASH RECOVERY ACTION PLAN MODAL */}
      <Modal
        isOpen={!!selectedRecoveryItem}
        onClose={() => setSelectedRecoveryItem(null)}
        title="Execute Recovery Action Plan"
      >
        {selectedRecoveryItem && (
          <div className="space-y-6 p-2">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#6A2C91]/20 border border-[#6A2C91]/40 flex items-center justify-center shrink-0">
                <Zap size={24} className="text-[#C5A059]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">{selectedRecoveryItem.name}</h4>
                <p className="text-xs text-white/50 font-mono">{selectedRecoveryItem.category} &bull; Days Idle: {selectedRecoveryItem.daysIdle}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl">
                <span className="text-white/40 block mb-1">Trapped Capital</span>
                <span className="text-red-400 font-bold font-mono text-sm">${selectedRecoveryItem.amountTrapped.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl">
                <span className="text-white/40 block mb-1">Potential Recoverable</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">${selectedRecoveryItem.potentialCashRecoverable.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold text-white/60 uppercase tracking-wider">Step-by-Step Resolution Directive:</h5>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#6A2C91] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                  <div className="text-white/80">
                    <span className="font-bold text-white block">Recommended Strategy:</span>
                    {selectedRecoveryItem.recommendedAction}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#6A2C91] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                  <div className="text-white/80">
                    <span className="font-bold text-white block">Automated Dispatch Protocol:</span>
                    System will automatically configure Shopify discount codes, draft B2B invoice collection emails, or schedule production batch allocations.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button onClick={() => setSelectedRecoveryItem(null)} variant="secondary" className="rounded-xl px-5 py-2 text-xs">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmRecoveryAction}
                className="bg-[#6A2C91] hover:bg-[#5a257a] text-white rounded-xl px-6 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <CheckCircle2 size={14} /> Execute Strategy
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Pillar Action Trigger Modals */}
      <Modal
        isOpen={activeActionModal === 'clearance'}
        onClose={() => setActiveActionModal(null)}
        title="Create Clearance Promo / Bundle"
      >
        <div className="space-y-6 p-2 text-xs">
          <p className="text-white/70">
            Generate an automated 25%-35% clearance bundle campaign on Shopify / Etsy for slow-moving finished goods idle &gt;60 days.
          </p>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
            <div className="text-white font-bold text-sm">Active Bundle Selection:</div>
            <div className="text-purple-300 font-mono">Holiday Edition Botanical Soap Gift Sets (150 Units)</div>
            <div className="text-white/50">Calculated Clearance Price: <span className="text-emerald-400 font-bold">$18.75 / bundle (25% Off)</span></div>
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setActiveActionModal(null)} variant="secondary">Cancel</Button>
            <Button 
              onClick={() => {
                setActiveActionModal(null);
                toast.success('Clearance promo campaign launched successfully on connected channels!');
              }} 
              className="bg-[#6A2C91] text-white"
            >
              Launch Promo Campaign
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeActionModal === 'batch'}
        onClose={() => setActiveActionModal(null)}
        title="Schedule Formulation Production Run"
      >
        <div className="space-y-6 p-2 text-xs">
          <p className="text-white/70">
            Convert surplus raw botanical stock into high-demand finished goods before expiration.
          </p>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
            <div className="text-white font-bold text-sm">Selected Surplus Component:</div>
            <div className="text-cyan-300 font-mono">Butterfly Pea Flower Extract (20kg)</div>
            <div className="text-white/50">Target Output Recipe: <span className="text-emerald-400 font-bold">Calming Botanical Facial Salve (250 Jars)</span></div>
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setActiveActionModal(null)} variant="secondary">Cancel</Button>
            <Button 
              onClick={() => {
                setActiveActionModal(null);
                navigate('/recipes');
                toast.success('Navigated to Recipe Lab to finalize batch allocation.');
              }} 
              className="bg-[#06B6D4] text-white"
            >
              Proceed to Recipe Lab
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeActionModal === 'invoice'}
        onClose={() => setActiveActionModal(null)}
        title="Send Automated B2B Payment Reminder"
      >
        <div className="space-y-6 p-2 text-xs">
          <p className="text-white/70">
            Dispatch automated email reminder with Stripe/Square 1-click payment link to wholesale accounts past 30+ days.
          </p>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
            <div className="text-white font-bold text-sm">Target B2B Account:</div>
            <div className="text-[#C5A059] font-mono">Apothecary Goods Co. (Invoice #1042 - $8,600.00)</div>
            <div className="text-white/50">Status: <span className="text-amber-400 font-bold">45 Days Past Due</span></div>
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setActiveActionModal(null)} variant="secondary">Cancel</Button>
            <Button 
              onClick={() => {
                setActiveActionModal(null);
                toast.success('Automated payment reminder & link sent to Apothecary Goods Co.!');
              }} 
              className="bg-[#C5A059] text-white"
            >
              Dispatch Reminder Email
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeActionModal === 'terms'}
        onClose={() => setActiveActionModal(null)}
        title="Negotiate Vendor Payment Terms"
      >
        <div className="space-y-6 p-2 text-xs">
          <p className="text-white/70">
            Draft formal Net-30 / Net-45 credit term negotiation request to vendor to defer cash outlays.
          </p>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
            <div className="text-white font-bold text-sm">Vendor Target:</div>
            <div className="text-emerald-300 font-mono">Ghana Soapcraft Co-op (Shea Butter Deposits)</div>
            <div className="text-white/50">Proposed Terms: <span className="text-emerald-400 font-bold">Net-45 Days (Preserves $5,800 working capital)</span></div>
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setActiveActionModal(null)} variant="secondary">Cancel</Button>
            <Button 
              onClick={() => {
                setActiveActionModal(null);
                toast.success('Vendor term negotiation template generated and queued for vendor!');
              }} 
              className="bg-emerald-600 text-white"
            >
              Generate Terms Draft
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
