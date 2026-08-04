import React from 'react';
import { ContextualTutorialModal } from './ContextualTutorialModal';
import { Card, Badge, Button } from './UI';
import { useArtisanData } from './DataContext';
import { Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductionWorkflow = () => {
  const { productionStats, recipes, produceBatch } = useArtisanData();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 animate-in fade-in pb-20">
            <ContextualTutorialModal
                hubId="manufacturing"
                title="Manufacturing Hub"
                description="Oversee and optimize your entire production pipeline."
                steps={["View active production batches.","Log QA checks and record defect rates.","Manage capacity and workstation loads."]}
            />
      <div>
          <button onClick={() => navigate('/operations')} className="flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] mb-4 font-black text-xs uppercase tracking-widest transition-colors">
            <ArrowLeft size={18} /> Back to Operations
          </button>
          <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">Production Workflow</h1>
              <Badge color="gold">Beta</Badge>
          </div>
          <p className="text-gray-500">Manage production stages, assignments, and approvals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-bold uppercase mb-2">Active Orders</p>
              <p className="text-3xl font-bold text-gray-900">{productionStats.active}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
              <p className="text-xs text-gray-500 font-bold uppercase mb-2">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">{productionStats.inProgress}</p>
          </div>
          <div className="bg-[#FFF9E6] p-4 rounded-xl border border-[#FFE082] shadow-sm">
              <p className="text-xs text-[#B45309] font-bold uppercase mb-2">Awaiting Approval</p>
              <p className="text-3xl font-bold text-[#B45309]">{productionStats.awaiting}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
              <p className="text-xs text-emerald-700 font-bold uppercase mb-2">Completed Today</p>
              <p className="text-3xl font-bold text-emerald-700">{productionStats.completed}</p>
          </div>
      </div>

      <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">Active Formulations Ready for Production</h2>
          {recipes.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Clock size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">No active production formulas found. Create one in Recipes.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recipes.map(recipe => (
                      <div key={recipe.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                          <div>
                              <div className="flex justify-between items-start mb-4">
                                  <div>
                                      <h3 className="text-xl font-bold text-white">{recipe.name}</h3>
                                      <p className="text-gray-400 text-sm mt-1">SKU: {recipe.sku}</p>
                                  </div>
                                  <Badge color="purple">{recipe.yield} Units</Badge>
                              </div>
                              <div className="space-y-2 mb-6">
                                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Bill of Materials:</p>
                                  <div className="flex flex-wrap gap-2">
                                      {recipe.ingredients.map((ing: any, i: number) => (
                                          <span key={i} className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-md">{ing.name} ({ing.qty})</span>
                                      ))}
                                  </div>
                              </div>
                          </div>
                          <Button 
                              className="w-full bg-[#C5A059] text-white hover:bg-[#b08e4d] rounded-xl font-bold uppercase tracking-widest text-xs h-12"
                              onClick={() => {
                                  const result = produceBatch(recipe.id, 1);
                                  if (result.success) {
                                      if (result.warnings.length > 0) {
                                          alert(`Batch Produced with Warnings:\n${result.warnings.join('\n')}`);
                                      } else {
                                          alert(`${recipe.name} Batch successfully produced and materials deducted.`);
                                      }
                                  } else {
                                      alert(result.warnings[0]);
                                  }
                              }}
                          >
                              Commit Batch to Production
                          </Button>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
};