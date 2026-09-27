import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Input, Select, Modal, DashboardBanner } from './UI';
import { toast } from 'sonner';
import { 
  TrendingUp, DollarSign, Calendar, Sliders, AlertTriangle, 
  ArrowUpRight, Package, ArrowLeft, RefreshCw, ShoppingCart, 
  Layers, Factory, Sparkles, Filter, Search, CheckCircle2, 
  Clock, ShieldAlert, ChevronRight, BarChart3, RotateCcw
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, Area, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { motion } from 'framer-motion';
import { useArtisanData } from './DataContext';
import { SubPageHeader } from './SubPageHeader';
import { GlassHaloIcon } from './ui/GlassHaloIcon';
import { ForecastItem, INITIAL_FORECAST_DATA } from '../src/data/mockArtisanFlowData';

export type TimeHorizon = '30' | '90' | '180' | '365';
export type ForecastModel = 'linear' | 'seasonal' | 'growth';

export const Forecasting: React.FC = () => {
  const navigate = useNavigate();
  const { inventory } = useArtisanData();

  // Decoupled Local State Initialized with Centralized Mock Data
  const [forecastData, setForecastData] = useState<ForecastItem[]>(INITIAL_FORECAST_DATA);

  // Parameter Control States
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('90');
  const [forecastModel, setForecastModel] = useState<ForecastModel>('linear');
  const [growthRate, setGrowthRate] = useState<number>(15); // +15% MoM slider
  const [leadTimeBuffer, setLeadTimeBuffer] = useState<number>(14); // 14 days safety stock buffer
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // PO Generation Modal State
  const [selectedPOItem, setSelectedPOItem] = useState<ForecastItem | null>(null);
  const [poQuantity, setPoQuantity] = useState<number>(100);
  const [isSubmittingPO, setIsSubmittingPO] = useState(false);

  // Reset Mock Data Helper
  const handleResetMockData = () => {
    setForecastData(INITIAL_FORECAST_DATA);
    setTimeHorizon('90');
    setForecastModel('linear');
    setGrowthRate(15);
    setLeadTimeBuffer(14);
    toast.info('Forecasting mock data reset to initial constants.');
  };

  // Sync real-time inventory from context into state if available
  const activeSkuList = useMemo(() => {
    if (inventory && inventory.length > 0) {
      const liveItems: ForecastItem[] = inventory.map(item => {
        const burnRate = Math.max(0.5, Math.round(((item.stock || 20) / 30) * 10) / 10);
        const days = parseInt(timeHorizon, 10);
        const demand = Math.round(burnRate * days);
        const dirDays = Math.round((item.stock || 0) / burnRate);
        return {
          id: `LIVE-${item.id}`,
          name: item.name,
          sku: item.sku || `SKU-${item.id}`,
          category: item.type === 'raw' ? 'Raw Materials' : 'Finished Goods',
          currentStock: item.stock || 0,
          unit: item.unit || 'units',
          unitCost: item.unitCost || 5.00,
          dailyBurnRate: burnRate,
          leadTimeDays: item.reorderPoint || 14,
          supplier: item.supplier || 'Primary Artisan Vendor',
          forecastedDemand: demand,
          dir: dirDays,
          reorderDate: dirDays <= 14 ? 'Immediate' : 'In 18 Days',
          reorderCost: Math.round(demand * (item.unitCost || 5.00)),
          status: dirDays <= 14 ? 'Critical Stockout Risk' : dirDays <= 28 ? 'Reorder Soon' : 'Stocked'
        };
      });
      return [...liveItems, ...forecastData];
    }
    return forecastData;
  }, [inventory, forecastData, timeHorizon]);

  const daysNum = parseInt(timeHorizon, 10);

  // Dynamic Multiplier based on selected parameters
  const modelMultiplier = useMemo(() => {
    if (forecastModel === 'linear') return 1.0;
    if (forecastModel === 'seasonal') return 1.35; // Q4/Holiday spike
    return 1.0 + (growthRate / 100); // Custom growth projection
  }, [forecastModel, growthRate]);

  // Dynamic Calculations for Top KPIs
  const totalForecastedUnits = useMemo(() => {
    return Math.round(activeSkuList.reduce((sum, item) => sum + (item.dailyBurnRate * daysNum * modelMultiplier), 0));
  }, [activeSkuList, daysNum, modelMultiplier]);

  const projectedGrossRevenue = useMemo(() => {
    return activeSkuList.reduce((sum, item) => {
      const units = item.dailyBurnRate * daysNum * modelMultiplier;
      const estimatedPrice = item.unitCost * 3.2; // 3.2x markup average
      return sum + (units * estimatedPrice);
    }, 0);
  }, [activeSkuList, daysNum, modelMultiplier]);

  const estimatedCOGS = useMemo(() => {
    return activeSkuList.reduce((sum, item) => {
      const units = item.dailyBurnRate * daysNum * modelMultiplier;
      return sum + (units * item.unitCost);
    }, 0);
  }, [activeSkuList, daysNum, modelMultiplier]);

  const workingCapitalTrough = useMemo(() => {
    const peakProductionOutlay = estimatedCOGS * 0.42;
    const lowestCashPoint = Math.max(5000, projectedGrossRevenue * 0.25 - peakProductionOutlay);
    const troughDay = Math.round(daysNum * 0.45);
    return { amount: lowestCashPoint, day: troughDay };
  }, [estimatedCOGS, projectedGrossRevenue, daysNum]);

  const requiredProductionBatches = useMemo(() => {
    return Math.ceil(totalForecastedUnits / 120); // Average batch yield ~ 120 units
  }, [totalForecastedUnits]);

  // Dynamic Main Canvas Chart 1 Data
  const chartForecastData = useMemo(() => {
    const pointsCount = 8;
    const step = Math.round(daysNum / pointsCount);
    
    return Array.from({ length: pointsCount + 1 }).map((_, idx) => {
      const dayOffset = idx * step;
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const progress = idx / pointsCount;
      const historicalBase = 450 + idx * 80;
      const projectedUnits = Math.round((historicalBase * (1 + progress * 0.5)) * modelMultiplier);
      const projectedRev = Math.round(projectedUnits * 24.50);
      const rawIngredientCost = Math.round(projectedUnits * 7.80);

      const upperCI = Math.round(projectedRev * 1.15);
      const lowerCI = Math.round(projectedRev * 0.88);

      return {
        date: dateStr,
        day: `Day ${dayOffset}`,
        historicalSales: Math.round(historicalBase * 22.00),
        projectedRevenue: projectedRev,
        forecastedUnits: projectedUnits,
        rawIngredientCost: rawIngredientCost,
        confidenceUpper: upperCI,
        confidenceLower: lowerCI
      };
    });
  }, [daysNum, modelMultiplier]);

  // Dynamic Main Canvas Chart 2 Data
  const burnDownChartData = useMemo(() => {
    return activeSkuList.slice(0, 6).map(item => {
      const daysOfStock = Math.round(item.currentStock / (item.dailyBurnRate * modelMultiplier));
      
      return {
        skuName: item.sku,
        name: item.name.length > 20 ? item.name.substring(0, 18) + '...' : item.name,
        currentStock: item.currentStock,
        forecastedDemand: Math.round(item.dailyBurnRate * daysNum * modelMultiplier),
        reorderThreshold: Math.round(item.dailyBurnRate * (item.leadTimeDays + leadTimeBuffer)),
        daysRemaining: daysOfStock
      };
    });
  }, [activeSkuList, modelMultiplier, daysNum, leadTimeBuffer]);

  // Dynamic Filtered Table Items
  const filteredTableItems = useMemo(() => {
    return activeSkuList.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [activeSkuList, searchTerm, categoryFilter]);

  // Auto-Generate PO Trigger
  const handleOpenPOModal = (item: ForecastItem) => {
    const forecastedDemand = Math.round(item.dailyBurnRate * daysNum * modelMultiplier);
    const recommendedQty = Math.max(50, forecastedDemand - item.currentStock + (item.dailyBurnRate * leadTimeBuffer));
    setSelectedPOItem(item);
    setPoQuantity(recommendedQty);
  };

  const handleConfirmPO = () => {
    if (!selectedPOItem) return;
    setIsSubmittingPO(true);
    setTimeout(() => {
      setIsSubmittingPO(false);
      // Update local state dynamically
      setForecastData(prev => prev.map(f => {
        if (f.id === selectedPOItem.id) {
          const newStock = f.currentStock + poQuantity;
          const newDir = Math.round(newStock / f.dailyBurnRate);
          return {
            ...f,
            currentStock: newStock,
            dir: newDir,
            status: newDir <= f.leadTimeDays ? 'Critical Stockout Risk' : newDir <= (f.leadTimeDays + leadTimeBuffer) ? 'Reorder Soon' : 'Stocked'
          };
        }
        return f;
      }));

      toast.success(`Purchase Order generated for ${selectedPOItem.name} (${poQuantity} ${selectedPOItem.unit})!`, {
        description: `PO dispatched to ${selectedPOItem.supplier}. Total Cost: $${(poQuantity * selectedPOItem.unitCost).toFixed(2)}`
      });
      setSelectedPOItem(null);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto pb-24"
    >
      <SubPageHeader 
        title="Artisan Demand Forecasting Hub"
        parentTitle="Supply Logistics"
        onBack={() => navigate('/')}
        description="Predictive inventory burn rates, BOM ingredient requirements, and working capital optimization."
      />

      <DashboardBanner 
        title="Predictive Demand & Material Planning"
        subtitle="Simulate real-time sales velocity, lead time buffers, and stockout danger zones for your formulations."
        badge="AI Forecasting Engine 2.0"
      />

      {/* GLOBAL FILTER & PARAMETER CONTROL BAR */}
      <Card className="p-6 bg-black/50 backdrop-blur-xl border-white/10 rounded-[2.5rem] shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <GlassHaloIcon icon={Sliders} color="cyan" size="sm" />
            <div>
              <h3 className="text-white font-display font-bold uppercase tracking-widest text-sm">Forecast Model Parameters</h3>
              <p className="text-xs text-white/40">Adjust horizon, growth rate, and lead time buffers to recalibrate dynamic demand.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleResetMockData}
              variant="secondary"
              className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 flex items-center gap-1.5 rounded-full"
            >
              <RotateCcw size={12} /> Reset Mock Data
            </Button>
            <Badge color="purple" className="text-[10px] uppercase font-bold tracking-wider px-3 py-1">
              Active Horizon: {timeHorizon} Days ({forecastModel.toUpperCase()})
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Time Horizon Selector */}
          <div>
            <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calendar size={14} className="text-[#06B6D4]" /> Time Horizon
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
              {(['30', '90', '180', '365'] as TimeHorizon[]).map(horizon => (
                <button
                  key={horizon}
                  onClick={() => setTimeHorizon(horizon)}
                  className={`py-2 text-[10px] font-bold rounded-xl uppercase tracking-wider transition-all ${
                    timeHorizon === horizon 
                      ? 'bg-[#6A2C91] text-white shadow-md shadow-[#6A2C91]/30' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {horizon === '365' ? '1 yr' : horizon === '180' ? '6 mo' : `${horizon}d`}
                </button>
              ))}
            </div>
          </div>

          {/* Forecast Model Toggle */}
          <div>
            <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingUp size={14} className="text-[#A855F7]" /> Forecast Model
            </label>
            <Select 
              value={forecastModel} 
              onChange={e => setForecastModel(e.target.value as ForecastModel)}
              className="bg-black/60 border-white/10 text-white rounded-2xl text-xs py-2 px-3 w-full"
            >
              <option value="linear" className="bg-black text-white">Historical Trend (Linear)</option>
              <option value="seasonal" className="bg-black text-white">Seasonal Surge (Holiday / Q4)</option>
              <option value="growth" className="bg-black text-white">Growth Projection (Custom % MoM)</option>
            </Select>
          </div>

          {/* Custom Growth % Slider */}
          {forecastModel === 'growth' ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} className="text-[#C5A059]" /> MoM Growth Rate
                </label>
                <span className="text-xs font-bold text-[#C5A059]">+{growthRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={growthRate}
                onChange={e => setGrowthRate(parseInt(e.target.value, 10))}
                className="w-full accent-[#C5A059] bg-white/10 rounded-lg cursor-pointer h-2 mt-2"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BarChart3 size={14} className="text-[#C5A059]" /> Forecasted Growth Curve
              </label>
              <div className="text-xs text-white/70 bg-white/5 border border-white/10 rounded-2xl py-2 px-3 font-mono">
                {forecastModel === 'linear' ? 'Baseline (Linear +5% MoM)' : 'Q4 Surge (+35% Seasonal Spike)'}
              </div>
            </div>
          )}

          {/* Supplier Lead Time Buffer Input */}
          <div>
            <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Clock size={14} className="text-amber-400" /> Lead Time Buffer (Days)
            </label>
            <div className="relative">
              <Input
                type="number"
                min="1"
                max="60"
                value={leadTimeBuffer}
                onChange={e => setLeadTimeBuffer(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="bg-black/60 border-white/10 text-white rounded-2xl text-xs py-2 px-3 pr-12 w-full"
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-white/40 font-bold uppercase">Days</span>
            </div>
          </div>
        </div>
      </Card>

      {/* DYNAMIC CORE KPI METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2rem] hover:border-[#06B6D4]/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Projected Gross Revenue</span>
            <GlassHaloIcon icon={DollarSign} color="cyan" size="sm" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mb-2 font-sans tracking-tight">
            ${projectedGrossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
            <ArrowUpRight size={16} />
            <span>+{forecastModel === 'seasonal' ? '35.2%' : `${(12.4 * modelMultiplier).toFixed(1)}%`} vs. Last Cycle</span>
          </div>
          <div className="text-[10px] text-white/30 mt-2 font-mono">{timeHorizon}-day window projection</div>
        </Card>

        <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2rem] hover:border-[#C5A059]/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Est. Material Costs (COGS)</span>
            <GlassHaloIcon icon={Package} color="gold" size="sm" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#C5A059] mb-2 font-sans tracking-tight">
            ${estimatedCOGS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-white/70 flex items-center justify-between">
            <span>BOM Ingredients & Packaging</span>
            <span className="text-amber-400 font-bold">{totalForecastedUnits.toLocaleString()} units</span>
          </div>
          <div className="text-[10px] text-white/30 mt-2 font-mono">Raw ingredients & bottles needed</div>
        </Card>

        <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2rem] hover:border-[#A855F7]/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Working Capital Trough</span>
            <GlassHaloIcon icon={TrendingUp} color="purple" size="sm" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 mb-2 font-sans tracking-tight">
            ${workingCapitalTrough.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-purple-400 font-bold flex items-center gap-1">
            <AlertTriangle size={14} className="text-amber-400" />
            <span>Lowest Cash Point: Day {workingCapitalTrough.day}</span>
          </div>
          <div className="text-[10px] text-white/30 mt-2 font-mono">Peak raw procurement phase</div>
        </Card>

        <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2rem] hover:border-emerald-500/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Production Run Batches</span>
            <GlassHaloIcon icon={Factory} color="emerald" size="sm" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-2 font-sans tracking-tight">
            {requiredProductionBatches} Batches
          </div>
          <div className="text-xs text-emerald-300 font-medium">
            Est. ~{Math.round(totalForecastedUnits / requiredProductionBatches)} units per formulation batch
          </div>
          <div className="text-[10px] text-white/30 mt-2 font-mono">Batch capacity allocated</div>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2.5rem]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <div>
              <h3 className="text-lg font-display font-medium text-white uppercase tracking-widest">Demand & Revenue Forecast</h3>
              <p className="text-xs text-white/40">Historical trend vs. projected demand with confidence interval bands.</p>
            </div>
            <Badge color="cyan" className="text-[9px] uppercase font-bold tracking-widest px-3 py-1">
              Confidence Range: ±15%
            </Badge>
          </div>

          <div className="h-[320px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartForecastData}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 10, fill: 'rgba(255,255,255,0.4)'}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 10, fill: 'rgba(255,255,255,0.4)'}} tickFormatter={val => `$${(val / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 10, fill: 'rgba(255,255,255,0.4)'}} tickFormatter={val => `${val}u`} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0A0A0A]/95 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl text-xs space-y-2">
                          <div className="font-bold text-white border-b border-white/10 pb-1">{label} ({data.day})</div>
                          <div className="text-[#06B6D4]">Historical Sales: <span className="font-bold">${data.historicalSales.toLocaleString()}</span></div>
                          <div className="text-[#C5A059]">Projected Revenue: <span className="font-bold">${data.projectedRevenue.toLocaleString()}</span></div>
                          <div className="text-[#A855F7]">Forecasted Units: <span className="font-bold">{data.forecastedUnits} units</span></div>
                          <div className="text-emerald-400">Required Ingredient Cost: <span className="font-bold">${data.rawIngredientCost.toLocaleString()}</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '10px' }} />
                <Area yAxisId="left" type="monotone" dataKey="confidenceUpper" name="Upper Confidence Limit" stroke="none" fill="#A855F7" fillOpacity={0.1} />
                <Line yAxisId="left" type="monotone" dataKey="historicalSales" name="Historical Sales ($)" stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="left" type="monotone" dataKey="projectedRevenue" name="Projected Revenue ($)" stroke="#C5A059" strokeWidth={3} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="forecastedUnits" name="Forecast Demand (Units)" stroke="#A855F7" strokeWidth={2} strokeDasharray="5 5" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2.5rem]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <div>
              <h3 className="text-lg font-display font-medium text-white uppercase tracking-widest">Inventory Burn-Down vs. Reorder Point</h3>
              <p className="text-xs text-white/40">Current stock vs. predicted stockout thresholds per top SKU.</p>
            </div>
            <Badge color="gold" className="text-[9px] uppercase font-bold tracking-widest px-3 py-1">
              Safety Buffer: {leadTimeBuffer} Days
            </Badge>
          </div>

          <div className="h-[320px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={burnDownChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="skuName" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 10, fill: 'rgba(255,255,255,0.4)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 10, fill: 'rgba(255,255,255,0.4)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '10px' }} />
                <Bar dataKey="currentStock" name="On-Hand Stock" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="reorderThreshold" name="Reorder Point Threshold" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="forecastedDemand" name="Forecast Demand" fill="#6A2C91" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* DYNAMIC ACTIONABLE SKU & MATERIAL DEMAND TABLE */}
      <Card className="luxury-card p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-[2.5rem] space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl text-white font-display font-medium uppercase tracking-widest">Material & SKU Demand Matrix</h3>
            <p className="text-xs text-white/40">Real-time days of inventory remaining (DIR), reorder dates, and purchase order triggers.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-3 text-white/40" />
              <Input 
                placeholder="Search SKU or component..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-black/60 border-white/10 text-white rounded-full text-xs py-2"
              />
            </div>

            <Select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-black/60 border-white/10 text-white rounded-full text-xs py-2 px-4 w-auto"
            >
              <option value="All" className="bg-black text-white">All Categories</option>
              <option value="Raw Materials" className="bg-black text-white">Raw Materials</option>
              <option value="Finished Goods" className="bg-black text-white">Finished Goods</option>
              <option value="Botanicals" className="bg-black text-white">Botanicals</option>
              <option value="Packaging" className="bg-black text-white">Packaging</option>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em]">
                <th className="py-4 pl-4">SKU / Component Name</th>
                <th className="py-4">On-Hand Stock</th>
                <th className="py-4">Forecast Demand ({timeHorizon}d)</th>
                <th className="py-4">DIR (Days)</th>
                <th className="py-4">Rec. Reorder Date</th>
                <th className="py-4">Est. Reorder Cost</th>
                <th className="py-4">Status</th>
                <th className="py-4 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTableItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-white/40 text-sm italic">
                    No components found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredTableItems.map(item => {
                  const forecastedDemand = Math.round(item.dailyBurnRate * daysNum * modelMultiplier);
                  const dir = Math.max(0, Math.round(item.currentStock / (item.dailyBurnRate * modelMultiplier)));
                  
                  const reorderDaysFromNow = Math.max(0, dir - item.leadTimeDays);
                  const reorderDate = new Date();
                  reorderDate.setDate(reorderDate.getDate() + reorderDaysFromNow);
                  const reorderDateStr = reorderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  const estimatedCost = Math.round(Math.max(50, forecastedDemand - item.currentStock) * item.unitCost);

                  let statusLabel = item.status;
                  let statusColor: 'emerald' | 'gold' | 'red' = 'emerald';
                  if (dir <= item.leadTimeDays) {
                    statusLabel = 'Critical Stockout Risk';
                    statusColor = 'red';
                  } else if (dir <= (item.leadTimeDays + leadTimeBuffer)) {
                    statusLabel = 'Reorder Soon';
                    statusColor = 'gold';
                  }

                  return (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <Package size={16} className="text-[#C5A059]" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-bold group-hover:text-[#C5A059] transition-colors">{item.name}</div>
                            <div className="text-[10px] text-white/40 font-mono">{item.sku} &bull; {item.category}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 font-mono text-sm text-white font-bold">
                        {item.currentStock} <span className="text-xs text-white/40 font-sans">{item.unit}</span>
                      </td>

                      <td className="py-4 font-mono text-sm text-purple-300 font-bold">
                        {forecastedDemand} <span className="text-xs text-white/40 font-sans">{item.unit}</span>
                      </td>

                      <td className="py-4">
                        <span className={`font-mono text-sm font-bold ${dir <= item.leadTimeDays ? 'text-red-400' : dir <= (item.leadTimeDays + leadTimeBuffer) ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {dir} Days
                        </span>
                      </td>

                      <td className="py-4 text-xs text-white/70 font-mono">
                        {reorderDaysFromNow === 0 ? <span className="text-red-400 font-bold uppercase">Immediate</span> : reorderDateStr}
                      </td>

                      <td className="py-4 font-mono text-sm text-[#C5A059] font-bold">
                        ${estimatedCost.toLocaleString()}
                      </td>

                      <td className="py-4">
                        <Badge 
                          color={statusColor} 
                          className="text-[9px] px-2.5 py-1 uppercase font-bold tracking-wider"
                        >
                          {statusLabel}
                        </Badge>
                      </td>

                      <td className="py-4 text-right pr-4">
                        <Button 
                          onClick={() => handleOpenPOModal(item)}
                          className="h-8 bg-white/10 hover:bg-[#6A2C91] text-white border-none rounded-xl text-[9px] font-bold uppercase tracking-widest px-3 transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <ShoppingCart size={12} /> Auto-PO
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PO Generation Modal */}
      <Modal
        isOpen={!!selectedPOItem}
        onClose={() => setSelectedPOItem(null)}
        title="Auto-Generate Purchase Order"
      >
        {selectedPOItem && (
          <div className="space-y-6 p-2">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#6A2C91]/20 border border-[#6A2C91]/40 flex items-center justify-center shrink-0">
                <Package size={24} className="text-[#C5A059]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">{selectedPOItem.name}</h4>
                <p className="text-xs text-white/50 font-mono">{selectedPOItem.sku} &bull; Supplier: {selectedPOItem.supplier}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl">
                <span className="text-white/40 block mb-1">Current Stock</span>
                <span className="text-white font-bold font-mono text-sm">{selectedPOItem.currentStock} {selectedPOItem.unit}</span>
              </div>
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl">
                <span className="text-white/40 block mb-1">Unit Cost</span>
                <span className="text-[#C5A059] font-bold font-mono text-sm">${selectedPOItem.unitCost.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Order Quantity ({selectedPOItem.unit})</label>
              <Input
                type="number"
                min="10"
                value={poQuantity}
                onChange={e => setPoQuantity(Math.max(1, parseInt(e.target.value, 10) || 10))}
                className="bg-black/60 border-white/10 text-white rounded-xl text-sm py-2.5 px-4 w-full"
              />
            </div>

            <div className="p-4 bg-[#6A2C91]/10 border border-[#6A2C91]/30 rounded-2xl flex justify-between items-center">
              <span className="text-xs text-white/70">Estimated Total Order Value:</span>
              <span className="text-lg font-black text-emerald-400 font-mono">${(poQuantity * selectedPOItem.unitCost).toFixed(2)}</span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button onClick={() => setSelectedPOItem(null)} variant="secondary" className="rounded-xl px-5 py-2 text-xs">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmPO}
                disabled={isSubmittingPO}
                className="bg-[#6A2C91] hover:bg-[#5a257a] text-white rounded-xl px-6 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                {isSubmittingPO ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Confirm & Dispatch PO
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};
