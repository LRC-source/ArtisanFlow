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

export const MarketingCreator = () => {
    const navigate = useNavigate();
    const { addMarketingPost } = useArtisanData();
    const { executeAction } = useFeatureGate('marketing_creator');
    const [isGenerating, setIsGenerating] = useState(false);
    const [topic, setTopic] = useState('');
    const [assetType, setAssetType] = useState('Product Photo');
    const [style, setStyle] = useState('Photorealistic');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');

    const handleGenerate = () => {
        executeAction(async () => {
            if (!topic) {
                toast.error("Please enter a topic.");
                return;
            }
        
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
        }, true); // pass true for isMetered
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
            className="p-4 sm:p-8 max-w-7xl mx-auto space-y-12 pb-24"
        >
             <div className="w-full">
                <SubPageHeader 
                  title="Marketing Creator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Synthesize high-fidelity assets with Gemini 3 Pro Image"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Card className="luxury-card p-4 sm:p-8 bg-black/40 backdrop-blur-xl border-white/10">
                        <h3 className="text-xl font-serif text-white mb-8">Asset Configuration</h3>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-8">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-8">
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
                                    className="w-full h-full flex flex-col items-center p-4 sm:p-10"
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
