
import React, { useState } from 'react';
import { Card, Button, Modal, Input, Select } from './UI';
import { useArtisanData, Location } from './DataContext';
import { MapPin, Plus, Box, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Locations = () => {
  const { locations, addLocation } = useArtisanData();
  const [showAdd, setShowAdd] = useState(false);
  const [newLoc, setNewLoc] = useState<Partial<Location>>({ name: '', type: 'Warehouse', address: '', capacity: '' });
  const navigate = useNavigate();

  const handleAdd = () => {
      if(!newLoc.name) return;
      addLocation(newLoc as any);
      setShowAdd(false);
      setNewLoc({ name: '', type: 'Warehouse', address: '', capacity: '' });
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in pb-20">
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Location">
          <div className="space-y-4">
              <Input placeholder="Location Name" value={newLoc.name} onChange={e => setNewLoc({...newLoc, name: e.target.value})} />
              <Input placeholder="Address" value={newLoc.address} onChange={e => setNewLoc({...newLoc, address: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs text-gray-500">Type</label>
                      <Select value={newLoc.type} onChange={e => setNewLoc({...newLoc, type: e.target.value as any})}>
                          <option>Warehouse</option>
                          <option>Retail</option>
                          <option>Storage</option>
                      </Select>
                  </div>
                  <div>
                      <label className="text-xs text-gray-500">Capacity</label>
                      <Input placeholder="e.g. 5000 sqft" value={newLoc.capacity} onChange={e => setNewLoc({...newLoc, capacity: e.target.value})} />
                  </div>
              </div>
              <Button onClick={handleAdd} className="w-full">Create Location</Button>
          </div>
      </Modal>

      <div className="flex flex-col gap-1">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#6A2C91] mb-2 font-medium transition-colors">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-white">Location Management</h1>
                <p className="text-gray-500">Manage warehouses and storage locations</p>
            </div>
            <Button className="bg-[#6A2C91] text-white" onClick={() => setShowAdd(true)}>
                <Plus size={16} className="mr-2" /> Add Location
            </Button>
        </div>
      </div>

      {locations.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-12 flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <MapPin size={40} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-white font-bold mb-2">No locations yet. Create your first location to get started.</h3>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {locations.map(loc => (
                  <div key={loc.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                              <MapPin size={24} />
                          </div>
                          <div>
                              <h3 className="font-bold text-white">{loc.name}</h3>
                              <p className="text-xs text-gray-500 uppercase">{loc.type}</p>
                          </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                          <p>{loc.address}</p>
                          <p className="flex items-center gap-2 text-xs text-gray-500"><Box size={12}/> Capacity: {loc.capacity}</p>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};
