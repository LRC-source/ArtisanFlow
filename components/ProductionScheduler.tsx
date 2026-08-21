import React from 'react';
import { Calendar as CalendarIcon, Sparkles, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { Card, Badge, Button } from './UI';
import { toast } from 'sonner';
import { useArtisanData } from './DataContext';
import { useNavigate } from 'react-router-dom';

export const ProductionScheduler: React.FC = () => {
  const { productionStats, generateSchedule, recipes } = useArtisanData();
  const navigate = useNavigate();

  // If there are active items, we assume a schedule exists
  const hasSchedule = productionStats.active > 0 || productionStats.inProgress > 0 || productionStats.awaiting > 0;

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-in fade-in pb-8 sm:pb-12 lg:pb-20">
        <div className="flex flex-col gap-1">
            <button onClick={() => navigate('/operations')} className="flex items-center gap-2 text-white sm:text-gray-400 hover:text-[#6A2C91] mb-4 font-black text-xs uppercase tracking-widest transition-colors">
              <ArrowLeft size={18} /> Back to Operations
            </button>
            <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-bold text-white">Production Scheduler</h1>
                        <Badge color="gold">Beta</Badge>
                    </div>
                    <p className="text-sm sm:text-base text-gray-500">AI-powered production scheduling and optimization</p>
                </div>
                <Button className="bg-[#A78BFA] hover:bg-[#8B5CF6] text-white border-0" onClick={generateSchedule}>
                    <Sparkles size={16} className="mr-2" /> {hasSchedule ? 'Update Schedule' : 'Generate Schedule'}
                </Button>
            </div>
        </div>

        <div className="w-full md:w-1/4">
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm sm:text-base text-gray-500 mb-2">Pending Orders</p>
                <p className="text-sm sm:text-base font-black font-bold text-gray-900">{productionStats.pending}</p>
            </div>
        </div>

        {!hasSchedule ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-12 flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] w-full max-w-full overflow-hidden">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <CalendarIcon size={32} className="text-white sm:text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-2xl lg:text-3xl text-white font-bold font-medium mb-1">No pending production orders</h3>
                <p className="text-sm sm:text-base text-white sm:text-gray-400">Create production orders to generate a schedule</p>
            </div>
        ) : (
            <div className="space-y-4">
                <h3 className="text-lg sm:text-2xl lg:text-3xl leading-relaxed font-bold text-white">Today's Schedule</h3>
                <div className="space-y-3">
                    {/* Dummy Schedule Data reflecting the state change */}
                    <div className="bg-white p-4 rounded-xl border border-l-4 border-purple-500 shadow-sm flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge color="purple">In Progress</Badge>
                                <span className="text-xs text-gray-500">09:00 AM - 12:00 PM</span>
                            </div>
                            <h4 className="font-bold text-white">Batch #1024: Midnight Serum</h4>
                            <p className="text-sm sm:text-base text-gray-500">Recipe: Midnight Serum v2 • 100 Units</p>
                        </div>
                        <Button onClick={() => toast.info('Opening production schedule details...')} variant="outline" className="text-xs">View Details</Button>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-l-4 border-blue-500 shadow-sm flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge color="blue">Scheduled</Badge>
                                <span className="text-xs text-gray-500">01:00 PM - 03:00 PM</span>
                            </div>
                            <h4 className="font-bold text-white">Batch #1025: Lavender Soap</h4>
                             <p className="text-sm sm:text-base text-gray-500">Recipe: Lavender Rose • 50 Units</p>
                        </div>
                         <Button onClick={() => toast.info('Opening production schedule details...')} variant="outline" className="text-xs">View Details</Button>
                    </div>

                     <div className="bg-white p-4 rounded-xl border border-l-4 border-green-500 shadow-sm flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between opacity-75">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge color="green">Completed</Badge>
                                <span className="text-xs text-gray-500">07:00 AM - 08:30 AM</span>
                            </div>
                            <h4 className="font-bold text-white">Batch #1023: QA Check</h4>
                             <p className="text-sm sm:text-base text-gray-500">Routine equipment maintenance</p>
                        </div>
                        <CheckCircle className="text-green-500" />
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
