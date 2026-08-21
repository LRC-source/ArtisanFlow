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
    <div className="p-3.5 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 lg:space-y-12 max-w-[1800px] mx-auto animate-in fade-in h-screen flex flex-col pb-8 sm:pb-12 lg:pb-20">
        <div className="flex flex-col gap-3 sm:gap-6">
            <button onClick={() => navigate('/operations')} className="flex items-center gap-3 text-white sm:text-white/40 hover:text-white font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all group w-fit">
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Operations
            </button>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">
                        <MapPin className="text-[#C5A059]" size={36} /> Warehouse Command Center
                        <Badge color="gold" className="text-[10px] uppercase font-sans font-bold tracking-[0.3em]">Beta</Badge>
                    </h1>
                    <p className="text-sm sm:text-base text-white sm:text-white/50 font-sans font-light italic mt-2">Real-time visualization of inventory flow and zones.</p>
                </div>
                <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-center justify-center gap-3 w-auto">
                    <Badge color="green" className="text-[10px] uppercase font-sans font-bold tracking-[0.3em] border-emerald-500/30 bg-emerald-500/10 text-emerald-400">Systems Online</Badge>
                    <Badge color="purple" className="text-[10px] uppercase font-sans font-bold tracking-[0.3em] border-[#6A2C91]/30 bg-[#6A2C91]/10 text-[#6A2C91]">Warehouse A</Badge>
                </div>
            </div>
        </div>

        {/* Warehouse Map Visualization */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden p-4 sm:p-8">
            <div className="absolute top-0 right-0 w-full sm:w-96 h-[250px] sm:h-96 bg-purple-500/5 rounded-bl-full -mr-20 -mt-8 sm:mt-12 lg:mt-20 pointer-events-none"></div>
            
            <div className="grid grid-cols-12 grid-rows-6 gap-3 sm:gap-6 h-full relative z-10">
                
                {/* Zone: Receiving */}
                <div className="col-span-3 row-span-6 bg-black/40 border border-white/10 rounded-[2.5rem] p-4 sm:p-6 flex flex-col relative group hover:border-[#C5A059]/30 transition-all shadow-inner">
                    <div className="absolute -top-4 left-6 bg-black border border-[#C5A059]/50 text-[#C5A059] px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.3em] rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                        <Truck size={14} /> Receiving & Raw Mat.
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="bg-white/5 p-4 rounded-3xl shadow-sm border border-white/5 group-hover:bg-white/10 transition-colors">
                            <p className="text-sm sm:text-base text-[10px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em]">Incoming</p>
                            <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">2 Shipments</p>
                            <p className="text-sm sm:text-base text-[10px] text-[#C5A059] font-sans font-bold uppercase tracking-widest mt-2">Expected 2:00 PM</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-3xl shadow-sm border border-white/5 group-hover:bg-white/10 transition-colors">
                            <p className="text-sm sm:text-base text-[10px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em]">Raw Stock</p>
                            <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{rawMaterials} Items</p>
                            <Badge color="red" className="mt-3 w-fit flex gap-2 items-center text-[9px] uppercase tracking-widest"><AlertCircle size={10} /> 1 Low Stock</Badge>
                        </div>
                    </div>
                </div>

                {/* Zone: Production */}
                <div className="col-span-6 row-span-4 bg-[#6A2C91]/10 border border-[#6A2C91]/20 rounded-[2.5rem] p-4 sm:p-6 relative hover:border-[#6A2C91]/40 transition-all shadow-inner">
                    <div className="absolute -top-4 left-6 bg-black border border-[#6A2C91]/50 text-[#6A2C91] px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.3em] rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(106,44,145,0.4)]">
                        <Layers size={14} /> Production Floor
                    </div>
                    <div className="flex h-full items-center justify-center gap-3 sm:gap-4 sm:p-5 lg:p-6 sm:p-8 mt-4">
                        <div className="text-center">
                            <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 rounded-[1.5rem] bg-white/[0.05] border border-white/20 backdrop-blur-xl shadow-[0_0_20px_rgba(106,44,145,0.3)] mx-auto mb-4 animate-pulse z-10">
                                <span className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-r from-[#6A2C91] to-transparent opacity-40 blur-md"></span>
                                <Layers className="text-[#6A2C91] relative z-10" size={32} strokeWidth={1.5} />
                            </div>
                            <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{activeBatches} Batches Active</p>
                            <p className="text-sm sm:text-base text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#6A2C91] mt-2">Mixing Station</p>
                        </div>
                        <div className="h-px w-24 bg-white/20 border-t border-dashed"></div>
                        <div className="text-center opacity-50">
                            <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 rounded-[1.5rem] bg-black/40 border border-white/10 backdrop-blur-xl mx-auto mb-4 z-10">
                                <Package className="text-white sm:text-white/40 relative z-10" size={32} strokeWidth={1.5} />
                            </div>
                            <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">Packaging</p>
                            <p className="text-sm sm:text-base text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-white/30 mt-2">Idle</p>
                        </div>
                    </div>
                </div>

                {/* Zone: Shipping */}
                <div className="col-span-3 row-span-6 bg-black/40 border border-white/10 rounded-[2.5rem] p-4 sm:p-6 relative hover:border-[#06B6D4]/30 transition-all shadow-inner group">
                    <div className="absolute -top-4 left-6 bg-black border border-[#06B6D4]/50 text-[#06B6D4] px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.3em] rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                        <Box size={14} /> Shipping & Fulfillment
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="bg-white/5 p-4 rounded-3xl shadow-sm border border-white/5 group-hover:bg-white/10 transition-colors">
                            <p className="text-sm sm:text-base text-[10px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em]">Pending Orders</p>
                            <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{pendingOrders}</p>
                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-[#06B6D4] h-full w-2/3 shadow-[0_0_10px_#06B6D4]"></div>
                            </div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-3xl shadow-sm border border-white/5 group-hover:bg-white/10 transition-colors">
                            <p className="text-sm sm:text-base text-[10px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em]">Ready to Ship</p>
                            <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">12 Parcels</p>
                            <Button onClick={() => toast.success('Labels sent to printer queue.')} className="w-full h-10 rounded-xl bg-white/10 hover:bg-[#06B6D4] text-white border-none font-sans font-bold text-[9px] uppercase tracking-widest transition-colors">Print Labels</Button>
                        </div>
                    </div>
                </div>

                {/* Zone: Finished Goods Storage (Bottom Center) */}
                <div className="col-span-6 row-span-2 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-4 sm:p-6 relative hover:border-emerald-500/40 transition-all shadow-inner flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between px-10">
                    <div className="absolute -top-4 left-6 bg-black border border-emerald-500/50 text-emerald-400 px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.3em] rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                        <Package size={14} /> Finished Goods Storage
                    </div>
                    <div>
                        <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{inventoryCount}</p>
                        <p className="text-sm sm:text-base text-[10px] text-emerald-400 font-sans font-bold uppercase tracking-[0.3em] mt-2">Total Units</p>
                    </div>
                    <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-center justify-center gap-3 w-auto sm:p-5 lg:p-6">
                        <div className="text-center">
                            <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">98%</p>
                            <p className="text-sm sm:text-base text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-white sm:text-white/40 mt-1">Capacity</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">$7.1k</p>
                            <p className="text-sm sm:text-base text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-white sm:text-white/40 mt-1">Value</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};
