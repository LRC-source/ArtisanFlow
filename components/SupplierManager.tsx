import React, { useState } from 'react';
import { Card, Button, Badge, Modal, Input, Select } from './UI';
import { Plus, Edit2, Trash2, Upload, Phone, Mail, User, Star, ArrowLeft, Truck, ShieldCheck, TrendingUp, DollarSign, Activity, ChevronRight, Globe, AlertTriangle, Zap, CheckCircle, Layers, Box, RefreshCw } from 'lucide-react';
import { useArtisanData, Supplier } from './DataContext';
import { useNavigate } from 'react-router-dom';

/**
 * Supplier Hub - High-Fidelity Vendor Architecture ✅
 */

export const SupplierManager: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, inventory } = useArtisanData();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Supplier>>({
      name: '', contactName: '', email: '', phone: '', rating: 3, tier: 'Moderate', leadTime: 7, paymentTerms: 'Net 30'
  });

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', contactName: '', email: '', phone: '', rating: 3, tier: 'Moderate', leadTime: 7, paymentTerms: 'Net 30' });
    setShowModal(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setIsEditing(true);
    setEditingId(supplier.id);
    setFormData({ ...supplier });
    setShowModal(true);
  };

  const handleCommit = () => {
      if (!formData.name) return;
      
      if (isEditing && editingId) {
          updateSupplier(editingId, formData);
      } else {
          addSupplier(formData as any);
      }
      
      setShowModal(false);
      setFormData({ name: '', contactName: '', email: '', phone: '', rating: 3, tier: 'Moderate', leadTime: 7, paymentTerms: 'Net 30' });
  };

  const handleDelete = () => {
    if (!editingId) return;
    if (window.confirm("ARE YOU SURE? Revoking this vendor node is permanent. This will remove the supplier identity from your vault ledger.")) {
        deleteSupplier(editingId);
        setShowModal(false);
    }
  };

  const getSuppliedItems = (supplierName: string) => {
      return inventory.filter(i => i.supplier === supplierName);
  };

  return (
    <div className="p-6 space-y-10 animate-in fade-in pb-20">
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditing ? "Revise Vault Node" : "Register Vault Supplier"}>
          <div className="space-y-8 p-2">
              <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entity Identity</label>
                  <Input placeholder="Entity Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-2xl py-4" />
              </div>
              <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Liaison</label>
                  <Input placeholder="Primary Liaison" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="rounded-2xl py-4" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Email</label>
                    <Input placeholder="Secure Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="rounded-2xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Direct Phone</label>
                    <Input placeholder="Direct Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="rounded-2xl" />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vendor Tiering</label>
                    <Select value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value as any})} className="rounded-2xl">
                        <option value="Reliable">Reliable Node</option>
                        <option value="Moderate">Moderate Node</option>
                        <option value="Risk">Risk Node</option>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lead Time (Days)</label>
                    <Input type="number" placeholder="Lead Time" value={formData.leadTime} onChange={e => setFormData({...formData, leadTime: parseInt(e.target.value)})} className="rounded-2xl" />
                  </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-stone-50">
                  <Button onClick={handleCommit} className="w-full bg-[#6A2C91] text-white h-14 rounded-2xl font-black text-xs tracking-widest shadow-xl uppercase transition-all hover:scale-[1.02]">
                      {isEditing ? <><RefreshCw size={18} className="mr-2"/> UPDATE VENDOR NODE</> : <><ShieldCheck size={18} className="mr-2"/> AUTHORIZE VENDOR</>}
                  </Button>
                  
                  {isEditing && (
                      <Button variant="danger" onClick={handleDelete} className="w-full h-12 rounded-2xl font-black text-[10px] tracking-widest uppercase opacity-70 hover:opacity-100 transition-all">
                          <Trash2 size={14} className="mr-2"/> DELETE VENDOR NODE
                      </Button>
                  )}
              </div>
          </div>
      </Modal>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <button onClick={() => navigate('/inventory')} className="flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] mb-4 font-black text-xs uppercase tracking-widest transition-colors">
                <ArrowLeft size={16} /> Back to Resource Hub
            </button>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Supplier Hub</h1>
            <p className="text-gray-500 font-medium">Supply Chain Integrity: Managing External Nodes & Sourcing Logic.</p>
        </div>
        <Button className="bg-[#6A2C91] text-white h-12 rounded-2xl font-black text-[10px] tracking-widest px-8 shadow-xl" onClick={handleOpenCreate}>
            <Plus size={16} className="mr-2" /> REGISTER VENDOR
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatMini label="Active Vendors" val={suppliers.length} color="text-purple-600" />
          <StatMini label="Reliability Pass" val="94%" color="text-emerald-600" />
          <StatMini label="Total Material Nodes" val={inventory.filter(i => i.type === 'raw').length} color="text-amber-600" />
          <StatMini label="Avg. Lead Time" val="9.2d" color="text-[#C5A059]" />
      </div>

      {suppliers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[2.5rem] p-24 flex flex-col items-center justify-center text-center shadow-sm">
               <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center text-stone-200 mb-6 shadow-inner">
                  <Truck size={40} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic">No Supply Nodes Detected</h3>
              <p className="text-gray-400 text-sm font-medium mt-1">Initialize your supplier database to track material lead times.</p>
              <Button onClick={handleOpenCreate} className="mt-8 bg-purple-50 text-[#6A2C91] h-12 px-8 rounded-2xl font-black text-[10px] tracking-widest border border-purple-100">INITIALIZE FIRST NODE</Button>
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:p-8">
              {suppliers.map(supplier => {
                  const linkedItems = getSuppliedItems(supplier.name);
                  return (
                    <div key={supplier.id} className="bg-white border border-stone-200 rounded-[2.5rem] p-4 sm:p-8 hover:shadow-2xl hover:border-[#6A2C91] transition-all group relative overflow-hidden flex flex-col h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-full -mr-8 -mt-8 opacity-40 group-hover:bg-purple-50 group-hover:opacity-100 transition-all"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-[#C5A059] shadow-inner group-hover:bg-white transition-colors">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight uppercase italic line-clamp-1">{supplier.name}</h3>
                                    <Badge color={supplier.tier === 'Reliable' ? 'green' : supplier.tier === 'Risk' ? 'red' : 'gold'} className="text-[8px] px-2 py-0.5 font-black uppercase tracking-widest mt-1">
                                        {supplier.tier} tier
                                    </Badge>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleOpenEdit(supplier)}
                                className="p-3 bg-stone-50 text-gray-400 rounded-xl hover:bg-[#6A2C91] hover:text-white transition-all shadow-sm z-20"
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>
                        <div className="space-y-3 mb-8 relative z-10 flex-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                            <div className="flex items-center gap-3"><User size={14} className="text-[#6A2C91]" /> {supplier.contactName}</div>
                            <div className="flex items-center gap-3"><Mail size={14} className="text-[#C5A059]" /> {supplier.email}</div>
                            <div className="flex items-center gap-3"><Phone size={14} className="text-emerald-500" /> {supplier.phone}</div>
                        </div>
                        <div className="border-t border-stone-50 pt-8 relative z-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2"><Layers size={14} /> Linked Materials ({linkedItems.length})</p>
                            <div className="flex flex-wrap gap-2">
                                {linkedItems.length > 0 ? linkedItems.map((item, i) => (
                                    <span key={i} className="px-3 py-1 bg-stone-50 text-[10px] font-bold text-gray-600 rounded-lg border border-stone-100 uppercase">{item.name}</span>
                                )) : <span className="text-[10px] text-gray-400 italic">No inventory nodes mapped.</span>}
                            </div>
                        </div>
                    </div>
                  );
              })}
          </div>
      )}
    </div>
  );
};

const StatMini = ({ label, val, color }: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col items-start group hover:border-[#6A2C91] transition-all">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className={`text-2xl font-black tracking-tighter ${color}`}>{val}</p>
    </div>
);
