import React, { useState } from 'react';
import { Card, Button, FileUploader, Badge } from '../UI';
import { Eye, TrendingUp, BarChart3, Activity, Download, Instagram, Film, FileText, ArrowRight, DollarSign, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanData } from '../DataContext';
import { motion } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, ComposedChart, Bar } from 'recharts';

const mockChartData = [
  { name: 'Mon', revenue: 1200, reach: 4500, inventory: 500 },
  { name: 'Tue', revenue: 1900, reach: 8200, inventory: 450 },
  { name: 'Wed', revenue: 1500, reach: 6100, inventory: 420 },
  { name: 'Thu', revenue: 2800, reach: 12000, inventory: 380 },
  { name: 'Fri', revenue: 3400, reach: 18500, inventory: 290 },
  { name: 'Sat', revenue: 4100, reach: 24000, inventory: 150 },
  { name: 'Sun', revenue: 3800, reach: 21000, inventory: 80 },
];

const ProgressBar = ({ label, icon: Icon, percentage, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-white/80">
        <Icon size={14} className={color} />
        <span className="font-sans">{label}</span>
      </div>
      <span className="text-white/50 font-mono">{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
    </div>
  </div>
);

export const VisualAnalysisNode = () => {
    const navigate = useNavigate();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-8 space-y-12 pb-32 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Visual Analyst"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Performance metrics dashboard and cross-channel campaign analysis."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 bg-black/40 border-white/5 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <Badge color="gold">Campaign Reach</Badge>
                        <TrendingUp size={16} className="text-[#C5A059]" />
                    </div>
                    <div className="text-4xl font-serif text-white mb-2">124.5K</div>
                    <div className="text-xs text-white/50 uppercase tracking-widest">+14% vs last week</div>
                </Card>
                <Card className="p-8 bg-black/40 border-white/5 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <Badge color="purple">Avg. Engagement</Badge>
                        <Activity size={16} className="text-purple-500" />
                    </div>
                    <div className="text-4xl font-serif text-white mb-2">8.2%</div>
                    <div className="text-xs text-white/50 uppercase tracking-widest">+2.1% across channels</div>
                </Card>
                <Card className="p-8 bg-black/40 border-white/5 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <Badge color="green">Revenue Attribution</Badge>
                        <DollarSign size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-4xl font-serif text-white mb-2">$18,450</div>
                    <div className="text-xs text-white/50 uppercase tracking-widest">From trackable social links</div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-8 bg-black/40 border-white/5 backdrop-blur-xl" title="Correlation Matrix: Sales vs Inventory Burn vs Campaign Reach">
                    <div className="h-80 w-full mt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={mockChartData}>
                                <defs>
                                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area yAxisId="left" type="monotone" dataKey="reach" fill="url(#colorReach)" stroke="#C5A059" strokeWidth={2} name="Social Reach" />
                                <Bar yAxisId="left" dataKey="revenue" fill="#6A2C91" radius={[4, 4, 0, 0]} maxBarSize={40} name="Square Sales ($)" />
                                <Line yAxisId="right" type="monotone" dataKey="inventory" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} name="Inventory Stock" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-8 bg-black/40 border-white/5 backdrop-blur-xl" title="Channel Conversion Breakdown">
                    <div className="mt-8 space-y-8">
                        <ProgressBar label="Instagram Feed & Reels" icon={Instagram} percentage={45} color="text-pink-500" />
                        <ProgressBar label="TikTok Campaigns" icon={Film} percentage={35} color="text-white" />
                        <ProgressBar label="SEO Blog / Organic Search" icon={FileText} percentage={15} color="text-emerald-500" />
                        <ProgressBar label="Email Newsletters" icon={BarChart3} percentage={5} color="text-[#C5A059]" />
                    </div>
                    
                    <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Eye className="text-[#C5A059]" size={20} />
                            <h4 className="text-white font-serif tracking-tight">AI Insight</h4>
                        </div>
                        <p className="text-sm font-sans font-light text-white/70 leading-relaxed">
                            Your recent TikTok campaign caused a 40% spike in inventory burn rate for "Rosehip Oil". Consider throttling ad spend to prevent stockout before the weekend.
                        </p>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};
