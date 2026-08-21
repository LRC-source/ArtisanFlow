import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from '../UI';
import { ArrowLeft, ArrowRight, Calendar, Share2, Instagram, Facebook, Linkedin, Twitter, Youtube, FileText, Globe, Plus, Trash2, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanData, MarketingPost } from '../DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';

export const ContentCalendar = () => {
    const navigate = useNavigate();
    const { marketingPosts, updateMarketingPost } = useArtisanData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

    const nextTime = () => {
        if (viewMode === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        if (viewMode === 'week') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
        if (viewMode === 'day') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
    };
    
    const prevTime = () => {
        if (viewMode === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        if (viewMode === 'week') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
        if (viewMode === 'day') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
    };

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

    const handleAction = (post: MarketingPost, action: 'reschedule' | 'cancel' | 'publish') => {
        if (action === 'cancel') {
            updateMarketingPost(post.id, { status: 'Draft' });
        } else if (action === 'publish') {
            updateMarketingPost(post.id, { status: 'Published' });
        } else if (action === 'reschedule') {
            // Simulated reschedule: Push to next day
            const curDate = new Date(post.scheduledDate);
            curDate.setDate(curDate.getDate() + 1);
            const nextDateStr = curDate.toISOString().split('T')[0];
            updateMarketingPost(post.id, { scheduledDate: nextDateStr });
        }
        setSelectedDay(null); // Close modal on action
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-10 lg:space-y-12 max-w-7xl mx-auto pb-12 sm:pb-20 lg:pb-32"
        >
            <div className="flex flex-col gap-3 sm:gap-6">
                <SubPageHeader 
                  title="Content Calendar"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Omnichannel publication schedule and governance."
                />
            </div>

            <Card className="luxury-card border-transparent rounded-[2.5rem] p-3.5 sm:p-6 lg:p-12 bg-black/40 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-3 sm:gap-6">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white mb-4">{monthName} {year}</h2>
                    
                    <div className="flex items-center gap-3 sm:gap-6 w-auto justify-between sm:justify-end">
                        {/* View Toggle */}
                        <div className="bg-black/40 p-1 rounded-xl flex border border-white/10">
                            {(['month', 'week', 'day'] as const).map(mode => (
                                <button 
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${viewMode === mode ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                        
                        {/* Nav Controls */}
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={prevTime} className="h-10 w-10 p-0 rounded-xl border-white/10 text-white hover:bg-white/5 flex justify-center items-center"><ArrowLeft size={16} /></Button>
                            <Button variant="outline" onClick={nextTime} className="h-10 w-10 p-0 rounded-xl border-white/10 text-white hover:bg-white/5 flex justify-center items-center"><ArrowRight size={16} /></Button>
                        </div>
                    </div>
                </div>

                {viewMode === 'month' && (
                    <>
                        <div className="grid grid-cols-7 gap-3 sm:gap-4 mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-[10px] font-sans font-medium text-gray-500 uppercase tracking-widest">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-3 sm:gap-4">
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
                                        className="h-32 rounded-3xl bg-white/5 border border-white/10 hover:border-[#6A2C91] hover:bg-white/10 p-3 transition-all cursor-pointer relative overflow-hidden group flex flex-col shadow-sm"
                                    >
                                        <span className="text-xs font-sans font-medium text-white sm:text-gray-400 group-hover:text-white transition-colors">{day}</span>
                                        <div className="mt-auto space-y-1 overflow-y-auto hidden-scrollbar">
                                            {dayPosts.map((post, idx) => (
                                                <div key={idx} className="bg-black/60 rounded p-1.5 flex items-center gap-1.5 overflow-hidden border border-white/5">
                                                    <div className={`${post.status === 'Published' ? 'text-emerald-500' : 'text-[#6A2C91]'} shrink-0`}>
                                                        {getPlatformIcon(post.platform)}
                                                    </div>
                                                    <span className="text-[9px] text-white/90 truncate font-sans font-medium">{post.topic}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {viewMode !== 'month' && (
                    <div className="py-6 sm:py-12 lg:py-16 px-4 sm:px-8 text-center opacity-50">
                        <Calendar size={48} className="mx-auto mb-4 text-white" />
                        <p className="text-sm sm:text-base font-serif text-white leading-relaxed">Detailed {viewMode} view is currently in development.</p>
                    </div>
                )}
            </Card>

            <Modal isOpen={selectedDay !== null} onClose={() => setSelectedDay(null)} title={`Schedule for ${monthName} ${selectedDay}, ${year}`}>
                <div className="space-y-6">
                    {selectedDay && getPostsForDay(selectedDay).length > 0 ? (
                        <div className="space-y-4">
                            {getPostsForDay(selectedDay).map(post => (
                                <div key={post.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3 sm:gap-4">
                                    <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center ${post.status === 'Published' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-[#6A2C91]/20 text-[#6A2C91]'}`}>
                                                {getPlatformIcon(post.platform)}
                                            </div>
                                            <div>
                                                <p className="text-sm sm:text-base text-white font-sans font-medium">{post.topic}</p>
                                                <p className="text-sm sm:text-base text-gray-500 font-sans text-[10px] uppercase tracking-widest">{post.status}</p>
                                            </div>
                                        </div>
                                        <Badge color={post.status === 'Published' ? 'green' : post.status === 'Draft' ? 'gray' : 'purple' as any}>{post.status}</Badge>
                                    </div>
                                    
                                    {/* Action Bar */}
                                    <div className="flex gap-2 pt-2 border-t border-white/10">
                                        {post.status !== 'Published' && (
                                            <>
                                                <Button variant="outline" onClick={() => handleAction(post, 'publish')} className="flex-1 h-8 text-[10px] tracking-wider border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
                                                    <CheckCircle size={12} className="mr-1" /> Publish Now
                                                </Button>
                                                <Button variant="outline" onClick={() => handleAction(post, 'reschedule')} className="flex-1 h-8 text-[10px] tracking-wider border-blue-400/30 text-blue-400 hover:bg-blue-400/10">
                                                    <Clock size={12} className="mr-1" /> Postpone 1 Day
                                                </Button>
                                                <Button variant="outline" onClick={() => handleAction(post, 'cancel')} className="flex-[0.5] h-8 text-[10px] tracking-wider border-red-500/30 text-red-500 hover:bg-red-500/10">
                                                    <Trash2 size={12} />
                                                </Button>
                                            </>
                                        )}
                                        {post.status === 'Published' && (
                                            <div className="text-[10px] text-emerald-500/70 uppercase tracking-widest flex items-center justify-center w-full py-1">
                                                <CheckCircle size={12} className="mr-2" /> Live on {post.platform}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm sm:text-base text-gray-500 font-sans text-center py-8">No nodes scheduled for this date.</p>
                    )}
                    <Button onClick={() => navigate('/marketing/creator')} className="w-full bg-gradient-to-r from-[#C5A059] to-[#b08d4f] text-white w-auto mx-auto py-1 px-3 text-[10px] rounded-xl font-sans font-medium text-[10px] uppercase tracking-widest shadow-lg border-none">
                        <Plus size={14} className="mr-2" /> Add Campaign Asset
                    </Button>
                </div>
            </Modal>
        </motion.div>
    );
};
