import React from 'react';
import { Button, VaultBanner, HubCard } from '../UI';
import { Sparkles, Calendar, Video, PenTool, Share2, Layers, Image, User, Eye, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';

const MarketingGrid = () => {
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <HubCard 
                title="Visual Analysis" 
                icon={Eye} 
                color="text-emerald-600" 
                desc="Audit product photos and artisanal assets with AI Visual Analysis." 
                onClick={() => navigate('/marketing/analysis')}
            />
            <HubCard 
                title="Marketing Creator" 
                icon={Image} 
                color="text-amber-500" 
                desc="Synthesize 1K/2K/4K marketing assets with AI Image Synthesis." 
                onClick={() => navigate('/marketing/creator')}
            />
            <HubCard 
                title="Marketing Strategy" 
                icon={Layers} 
                color="text-[#C5A059]" 
                desc="Generate comprehensive strategies based on business pulse." 
                onClick={() => navigate('/marketing/strategy-report')}
            />
            <HubCard 
                title="Content Calendar" 
                icon={Calendar} 
                color="text-purple-600" 
                desc="Schedule and manage your posts." 
                onClick={() => navigate('/marketing/calendar')}
            />
            <HubCard 
                title="Social Media Creator" 
                icon={Share2} 
                color="text-blue-500" 
                desc="Generate platform-optimized content with AI." 
                onClick={() => navigate('/marketing/social')}
            />
            <HubCard 
                title="Video Creator" 
                icon={Video} 
                color="text-red-500" 
                desc="Create scripts and professional videos with AI Video." 
                onClick={() => navigate('/marketing/video')}
            />
            <HubCard 
                title="Blog Generator" 
                icon={PenTool} 
                color="text-emerald-500" 
                desc="Create SEO-optimized blog posts." 
                onClick={() => navigate('/marketing/blog')}
            />
            <HubCard 
                title="AI Avatar Studio" 
                icon={User} 
                color="text-purple-800" 
                desc="Create and manage AI avatars for video content." 
                onClick={() => navigate('/marketing/avatar')}
            />
            <HubCard 
                title="Advanced Synthesis" 
                icon={Zap} 
                color="text-indigo-600" 
                desc="Deep cognitive multi-platform campaign generation." 
                onClick={() => navigate('/marketing/advanced')}
            />
            <HubCard 
                title="Content Approvals" 
                icon={CheckCircle} 
                color="text-rose-600" 
                desc="Review and approve marketing content before it goes live." 
                onClick={() => navigate('/marketing/approvals')}
            />
        </div>
    );
};

export const MarketingHub = () => {
    const navigate = useNavigate();
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-10 lg:space-y-12 max-w-7xl mx-auto pb-8 sm:pb-12 lg:pb-20"
        >
            <div className="flex flex-col gap-3 sm:gap-6">
                <SubPageHeader 
                  title="Marketing Hub"
                  parentTitle="Dashboard"
                  onBack={() => navigate('/command-center')}
                  description="Central nervous system for brand growth and content synchronization."
                />
                
                <VaultBanner 
                  title="Marketing Hub"
                  subtitle="Central nervous system for brand growth and content synchronization. Synchronizing brand craftsmanship with automated growth nodes."
                  badge="Marketing Protocol Active"
                >
                  <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-center justify-center gap-3 w-auto">
                    <Button 
                        variant="primary"
                        className="bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-medium text-[11px] tracking-[0.2em] py-3 px-6 rounded-full shadow-2xl shadow-[#6A2C91]/20 transition-all"
                        onClick={() => navigate('/marketing/strategy-report')}
                    >
                        <Sparkles size={16} className="mr-3"/> GENERATE STRATEGY
                    </Button>
                  </div>
                </VaultBanner>
            </div>
            <MarketingGrid />
        </motion.div>
    );
};