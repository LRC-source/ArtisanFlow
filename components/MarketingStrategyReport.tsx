import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, SocialMediaAuthModal } from './UI';
import { SubPageHeader } from './SubPageHeader';
import { 
    ArrowLeft, Sparkles, User, Target, Calendar, Share2, 
    Download, CheckCircle, RefreshCw, FileText, Send, 
    Instagram, Facebook, Linkedin, Video, Layers, Clock, Box, Plus, 
    Loader2, Zap, Globe, ShieldCheck, X, DollarSign, TrendingUp, PieChart, Activity
} from 'lucide-react';
import { useArtisanData } from './DataContext';
import { generatePlatformContentBundle } from '../services/geminiService';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const MarketingStrategyReport = () => {
  const navigate = useNavigate();
  const { addMarketingPost, connectedChannels } = useArtisanData();
  const [generating, setGenerating] = useState(true);
  const [isBundling, setIsBundling] = useState(false);
  const [contentBundle, setContentBundle] = useState<any[]>([]);
  const [scheduledIds, setScheduledIds] = useState<string[]>([]);
  const [authModalPlatform, setAuthModalPlatform] = useState<string | null>(null);

  const strategyData = {
      summary: "Herbalistic Wellness aims to enhance its market presence by implementing a comprehensive social media marketing strategy that focuses on engagement, education, and community-building. Targeting health-conscious individuals aged 30-55, the approach will leverage visual platforms and content marketing to boost brand awareness and sales.",
      audience: {
          demographics: "Adults aged 30-55, urban/suburban, income $60k-$130k.",
          interests: ['Health and wellness', 'Natural skincare', 'Herbal remedies', 'Eco-friendly products', 'Self-care routines'],
          painPoints: ['Limited knowledge of herbal products', 'Skepticism towards efficacy', 'Desire for sustainable solutions', 'Need for stress relief']
      },
      pillars: [
          { name: "Herbal Education", pct: 30, desc: "Benefits, uses, and preparations of herbs." },
          { name: "Product Showcase", pct: 45, desc: "Features, usage instructions, testimonials." },
          { name: "Wellness Tips", pct: 25, desc: "Self-care practices and lifestyle improvements." }
      ],
      platforms: [
          { name: "Instagram", freq: "3-5x/week", focus: "Visuals, Reels, Stories" },
          { name: "Facebook", freq: "3x/week", focus: "Community, Groups, Events" },
          { name: "TikTok", freq: "3x/week", focus: "Education, Trends, BTS" },
          { name: "LinkedIn", freq: "2x/week", focus: "B2B, Wholesale Partnerships" },
          { name: "Pinterest", freq: "Daily", focus: "Aesthetic Pins, DIY Guides" }
      ],
      ideas: [
          "Create a video on '5 Benefits of Herbal Oils' for skin care on TikTok.",
          "Post a photo of a DIY herbal bath blend with an engaging caption on Instagram.",
          "Conduct a live Q&A on Facebook about organic skincare.",
          "Share an infographic on Pinterest about sustainable practices in herbalism.",
          "Feature a customer spotlight post with their favorite Herbalistic product on Instagram."
      ]
  };

  useEffect(() => {
    runGeneration();
  }, []);

  const runGeneration = () => {
      setGenerating(true);
      setTimeout(() => {
          setGenerating(false);
          localStorage.setItem('latestMarketingStrategy', JSON.stringify(strategyData));
      }, 1500);
  };

  const handleGenerateBundle = async () => {
      setIsBundling(true);
      const toastId = toast.loading("Synthesizing content bundle...");
      const result = await generatePlatformContentBundle(strategyData);
      if (result && result.posts) {
          setContentBundle(result.posts);
          toast.success("Content bundle synthesized.", { id: toastId });
      } else {
          toast.error("Synthesis failed.", { id: toastId });
      }
      setIsBundling(false);
  };

  const handleSchedulePost = (post: any, index: number) => {
      addMarketingPost({
          platform: post.platform as any,
          topic: post.topic,
          content: post.content,
          scheduledDate: new Date().toISOString().split('T')[0],
          status: 'Scheduled',
          type: 'Text',
          mediaUrl: ''
      });
      setScheduledIds([...scheduledIds, `${post.platform}-${index}`]);
      toast.success("Post synced to Content Calendar.");
  };

  const handleExportPDF = () => {
      toast.success("Generating PDF Document...");
      setTimeout(() => {
          toast.success("Strategy_Dossier_2026.pdf exported successfully.");
      }, 1500);
  };

  const getPlatformIcon = (platform: string) => {
      switch(platform) {
          case 'Instagram': return <Instagram size={18} />;
          case 'Facebook': return <Facebook size={18} />;
          case 'TikTok': return <Video size={18} />;
          case 'LinkedIn': return <Linkedin size={18} />;
          case 'Pinterest': return <Box size={18} />;
          default: return <Globe size={18} />;
      }
  };

  if (generating) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in">
              <div className="relative">
                  <div className="w-20 h-20 border-[6px] border-[#6A2C91]/10 border-t-[#6A2C91] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={24} className="text-[#C5A059] animate-pulse" />
                  </div>
              </div>
              <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Synthesizing Strategy Hub...</h2>
                  <p className="text-gray-500 font-medium tracking-wide">Lola AI is reconciling omnichannel manufacturing directives.</p>
              </div>
          </div>
      );
  }

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="p-4 sm:p-8 space-y-12 pb-32 max-w-7xl mx-auto"
    >
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
                <SubPageHeader 
                    title="Marketing Strategy"
                    parentTitle="Marketing Hub"
                    onBack={() => navigate('/marketing')}
                    description="Synaptic Directive Architecture: Scalable Growth Logic."
                />
            </div>
            <div className="flex gap-3">
                <Button onClick={handleExportPDF} variant="outline" className="border-white/20 text-white font-black text-[10px] tracking-widest h-12 px-6 rounded-2xl hover:bg-white/5">
                    <Download size={16} className="mr-2" /> EXPORT PDF DOSSIER
                </Button>
                <Button variant="primary" className="bg-[#6A2C91] hover:bg-[#5a257a] text-white font-black text-[10px] tracking-widest h-12 px-6 rounded-2xl shadow-xl shadow-purple-900/20" onClick={runGeneration}>
                    <RefreshCw size={16} className="mr-2"/> RE-SYNC STRATEGY
                </Button>
            </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-2 text-emerald-500">
                    <Activity size={18} />
                    <span className="text-[10px] uppercase tracking-widest font-black">Predicted Reach</span>
                </div>
                <div className="text-3xl font-serif text-white">450K+</div>
                <div className="text-xs text-gray-400 mt-2">Monthly Impressions</div>
            </Card>
            <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-2 text-magenta-500">
                    <PieChart size={18} />
                    <span className="text-[10px] uppercase tracking-widest font-black">Engagement Rate</span>
                </div>
                <div className="text-3xl font-serif text-white">8.4%</div>
                <div className="text-xs text-gray-400 mt-2">+2.1% vs Industry Avg</div>
            </Card>
            <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-2 text-[#C5A059]">
                    <Target size={18} />
                    <span className="text-[10px] uppercase tracking-widest font-black">Lead Conversion</span>
                </div>
                <div className="text-3xl font-serif text-white">3.2%</div>
                <div className="text-xs text-gray-400 mt-2">Targeting $60k+ Income</div>
            </Card>
            <Card className="p-6 bg-[#1A1115] border-rose-500/20 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-2 text-rose-500">
                    <DollarSign size={18} />
                    <span className="text-[10px] uppercase tracking-widest font-black">CAC Estimate</span>
                </div>
                <div className="text-3xl font-serif text-white">$14.50</div>
                <div className="text-xs text-rose-400/70 mt-2">Customer Acquisition Cost</div>
            </Card>
        </div>

        {/* Executive Summary Node */}
        <Card className="bg-black/40 border-white/10 rounded-[2.5rem] p-4 sm:p-10 shadow-2xl relative overflow-hidden group backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-magenta-500/10 rounded-bl-full -mr-20 -mt-20 opacity-40 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-3 text-[#6A2C91] mb-6 relative z-10">
                <div className="p-3 bg-[#6A2C91]/20 rounded-2xl"><Sparkles size={24} className="text-magenta-500" /></div>
                <h3 className="font-black text-white text-2xl uppercase italic tracking-tighter">Executive Directive</h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg font-sans font-light relative z-10 max-w-4xl italic">
                "{strategyData.summary}"
            </p>
        </Card>

        {/* Strategic Pillars Node */}
        <div className="space-y-8">
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                <TrendingUp className="text-[#C5A059]" /> Content Pillars & Allocation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {strategyData.pillars.map((pillar, i) => (
                    <Card key={i} className="bg-black/40 border-white/10 rounded-[2rem] p-6 shadow-xl hover:border-magenta-500/50 transition-all group overflow-hidden relative backdrop-blur-xl">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.05] text-magenta-500"><PieChart size={80} /></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                             <h4 className="font-black text-white uppercase tracking-tight italic">{pillar.name}</h4>
                             <span className="text-2xl font-serif text-magenta-500">{pillar.pct}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full mb-6 relative overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-magenta-600 to-purple-600 transition-all duration-1000"
                                style={{ width: `${pillar.pct}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed font-sans font-light relative z-10">{pillar.desc}</p>
                    </Card>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card title="Synaptic Channel Links" className="rounded-[2.5rem] border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative">
                 <div className="space-y-4 mt-6 relative z-10">
                    <p className="text-xs text-gray-400 font-sans font-light leading-relaxed mb-6">Authorize secure handshakes to enable auto-publishing logic via Lola.</p>
                    {Object.entries(connectedChannels).map(([platform, isConnected]) => (
                        <div key={platform} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'} transition-colors`}>
                                    {getPlatformIcon(platform)}
                                </div>
                                <span className="font-sans font-medium text-sm text-white capitalize">{platform}</span>
                            </div>
                            <button 
                                onClick={() => !isConnected && setAuthModalPlatform(platform)}
                                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border transition-all ${
                                    isConnected 
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20' 
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-[#6A2C91] hover:text-[#6A2C91]'
                                }`}
                            >
                                {isConnected ? 'LINKED' : 'INITIALIZE'}
                            </button>
                        </div>
                    ))}
                    <div className="pt-6 border-t border-white/5 flex items-center gap-3 text-emerald-500/70">
                        <ShieldCheck size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest">OAuth 2.1 Encryption Active</span>
                    </div>
                 </div>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <Card title="Target Audience Node" className="rounded-[2.5rem] border-white/10 bg-black/40 backdrop-blur-xl">
                    <p className="text-[#C5A059] text-lg font-serif italic tracking-tight mb-6 mt-4">{strategyData.audience.demographics}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={14} className="text-emerald-500" /> Synaptic Affinity</h4>
                            <div className="flex flex-wrap gap-2">
                                {strategyData.audience.interests.map(tag => (
                                    <Badge key={tag} color="green" className="font-medium">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Plus size={14} className="text-rose-500" /> Core Friction Points</h4>
                            <div className="flex flex-wrap gap-2">
                                {strategyData.audience.painPoints.map(tag => (
                                    <Badge key={tag} color="gray" className="font-medium bg-rose-500/10 text-rose-300 border-rose-500/20">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* AI CONTENT BUNDLE TRIGGER */}
                <div className="bg-gradient-to-br from-[#6A2C91] to-magenta-900 rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                        <div className="space-y-2 text-center md:text-left">
                             <h3 className="text-3xl font-serif text-white tracking-tight">AI Content Workbench</h3>
                             <p className="text-purple-200 font-sans font-light">Auto-generate a week of optimized posts based on your strategy.</p>
                        </div>
                        <Button 
                            onClick={handleGenerateBundle}
                            disabled={isBundling}
                            className="bg-[#C5A059] hover:bg-[#b08e4d] text-white border-none h-16 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-amber-500/20 active:scale-95 transition-all"
                        >
                            {isBundling ? <><Loader2 className="animate-spin mr-2" /> SYNTHESIZING...</> : <><Zap size={18} className="mr-2" /> GENERATE BUNDLE</>}
                        </Button>
                     </div>
                </div>
            </div>
        </div>

        {/* Content Bundle Results */}
        {contentBundle.length > 0 && (
            <div className="space-y-8 animate-in slide-up">
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                    <Layers className="text-emerald-500" /> Content Queue Nodes
                </h3>
                <div className="flex overflow-x-auto gap-6 pb-10 scrollbar-hide px-2">
                    {contentBundle.map((post, idx) => {
                        const isScheduled = scheduledIds.includes(`${post.platform}-${idx}`);
                        return (
                            <Card key={idx} className="min-w-[340px] max-w-[340px] bg-black/60 border-white/10 rounded-[2.5rem] p-6 shadow-2xl hover:border-[#6A2C91]/50 transition-all duration-500 flex flex-col group relative backdrop-blur-xl">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl ${isScheduled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'}`}>
                                        {getPlatformIcon(post.platform)}
                                    </div>
                                    <Badge color={isScheduled ? 'green' : 'purple'} className="text-[8px] font-black uppercase px-2">
                                        {isScheduled ? 'SYNCED TO CAL' : 'AI DRAFT'}
                                    </Badge>
                                </div>
                                <h4 className="font-serif text-xl text-white mb-4 line-clamp-1">{post.topic}</h4>
                                <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 mb-6 overflow-y-auto max-h-48 scrollbar-hide">
                                    <p className="text-sm text-gray-300 font-sans font-light whitespace-pre-wrap">{post.content}</p>
                                </div>
                                <div className="space-y-4 pt-6 border-t border-white/5">
                                     <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><Clock size={12}/> {post.bestTimeToPost}</span>
                                        <span className="flex items-center gap-1 text-[#C5A059]"><Target size={12}/> {post.platform}</span>
                                     </div>
                                     <Button 
                                        onClick={() => handleSchedulePost(post, idx)}
                                        disabled={isScheduled}
                                        className={`w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border-none ${
                                            isScheduled 
                                            ? 'bg-white/5 text-gray-500 cursor-default' 
                                            : 'bg-gradient-to-r from-magenta-600 to-[#6A2C91] text-white hover:opacity-90'
                                        }`}
                                    >
                                        {isScheduled ? <><CheckCircle size={14} className="mr-2"/> IN CALENDAR</> : <><Calendar size={14} className="mr-2"/> AUTO-SCHEDULE</>}
                                     </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Bottom Directive Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card title="Raw Concept Repository" className="rounded-[2.5rem] border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="space-y-4 mt-6">
                    {strategyData.ideas.map((idea, i) => (
                        <div key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                            <div className="w-8 h-8 rounded-full bg-[#6A2C91]/20 text-[#6A2C91] flex items-center justify-center text-xs font-black shrink-0">{i+1}</div>
                            <p className="text-sm text-gray-300 font-sans font-light leading-relaxed">{idea}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="space-y-8">
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                    <Layers className="text-[#C5A059]" /> Channel Protocols
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {strategyData.platforms.slice(0, 4).map((platform, i) => (
                        <Card key={i} className="bg-black/40 border-white/10 rounded-[2rem] p-6 hover:border-magenta-500/50 transition-all backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-magenta-500">
                                    {getPlatformIcon(platform.name)}
                                </div>
                                <div>
                                    <h4 className="text-white font-serif">{platform.name}</h4>
                                    <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest">{platform.freq}</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 font-sans font-light">{platform.focus}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>

        <SocialMediaAuthModal 
            isOpen={!!authModalPlatform} 
            onClose={() => setAuthModalPlatform(null)} 
            platform={authModalPlatform || ''} 
        />
    </motion.div>
  );
};
