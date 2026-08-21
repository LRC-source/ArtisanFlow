import React, { useState } from 'react';
import { Card, Button, Select, Badge, VaultBanner } from './UI';
import { Sparkles, Download, FileText, Filter, Save, Trash2, ArrowLeft, Clock, History, Loader2, Target } from 'lucide-react';
import { useArtisanData, Report } from './DataContext';
import { useNavigate } from 'react-router-dom';
import { SubPageHeader } from './SubPageHeader';
import { motion } from 'framer-motion';
import { GlassHaloIcon } from './ui/GlassHaloIcon';

export const Reports = () => {
  const { inventory, orders, productionStats, getInventoryValue, getTotalRevenue, reports, saveReport, deleteReport } = useArtisanData();
  const navigate = useNavigate();
  
  const [view, setView] = useState<'generator' | 'saved'>('generator');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  
  // Form State
  const [category, setCategory] = useState('Inventory & Materials');
  const [reportType, setReportType] = useState('Summary');
  const [timeRange, setTimeRange] = useState('Last 30 days');

  const handleGenerate = () => {
      setIsGenerating(true);
      
      setTimeout(() => {
          let newReport: Omit<Report, 'id'> = {
              title: `${category} - ${reportType}`,
              category,
              type: reportType,
              generatedDate: new Date().toLocaleString(),
              data: [],
              headers: [],
              summaryStats: []
          };

          if (category === 'Inventory & Materials') {
              newReport.headers = ['SKU', 'Name', 'Type', 'Stock', 'Unit Cost', 'Total Value', 'Status'];
              newReport.data = inventory.map(item => ({
                  sku: item.sku,
                  name: item.name,
                  type: item.type,
                  stock: `${item.stock} ${item.unit}`,
                  cost: `$${item.unitCost.toFixed(2)}`,
                  value: `$${item.stockValue.toFixed(2)}`,
                  status: item.lowStock ? 'Low Stock' : item.stock === 0 ? 'Out of Stock' : 'Good'
              }));
              
              const lowStockCount = inventory.filter(i => i.lowStock).length;
              const outOfStockCount = inventory.filter(i => i.stock === 0).length;

              newReport.summaryStats = [
                  { label: 'Total Items', value: inventory.length },
                  { label: 'Total Valuation', value: `$${getInventoryValue().toFixed(2)}`, color: 'text-[#C5A059]' },
                  { label: 'Low Stock Alerts', value: lowStockCount, color: 'text-amber-500' },
                  { label: 'Out of Stock', value: outOfStockCount, color: 'text-red-500' }
              ];
          } 
          else if (category === 'Sales & Revenue') {
              newReport.headers = ['Order ID', 'Customer', 'Date', 'Platform', 'Status', 'Total'];
              newReport.data = orders.map(order => ({
                  id: order.id,
                  customer: order.customer,
                  date: order.date,
                  platform: order.platform,
                  status: order.status,
                  total: `$${order.total.toFixed(2)}`
              }));

              const avgOrderValue = orders.length > 0 ? getTotalRevenue() / orders.length : 0;

              newReport.summaryStats = [
                  { label: 'Total Orders', value: orders.length },
                  { label: 'Total Revenue', value: `$${getTotalRevenue().toFixed(2)}`, color: 'text-[#C5A059]' },
                  { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, color: 'text-[#6A2C91]' },
                  { label: 'Pending Processing', value: orders.filter(o => o.status === 'Processing').length, color: 'text-amber-500' }
              ];
          }
          else if (category === 'Production Efficiency') {
              newReport.headers = ['Metric', 'Value', 'Notes'];
              newReport.data = [
                  { metric: 'Active Batches', value: productionStats.active, notes: 'Currently on floor' },
                  { metric: 'Pending Orders', value: productionStats.pending, notes: 'In queue' },
                  { metric: 'Completed Today', value: productionStats.completed, notes: 'Output matched target' },
                  { metric: 'Efficiency Rate', value: '94%', notes: 'AI calculated' }
              ];

              newReport.summaryStats = [
                  { label: 'Active Jobs', value: productionStats.active },
                  { label: 'Pending', value: productionStats.pending, color: 'text-amber-500' },
                  { label: 'Completed', value: productionStats.completed, color: 'text-[#C5A059]' },
                  { label: 'Overall Efficiency', value: '94%', color: 'text-[#6A2C91]' }
              ];
          }

          saveReport(newReport);
          setCurrentReport({ ...newReport, id: 'temp' });
          setIsGenerating(false);
      }, 1500);
  };

  const handleExport = (report: Report) => {
      if (!report || !report.data.length) return;
      
      const csvContent = [
          report.headers.join(','),
          ...report.data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  if (view === 'saved') {
      return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-10 lg:space-y-12 animate-in fade-in pb-8 sm:pb-12 lg:pb-20 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto"
          >
              <button onClick={() => setView('generator')} className="flex items-center gap-3 text-white sm:text-white/40 hover:text-white font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all group w-fit mb-4">
                  <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Generator
              </button>
              
              <VaultBanner 
                  title="Saved Reports"
                  subtitle="Archive of generated financial and operational dossiers."
                  badge="Archive Accessed"
              />

              {reports.length === 0 ? (
                  <div className="bg-white/5 border border-dashed border-white/10 rounded-[3rem] p-6 sm:p-12 flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] w-full max-w-full overflow-hidden">
                      <GlassHaloIcon icon={History} color="purple" size="lg" className="mb-8 w-14 h-14 sm:w-24 sm:h-24 [&>svg]:w-12 [&>svg]:w-auto mx-auto py-1 px-3 text-[10px] opacity-50" />
                      <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">No Reports Archieved</h3>
                      <p className="text-sm sm:text-base text-[11px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em]">Generate a report to see it here</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 gap-3 sm:gap-6">
                      {reports.map((report) => (
                          <div key={report.id} className="luxury-card bg-white/5 p-4 sm:p-5 lg:p-6 rounded-[2rem] border border-white/10 shadow-sm hover:shadow-2xl transition-all flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6 group">
                              <div className="flex items-start gap-3 sm:gap-6">
                                  <GlassHaloIcon icon={FileText} color="gold" size="md" className="group-hover:scale-110 transition-all" />
                                  <div>
                                      <h3 className="text-lg sm:text-2xl lg:text-3xl font-serif text-white font-black tracking-tight mb-2">{report.title}</h3>
                                      <div className="flex items-center gap-3 sm:gap-4 text-xs text-white sm:text-white/50">
                                          <span className="flex items-center gap-2 font-sans font-light"><Clock size={14}/> Generated: {report.generatedDate}</span>
                                          <Badge color="purple" className="text-[9px] uppercase tracking-widest">{report.category}</Badge>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
                                  <Button variant="outline" onClick={() => handleExport(report)} className="flex-1 md:flex-none border-white/10 text-white hover:bg-white/5 hover:border-white/20 w-auto mx-auto py-1 px-3 text-[10px] rounded-xl text-[10px] font-sans font-bold tracking-[0.3em] uppercase transition-all shadow-sm">
                                      <Download size={14} className="mr-2" /> CSV
                                  </Button>
                                  <Button variant="outline" onClick={() => deleteReport(report.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20 w-auto mx-auto py-1 px-3 text-[10px] rounded-xl transition-all">
                                      <Trash2 size={16} />
                                  </Button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </motion.div>
      );
  }

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 sm:space-y-10 lg:space-y-12 pb-8 sm:pb-12 lg:pb-20 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto"
    >
        <button onClick={() => navigate('/operations')} className="flex items-center gap-3 text-white sm:text-white/40 hover:text-white font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all group w-fit mb-4">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Operations
        </button>

        <VaultBanner 
            title="Reports & Analytics"
            subtitle="Synthesize complex datasets into actionable financial and operational intelligence."
            badge="Reporting Module Active"
        >
            <Button 
                variant="outline" 
                onClick={() => setView('saved')}
                className="bg-white/5 hover:bg-white/10 text-white font-sans font-bold text-[11px] py-3 px-6 rounded-full px-10 border-white/20 tracking-[0.3em] uppercase transition-all flex items-center gap-3"
            >
                <History size={16} /> VIEW SAVED ARCHIVES ({reports.length})
            </Button>
        </VaultBanner>

        {/* AI Report Generator Section */}
        <div className="luxury-card bg-white/5 backdrop-blur-xl rounded-[3rem] p-4 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full sm:w-64 h-[180px] sm:h-64 bg-gradient-to-br from-[#6A2C91]/20 to-transparent rounded-bl-full opacity-50 -mr-16 -mt-8 sm:mt-12 lg:mt-16 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 sm:gap-4 mb-10 relative z-10">
                <GlassHaloIcon icon={Sparkles} color="purple" size="md" />
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">AI-Powered Extraction</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-10 relative z-10">
                <div>
                    <label className="text-[11px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-[0.3em] block mb-4">Report Category</label>
                    <Select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-black/40 border-white/10 text-white rounded-2xl py-3 px-6 text-sm">
                        <option className="bg-[#1A1A1A]">Inventory & Materials</option>
                        <option className="bg-[#1A1A1A]">Sales & Revenue</option>
                        <option className="bg-[#1A1A1A]">Production Efficiency</option>
                    </Select>
                </div>
                <div>
                    <label className="text-[11px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-[0.3em] block mb-4">Report Type</label>
                    <Select value={reportType} onChange={(e) => setReportType(e.target.value)} className="bg-black/40 border-white/10 text-white rounded-2xl py-3 px-6 text-sm">
                        <option className="bg-[#1A1A1A]">Summary</option>
                        <option className="bg-[#1A1A1A]">Detailed Log</option>
                        <option className="bg-[#1A1A1A]">Exception Report</option>
                    </Select>
                </div>
                <div>
                    <label className="text-[11px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-[0.3em] block mb-4">Time Range</label>
                    <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="bg-black/40 border-white/10 text-white rounded-2xl py-3 px-6 text-sm">
                        <option className="bg-[#1A1A1A]">Last 7 days</option>
                        <option className="bg-[#1A1A1A]">Last 30 days</option>
                        <option className="bg-[#1A1A1A]">This Quarter</option>
                        <option className="bg-[#1A1A1A]">Year to Date</option>
                    </Select>
                </div>
            </div>
            <div className="flex justify-end pt-8 border-t border-white/10 relative z-10">
                 <Button 
                    className="bg-[#6A2C91] hover:bg-[#5a257a] text-white w-full md:w-auto py-3 px-6 rounded-full px-12 font-sans font-bold text-[11px] tracking-[0.3em] uppercase shadow-2xl shadow-[#6A2C91]/20 transition-all flex items-center justify-center gap-3"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <><Loader2 size={16} className="animate-spin" /> SYNTHESIZING...</>
                    ) : (
                        <><Sparkles size={16} /> GENERATE DOSSIER</>
                    )}
                </Button>
            </div>
        </div>

        {/* Report Preview */}
        {currentReport && (
            <div className="space-y-8 animate-in slide-up duration-700">
                <div className="flex flex-col md:flex-col sm:flex-col sm:flex-row justify-between items-start md:items-end gap-3 sm:gap-6">
                    <div className="flex items-center gap-3 text-[#C5A059] font-sans font-bold text-[11px] uppercase tracking-[0.3em]">
                        <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse shadow-[0_0_10px_#C5A059]"></div> Dossier Initialized
                    </div>
                    <Button 
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full w-auto mx-auto py-1 px-3 text-[10px] px-8 font-sans font-bold text-[10px] tracking-[0.3em] uppercase shadow-sm transition-all flex items-center gap-2"
                        onClick={() => handleExport(currentReport)}
                    >
                        <Download size={14} /> EXPORT CSV
                    </Button>
                </div>

                <div className="luxury-card bg-[#1A1A1A] border-t-[6px] border-t-[#6A2C91] border-x border-b border-white/10 rounded-b-[3rem] p-4 sm:p-12 shadow-2xl">
                    <div className="mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white mb-4">{currentReport.title}</h2>
                        <p className="text-sm sm:text-base text-white sm:text-white/50 leading-relaxed mb-4">Comprehensive analysis generated based on real-time operational data.</p>
                        <div className="flex items-center gap-3 text-[11px] font-sans font-bold text-white/30 uppercase tracking-[0.3em] mt-6 bg-black/40 w-fit px-4 py-2 rounded-xl">
                            <FileText size={14} />
                            <span>Range: {timeRange} <span className="mx-2">•</span> Generated: {currentReport.generatedDate}</span>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-6 mb-12">
                        {currentReport.summaryStats.map((stat, i) => (
                            <div key={i} className="p-3.5 sm:p-6 lg:p-12 rounded-[2rem] border border-white/5 bg-white/5 shadow-inner hover:bg-white/10 transition-colors">
                                <p className="text-sm sm:text-base text-[11px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-4">{stat.label}</p>
                                <p className={`text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight ${stat.color || 'text-white'}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div>
                        <h4 className="text-[11px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <Target size={14} /> Raw Data Ledger
                        </h4>
                        <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-black/40 shadow-inner">
                            <div className="overflow-x-auto w-full"><table className="w-full min-w-[650px] text-sm text-left font-sans">
                                <thead className="bg-[#6A2C91]/10 text-white sm:text-white/70 font-sans font-bold text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                                    <tr>
                                        {currentReport.headers.map((h, i) => (
                                            <th key={i} className="p-4 sm:p-6">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {currentReport.data.map((row, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            {Object.values(row).map((val: any, j) => (
                                                <td key={j} className="p-4 sm:p-6 text-white sm:text-white/70 font-light">{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table></div>
                        </div>
                        <p className="text-sm sm:text-base text-[10px] text-white/30 font-sans font-bold uppercase tracking-[0.3em] mt-6 text-center">Report archived to synaptic history securely.</p>
                    </div>
                </div>
            </div>
        )}
    </motion.div>
  );
};

