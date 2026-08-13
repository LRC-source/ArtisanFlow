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


export const MarketingStudio = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 space-y-12 pb-20 max-w-7xl mx-auto"
        >
            <ContextualTutorialModal
                hubId="marketing_studio"
                title="Marketing Studio"
                description="Central command for all your marketing and branding efforts."
                steps={["Access Visual Analysis to audit assets.","Use Marketing Creator for quick designs.","Generate your Brand Voice Profile."]}
            />
            <ContextualTutorialModal
                hubId="marketing_studio"
                title="Marketing Studio Overview"
                description="Welcome to the Marketing Studio, your centralized hub for AI-driven asset creation and brand strategy."
                steps={[
                    "Use Visual Analysis to audit product photos.",
                    "Generate high-fidelity assets in the Marketing Creator.",
                    "Build a comprehensive strategy in Marketing Strategy.",
                    "Define your Brand Voice for consistent output."
                ]}
            />
            <div>
                <h1 className="text-5xl font-serif text-white tracking-tight mb-3">Marketing Studio</h1>
                <p className="text-gray-400 font-sans font-light text-lg max-w-xl leading-relaxed">AI-powered content creation and marketing protocols.</p>
            </div>
            <MarketingGrid />
        </motion.div>
    );
};

// --- MARKETING HUB SUBPAGE ---

