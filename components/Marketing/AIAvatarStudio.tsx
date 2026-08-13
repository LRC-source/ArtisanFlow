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

export const AIAvatarStudio = () => {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [referenceImage, setReferenceImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [history, setHistory] = useState<{id: string, url: string}[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReferenceImage(reader.result as string);
                toast.success("Reference photo uploaded for synthesis.");
            };
            reader.readAsDataURL(file);
        }
    };

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
            className="p-4 sm:p-8 space-y-16 pb-32 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="AI Avatar Studio"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Synthetic brand persona and character synthesis"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12">
                <Card title="Persona Definition" className="luxury-card border-white/10 rounded-[2.5rem] p-4 sm:p-10 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-10 mt-4">
                        <div className="space-y-4">
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">Visual Description</label>
                            <textarea 
                                value={prompt} 
                                onChange={(e) => setPrompt(e.target.value)} 
                                placeholder="Describe your brand avatar (e.g., A sophisticated artisan in a modern workshop with soft golden lighting...)"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-8 text-base font-sans font-light text-gray-300 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 h-64 resize-none transition-all duration-500 shadow-sm outline-none leading-relaxed placeholder:text-gray-600"
                            />
                        </div>
                        
                        <div className="space-y-4">
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1">Reference Likeness (Optional)</label>
                            <div className="flex items-center gap-4">
                                <label className="flex-1 cursor-pointer group">
                                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                    <div className="w-full h-16 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center gap-3 text-gray-400 group-hover:border-[#6A2C91] group-hover:text-[#6A2C91] transition-all bg-black/20">
                                        <Upload size={18} />
                                        <span className="text-[11px] font-sans uppercase tracking-[0.2em]">{referenceImage ? "Replace Reference Photo" : "Upload Reference Photo"}</span>
                                    </div>
                                </label>
                                {referenceImage && (
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#6A2C91] relative">
                                        <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                                        <button onClick={() => setReferenceImage(null)} className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-[#C5A059] hover:bg-[#b08e4d] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/20 transition-all duration-500">
                            {isGenerating ? <Loader2 className="animate-spin" /> : 'Synthesize Avatar'}
                        </Button>
                    </div>
                </Card>

                <Card title="Avatar Preview" className="luxury-card border-white/10 rounded-[2.5rem] p-4 sm:p-10 bg-black/20 backdrop-blur-xl flex flex-col">
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

