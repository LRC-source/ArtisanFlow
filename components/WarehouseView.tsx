import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, Badge, Button } from './UI';
import { MapPin, Package, Truck, Layers, ArrowLeft, Box, AlertCircle } from 'lucide-react';

export const WarehouseView = () => {
  const navigate = useNavigate();

  // Mock aggregated data simulating APP_DATA
  const inventoryCount = 1204;
  const pendingOrders = 5;
  const activeBatches = 2;
  const rawMaterials = 14;

  return (
    <div className="p-6 space-y-6 animate-in fade-in h-screen flex flex-col bg-stone-50">
        <div className="flex justify-between items-center">
            <div>
                <button onClick={() => navigate('/operations')} className="flex items-center gap-2 text-gray-500 hover:text-[#6A2C91] mb-2 font-medium">
                    <ArrowLeft size={18} /> Back to Operations
                </button>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <MapPin className="text-[#C5A059]" size={32} /> Warehouse Command Center
                    <Badge color="gold">Beta</Badge>
                </h1>
                <p className="text-gray-500">Real-time visualization of inventory flow and zones.</p>
            </div>
            <div className="flex gap-2">
                <Badge color="green">Systems Online</Badge>
                <Badge color="purple">Warehouse A</Badge>
            </div>
        </div>

        {/* Warehouse Map Visualization */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-lg relative overflow-hidden p-4 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
            
            <div className="grid grid-cols-12 grid-rows-6 gap-6 h-full relative z-10">
                
                {/* Zone: Receiving */}
                <div className="col-span-3 row-span-6 bg-amber-50/80 border-2 border-dashed border-amber-200 rounded-xl p-4 flex flex-col relative group hover:bg-amber-50 transition-colors">
                    <div className="absolute -top-3 left-4 bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold uppercase rounded border border-amber-200 flex items-center gap-2">
                        <Truck size={14} /> Receiving & Raw Mat.
                    </div>
                    <div className="mt-6 space-y-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-amber-100">
                            <p className="text-xs text-gray-500 uppercase">Incoming</p>
                            <p className="font-bold text-gray-900">2 Shipments</p>
                            <p className="text-xs text-amber-600 mt-1">Expected 2:00 PM</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-amber-100">
                            <p className="text-xs text-gray-500 uppercase">Raw Stock</p>
                            <p className="font-bold text-gray-900">{rawMaterials} Items</p>
                            <Badge color="red" className="mt-1 w-fit flex gap-1 items-center"><AlertCircle size={10} /> 1 Low Stock</Badge>
                        </div>
                    </div>
                </div>

                {/* Zone: Production */}
                <div className="col-span-6 row-span-4 bg-purple-50/80 border-2 border-dashed border-purple-200 rounded-xl p-4 relative hover:bg-purple-50 transition-colors">
                    <div className="absolute -top-3 left-4 bg-purple-100 text-purple-800 px-3 py-1 text-xs font-bold uppercase rounded border border-purple-200 flex items-center gap-2">
                        <Layers size={14} /> Production Floor
                    </div>
                    <div className="flex h-full items-center justify-center gap-4 sm:p-8 mt-4">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border border-purple-100 mx-auto mb-2 animate-pulse">
                                <Layers className="text-purple-600" size={32} />
                            </div>
                            <p className="font-bold text-gray-900">{activeBatches} Batches Active</p>
                            <p className="text-xs text-gray-500">Mixing Station</p>
                        </div>
                        <div className="h-px w-20 bg-purple-300 border-t border-dashed"></div>
                        <div className="text-center opacity-50">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 mx-auto mb-2">
                                <Package className="text-gray-400" size={32} />
                            </div>
                            <p className="font-bold text-gray-900">Packaging</p>
                            <p className="text-xs text-gray-500">Idle</p>
                        </div>
                    </div>
                </div>

                {/* Zone: Shipping */}
                <div className="col-span-3 row-span-6 bg-blue-50/80 border-2 border-dashed border-blue-200 rounded-xl p-4 relative hover:bg-blue-50 transition-colors">
                    <div className="absolute -top-3 left-4 bg-blue-100 text-blue-800 px-3 py-1 text-xs font-bold uppercase rounded border border-blue-200 flex items-center gap-2">
                        <Box size={14} /> Shipping & Fulfillment
                    </div>
                    <div className="mt-6 space-y-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                            <p className="text-xs text-gray-500 uppercase">Pending Orders</p>
                            <p className="font-bold text-gray-900">{pendingOrders}</p>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-blue-500 h-full w-2/3"></div>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                            <p className="text-xs text-gray-500 uppercase">Ready to Ship</p>
                            <p className="font-bold text-gray-900">12 Parcels</p>
                            <Button onClick={() => toast.success('Labels sent to printer queue.')} variant="primary" className="w-full mt-2 text-xs py-1 h-8 bg-blue-600 hover:bg-blue-700">Print Labels</Button>
                        </div>
                    </div>
                </div>

                {/* Zone: Finished Goods Storage (Bottom Center) */}
                <div className="col-span-6 row-span-2 bg-emerald-50/80 border-2 border-dashed border-emerald-200 rounded-xl p-4 relative hover:bg-emerald-50 transition-colors flex items-center justify-between px-8">
                    <div className="absolute -top-3 left-4 bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold uppercase rounded border border-emerald-200 flex items-center gap-2">
                        <Package size={14} /> Finished Goods Storage
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900">{inventoryCount}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Units</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <p className="font-bold text-gray-800">98%</p>
                            <p className="text-[10px] text-gray-500">Capacity</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-gray-800">$7.1k</p>
                            <p className="text-[10px] text-gray-500">Value</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};
