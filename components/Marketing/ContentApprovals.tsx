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

            <div className="grid grid-cols-1 gap-4 sm:p-8">
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
                            <Card className="luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/40 backdrop-blur-xl">
                                <div className="flex flex-col md:flex-row gap-4 sm:p-10 items-start">
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
