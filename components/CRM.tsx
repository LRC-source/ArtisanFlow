import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Input, Select, Modal } from './UI';
import { Search, Filter, Mail, MapPin, Users, TrendingUp, DollarSign, ShoppingBag, ShoppingCart, Package, Plus, RefreshCw, ArrowLeft, Calendar, UserPlus, CheckCircle, Sparkles } from 'lucide-react';
import { useArtisanData } from './DataContext';
import { useNavigate } from 'react-router-dom';

export const CRM = () => {
  const { orders, manualCustomers, addManualCustomer, getTotalRevenue } = useArtisanData();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  
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
          color: 'bg-purple-600',
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
      if (!newCust.name || !newCust.email) return;
      addManualCustomer(newCust);
      const tempId = `M-${Date.now()}`; // For local feedback
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
          <div className="space-y-6 animate-in fade-in pb-20">
              <button onClick={() => setSelectedCustomer(null)} className="flex items-center gap-2 text-gray-500 hover:text-[#6A2C91] font-bold text-xs uppercase tracking-widest transition-colors">
                  <ArrowLeft size={16} /> Back to CRM Hub
              </button>

              <div className="bg-white rounded-[2rem] p-10 border border-stone-200 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-bl-full opacity-50 -mr-10 -mt-10"></div>
                  <div className="flex items-center gap-8 relative z-10">
                      <div className={`w-24 h-24 ${customer.color} rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-purple-200`}>
                          {customer.initial}
                      </div>
                      <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{customer.name}</h1>
                             <Badge color={customer.type === 'Ordered' ? 'purple' : 'gold'}>{customer.type}</Badge>
                          </div>
                          <div className="flex gap-6 text-gray-500 font-medium">
                              <span className="flex items-center gap-2"><Mail size={16} className="text-[#6A2C91]"/> {customer.email}</span>
                              <span className="flex items-center gap-2"><MapPin size={16} className="text-[#C5A059]"/> {customer.location}</span>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mb-1">Lifetime Value</p>
                          <p className="text-5xl font-black text-gray-900 tracking-tighter">${customer.totalSpent.toFixed(2)}</p>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card title="Activity Ledger" className="rounded-[2rem] border-stone-100">
                      <div className="space-y-4">
                          {customer.orders.length > 0 ? customer.orders.map(order => (
                              <div key={order.id} className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl border border-transparent hover:border-purple-200 transition-all group">
                                  <div>
                                      <p className="font-black text-gray-900 uppercase text-xs tracking-tight">Order {order.id}</p>
                                      <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-0.5"><Calendar size={12}/> {order.date}</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="font-black text-gray-900 text-lg">${order.total.toFixed(2)}</p>
                                      <Badge color={order.status === 'Delivered' ? 'green' : 'blue'} className="text-[9px] uppercase tracking-widest">{order.status}</Badge>
                                  </div>
                              </div>
                          )) : (
                              <div className="p-12 text-center">
                                 <Package size={48} className="text-stone-200 mx-auto mb-4" />
                                 <p className="text-gray-400 text-sm font-bold uppercase tracking-widest italic">No Transactional History</p>
                              </div>
                          )}
                      </div>
                  </Card>
                  <Card title="Node Metadata" className="rounded-[2rem] border-stone-100">
                      <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                              <div className="bg-stone-50 p-4 rounded-2xl">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">First Interaction</p>
                                <p className="font-bold text-gray-900">{customer.orders.length > 0 ? customer.orders[customer.orders.length-1].date : 'Today'}</p>
                              </div>
                              <div className="bg-stone-50 p-4 rounded-2xl">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Latest Update</p>
                                <p className="font-bold text-gray-900">{customer.orders.length > 0 ? customer.orders[0].date : 'Today'}</p>
                              </div>
                          </div>
                          <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
                              <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-2">Vault Strategy Insight</p>
                              <p className="text-sm font-medium text-purple-900 leading-relaxed italic">"Customer shows high affinity for Skincare categories. Recommend 'Last Chance' email for midnight serum restock."</p>
                          </div>
                      </div>
                  </Card>
              </div>
          </div>
      );
  }

  // --- OVERVIEW ---
  return (
    <div className="p-6 space-y-8 animate-in fade-in pb-20">
        <button onClick={() => navigate('/operations')} className="flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] font-black text-xs uppercase tracking-widest mb-4 transition-colors">
            <ArrowLeft size={18} /> Back to Operations
        </button>

        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Initialize Vault Node (Manual Customer)">
            <div className="space-y-6 p-2">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                    <Input placeholder="Artisan Client Name" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Email Address</label>
                    <Input placeholder="client@synaptic.com" value={newCust.email} onChange={e => setNewCust({...newCust, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Geographic Location</label>
                    <Input placeholder="City, State / Global" value={newCust.location} onChange={e => setNewCust({...newCust, location: e.target.value})} />
                </div>
                <Button className="w-full bg-[#6A2C91] text-white h-14 font-black text-xs tracking-widest shadow-xl shadow-purple-100 mt-4" onClick={handleAddManual}>
                    AUTHORIZE NODE CREATION
                </Button>
            </div>
        </Modal>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">CRM Hub</h1>
                <p className="text-gray-500 font-medium">Synaptic client management and lifetime value analytics.</p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <Button 
                    className="w-full md:min-w-[200px] bg-[#6A2C91] text-white h-12 font-black text-[10px] tracking-[0.2em] shadow-lg shadow-purple-100" 
                    onClick={handleSync} 
                    disabled={isSyncing}
                >
                    <RefreshCw size={16} className={isSyncing ? "animate-spin mr-2" : "mr-2"} /> {isSyncing ? "SYNCING..." : "SYNC FROM ORDERS"}
                </Button>
                <Button 
                    className="w-full md:min-w-[200px] bg-[#C5A059] text-white h-12 font-black text-[10px] tracking-[0.2em] shadow-lg shadow-amber-100 hover:bg-[#b08e4d] transition-all" 
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <UserPlus size={16} className="mr-2" /> ADD MANUAL NODE
                </Button>
            </div>
        </div>

        {/* KPI Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Nodes', val: allCustomers.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Network Value', val: `$${getTotalRevenue().toFixed(0)}`, icon: DollarSign, color: 'text-[#C5A059]', bg: 'bg-amber-50' },
              { label: 'Synaptic Health', val: '98%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'At Risk', val: '0', icon: ShoppingCart, color: 'text-red-500', bg: 'bg-red-50' }
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm flex flex-col items-start group hover:border-[#6A2C91] transition-all">
                <div className={`p-3 ${kpi.bg} ${kpi.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}><kpi.icon size={20} /></div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{kpi.val}</p>
              </div>
            ))}
        </div>

        {/* Customer List */}
        <div className="space-y-6">
            <div className="relative group max-w-2xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A2C91] transition-colors" size={20} />
                <Input placeholder="Scan for nodes by name, email, or metadata..." className="pl-14 py-4 rounded-[2rem] bg-white shadow-inner border-stone-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allCustomers.map((c, i) => (
                    <div 
                        key={c.id} 
                        onClick={() => setSelectedCustomer(c.name)}
                        className={`bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden ${justAddedId && c.id.includes('M-') ? 'animate-soft-success border-emerald-500' : 'hover:border-[#6A2C91] hover:-translate-y-1'}`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4 items-center">
                                <div className={`w-14 h-14 ${c.color} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                                    {c.initial}
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-lg uppercase italic tracking-tight group-hover:text-[#6A2C91] transition-colors">{c.name}</h3>
                                    <Badge color={c.type === 'Ordered' ? 'purple' : 'gold'} className="text-[8px] uppercase font-black tracking-widest px-2 py-0.5 mt-1">{c.type}</Badge>
                                </div>
                            </div>
                            <div className="p-2 bg-stone-50 rounded-xl text-stone-300 group-hover:text-[#C5A059] transition-colors">
                                <Sparkles size={16} />
                            </div>
                        </div>
                        <div className="space-y-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-8">
                            <div className="flex items-center gap-3"><Mail size={14} className="text-[#6A2C91] opacity-40"/> {c.email}</div>
                            <div className="flex items-center gap-3"><MapPin size={14} className="text-[#C5A059] opacity-40"/> {c.location}</div>
                        </div>
                         <div className="pt-6 border-t border-stone-100 flex justify-between items-end">
                            <div>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Orders</p>
                                <p className="font-black text-gray-900">{c.orderCount}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Lifetime Node Value</p>
                                <p className="font-black text-[#6A2C91] text-xl tracking-tighter">${c.totalSpent.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};