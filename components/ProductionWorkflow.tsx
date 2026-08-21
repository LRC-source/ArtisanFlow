import React from 'react';
import { ContextualTutorialModal } from './ContextualTutorialModal';
import { Card, Badge, Button } from './UI';
import { useArtisanData } from './DataContext';
import { GlassHaloIcon } from './ui/GlassHaloIcon';
import { Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const ProductionWorkflow = () => {
  const { productionStats, recipes, produceBatch } = useArtisanData();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-in fade-in pb-8 sm:pb-12 lg:pb-20">
            <ContextualTutorialModal
                hubId="manufacturing"
                title="Manufacturing Hub"
                description="Oversee and optimize your entire production pipeline."
                steps={["View active production batches.","Log QA checks and record defect rates.","Manage capacity and workstation loads."]}
            />
      <div>
          <button onClick={() => navigate('/operations')} className="flex items-center gap-2 text-white sm:text-gray-400 hover:text-[#6A2C91] mb-4 font-black text-xs uppercase tracking-widest transition-colors">
            <ArrowLeft size={18} /> Back to Operations
          </button>
          <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">Precision Manufacturing Hub & Recipe Engine</h1>
              <Badge color="gold">Beta</Badge>
          </div>
          <p className="text-sm sm:text-base text-white sm:text-white/60 font-sans font-light leading-relaxed max-w-xl leading-relaxed mt-2">Manage production stages, assignments, and approvals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6">
              <p className="text-sm sm:text-base text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Active Production Jobs</p>
              <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{productionStats.active}</p>
          </div>
          <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6">
              <p className="text-sm sm:text-base text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-2">Pending Curing Batches</p>
              <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{productionStats.inProgress}</p>
          </div>
          <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6">
              <p className="text-sm sm:text-base text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-2">Recipe BOM Library</p>
              <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{recipes.length}</p>
          </div>
          <div className="luxury-card bg-black/40 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-4 sm:p-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <p className="text-sm sm:text-base text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2">Batch Deductions Ledger</p>
              <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{productionStats.completed}</p>
          </div>
      </div>

      <div className="mt-8 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white mb-4">Active Formulations Ready for Production</h2>
          {recipes.length === 0 ? (
              <div className="bg-black/40 border border-white/10 rounded-3xl p-4 sm:p-12 flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] w-full max-w-full overflow-hidden">
                  <GlassHaloIcon icon={Clock} color="purple" size="lg" className="mb-4" />
                  <p className="text-sm sm:text-base text-white sm:text-white/50 font-sans tracking-widest text-[11px] uppercase">No active production formulas found. Create one in Recipes.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                  {recipes.map(recipe => (
                      <div key={recipe.id} className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 sm:p-8 hover:border-purple-500/50 transition-all shadow-lg group">
                          <div className="bg-[#0A0A0A] backdrop-blur-3xl border-none p-4 sm:p-6 rounded-[1.5rem] flex flex-col justify-between h-full">
                          <div>
                              <div className="flex justify-between items-start mb-4">
                                  <div>
                                      <h3 className="text-lg sm:text-2xl lg:text-3xl text-white sm:text-slate-400 leading-relaxed font-bold text-white">{recipe.name}</h3>
                                      <p className="text-sm sm:text-base text-white sm:text-gray-400 mt-1">SKU: {recipe.sku}</p>
                                  </div>
                                  <Badge color="purple">{recipe.yield} Units</Badge>
                              </div>
                              <div className="space-y-2 mb-6">
                                  <p className="text-sm sm:text-base text-gray-500 font-bold uppercase tracking-widest">Bill of Materials:</p>
                                  <div className="flex flex-wrap gap-2">
                                      {recipe.ingredients.map((ing: any, i: number) => (
                                          <span key={i} className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-md">{ing.name} ({ing.qty})</span>
                                      ))}
                                  </div>
                              </div>
                          </div>
                          <div className="sticky bottom-4 z-50 md:static p-4 md:p-0 bg-[#0A0A0A]/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border border-white/10 md:border-none rounded-3xl md:rounded-none shadow-2xl md:shadow-none w-full mt-4">
                              <Button 
                                  className="w-full bg-[#C5A059] text-white hover:bg-[#b08e4d] rounded-xl font-bold uppercase tracking-widest text-xs h-12"
                                  onClick={async () => {
                                      try {
                                          const result = await produceBatch(recipe.id, 1);
                                          if (result.success) {
                                              if (result.warnings.length > 0) {
                                                  toast.warning(`Batch Produced with Warnings: ${result.warnings.join(', ')}`);
                                              } else {
                                                  toast.success(`${recipe.name} Batch successfully produced and materials deducted.`);
                                              }
                                          } else {
                                              toast.error(result.warnings[0]);
                                          }
                                      } catch (error) {
                                          toast.error("An unexpected error occurred while producing the batch.");
                                          console.error("Batch production error:", error);
                                      }
                                  }}
                              >
                                  Commit Batch to Production
                              </Button>
                          </div>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
};
