import React, { useState } from 'react';
import { ContextualTutorialModal } from './ContextualTutorialModal';
import { Badge, Button, Input, Modal, VaultBanner } from './UI';
import { Search, Mail, MapPin, Users, TrendingUp, DollarSign, ShoppingCart, Package, RefreshCw, ArrowLeft, Calendar, UserPlus, Sparkles } from 'lucide-react';
import { useArtisanData } from './DataContext';
import { useNavigate } from 'react-router-dom';
import { SubPageHeader } from './SubPageHeader';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { UpgradeModal } from './UpgradeModal';
import { GlassHaloIcon } from './ui/GlassHaloIcon';

export const CRM = () => {
  const { orders, manualCustomers, addManualCustomer, getTotalRevenue, userTier } = useArtisanData();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', email: '', location: '' });
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Derived Customers from Orders + Manual
  const orderCustomers = Array.from(new Set(orders.map(o => o.customer))).map((name: string) => {
      const customerOrders = orders.filter(o => o.customer === name);
      const lastOrder = customerOrders[0];
      const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);

      return {
          id: `O-${name}`,
          name,
          email: lastOrder?.email || 'N/A',
          location: lastOrder?.location || 'Unknown',
          initial: name.charAt(0),
          color: 'bg-[#6A2C91]',
          totalSpent,
          orderCount: customerOrders.length,
          orders: customerOrders,
          type: 'Ordered'
      };
  });

  const processedManualCustomers = manualCustomers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      location: c.location,
      initial: c.name.charAt(0),
      color: 'bg-[#C5A059]',
      totalSpent: 0,
      orderCount: 0,
      orders: [],
      type: 'Manual Node'
  }));

  const allCustomers = [...orderCustomers, ...processedManualCustomers];

  const handleSync = () => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleAddManual = () => {
      if (userTier === 'Free Audit' && allCustomers.length >= 25) {
          setIsAddModalOpen(false);
          setShowUpgradeModal(true);
          return;
      }
      if (!newCust.name || !newCust.email) return;
      addManualCustomer(newCust);
      const tempId = `M-${Date.now()}`; 
      setJustAddedId(tempId);
      setNewCust({ name: '', email: '', location: '' });
      setIsAddModalOpen(false);
      setTimeout(() => setJustAddedId(null), 3000);
  };

  // --- CUSTOMER DETAIL VIEW ---
  if (selectedCustomer) {
      const customer = allCustomers.find(c => c.name === selectedCustomer);
      if (!customer) return null;

      return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-10 space-y-12 pb-20 max-w-[1600px] mx-auto"
          >
            <ContextualTutorialModal
                hubId="crm"
                title="CRM Hub"
                description="Manage your client relationships and sales pipeline."
                steps={["Track B2B and B2C clients.","Monitor deal stages and revenue probabilities.","Send personalized communications."]}
            />
              <SubPageHeader 
                title={customer.name}
                parentTitle="CRM Hub"
                onBack={() => setSelectedCustomer(null)}
                description={`Detailed interaction ledger for ${customer.name}.`}
                actions={
                  <Button 
                    onClick={() => toast.info("Edit Customer functionality coming soon.")}
                    className="bg-white/10 hover:bg-white/20 text-white h-12 px-6 rounded-2xl font-sans font-medium text-[10px] uppercase tracking-[0.2em] transition-all border border-white/10"
                  >
                    Edit Node
                  </Button>
                }
              />

              <div className="luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-16 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 opacity-5 rounded-bl-full -mr-20 -mt-20 group-hover:opacity-10 transition-opacity duration-1000"></div>
                  <div className="flex items-center gap-4 sm:p-10 relative z-10">
                      <div className={`w-32 h-32 ${customer.color} bg-opacity-20 rounded-[2rem] flex items-center justify-center text-white text-5xl font-serif shadow-inner border border-white/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-700`}>
                          {customer.initial}
                      </div>
                      <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                             <h1 className="text-6xl font-serif text-white tracking-tighter">{customer.name}</h1>
                             <Badge color={customer.type === 'Ordered' ? 'purple' : 'gold'} className="px-4 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.3em]">{customer.type}</Badge>
                          </div>
                          <div className="flex gap-4 sm:p-8 text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.3em]">
                              <span className="flex items-center gap-3"><Mail size={16} className="text-[#6A2C91]"/> {customer.email}</span>
                              <span className="flex items-center gap-3"><MapPin size={16} className="text-[#C5A059]"/> {customer.location}</span>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-[11px] text-white/40 uppercase font-sans font-bold tracking-[0.3em] mb-3">Lifetime Value</p>
                          <p className="text-7xl font-serif text-white tracking-tighter">${customer.totalSpent.toFixed(2)}</p>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-10">
                  <div className="luxury-card bg-white/5 border border-white/10 rounded-[3rem] p-4 sm:p-12">
                      <h3 className="text-2xl font-serif text-white tracking-tight mb-8">Activity Ledger</h3>
                      <div className="space-y-4">
                          {customer.orders.length > 0 ? customer.orders.map(order => (
                              <div key={order.id} className="flex justify-between items-center p-6 bg-black/40 rounded-[2rem] border border-white/5 hover:border-[#6A2C91]/50 transition-all duration-500 group">
                                  <div>
                                      <p className="font-sans font-bold text-white uppercase text-[11px] tracking-[0.2em] mb-2">Order {order.id}</p>
                                      <p className="text-[10px] text-white/30 font-sans uppercase tracking-[0.2em] flex items-center gap-2"><Calendar size={12}/> {order.date}</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="font-serif text-white text-3xl tracking-tight mb-2">${order.total.toFixed(2)}</p>
                                      <Badge color={order.status === 'Delivered' ? 'green' : 'blue'} className="text-[9px] uppercase tracking-widest">{order.status}</Badge>
                                  </div>
                              </div>
                          )) : (
                              <div className="py-16 text-center bg-black/20 rounded-[2rem] border border-dashed border-white/10">
                                 <Package size={48} className="text-white/10 mx-auto mb-6" strokeWidth={0.5} />
                                 <p className="text-white/30 text-[11px] font-sans font-bold uppercase tracking-[0.3em]">No Transactional History</p>
                              </div>
                          )}
                      </div>
                  </div>
                  
                  <div className="luxury-card bg-white/5 border border-white/10 rounded-[3rem] p-4 sm:p-12 flex flex-col">
                      <h3 className="text-2xl font-serif text-white tracking-tight mb-8">Node Metadata</h3>
                      <div className="space-y-8 flex-1">
                          <div className="grid grid-cols-2 gap-6">
                              <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5">
                                <p className="text-[10px] text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-3">First Interaction</p>
                                <p className="font-serif tracking-tight text-white text-2xl">{customer.orders.length > 0 ? customer.orders[customer.orders.length-1].date : 'Today'}</p>
                              </div>
                              <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5">
                                <p className="text-[10px] text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-3">Latest Update</p>
                                <p className="font-serif tracking-tight text-white text-2xl">{customer.orders.length > 0 ? customer.orders[0].date : 'Today'}</p>
                              </div>
                          </div>
                          
                          <div className="bg-[#6A2C91]/10 p-4 sm:p-8 rounded-[2rem] border border-[#6A2C91]/20 mt-auto">
                              <p className="text-[11px] text-[#C5A059] font-sans font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                  <Sparkles size={16} /> Vault Strategy Insight
                              </p>
                              <p className="text-sm font-sans font-light text-white/80 leading-relaxed italic">
                                  "Customer shows high affinity for Skincare categories. Recommend 'Last Chance' email for midnight serum restock."
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </motion.div>
      );
  }

  // --- OVERVIEW ---
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-4 sm:p-10 space-y-12 pb-20 max-w-[1600px] mx-auto"
    >
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Initialize Vault Node">
            <div className="space-y-8 p-4">
                <div className="space-y-3">
                    <label className="text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                    <Input placeholder="Artisan Client Name" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-[#6A2C91] text-white" />
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Secure Email Address</label>
                    <Input placeholder="client@synaptic.com" value={newCust.email} onChange={e => setNewCust({...newCust, email: e.target.value})} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-[#6A2C91] text-white" />
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Geographic Location</label>
                    <Input placeholder="City, State / Global" value={newCust.location} onChange={e => setNewCust({...newCust, location: e.target.value})} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-[#6A2C91] text-white" />
                </div>
                <Button className="w-full bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 rounded-full font-sans font-bold text-[11px] tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 mt-8 transition-all" onClick={handleAddManual}>
                    AUTHORIZE NODE CREATION
                </Button>
            </div>
        </Modal>

        <div className="flex flex-col gap-4 sm:p-8">
          <SubPageHeader 
            title="CRM Hub"
            parentTitle="Operations Hub"
            onBack={() => navigate('/operations')}
            description="Synaptic client management and lifetime value analytics."
          />
          
          <VaultBanner 
            title="CRM Hub"
            subtitle="Synaptic client management and lifetime value analytics."
            badge="Client Protocol Active"
          >
            <div className="flex flex-col sm:flex-row gap-4 sticky bottom-4 z-50 md:static p-4 md:p-0 bg-[#0A0A0A]/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border border-white/10 md:border-none rounded-3xl md:rounded-none shadow-2xl md:shadow-none w-full sm:w-auto">
                <Button 
                    variant="outline" 
                    className="rounded-full border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-md text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 transition-all shadow-sm w-full sm:w-auto" 
                    onClick={handleSync} 
                    disabled={isSyncing}
                >
                    <RefreshCw size={16} className={isSyncing ? "animate-spin mr-3" : "mr-3"} /> {isSyncing ? "SYNCING..." : "SYNC FROM ORDERS"}
                </Button>
                <Button 
                    variant="primary" 
                    className="rounded-full bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 shadow-2xl shadow-black/10 transition-all w-full sm:w-auto" 
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <UserPlus size={16} className="mr-3" /> ADD MANUAL NODE
                </Button>
            </div>
          </VaultBanner>
        </div>

        {/* KPI Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:p-8">
            {[
              { label: 'Active Nodes', val: allCustomers.length, icon: Users, color: 'purple' },
              { label: 'Network Value', val: `$${getTotalRevenue().toFixed(0)}`, icon: DollarSign, color: 'gold' },
              { label: 'Synaptic Health', val: '98%', icon: TrendingUp, color: 'emerald' },
              { label: 'At Risk', val: '0', icon: ShoppingCart, color: 'magenta' }
            ].map((kpi, i) => (
              <div key={i} className="luxury-card bg-white/5 border border-white/10 rounded-[2.5rem] p-4 sm:p-10 flex flex-col items-start group hover:border-white/20 transition-all shadow-sm hover:shadow-2xl">
                <GlassHaloIcon icon={kpi.icon} color={kpi.color as any} size="lg" className="mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 z-10" />
                <p className="text-[11px] text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-2">{kpi.label}</p>
                <p className="text-4xl font-serif text-white tracking-tighter">{kpi.val}</p>
              </div>
            ))}
        </div>

        {/* Customer List */}
        <div className="space-y-10">
            <div className="relative group max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#C5A059] transition-colors" size={20} />
                <Input placeholder="Scan for nodes by name, email, or metadata..." className="pl-16 py-6 rounded-[2rem] bg-black/40 border border-white/10 focus:border-[#C5A059] focus:ring-[#C5A059]/20 text-white font-sans text-sm shadow-inner transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:p-10">
                {allCustomers.map((c, i) => (
                    <div 
                        key={c.id} 
                        onClick={() => setSelectedCustomer(c.name)}
                        className={`luxury-card bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden ${justAddedId && c.id.includes('M-') ? 'animate-soft-success border-emerald-500/50 shadow-emerald-500/10' : 'hover:border-white/20 hover:bg-white/10'}`}
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="flex gap-6 items-center">
                                <div className={`w-16 h-16 ${c.color} bg-opacity-20 rounded-2xl flex items-center justify-center text-white font-serif text-2xl shadow-inner border border-white/10 group-hover:scale-105 transition-transform duration-500`}>
                                    {c.initial}
                                </div>
                                <div>
                                    <h3 className="font-serif text-white text-2xl tracking-tight group-hover:text-[#C5A059] transition-colors">{c.name}</h3>
                                    <Badge color={c.type === 'Ordered' ? 'purple' : 'gold'} className="text-[8px] uppercase font-sans font-bold tracking-[0.3em] px-3 py-1 mt-2 shadow-sm">{c.type}</Badge>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4 text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.3em] mb-10 relative z-10">
                            <div className="flex items-center gap-4"><Mail size={16} className="text-[#6A2C91]"/> {c.email}</div>
                            <div className="flex items-center gap-4"><MapPin size={16} className="text-[#C5A059]"/> {c.location}</div>
                        </div>
                        
                        <div className="pt-8 border-t border-white/10 flex justify-between items-end relative z-10 group-hover:border-white/20 transition-colors">
                            <div>
                                <p className="text-[10px] text-white/30 font-sans font-bold uppercase tracking-[0.3em] mb-2">Order Nodes</p>
                                <p className="font-serif text-white text-xl">{c.orderCount}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-white/30 font-sans font-bold uppercase tracking-[0.3em] mb-2">Lifetime Value</p>
                                <p className="font-serif text-[#C5A059] text-3xl tracking-tighter">${c.totalSpent.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)}
                featureName="CRM Contacts"
                currentLimit={25}
                requiredTier="Artisan Flow Basic"
            />
        </div>
    </motion.div>
  );
};
