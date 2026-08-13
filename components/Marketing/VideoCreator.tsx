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
            className="p-4 sm:p-8 space-y-16 pb-32 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Video Creator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="AI-powered video script production interface"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12">
                <Card title="Script Configuration" className="luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/40 backdrop-blur-xl">
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

                <Card title="Generated Script" className="luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/20 backdrop-blur-xl">
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
                                className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-4 sm:p-8 text-base font-mono font-light text-gray-300 h-[24rem] resize-none shadow-sm focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 transition-all duration-500 outline-none leading-relaxed"
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
