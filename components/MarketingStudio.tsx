import React from 'react';
import { Camera, Type, Share2, Video, Sparkles, ArrowLeft } from 'lucide-react';
import { VaultBanner, Button } from './UI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { GlassHaloIcon } from './ui/GlassHaloIcon';

export const MarketingStudio = () => {
  const navigate = useNavigate();
  return (
    <div className="p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col gap-8">
        <button onClick={() => navigate('/command-center')} className="flex items-center gap-3 text-white/40 hover:text-white font-sans font-medium text-[11px] uppercase tracking-[0.3em] transition-all group w-fit">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Command Center
        </button>
        
        <VaultBanner 
          title="Marketing Studio"
          subtitle="AI-powered content creation tools. Synchronize your brand voice with automated growth nodes."
          badge="Creative Engine Online"
        >
          <div className="flex gap-4">
            <Button onClick={() => toast.info('Initializing Strategy Node...')} className="bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] text-white font-sans font-bold text-[11px] tracking-[0.3em] h-16 px-10 rounded-[2rem] shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all uppercase border-none hover:scale-105">
                <Sparkles size={16} className="mr-3"/> GENERATE STRATEGY
            </Button>
          </div>
        </VaultBanner>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden group hover:border-[#C5A059]/50 hover:bg-[#C5A059]/5 hover:shadow-[0_0_40px_rgba(197,160,89,0.15)] transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                <Sparkles size={120} className="text-[#C5A059]" />
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <GlassHaloIcon icon={Sparkles} color="gold" size="xl" className="group-hover:scale-110 transition-all duration-500" />
                <h3 className="font-serif text-2xl text-white tracking-tight">Campaign Generator</h3>
            </div>
            <p className="text-white/40 font-sans font-light mb-8 relative z-10">Generate comprehensive strategies based on inventory levels.</p>
            <button onClick={() => toast.info('Initializing Strategy Node...')} className="w-full py-4 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] font-sans font-bold text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] transition-all border border-[#C5A059]/30 relative z-10">Generate Strategy</button>
        </div>

        <div className="luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden group hover:border-[#06B6D4]/50 hover:bg-[#06B6D4]/5 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                <Type size={120} className="text-[#06B6D4]" />
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <GlassHaloIcon icon={Type} color="cyan" size="xl" className="group-hover:scale-110 transition-all duration-500" />
                <h3 className="font-serif text-2xl text-white tracking-tight">Copywriter</h3>
            </div>
            <p className="text-white/40 font-sans font-light mb-8 relative z-10">Create blog posts, emails, and social captions.</p>
            <button onClick={() => toast.info('Opening Email Editor...')} className="w-full py-4 bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 text-[#06B6D4] font-sans font-bold text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] transition-all border border-[#06B6D4]/30 relative z-10">Open Editor</button>
        </div>

        <div className="luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden group hover:border-[#D946EF]/50 hover:bg-[#D946EF]/5 hover:shadow-[0_0_40px_rgba(217,70,239,0.15)] transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                <Camera size={120} className="text-[#D946EF]" />
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <GlassHaloIcon icon={Camera} color="magenta" size="xl" className="group-hover:scale-110 transition-all duration-500" />
                <h3 className="font-serif text-2xl text-white tracking-tight">Visual Studio</h3>
            </div>
            <p className="text-white/40 font-sans font-light mb-8 relative z-10">AI image generation for product showcases.</p>
            <button onClick={() => toast.info('Spinning up Image Generation Node...')} className="w-full py-4 bg-[#D946EF]/10 hover:bg-[#D946EF]/20 text-[#D946EF] font-sans font-bold text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] transition-all border border-[#D946EF]/30 relative z-10">Create Images</button>
        </div>

        <div className="luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden group hover:border-[#A855F7]/50 hover:bg-[#A855F7]/5 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                <Video size={120} className="text-[#A855F7]" />
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <GlassHaloIcon icon={Video} color="purple" size="xl" className="group-hover:scale-110 transition-all duration-500" />
                <h3 className="font-serif text-2xl text-white tracking-tight">Video Scripts</h3>
            </div>
            <p className="text-white/40 font-sans font-light mb-8 relative z-10">Generate scripts for TikTok and Reels.</p>
            <button onClick={() => toast.info('Script Generation AI Activating...')} className="w-full py-4 bg-[#A855F7]/10 hover:bg-[#A855F7]/20 text-[#A855F7] font-sans font-bold text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] transition-all border border-[#A855F7]/30 relative z-10">Write Script</button>
        </div>
    </div>
  </div>
  );
};
