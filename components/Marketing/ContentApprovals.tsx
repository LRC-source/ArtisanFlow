import React, { useState } from 'react';
import { Card, Button, Badge } from '../UI';
import { CheckCircle, X, Share2, Eye, EyeOff, LayoutDashboard, Link as LinkIcon, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanData } from '../DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';
import { toast } from 'sonner';

export const ContentApprovals = () => {
    const navigate = useNavigate();
    const { marketingPosts, updateMarketingPost } = useArtisanData();
    const pendingPosts = marketingPosts.filter(p => p.status === 'Draft' || p.status === 'Pending Approval');

    const [clientViewMode, setClientViewMode] = useState(false);
    const [generatingLink, setGeneratingLink] = useState(false);

    const handleApprove = (id: string) => {
        updateMarketingPost(id, { status: 'Scheduled' });
        toast.success("Content approved and scheduled.");
    };

    const handleReject = (id: string) => {
        updateMarketingPost(id, { status: 'Draft' });
        toast.info("Content returned to drafts.");
    };

    const handleGenerateShareLink = () => {
        setGeneratingLink(true);
        setTimeout(() => {
            setGeneratingLink(false);
            navigator.clipboard.writeText("https://artisanflow.lrcholisticmarketing.online/client-review/abc-123");
            toast.success("Client review link copied to clipboard!");
        }, 1000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`p-4 sm:p-8 space-y-12 pb-20 ${clientViewMode ? 'max-w-4xl' : 'max-w-7xl'} mx-auto transition-all duration-700`}
        >
            <div className="w-full flex items-center justify-between">
                {!clientViewMode ? (
                    <SubPageHeader 
                      title="Content Approvals"
                      parentTitle="Marketing Hub"
                      onBack={() => navigate('/marketing')}
                      description="Internal governance node for marketing deployment."
                    />
                ) : (
                    <div className="space-y-2">
                        <Badge color="purple" className="mb-2">Client Presentation Mode</Badge>
                        <h1 className="text-3xl font-serif text-white tracking-tight">Review Your Content</h1>
                        <p className="text-gray-400 font-sans text-sm">Please review the proposed assets below for approval.</p>
                    </div>
                )}

                <div className="flex gap-4">
                    {!clientViewMode && (
                        <Button onClick={handleGenerateShareLink} disabled={generatingLink} variant="outline" className="h-12 bg-white/5 border-white/10 text-white">
                            <LinkIcon size={16} className="mr-2" /> 
                            {generatingLink ? "Generating..." : "Share Link"}
                        </Button>
                    )}
                    <Button 
                        onClick={() => setClientViewMode(!clientViewMode)} 
                        variant="outline" 
                        className={`h-12 border-white/10 ${clientViewMode ? 'bg-[#C5A059] text-white border-none' : 'bg-white/5 text-gray-300'}`}
                    >
                        {clientViewMode ? <LayoutDashboard size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
                        {clientViewMode ? "Exit Client View" : "Client View"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {pendingPosts.length === 0 ? (
                    <Card className="border-white/10 rounded-[2.5rem] bg-black/20 backdrop-blur-xl text-center py-32 shadow-2xl">
                        <CheckCircle size={64} strokeWidth={1} className="mx-auto text-emerald-500/50 mb-6" />
                        <h3 className="text-2xl font-serif text-white tracking-tight mb-2">Queue Empty</h3>
                        <p className="text-gray-500 font-sans font-light text-sm">No content currently pending approval.</p>
                    </Card>
                ) : (
                    pendingPosts.map((post, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            key={post.id}
                        >
                            <Card className={`border-white/10 rounded-[2.5rem] p-0 bg-[#0A0A0A] backdrop-blur-xl overflow-hidden shadow-2xl transition-all ${clientViewMode ? 'border-none ring-1 ring-white/5' : ''}`}>
                                
                                {/* Mockup Header for Client View */}
                                {clientViewMode && (
                                    <div className="h-12 bg-[#1A1A1A] border-b border-white/5 flex items-center px-6 gap-2">
                                        <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                        <span className="ml-4 text-xs font-sans text-gray-500">{post.platform} Preview</span>
                                    </div>
                                )}

                                <div className={`flex flex-col md:flex-row gap-8 ${clientViewMode ? 'p-10' : 'p-8 sm:p-10'}`}>
                                    {post.mediaUrl && (
                                        <div className="w-full md:w-80 h-80 rounded-[2rem] overflow-hidden border border-white/5 shrink-0 relative group">
                                            <img src={post.mediaUrl} alt={post.topic} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            {!clientViewMode && (
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/20">
                                                        <Download size={16} className="mr-2" /> Asset
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            {!clientViewMode && (
                                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                                    <div className="flex items-center gap-3">
                                                        <Badge color="purple">{post.platform}</Badge>
                                                        <Badge color="gold">{post.status}</Badge>
                                                    </div>
                                                    <span className="text-[10px] font-sans text-gray-500 uppercase tracking-widest">{new Date(post.scheduledDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            
                                            <div>
                                                <h3 className="text-2xl font-serif text-white mb-4">{post.topic}</h3>
                                                <div className={`p-6 rounded-2xl text-sm font-sans font-light leading-relaxed whitespace-pre-wrap ${clientViewMode ? 'bg-transparent text-gray-300 p-0' : 'bg-white/5 border border-white/10 text-gray-300 shadow-sm'}`}>
                                                    {post.content}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`flex gap-4 pt-8 mt-8 ${!clientViewMode ? 'border-t border-white/10' : ''}`}>
                                            <Button 
                                                onClick={() => handleApprove(post.id)} 
                                                className={`flex-1 h-14 rounded-2xl font-sans font-medium text-xs uppercase tracking-widest transition-all ${clientViewMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-[#6A2C91] hover:bg-[#552374] text-white'}`}
                                            >
                                                <CheckCircle size={16} className="mr-2" /> Approve
                                            </Button>
                                            <Button 
                                                onClick={() => handleReject(post.id)} 
                                                variant="outline" 
                                                className={`flex-1 h-14 rounded-2xl font-sans font-medium text-xs uppercase tracking-widest transition-all ${clientViewMode ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20' : 'text-gray-400 border-white/10 hover:bg-white/5'}`}
                                            >
                                                <X size={16} className="mr-2" /> Request Revisions
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
