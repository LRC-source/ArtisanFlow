import React, { useState } from 'react';
import { Card, Button, Badge, VaultBanner } from './UI';
import { Plus, Edit2, Trash2, Box, ArrowLeft, Layers, TrendingUp, DollarSign, Clock, ChevronRight, Zap, Target } from 'lucide-react';
import { useArtisanData } from './DataContext';
import { useNavigate } from 'react-router-dom';
import { SubPageHeader } from './SubPageHeader';
import { toast } from 'sonner';

/**
 * Recipes & Formulas - High-Fidelity Synaptic Hub ✅
 */

export const Recipes = () => {
  const { recipes, inventory } = useArtisanData();
  const navigate = useNavigate();

  return (
    <div className="p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col gap-8">
        <SubPageHeader 
          title="Recipe Vault"
          parentTitle="Resource Hub"
          onBack={() => navigate('/inventory')}
          description="BOM Architecture: Bridging Material Costs with Finished Value."
        />
        
        <VaultBanner 
          title="Recipe Vault"
          subtitle="BOM Architecture: Bridging Material Costs with Finished Value."
          badge="Formula Protocol Active"
        >
          <Button className="bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 rounded-full shadow-2xl shadow-black/10 transition-all" onClick={() => navigate('/recipes/builder')}>
              <Plus size={16} className="mr-3"/> INITIALIZE FORMULA
          </Button>
        </VaultBanner>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox label="Active Formulas" val={recipes.length} color="text-purple-600" icon={Layers} />
          <StatBox label="Optimal Margins" val="88%" color="text-emerald-600" icon={Target} />
          <StatBox label="Production Ready" val="12 SKU" color="text-amber-600" icon={Zap} />
      </div>

      {recipes.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[2.5rem] p-24 flex flex-col items-center justify-center shadow-sm">
              <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center text-stone-200 mb-6 shadow-inner">
                  <Box size={40} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic">Vault Empty</h3>
              <p className="text-gray-400 text-sm font-medium mt-1">Initialize your first Bill of Materials to start tracking margins.</p>
              <Button onClick={() => navigate('/recipes/builder')} className="mt-8 bg-purple-50 text-[#6A2C91] h-12 px-8 rounded-2xl font-black text-[10px] tracking-widest border border-purple-100">LAUNCH BUILDER</Button>
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {recipes.map(recipe => (
                  <div key={recipe.id} className="bg-white border border-stone-200 rounded-[2.5rem] p-10 hover:shadow-2xl hover:border-[#6A2C91] transition-all group relative overflow-hidden">
                      <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner group-hover:bg-white transition-colors">
                                  <Layers size={24} />
                              </div>
                              <div>
                                  <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">{recipe.name}</h3>
                                  <Badge color="purple" className="text-[8px] px-2 py-0.5 font-black tracking-widest mt-1 uppercase">V{recipe.version} SKU: {recipe.sku}</Badge>
                              </div>
                          </div>
                          <button 
                            onClick={() => navigate(`/recipes/builder/${recipe.id}`)}
                            className="p-3 bg-stone-50 text-gray-400 rounded-xl hover:bg-[#6A2C91] hover:text-white transition-all shadow-sm"
                          >
                             <Edit2 size={18} />
                          </button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
                          <div className="bg-stone-50 p-5 rounded-[1.5rem] border border-stone-100">
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Batch Yield</p>
                              <p className="text-lg font-black text-gray-900">{recipe.yield}</p>
                          </div>
                          <div className="bg-stone-50 p-5 rounded-[1.5rem] border border-stone-100">
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Landed Cost</p>
                              <p className="text-lg font-black text-emerald-600">${recipe.totalCost.toFixed(2)}</p>
                          </div>
                          <div className="bg-stone-50 p-5 rounded-[1.5rem] border border-stone-100">
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Labor</p>
                              <p className="text-lg font-black text-[#C5A059]">{recipe.productionTime}m</p>
                          </div>
                      </div>

                      <div className="space-y-4 border-t border-stone-50 pt-8 relative z-10">
                          <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2"><Box size={14} className="text-[#6A2C91]" /> Bill of Materials ({recipe.ingredients.length} Nodes)</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {recipe.ingredients.map((ing, i) => (
                                  <div key={i} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-stone-100">
                                      <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">{ing.name}</span>
                                      <span className="text-[10px] font-black text-purple-600">{ing.qty}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

const StatBox = ({ label, val, color, icon: Icon }: any) => (
    <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col items-start group hover:border-[#6A2C91] transition-all">
        <div className={`p-3 bg-stone-50 rounded-2xl mb-4 text-[#6A2C91] group-hover:scale-110 transition-transform`}><Icon size={20} /></div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className={`text-3xl font-black tracking-tighter ${color}`}>{val}</p>
    </div>
);