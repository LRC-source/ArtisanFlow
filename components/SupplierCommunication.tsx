
import React, { useState } from 'react';
import { Card, Button, Badge, Input, Modal, Select } from './UI';
import { useArtisanData, SupplierCommunication as SupplierCommType } from './DataContext';
import { MessageSquare, Plus, Search, Filter, Mail, Phone, Globe } from 'lucide-react';

export const SupplierCommunication = () => {
  const { supplierCommunications, addCommunication, suppliers } = useArtisanData();
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newComm, setNewComm] = useState<Partial<SupplierCommType>>({
      supplierId: '', subject: '', type: 'Email', status: 'Pending', date: new Date().toLocaleDateString()
  });

  const handleAdd = () => {
      if (!newComm.supplierId || !newComm.subject) return;
      const supplier = suppliers.find(s => s.id === newComm.supplierId);
      addCommunication({ 
          ...newComm, 
          supplierName: supplier?.name || 'Unknown',
          date: new Date().toLocaleDateString()
      } as any);
      setShowAdd(false);
      setNewComm({ supplierId: '', subject: '', type: 'Email', status: 'Pending' });
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in pb-20">
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Log Communication">
          <div className="space-y-4">
              <div>
                  <label className="text-xs text-gray-500">Supplier</label>
                  <Select value={newComm.supplierId} onChange={e => setNewComm({...newComm, supplierId: e.target.value})}>
                      <option value="">Select Supplier</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </Select>
              </div>
              <div>
                   <label className="text-xs text-gray-500">Subject</label>
                   <Input value={newComm.subject} onChange={e => setNewComm({...newComm, subject: e.target.value})} placeholder="e.g. Order #1234 Follow Up" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs text-gray-500">Type</label>
                       <Select value={newComm.type} onChange={e => setNewComm({...newComm, type: e.target.value as any})}>
                          <option>Email</option>
                          <option>Phone</option>
                          <option>Portal</option>
                      </Select>
                  </div>
                  <div>
                      <label className="text-xs text-gray-500">Status</label>
                       <Select value={newComm.status} onChange={e => setNewComm({...newComm, status: e.target.value as any})}>
                          <option>Pending</option>
                          <option>Sent</option>
                          <option>Responded</option>
                          <option>Resolved</option>
                      </Select>
                  </div>
              </div>
              <Button onClick={handleAdd} className="w-full">Log Interaction</Button>
          </div>
      </Modal>

      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white">Supplier Communication</h1>
            <p className="text-gray-500">Manage all supplier interactions and correspondence</p>
        </div>
        <Button className="bg-[#6A2C91] text-white" onClick={() => setShowAdd(true)}>
            <MessageSquare size={16} className="mr-2" /> New Communication
        </Button>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
          {['All', 'Pending', 'Sent', 'Responded', 'Resolved'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === f ? 'bg-white text-[#6A2C91] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                  {f}
              </button>
          ))}
      </div>

      {supplierCommunications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="text-gray-400" />
              </div>
              <h3 className="text-white font-bold font-medium mb-1">No communications found</h3>
              <p className="text-gray-400 text-sm">Start a new thread to track supplier conversations</p>
          </div>
      ) : (
          <div className="space-y-4">
              {supplierCommunications.map(comm => (
                  <div key={comm.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                      <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${comm.type === 'Email' ? 'bg-blue-100 text-blue-600' : comm.type === 'Phone' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                              {comm.type === 'Email' ? <Mail size={20}/> : comm.type === 'Phone' ? <Phone size={20}/> : <Globe size={20}/>}
                          </div>
                          <div>
                              <h4 className="font-bold text-white">{comm.subject}</h4>
                              <p className="text-sm text-gray-500">{comm.supplierName} • {comm.date}</p>
                          </div>
                      </div>
                      <Badge color={comm.status === 'Resolved' ? 'green' : comm.status === 'Pending' ? 'gold' : 'blue'}>
                          {comm.status}
                      </Badge>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};
