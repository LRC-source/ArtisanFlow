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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-10">
                <Card title="Campaign Parameters" className="luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/40 backdrop-blur-xl">
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

                <Card title="Generated Assets" className="luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/20 backdrop-blur-xl">
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

