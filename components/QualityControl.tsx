import React, { useState } from 'react';
import { Card, Button, Badge, Input, Select, Modal } from './UI';
import { useArtisanData, QualityCheck } from './DataContext';
import { ClipboardList, Plus, Search, CheckCircle, Clock, ArrowLeft, ShieldCheck, Activity, BarChart3, ChevronRight, Zap, Target, ClipboardCheck, History, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Quality Control - High-Fidelity Batch Integrity Hub ✅
 */

export const QualityControl = () => {
  const { qualityChecks, addQualityCheck, inventory } = useArtisanData();
  const [searchTerm, setSearchTerm] = useState('');
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
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in duration-700 pb-32 max-w-7xl mx-auto">
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Initialize Integrity Inspection">
          <div className="space-y-6 p-4">
              <Select value={newCheck.productName} onChange={e => setNewCheck({...newCheck, productName: e.target.value})} className="h-14 rounded-full">
                  <option value="">Select Asset...</option>
                  {inventory.map(i => <option key={i.id} value={i.name}>{i.name} ({i.sku})</option>)}
              </Select>
              <div className="grid grid-cols-2 gap-6">
                  <Input placeholder="Batch Code" value={newCheck.batchNumber} onChange={e => setNewCheck({...newCheck, batchNumber: e.target.value})} />
                  <Input placeholder="Sign-off Name" value={newCheck.inspector} onChange={e => setNewCheck({...newCheck, inspector: e.target.value})} />
              </div>
              <Select value={newCheck.status} onChange={e => setNewCheck({...newCheck, status: e.target.value as any})} className="h-14 rounded-full">
                  <option>Pending</option>
                  <option>Passed</option>
                  <option>Failed</option>
              </Select>
              <Button onClick={handleAdd} className="w-full bg-[#1A1A1A] text-white h-16 rounded-full font-sans font-medium text-[11px] tracking-[0.2em] shadow-[0_8px_30px_rgba(0,0,0,0.12)] mt-8 uppercase hover:bg-[#333333] transition-all">
                  LOG INSPECTION DATA
              </Button>
          </div>
      </Modal>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
            <button onClick={() => navigate('/inventory')} className="flex items-center gap-3 text-gray-400 hover:text-[#6A2C91] mb-6 font-sans font-medium text-[10px] uppercase tracking-[0.2em] transition-colors">
                <ArrowLeft size={16} strokeWidth={1.5} /> Back to Resource Hub
            </button>
            <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight">Quality Control Hub</h1>
            <p className="text-gray-500 font-sans font-light text-lg mt-2">Batch Integrity Vault: Enforcing Excellence Across the Manufacturing Floor.</p>
        </div>
        <Button className="bg-[#1A1A1A] text-white h-14 rounded-full font-sans font-medium text-[11px] tracking-[0.2em] px-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-[#333333] transition-all" onClick={() => setShowAdd(true)}>
            <Plus size={16} className="mr-3" strokeWidth={1.5} /> NEW INSPECTION
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatBox label="Total Audits" val={qualityChecks.length} color="text-[#6A2C91]" />
          <StatBox label="Pass Velocity" val={`${passRate}%`} color="text-emerald-600" />
          <StatBox label="Failure Waste" val="$0.00" color="text-red-500" />
          <StatBox label="Pending QA" val={qualityChecks.filter(c => c.status === 'Pending').length} color="text-[#C5A059]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <Card title="Inspection Ledger" className="luxury-card min-h-[400px]">
                  {qualityChecks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-24 text-center bg-stone-50/50 rounded-[2rem] border border-dashed border-stone-200">
                          <ClipboardCheck size={48} className="text-stone-300 mb-6" strokeWidth={1} />
                          <p className="text-gray-400 font-sans font-medium text-[10px] uppercase tracking-[0.2em]">No inspection history detected in vault.</p>
                      </div>
                  ) : (
                      <div className="divide-y divide-stone-100/50">
                          {qualityChecks.map(check => (
                              <div key={check.id} className="py-6 flex items-center justify-between group">
                                  <div className="flex items-center gap-6">
                                      <div className={`p-4 rounded-full ${check.status === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'} group-hover:scale-110 transition-transform duration-500`}>
                                          {check.status === 'Passed' ? <ShieldCheck size={20} strokeWidth={1.5}/> : <Clock size={20} strokeWidth={1.5}/>}
                                      </div>
                                      <div>
                                          <h4 className="font-serif text-lg text-white font-bold tracking-tight">{check.productName}</h4>
                                          <p className="text-[10px] text-gray-400 font-sans font-medium uppercase tracking-[0.2em] mt-1">Batch: {check.batchNumber} • Sign-off: {check.inspector}</p>
                                      </div>
                                  </div>
                                  <Badge color={check.status === 'Passed' ? 'green' : 'gold'} className="px-4 py-1.5 uppercase font-sans font-medium text-[9px] tracking-[0.2em]">{check.status}</Badge>
                              </div>
                          ))}
                      </div>
                  )}
              </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#1A1A1A] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl group">
                  <div className="absolute bottom-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000"><History size={160} strokeWidth={1}/></div>
                  <h4 className="text-3xl font-serif tracking-tight mb-6 relative z-10">Integrity Historicals</h4>
                  <p className="text-stone-400 font-sans font-light text-sm leading-relaxed mb-10 relative z-10">No critical batch failures detected in the last 180 days.</p>
                  <Button variant="outline" className="w-full border-stone-700 text-white font-sans font-medium text-[11px] tracking-[0.2em] h-14 rounded-full hover:bg-[#333333] transition-all uppercase relative z-10">DOWNLOAD ARCHIVE</Button>
              </div>
          </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, val, color }: any) => (
    <div className="luxury-card p-10 flex flex-col items-start group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-stone-200 group-hover:bg-[#C5A059] transition-colors duration-500"></div>
        <p className="text-[10px] text-gray-400 font-sans font-medium uppercase tracking-[0.2em] mb-4">{label}</p>
        <p className={`text-4xl font-serif tracking-tight ${color}`}>{val}</p>
    </div>
);