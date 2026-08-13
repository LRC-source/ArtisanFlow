import React from 'react';
import { Camera, Type, Share2, Video, Sparkles, ArrowLeft } from 'lucide-react';
import { VaultBanner, Button } from './UI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const MarketingStudio = () => {
  const navigate = useNavigate();
  return (
    <div className="p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col gap-8">
        <button onClick={() => navigate('/command-center')} className="flex items-center gap-3 text-gray-400 hover:text-[#1A1A1A] font-sans font-medium text-[11px] uppercase tracking-[0.3em] transition-all group w-fit">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Command Center
        </button>
        
        <VaultBanner 
          title="Marketing Studio"
          subtitle="AI-powered content creation tools. Synchronize your brand voice with automated growth nodes."
          badge="Creative Engine Online"
        >
          <div className="flex gap-4">
            <Button onClick={() => toast.info('Initializing Strategy Node...')} className="bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 rounded-full shadow-2xl shadow-[#6A2C91]/20 transition-all">
                <Sparkles size={16} className="mr-3"/> GENERATE STRATEGY
            </Button>
          </div>
        </VaultBanner>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-amber-500" size={20} />
                <h3 className="font-bold text-white">Campaign Generator</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">Generate comprehensive strategies based on inventory levels.</p>
            <button onClick={() => toast.info('Initializing Strategy Node...')} className="w-full py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition-colors shadow-sm">Generate Strategy</button>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
                <Type className="text-purple-600" size={20} />
                <h3 className="font-bold text-white">Copywriter</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">Create blog posts, emails, and social captions.</p>
            <button onClick={() => toast.info('Opening Email Editor...')} className="w-full py-2 border border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-700 rounded transition-colors">Open Editor</button>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
                <Camera className="text-blue-500" size={20} />
                <h3 className="font-bold text-white">Visual Studio</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">AI image generation for product showcases.</p>
            <button onClick={() => toast.info('Spinning up Image Generation Node...')} className="w-full py-2 border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 rounded transition-colors">Create Images</button>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
                <Video className="text-red-500" size={20} />
                <h3 className="font-bold text-white">Video Scripts</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">Generate scripts for TikTok and Reels.</p>
            <button onClick={() => toast.info('Script Generation AI Activating...')} className="w-full py-2 border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 rounded transition-colors">Write Script</button>
        </div>
    </div>
  </div>
  );
};
