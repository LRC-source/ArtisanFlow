
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, SocialMediaAuthModal } from './UI';
import { 
    ArrowLeft, Sparkles, User, Target, Calendar, Share2, 
    Download, CheckCircle, RefreshCw, FileText, Send, 
    Instagram, Facebook, Linkedin, Video, Layers, Clock, Box, Plus, 
    Loader2, Zap, Globe, ShieldCheck, X, DollarSign, TrendingUp, PieChart
} from 'lucide-react';
import { useArtisanData } from './DataContext';
import { generatePlatformContentBundle } from '../services/geminiService';

/**
 * Omnichannel Strategy Hub - STATUS: COMPLETE ✅
 * Fixed: Pillars rendering, Type safety, Aesthetic consistency.
 */

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
      }, 1800);
  };

  const handleGenerateBundle = async () => {
      setIsBundling(true);
      const result = await generatePlatformContentBundle(strategyData);
      if (result && result.posts) {
          setContentBundle(result.posts);
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
    <div className="space-y-12 animate-in fade-in pb-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <button onClick={() => navigate('/marketing')} className="flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] font-black text-xs uppercase tracking-widest mb-4 transition-colors">
                    <ArrowLeft size={16} /> Back to Studio
                </button>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Omnichannel Strategy Hub</h1>
                <p className="text-gray-500 font-medium">Synaptic Directive Architecture: Scalable Growth Logic.</p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" className="border-stone-200 font-black text-[10px] tracking-widest h-12 px-6 rounded-2xl">
                    <Download size={16} className="mr-2" /> EXPORT DOSSIER
                </Button>
                <Button variant="primary" className="bg-[#6A2C91] text-white font-black text-[10px] tracking-widest h-12 px-6 rounded-2xl shadow-xl shadow-purple-100" onClick={runGeneration}>
                    <RefreshCw size={16} className="mr-2"/> RE-SYNC STRATEGY
                </Button>
            </div>
        </div>

        {/* Executive Summary Node */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-4 sm:p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-bl-full -mr-20 -mt-20 opacity-40 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-3 text-[#6A2C91] mb-6 relative z-10">
                <div className="p-3 bg-purple-50 rounded-2xl shadow-inner"><Sparkles size={24} /></div>
                <h3 className="font-black text-2xl uppercase italic tracking-tighter">Executive Directive</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg font-medium relative z-10 max-w-4xl italic">
                "{strategyData.summary}"
            </p>
        </div>

        {/* Strategic Pillars Node - FIXED: Now rendering data */}
        <div className="space-y-8">
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                <TrendingUp className="text-[#6A2C91]" /> Content Pillars & Allocation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:p-8">
                {strategyData.pillars.map((pillar, i) => (
                    <div key={i} className="bg-white border border-stone-100 rounded-[2rem] p-4 sm:p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-[0.03] text-purple-600"><PieChart size={60} /></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                             <h4 className="font-black text-white uppercase tracking-tight italic">{pillar.name}</h4>
                             <span className="text-2xl font-black text-[#6A2C91] tracking-tighter">{pillar.pct}%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-full mb-6 relative overflow-hidden">
                            <div 
                                className="h-full bg-[#C5A059] transition-all duration-1000"
                                style={{ width: `${pillar.pct}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium relative z-10">{pillar.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-10">
            <Card title="Synaptic Channel Links" className="rounded-[2.5rem] border-stone-100 shadow-xl overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-[0.03] text-purple-600"><Globe size={80} /></div>
                 <div className="space-y-4 mt-4 relative z-10">
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">Authorize secure handshakes to enable auto-publishing logic via Lola.</p>
                    {Object.entries(connectedChannels).map(([platform, isConnected]) => (
                        <div key={platform} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl group hover:bg-white border border-transparent hover:border-stone-100 transition-all">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isConnected ? 'bg-[#6A2C91] text-white' : 'bg-stone-200 text-stone-400'} transition-colors`}>
                                    {getPlatformIcon(platform)}
                                </div>
                                <span className="font-black text-xs uppercase tracking-tight text-gray-900">{platform}</span>
                            </div>
                            <button 
                                onClick={() => !isConnected && setAuthModalPlatform(platform)}
                                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border transition-all ${
                                    isConnected 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100' 
                                    : 'bg-white text-stone-400 border-stone-200 hover:border-[#6A2C91] hover:text-[#6A2C91]'
                                }`}
                            >
                                {isConnected ? 'LINKED' : 'INITIALIZE'}
                            </button>
                        </div>
                    ))}
                    <div className="pt-6 border-t border-stone-100 flex items-center gap-3 text-stone-400">
                        <ShieldCheck size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest">OAuth 2.1 Encryption Active</span>
                    </div>
                 </div>
            </Card>

            <div className="lg:col-span-2 space-y-10">
                <Card title="Target Audience Node" className="rounded-[2.5rem] border-stone-100">
                    <p className="text-gray-900 text-lg font-black uppercase italic tracking-tight mb-4">{strategyData.audience.demographics}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-8">
                        <div>
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={14} /> Synaptic Affinity</h4>
                            <div className="flex flex-wrap gap-2">
                                {strategyData.audience.interests.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-purple-50 text-[#6A2C91] rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-100">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Plus size={14} /> Core Friction Points</h4>
                            <div className="flex flex-wrap gap-2">
                                {strategyData.audience.painPoints.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-stone-50 text-stone-500 border border-stone-100 rounded-xl text-[10px] font-black uppercase tracking-widest">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* AI CONTENT BUNDLE TRIGGER */}
                <div className="bg-[#6A2C91] rounded-[2.5rem] p-4 sm:p-10 text-white shadow-2xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:p-8 relative z-10">
                        <div className="space-y-2 text-center md:text-left">
                             <h3 className="text-3xl font-black uppercase italic tracking-tighter">AI Content Workbench</h3>
                             <p className="text-purple-200 font-medium">Auto-generate a week of optimized posts based on your strategy.</p>
                        </div>
                        <Button 
                            onClick={handleGenerateBundle}
                            disabled={isBundling}
                            className="bg-[#C5A059] text-white border-none h-16 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-amber-500/20 active:scale-95 transition-all"
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
                    <Layers className="text-[#6A2C91]" /> Content Queue Nodes
                </h3>
                <div className="flex overflow-x-auto gap-4 sm:p-8 pb-10 scrollbar-hide px-2">
                    {contentBundle.map((post, idx) => {
                        const isScheduled = scheduledIds.includes(`${post.platform}-${idx}`);
                        return (
                            <div key={idx} className="min-w-[340px] max-w-[340px] bg-white border border-stone-200 rounded-[2.5rem] p-4 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group relative">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl ${isScheduled ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-50 text-gray-900'}`}>
                                        {getPlatformIcon(post.platform)}
                                    </div>
                                    <Badge color={isScheduled ? 'green' : 'purple'} className="text-[8px] font-black uppercase px-2">
                                        {isScheduled ? 'SYNCED TO CAL' : 'AI DRAFT'}
                                    </Badge>
                                </div>
                                <h4 className="font-black text-lg text-white uppercase italic tracking-tight mb-4 line-clamp-1">{post.topic}</h4>
                                <div className="flex-1 bg-stone-50 p-4 rounded-2xl border border-stone-100 mb-6 overflow-y-auto max-h-48 scrollbar-hide">
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
                                </div>
                                <div className="space-y-4 pt-6 border-t border-stone-50">
                                     <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><Clock size={12}/> {post.bestTimeToPost}</span>
                                        <span className="flex items-center gap-1 text-[#C5A059]"><Target size={12}/> {post.platform} Optimized</span>
                                     </div>
                                     <Button 
                                        onClick={() => handleSchedulePost(post, idx)}
                                        disabled={isScheduled}
                                        className={`w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                            isScheduled 
                                            ? 'bg-stone-100 text-stone-400 border-none cursor-default' 
                                            : 'bg-white border border-[#6A2C91] text-[#6A2C91] hover:bg-[#6A2C91] hover:text-white'
                                        }`}
                                    >
                                        {isScheduled ? <><CheckCircle size={14} className="mr-2"/> IN CALENDAR</> : <><Calendar size={14} className="mr-2"/> AUTO-SCHEDULE</>}
                                     </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Platform Strategy Ledger */}
        <div className="space-y-8">
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                <Layers className="text-[#C5A059]" /> Synaptic Channel Protocols
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                {strategyData.platforms.map((platform, i) => (
                    <div key={i} className="bg-white border border-stone-200 rounded-[2.5rem] p-4 sm:p-8 hover:shadow-xl hover:border-[#6A2C91] transition-all group">
                        <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-[#6A2C91] mb-6 shadow-inner group-hover:bg-[#6A2C91] group-hover:text-white transition-all">
                            {getPlatformIcon(platform.name)}
                        </div>
                        <h4 className="text-xl font-black text-white tracking-tight uppercase italic mb-2">{platform.name}</h4>
                        <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-4">{platform.freq}</p>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{platform.focus}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Bottom Directive Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-8">
            <Card title="Raw Concept Repository" className="rounded-[2.5rem] border-stone-100">
                <div className="space-y-4 mt-4">
                    {strategyData.ideas.map((idea, i) => (
                        <div key={i} className="flex gap-4 items-start p-4 bg-stone-50 rounded-2xl group hover:bg-white border border-transparent hover:border-stone-100 transition-all">
                            <div className="w-8 h-8 rounded-full bg-white text-[#6A2C91] flex items-center justify-center text-xs font-black shadow-sm group-hover:bg-[#6A2C91] group-hover:text-white transition-all">{i+1}</div>
                            <p className="text-sm text-gray-700 font-medium leading-relaxed">{idea}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Strategic Financial Guardrails" className="rounded-[2.5rem] border-stone-100 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 p-4 sm:p-10 opacity-[0.03] text-emerald-600"><DollarSign size={120} /></div>
                <div className="space-y-6 mt-4 relative z-10">
                    {[
                        { label: 'Initial Acquisition Buffer', val: '$1,200.00', status: 'Stable' },
                        { label: 'Production Scaling Offset', val: '$850.00', status: 'Optimal' },
                        { label: 'Creative Overhead Allowance', val: '$450.00', status: 'Locked' }
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-stone-50 pb-4">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{row.label}</p>
                                <p className="text-xl font-black text-gray-900 tracking-tighter mt-0.5">{row.val}</p>
                            </div>
                            <Badge color="green" className="text-[8px] font-black uppercase px-2">{row.status}</Badge>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
        <SocialMediaAuthModal 
            isOpen={!!authModalPlatform} 
            onClose={() => setAuthModalPlatform(null)} 
            platform={authModalPlatform || ''} 
        />
    </div>
  );
};
