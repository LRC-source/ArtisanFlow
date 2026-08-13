import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Select, FileUploader, Modal, Badge, VaultBanner, SocialMediaAuthModal } from '../UI';
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
            className="p-4 sm:p-8 space-y-16 pb-32 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Blog Generator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="SEO-optimized content synthesis node"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12">
                <Card title="Article Configuration" className="luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10">
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

                <Card title="Generated Content" className="luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-stone-50/30">
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
                                className="w-full bg-white border border-stone-100 rounded-[2rem] p-4 sm:p-8 text-base font-sans font-light text-stone-600 h-[32rem] resize-none shadow-sm focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 transition-all duration-500 outline-none leading-relaxed"
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
