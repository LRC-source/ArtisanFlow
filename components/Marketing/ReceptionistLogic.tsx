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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-10">
                <Card title="Interaction Parameters" className="luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/40 backdrop-blur-xl">
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
                <Card title="Logic Flow Simulation" className="luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/20 backdrop-blur-xl">
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

