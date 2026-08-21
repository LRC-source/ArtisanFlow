import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Select, FileUploader, Modal, Badge, VaultBanner, SocialMediaAuthModal, HubCard } from '../UI';
import { Sparkles, Calendar, Video, PenTool, Mic, Share2, Layers, CheckSquare, ArrowLeft, Upload, Clock, Image, FileAudio, Youtube, Instagram, Facebook, Linkedin, Twitter, CheckCircle, Trash2, Key, ChevronDown, ChevronUp, Download, Globe, FileText, Loader2, User, Play, MessageSquare, X, Plus, ThumbsUp, ThumbsDown, RefreshCw, Volume2, Headphones, Film, Scissors, Monitor, Camera, Eye, Bot, Zap, Save, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanData, MarketingPost } from '../DataContext';
import { generateLolaImage, analyzeLolaImage, chatWithLola } from '../../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { SubPageHeader } from '../SubPageHeader';
import { toast } from 'sonner';
import { useFeatureGate } from '../../hooks/useFeatureGate';
import { ContextualTutorialModal } from '../ContextualTutorialModal';

const MarketingGrid = () => {
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <HubCard 
                title="Visual Analysis" 
                icon={Eye} 
                color="gold" 
                desc="Audit product photos and artisanal assets with Gemini Pro Vision." 
                onClick={() => navigate('/marketing/analysis')}
            />
            <HubCard 
                title="Marketing Creator" 
                icon={Image} 
                color="purple" 
                desc="Synthesize 1K/2K/4K marketing assets with Nano Banana Pro." 
                onClick={() => navigate('/marketing/creator')}
            />
            <HubCard 
                title="Marketing Strategy" 
                icon={Layers} 
                color="purple" 
                desc="Generate comprehensive strategies based on business pulse." 
                onClick={() => navigate('/marketing/strategy-report')}
            />
            <HubCard 
                title="Brand Voice Profile" 
                icon={Volume2} 
                color="gold" 
                desc="Define your brand adjectives and restricted vocabulary." 
                onClick={() => navigate('/marketing/brand-voice')}
            />
            <HubCard 
                title="Content Calendar" 
                icon={Calendar} 
                color="cyan" 
                desc="Schedule and manage your posts." 
                onClick={() => navigate('/marketing/calendar')}
            />
            <HubCard 
                title="Social Media Creator" 
                icon={Share2} 
                color="cyan" 
                desc="Generate platform-optimized content with AI." 
                onClick={() => navigate('/marketing/social')}
            />
            <HubCard 
                title="Video Creator" 
                icon={Video} 
                color="magenta" 
                desc="Create scripts and professional videos with Veo." 
                onClick={() => navigate('/marketing/video')}
            />
            <HubCard 
                title="Blog Generator" 
                icon={PenTool} 
                color="cyan" 
                desc="Create SEO-optimized blog posts." 
                onClick={() => navigate('/marketing/blog')}
            />
            <HubCard 
                title="AI Avatar Studio" 
                icon={User} 
                color="purple" 
                desc="Create and manage AI avatars for video content." 
                onClick={() => navigate('/marketing/avatar')}
            />
            <HubCard 
                title="Advanced Synthesis" 
                icon={Zap} 
                color="emerald" 
                desc="Deep cognitive multi-platform campaign generation." 
                onClick={() => navigate('/marketing/advanced')}
            />
            <HubCard 
                title="Content Approvals" 
                icon={CheckCircle} 
                color="gold" 
                desc="Governance node for marketing deployment." 
                onClick={() => navigate('/marketing/approvals')}
            />
            <HubCard 
                title="Receptionist Logic" 
                icon={MessageSquare} 
                color="magenta" 
                desc="Automated qualification protocols for leads." 
                onClick={() => navigate('/marketing/receptionist')}
            />
        </div>
    );
};

// --- VISUAL ANALYSIS NODE ---

const SocialMediaIntegrationManager = () => {
    const { connectedChannels } = useArtisanData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activePlatform, setActivePlatform] = useState('');

    const platforms = [
        { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', status: connectedChannels?.instagram ? 'Connected | Token Valid' : 'Connect Account', connected: connectedChannels?.instagram },
        { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500', status: connectedChannels?.facebook ? 'Connected | Auto-Publish Active' : 'Connect Account', connected: connectedChannels?.facebook },
        { id: 'tiktok', name: 'TikTok', icon: Film, color: 'text-white', status: connectedChannels?.tiktok ? 'Connected | OAuth Active' : 'Connect Account', connected: connectedChannels?.tiktok },
        { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-400', status: connectedChannels?.linkedin ? 'Connected' : 'Connect Account', connected: connectedChannels?.linkedin },
        { id: 'pinterest', name: 'Pinterest', icon: Image, color: 'text-red-500', status: connectedChannels?.pinterest ? 'Connected' : 'Connect Account', connected: connectedChannels?.pinterest },
        { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600', status: connectedChannels?.youtube ? 'Connected' : 'Connect Account', connected: connectedChannels?.youtube },
        { id: 'twitter', name: 'X / Twitter', icon: Twitter, color: 'text-white', status: connectedChannels?.twitter ? 'Connected' : 'Connect Account', connected: connectedChannels?.twitter },
    ];

    const handleConnect = (platformId: string) => {
        setActivePlatform(platformId);
        setIsModalOpen(true);
    };

    return (
        <div className="mb-12 animate-in fade-in slide-up duration-700">
            <VaultBanner 
                title="Connected Channels & Auto-Publishing Center" 
                subtitle="Synchronize your brand across the digital ecosystem. Manage APIs and automated publishing pipelines."
                badge="Integration Protocol Active"
            >
                <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-center justify-center gap-3 w-auto overflow-x-auto pb-4 scrollbar-hide">
                    {platforms.map((platform) => (
                        <div 
                            key={platform.id}
                            onClick={() => !platform.connected && handleConnect(platform.name)}
                            className={`flex-shrink-0 w-full sm:w-64 p-5 rounded-3xl border flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer transition-all duration-300 ${platform.connected ? 'bg-white/5 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className={`p-3 rounded-2xl bg-white/5 ${platform.color}`}>
                                    <platform.icon size={20} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-sm sm:text-base text-white font-serif tracking-tight">{platform.name}</p>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${platform.connected ? 'text-emerald-400' : 'text-white/30'}`}>{platform.status}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </VaultBanner>
            {activePlatform && <SocialMediaAuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} platform={activePlatform} />}
        </div>
    );
};

export const MarketingStudio = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto px-4 py-6 space-y-6 sm:space-y-10 lg:space-y-12 pb-8 sm:pb-12 lg:pb-20 overflow-visible"
        >
            <ContextualTutorialModal
                hubId="marketing_studio"
                title="Marketing Studio"
                description="Central command for all your marketing and branding efforts."
                steps={["Access Visual Analysis to audit assets.","Use Marketing Creator for quick designs.","Generate your Brand Voice Profile."]}
            />
            <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">Marketing Studio</h1>
                    <p className="text-sm sm:text-base text-white sm:text-white/60 font-sans font-light leading-relaxed max-w-xl leading-relaxed">AI-powered content creation and marketing protocols.</p>
                </div>
            </div>
            
            <SocialMediaIntegrationManager />
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white mb-4">Studio Nodes</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-8"></div>
                </div>
                <MarketingGrid />
            </div>
        </motion.div>
    );
};

// --- MARKETING HUB SUBPAGE ---

