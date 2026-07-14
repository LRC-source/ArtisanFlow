import React from 'react';
import { Card, Badge, Button } from './UI';
import { useArtisanData } from './DataContext';
import { Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductionWorkflow = () => {
  const { productionStats } = useArtisanData();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 animate-in fade-in pb-20">
      <div>
          <button onClick={() => navigate('/operations')} className="flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] mb-4 font-black text-xs uppercase tracking-widest transition-colors">
            <ArrowLeft size={18} /> Back to Operations
          </button>
          <h1 className="text-3xl font-bold text-white">Production Workflow</h1>
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

      <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Clock size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500">No active production orders</p>
      </div>
    </div>
  );
};