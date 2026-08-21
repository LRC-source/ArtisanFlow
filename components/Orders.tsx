import React, { useState, useEffect } from 'react';
import { ContextualTutorialModal } from './ContextualTutorialModal';
import { Card, Button, Badge, Input, Select, VaultBanner } from './UI';
import { Search, Filter, ShoppingCart, DollarSign, Package, Truck, User, MapPin, Calendar, CheckCircle, Download, RefreshCw, AlertCircle, X, ChevronRight, ArrowLeft } from 'lucide-react';
import { useArtisanData } from './DataContext';
import { useNavigate } from 'react-router-dom';
import { SubPageHeader } from './SubPageHeader';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { GlassHaloIcon } from './ui/GlassHaloIcon';

export const Orders = () => {
  const { orders, processOrder, getTotalRevenue, syncWooCommerce, integrations } = useArtisanData();
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [processedId, setProcessedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const navigate = useNavigate();

  const wooIntegration = integrations.find(i => i.name === 'WooCommerce');
  const isWooConnected = wooIntegration?.status === 'Connected';

  const filteredOrders = orders.filter(order => {
      const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All Status' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter(o => o.status === 'Processing').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleProcess = (id: string) => {
    processOrder(id);
    setProcessedId(id);
    setToast({ message: "Order processed. Breathing into growth.", type: 'success' });
    setTimeout(() => setProcessedId(null), 3000);
  };

  const handleSync = async () => {
      if (!isWooConnected) {
          setToast({ message: 'WooCommerce is not connected. Please visit Settings > Integrations.', type: 'error' });
          return;
      }
      setIsSyncing(true);
      setToast({ message: 'Establishing secure handshake with WooCommerce...', type: 'info' });
      const result = await syncWooCommerce();
      setIsSyncing(false);
      if (result.success) {
        setToast({ message: 'Sync complete. Systems harmonized.', type: 'success' });
      } else {
        setToast({ message: 'Handshake failed. Verify access keys.', type: 'error' });
      }
  };

  const handleExport = () => {
      setToast({ message: "Exporting ledger...", type: 'info' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-10 lg:space-y-12 pb-8 sm:pb-12 lg:pb-20 max-w-7xl mx-auto"
    >
        <ContextualTutorialModal
            hubId="orders"
            title="Orders Hub"
            description="Fulfill and track customer orders."
            steps={["Process incoming orders from all channels.","Generate shipping labels and track shipments.","Manage returns and refunds."]}
        />
        {/* Toast Notification Overlay */}
        {toast && (
          <div className="fixed top-4 sm:p-6 lg:p-8 right-8 z-[60] animate-in slide-in-from-right-10">
            <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border-l-4 min-w-[320px] backdrop-blur-xl ${
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 
              toast.type === 'error' ? 'bg-red-500/10 border-red-500 text-red-400' : 
              'bg-[#6A2C91]/20 border-[#6A2C91] text-purple-300'
            }`}>
              <div className={`p-1.5 rounded-full ${
                toast.type === 'success' ? 'bg-emerald-500/20' : 
                toast.type === 'error' ? 'bg-red-500/20' : 'bg-[#6A2C91]/40'
              }`}>
                {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              </div>
              <p className="text-sm sm:text-base font-sans font-medium flex-1">{toast.message}</p>
              <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100 transition-opacity"><X size={16}/></button>
            </div>
          </div>
        )}

        <SubPageHeader 
          title="Orders & Fulfillment"
          parentTitle="Operations Hub"
          onBack={() => navigate('/operations')}
          description="Omnichannel order management and synchronization."
        />

        <VaultBanner 
            title="Order Logistics"
            subtitle="Secure handling and dispatch of transactional nodes."
            badge="Fulfillment Protocol"
        >
            <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row gap-3 sm:gap-4 sticky bottom-4 z-50 md:static p-4 md:p-0 bg-[#0A0A0A]/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border border-white/10 md:border-none rounded-3xl md:rounded-none shadow-2xl md:shadow-none w-auto">
                <Button 
                    variant="outline" 
                    className="rounded-full border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-md text-white font-sans font-bold text-[11px] tracking-[0.2em] py-3 px-6 transition-all shadow-sm w-auto" 
                    onClick={handleSync} 
                    disabled={isSyncing}
                >
                    <RefreshCw size={16} className={isSyncing ? "animate-spin mr-3" : "mr-3"} /> {isSyncing ? "SYNCING..." : "SYNC STORE"}
                </Button>
                <Button 
                    variant="primary" 
                    className="rounded-full bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-bold text-[11px] tracking-[0.2em] py-3 px-6 shadow-2xl shadow-black/10 transition-all w-auto" 
                    onClick={handleExport}
                >
                    <Download size={16} className="mr-3" /> EXPORT CSV
                </Button>
            </div>
        </VaultBanner>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 sm:p-8">
            {[
              { label: 'Total Orders', val: orders.length, icon: ShoppingCart, color: 'purple' },
              { label: 'Revenue', val: `$${getTotalRevenue().toFixed(2)}`, icon: DollarSign, color: 'gold' },
              { label: 'Pending', val: pendingCount, icon: Package, color: 'magenta' },
              { label: 'Shipped', val: shippedCount, icon: Truck, color: 'emerald' }
            ].map((stat, i) => {
              const glowColors: any = {
                  cyan: 'hover:border-[#06B6D4]/50 hover:bg-[#06B6D4]/5 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]',
                  magenta: 'hover:border-[#D946EF]/50 hover:bg-[#D946EF]/5 hover:shadow-[0_0_40px_rgba(217,70,239,0.15)]',
                  emerald: 'hover:border-[#10B981]/50 hover:bg-[#10B981]/5 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
                  gold: 'hover:border-[#C5A059]/50 hover:bg-[#C5A059]/5 hover:shadow-[0_0_40px_rgba(197,160,89,0.15)]',
                  purple: 'hover:border-[#6A2C91]/50 hover:bg-[#6A2C91]/5 hover:shadow-[0_0_40px_rgba(106,44,145,0.15)]'
              };

              return (
              <div key={i} className={`luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-6 sm:p-8 relative overflow-hidden group transition-all duration-500 flex flex-col justify-between ${glowColors[stat.color]}`}>
                  <div className="absolute top-0 right-0 p-4 sm:p-5 lg:p-6 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                      <stat.icon size={120} className={`text-${stat.color === 'emerald' ? 'emerald-400' : stat.color === 'cyan' ? '[#06B6D4]' : stat.color === 'magenta' ? '[#D946EF]' : stat.color === 'purple' ? '[#6A2C91]' : '[#C5A059]'}`} />
                  </div>
                  <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 sm:gap-0 mb-12">
                      <span className="text-[11px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em] max-w-[60%] leading-relaxed">{stat.label}</span>
                      <GlassHaloIcon icon={stat.icon} color={stat.color as any} size="lg" className="group-hover:scale-110 transition-transform duration-500 z-10 shrink-0" />
                  </div>
                  <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{stat.val}</p>
              </div>
            )})}
        </div>

        {/* Orders Table Container */}
        <div className="space-y-10">
            <div className="flex flex-col md:flex-col sm:flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative group max-w-2xl flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white sm:text-white/40 group-focus-within:text-[#C5A059] transition-colors" size={20} />
                    <Input 
                        placeholder="Scan for orders by ID or customer..." 
                        className="pl-16 py-6 rounded-[2rem] bg-black/40 border border-white/10 focus:border-[#C5A059] focus:ring-[#C5A059]/20 text-white font-sans text-sm shadow-inner transition-all w-full" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select 
                        className="w-full sm:w-48 py-6 rounded-[2rem] bg-black/40 border border-white/10 text-white font-sans text-sm focus:border-[#C5A059] focus:ring-[#C5A059]/20 shadow-inner"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All Status" className="bg-[#1A1A1A]">All Status</option>
                        <option value="Processing" className="bg-[#1A1A1A]">Processing</option>
                        <option value="Shipped" className="bg-[#1A1A1A]">Shipped</option>
                        <option value="Delivered" className="bg-[#1A1A1A]">Delivered</option>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-6">
                {filteredOrders.length === 0 ? (
                    <div className="py-6 sm:py-12 lg:py-16 px-4 sm:px-8 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <Package size={64} className="text-white/10 mx-auto mb-6" strokeWidth={0.5} />
                        <h3 className="text-lg sm:text-2xl lg:text-3xl text-white sm:text-slate-400 leading-relaxed font-serif text-white tracking-tight mb-2">No Transactional History</h3>
                        <p className="text-sm sm:text-base text-[11px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-[0.3em]">Adjust your scan parameters.</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className={`luxury-card bg-white/5 p-4 sm:p-10 rounded-[3rem] border border-white/10 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden ${processedId === order.id ? 'animate-soft-success border-emerald-500/50 shadow-emerald-500/10' : 'hover:border-white/20'}`}>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
                            
                            <div className="flex flex-col lg:flex-col sm:flex-col sm:flex-row justify-between gap-3 sm:gap-6 relative z-10">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 sm:gap-4 mb-8">
                                        <Badge color={order.status === 'Processing' ? 'blue' : order.status === 'Shipped' ? 'purple' : 'green'} className="uppercase font-sans font-bold text-[10px] tracking-[0.3em] px-4 py-1.5 shadow-sm">
                                            {order.status}
                                        </Badge>
                                        <span className="text-[11px] font-bold font-sans text-white sm:text-white/40 uppercase tracking-[0.3em]">{order.platform}</span>
                                        <span className="text-[11px] text-white sm:text-white/60 font-mono tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5"># {order.id}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 sm:p-10">
                                        <div className="space-y-4">
                                            <p className="text-sm sm:text-base text-[11px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em]">Customer Node</p>
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[1rem] bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-serif text-sm sm:text-base md:text-3xl sm:text-5xl lg:text-7xl font-black border border-[#C5A059]/30 shadow-inner">
                                                    {order.customer.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{order.customer}</p>
                                                    <p className="text-sm sm:text-base text-[10px] text-white sm:text-white/40 font-sans uppercase tracking-[0.2em] mt-1">{order.location}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-sm sm:text-base text-[11px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em]">Manifest</p>
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center text-sm border-b border-white/5 pb-2">
                                                        <span className="text-white sm:text-white/60 font-sans font-light truncate max-w-[150px]">{item.name}</span>
                                                        <span className="text-[#C5A059] font-sans font-bold tracking-widest text-[11px]">x{item.qty}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4 lg:text-right">
                                            <p className="text-sm sm:text-base text-[11px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em]">Settlement</p>
                                            <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">${order.total.toFixed(2)}</p>
                                            <p className="text-sm sm:text-base text-[9px] text-emerald-400 font-sans font-bold uppercase tracking-[0.3em] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block">Fully Captured</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex lg:flex-col justify-end items-end gap-3 sm:gap-4 min-w-[200px]">
                                    {order.status === 'Processing' ? (
                                        <Button 
                                            className="w-full bg-[#6A2C91] text-white hover:bg-[#5a257a] w-auto mx-auto py-1 px-3 text-[10px] text-[11px] font-sans font-bold tracking-[0.3em] rounded-2xl shadow-xl shadow-[#6A2C91]/20 transition-all flex items-center justify-center gap-2 group/btn"
                                            onClick={() => handleProcess(order.id)}
                                        >
                                            AUTHORIZE FLOW <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-3 text-emerald-400 font-sans font-bold text-[11px] px-6 py-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 w-full justify-center tracking-[0.3em] uppercase shadow-inner">
                                            <CheckCircle size={16} strokeWidth={1.5} /> Dispatched
                                        </div>
                                    )}
                                    <Button onClick={() => setToast({ message: 'Syncing orders from Square...', type: 'info' })} variant="outline" className="w-full w-auto mx-auto py-1 px-3 text-[10px] text-[10px] font-sans font-bold border-white/10 text-white sm:text-white/40 hover:text-white hover:bg-white/5 hover:border-white/20 rounded-2xl tracking-[0.3em] uppercase transition-all shadow-sm">
                                        Manual Sync
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </motion.div>
  );
};
