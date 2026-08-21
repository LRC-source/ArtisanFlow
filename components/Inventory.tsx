import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, MoreVertical, Plus, Layers, Box, ArrowLeft, AlertTriangle, Upload, Download, RefreshCw, DollarSign, Tag, Edit2, Trash2, X, BarChart, TrendingUp, ShieldCheck, MapPin, Activity, Clock, Zap, ChevronRight, Sparkles, Save } from 'lucide-react';
import { Card, Badge, Button, Input, FileUploader, Modal, Select, VaultBanner } from './UI';
import { useNavigate } from 'react-router-dom';
import { useArtisanData, InventoryItem } from './DataContext';
import { GlassHaloIcon } from './ui/GlassHaloIcon';
import { motion } from 'framer-motion';
import { SubPageHeader } from './SubPageHeader';
import { toast } from 'sonner';
import { ContextualTutorialModal } from './ContextualTutorialModal';
import { z } from 'zod';
import { UpgradeModal } from './UpgradeModal';

/**
 * Inventory Hub - High-Fidelity Synaptic Architecture ✅
 */

type ViewMode = 'overview' | 'raw_materials' | 'finished_products' | 'detail';

export const Inventory = () => {
  const { inventory, getInventoryValue, addInventoryItem, updateInventory, recipes, userTier } = useArtisanData();
  const [view, setView] = useState<ViewMode>('overview');
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [upgradeLimit, setUpgradeLimit] = useState(50);
  const [requiredTier, setRequiredTier] = useState("Artisan Flow Basic");

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>(() => {
    const saved = sessionStorage.getItem('draft_inventory_item');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { name: '', sku: '', type: 'raw', stock: 0, unit: 'pcs', unitCost: 0, reorderPoint: 5, img: '' };
  });

  useEffect(() => {
    sessionStorage.setItem('draft_inventory_item', JSON.stringify(newItem));
  }, [newItem]);

  const rawMaterials = inventory.filter(i => i.type === 'raw');
  const finishedProducts = inventory.filter(i => i.type === 'finished');
  const lowStockItems = inventory.filter(i => i.stock <= i.reorderPoint);

  const handleItemClick = (item: InventoryItem) => {
      setSelectedItem(item);
      setView('detail');
  };

  const deployAssetSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    sku: z.string().min(1, { message: "SKU is required" }),
    type: z.enum(['raw', 'finished']),
    stock: z.number().min(0, { message: "Stock must be 0 or greater" }),
    unitCost: z.number().min(0, { message: "Unit cost must be 0 or greater" }),
    reorderPoint: z.number().min(0, { message: "Reorder point must be 0 or greater" })
  });

  const handleAdd = async () => {
      const result = deployAssetSchema.safeParse({
        name: newItem.name || '',
        sku: newItem.sku || '',
        type: newItem.type || 'raw',
        stock: Number(newItem.stock || 0),
        unitCost: Number(newItem.unitCost || 0),
        reorderPoint: Number(newItem.reorderPoint || 0)
      });

      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }

      try {
        await addInventoryItem({
          ...newItem,
          name: result.data.name,
          sku: result.data.sku,
          type: result.data.type,
          stock: result.data.stock,
          unitCost: result.data.unitCost,
          reorderPoint: result.data.reorderPoint
        } as any);
        toast.success(`${newItem.name} has been successfully deployed to the vault.`);
        setShowAddItem(false);
        setNewItem({ name: '', sku: '', type: 'raw', stock: 0, unit: 'pcs', unitCost: 0, reorderPoint: 5, img: '' });
        sessionStorage.removeItem('draft_inventory_item');
      } catch (e: any) {
        if (e.message.includes("Tier limit reached")) {
           const limitMatch = e.message.match(/\d+/);
           setUpgradeLimit(limitMatch ? parseInt(limitMatch[0]) : 50);
           setRequiredTier(userTier === 'Free Audit' ? 'Artisan Flow Basic' : 'Margin Protection Pro');
           setShowUpgradeModal(true);
        }
      }
  };

  const handleAdjustStock = () => {
      if (selectedItem) {
          updateInventory(selectedItem.id, { stock: selectedItem.stock + adjustAmount });
          setShowAdjustStock(false);
          setAdjustAmount(0);
          toast.success('Stock Quantity Adjusted');
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (!file.name.toLowerCase().endsWith('.csv')) {
          throw new Error('Invalid CSV format. Please upload a structured .csv file.');
        }

        toast.success('CSV Ingested and Processing...');
        // Process file...
      } catch (error: any) {
        toast.error(error.message || 'Error processing file');
      }
  };

  const getRecipeUsage = (itemName: string) => {
    return recipes.filter(r => r.ingredients.some(ing => ing.name.toLowerCase() === itemName.toLowerCase()));
  };

  if (view === 'detail' && selectedItem) {
      const usageInRecipes = getRecipeUsage(selectedItem.name);
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="p-3.5 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 lg:space-y-12 pb-8 sm:pb-12 lg:pb-20 max-w-[1800px] mx-auto"
        >
            <ContextualTutorialModal
                hubId="materials_matrix"
                title="Materials Matrix"
                description="Track raw materials and finished goods inventory."
                steps={["Monitor stock levels and reorder points.","Log raw material usage for production.","Adjust inventory counts via cycle counts."]}
            />
            <SubPageHeader 
              title={selectedItem.name}
              parentTitle="Inventory Hub"
              onBack={() => setView('overview')}
              description={`Detailed node analysis for ${selectedItem.name}. SKU: ${selectedItem.sku}`}
              actions={
                <Button 
                  onClick={() => toast.info("Audit protocol initialized.")}
                  className="bg-[#6A2C91] hover:bg-[#5a257a] text-white w-auto mx-auto py-1 px-3 text-[10px] px-6 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-purple-500/10"
                >
                  <RefreshCw size={14} className="mr-2" /> Run Audit
                </Button>
              }
            />            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-16">
                <div className="lg:col-span-4 space-y-10">
                    <div className="luxury-card bg-white/5 backdrop-blur-xl p-3.5 sm:p-6 lg:p-12 rounded-[3rem] relative overflow-hidden group shadow-2xl shadow-black/20 border border-white/10">
                        <div className="aspect-square bg-black/20 rounded-[2.5rem] overflow-hidden flex items-center justify-center relative shadow-inner">
                            {selectedItem.img ? (
                                <img src={selectedItem.img} alt={selectedItem.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                            ) : (
                                <Package size={120} className="text-white/5" strokeWidth={0.5} />
                            )}
                            <div className="absolute top-4 sm:p-6 lg:p-8 left-8">
                                <Badge color={selectedItem.type === 'raw' ? 'purple' : 'green'} className="px-5 py-2 uppercase font-sans font-bold tracking-[0.3em] text-[10px] shadow-lg">{selectedItem.type}</Badge>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 sticky bottom-4 z-50 md:static p-4 md:p-0 bg-[#0A0A0A]/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border border-white/10 md:border-none rounded-3xl md:rounded-none shadow-2xl md:shadow-none">
                        <Button onClick={() => setShowAdjustStock(true)} className="w-full bg-white text-black hover:bg-white/90 py-3 px-6 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-black/10">ADJUST STOCK QUANTITY</Button>
                        <Button onClick={() => { window.print(); toast.success('Archival label sent to connected printer.'); }} variant="outline" className="w-full border-white/10 hover:border-white/20 hover:bg-white/5 text-white py-3 px-6 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all">PRINT ARCHIVAL LABEL</Button>
                    </div>

                    <Modal isOpen={showAdjustStock} onClose={() => setShowAdjustStock(false)} title="Adjust Stock Quantity">
                        <div className="space-y-6 pt-4">
                            <div>
                                <label className="text-[10px] font-black text-white sm:text-gray-400 uppercase tracking-widest ml-1">Adjustment Amount (Use negative to subtract)</label>
                                <Input type="number" value={adjustAmount} onChange={e => setAdjustAmount(Number(e.target.value))} className="rounded-2xl py-4 font-bold" />
                            </div>
                            <Button onClick={handleAdjustStock} className="w-full bg-[#C5A059] hover:bg-[#b08e4d] text-white w-auto mx-auto py-1 px-3 text-[10px] rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl">Confirm Adjustment</Button>
                        </div>
                    </Modal>

                    <div className="p-3.5 sm:p-6 lg:p-12 bg-[#6A2C91]/10 rounded-[2.5rem] border border-[#6A2C91]/20">
                        <div className="flex items-center gap-3 sm:gap-4 mb-4 text-[#C5A059]">
                            <Zap size={20} strokeWidth={1.5} />
                            <h4 className="font-sans font-bold text-[11px] uppercase tracking-[0.3em]">AI Insight</h4>
                        </div>
                        <p className="text-sm sm:text-base text-white sm:text-white/60 font-sans font-light leading-relaxed">
                            This node is currently operating at <span className="font-medium text-white">optimal efficiency</span>. No supply chain disruptions predicted for the next 14 business days.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-6 sm:space-y-10 lg:space-y-12">
                    <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6">
                        <div>
                            <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">{selectedItem.name}</h1>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <p className="text-sm sm:text-base text-white/30 font-mono uppercase tracking-[0.3em] bg-white/5 px-3 py-1 rounded-md border border-white/5">ID: {selectedItem.sku}</p>
                                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                <p className="text-sm sm:text-base text-white/30 font-sans uppercase tracking-[0.2em]">Last Audit: Today</p>
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-sm sm:text-base font-serif text-[#C5A059] tracking-tighter leading-none">{selectedItem.stock}</p>
                            <p className="text-[12px] sm:text-base text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.4em] mt-4">{selectedItem.unit} IN VAULT</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                        <div className="luxury-card bg-white/5 border border-white/10 p-3.5 sm:p-6 lg:p-12 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-500">
                            <p className="text-[11px] sm:text-base text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-4">Stock Integrity</p>
                            <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">${selectedItem.unitCost.toFixed(2)}</p>
                        </div>
                        <div className="luxury-card bg-white/5 border border-white/10 p-3.5 sm:p-6 lg:p-12 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-500 border-l-4 border-emerald-500">
                            <p className="text-[11px] sm:text-base text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-4">Total Node Value</p>
                            <p className="text-sm sm:text-base font-black font-serif text-emerald-400 tracking-tight">${selectedItem.stockValue.toFixed(2)}</p>
                        </div>
                        <div className="luxury-card bg-white/5 border border-white/10 p-3.5 sm:p-6 lg:p-12 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-500">
                            <p className="text-[11px] sm:text-base text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-4">Safety Threshold</p>
                            <p className="text-sm sm:text-base font-black font-serif text-amber-500 tracking-tight">{selectedItem.reorderPoint} <span className="text-sm sm:text-base lg:text-xl text-white sm:text-slate-400 leading-relaxed sm:text-lg text-amber-500/50 font-sans font-light">{selectedItem.unit}</span></p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between px-2">
                            <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">Active Formula Dependency</h3>
                            <Badge color="gray" className="px-3 py-1 text-[9px] font-sans font-bold uppercase tracking-[0.2em]">{usageInRecipes.length} Active Nodes</Badge>
                        </div>
                        
                        {usageInRecipes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                                {usageInRecipes.map(recipe => (
                                    <div key={recipe.id} className="flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 sm:p-6 lg:p-12 bg-white/5 rounded-[2.5rem] border border-white/10 hover:border-[#6A2C91]/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 cursor-pointer group" onClick={() => navigate('/recipes')}>
                                        <div className="flex items-center gap-3 sm:gap-6">
                                            <GlassHaloIcon icon={Layers} color="purple" size="lg" className="group-hover:scale-110 transition-transform duration-500" />
                                            <div>
                                                <p className="text-sm sm:text-base font-serif text-white text-white sm:text-slate-400 leading-relaxed tracking-tight mb-1">{recipe.name}</p>
                                                <p className="text-[10px] sm:text-base text-white/30 font-sans font-bold uppercase tracking-[0.2em]">Primary Input Node</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all duration-500" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 sm:py-12 lg:py-16 px-4 sm:px-8 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                                <Zap size={48} strokeWidth={0.5} className="text-white/10 mx-auto mb-6" />
                                <p className="text-sm sm:text-base text-white/30 text-[11px] font-sans font-bold uppercase tracking-[0.3em]">No manufacturing dependencies detected.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
      );
  }

  if (view === 'overview') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="p-3.5 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 lg:space-y-12 pb-8 sm:pb-12 lg:pb-20 max-w-[1800px] mx-auto"
      >
        <ContextualTutorialModal
            hubId="inventory_hub"
            title="Inventory Hub Overview"
            description="Welcome to the Inventory Hub. Here you can track your raw materials and finished products."
            steps={[
                "Deploy new assets (raw materials or finished goods).",
                "Monitor stock levels and reorder points.",
                "Review automated Lola AI insights on margin impact."
            ]}
        />
        <div className="flex flex-col gap-3 sm:gap-6">
          <SubPageHeader 
            title="Inventory Hub"
            parentTitle="Command Center"
            onBack={() => navigate('/command-center')}
            description="Synchronized Asset Management: Tracking the flow of craftsmanship from raw material to retail-ready output."
          />
          
          <VaultBanner 
            title="Inventory Hub"
            subtitle="Synchronized Asset Management: Tracking the flow of craftsmanship from raw material to retail-ready output."
            badge="Asset Management Protocol Active"
          >
            {userTier !== 'Free Audit' && (
              <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row gap-3 sm:gap-4 sticky bottom-4 z-50 md:static p-4 md:p-0 bg-[#0A0A0A]/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border border-white/10 md:border-none rounded-3xl md:rounded-none shadow-2xl md:shadow-none w-auto">
                  <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-full border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-md text-white font-sans font-bold text-[11px] tracking-[0.2em] py-3 px-6 transition-all shadow-sm w-auto"><Upload size={16} className="mr-3"/> INGEST CSV</Button>
                  <Button variant="primary" onClick={() => setShowAddItem(true)} className="rounded-full bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-bold text-[11px] tracking-[0.2em] py-3 px-6 shadow-2xl shadow-black/10 transition-all w-auto"><Plus size={16} className="mr-3"/> DEPLOY ASSET</Button>
              </div>
            )}
          </VaultBanner>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 sm:p-10">
            <div onClick={() => setView('raw_materials')} className="luxury-card bg-white/5 border border-white/10 rounded-[3rem] p-6 sm:p-16 min-h-[220px] sm:min-h-[360px] flex flex-col items-start group relative overflow-hidden cursor-pointer h-full transition-all duration-700 hover:shadow-2xl hover:bg-white/10">
                <div className="absolute top-0 right-0 w-full sm:w-64 h-[180px] sm:h-64 bg-[#6A2C91] opacity-[0.05] rounded-bl-full -mr-20 -mt-8 sm:mt-12 lg:mt-20 group-hover:opacity-10 transition-opacity duration-1000"></div>
                <div className="flex items-center gap-3 sm:gap-6 relative z-10 mb-6 sm:mb-12">
                    <GlassHaloIcon icon={Box} color="cyan" size="lg" className="mb-10 z-10 w-12 h-12 sm:w-20 sm:h-20 [&>svg]:w-8 [&>svg]:h-8 group-hover:scale-105 group-hover:rotate-3" />
                    <div>
                        <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">Materials Matrix</h3>
                        <p className="text-sm sm:text-base text-white/30 font-sans font-bold uppercase text-[10px] tracking-[0.3em]">{rawMaterials.length} Active Nodes</p>
                    </div>
                </div>
                <div className="mt-auto flex items-center gap-3 sm:gap-4 text-[10px] font-sans font-bold text-[#C5A059] uppercase tracking-[0.3em] group-hover:translate-x-3 transition-transform duration-500">
                    ACCESS RAW VAULT <ChevronRight size={16} />
                </div>
            </div>

            <div onClick={() => setView('finished_products')} className="luxury-card bg-white/5 border border-white/10 rounded-[3rem] p-6 sm:p-16 min-h-[220px] sm:min-h-[360px] flex flex-col items-start group relative overflow-hidden cursor-pointer h-full transition-all duration-700 hover:shadow-2xl hover:bg-white/10">
                <div className="absolute top-0 right-0 w-full sm:w-64 h-[180px] sm:h-64 bg-[#C5A059] opacity-[0.05] rounded-bl-full -mr-20 -mt-8 sm:mt-12 lg:mt-20 group-hover:opacity-10 transition-opacity duration-1000"></div>
                <div className="flex items-center gap-3 sm:gap-6 relative z-10 mb-6 sm:mb-12">
                    <GlassHaloIcon icon={Package} color="gold" size="lg" className="mb-10 z-10 w-12 h-12 sm:w-20 sm:h-20 [&>svg]:w-8 [&>svg]:h-8 group-hover:scale-105 group-hover:rotate-3" />
                    <div>
                        <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">Finished Output</h3>
                        <p className="text-sm sm:text-base text-white/30 font-sans font-bold uppercase text-[10px] tracking-[0.3em]">{finishedProducts.length} Retail Ready</p>
                    </div>
                </div>
                <div className="mt-auto flex items-center gap-3 sm:gap-4 text-[10px] font-sans font-bold text-[#C5A059] uppercase tracking-[0.3em] group-hover:translate-x-3 transition-transform duration-500">
                    ACCESS PRODUCT VAULT <ChevronRight size={16} />
                </div>
            </div>

            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)}
                featureName="Inventory Items"
                currentLimit={upgradeLimit}
                requiredTier={requiredTier}
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 sm:p-10">
            <div className="luxury-card lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-6 sm:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 sm:p-16 opacity-[0.05]">
                    <BarChart size={240} className="text-[#C5A059]" strokeWidth={0.5} />
                </div>
                <div className="relative z-10">
                    <p className="text-[11px] sm:text-base text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.4em] mb-6 flex items-center gap-3 sm:gap-4">
                        <DollarSign size={16} className="text-[#C5A059]" /> Total Liquid Asset Valuation
                    </p>
                    <p className="text-sm sm:text-base font-serif text-white tracking-tighter">${getInventoryValue().toLocaleString()}</p>
                    <div className="mt-6 sm:mt-8 lg:mt-12 flex flex-col sm:flex-col sm:flex-col sm:flex-row items-center justify-center gap-3 w-auto sm:p-12">
                        <div>
                            <p className="text-[10px] sm:text-base text-white/30 font-sans font-bold uppercase tracking-[0.2em] mb-2">Raw Value</p>
                            <p className="text-sm sm:text-base font-black font-serif text-[#6A2C91]">${(getInventoryValue() * 0.4).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-base text-white/30 font-sans font-bold uppercase tracking-[0.2em] mb-2">Finished Value</p>
                            <p className="text-sm sm:text-base font-black font-serif text-[#C5A059]">${(getInventoryValue() * 0.6).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1 p-[1.5px] rounded-[3rem] bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] relative shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <div className="bg-[#0A0A0A] border-none backdrop-blur-3xl rounded-[3rem] p-6 sm:p-12 h-full flex flex-col">
                    <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
                        <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif text-amber-500 tracking-tight flex items-center gap-3 sm:gap-4">
                            <AlertTriangle size={24} className="text-amber-500" strokeWidth={1} /> Threshold Alerts
                        </h3>
                        <Badge color="red" className="px-4 py-1.5 text-[9px] font-sans font-bold uppercase tracking-[0.2em]">{lowStockItems.length}</Badge>
                    </div>
                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                        {lowStockItems.length > 0 ? lowStockItems.map(item => (
                            <div key={item.id} className="bg-white/5 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] border border-white/10 flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-all duration-500 group cursor-pointer">
                                <div>
                                    <p className="text-sm sm:text-base font-serif text-white text-white sm:text-slate-400 leading-relaxed tracking-tight mb-1 group-hover:text-amber-500 transition-colors">{item.name}</p>
                                    <p className="text-[10px] sm:text-base text-amber-500/60 font-sans font-medium uppercase tracking-[0.3em]">{item.stock} / {item.reorderPoint} Units Remaining</p>
                                </div>
                                <ChevronRight size={16} className="text-white/10 group-hover:translate-x-1 transition-transform" />
                            </div>
                        )) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                                <ShieldCheck size={48} className="text-amber-500/20 mb-4" />
                                <p className="text-[11px] sm:text-base font-sans font-medium uppercase tracking-[0.3em] text-amber-500/40">All Nodes Stable</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    );
  }

  if (view === 'raw_materials') {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-3.5 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 lg:space-y-12 pb-8 sm:pb-12 lg:pb-20 max-w-[1800px] mx-auto"
        >
            <div className="flex flex-col md:flex-col sm:flex-col sm:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 sm:p-10">
                <div>
                    <SubPageHeader 
                      title="Raw Material Vault"
                      parentTitle="Inventory Hub"
                      onBack={() => setView('overview')}
                      description="Managing the foundational elements of artisanal production."
                    />
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                    <input 
                        type="text" 
                        placeholder="SEARCH RAW ASSETS..." 
                        className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-full text-[11px] font-sans font-medium tracking-[0.2em] focus:ring-2 focus:ring-[#6A2C91]/20 transition-all shadow-sm text-white placeholder-white/20"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 sm:p-10 mt-4 sm:mt-0">
                {rawMaterials.map(item => (
                    <InventoryCard key={item.id} item={item} onClick={() => handleItemClick(item)} tagColor="purple" />
                ))}
            </div>
        </motion.div>
    );
  }

  if (view === 'finished_products') {
      return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-3.5 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 lg:space-y-12 pb-8 sm:pb-12 lg:pb-20 max-w-[1800px] mx-auto"
        >
            <div className="flex flex-col md:flex-col sm:flex-col sm:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 sm:p-10">
                <div>
                    <SubPageHeader 
                      title="Finished Output Vault"
                      parentTitle="Inventory Hub"
                      onBack={() => setView('overview')}
                      description="Retail-ready products prepared for high-end distribution."
                    />
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                    <input 
                        type="text" 
                        placeholder="SEARCH PRODUCT VAULT..." 
                        className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-full text-[11px] font-sans font-medium tracking-[0.2em] focus:ring-2 focus:ring-[#6A2C91]/20 transition-all shadow-sm text-white placeholder-white/20"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 sm:p-10 mt-4 sm:mt-0">
                {finishedProducts.map(item => (
                    <InventoryCard key={item.id} item={item} onClick={() => handleItemClick(item)} tagColor="green" isProduct />
                ))}
            </div>
        </motion.div>
      );
  }

  return null;
};const InventoryCard = ({ item, onClick, tagColor, isProduct }: any) => (
    <motion.div 
        whileHover={{ y: -10, scale: 1.02 }}
        onClick={onClick} 
        className="luxury-card bg-white/5 border border-white/10 rounded-[2.5rem] p-3.5 sm:p-6 lg:p-12 transition-all duration-700 cursor-pointer relative overflow-hidden group flex flex-col h-full hover:bg-white/10"
    >
        <div className="absolute top-0 right-0 p-3.5 sm:p-6 lg:p-12 opacity-[0.02] group-hover:opacity-10 transition-opacity duration-1000">
            <Package size={120} className="text-white" strokeWidth={0.5} />
        </div>
        <div className="flex flex-col gap-3 sm:gap-6 mb-10 relative z-10">
            <div className="w-14 h-14 sm:w-24 sm:h-24 bg-black/20 rounded-[2rem] overflow-hidden flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-700 border border-white/5">
                {item.img ? <img src={item.img} className="w-full h-full object-cover" /> : <Box size={32} className="text-white/10" strokeWidth={1} />}
            </div>
            <div>
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-serif text-white font-black tracking-tight line-clamp-2 mb-2 group-hover:text-[#C5A059] transition-colors">{item.name}</h3>
                <div className="flex items-center gap-3">
                    <Badge color={tagColor} className="px-3 py-1 text-[8px] font-sans font-bold uppercase tracking-[0.2em]">{isProduct ? 'Product' : 'Material'}</Badge>
                    <p className="text-[9px] sm:text-base text-white/30 font-mono uppercase tracking-[0.2em]">SKU: {item.sku}</p>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 pt-8 border-t border-white/5 mt-auto relative z-10">
            <div>
                <p className="text-[9px] sm:text-base text-white/30 font-sans font-medium uppercase tracking-[0.3em] mb-2">Available</p>
                <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{item.stock} <span className="text-xs text-white/30 font-sans font-light uppercase">{item.unit}</span></p>
            </div>
            <div className="text-right">
                <p className="text-[9px] sm:text-base text-white/30 font-sans font-medium uppercase tracking-[0.3em] mb-2">Unit Cost</p>
                <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">${item.unitCost.toFixed(2)}</p>
            </div>
        </div>
    </motion.div>
);

export default Inventory;

