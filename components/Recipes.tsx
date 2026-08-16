import React, { useState } from 'react';
import { Card, Button, Badge, VaultBanner } from './UI';
import { Plus, Edit2, Trash2, Box, ArrowLeft, Layers, TrendingUp, DollarSign, Clock, ChevronRight, Zap, Target } from 'lucide-react';
import { useArtisanData } from './DataContext';
import { GlassHaloIcon } from './ui/GlassHaloIcon';
import { useNavigate } from 'react-router-dom';
import { SubPageHeader } from './SubPageHeader';
import { toast } from 'sonner';

/**
 * Recipes & Formulas - High-Fidelity Synaptic Hub ✅
 */

export const Recipes = () => {
  const { recipes, inventory, produceBatch } = useArtisanData();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col gap-4 sm:p-8">
        <SubPageHeader 
          title="Golden Ratio Ledger"
          parentTitle="Resource Hub"
          onBack={() => navigate('/inventory')}
          description="BOM Architecture: Bridging Material Costs with Finished Value."
        />
        
        <VaultBanner 
          title="Golden Ratio Ledger"
          subtitle="BOM Architecture: Bridging Material Costs with Finished Value."
          badge="Formula Protocol Active"
        >
          <Button className="bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 rounded-full shadow-2xl shadow-black/10 transition-all uppercase" onClick={() => navigate('/recipes/builder')}>
              <Plus size={16} className="mr-3"/> INITIALIZE FORMULA
          </Button>
        </VaultBanner>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox label="Active Formulas" val={recipes.length} color="text-purple-400" icon={Layers} />
          <StatBox label="Optimal Margins" val="88%" color="text-emerald-400" icon={Target} />
          <StatBox label="Production Ready" val="12 SKU" color="text-amber-400" icon={Zap} />
      </div>

      {recipes.length === 0 ? (
          <div className="luxury-card border-white/10 rounded-[2.5rem] p-24 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl">
              <GlassHaloIcon icon={Box} color="cyan" size="lg" className="mb-6" />
              <h3 className="text-3xl font-serif tracking-tight text-white/50 mb-2">Vault Empty</h3>
              <p className="text-white/30 text-[11px] font-sans font-medium uppercase tracking-[0.2em] mt-1">Initialize your first Bill of Materials to start tracking margins.</p>
              <Button onClick={() => navigate('/recipes/builder')} className="mt-8 bg-white/5 text-[#C5A059] h-12 px-8 rounded-full font-sans text-[10px] tracking-widest uppercase border border-white/10 hover:bg-white/10">LAUNCH BUILDER</Button>
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-8">
              {recipes.map(recipe => (
                  <div key={recipe.id} className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10 hover:shadow-2xl hover:border-[#6A2C91]/50 transition-all group relative overflow-hidden">
                      <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="flex items-center gap-6">
                              <GlassHaloIcon icon={Layers} color="purple" size="md" />
                              <div>
                                  <h3 className="text-3xl font-serif text-white tracking-tight">{recipe.name}</h3>
                                  <Badge color="purple" className="text-[9px] px-3 py-1 font-sans tracking-widest mt-2 uppercase border-white/10">V{recipe.version} SKU: {recipe.sku}</Badge>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <button 
                                onClick={() => {
                                    const result = produceBatch(recipe.id, 1);
                                    if (result.success) {
                                        if (result.warnings.length > 0) {
                                            toast.warning(`Batch Produced with Warnings:\n${result.warnings.join('\n')}`);
                                        } else {
                                            toast.success(`${recipe.name} Batch successfully produced and deducted from raw materials.`);
                                        }
                                    } else {
                                        toast.error(result.warnings[0]);
                                    }
                                }}
                                className="px-6 py-4 bg-[#6A2C91] text-white rounded-2xl hover:bg-[#59227A] transition-all shadow-sm font-sans font-bold text-[10px] uppercase tracking-widest"
                              >
                                Produce Batch
                              </button>
                              <button 
                                onClick={() => navigate(`/recipes/builder/${recipe.id}`)}
                                className="p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl hover:bg-[#6A2C91] hover:text-white transition-all shadow-sm group-hover:border-[#6A2C91]/30"
                              >
                                 <Edit2 size={20} />
                              </button>
                          </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
                          <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/10">
                              <p className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Batch Yield</p>
                              <p className="text-xl font-serif text-white">{recipe.yield}</p>
                          </div>
                          <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/10">
                              <p className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Landed Cost</p>
                              <p className="text-xl font-serif text-emerald-400">${recipe.totalCost.toFixed(2)}</p>
                          </div>
                          <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/10">
                              <p className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Labor</p>
                              <p className="text-xl font-serif text-[#C5A059]">{recipe.productionTime}m</p>
                          </div>
                      </div>

                      <div className="space-y-4 border-t border-white/5 pt-8 relative z-10">
                          <p className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2"><Box size={14} className="text-[#6A2C91]" /> Bill of Materials ({recipe.ingredients.length} Nodes)</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {recipe.ingredients.map((ing, i) => (
                                  <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                      <span className="text-[11px] font-sans font-bold text-white/70 uppercase tracking-tight">{ing.name}</span>
                                      <span className="text-[10px] font-sans font-black text-[#6A2C91] tracking-[0.2em]">{ing.qty}</span>
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
    <div className="luxury-card bg-black/40 backdrop-blur-xl p-4 sm:p-8 rounded-[2rem] border border-white/10 shadow-lg flex flex-col items-start group hover:border-[#6A2C91]/30 transition-all">
        <div className={`p-4 bg-white/5 border border-white/10 rounded-2xl mb-6 text-white/50 group-hover:text-[#6A2C91] group-hover:scale-110 transition-all`}><Icon size={24} /></div>
        <p className="text-[10px] text-white/40 font-sans font-bold uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className={`text-4xl font-serif tracking-tight ${color}`}>{val}</p>
    </div>
);
