
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Select, FileUploader, Modal, Badge, VaultBanner, SocialMediaAuthModal } from './UI';
import { Sparkles, Calendar, Video, PenTool, Mic, Share2, Layers, CheckSquare, ArrowLeft, Upload, Clock, Image, FileAudio, Youtube, Instagram, Facebook, Linkedin, Twitter, CheckCircle, Trash2, Key, ChevronDown, ChevronUp, Download, Globe, FileText, Loader2, User, Play, MessageSquare, X, Plus, ThumbsUp, ThumbsDown, RefreshCw, Volume2, Headphones, Film, Scissors, Monitor, Camera, Eye, Bot, Zap, Save, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanData, MarketingPost } from './DataContext';
import { generateLolaImage, analyzeLolaImage, chatWithLola } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { SubPageHeader } from './SubPageHeader';
import { toast } from 'sonner';


// --- REUSABLE MARKETING GRID ---
const MarketingGrid = () => {
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <HubCard 
                title="Visual Analysis" 
                icon={Eye} 
                color="text-emerald-600" 
                desc="Audit product photos and artisanal assets with Gemini Pro Vision." 
                onClick={() => navigate('/marketing/analysis')}
            />
            <HubCard 
                title="Marketing Creator" 
                icon={Image} 
                color="text-amber-500" 
                desc="Synthesize 1K/2K/4K marketing assets with Nano Banana Pro." 
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
                title="Brand Voice Profile" 
                icon={Volume2} 
                color="text-indigo-600" 
                desc="Define your brand adjectives and restricted vocabulary." 
                onClick={() => navigate('/marketing/brand-voice')}
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
                desc="Create scripts and professional videos with Veo." 
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
                desc="Governance node for marketing deployment." 
                onClick={() => navigate('/marketing/approvals')}
            />
            <HubCard 
                title="Receptionist Logic" 
                icon={MessageSquare} 
                color="text-blue-600" 
                desc="Automated qualification protocols for leads." 
                onClick={() => navigate('/marketing/receptionist')}
            />
        </div>
    );
};

// --- VISUAL ANALYSIS NODE ---
export const VisualAnalysisNode = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [prompt, setPrompt] = useState('Analyze this artisanal product for brand alignment and visual quality.');

    const handleFileChange = (files: File[]) => {
        if (files[0]) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(files[0]);
        }
    };

    const runAnalysis = async () => {
        if (!preview) return;
        setIsAnalyzing(true);
        const toastId = toast.loading("Initializing visual audit node...");
        try {
            const result = await analyzeLolaImage(preview, prompt);
            setAnalysis(result);
            toast.success("Visual audit complete.", { id: toastId });
        } catch (error) {
            console.error("Analysis failed", error);
            setAnalysis("Error: Synthesis node offline. Verify vault authorization.");
            toast.error("Audit failed: Synthesis node offline.", { id: toastId });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 space-y-16 pb-32 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Visual Analyst"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Audit artisanal assets with Gemini 3 Pro Vision"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card title="Source Asset Ingestion" className="luxury-card border-transparent rounded-[2.5rem] p-10 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-10">
                        <FileUploader onUpload={handleFileChange} acceptedFormats=".jpg, .jpeg, .png" label="Drop product photo for audit" />
                        {preview && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-10"
                            >
                                <div className="aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-xl shadow-black/5">
                                    <img src={preview} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] ml-1">Analysis Focus</label>
                                    <textarea 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-base font-sans font-light focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 h-40 resize-none transition-all duration-500 shadow-sm outline-none text-white"
                                        value={prompt}
                                        onChange={e => setPrompt(e.target.value)}
                                        placeholder="Define the parameters for the visual audit..."
                                    />
                                </div>
                                <Button onClick={runAnalysis} disabled={isAnalyzing} className="w-full bg-[#C5A059] hover:bg-[#b08d4f] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/10 transition-all duration-500">
                                    {isAnalyzing ? <Loader2 className="animate-spin" /> : 'INITIALIZE VISUAL AUDIT'}
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </Card>

                <Card title="Synaptic Analysis Report" className="luxury-card border-transparent rounded-[2.5rem] p-10 bg-black/20 backdrop-blur-xl">
                    {analysis ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="prose prose-invert max-w-none"
                        >
                            <div className="bg-black/40 p-8 rounded-3xl border border-white/10 shadow-sm">
                                <p className="text-gray-300 leading-relaxed font-sans font-light text-lg whitespace-pre-wrap">
                                    {analysis}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-40 opacity-20 text-center">
                            <Eye size={80} strokeWidth={0.8} className="text-white mb-8" />
                            <p className="text-[12px] font-sans font-medium text-gray-500 uppercase tracking-[0.4em]">Awaiting Input Mesh</p>
                        </div>
                    )}
                </Card>
            </div>
        </motion.div>
    );
};

// --- MAIN MARKETING STUDIO HUB ---
export const MarketingStudio = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 space-y-12 pb-20 max-w-7xl mx-auto"
        >
            <div>
                <h1 className="text-5xl font-serif text-white tracking-tight mb-3">Marketing Studio</h1>
                <p className="text-gray-400 font-sans font-light text-lg max-w-xl leading-relaxed">AI-powered content creation and marketing protocols.</p>
            </div>
            <MarketingGrid />
        </motion.div>
    );
};

// --- MARKETING HUB SUBPAGE ---
export const MarketingHub = () => {
    const navigate = useNavigate();
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <div className="flex flex-col gap-8">
                <SubPageHeader 
                  title="Marketing Hub"
                  parentTitle="Marketing Studio"
                  onBack={() => navigate('/marketing')}
                  description="Central nervous system for brand growth and content synchronization."
                />
                
                <VaultBanner 
                  title="Marketing Hub"
                  subtitle="Central nervous system for brand growth and content synchronization. Synchronizing brand craftsmanship with automated growth nodes."
                  badge="Marketing Protocol Active"
                >
                  <div className="flex gap-4">
                    <Button 
                        variant="primary"
                        className="bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 rounded-full shadow-2xl shadow-[#6A2C91]/20 transition-all"
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

const HubCard = ({ title, icon: Icon, color, desc, onClick }: any) => (
    <div onClick={onClick} className="luxury-card bg-black/40 backdrop-blur-xl p-12 rounded-[3rem] cursor-pointer group hover:-translate-y-2 transition-all duration-700 flex flex-col h-full relative overflow-hidden border border-white/10 shadow-2xl shadow-black/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 opacity-[0.03] rounded-bl-full -mr-12 -mt-12 group-hover:opacity-10 transition-opacity duration-700"></div>
        <div className="flex items-center gap-6 mb-10 relative z-10">
            <div className={`w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 group-hover:shadow-xl group-hover:shadow-black/5 transition-all duration-700 shadow-sm border border-white/5 ${color}`}>
                <Icon size={32} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-serif text-white tracking-tight leading-none">{title}</h3>
        </div>
        <p className="text-base text-gray-400 font-sans font-light leading-relaxed mb-10 relative z-10 flex-grow">{desc}</p>
        <div className="flex justify-end relative z-10 mt-auto">
            <button className="text-[11px] font-sans font-medium uppercase tracking-[0.3em] text-gray-500 group-hover:text-[#C5A059] transition-all duration-500 flex items-center gap-3">
                Initialize Module <ArrowLeft size={16} className="rotate-180 transition-transform duration-500 group-hover:translate-x-1" />
            </button>
        </div>
    </div>
);

// Fix: Add missing BlogGenerator component
export const BlogGenerator = () => {
    const navigate = useNavigate();
    const { addMarketingPost } = useArtisanData();
    const [isGenerating, setIsGenerating] = useState(false);
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [generatedBlog, setGeneratedBlog] = useState('');

    const handleGenerate = async () => {
        if (!topic) return toast.error("Please enter a topic.");
        setIsGenerating(true);
        const toastId = toast.loading("Synthesizing article nodes...");
        try {
            const prompt = `Write a comprehensive, SEO-optimized blog post about: ${topic}. Include these keywords: ${keywords}. Use a luxurious, artisanal brand voice. Format with markdown headings.`;
            const result = await chatWithLola(prompt, null, 'deep');
            setGeneratedBlog(result.text);
            toast.success("Article synthesis complete.", { id: toastId });
        } catch (error) {
            console.error("Generation failed", error);
            toast.error("Synthesis failed: Node offline.", { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!generatedBlog) return;
        addMarketingPost({
            platform: 'Blog',
            topic: topic || 'Blog Post',
            content: generatedBlog,
            scheduledDate: new Date().toISOString().split('T')[0],
            status: 'Draft',
            type: 'Text'
        });
        toast.success("Article saved to content calendar.");
        navigate('/marketing/calendar');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 space-y-16 pb-32 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Blog Generator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="SEO-optimized content synthesis node"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card title="Article Configuration" className="luxury-card border-transparent rounded-[2.5rem] p-10">
                    <div className="space-y-10 mt-4">
                        <div className="space-y-4">
                            <label className="block text-[11px] font-sans font-medium text-stone-400 uppercase tracking-[0.3em] mb-3 ml-1">Blog Topic / Title</label>
                            <Input 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)} 
                                placeholder="e.g., The Art of Sustainable Sourcing..."
                                className="h-16 rounded-2xl bg-stone-50/50 border-stone-100 focus:bg-white focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 font-sans font-light text-base shadow-sm"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[11px] font-sans font-medium text-stone-400 uppercase tracking-[0.3em] mb-3 ml-1">SEO Keywords (Comma separated)</label>
                            <Input 
                                value={keywords} 
                                onChange={(e) => setKeywords(e.target.value)} 
                                placeholder="e.g., sustainability, artisanal, organic..."
                                className="h-16 rounded-2xl bg-stone-50/50 border-stone-100 focus:bg-white focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 font-sans font-light text-base shadow-sm"
                            />
                        </div>
                        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/10 transition-all duration-500">
                            {isGenerating ? <Loader2 className="animate-spin" /> : 'Generate Article'}
                        </Button>
                    </div>
                </Card>

                <Card title="Generated Content" className="luxury-card border-transparent rounded-[2.5rem] p-10 bg-stone-50/30">
                    {generatedBlog ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-10"
                        >
                            <textarea 
                                value={generatedBlog}
                                onChange={(e) => setGeneratedBlog(e.target.value)}
                                className="w-full bg-white border border-stone-100 rounded-[2rem] p-8 text-base font-sans font-light text-stone-600 h-[32rem] resize-none shadow-sm focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 transition-all duration-500 outline-none leading-relaxed"
                            />
                            <Button onClick={handleSave} className="w-full bg-[#6A2C91] hover:bg-[#552374] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all duration-500">
                                Approve & Schedule
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-40 opacity-20 text-center">
                            <FileText size={80} strokeWidth={0.8} className="text-stone-400 mb-8" />
                            <p className="text-[12px] font-sans font-medium text-stone-500 uppercase tracking-[0.4em]">Awaiting Synthesis</p>
                        </div>
                    )}
                </Card>
            </div>
        </motion.div>
    );
};

// Fix: Add missing VideoCreator component
export const VideoCreator = () => {
    const navigate = useNavigate();
    const { addMarketingPost } = useArtisanData();
    const [isGenerating, setIsGenerating] = useState(false);
    const [topic, setTopic] = useState('');
    const [duration, setDuration] = useState('15 Seconds (Reel/Short)');
    const [generatedScript, setGeneratedScript] = useState('');

    const handleGenerate = async () => {
        if (!topic) return toast.error("Please enter a topic.");
        setIsGenerating(true);
        const toastId = toast.loading("Synthesizing video script...");
        try {
            const prompt = `Write a video script for a ${duration} video about: ${topic}. Include visual cues [Visual: ...] and audio cues [Audio: ...]. Use a luxurious, artisanal brand voice.`;
            const result = await chatWithLola(prompt, null, 'fast');
            setGeneratedScript(result.text);
            toast.success("Script synthesis complete.", { id: toastId });
        } catch (error) {
            console.error("Generation failed", error);
            toast.error("Synthesis failed: Node offline.", { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!generatedScript) return;
        addMarketingPost({
            platform: 'YouTube',
            topic: topic || 'Video Script',
            content: generatedScript,
            scheduledDate: new Date().toISOString().split('T')[0],
            status: 'Draft',
            type: 'Video'
        });
        toast.success("Video script saved to calendar.");
        navigate('/marketing/calendar');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 space-y-16 pb-32 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Video Creator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="AI-powered video script production interface"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card title="Script Configuration" className="luxury-card border-transparent rounded-[2.5rem] p-10 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-10 mt-4">
                        <div className="space-y-4">
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">Target Duration</label>
                            <Select value={duration} onChange={(e) => setDuration(e.target.value)} className="h-16 rounded-2xl bg-white/5 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 font-sans font-light text-base shadow-sm text-white">
                                <option className="bg-black">15 Seconds (Reel/Short)</option>
                                <option className="bg-black">30 Seconds (Commercial)</option>
                                <option className="bg-black">60 Seconds (Deep Dive)</option>
                            </Select>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">Video Topic</label>
                            <textarea 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)} 
                                placeholder="e.g., Behind the scenes of our new manufacturing process..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-base font-sans font-light focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 h-40 resize-none transition-all duration-500 shadow-sm outline-none text-white"
                            />
                        </div>
                        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-[#C5A059] hover:bg-[#b08d4f] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/10 transition-all duration-500">
                            {isGenerating ? <Loader2 className="animate-spin" /> : 'Generate Script'}
                        </Button>
                    </div>
                </Card>

                <Card title="Generated Script" className="luxury-card border-transparent rounded-[2.5rem] p-10 bg-black/20 backdrop-blur-xl">
                    {generatedScript ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-10"
                        >
                            <textarea 
                                value={generatedScript}
                                onChange={(e) => setGeneratedScript(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-8 text-base font-mono font-light text-gray-300 h-[24rem] resize-none shadow-sm focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 transition-all duration-500 outline-none leading-relaxed"
                            />
                            <Button onClick={handleSave} className="w-full bg-[#6A2C91] hover:bg-[#552374] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all duration-500">
                                Approve & Schedule
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-40 opacity-20 text-center">
                            <Film size={80} strokeWidth={0.8} className="text-white mb-8" />
                            <p className="text-[12px] font-sans font-medium text-gray-500 uppercase tracking-[0.4em]">Awaiting Synthesis</p>
                        </div>
                    )}
                </Card>
            </div>
        </motion.div>
    );
};

// Fix: Add missing SocialMediaCreator component
export const SocialMediaCreator = () => {
    const navigate = useNavigate();
    const { addMarketingPost } = useArtisanData();
    const [isGenerating, setIsGenerating] = useState(false);
    const [platform, setPlatform] = useState('Instagram');
    const [topic, setTopic] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return toast.error("Please enter a topic.");
        setIsGenerating(true);
        const toastId = toast.loading("Synthesizing platform content...");
        try {
            const prompt = `Write an engaging ${platform} post about: ${topic}. Use a luxurious, artisanal brand voice. Include relevant hashtags.`;
            const result = await chatWithLola(prompt, null, 'fast');
            setGeneratedContent(result.text);
            toast.success("Content synthesis complete.", { id: toastId });
        } catch (error) {
            console.error("Generation failed", error);
            toast.error("Synthesis failed: Node offline.", { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!generatedContent) return;
        addMarketingPost({
            platform: platform as any,
            topic: topic || 'Social Post',
            content: generatedContent,
            scheduledDate: new Date().toISOString().split('T')[0],
            status: 'Draft',
            type: 'Text'
        });
        toast.success("Social post saved to calendar.");
        navigate('/marketing/calendar');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 space-y-16 pb-32 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Social Media Creator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Platform-optimized content generators"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card title="Post Configuration" className="luxury-card border-transparent rounded-[2.5rem] p-10 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-10 mt-4">
                        <div className="space-y-4">
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">Target Platform</label>
                            <Select value={platform} onChange={(e) => setPlatform(e.target.value)} className="h-16 rounded-2xl bg-white/5 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 font-sans font-light text-base shadow-sm text-white">
                                <option className="bg-black">Instagram</option>
                                <option className="bg-black">LinkedIn</option>
                                <option className="bg-black">Twitter</option>
                                <option className="bg-black">Facebook</option>
                            </Select>
                            <Button 
                                variant="outline" 
                                onClick={() => setShowAuthModal(true)}
                                className="w-full mt-2 h-12 rounded-xl border-white/10 text-white/50 hover:bg-white/5 font-sans text-[10px] tracking-widest uppercase"
                            >
                                <Lock size={14} className="mr-2"/> Authenticate Platform
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">Topic / Objective</label>
                            <textarea 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)} 
                                placeholder="e.g., Announcing our new limited edition summer collection..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-base font-sans font-light focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 h-40 resize-none transition-all duration-500 shadow-sm outline-none text-white"
                            />
                        </div>
                        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-[#C5A059] hover:bg-[#b08d4f] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/10 transition-all duration-500">
                            {isGenerating ? <Loader2 className="animate-spin" /> : 'Generate Content'}
                        </Button>
                    </div>
                </Card>

                <Card title="Generated Output" className="luxury-card border-transparent rounded-[2.5rem] p-10 bg-black/20 backdrop-blur-xl">
                    {generatedContent ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-10"
                        >
                            <textarea 
                                value={generatedContent}
                                onChange={(e) => setGeneratedContent(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-8 text-base font-sans font-light text-gray-300 h-[24rem] resize-none shadow-sm focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 transition-all duration-500 outline-none leading-relaxed"
                            />
                            <Button onClick={handleSave} className="w-full bg-[#6A2C91] hover:bg-[#552374] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all duration-500">
                                Approve & Schedule
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-40 opacity-20 text-center">
                            <Share2 size={80} strokeWidth={0.8} className="text-white mb-8" />
                            <p className="text-[12px] font-sans font-medium text-gray-500 uppercase tracking-[0.4em]">Awaiting Synthesis</p>
                        </div>
                    )}
                </Card>
            </div>
        
            <SocialMediaAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} platform={platform} />
        </motion.div>
    );
};

// --- CONTENT CALENDAR ---
export const ContentCalendar = () => {
    const navigate = useNavigate();
    const { marketingPosts, updateMarketingPost } = useArtisanData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    
    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'Instagram': return <Instagram size={14} />;
            case 'Facebook': return <Facebook size={14} />;
            case 'LinkedIn': return <Linkedin size={14} />;
            case 'Twitter': return <Twitter size={14} />;
            case 'YouTube': return <Youtube size={14} />;
            case 'Blog': return <FileText size={14} />;
            case 'Email': return <Globe size={14} />;
            default: return <Share2 size={14} />;
        }
    };

    const getPostsForDay = (day: number) => {
        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        return marketingPosts.filter(p => p.scheduledDate === dateStr);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Published': return 'green';
            case 'Scheduled': return 'blue';
            case 'Pending Approval': return 'gold';
            case 'Draft': return 'gray';
            default: return 'purple';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 md:p-16 space-y-12 max-w-[1600px] mx-auto pb-32"
        >
            <div className="flex flex-col gap-8">
                <SubPageHeader 
                  title="Content Calendar"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Omnichannel publication schedule and governance."
                />
            </div>

            <Card className="luxury-card border-transparent rounded-[2.5rem] p-10 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-serif text-white tracking-tight">{monthName} {year}</h2>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={prevMonth} className="h-12 w-12 p-0 rounded-full border-white/10 text-white hover:bg-white/5 flex justify-center items-center"><ArrowLeft size={18} /></Button>
                        <Button variant="outline" onClick={nextMonth} className="h-12 w-12 p-0 rounded-full border-white/10 text-white hover:bg-white/5 flex justify-center items-center"><ArrowLeft size={18} className="rotate-180" /></Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-4 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-[10px] font-sans font-medium text-gray-500 uppercase tracking-widest">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`blank-${i}`} className="h-32 rounded-3xl bg-white/5 opacity-30"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayPosts = getPostsForDay(day);
                        return (
                            <div 
                                key={day} 
                                onClick={() => setSelectedDay(day)}
                                className="h-32 rounded-3xl bg-white/5 border border-white/10 hover:border-[#6A2C91] hover:bg-white/10 p-3 transition-all cursor-pointer relative overflow-hidden group flex flex-col"
                            >
                                <span className="text-xs font-sans font-medium text-gray-400 group-hover:text-white transition-colors">{day}</span>
                                <div className="mt-auto space-y-1 overflow-y-auto hidden-scrollbar">
                                    {dayPosts.map((post, idx) => (
                                        <div key={idx} className="bg-black/60 rounded p-1.5 flex items-center gap-1.5 overflow-hidden">
                                            <div className="text-[#6A2C91] shrink-0">{getPlatformIcon(post.platform)}</div>
                                            <span className="text-[9px] text-white truncate font-sans font-medium">{post.topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Modal isOpen={selectedDay !== null} onClose={() => setSelectedDay(null)} title={`Schedule for ${monthName} ${selectedDay}, ${year}`}>
                <div className="space-y-6">
                    {selectedDay && getPostsForDay(selectedDay).length > 0 ? (
                        <div className="space-y-4">
                            {getPostsForDay(selectedDay).map(post => (
                                <div key={post.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-[#6A2C91]">
                                            {getPlatformIcon(post.platform)}
                                        </div>
                                        <div>
                                            <p className="text-white font-sans font-medium text-sm">{post.topic}</p>
                                            <p className="text-gray-500 font-sans text-[10px] uppercase tracking-widest">{post.status}</p>
                                        </div>
                                    </div>
                                    <Badge color={getStatusColor(post.status) as any}>{post.status}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm font-sans text-center py-8">No nodes scheduled for this date.</p>
                    )}
                    <Button onClick={() => navigate('/marketing/creator')} className="w-full bg-[#C5A059] hover:bg-[#b08d4f] text-white h-12 rounded-xl font-sans font-medium text-[10px] uppercase tracking-widest shadow-lg">
                        <Plus size={14} className="mr-2" /> Pre-schedule Strategy
                    </Button>
                </div>
            </Modal>
        </motion.div>
    );
};

// --- AI AVATAR STUDIO ---
export const AIAvatarStudio = () => {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [history, setHistory] = useState<{id: string, url: string}[]>([]);

    const handleGenerate = async () => {
        if (!prompt) return toast.error("Please define your brand persona.");
        
        const aiStudio = (window as any).aistudio;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey && aiStudio) {
            const hasKey = await aiStudio.hasSelectedApiKey();
            if (!hasKey) {
                await aiStudio.openSelectKey();
                return;
            }
        } else if (!apiKey) {
            toast.error("Please add VITE_GEMINI_API_KEY in your .env.local file to initialize the visual synthesis nodes.");
            return;
        }

        setIsGenerating(true);
        const toastId = toast.loading("Synthesizing brand persona...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: 'imagen-3.0-generate-002',
                contents: {
                    parts: [{ text: `High-end, luxury brand avatar: ${prompt}. Cinematic lighting, professional studio photography, elegant and sophisticated aesthetic, high-fidelity details, photorealistic.` }],
                },
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const newUrl = `data:image/png;base64,${part.inlineData.data}`;
                    setGeneratedImage(newUrl);
                    setHistory(prev => [{ id: Date.now().toString(), url: newUrl }, ...prev].slice(0, 4));
                    toast.success("Persona synthesis complete.", { id: toastId });
                    break;
                }
            }
        } catch (error: any) {
            console.error("Avatar generation failed", error);
            if (error.message?.includes('Requested entity was not found.')) {
                if ((window as any).aistudio) (window as any).aistudio.openSelectKey();
                toast.dismiss(toastId);
            } else {
                toast.error("Avatar synthesis failed. Ensure vault authorization is active.", { id: toastId });
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 space-y-16 pb-32 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="AI Avatar Studio"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Synthetic brand persona and character synthesis"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card title="Persona Definition" className="luxury-card border-white/10 rounded-[2.5rem] p-10 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-10 mt-4">
                        <div className="space-y-4">
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">Visual Description</label>
                            <textarea 
                                value={prompt} 
                                onChange={(e) => setPrompt(e.target.value)} 
                                placeholder="Describe your brand avatar (e.g., A sophisticated artisan in a modern workshop with soft golden lighting...)"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-8 text-base font-sans font-light text-gray-300 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 h-64 resize-none transition-all duration-500 shadow-sm outline-none leading-relaxed placeholder:text-gray-600"
                            />
                        </div>
                        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-[#C5A059] hover:bg-[#b08e4d] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/20 transition-all duration-500">
                            {isGenerating ? <Loader2 className="animate-spin" /> : 'Synthesize Avatar'}
                        </Button>
                    </div>
                </Card>

                <Card title="Avatar Preview" className="luxury-card border-white/10 rounded-[2.5rem] p-10 bg-black/20 backdrop-blur-xl flex flex-col">
                    <div className="flex-grow flex flex-col items-center justify-center">
                        {generatedImage ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-10 w-full"
                            >
                                <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/5 relative group">
                                    <img src={generatedImage} alt="Generated Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <button className="bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/20 transition-all">
                                            <Download size={24} />
                                        </button>
                                    </div>
                                </div>
                                <Button className="w-full bg-[#6A2C91] hover:bg-[#552374] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all duration-500">
                                    Download High-Res Asset
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="text-center opacity-20 py-20">
                                <User size={120} strokeWidth={0.5} className="text-white mb-8 mx-auto" />
                                <p className="text-[14px] font-sans font-medium text-gray-500 uppercase tracking-[0.5em]">Awaiting Neural Synthesis</p>
                            </div>
                        )}
                    </div>

                    {history.length > 0 && (
                        <div className="mt-12 pt-12 border-t border-white/5">
                            <p className="text-[10px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-6">Previous Syntheses</p>
                            <div className="flex gap-4">
                                {history.map(item => (
                                    <button 
                                        key={item.id} 
                                        onClick={() => setGeneratedImage(item.url)}
                                        className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/10 shadow-sm hover:scale-110 transition-transform duration-500"
                                    >
                                        <img src={item.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </motion.div>
    );
};

export const AdvancedContentGenerator = () => {
    const navigate = useNavigate();
    const { addMarketingPost } = useArtisanData();
    const [topic, setTopic] = useState('');
    const [campaignGoal, setCampaignGoal] = useState('Brand Awareness');
    const [isGenerating, setIsGenerating] = useState(false);
    const [campaign, setCampaign] = useState<{ blog: string, social: string, email: string } | null>(null);

    const handleGenerate = async () => {
        if (!topic) return toast.error("Please enter a campaign topic.");
        setIsGenerating(true);
        setCampaign(null);
        const toastId = toast.loading("Synthesizing multi-platform campaign...");
        try {
            const prompt = `Generate a comprehensive marketing campaign for an artisanal brand. Topic: ${topic}. Goal: ${campaignGoal}.
            Provide the output in JSON format with three keys: 'blog' (a short blog post draft), 'social' (an Instagram caption), and 'email' (an email newsletter draft).`;
            
            const result = await chatWithLola(prompt, null, 'deep');
            
            try {
                // Try to parse JSON from the result
                const jsonMatch = result.text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    setCampaign(parsed);
                    toast.success("Campaign synthesis complete.", { id: toastId });
                } else {
                    // Fallback if not strict JSON
                    setCampaign({
                        blog: "Blog draft generated based on: " + topic,
                        social: "Social caption generated based on: " + topic,
                        email: "Email draft generated based on: " + topic
                    });
                    toast.info("Campaign generated with partial formatting.", { id: toastId });
                }
            } catch (e) {
                console.error("Failed to parse campaign JSON", e);
                setCampaign({
                    blog: result.text.substring(0, 200) + "...",
                    social: "Check full output for details.",
                    email: "Check full output for details."
                });
                toast.warning("Campaign generated. Manual formatting required.", { id: toastId });
            }
        } catch (error) {
            console.error("Campaign generation failed", error);
            toast.error("Synthesis failed: Node offline.", { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveCampaign = () => {
        if (!campaign) return;
        
        const date = new Date().toISOString();
        
        if (campaign.blog) {
            addMarketingPost({
                platform: 'Blog',
                topic: `${topic} - Blog`,
                content: campaign.blog,
                scheduledDate: date,
                status: 'Draft',
                type: 'Text'
            });
        }
        if (campaign.social) {
            addMarketingPost({
                platform: 'Instagram',
                topic: `${topic} - Social`,
                content: campaign.social,
                scheduledDate: date,
                status: 'Draft',
                type: 'Text'
            });
        }
        if (campaign.email) {
            addMarketingPost({
                platform: 'Email',
                topic: `${topic} - Newsletter`,
                content: campaign.email,
                scheduledDate: date,
                status: 'Draft',
                type: 'Text'
            });
        }
        
        toast.success("Campaign assets saved to Drafts.");
        navigate('/marketing/calendar');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 space-y-12 pb-20 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Advanced Synthesis"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Deep cognitive multi-platform campaign generation."
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card title="Campaign Parameters" className="luxury-card border-white/10 rounded-3xl p-8 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-8 mt-4">
                        <div>
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Core Topic / Product</label>
                            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Summer Solstice Collection Launch" className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Campaign Goal</label>
                            <Select value={campaignGoal} onChange={(e) => setCampaignGoal(e.target.value)} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm">
                                <option className="bg-black">Brand Awareness</option>
                                <option className="bg-black">Lead Generation</option>
                                <option className="bg-black">Direct Sales</option>
                                <option className="bg-black">Customer Retention</option>
                            </Select>
                        </div>
                        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-[#C5A059] hover:bg-[#b08e4d] text-white h-14 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-black/20 transition-all">
                            {isGenerating ? <Loader2 className="animate-spin" /> : 'Synthesize Campaign'}
                        </Button>
                    </div>
                </Card>

                <Card title="Generated Assets" className="luxury-card border-white/10 rounded-3xl p-8 bg-black/20 backdrop-blur-xl">
                    {campaign ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[11px] font-sans font-medium text-white font-bold uppercase tracking-[0.2em] mb-3 ml-1">Blog Post Draft</h4>
                                    <div className="p-6 bg-black/40 rounded-2xl border border-white/10 text-sm font-sans font-light text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto shadow-sm">
                                        {campaign.blog}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-sans font-medium text-white font-bold uppercase tracking-[0.2em] mb-3 ml-1">Instagram Caption</h4>
                                    <div className="p-6 bg-black/40 rounded-2xl border border-white/10 text-sm font-sans font-light text-gray-300 whitespace-pre-wrap max-h-32 overflow-y-auto shadow-sm">
                                        {campaign.social}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-sans font-medium text-white font-bold uppercase tracking-[0.2em] mb-3 ml-1">Email Newsletter</h4>
                                    <div className="p-6 bg-black/40 rounded-2xl border border-white/10 text-sm font-sans font-light text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto shadow-sm">
                                        {campaign.email}
                                    </div>
                                </div>
                            </div>
                            <Button onClick={handleSaveCampaign} className="w-full bg-[#6A2C91] hover:bg-[#552374] text-white h-14 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-[#6A2C91]/20 transition-all mt-6">
                                Save All to Drafts
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-32 opacity-30 text-center">
                            <Zap size={64} strokeWidth={1} className="text-white mb-6" />
                            <p className="text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em]">Awaiting Parameters</p>
                        </div>
                    )}
                </Card>
            </div>
        </motion.div>
    );
};

export const ContentApprovals = () => {
    const navigate = useNavigate();
    const { marketingPosts, updateMarketingPost } = useArtisanData();
    const pendingPosts = marketingPosts.filter(p => p.status === 'Draft' || p.status === 'Pending Approval');

    const handleApprove = (id: string) => {
        updateMarketingPost(id, { status: 'Scheduled' });
        toast.success("Content approved and scheduled.");
    };

    const handleReject = (id: string) => {
        updateMarketingPost(id, { status: 'Draft' });
        toast.info("Content returned to drafts.");
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 space-y-12 pb-20 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Content Approvals"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Governance node for marketing deployment."
                />
            </div>

            <div className="grid grid-cols-1 gap-8">
                {pendingPosts.length === 0 ? (
                    <Card className="luxury-card border-white/10 rounded-3xl bg-black/20 backdrop-blur-xl text-center py-32">
                        <CheckCircle size={64} strokeWidth={1} className="mx-auto text-white/20 mb-6" />
                        <h3 className="text-2xl font-serif text-white tracking-tight mb-2">All Clear</h3>
                        <p className="text-gray-500 font-sans font-light text-sm">No content pending approval.</p>
                    </Card>
                ) : (
                    pendingPosts.map((post, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            key={post.id}
                        >
                            <Card className="luxury-card border-white/10 rounded-3xl p-8 bg-black/40 backdrop-blur-xl">
                                <div className="flex flex-col md:flex-row gap-10 items-start">
                                    {post.mediaUrl && (
                                        <div className="w-full md:w-64 h-64 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-sm">
                                            <img src={post.mediaUrl} alt={post.topic} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Badge color="purple" className="text-[#6A2C91] border-[#6A2C91]/20 bg-[#6A2C91]/10 px-3 py-1 text-[10px] font-sans font-medium uppercase tracking-[0.2em]">{post.platform}</Badge>
                                                <Badge color="gold" className="bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20 px-3 py-1 text-[10px] font-sans font-medium uppercase tracking-[0.2em]">{post.status}</Badge>
                                            </div>
                                            <span className="text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em]">{new Date(post.scheduledDate).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-3xl font-serif text-white">{post.topic}</h3>
                                        <div className="p-6 bg-black/40 rounded-2xl border border-white/10 text-sm font-sans font-light text-gray-300 whitespace-pre-wrap shadow-sm">
                                            {post.content}
                                        </div>
                                        <div className="flex gap-4 pt-6">
                                            <Button onClick={() => handleApprove(post.id)} className="bg-[#C5A059] hover:bg-[#b08e4d] text-white h-12 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.2em] px-8 shadow-xl shadow-black/20 transition-all">
                                                Approve & Schedule
                                            </Button>
                                            <Button onClick={() => handleReject(post.id)} variant="outline" className="text-rose-500 border-rose-500/20 hover:bg-rose-500/10 h-12 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.2em] px-8 transition-all">
                                                Reject to Draft
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

// Fix: Add missing BrandVoiceProfile component
export const BrandVoiceProfile = () => {
    const navigate = useNavigate();
    
    // Business DNA
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [primaryFont, setPrimaryFont] = useState('Inter (Sans-serif)');
    const [secondaryFont, setSecondaryFont] = useState('Playfair Display (Serif)');
    const [primaryColor, setPrimaryColor] = useState('#000000');
    const [secondaryColor, setSecondaryColor] = useState('#C5A059');
    const [brandValues, setBrandValues] = useState('Excellence, Sustainability, Artisanship');
    const [tagline, setTagline] = useState('Crafting the extraordinary.');
    
    // Linguistic Architecture
    const [adjectives, setAdjectives] = useState('Luxurious, Artisanal, Precise, Bold');
    const [restrictedWords, setRestrictedWords] = useState('Cheap, Discount, Mass-produced');
    const [targetAudience, setTargetAudience] = useState('High-end wellness consumers and boutique retailers.');
    const [tone, setTone] = useState('Authoritative & Elegant');
    
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Business DNA & Voice Profile updated successfully.");
        }, 1000);
    };

    const handleGenerateBrandBook = () => {
        setIsGenerating(true);
        const toastId = toast.loading("Synthesizing Brand Book & Asset Site...");
        setTimeout(() => {
            setIsGenerating(false);
            toast.success("Brand Book generated and added to Vault.", { id: toastId });
        }, 2000);
    };
    
    const handleLogoUpload = (files: File[]) => {
        if (files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(files[0]);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <div className="flex flex-col gap-8">
                <SubPageHeader 
                  title="Business DNA & Brand Voice"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Core identity matrix: visual, linguistic, and strategic brand parameters."
                />
                
                <VaultBanner 
                  title="Business DNA"
                  subtitle="Core identity matrix: Define the visual and linguistic parameters that represent your brand's essence."
                  badge="DNA Protocol Active"
                >
                  <div className="flex gap-4">
                    <Button 
                        variant="primary"
                        className="bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-8 rounded-full shadow-2xl shadow-black/20 transition-all"
                        onClick={handleGenerateBrandBook}
                        disabled={isGenerating}
                    >
                        {isGenerating ? <Loader2 className="animate-spin mr-3" size={16} /> : <FileText size={16} className="mr-3"/>}
                        GENERATE BRAND BOOK
                    </Button>
                    <Button 
                        variant="primary"
                        className="bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 rounded-full shadow-2xl shadow-[#6A2C91]/20 transition-all"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="animate-spin mr-3" size={16} /> : <CheckCircle size={16} className="mr-3"/>}
                        COMMIT DNA PROTOCOL
                    </Button>
                  </div>
                </VaultBanner>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card title="Visual DNA (Assets & Styling)" className="luxury-card border-white/10 rounded-3xl p-8 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-8 mt-4">
                        <div>
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Master Logo</label>
                            <FileUploader onUpload={handleLogoUpload} acceptedFormats=".svg, .png, .jpg" label="Upload Primary Logo" />
                            {logoPreview && (
                                <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-center">
                                    <img src={logoPreview} alt="Brand Logo" className="h-16 object-contain" />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Primary Font</label>
                                <Input value={primaryFont} onChange={(e) => setPrimaryFont(e.target.value)} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Secondary Font</label>
                                <Input value={secondaryFont} onChange={(e) => setSecondaryFont(e.target.value)} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Primary Color (Hex)</label>
                                <div className="flex gap-3 items-center">
                                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-14 h-14 rounded-2xl bg-transparent border-0 cursor-pointer" />
                                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 h-14 rounded-2xl bg-black/40 border-white/10 text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Accent Color (Hex)</label>
                                <div className="flex gap-3 items-center">
                                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-14 h-14 rounded-2xl bg-transparent border-0 cursor-pointer" />
                                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1 h-14 rounded-2xl bg-black/40 border-white/10 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Strategic DNA & Tone" className="luxury-card border-white/10 rounded-3xl p-8 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-8 mt-4">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Brand Tagline</label>
                                <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g., Crafting the extraordinary." className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Core Values</label>
                                <Input value={brandValues} onChange={(e) => setBrandValues(e.target.value)} placeholder="e.g., Excellence, Sustainability..." className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Brand Adjectives (Comma separated)</label>
                            <Input value={adjectives} onChange={(e) => setAdjectives(e.target.value)} placeholder="e.g., Luxurious, Artisanal..." className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Target Audience</label>
                            <textarea 
                                value={targetAudience} 
                                onChange={(e) => setTargetAudience(e.target.value)} 
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm font-sans font-light text-gray-300 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 h-24 resize-none transition-all shadow-sm outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Primary Tone</label>
                                <Select value={tone} onChange={(e) => setTone(e.target.value)} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm">
                                    <option className="bg-black">Authoritative & Elegant</option>
                                    <option className="bg-black">Warm & Approachable</option>
                                    <option className="bg-black">Technical & Precise</option>
                                    <option className="bg-black">Bold & Disruptive</option>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Restricted Vocabulary</label>
                                <Input value={restrictedWords} onChange={(e) => setRestrictedWords(e.target.value)} placeholder="Words AI should never use" className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="lg:col-span-2">
                    <Card title="AI Persona Preview" className="luxury-card border-white/10 rounded-3xl p-8 bg-black/20 backdrop-blur-xl">
                        <div className="space-y-8 mt-4">
                            <p className="text-sm text-gray-500 font-sans font-light leading-relaxed">
                                Based on your current parameters, Lola will generate content that aligns with your DNA:
                            </p>
                            <div className="p-8 bg-black/40 border border-white/10 rounded-3xl shadow-sm italic text-gray-300 font-serif text-lg leading-relaxed">
                                "Discover the uncompromising precision of our latest artisanal collection. Crafted for those who demand excellence, each piece reflects our dedication to bold innovation and luxurious quality. {tagline}"
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {adjectives.split(',').map(adj => adj.trim()).filter(Boolean).map((adj, i) => (
                                    <Badge key={i} color="purple" className="text-[#6A2C91] border-[#6A2C91]/20 bg-[#6A2C91]/10 px-4 py-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] rounded-full">{adj}</Badge>
                                ))}
                                {brandValues.split(',').map(val => val.trim()).filter(Boolean).map((val, i) => (
                                    <Badge key={`v-${i}`} color="gold" className="text-[#C5A059] border-[#C5A059]/20 bg-[#C5A059]/10 px-4 py-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] rounded-full">{val}</Badge>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

export const ReceptionistLogic = () => {
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('Welcome to our artisanal boutique. How may I assist you today?');
    const [fallback, setFallback] = useState('I apologize, but I need to connect you with a human artisan for that request.');
    const [qualificationQuestions, setQualificationQuestions] = useState('What type of product are you looking for?\nDo you have a specific budget in mind?\nAre you interested in wholesale or retail?');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Receptionist logic updated successfully.");
        }, 1000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 space-y-12 pb-20 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Receptionist Logic"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Automated qualification protocols for leads."
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card title="Interaction Parameters" className="luxury-card border-white/10 rounded-3xl p-8 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-8 mt-4">
                        <div>
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Initial Greeting</label>
                            <Input value={greeting} onChange={(e) => setGreeting(e.target.value)} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Fallback Response (Human Handoff)</label>
                            <Input value={fallback} onChange={(e) => setFallback(e.target.value)} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Qualification Questions (One per line)</label>
                            <textarea 
                                value={qualificationQuestions} 
                                onChange={(e) => setQualificationQuestions(e.target.value)} 
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm font-sans font-light text-gray-300 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 h-40 resize-none transition-all shadow-sm outline-none"
                            />
                        </div>
                        <Button onClick={handleSave} disabled={isSaving} className="w-full bg-[#C5A059] hover:bg-[#b08e4d] text-white h-14 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-black/20 transition-all">
                            {isSaving ? <Loader2 className="animate-spin" /> : 'Deploy Logic'}
                        </Button>
                    </div>
                </Card>
                <Card title="Logic Flow Simulation" className="luxury-card border-white/10 rounded-3xl p-8 bg-black/20 backdrop-blur-xl">
                    <div className="space-y-8 mt-4">
                        <div className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#6A2C91] flex items-center justify-center text-white shrink-0 shadow-sm">
                                    <Bot size={18} />
                                </div>
                                <div className="bg-black/40 p-5 rounded-2xl rounded-tl-none border border-white/10 text-sm font-sans font-light text-gray-300 shadow-sm leading-relaxed">
                                    {greeting}
                                </div>
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="flex gap-4 flex-row-reverse"
                            >
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
                                    <User size={18} />
                                </div>
                                <div className="bg-[#C5A059] text-white p-5 rounded-2xl rounded-tr-none text-sm font-sans font-light shadow-sm leading-relaxed">
                                    I'm looking for a custom order.
                                </div>
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="flex gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#6A2C91] flex items-center justify-center text-white shrink-0 shadow-sm">
                                    <Bot size={18} />
                                </div>
                                <div className="bg-black/40 p-5 rounded-2xl rounded-tl-none border border-white/10 text-sm font-sans font-light text-gray-300 shadow-sm leading-relaxed">
                                    {qualificationQuestions.split('\n')[0] || "How can I help you?"}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

export const MarketingCreator = () => {
    const navigate = useNavigate();
    const { addMarketingPost } = useArtisanData();
    const [isGenerating, setIsGenerating] = useState(false);
    const [topic, setTopic] = useState('');
    const [assetType, setAssetType] = useState('Product Photo');
    const [style, setStyle] = useState('Photorealistic');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');

    const handleGenerate = async () => {
        if (!topic) return toast.error("Please enter a topic.");
        
        // Handle API Key selection if needed
        if ((window as any).aistudio) {
             const hasKey = await (window as any).aistudio.hasSelectedApiKey();
             if (!hasKey) { 
                await (window as any).aistudio.openSelectKey(); 
                // Proceed assuming selection success per instructions
             }
        }

        setIsGenerating(true);
        setGeneratedImage(null);
        const toastId = toast.loading("Synthesizing high-fidelity asset...");
        try {
            const prompt = `Generate a high-quality ${style} image for a ${assetType}. Subject: ${topic}. Luxurious lighting, artisanal depth.`;
            const imageUrl = await generateLolaImage(prompt, { size: imageSize, aspectRatio });
            setGeneratedImage(imageUrl);
            toast.success("Asset synthesis complete.", { id: toastId });
        } catch (error: any) {
            console.error("Generation failed", error);
            if (error.message?.includes('Requested entity was not found.')) {
                 if ((window as any).aistudio) (window as any).aistudio.openSelectKey();
                 toast.dismiss(toastId);
            } else { 
              toast.error("Synthesis failed: Node offline.", { id: toastId }); 
            }
        } finally { setIsGenerating(false); }
    };

    const handleSave = () => {
        if (!generatedImage) return;
        addMarketingPost({
            platform: 'Instagram', topic: topic || 'Marketing Asset',
            content: `New ${assetType}: ${topic}`,
            scheduledDate: new Date().toISOString().split('T')[0],
            status: 'Draft', type: 'Image', mediaUrl: generatedImage
        });
        toast.success("Asset saved to approvals vault.");
        navigate('/marketing/approvals');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 max-w-7xl mx-auto space-y-12 pb-24"
        >
             <div className="w-full">
                <SubPageHeader 
                  title="Marketing Creator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Synthesize high-fidelity assets with Gemini 3 Pro Image"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Card className="luxury-card p-8 bg-black/40 backdrop-blur-xl border-white/10">
                        <h3 className="text-xl font-serif text-white mb-8">Asset Configuration</h3>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-sans text-gray-500 uppercase tracking-wider mb-3 ml-1">Manifest Type</label>
                                    <Select value={assetType} onChange={(e) => setAssetType(e.target.value)} className="w-full h-14 bg-black/40 border-white/10 rounded-2xl text-white font-sans focus:ring-1 focus:ring-[#6A2C91]/30 transition-shadow">
                                        <option className="bg-black">Product Photo</option>
                                        <option className="bg-black">Social Media Post</option>
                                        <option className="bg-black">Email Header</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-xs font-sans text-gray-500 uppercase tracking-wider mb-3 ml-1">Resolution Node</label>
                                    <Select value={imageSize} onChange={(e) => setImageSize(e.target.value as any)} className="w-full h-14 bg-black/40 border-white/10 rounded-2xl text-white font-sans focus:ring-1 focus:ring-[#6A2C91]/30 transition-shadow">
                                        <option value="1K" className="bg-black">Standard 1K</option>
                                        <option value="2K" className="bg-black">High Definition 2K</option>
                                        <option value="4K" className="bg-black">Cinema Quality 4K</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-sans text-gray-500 uppercase tracking-wider mb-3 ml-1">Aspect Ratio</label>
                                    <Select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full h-14 bg-black/40 border-white/10 rounded-2xl text-white font-sans focus:ring-1 focus:ring-[#6A2C91]/30 transition-shadow">
                                        <option value="1:1" className="bg-black">Square (1:1)</option>
                                        <option value="16:9" className="bg-black">Landscape (16:9)</option>
                                        <option value="9:16" className="bg-black">Portrait (9:16)</option>
                                        <option value="4:5" className="bg-black">Vertical (4:5)</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-xs font-sans text-gray-500 uppercase tracking-wider mb-3 ml-1">Aesthetic Style</label>
                                    <Select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full h-14 bg-black/40 border-white/10 rounded-2xl text-white font-sans focus:ring-1 focus:ring-[#6A2C91]/30 transition-shadow">
                                        <option className="bg-black">Photorealistic</option>
                                        <option className="bg-black">Minimalist</option>
                                        <option className="bg-black">Vibrant</option>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-sans text-gray-500 uppercase tracking-wider mb-3 ml-1">Asset Description</label>
                                <textarea 
                                    placeholder="Describe your image with high-sensory detail..." 
                                    value={topic} 
                                    onChange={(e) => setTopic(e.target.value)} 
                                    className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-gray-300 font-sans focus:bg-black/60 focus:ring-1 focus:ring-[#6A2C91]/30 outline-none h-40 resize-none transition-all shadow-sm placeholder:text-gray-600"
                                />
                            </div>
                            <Button onClick={handleGenerate} className="w-full bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 rounded-full font-sans font-medium text-sm tracking-wide shadow-md transition-all duration-300" disabled={isGenerating}>
                                {isGenerating ? <Loader2 className="animate-spin mr-3" size={18} /> : <Sparkles size={18} className="mr-3" />}
                                {isGenerating ? 'Synthesizing Pixels...' : 'Initialize Visual Generation'}
                            </Button>
                        </div>
                    </Card>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[600px] relative group hover:bg-black/30 transition-all duration-500 overflow-hidden shadow-sm">
                        <AnimatePresence mode="wait">
                            {generatedImage ? (
                                <motion.div 
                                    key="generated-image"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full h-full flex flex-col items-center p-10"
                                >
                                    <div className="flex-1 w-full flex items-center justify-center mb-10">
                                        <img src={generatedImage} alt="Generated" className="max-w-full max-h-[400px] object-contain rounded-2xl shadow-lg border border-white/5" />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                                        <Button variant="outline" onClick={() => setGeneratedImage(null)} className="flex-1 h-14 rounded-full text-xs font-sans font-medium text-gray-400 border-white/10 hover:bg-white/5 transition-colors">Discard Node</Button>
                                        <Button onClick={handleSave} className="flex-[2] bg-[#C5A059] hover:bg-[#b08d4f] text-white h-14 rounded-full font-sans font-medium text-xs tracking-wide shadow-md transition-all">Approve & Schedule</Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-6"
                                >
                                    <div className="w-24 h-24 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-white/20 mx-auto shadow-sm group-hover:scale-105 transition-transform duration-700">
                                        <Image size={40} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-sans text-gray-500 uppercase tracking-widest">Output Preview Node</p>
                                        <p className="text-sm text-gray-400 font-serif italic mt-2">Awaiting Pulse</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
