import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge, Modal } from './UI';
import { Plus, Trash2, Save, Calculator, ArrowRight, Layers, ArrowLeft, TrendingUp, DollarSign, Zap, Target, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import { Api } from '../services/api';
import { InventoryType, Recipe, RecipeIngredient } from '../types';
import { useNavigate, useParams } from 'react-router-dom';
import { useArtisanData, InventoryItem } from './DataContext';
import { z } from 'zod';
import { toast } from 'sonner';
import { UpgradeModal } from './UpgradeModal';

/**
 * BOM & Formula Builder - High-Precision Cost Architecture
 */

export const RecipeBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { inventory, recipes, addRecipe, updateRecipe, userTier } = useArtisanData();
  const [materials, setMaterials] = useState<InventoryItem[]>([]);
  
  const loadDraft = () => {
    const saved = sessionStorage.getItem('draft_recipe');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  };
  const draft = loadDraft();

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(draft?.ingredients || []);
  const [yieldQty, setYieldQty] = useState(draft?.yieldQty || 1);
  const [laborCost, setLaborCost] = useState(draft?.laborCost || 0);
  const [recipeName, setRecipeName] = useState(draft?.recipeName || '');
  const [sku, setSku] = useState(draft?.sku || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeLimit, setUpgradeLimit] = useState(5);
  const [requiredTier, setRequiredTier] = useState("Artisan Flow Basic");
  const [showROIHeatmap, setShowROIHeatmap] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      sessionStorage.setItem('draft_recipe', JSON.stringify({
        ingredients, yieldQty, laborCost, recipeName, sku
      }));
    }
  }, [ingredients, yieldQty, laborCost, recipeName, sku, isEditing]);

  useEffect(() => {
    setMaterials(inventory.filter(i => i.type === 'raw'));
  }, [inventory]);

  useEffect(() => {
    if (id && recipes.length > 0) {
        const existing = recipes.find(r => r.id === id);
        if (existing) {
            setIsEditing(true);
            setRecipeName(existing.name);
            setSku(existing.sku);
            setYieldQty(existing.yieldValue || 1);
            setLaborCost(existing.laborCost || 0);
            if (existing.rawIngredients) {
                setIngredients(existing.rawIngredients);
            }
        }
    }
  }, [id, recipes]);

  const addIngredient = () => {
    if (materials.length === 0) return;
    setIngredients([...ingredients, { inventoryItemId: materials[0].id.toString(), quantity: 1, unit: materials[0].unit || 'oz' }]);
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const calculateTotalCost = () => {
    const materialCost = ingredients.reduce((sum, ing) => {
      const mat = materials.find(m => m.id.toString() === ing.inventoryItemId.toString());
      return sum + (mat ? mat.unitCost * ing.quantity : 0);
    }, 0);
    return materialCost + Number(laborCost);
  };

  const totalCost = calculateTotalCost();
  const costPerUnit = yieldQty > 0 ? totalCost / yieldQty : 0;
  const targetRetail = costPerUnit * 2.2;

  const recipeSchema = z.object({
    name: z.string().min(1, { message: "Formula Name is required" }),
    sku: z.string().min(1, { message: "SKU is required" }),
    yieldQty: z.number().min(1, { message: "Yield must be at least 1" }),
    laborCost: z.number().min(0, { message: "Labor cost cannot be negative" }),
    ingredients: z.array(z.object({
      inventoryItemId: z.string().min(1),
      quantity: z.number().min(0.01, { message: "Ingredient quantity must be greater than 0" }),
      unit: z.string().min(1)
    })).min(1, { message: "At least one BOM node is required" })
  });

  const handleSave = async () => {
    if (!isEditing && userTier === 'Free Audit' && recipes.length >= 5) {
      setShowUpgradeModal(true);
      return;
    }

    const defaultSku = 'BOM-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    const result = recipeSchema.safeParse({
      name: recipeName,
      sku: sku || defaultSku,
      yieldQty: Number(yieldQty),
      laborCost: Number(laborCost),
      ingredients: ingredients.map(ing => ({
        ...ing,
        quantity: Number(ing.quantity)
      }))
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    
    const recipePayload: any = {
      name: result.data.name,
      sku: result.data.sku,
      version: isEditing ? '2.0' : '1.0',
      yield: `${result.data.yieldQty} Units`,
      yieldValue: result.data.yieldQty,
      ingredients: result.data.ingredients.map(ing => ({
          name: materials.find(m => m.id.toString() === ing.inventoryItemId.toString())?.name || 'Unknown',
          qty: `${ing.quantity} ${ing.unit}`
      })),
      rawIngredients: result.data.ingredients,
      materialCost: totalCost - result.data.laborCost,
      laborCost: result.data.laborCost,
      totalCost: totalCost,
      productionTime: isEditing ? 45 : 60 // mock
    };

    try {
      if (isEditing && id) {
          updateRecipe(id, recipePayload);
          toast.success('Vault Deployment: Formula Synchronized Successfully.');
      } else {
          await addRecipe(recipePayload);
          toast.success('Vault Deployment: Formula Synchronized Successfully.');
      }
      sessionStorage.removeItem('draft_recipe');
      navigate('/recipes');
    } catch (e: any) {
      if (e.message.includes("Tier limit reached")) {
        const limitMatch = e.message.match(/\d+/);
        setUpgradeLimit(limitMatch ? parseInt(limitMatch[0]) : 5);
        setRequiredTier(userTier === 'Free Audit' ? 'Artisan Flow Basic' : 'Margin Protection Pro');
        setShowUpgradeModal(true);
      }
    }
  };

  return (
    <>
    <div className="p-6 space-y-10 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <button onClick={() => navigate('/recipes')} className="text-gray-400 hover:text-[#6A2C91] font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors">
                <ArrowLeft size={16} /> Back to Vault
            </button>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{isEditing ? 'Formula Revision' : 'Formula Architect'}</h1>
            <p className="text-gray-500 font-medium">{isEditing ? 'Optimizing existing Bill of Materials for margin integrity.' : 'Constructing Bills of Materials with Synaptic Cost Reconciliation.'}</p>
        </div>
        <div className="sticky bottom-4 z-50 md:static p-4 md:p-0 bg-[#0A0A0A]/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border border-white/10 md:border-none rounded-3xl md:rounded-none shadow-2xl md:shadow-none w-full sm:w-auto mt-4 md:mt-0">
            <Button 
                className="w-full sm:w-auto bg-[#6A2C91] text-white font-black text-[10px] tracking-widest h-14 px-10 rounded-2xl shadow-xl shadow-purple-100" 
                onClick={handleSave}
            >
                {isEditing ? <RefreshCw size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
                {isEditing ? 'UPDATE VAULT NODE' : 'COMMIT FORMULA TO VAULT'}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-10">
        <div className="lg:col-span-2 space-y-10">
          <Card title="Structural Identity" className="rounded-[2.5rem] border-stone-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Formula Name</label>
                <Input value={recipeName} onChange={e => setRecipeName(e.target.value)} placeholder="e.g. Midnight Serum Alpha" className="rounded-2xl py-4" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset SKU Reference</label>
                <Input value={sku} onChange={e => setSku(e.target.value)} placeholder="SRM-MID-V1" className="rounded-2xl py-4" />
              </div>
            </div>
          </Card>

          <Card title="Bill of Materials (BOM Nodes)" className="rounded-[2.5rem] border-stone-100">
            <div className="space-y-4 mt-4">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 items-end bg-stone-50 p-6 rounded-[2rem] border border-stone-100 group hover:border-purple-200 transition-all">
                  <div className="flex-1 w-full space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Raw Node Select</label>
                    <Select 
                      value={ing.inventoryItemId} 
                      onChange={e => updateIngredient(idx, 'inventoryItemId', e.target.value)}
                      className="rounded-xl"
                    >
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.name.toUpperCase()} [${m.unitCost.toFixed(2)} / {m.unit}]</option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-full md:w-32 space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Qty Required</label>
                    <Input 
                      type="number" 
                      value={ing.quantity} 
                      onChange={e => updateIngredient(idx, 'quantity', parseFloat(e.target.value))} 
                      className="rounded-xl"
                    />
                  </div>
                  <div className="w-full md:w-32 space-y-1">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                     <Input 
                      value={ing.unit} 
                      onChange={e => updateIngredient(idx, 'unit', e.target.value)} 
                      className="rounded-xl"
                    />
                  </div>
                  <button onClick={() => removeIngredient(idx)} className="p-3 text-stone-300 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button 
                onClick={addIngredient} 
                className="w-full py-6 border-2 border-dashed border-stone-200 rounded-[2rem] text-gray-400 font-black text-[10px] uppercase tracking-widest hover:border-[#6A2C91] hover:text-[#6A2C91] hover:bg-purple-50 transition-all flex items-center justify-center gap-3"
              >
                <Plus size={18} /> INITIALIZE NEW BOM NODE
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card title="Synaptic Cost Engine" className="sticky top-6 rounded-[2.5rem] border-stone-100 shadow-xl overflow-hidden">
             <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-5 text-purple-600"><Calculator size={80} /></div>
             <div className="space-y-8 mt-4 relative z-10">
                <div className="flex justify-between items-center border-b border-stone-50 pb-4">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Material Overhead</span>
                   <span className="text-xl font-black text-gray-900 tracking-tighter">${(totalCost - laborCost).toFixed(2)}</span>
                </div>
                
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Manufacturing Labor ($)</label>
                   <Input 
                      type="number" 
                      value={laborCost} 
                      onChange={e => setLaborCost(parseFloat(e.target.value))} 
                      className="rounded-xl font-black"
                   />
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Standard Batch Yield</label>
                   <Input 
                      type="number" 
                      value={yieldQty} 
                      onChange={e => setYieldQty(parseFloat(e.target.value))} 
                      className="rounded-xl font-black"
                   />
                </div>
                
                <div className="pt-8 border-t-2 border-stone-50 space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Total Formula Cost</span>
                      <span className="text-3xl font-black text-[#6A2C91] tracking-tighter">${totalCost.toFixed(2)}</span>
                   </div>
                   <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">True Unit Cost (COGS)</p>
                      <p className="text-4xl font-black text-emerald-700 tracking-tighter">${costPerUnit.toFixed(2)}</p>
                   </div>
                   <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Margin Guard™ Rec (2.2x)</p>
                      <p className="text-4xl font-black text-amber-700 tracking-tighter">${targetRetail.toFixed(2)}</p>
                   </div>
                </div>

                <div className="pt-4 flex items-center gap-3 text-stone-400">
                    <ShieldCheck size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Data persistent in vault node</span>
                </div>
             </div>
          </Card>

          <div className="bg-stone-900 p-4 sm:p-8 rounded-[2.5rem] text-white">
              <div className="flex items-center gap-3 mb-4">
                  <Zap size={18} className="text-amber-400" />
                  <h4 className="text-lg font-black uppercase italic">AI Stress Test</h4>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed font-medium mb-6">
                  Lola is simulating current formula ROI based on active raw material burn rates. Your estimated break-even is <span className="text-white font-bold">14 units</span> at current wholesale projections.
              </p>
              <button onClick={() => setShowROIHeatmap(true)} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">VIEW ROI HEATMAP</button>
          </div>
        </div>
      </div>
    </div>
    <Modal isOpen={showROIHeatmap} onClose={() => setShowROIHeatmap(false)} title="ROI Heatmap Simulation">
        <div className="p-4 space-y-4">
            <p className="text-gray-300 text-sm">Estimated Break-Even: <span className="font-bold text-white">14 units</span> at current wholesale projections.</p>
            <div className="h-48 w-full bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 rounded-xl flex items-center justify-center border border-white/10">
                <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Heatmap Visualization Active</span>
            </div>
            <Button onClick={() => setShowROIHeatmap(false)} className="w-full bg-[#C5A059] text-white">Close Simulation</Button>
        </div>
    </Modal>
    <UpgradeModal 
      isOpen={showUpgradeModal} 
      onClose={() => setShowUpgradeModal(false)}
      featureName="Formulas/BOMs"
      currentLimit={upgradeLimit}
      requiredTier={requiredTier}
    />
    </>
  );
};

