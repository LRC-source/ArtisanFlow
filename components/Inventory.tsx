import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Filter, MoreVertical, Plus, Layers, Box, ArrowLeft, AlertTriangle, Upload, 
  Download, RefreshCw, DollarSign, Tag, Edit2, Trash2, X, BarChart, TrendingUp, ShieldCheck, 
  MapPin, Activity, Clock, Zap, ChevronRight, Sparkles, Save, Table, Play, CheckCircle2, Factory
} from 'lucide-react';
import { Card, Badge, Button, Input, FileUploader, Modal, Select, DashboardBanner } from './UI';
import { useNavigate } from 'react-router-dom';
import { useArtisanData, InventoryItem, Lot, calculateDerivedStockAndCost, Recipe, ProductionBatch } from './DataContext';
import { GlassHaloIcon } from './ui/GlassHaloIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageHeader } from './SubPageHeader';
import { toast } from 'sonner';
import { ContextualTutorialModal } from './ContextualTutorialModal';
import { z } from 'zod';
import { UpgradeModal } from './UpgradeModal';
import { InventoryCSVImporter, ImportEntity } from './InventoryCSVImporter';

/**
 * Inventory Hub - Maker Inventory & Formulation Engine Architecture ✅
 */

type ViewMode = 'overview' | 'raw_materials' | 'recipes' | 'batches' | 'finished_products' | 'detail';

export const Inventory = () => {
  const { 
    inventory, getInventoryValue, addInventoryItem, updateInventory, deleteInventoryItem, 
    recipes, productionBatches, produceBatch, userTier, migrateInventoryToLots 
  } = useArtisanData();

  const [view, setView] = useState<ViewMode>('overview');
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const navigate = useNavigate();

  // Importer state
  const [showImporter, setShowImporter] = useState(false);
  const [importerDefaultEntity, setImporterDefaultEntity] = useState<ImportEntity>('raw_materials');

  // Manufacturing Batch Run State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedBatchRecipe, setSelectedBatchRecipe] = useState<string>('');
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1);
  const [batchWarnings, setBatchWarnings] = useState<string[]>([]);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [showMigrateLots, setShowMigrateLots] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [upgradeLimit, setUpgradeLimit] = useState(50);
  const [requiredTier, setRequiredTier] = useState("Basic Artisan");

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

  const handleOpenImporter = (entity: ImportEntity = 'raw_materials') => {
    setImporterDefaultEntity(entity);
    setShowImporter(true);
  };

  const deployAssetSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    sku: z.string().min(1, { message: "SKU is required" }),
    type: z.enum(['raw', 'finished']),
    stock: z.number().min(0, { message: "Stock must be 0 or greater" }),
    unitCost: z.number().min(0, { message: "Unit cost must be 0 or greater" }),
    reorderPoint: z.number().min(0, { message: "Reorder point must be 0 or greater" }),
  });

  const handleDeployAsset = async () => {
    const payload = {
      name: newItem.name || '',
      sku: newItem.sku || '',
      type: newItem.type || 'raw',
      stock: Number(newItem.stock || 0),
      unitCost: Number(newItem.unitCost || 0),
      reorderPoint: Number(newItem.reorderPoint || 5),
      unit: newItem.unit || 'units',
      supplier: newItem.supplier || '',
      category: newItem.category || 'General',
      retailPrice: Number(newItem.retailPrice || 0)
    };

    const result = deployAssetSchema.safeParse(payload);
    if (!result.success) {
      const firstErr = result.error.errors[0]?.message || "Invalid asset fields";
      toast.error(firstErr);
      return;
    }

    try {
      await addInventoryItem(payload);
      toast.success("Asset deployed to inventory successfully.");
      setShowAddItem(false);
      setNewItem({ name: '', sku: '', type: 'raw', stock: 0, unit: 'pcs', unitCost: 0, reorderPoint: 5 });
      sessionStorage.removeItem('draft_inventory_item');
    } catch (e: any) {
      if (e.message && e.message.includes("Tier limit reached")) {
        setUpgradeLimit(e.message.split(": ")[1] || 50);
        setRequiredTier("Basic Artisan");
        setShowUpgradeModal(true);
      }
    }
  };

  // Manufacturing / Batch Execution Logic
  const handleTriggerBatchRun = async (overrideWarnings = false) => {
    if (!selectedBatchRecipe) {
      toast.error('Please select a recipe for production batch execution.');
      return;
    }

    const recipe = recipes.find(r => r.id === selectedBatchRecipe);
    if (!recipe) return;

    // Check availability first if not overriding
    if (!overrideWarnings && recipe.rawIngredients) {
      const missingStock: string[] = [];
      recipe.rawIngredients.forEach(ing => {
        const item = inventory.find(i => i.id === ing.inventoryItemId);
        const requiredQty = ing.quantity * batchMultiplier;
        if (!item || item.stock < requiredQty) {
          missingStock.push(
            `${item ? item.name : 'Ingredient'}: Need ${requiredQty} ${ing.unit}, but only ${item ? item.stock : 0} in stock`
          );
        }
      });

      if (missingStock.length > 0) {
        setBatchWarnings(missingStock);
        setShowWarningModal(true);
        return;
      }
    }

    // Execute batch via DataContext
    const res = await produceBatch(selectedBatchRecipe, batchMultiplier);
    if (res.success) {
      toast.success(`Production Batch logged! Deducted raw materials and credited finished output.`);
      setShowBatchModal(false);
      setShowWarningModal(false);
      setSelectedBatchRecipe('');
      setBatchMultiplier(1);
    } else {
      toast.error(res.warnings[0] || 'Failed to complete production run.');
    }
  };

  // Render detail view
  if (view === 'detail' && selectedItem) {
    const { stock, unitCost, stockValue } = calculateDerivedStockAndCost(selectedItem);
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="p-3.5 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 lg:space-y-12 max-w-[1800px] mx-auto"
      >
        <SubPageHeader 
          title={selectedItem.name} 
          parentTitle="Inventory Hub" 
          onBack={() => setView('overview')}
          description={`SKU: ${selectedItem.sku} | Module: ${selectedItem.type.toUpperCase()}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="luxury-card bg-white/5 border border-white/10 p-6 rounded-[2.5rem]">
            <p className="text-xs text-white/40 uppercase tracking-widest font-sans font-bold">Current Stock Level</p>
            <p className="text-3xl font-black text-white mt-2 font-sans">{stock} <span className="text-base text-white/50">{selectedItem.unit}</span></p>
          </div>
          <div className="luxury-card bg-white/5 border border-white/10 p-6 rounded-[2.5rem]">
            <p className="text-xs text-white/40 uppercase tracking-widest font-sans font-bold">Unit Valuation</p>
            <p className="text-3xl font-black text-emerald-400 mt-2 font-sans">${unitCost.toFixed(2)}</p>
          </div>
          <div className="luxury-card bg-white/5 border border-white/10 p-6 rounded-[2.5rem]">
            <p className="text-xs text-white/40 uppercase tracking-widest font-sans font-bold">Total Stock Value</p>
            <p className="text-3xl font-black text-[#C5A059] mt-2 font-sans">${stockValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setShowAdjustStock(true)}>Manual Stock Adjustment</Button>
          <Button variant="outline" className="text-red-400 border-red-500/30" onClick={() => { deleteInventoryItem(selectedItem.id); setView('overview'); }}>Delete Item</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3.5 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 lg:space-y-12 max-w-[1800px] mx-auto pb-20"
    >
      <ContextualTutorialModal
        hubId="inventory_hub"
        title="Maker Inventory & Formulation Engine"
        description="Full relational maker inventory system connecting Raw Materials, BOM Recipes, Manufacturing Batches, and Finished Goods."
        steps={[
          "Track Raw Materials with reorder safety thresholds.",
          "Link materials to Recipes and trigger Batch Runs.",
          "Deduct materials automatically and generate Finished Goods stock.",
          "Use the CSV Import & Column Mapping Hub to import data in bulk."
        ]}
      />

      {/* Main Banner */}
      <DashboardBanner 
        title="Inventory & Formulation System" 
        subtitle="Unified relational tracking across raw materials, BOM formulations, production runs & sellable finished goods."
        badge="Inventory Engine Operational"
      >
        <div className="flex gap-3 flex-wrap">
          <Button 
            className="bg-[#C5A059] text-black font-bold uppercase tracking-wider text-xs rounded-full px-6 hover:bg-[#b08e4d]"
            onClick={() => handleOpenImporter('raw_materials')}
          >
            <Table size={16} className="mr-2" /> CSV Import & Mapping Hub
          </Button>

          <Button 
            className="bg-[#6A2C91] text-white font-bold uppercase tracking-wider text-xs rounded-full px-6 hover:bg-[#5a257a]"
            onClick={() => setShowBatchModal(true)}
          >
            <Play size={16} className="mr-2" /> Trigger Production Batch
          </Button>

          <Button 
            variant="outline" 
            className="text-xs uppercase tracking-wider rounded-full px-5 text-white border-white/20 hover:bg-white/10"
            onClick={() => setShowAddItem(true)}
          >
            <Plus size={16} className="mr-2" /> Deploy Asset
          </Button>
        </div>
      </DashboardBanner>

      {/* 4-Module Tab Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart },
            { id: 'raw_materials', label: `Raw Materials (${rawMaterials.length})`, icon: Package },
            { id: 'recipes', label: `Recipes & BOM (${recipes.length})`, icon: Layers },
            { id: 'batches', label: `Manufacturing Runs (${productionBatches.length})`, icon: Factory },
            { id: 'finished_products', label: `Finished Goods (${finishedProducts.length})`, icon: Box }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = view === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as ViewMode)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                  isActive 
                    ? 'bg-white text-black shadow-lg' 
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: OVERVIEW */}
      {view === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="luxury-card bg-white/5 border border-white/10 p-6 rounded-[2.5rem]">
              <p className="text-xs text-white/40 uppercase tracking-widest font-sans font-bold">Total Inventory Valuation</p>
              <p className="text-3xl font-black text-[#C5A059] mt-2 font-sans">${getInventoryValue().toFixed(2)}</p>
            </div>
            <div className="luxury-card bg-white/5 border border-white/10 p-6 rounded-[2.5rem]">
              <p className="text-xs text-white/40 uppercase tracking-widest font-sans font-bold">Raw Material SKUs</p>
              <p className="text-3xl font-black text-white mt-2 font-sans">{rawMaterials.length}</p>
            </div>
            <div className="luxury-card bg-white/5 border border-white/10 p-6 rounded-[2.5rem]">
              <p className="text-xs text-white/40 uppercase tracking-widest font-sans font-bold">Active Batches Logged</p>
              <p className="text-3xl font-black text-purple-400 mt-2 font-sans">{productionBatches.length}</p>
            </div>
            <div className="luxury-card bg-white/5 border border-white/10 p-6 rounded-[2.5rem]">
              <p className="text-xs text-white/40 uppercase tracking-widest font-sans font-bold">Low Stock Reorder Alerts</p>
              <p className="text-3xl font-black text-amber-400 mt-2 font-sans">{lowStockItems.length}</p>
            </div>
          </div>

          {/* Quick Module Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => setView('raw_materials')}
              className="p-6 bg-white/5 border border-white/10 hover:border-[#C5A059] rounded-[2.5rem] cursor-pointer transition-all space-y-3"
            >
              <Package size={32} className="text-[#C5A059]" />
              <h3 className="text-lg font-serif font-bold text-white">Raw Materials & Ingredients</h3>
              <p className="text-xs text-white/50 font-sans">Manage raw oil, wax, container & packaging stock with vendor cost tracking.</p>
              <div className="text-xs font-bold text-[#C5A059] flex items-center gap-1 uppercase tracking-wider">
                Explore Raw Materials <ChevronRight size={16} />
              </div>
            </div>

            <div 
              onClick={() => setView('recipes')}
              className="p-6 bg-white/5 border border-white/10 hover:border-[#C5A059] rounded-[2.5rem] cursor-pointer transition-all space-y-3"
            >
              <Layers size={32} className="text-purple-400" />
              <h3 className="text-lg font-serif font-bold text-white">Recipes & Formulations (BOM)</h3>
              <p className="text-xs text-white/50 font-sans">Formulas linking exact raw ingredient quantities to batch yields & unit cost.</p>
              <div className="text-xs font-bold text-purple-400 flex items-center gap-1 uppercase tracking-wider">
                View Formulations <ChevronRight size={16} />
              </div>
            </div>

            <div 
              onClick={() => setView('finished_products')}
              className="p-6 bg-white/5 border border-white/10 hover:border-[#C5A059] rounded-[2.5rem] cursor-pointer transition-all space-y-3"
            >
              <Box size={32} className="text-emerald-400" />
              <h3 className="text-lg font-serif font-bold text-white">Finished Goods & Ready to Sell</h3>
              <p className="text-xs text-white/50 font-sans">Track retail inventory output created from batch manufacturing runs.</p>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                View Finished Goods <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: RAW MATERIALS */}
      {view === 'raw_materials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wide">Raw Materials & Ingredients Directory</h2>
            <Button className="text-xs bg-[#C5A059] text-black font-bold" onClick={() => handleOpenImporter('raw_materials')}>
              Import Raw Materials CSV
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rawMaterials.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleItemClick(item)}
                className="p-5 bg-white/5 border border-white/10 hover:border-white/20 rounded-3xl cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/40">{item.sku}</span>
                  <Badge color={item.stock <= item.reorderPoint ? 'amber' : 'emerald'}>
                    {item.stock <= item.reorderPoint ? 'Low Stock Alert' : 'Stock Healthy'}
                  </Badge>
                </div>
                <h4 className="text-base font-bold font-serif text-white">{item.name}</h4>
                <div className="flex justify-between text-xs text-white/60 font-sans">
                  <span>Stock: <strong className="text-white">{item.stock} {item.unit}</strong></span>
                  <span>Unit Cost: <strong className="text-emerald-400">${item.unitCost.toFixed(2)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: RECIPES & FORMULATIONS */}
      {view === 'recipes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wide">Recipes & Bill of Materials (BOM)</h2>
            <Button className="text-xs bg-[#6A2C91] text-white font-bold" onClick={() => navigate('/recipes')}>
              Manage in Recipe Lab
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">{recipe.name}</h3>
                    <p className="text-xs font-sans text-white/40">Yield: {recipe.yield} (Qty: {recipe.yieldValue || 1})</p>
                  </div>
                  <Badge color="purple">${recipe.totalCost.toFixed(2)} / batch</Badge>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-3">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Required Ingredients:</p>
                  <ul className="text-xs text-white/80 space-y-1">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{ing.name}</span>
                        <span className="font-mono text-white/50">{ing.qty}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className="w-full text-xs bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider"
                  onClick={() => {
                    setSelectedBatchRecipe(recipe.id);
                    setShowBatchModal(true);
                  }}
                >
                  <Play size={14} className="mr-2" /> Start Production Batch Run
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: MANUFACTURING BATCH RUNS */}
      {view === 'batches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wide">Manufacturing Batch Logs</h2>
            <Button className="text-xs bg-[#6A2C91] text-white font-bold" onClick={() => setShowBatchModal(true)}>
              <Play size={14} className="mr-1" /> New Batch Production
            </Button>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-3xl bg-black/40">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-white/10 text-white/70 border-b border-white/10 uppercase tracking-widest font-bold">
                <tr>
                  <th className="p-4">Batch ID</th>
                  <th className="p-4">Recipe / Formula</th>
                  <th className="p-4">Date Produced</th>
                  <th className="p-4">Yield Quantity</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {productionBatches.map((batch) => {
                  const rec = recipes.find(r => r.id === batch.recipeId);
                  return (
                    <tr key={batch.id} className="hover:bg-white/5">
                      <td className="p-4 font-mono font-bold text-[#C5A059]">{batch.batchNumber}</td>
                      <td className="p-4 font-bold text-white">{rec ? rec.name : 'Formula'}</td>
                      <td className="p-4 text-white/60">{new Date(batch.producedDate).toLocaleDateString()}</td>
                      <td className="p-4 font-bold">{batch.yieldQuantity} units</td>
                      <td className="p-4">
                        <Badge color="emerald">Completed</Badge>
                      </td>
                    </tr>
                  );
                })}
                {productionBatches.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-white/30 italic">No production runs logged yet. Click "New Batch Production" to start.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: FINISHED GOODS */}
      {view === 'finished_products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wide">Finished Goods (Ready to Sell)</h2>
            <Button className="text-xs bg-[#C5A059] text-black font-bold" onClick={() => handleOpenImporter('finished_goods')}>
              Import Finished Goods CSV
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {finishedProducts.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleItemClick(item)}
                className="p-5 bg-white/5 border border-white/10 hover:border-white/20 rounded-3xl cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/40">{item.sku}</span>
                  <Badge color="emerald">Ready to Sell</Badge>
                </div>
                <h4 className="text-base font-bold font-serif text-white">{item.name}</h4>
                <div className="flex justify-between text-xs text-white/60 font-sans">
                  <span>Stock: <strong className="text-white">{item.stock} {item.unit}</strong></span>
                  <span>Retail Price: <strong className="text-emerald-400">${(item.retailPrice || 0).toFixed(2)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSV IMPORTER MODAL */}
      {showImporter && (
        <InventoryCSVImporter 
          onClose={() => setShowImporter(false)}
          defaultEntity={importerDefaultEntity}
        />
      )}

      {/* BATCH PRODUCTION MODAL */}
      <Modal isOpen={showBatchModal} onClose={() => setShowBatchModal(false)} title="Trigger Production Batch Run">
        <div className="space-y-4 pt-2">
          <p className="text-xs text-white/60">
            Executing a batch run will automatically deduct proportional Raw Materials from inventory and credit Finished Goods stock.
          </p>

          <div>
            <label className="text-xs font-bold uppercase text-white/70 block mb-2">Select Recipe / Formulation</label>
            <Select 
              value={selectedBatchRecipe} 
              onChange={e => setSelectedBatchRecipe(e.target.value)}
              className="w-full bg-black text-xs text-white"
            >
              <option value="">-- Choose Recipe --</option>
              {recipes.map(r => (
                <option key={r.id} value={r.id}>{r.name} (Yield: {r.yield})</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-white/70 block mb-2">Batch Multiplier (Number of Batches)</label>
            <Input 
              type="number" 
              min={1} 
              value={batchMultiplier} 
              onChange={e => setBatchMultiplier(Math.max(1, Number(e.target.value)))}
              className="bg-black text-white"
            />
          </div>

          <Button 
            className="w-full bg-[#C5A059] text-black font-bold uppercase tracking-wider text-xs py-3 rounded-full mt-4"
            onClick={() => handleTriggerBatchRun(false)}
          >
            Execute Production Run
          </Button>
        </div>
      </Modal>

      {/* WARNING MODAL FOR INSUFFICIENT STOCK */}
      <Modal isOpen={showWarningModal} onClose={() => setShowWarningModal(false)} title="Insufficient Raw Material Warning">
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="text-amber-400 shrink-0" size={24} />
            <div>
              <h4 className="text-sm font-bold text-amber-400">Low Raw Material Stock Detected</h4>
              <p className="text-xs text-white/70 mt-1">
                The required raw materials exceed your currently available inventory. Executing this batch will result in negative stock.
              </p>
            </div>
          </div>

          <div className="bg-black/50 p-4 rounded-2xl border border-white/10 space-y-2">
            <p className="text-xs font-bold text-white uppercase">Stock Deficiencies:</p>
            <ul className="text-xs text-amber-300 space-y-1 list-disc pl-4">
              {batchWarnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 text-xs" onClick={() => setShowWarningModal(false)}>
              Cancel Batch Run
            </Button>
            <Button className="flex-1 bg-amber-500 text-black font-bold text-xs" onClick={() => handleTriggerBatchRun(true)}>
              Override & Run Batch
            </Button>
          </div>
        </div>
      </Modal>

      {/* DEPLOY ASSET MODAL */}
      <Modal isOpen={showAddItem} onClose={() => setShowAddItem(false)} title="Deploy Asset to Inventory">
        <div className="space-y-4 pt-4">
          <Input placeholder="Asset Name (e.g. Lavender Oil)" value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} className="bg-black/50 text-white" />
          <Input placeholder="SKU (e.g. RAW-LAV-01)" value={newItem.sku || ''} onChange={e => setNewItem({...newItem, sku: e.target.value})} className="bg-black/50 text-white" />
          
          <div className="grid grid-cols-2 gap-4">
            <Select value={newItem.type || 'raw'} onChange={e => setNewItem({...newItem, type: e.target.value as any})} className="bg-black/50 text-white">
              <option value="raw">Raw Material</option>
              <option value="finished">Finished Product</option>
            </Select>
            <Input placeholder="Unit (e.g. oz, pcs)" value={newItem.unit || 'pcs'} onChange={e => setNewItem({...newItem, unit: e.target.value})} className="bg-black/50 text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input type="number" placeholder="Initial Stock" value={newItem.stock || ''} onChange={e => setNewItem({...newItem, stock: Number(e.target.value)})} className="bg-black/50 text-white" />
            <Input type="number" placeholder="Unit Cost ($)" value={newItem.unitCost || ''} onChange={e => setNewItem({...newItem, unitCost: Number(e.target.value)})} className="bg-black/50 text-white" />
          </div>

          <Button className="w-full bg-[#6A2C91] text-white font-bold uppercase tracking-wider text-xs py-3 rounded-full mt-4" onClick={handleDeployAsset}>
            Commit & Deploy Asset
          </Button>
        </div>
      </Modal>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Inventory SKU Limit"
        currentLimit={upgradeLimit}
        requiredTier={requiredTier}
      />
    </motion.div>
  );
};
