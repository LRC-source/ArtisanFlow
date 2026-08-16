import React, { useState } from 'react';
import { Card, Button, Badge, Input, Select, Modal, VaultBanner } from './UI';
import { useArtisanData, QualityCheck } from './DataContext';
import { ClipboardList, Plus, Search, CheckCircle, Clock, ArrowLeft, ShieldCheck, Activity, BarChart3, ChevronRight, Zap, Target, ClipboardCheck, History, AlertTriangle, Layers, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SubPageHeader } from './SubPageHeader';
import { GlassHaloIcon } from './ui/GlassHaloIcon';

/**
 * Quality Control - High-Fidelity Batch Integrity Hub ✅
 */

export const QualityControl = () => {
  const { qualityChecks, addQualityCheck, inventory } = useArtisanData();
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();
  
  const [newCheck, setNewCheck] = useState<Partial<QualityCheck>>({
      productName: '', batchNumber: '', status: 'Pending', inspector: '', date: new Date().toLocaleDateString()
  });

  const handleAdd = () => {
      if(!newCheck.productName) return;
      addQualityCheck(newCheck as any);
      setShowAdd(false);
      setNewCheck({ productName: '', batchNumber: '', status: 'Pending', inspector: '' });
  };

  const passRate = qualityChecks.length > 0 
    ? Math.round((qualityChecks.filter(c => c.status === 'Passed').length / qualityChecks.length) * 100) 
    : 100;

  return (
    <div className="p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20">
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Initialize Integrity Inspection">
          <div className="space-y-6 p-4">
              <Select value={newCheck.productName} onChange={e => setNewCheck({...newCheck, productName: e.target.value})} className="h-14 rounded-full bg-white/5 border-white/10 text-white font-sans text-sm">
                  <option value="" className="bg-black text-white">Select Asset...</option>
                  {inventory.map(i => <option key={i.id} value={i.name} className="bg-black text-white">{i.name} ({i.sku})</option>)}
              </Select>
              <div className="grid grid-cols-2 gap-6">
                  <Input placeholder="Batch Code" value={newCheck.batchNumber} onChange={e => setNewCheck({...newCheck, batchNumber: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                  <Input placeholder="Sign-off Name" value={newCheck.inspector} onChange={e => setNewCheck({...newCheck, inspector: e.target.value})} className="bg-white/5 border-white/10 text-white" />
              </div>
              <Select value={newCheck.status} onChange={e => setNewCheck({...newCheck, status: e.target.value as any})} className="h-14 rounded-full bg-white/5 border-white/10 text-white font-sans text-sm">
                  <option className="bg-black text-white">Pending</option>
                  <option className="bg-black text-white">Passed</option>
                  <option className="bg-black text-white">Failed</option>
              </Select>
              <Button onClick={handleAdd} className="w-full bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 rounded-full font-sans font-medium text-[11px] tracking-[0.2em] shadow-xl shadow-[#6A2C91]/20 mt-8 uppercase transition-all">
                  LOG INSPECTION DATA
              </Button>
          </div>
      </Modal>

      <div className="flex flex-col gap-4 sm:p-8">
        <SubPageHeader 
          title="Trapped Cash Audit & QC"
          parentTitle="Operations"
          onBack={() => navigate('/inventory')}
          description="Batch Integrity Vault: Enforcing Excellence Across the Manufacturing Floor."
        />
        
        <VaultBanner 
          title="Trapped Cash Audit & QC"
          subtitle="Batch Integrity Vault: Enforcing Excellence Across the Manufacturing Floor."
          badge="Audit Protocol Active"
        >
          <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 rounded-full shadow-2xl shadow-[#6A2C91]/20 transition-all" onClick={() => setShowAdd(true)}>
              <Plus size={16} className="mr-3"/> NEW AUDIT LOG
          </Button>
        </VaultBanner>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatBox label="Total Audits" val={qualityChecks.length} color="text-[#C5A059]" haloColor="gold" icon={ClipboardList} />
          <StatBox label="Pass Velocity" val={`${passRate}%`} color="text-emerald-400" haloColor="emerald" icon={ShieldCheck} />
          <StatBox label="Failure Waste" val="$0.00" color="text-red-400" haloColor="magenta" icon={AlertTriangle} />
          <StatBox label="Pending QA" val={qualityChecks.filter(c => c.status === 'Pending').length} color="text-blue-400" haloColor="cyan" icon={Clock} />
      </div>

      {qualityChecks.length === 0 ? (
          <div className="luxury-card border-white/10 rounded-[2.5rem] p-24 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/20 mb-6 shadow-inner border border-white/10">
                  <ClipboardCheck size={40} />
              </div>
              <h3 className="text-3xl font-serif tracking-tight text-white/50 mb-2">Vault Empty</h3>
              <p className="text-white/30 text-[11px] font-sans font-medium uppercase tracking-[0.2em] mt-1">No inspection history detected.</p>
              <Button onClick={() => setShowAdd(true)} className="mt-8 bg-white/5 text-[#C5A059] h-12 px-8 rounded-full font-sans text-[10px] tracking-widest uppercase border border-white/10 hover:bg-white/10">INITIALIZE AUDIT</Button>
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-8">
              {qualityChecks.map(check => (
                  <div key={check.id} className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10 hover:shadow-2xl hover:border-[#C5A059]/50 transition-all group relative overflow-hidden">
                      <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="flex items-center gap-6">
                              <GlassHaloIcon icon={check.status === 'Passed' ? ShieldCheck : Clock} color={check.status === 'Passed' ? 'emerald' : 'gold'} size="md" />
                              <div>
                                  <h3 className="text-3xl font-serif text-white tracking-tight">{check.productName}</h3>
                                  <Badge color="gold" className="text-[9px] px-3 py-1 font-sans tracking-widest mt-2 uppercase border-white/10">Batch: {check.batchNumber}</Badge>
                              </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                          <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/10">
                              <p className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Inspector Sign-off</p>
                              <p className="text-xl font-serif text-white">{check.inspector}</p>
                          </div>
                          <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/10">
                              <p className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Status Node</p>
                              <p className={`text-xl font-serif ${check.status === 'Passed' ? 'text-emerald-400' : 'text-amber-400'}`}>{check.status}</p>
                          </div>
                      </div>

                      <div className="space-y-4 border-t border-white/5 pt-8 relative z-10">
                          <p className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2"><History size={14} className="text-[#C5A059]" /> Timestamp: {check.date}</p>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

const StatBox = ({ label, val, color, haloColor, icon: Icon }: any) => (
    <div className="luxury-card bg-black/40 backdrop-blur-xl p-4 sm:p-8 rounded-[2rem] border border-white/10 shadow-lg flex flex-col items-start group hover:border-[#C5A059]/30 transition-all">
        <GlassHaloIcon icon={Icon} color={haloColor} size="md" className="mb-6 group-hover:scale-110 transition-all" />
        <p className="text-[10px] text-white/40 font-sans font-bold uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className={`text-4xl font-serif tracking-tight ${color}`}>{val}</p>
    </div>
);
