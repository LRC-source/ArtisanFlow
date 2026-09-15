import React, { useState } from 'react';
import { ContextualTutorialModal } from './ContextualTutorialModal';
import { Badge, Button, Input, Modal, DashboardBanner } from './UI';
import { Search, Mail, MapPin, Users, TrendingUp, DollarSign, ShoppingCart, Package, RefreshCw, ArrowLeft, Calendar, UserPlus, Sparkles } from 'lucide-react';
import { useArtisanData } from './DataContext';
import { useNavigate } from 'react-router-dom';
import { SubPageHeader } from './SubPageHeader';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { UpgradeModal } from './UpgradeModal';
import { GlassHaloIcon } from './ui/GlassHaloIcon';

export const CRM = () => {
  const { orders, manualCustomers, addManualCustomer, deleteManualCustomer, getTotalRevenue, userTier } = useArtisanData();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', email: '', location: '' });
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

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
      id: c.id || `M-${Math.random()}`,
      name: c.name || 'Unknown',
      email: c.email || 'N/A',
      location: c.location || 'Unknown',
      initial: (c.name || 'U').charAt(0),
      color: 'bg-[#C5A059]',
      totalSpent: 0,
      orderCount: 0,
      orders: [],
      type: 'MANUAL ENTRY'
  }));

  const allCustomers = [...orderCustomers, ...processedManualCustomers];
  const filteredCustomers = allCustomers.filter(c => {
      const s = (searchTerm || '').toLowerCase();
      return (c.name || '').toLowerCase().includes(s) || 
             (c.email || '').toLowerCase().includes(s) ||
             (c.location || '').toLowerCase().includes(s);
  });

  const handleSync = () => {
      setIsSyncing(true);
      setTimeout(() => { setIsSyncing(false); toast.success("Customer list synchronized with active orders."); }, 2000);
  };

  const handleAddManual = () => {
      if (userTier === 'Free Trial' && allCustomers.length >= 25) {
          setIsAddModalOpen(false);
          setShowUpgradeModal(true);
          return;
      }
      if (!newCust.name || !newCust.email) {
          toast.error("Please provide both name and email.");
          return;
      }
      addManualCustomer(newCust);
      toast.success("Customer added successfully.");
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
            className="p-3.5 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 lg:space-y-12 pb-8 sm:pb-12 lg:pb-20 max-w-[1800px] mx-auto"
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
                    customer.id.startsWith('M-') ? (
                      <button 
                        onClick={() => setShowDeleteConfirm(customer.id)}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-200 w-auto mx-auto py-3 px-6 rounded-2xl font-sans font-medium text-[10px] uppercase tracking-[0.2em] transition-all border border-red-500/30 cursor-pointer pointer-events-auto"
                      >
                        Delete Customer
                      </button>
                    ) : (
                      <button 
                        onClick={() => toast.info("Cannot delete a customer with active orders.")}
                        className="bg-white/5 text-gray-500 w-auto mx-auto py-3 px-6 rounded-2xl font-sans font-medium text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5 cursor-not-allowed pointer-events-auto"
                      >
                        Orders Active
                      </button>
                    )
                  }
              />

              <div className="luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-6 sm:p-16 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-80 h-[200px] sm:h-80 bg-purple-500 opacity-5 rounded-bl-full -mr-20 -mt-8 sm:mt-12 lg:mt-20 group-hover:opacity-10 transition-opacity duration-1000"></div>
                  <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 relative z-10">
                      <div className={`w-32 h-32 ${customer.color} bg-opacity-20 rounded-[2rem] flex items-center justify-center text-white text-sm sm:text-base md:text-3xl sm:text-5xl lg:text-7xl font-black sm:text-4xl lg:text-5xl font-serif shadow-inner border border-white/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-700 shrink-0`}>
                          {customer.initial}
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 min-w-0">
                             <h1 className="text-5xl md:text-7xl text-white leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] mb-6 font-serif font-bold">{customer.name}</h1>
                             <Badge color={customer.type === 'Ordered' ? 'purple' : 'gold'} className="px-4 py-1 text-[10px] uppercase shrink-0 font-cta font-semibold tracking-[0.08em]">{customer.type}</Badge>
                          </div>
                          <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center gap-3 w-auto sm:p-8 text-[11px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-[0.3em] min-w-0">
                              <span className="flex items-center gap-3 break-words max-w-full"><Mail size={16} className="text-[#6A2C91] shrink-0"/> <span className="break-words">{customer.email}</span></span>
                              <span className="flex items-center gap-3 break-words max-w-full"><MapPin size={16} className="text-[#C5A059] shrink-0"/> <span className="break-words">{customer.location}</span></span>
                          </div>
                      </div>
                      <div className="text-right shrink-0 mt-6 sm:mt-0">
                          <p className="text-[11px] text-white sm:text-white/40 uppercase font-sans font-bold tracking-[0.3em] mb-3">Lifetime Value</p>
                          <p className="text-sm sm:text-base font-black tracking-tight text-white mb-4 font-sans">${customer.totalSpent.toFixed(2)}</p>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 sm:p-10">
                  <div className="luxury-card bg-white/5 border border-white/10 rounded-[3rem] p-4 sm:p-12">
                      <h3 className="text-lg sm:text-2xl lg:text-3xl text-white mb-4 font-display font-medium uppercase tracking-widest">Activity Ledger</h3>
                      <div className="space-y-4">
                          {customer.orders.length > 0 ? customer.orders.map(order => (
                              <div key={order.id} className="flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-black/40 rounded-[2rem] border border-white/5 hover:border-[#6A2C91]/50 transition-all duration-500 group">
                                  <div>
                                      <p className="text-sm sm:text-base font-sans font-bold text-white uppercase text-[11px] tracking-[0.2em] mb-2">Order {order.id}</p>
                                      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 font-serif italic font-light"><Calendar size={12}/> {order.date}</p>
                                  </div>
                                  <div className="text-right mt-4 sm:mt-0">
                                      <p className="text-sm sm:text-base text-white font-black tracking-tight mb-2 font-sans">${order.total.toFixed(2)}</p>
                                      <Badge color={order.status === 'Delivered' ? 'green' : 'blue'} className="text-[9px] uppercase font-cta font-semibold tracking-[0.08em]">{order.status}</Badge>
                                  </div>
                              </div>
                          )) : (
                              <div className="py-6 sm:py-12 lg:py-16 px-4 sm:px-8 text-center bg-black/20 rounded-[2rem] border border-dashed border-white/10">
                                 <Package size={48} className="text-white/10 mx-auto mb-6" strokeWidth={0.5} />
                                 <p className="text-sm sm:text-base text-white/30 text-[11px] uppercase tracking-[0.3em] font-serif italic font-light">No Transactional History</p>
                              </div>
                          )}
                      </div>
                  </div>
                  
                  <div className="luxury-card bg-white/5 border border-white/10 rounded-[3rem] p-4 sm:p-12 flex flex-col">
                      <h3 className="text-lg sm:text-2xl lg:text-3xl text-white mb-4 font-display font-medium uppercase tracking-widest">Customer Details</h3>
                      <div className="space-y-8 flex-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                              <div className="bg-black/40 p-4 sm:p-6 rounded-[2rem] border border-white/5">
                                <p className="text-[10px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-3">First Interaction</p>
                                <p className="text-sm sm:text-base tracking-tight text-white font-black font-sans">{customer.orders.length > 0 ? customer.orders[customer.orders.length-1].date : 'Today'}</p>
                              </div>
                              <div className="bg-black/40 p-4 sm:p-6 rounded-[2rem] border border-white/5">
                                <p className="text-[10px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-3">Latest Update</p>
                                <p className="text-sm sm:text-base tracking-tight text-white font-black font-sans">{customer.orders.length > 0 ? customer.orders[0].date : 'Today'}</p>
                              </div>
                          </div>
                          
                          <div className="bg-[#6A2C91]/10 p-3.5 sm:p-6 lg:p-12 rounded-[2rem] border border-[#6A2C91]/20 mt-auto">
                              <p className="text-[11px] text-[#C5A059] font-sans font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                  <Sparkles size={16} /> Dashboard Strategy Insight
                              </p>
                              <p className="text-sm sm:text-base font-sans font-light text-white/80 leading-relaxed italic">
                                  "Customer shows high affinity for Skincare categories. Recommend 'Last Chance' email for midnight serum restock."
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          
        {showDeleteConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#111] border border-red-500/30 p-8 rounded-3xl max-w-md w-full shadow-2xl">
                    <h2 className="text-xl text-white mb-4 font-display font-medium uppercase tracking-widest">Confirm Deletion</h2>
                    <p className="text-white/60 text-sm mb-8 font-serif italic font-light">Are you sure you want to permanently delete this customer record? This action cannot be undone.</p>
                    <div className="flex gap-4">
                        <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 px-6 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider">Cancel</button>
                        <button onClick={async () => {
                            try {
                                await deleteManualCustomer(showDeleteConfirm);
                                setSelectedCustomer(null);
                                setShowDeleteConfirm(null);
                                toast.success('Customer deleted successfully.');
                            } catch (e) {
                                toast.error('Failed to delete customer.');
                                setShowDeleteConfirm(null);
                            }
                        }} className="flex-1 py-3 px-6 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/40 border border-red-500/30 transition-all text-xs font-bold uppercase tracking-wider">Delete</button>
                    </div>
                </div>
            </div>
        )}
    
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
      className="p-3.5 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 lg:space-y-12 pb-8 sm:pb-12 lg:pb-20 max-w-[1800px] mx-auto"
    >
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Customer">
            <div className="space-y-8 p-4">
                <div className="space-y-3">
                    <label className="text-[11px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                    <Input placeholder="Artisan Client Name" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} className="w-auto mx-auto py-1 px-3 text-[10px] rounded-2xl bg-black/40 border-white/10 focus:border-[#6A2C91] text-white" />
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-[0.2em] ml-1">Secure Email Address</label>
                    <Input placeholder="client@synaptic.com" value={newCust.email} onChange={e => setNewCust({...newCust, email: e.target.value})} className="w-auto mx-auto py-1 px-3 text-[10px] rounded-2xl bg-black/40 border-white/10 focus:border-[#6A2C91] text-white" />
                </div>
                <div className="space-y-3">
                    <label className="text-[11px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-[0.2em] ml-1">Geographic Location</label>
                    <Input placeholder="City, State / Global" value={newCust.location} onChange={e => setNewCust({...newCust, location: e.target.value})} className="w-auto mx-auto py-1 px-3 text-[10px] rounded-2xl bg-black/40 border-white/10 focus:border-[#6A2C91] text-white" />
                </div>
                <Button className="w-full bg-[#6A2C91] hover:bg-[#5a257a] text-white py-3 px-6 rounded-full text-[11px] shadow-2xl shadow-[#6A2C91]/20 mt-8 transition-all font-cta font-semibold uppercase tracking-[0.08em]" onClick={handleAddManual}>
                    ADD CUSTOMER
                </Button>
            </div>
        </Modal>

        <div className="flex flex-col gap-3 sm:gap-6">
          <SubPageHeader 
            title="CRM Hub"
            parentTitle="Operations Hub"
            onBack={() => navigate('/operations')}
            description="Synaptic client management and lifetime value analytics."
          />
          
          <DashboardBanner 
            title="CRM Hub"
            subtitle="Synaptic client management and lifetime value analytics."
            badge="Client Protocol Active"
          >
            <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row gap-3 sm:gap-4 sticky bottom-4 z-50 md:static p-4 md:p-0 bg-[#0A0A0A]/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border border-white/10 md:border-none rounded-3xl md:rounded-none shadow-2xl md:shadow-none w-auto">
                <Button 
                    variant="outline" 
                    className="rounded-full border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-md text-white text-[11px] py-3 px-6 transition-all shadow-sm w-auto font-cta font-semibold uppercase tracking-[0.08em]" 
                    onClick={handleSync} 
                    disabled={isSyncing}
                >
                    <RefreshCw size={16} className={isSyncing ? "animate-spin mr-3" : "mr-3"} /> {isSyncing ? "SYNCING..." : "SYNC FROM ORDERS"}
                </Button>
                <Button 
                    variant="primary" 
                    className="rounded-full bg-[#C5A059] hover:bg-[#b08e4d] text-white text-[11px] py-3 px-6 shadow-2xl shadow-black/10 transition-all w-auto font-cta font-semibold uppercase tracking-[0.08em]" 
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <UserPlus size={16} className="mr-3" /> ADD CUSTOMER
                </Button>
            </div>
          </DashboardBanner>
        </div>

        {/* KPI Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { label: 'TOTAL CUSTOMERS', val: allCustomers.length, icon: Users, color: 'purple' },
              { label: 'Network Value', val: `$${getTotalRevenue().toFixed(0)}`, icon: DollarSign, color: 'gold' },
              { label: 'Synaptic Health', val: '98%', icon: TrendingUp, color: 'emerald' },
              { label: 'At Risk', val: '0', icon: ShoppingCart, color: 'magenta' }
            ].map((kpi, i) => (
              <div key={i} className="luxury-card bg-white/5 border border-white/10 rounded-[2.5rem] p-3.5 sm:p-6 lg:p-12 flex flex-col items-start group hover:border-white/20 transition-all shadow-sm hover:shadow-2xl">
                <GlassHaloIcon icon={kpi.icon} color={kpi.color as any} size="lg" className="mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 z-10" />
                <p className="text-[11px] text-white/40 uppercase tracking-[0.3em] mb-2 font-serif italic font-light">{kpi.label}</p>
                <p className="text-3xl sm:text-4xl font-black text-white font-sans">{kpi.val}</p>
              </div>
            ))}
        </div>

        {/* Customer List */}
        <div className="space-y-10">
            <div className="relative group max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white sm:text-white/40 group-focus-within:text-[#C5A059] transition-colors" size={20} />
                <Input placeholder="Search customers by name, email, or keyword..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-16 py-6 rounded-[2rem] bg-black/40 border border-white/10 focus:border-[#C5A059] focus:ring-[#C5A059]/20 text-white font-sans text-sm shadow-inner transition-all" />
            </div>

            {filteredCustomers.length === 0 && (
                <div className="text-center py-20 px-4">
                    <p className="text-white/50 uppercase tracking-[0.2em] mb-2 font-serif italic font-light">No customers match your search</p>
                    <p className="text-white/30 text-xs font-serif italic font-light">Try a different keyword.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 sm:p-10">
                {filteredCustomers.map((c, i) => (
                    <div 
                        key={c.id} 
                        onClick={() => setSelectedCustomer(c.name)}
                        className={`luxury-card bg-white/5 p-4 sm:p-8 rounded-[3rem] border border-white/10 aspect-square flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden ${justAddedId && c.id.includes('M-') ? 'animate-soft-success border-emerald-500/50 shadow-emerald-500/10' : 'hover:border-white/20 hover:bg-white/10'}`}
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="flex gap-3 sm:gap-6 items-center min-w-0 w-full">
                                <div className={`shrink-0 w-8 h-8 sm:w-12 sm:h-12 ${c.color} bg-opacity-20 rounded-2xl flex items-center justify-center text-white font-serif text-sm sm:text-base md:text-3xl sm:text-5xl lg:text-7xl font-black shadow-inner border border-white/10 group-hover:scale-105 transition-transform duration-500`}>
                                    {c.initial}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg sm:text-2xl lg:text-3xl text-white group-hover:text-[#C5A059] transition-colors break-words font-display font-medium uppercase tracking-widest">{c.name}</h3>
                                    <Badge color={c.type === 'Ordered' ? 'purple' : 'gold'} className="text-[8px] uppercase px-3 py-1 mt-2 shadow-sm shrink-0 inline-block font-cta font-semibold tracking-[0.08em]">{c.type}</Badge>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4 text-[11px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-[0.3em] mb-10 relative z-10 min-w-0">
                            <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 break-words w-full"><Mail size={16} className="text-[#6A2C91] shrink-0"/> <span className="break-words">{c.email}</span></div>
                            <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 break-words w-full"><MapPin size={16} className="text-[#C5A059] shrink-0"/> <span className="break-words">{c.location}</span></div>
                        </div>
                        
                        <div className="pt-8 border-t border-white/10 flex justify-between items-end relative z-10 group-hover:border-white/20 transition-colors">
                            <div className="min-w-0 pr-4">
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-2 break-words font-serif italic font-light">ORDERS</p>
                                <p className="text-sm sm:text-base text-white sm:text-slate-400 leading-relaxed break-words font-sans">{c.orderCount}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-2 font-serif italic font-light">Lifetime Value</p>
                                <p className="text-sm sm:text-base text-[#C5A059] font-black font-sans">${c.totalSpent.toFixed(2)}</p>
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
                requiredTier="Basic Artisan"
            />
        </div>
    </motion.div>
  );
};


