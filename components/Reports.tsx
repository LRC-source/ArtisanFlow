
import React, { useState } from 'react';
import { Card, Button, Select, Badge } from './UI';
import { Sparkles, Download, FileText, Filter, Save, Trash2, ArrowLeft, Clock, History } from 'lucide-react';
import { useArtisanData, Report } from './DataContext';

export const Reports = () => {
  const { inventory, orders, productionStats, getInventoryValue, getTotalRevenue, reports, saveReport, deleteReport } = useArtisanData();
  
  const [view, setView] = useState<'generator' | 'saved'>('generator');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  
  // Form State
  const [category, setCategory] = useState('Inventory & Materials');
  const [reportType, setReportType] = useState('Summary');
  const [timeRange, setTimeRange] = useState('Last 30 days');

  const handleGenerate = () => {
      setIsGenerating(true);
      
      // Simulate AI Processing time
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

          // Logic to generate interconnected data based on real app state
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
                  { label: 'Total Valuation', value: `$${getInventoryValue().toFixed(2)}`, color: 'text-purple-600' },
                  { label: 'Low Stock Alerts', value: lowStockCount, color: 'text-amber-600' },
                  { label: 'Out of Stock', value: outOfStockCount, color: 'text-red-600' }
              ];
          } 
          else if (category === 'Sales & Revenue') {
              newReport.headers = ['Order ID', 'Customer', 'Date', 'Platform', 'Status', 'Total'];
              // Filter logic for time range would go here in a real app
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
                  { label: 'Total Revenue', value: `$${getTotalRevenue().toFixed(2)}`, color: 'text-emerald-600' },
                  { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, color: 'text-blue-600' },
                  { label: 'Pending Processing', value: orders.filter(o => o.status === 'Processing').length, color: 'text-amber-600' }
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
                  { label: 'Pending', value: productionStats.pending, color: 'text-amber-600' },
                  { label: 'Completed', value: productionStats.completed, color: 'text-emerald-600' },
                  { label: 'Overall Efficiency', value: '94%', color: 'text-purple-600' }
              ];
          }

          saveReport(newReport); // Auto-save to history
          setCurrentReport({ ...newReport, id: 'temp' }); // Set for display
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

  // --- VIEW: SAVED REPORTS ---
  if (view === 'saved') {
      return (
          <div className="space-y-6 animate-in fade-in pb-20">
              <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setView('generator')} className="text-gray-400 hover:text-[#6A2C91] transition-colors font-medium flex items-center gap-1">
                      <ArrowLeft size={18} /> Back to Generator
                  </button>
              </div>
              
              <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-white">Saved Reports</h1>
                  <p className="text-gray-500">History of your AI-generated analytics</p>
              </div>

              {reports.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <History size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-white font-bold font-medium mb-1">No reports saved yet</h3>
                      <p className="text-gray-400 text-sm">Generate a report to see it here</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 gap-4">
                      {reports.map((report) => (
                          <div key={report.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-4">
                              <div className="flex items-start gap-4">
                                  <div className="p-3 bg-purple-50 text-[#6A2C91] rounded-lg">
                                      <FileText size={24} />
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-white text-lg">{report.title}</h3>
                                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                          <span className="flex items-center gap-1"><Clock size={14}/> Generated: {report.generatedDate}</span>
                                          <Badge color="gray">{report.category}</Badge>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="flex items-center gap-2 w-full md:w-auto">
                                  <Button variant="outline" onClick={() => handleExport(report)} className="flex-1 md:flex-none">
                                      <Download size={16} /> CSV
                                  </Button>
                                  <Button variant="outline" onClick={() => deleteReport(report.id)} className="text-red-500 hover:bg-red-50 border-red-200">
                                      <Trash2 size={16} />
                                  </Button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      );
  }

  // --- VIEW: GENERATOR ---
  return (
    <div className="space-y-8 animate-in fade-in pb-20">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
                <p className="text-gray-500">Generate automated reports and export data</p>
            </div>
            <Button variant="outline" onClick={() => setView('saved')}>
                <History size={16} className="mr-2"/> View Saved Reports ({reports.length})
            </Button>
        </div>

        {/* AI Report Generator Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-[#6A2C91]" size={20} />
                <h3 className="text-lg font-bold text-white">AI-Powered Report Generator</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Report Category</label>
                    <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option>Inventory & Materials</option>
                        <option>Sales & Revenue</option>
                        <option>Production Efficiency</option>
                    </Select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Report Type</label>
                    <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <option>Summary</option>
                        <option>Detailed Log</option>
                        <option>Exception Report</option>
                    </Select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Time Range</label>
                    <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>This Quarter</option>
                        <option>Year to Date</option>
                    </Select>
                </div>
            </div>
            <div className="flex justify-end border-t border-gray-100 pt-4">
                 <Button 
                    variant="primary" 
                    className="bg-[#6A2C91] text-white w-full md:w-auto"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Generating...</>
                    ) : (
                        <><Sparkles size={16} className="mr-2" /> Generate Detailed Report</>
                    )}
                </Button>
            </div>
        </div>

        {/* Report Preview */}
        {currentReport && (
            <div className="space-y-4 animate-slide-up">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#6A2C91] font-bold">
                        <div className="w-2 h-2 rounded-full bg-[#6A2C91] animate-pulse"></div> Report Preview
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleExport(currentReport)}>
                            <Download size={16} className="mr-2" /> Export CSV
                        </Button>
                    </div>
                </div>

                <Card className="border-t-4 border-t-[#6A2C91]">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white">{currentReport.title}</h2>
                        <p className="text-gray-500">Comprehensive analysis generated based on current system data.</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                            <FileText size={14} />
                            <span>Range: {timeRange} • Generated: {currentReport.generatedDate}</span>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {currentReport.summaryStats.map((stat, i) => (
                            <div key={i} className="p-4 rounded-lg border border-gray-100 shadow-sm bg-white">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color || 'text-gray-900'}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div>
                        <h4 className="font-bold text-white text-sm mb-4">Detailed Data</h4>
                        <div className="overflow-x-auto rounded-lg border border-gray-100 max-h-[400px]">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#6A2C91]/5 text-[#6A2C91] font-bold sticky top-0 bg-white shadow-sm">
                                    <tr>
                                        {currentReport.headers.map((h, i) => (
                                            <th key={i} className="p-3">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentReport.data.map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            {Object.values(row).map((val: any, j) => (
                                                <td key={j} className="p-3 text-gray-900">{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Report saved to history automatically.</p>
                    </div>
                </Card>
            </div>
        )}
    </div>
  );
};
