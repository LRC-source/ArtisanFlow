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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:p-8">
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


export const MarketingHub = () => {
    const navigate = useNavigate();
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <div className="flex flex-col gap-4 sm:p-8">
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


