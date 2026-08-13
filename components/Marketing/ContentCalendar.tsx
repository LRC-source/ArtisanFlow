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

export const ContentCalendar = () => {
    const navigate = useNavigate();
    const { marketingPosts, updateMarketingPost } = useArtisanData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    
    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'Instagram': return <Instagram size={14} />;
            case 'Facebook': return <Facebook size={14} />;
            case 'LinkedIn': return <Linkedin size={14} />;
            case 'Twitter': return <Twitter size={14} />;
            case 'YouTube': return <Youtube size={14} />;
            case 'Blog': return <FileText size={14} />;
            case 'Email': return <Globe size={14} />;
            default: return <Share2 size={14} />;
        }
    };

    const getPostsForDay = (day: number) => {
        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        return marketingPosts.filter(p => p.scheduledDate === dateStr);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Published': return 'green';
            case 'Scheduled': return 'blue';
            case 'Pending Approval': return 'gold';
            case 'Draft': return 'gray';
            default: return 'purple';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-10 md:p-16 space-y-12 max-w-[1600px] mx-auto pb-32"
        >
            <div className="flex flex-col gap-4 sm:p-8">
                <SubPageHeader 
                  title="Content Calendar"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Omnichannel publication schedule and governance."
                />
            </div>

            <Card className="luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-serif text-white tracking-tight">{monthName} {year}</h2>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={prevMonth} className="h-12 w-12 p-0 rounded-full border-white/10 text-white hover:bg-white/5 flex justify-center items-center"><ArrowLeft size={18} /></Button>
                        <Button variant="outline" onClick={nextMonth} className="h-12 w-12 p-0 rounded-full border-white/10 text-white hover:bg-white/5 flex justify-center items-center"><ArrowLeft size={18} className="rotate-180" /></Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-4 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-[10px] font-sans font-medium text-gray-500 uppercase tracking-widest">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`blank-${i}`} className="h-32 rounded-3xl bg-white/5 opacity-30"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayPosts = getPostsForDay(day);
                        return (
                            <div 
                                key={day} 
                                onClick={() => setSelectedDay(day)}
                                className="h-32 rounded-3xl bg-white/5 border border-white/10 hover:border-[#6A2C91] hover:bg-white/10 p-3 transition-all cursor-pointer relative overflow-hidden group flex flex-col"
                            >
                                <span className="text-xs font-sans font-medium text-gray-400 group-hover:text-white transition-colors">{day}</span>
                                <div className="mt-auto space-y-1 overflow-y-auto hidden-scrollbar">
                                    {dayPosts.map((post, idx) => (
                                        <div key={idx} className="bg-black/60 rounded p-1.5 flex items-center gap-1.5 overflow-hidden">
                                            <div className="text-[#6A2C91] shrink-0">{getPlatformIcon(post.platform)}</div>
                                            <span className="text-[9px] text-white truncate font-sans font-medium">{post.topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Modal isOpen={selectedDay !== null} onClose={() => setSelectedDay(null)} title={`Schedule for ${monthName} ${selectedDay}, ${year}`}>
                <div className="space-y-6">
                    {selectedDay && getPostsForDay(selectedDay).length > 0 ? (
                        <div className="space-y-4">
                            {getPostsForDay(selectedDay).map(post => (
                                <div key={post.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-[#6A2C91]">
                                            {getPlatformIcon(post.platform)}
                                        </div>
                                        <div>
                                            <p className="text-white font-sans font-medium text-sm">{post.topic}</p>
                                            <p className="text-gray-500 font-sans text-[10px] uppercase tracking-widest">{post.status}</p>
                                        </div>
                                    </div>
                                    <Badge color={getStatusColor(post.status) as any}>{post.status}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm font-sans text-center py-8">No nodes scheduled for this date.</p>
                    )}
                    <Button onClick={() => navigate('/marketing/creator')} className="w-full bg-[#C5A059] hover:bg-[#b08d4f] text-white h-12 rounded-xl font-sans font-medium text-[10px] uppercase tracking-widest shadow-lg">
                        <Plus size={14} className="mr-2" /> Pre-schedule Strategy
                    </Button>
                </div>
            </Modal>
        </motion.div>
    );
};

// --- AI AVATAR STUDIO ---
