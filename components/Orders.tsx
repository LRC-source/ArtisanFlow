import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Select } from './UI';
import { Search, Filter, ShoppingCart, DollarSign, Package, Truck, User, MapPin, Calendar, CheckCircle, Download, RefreshCw, AlertCircle, X, ChevronRight, ArrowLeft } from 'lucide-react';
import { useArtisanData } from './DataContext';
import { useNavigate } from 'react-router-dom';

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
    <div className="space-y-6 animate-in fade-in pb-20 relative">
        {/* Toast Notification Overlay */}
        {toast && (
          <div className="fixed top-8 right-8 z-[60] animate-in slide-in-from-right-10">
            <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border-l-4 min-w-[320px] backdrop-blur-md ${
              toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-500 text-emerald-900' : 
              toast.type === 'error' ? 'bg-red-50/90 border-red-500 text-red-900' : 
              'bg-purple-50/90 border-[#6A2C91] text-[#6A2C91]'
            }`}>
              <div className={`p-1.5 rounded-full ${
                toast.type === 'success' ? 'bg-emerald-100' : 
                toast.type === 'error' ? 'bg-red-100' : 'bg-purple-100'
              }`}>
                {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              </div>
              <p className="text-sm font-bold flex-1">{toast.message}</p>
              <button onClick={() => setToast(null)} className="opacity-30 hover:opacity-100 transition-opacity"><X size={16}/></button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <button onClick={() => navigate('/operations')} className="flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] mb-4 font-black text-xs uppercase tracking-widest transition-colors">
            <ArrowLeft size={18} /> Back to Operations
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h1 className="text-3xl font-bold text-white">Orders & Fulfillment</h1>
                  <p className="text-gray-500 text-sm">Omnichannel order management and synchronization.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                  <Button 
                      variant="outline" 
                      onClick={handleSync} 
                      disabled={isSyncing}
                      className="flex-1 md:flex-none border-[#6A2C91] text-[#6A2C91] rounded-xl"
                  >
                      <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} /> 
                      {isSyncing ? "Syncing..." : "Sync Store"}
                  </Button>
                  <Button variant="primary" onClick={handleExport} className="flex-1 md:flex-none bg-[#6A2C91] text-white rounded-xl shadow-lg shadow-purple-200">
                    <Download size={16} /> Export CSV
                  </Button>
              </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Orders', val: orders.length, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Revenue', val: `$${getTotalRevenue().toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Pending', val: pendingCount, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Shipped', val: shippedCount, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:border-[#6A2C91] transition-all group">
                <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}><stat.icon size={24} /></div>
                <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black text-gray-900">{stat.val}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Orders Table Container */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-3 text-gray-400 group-focus-within:text-[#6A2C91] transition-colors" size={18} />
                    <Input 
                        placeholder="Search by Order ID or Customer..." 
                        className="pl-12 rounded-2xl bg-white" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select 
                        className="w-40 rounded-2xl"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option>All Status</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                    </Select>
                </div>
            </div>

            <div className="divide-y divide-gray-50">
                {filteredOrders.length === 0 ? (
                    <div className="p-24 text-center">
                        <Package size={64} className="text-stone-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white italic">No orders in current flow.</h3>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className={`p-6 hover:bg-stone-50 transition-all group border-l-4 border-transparent ${processedId === order.id ? 'animate-soft-success border-emerald-500' : 'hover:border-[#6A2C91]'}`}>
                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Badge color={order.status === 'Processing' ? 'blue' : order.status === 'Shipped' ? 'purple' : 'green'} className="uppercase font-black text-[10px] tracking-widest px-3 py-1">
                                            {order.status}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.platform}</span>
                                        <span className="text-xs text-gray-400 font-mono font-bold"># {order.id}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Customer</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#6A2C91] font-black text-sm border border-purple-100">
                                                    {order.customer.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-none">{order.customer}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium mt-1">{order.location}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Manifest</p>
                                            <div className="space-y-1">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-xs">
                                                        <span className="text-gray-600 font-medium truncate max-w-[150px]">{item.name}</span>
                                                        <span className="text-[#6A2C91] font-black">x{item.qty}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1 lg:text-right">
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Settlement</p>
                                            <p className="text-2xl font-black text-gray-900">${order.total.toFixed(2)}</p>
                                            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Fully Captured</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex lg:flex-col justify-end items-end gap-2 min-w-[180px]">
                                    {order.status === 'Processing' ? (
                                        <Button 
                                            className="w-full bg-[#6A2C91] text-white hover:bg-[#5a257a] h-12 text-[10px] font-black tracking-[0.2em] rounded-xl shadow-lg shadow-purple-100"
                                            onClick={() => handleProcess(order.id)}
                                        >
                                            AUTHORIZE FLOW <ChevronRight size={14} className="ml-1" />
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100 w-full justify-center tracking-widest uppercase">
                                            <CheckCircle size={16} /> Dispatched
                                        </div>
                                    )}
                                    <Button variant="outline" className="w-full h-10 text-[10px] font-black border-stone-200 text-stone-400 hover:bg-stone-50 rounded-xl tracking-widest">
                                        VIEW METADATA
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );
};