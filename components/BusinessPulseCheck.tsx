import React, { useState } from 'react';
import { ContextualTutorialModal } from './ContextualTutorialModal';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, FileUploader, Badge } from './UI';
import { Sparkles, ArrowRight, Activity, AlertTriangle, Lock, FileText, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';

export const BusinessPulseCheck = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    siteVisits: '',
    orders: '',
    revenueTrend: '',
    chaosLevel: '',
    aov: '',
    personality: '',
    industry: ''
  });

  const handleAnalyze = () => {
    // Simulate processing time
    setTimeout(() => {
        setStep(2);
    }, 1200);
  };

  const handleGenerateStrategy = () => {
      navigate('/marketing/strategy-report');
  };

  if (step === 1) {
    return (
      <div className="max-w-7xl mx-auto py-12 animate-in fade-in duration-700 pb-12 sm:pb-20 lg:pb-32">
            <ContextualTutorialModal
                hubId="trapcast_audit"
                title="TrapCast Audit"
                description="Get an instant health check of your entire operation."
                steps={["Run a full system diagnostic.","Review critical alerts for stockouts or capacity bottlenecks.","Action AI recommendations to improve margins."]}
            />
        <div className="w-full md:w-1/2 mb-12">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-[#1A1A1A] to-[#333333] rounded-full text-[#C5A059] shadow-xl">
                    <Sparkles size={24} strokeWidth={1.5} />
                </div>
                <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">Synaptic Pulse Check</h1>
            </div>
            <p className="text-sm sm:text-base text-gray-500 font-sans font-light leading-relaxed">Lola AI is establishing operational health benchmarks. Deployment: 60 Seconds.</p>
            
            <div className="mt-6 sm:mt-8 lg:mt-12 flex items-center gap-3 sm:gap-4 text-[10px] font-sans font-medium uppercase tracking-[0.2em]">
                <span className="text-[#6A2C91]">Node 1 of 2</span>
                <div className="h-1 flex-1 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-[#6A2C91] transition-all duration-1000"></div>
                </div>
                <span className="text-stone-400">Data Ingestion</span>
            </div>
        </div>

        <div className="w-full md:w-1/2">
            <Card className="luxury-card p-4 sm:p-12">
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">Establish Identity Baseline</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2">Avg Monthly Visitors</label>
                        <Input 
                            placeholder="e.g. 5000" 
                            value={formData.siteVisits}
                            onChange={(e) => setFormData({...formData, siteVisits: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2">Avg Monthly Orders</label>
                        <Input 
                            placeholder="e.g. 150" 
                            value={formData.orders}
                            onChange={(e) => setFormData({...formData, orders: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2">Avg Order Value ($)</label>
                        <Input 
                            placeholder="e.g. 75.00" 
                            value={formData.aov}
                            onChange={(e) => setFormData({...formData, aov: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2">Revenue Trajectory</label>
                        <Select
                            value={formData.revenueTrend}
                            onChange={(e) => setFormData({...formData, revenueTrend: e.target.value})}
                            className="w-auto mx-auto py-1 px-3 text-[10px] rounded-full"
                        >
                            <option value="">Select trend...</option>
                            <option value="up_high">Rapid Growth (&gt;20%)</option>
                            <option value="up_slow">Steady Growth (5-20%)</option>
                            <option value="flat">Flat / Stagnant</option>
                            <option value="down">Declining</option>
                        </Select>
                    </div>
                </div>

                <div className="mt-8 space-y-2">
                    <label className="text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2">Current Entropy Level</label>
                    <Select
                        value={formData.chaosLevel}
                        onChange={(e) => setFormData({...formData, chaosLevel: e.target.value})}
                        className="w-auto mx-auto py-1 px-3 text-[10px] rounded-full"
                    >
                        <option value="">How do you feel...</option>
                        <option value="zen">Zen Protocol (Everything is automated)</option>
                        <option value="manageable">Manageable (Some manual effort)</option>
                        <option value="stressed">Stressed (Dropping nodes)</option>
                        <option value="chaos">Total Chaos (Firefighting daily)</option>
                    </Select>
                </div>

                <div className="mt-6 sm:mt-8 lg:mt-12 pt-10 border-t border-stone-100">
                    <div className="flex items-center gap-3 sm:gap-4 mb-8">
                        <div className="p-3 bg-stone-50 rounded-full text-[#6A2C91]">
                            <FileText size={20} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-[10px] font-sans font-medium text-white font-bold uppercase tracking-[0.2em]">Optional Synthesis Documents</h4>
                    </div>
                    <FileUploader label="Upload Historical Ledger (P&L or Inventory CSV)" />
                </div>

                <div className="mt-6 sm:mt-8 lg:mt-12 pt-10 border-t border-stone-100">
                    <h4 className="text-[10px] font-sans font-medium text-[#6A2C91] uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <Sparkles size={16} className="text-[#C5A059]" strokeWidth={1.5} /> Creator Archetype
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2">Personality Node</label>
                            <Select
                                value={formData.personality}
                                onChange={(e) => setFormData({...formData, personality: e.target.value})}
                                className="w-auto mx-auto py-1 px-3 text-[10px] rounded-full"
                            >
                                <option value="">Select your style...</option>
                                <option value="visionary">The Visionary (High Velocity)</option>
                                <option value="perfectionist">The Perfectionist (High Integrity)</option>
                                <option value="educator">The Educator (High Engagement)</option>
                                <option value="entertainer">The Entertainer (High Trends)</option>
                                <option value="artisan">The Quiet Artisan (Focus on ASMR)</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2">Business Domain</label>
                            <Select
                                value={formData.industry}
                                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                className="w-auto mx-auto py-1 px-3 text-[10px] rounded-full"
                            >
                                <option value="">Select industry...</option>
                                <option value="skincare">Skincare & Beauty</option>
                                <option value="candles">Home Fragrance</option>
                                <option value="jewelry">Artisanal Jewelry</option>
                                <option value="apparel">Premium Textiles</option>
                                <option value="pottery">Ceramics & Home</option>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-12 mt-6 sm:mt-8 lg:mt-12 border-t border-stone-100">
                    <Button 
                        onClick={handleAnalyze} 
                        className="w-full py-3 px-6 bg-[#1A1A1A] text-white border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] font-sans font-medium uppercase text-[11px] tracking-[0.2em] rounded-full hover:bg-[#333333] transition-all"
                    >
                        ANALYZE SYSTEM HEALTH <ArrowRight size={18} className="ml-3" strokeWidth={1.5} />
                    </Button>
                </div>
            </Card>
        </div>
      </div>
    );
  }

  // Step 2: Results
  return (
    <div className="max-w-7xl mx-auto py-12 animate-in fade-in duration-700 pb-12 sm:pb-20 lg:pb-32">
        <div className="w-full md:w-1/2 mb-12">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-[#1A1A1A] to-[#333333] rounded-full text-white shadow-xl">
                    <Sparkles size={24} strokeWidth={1.5} />
                </div>
                <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">Synthesis Complete</h1>
            </div>
            
            <div className="mt-6 sm:mt-8 lg:mt-12 flex items-center gap-3 sm:gap-4 text-[10px] font-sans font-medium uppercase tracking-[0.2em]">
                <span className="text-[#6A2C91]">Node 2 of 2</span>
                <div className="h-1 flex-1 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-[#6A2C91] transition-all duration-1000"></div>
                </div>
                <span className="text-[#C5A059]">Diagnostics Ready</span>
            </div>
        </div>

        <div className="w-full md:w-1/2">
            <Card className="luxury-card text-center pb-16 p-4 sm:p-12">
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">Manufacturing Integrity Audit</h3>
                
                {/* Gauge Visualization */}
                <div className="relative w-72 h-36 mx-auto mb-8 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full rounded-t-full bg-stone-100"></div>
                    <div 
                        className="absolute top-0 left-0 w-full h-full rounded-t-full bg-gradient-to-r from-red-500 via-amber-400 to-green-500 origin-bottom scale-x-100 scale-y-100 shadow-lg"
                        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)' }}
                    ></div>
                    {/* Needle */}
                    <div className="absolute bottom-0 left-1/2 w-1.5 h-32 bg-stone-900 origin-bottom transform -translate-x-1/2 rotate-[45deg] transition-transform duration-[2000ms] ease-out z-10 rounded-full shadow-2xl"></div>
                    <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-stone-900 rounded-full -translate-x-1/2 translate-y-1/2 z-20 border-4 border-white shadow-xl"></div>
                </div>
                
                <div className="text-sm sm:text-base md:text-3xl sm:text-5xl lg:text-7xl font-black sm:text-4xl lg:text-5xl font-serif text-red-600 tracking-tight mb-4">85</div>
                <p className="text-sm sm:text-base text-[10px] text-stone-400 font-sans font-medium uppercase tracking-[0.3em]">Synaptic Risk Index</p>

                <div className="mt-6 sm:mt-8 lg:mt-12 bg-red-50/50 border border-red-100/50 rounded-[3rem] p-3.5 sm:p-6 lg:p-12 flex flex-col sm:flex-col sm:flex-col sm:flex-row items-center gap-3 sm:gap-6 text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3.5 sm:p-6 lg:p-12 opacity-[0.03] text-red-600 group-hover:rotate-12 transition-transform duration-700"><AlertTriangle size={100} strokeWidth={1}/></div>
                    <div className="w-12 h-12 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center text-red-500 shadow-[0_8px_30px_rgba(239,68,68,0.15)] shrink-0 relative z-10">
                        <Activity size={32} strokeWidth={1.5} />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-sans font-medium uppercase text-red-400 tracking-[0.2em] mb-2 block">Lola's Critical Audit</span>
                        <h4 className="text-sm sm:text-base md:text-3xl sm:text-5xl lg:text-7xl font-black font-serif text-red-700 tracking-tight mb-3">HIGH RISK: BURNOUT PROTOCOL</h4>
                        <p className="text-sm sm:text-base text-red-800/70 font-sans font-light leading-relaxed">
                            Revenue is scaling but operational entropy is critical. You are currently working harder for diminishing returns. Systems are approaching failure.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mt-6 sm:mt-8 lg:mt-12">
                    <div className="bg-[#6A2C91]/5 p-3.5 sm:p-6 lg:p-12 rounded-[3rem] border border-[#6A2C91]/10 group hover:bg-white transition-all duration-500">
                        <p className="text-sm sm:text-base text-[9px] text-[#6A2C91]/60 font-sans font-medium uppercase tracking-[0.3em] mb-4">Omnichannel Flow</p>
                        <p className="text-sm sm:text-base font-black font-serif text-[#6A2C91] tracking-tight mb-2">30.0%</p>
                        <p className="text-sm sm:text-base text-[10px] text-[#6A2C91]/80 font-sans font-medium uppercase tracking-[0.2em]">Conversion Rate</p>
                    </div>
                    <div className="bg-[#C5A059]/5 p-3.5 sm:p-6 lg:p-12 rounded-[3rem] border border-[#C5A059]/10 group hover:bg-white transition-all duration-500">
                        <p className="text-sm sm:text-base text-[9px] text-[#C5A059]/60 font-sans font-medium uppercase tracking-[0.3em] mb-4">Network Liquidity</p>
                        <p className="text-sm sm:text-base font-black font-serif text-[#C5A059] tracking-tight mb-2">$15.00</p>
                        <p className="text-sm sm:text-base text-[10px] text-[#C5A059]/80 font-sans font-medium uppercase tracking-[0.2em]">Avg Order Value</p>
                    </div>
                </div>
            </Card>

            <div className="mt-6 sm:mt-8 lg:mt-12 bg-gradient-to-br from-[#1A1A1A] to-[#333333] p-px rounded-[3rem] shadow-2xl">
                <div className="bg-white rounded-[2.9rem] p-4 sm:p-12 md:p-16 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 sm:p-12 opacity-[0.02] text-gray-900 pointer-events-none group-hover:rotate-12 transition-transform duration-1000"><Sparkles size={160} strokeWidth={1}/></div>
                    
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 text-[#1A1A1A]">
                        <Sparkles size={28} className="text-[#C5A059] animate-pulse" strokeWidth={1.5} />
                        <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight">The Synaptic Cure</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-500 font-sans font-light mb-12 leading-relaxed leading-relaxed">Lola AI has synthesized the following corrective directives for <strong className="font-medium text-gray-900">{formData.industry || 'your business'}</strong>:</p>

                    <div className="space-y-4 mb-12">
                        {['Predictive Demand Synthesizer', 'Automated Reorder Optimization', 'Production Floor Flow Balancer'].map(item => (
                            <div key={item} className="flex items-center gap-3 sm:gap-6 p-4 sm:p-6 bg-stone-50/50 rounded-full border border-stone-100 group/li hover:bg-[#6A2C91]/5 hover:border-[#6A2C91]/20 transition-all duration-500">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-white text-[#6A2C91] flex items-center justify-center text-[10px] font-sans font-medium shadow-sm group-hover/li:bg-[#6A2C91] group-hover/li:text-white transition-all duration-500">✓</div>
                                <span className="text-sm font-sans font-medium text-gray-700 tracking-wide">{item}</span>
                            </div>
                        ))}
                    </div>

                    <Button onClick={handleGenerateStrategy} className="w-full py-3 px-6 bg-[#1A1A1A] text-white font-sans font-medium uppercase text-[11px] tracking-[0.2em] shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-full relative overflow-hidden group/btn hover:bg-[#333333] transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        <Sparkles size={18} className="mr-3" strokeWidth={1.5} /> SYNTHESIZE MARKETING ARCHITECTURE
                    </Button>
                    
                    <p className="text-sm sm:text-base text-[10px] text-stone-400 mt-10 font-sans font-medium uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                        <Lock size={14} strokeWidth={1.5} /> Full Vault Access Required
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};
