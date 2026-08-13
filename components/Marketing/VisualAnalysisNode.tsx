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
            className="p-4 sm:p-8 space-y-16 pb-32 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Visual Analyst"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Audit artisanal assets with Gemini 3 Pro Vision"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12">
                <Card title="Source Asset Ingestion" className="luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/40 backdrop-blur-xl">
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

                <Card title="Synaptic Analysis Report" className="luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/20 backdrop-blur-xl">
                    {analysis ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="prose prose-invert max-w-none"
                        >
                            <div className="bg-black/40 p-4 sm:p-8 rounded-3xl border border-white/10 shadow-sm">
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
