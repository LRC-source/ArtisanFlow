import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../UI';
import { Share2, Clock, Image as ImageIcon, Send, Sparkles, CheckCircle, Package, Film, Instagram, Linkedin, Twitter, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanData } from '../DataContext';
import { chatWithLola } from '../../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';
import { toast } from 'sonner';

export const SocialMediaCreator = () => {
    const navigate = useNavigate();
    const { addMarketingPost, inventory } = useArtisanData();
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Form State
    const [topic, setTopic] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [channels, setChannels] = useState({ instagram: true, tiktok: false, linkedin: false, twitter: false });
    
    // Preview State
    const [activeTab, setActiveTab] = useState<'instagram' | 'tiktok' | 'linkedin' | 'twitter'>('instagram');
    const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({
        instagram: '', tiktok: '', linkedin: '', twitter: ''
    });

    const aiSuggestions = [
        "Announce summer flash sale",
        "Behind the scenes: curing process",
        "Ingredient spotlight: organic lavender",
        "Founder's story: why we started"
    ];

    const handleGenerate = async () => {
        if (!topic && !selectedProduct) return toast.error("Please enter a topic or select a product.");
        setIsGenerating(true);
        const toastId = toast.loading("Synthesizing multi-platform campaign...");
        
        try {
            const basePrompt = `Create social media content for: ${topic} ${selectedProduct ? `featuring product: ${selectedProduct}` : ''}. Use a luxurious, artisanal brand voice.`;
            
            // In a real app, we'd make parallel calls or one multi-part call
            // For now, we simulate generating specific content per platform
            const [igRes, tiktokRes, liRes, twRes] = await Promise.all([
                chatWithLola(`${basePrompt} Format for Instagram Feed (visual hook, engaging caption, emojis, 10 hashtags).`, null, 'fast'),
                chatWithLola(`${basePrompt} Format for TikTok Caption (short, punchy, trendy, 3-5 hashtags).`, null, 'fast'),
                chatWithLola(`${basePrompt} Format for LinkedIn Post (professional, storytelling, founder perspective, no emojis, 3 hashtags).`, null, 'fast'),
                chatWithLola(`${basePrompt} Format for Twitter/X (under 280 chars, sharp, witty, 2 hashtags).`, null, 'fast')
            ]);

            setGeneratedContent({
                instagram: igRes.text,
                tiktok: tiktokRes.text,
                linkedin: liRes.text,
                twitter: twRes.text
            });
            
            toast.success("Omnichannel campaign synthesized.", { id: toastId });
        } catch (error) {
            console.error("Generation failed", error);
            toast.error("Synthesis failed: Node offline.", { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePublish = (schedule: boolean) => {
        if (!generatedContent[activeTab]) return toast.error("Generate content first.");
        
        Object.entries(channels).forEach(([platform, isSelected]) => {
            if (isSelected && generatedContent[platform]) {
                addMarketingPost({
                    platform: platform as any,
                    topic: topic || selectedProduct || 'Social Post',
                    content: generatedContent[platform],
                    scheduledDate: schedule ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    status: schedule ? 'Draft' : 'Published',
                    type: 'Text'
                });
            }
        });
        
        toast.success(schedule ? "Campaign scheduled successfully." : "Campaign published to selected channels.");
        navigate('/marketing/calendar');
    };

    const activeContent = generatedContent[activeTab];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-8 space-y-12 pb-32 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Social Media Creator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Omnichannel campaign synthesizer with multi-format previews."
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COL: CONFIGURATION */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="p-8 bg-black/40 border-white/5 backdrop-blur-xl">
                        <div className="space-y-8">
                            <div>
                                <label className="flex items-center text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 ml-1">
                                    <Sparkles size={14} className="mr-2 text-[#C5A059]" /> AI Prompt Input
                                </label>
                                <textarea 
                                    value={topic} 
                                    onChange={(e) => setTopic(e.target.value)} 
                                    placeholder="Describe your campaign objective..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-sans font-light focus:bg-white/10 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 h-32 resize-none transition-all outline-none text-white"
                                />
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {aiSuggestions.map(sug => (
                                        <button 
                                            key={sug} 
                                            onClick={() => setTopic(sug)}
                                            className="px-3 py-1.5 rounded-full bg-[#6A2C91]/20 border border-[#6A2C91]/30 text-[#d8a8ff] text-[10px] font-medium tracking-wide hover:bg-[#6A2C91]/40 transition-colors"
                                        >
                                            {sug}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 ml-1">
                                    <Package size={14} className="mr-2 text-emerald-500" /> Featured Product Link
                                </label>
                                <Select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="h-14">
                                    <option value="">No product linked (Brand awareness)</option>
                                    {inventory.filter(i => i.stock > 0).map(item => (
                                        <option key={item.id} value={item.name}>{item.name} ({item.stock} in stock)</option>
                                    ))}
                                </Select>
                            </div>

                            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-gradient-to-r from-[#6A2C91] to-[#C5A059] text-white h-14 rounded-2xl shadow-lg border-none">
                                {isGenerating ? "Synthesizing Omnichannel Assets..." : "Generate Campaign"}
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6 bg-black/40 border-white/5 backdrop-blur-xl" title="Distribution Channels">
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            {[
                                { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
                                { id: 'tiktok', label: 'TikTok', icon: Film, color: 'text-white' },
                                { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400' },
                                { id: 'twitter', label: 'X (Twitter)', icon: Twitter, color: 'text-gray-300' }
                            ].map(platform => (
                                <label key={platform.id} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${channels[platform.id as keyof typeof channels] ? 'bg-[#6A2C91]/10 border-[#6A2C91]/50' : 'bg-white/5 border-white/10 opacity-60'}`}>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={channels[platform.id as keyof typeof channels]} 
                                        onChange={() => setChannels(prev => ({...prev, [platform.id]: !prev[platform.id as keyof typeof channels]}))}
                                    />
                                    <platform.icon size={18} className={`${platform.color} mr-3`} />
                                    <span className="text-sm font-medium text-white">{platform.label}</span>
                                    {channels[platform.id as keyof typeof channels] && <CheckCircle size={14} className="ml-auto text-[#6A2C91]" />}
                                </label>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* RIGHT COL: PREVIEW */}
                <div className="lg:col-span-7 flex flex-col h-full">
                    <Card className="flex-1 flex flex-col p-0 overflow-hidden bg-[#0A0A0A] border-white/10 shadow-2xl relative">
                        {/* Browser/Phone Header Frame */}
                        <div className="h-14 bg-[#111] border-b border-white/10 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5 mr-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <div className="flex flex-1 gap-2 overflow-x-auto scrollbar-hide">
                                {['instagram', 'tiktok', 'linkedin', 'twitter'].map((tab) => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`px-4 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:bg-white/5'}`}
                                    >
                                        {tab === 'instagram' && <Instagram size={14} />}
                                        {tab === 'tiktok' && <Film size={14} />}
                                        {tab === 'linkedin' && <Linkedin size={14} />}
                                        {tab === 'twitter' && <Twitter size={14} />}
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className="flex-1 p-8 relative flex items-center justify-center bg-[#050505]">
                            {activeContent ? (
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={activeTab}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full max-w-sm"
                                    >
                                        {/* Mock Phone Container */}
                                        <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl overflow-hidden min-h-[500px] flex flex-col relative border-8 border-[#1A1A1A]">
                                            {/* App Header Mock */}
                                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                                <div className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center text-white font-serif text-xs">AF</div>
                                                <div className="font-sans font-bold text-gray-900 text-sm">Artisan Flow</div>
                                            </div>
                                            {/* Media Mock */}
                                            <div className="w-full aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center border border-gray-200">
                                                <ImageIcon size={32} className="text-gray-300" />
                                            </div>
                                            {/* Caption */}
                                            <div className="text-sm text-gray-800 font-sans whitespace-pre-wrap leading-relaxed">
                                                {activeContent}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <div className="text-center opacity-30">
                                    <LayoutGrid size={64} className="mx-auto mb-4 text-white" />
                                    <p className="text-white font-serif text-lg">Awaiting Campaign Synthesis</p>
                                </div>
                            )}
                        </div>

                        {/* Action Footer */}
                        <div className="p-6 bg-[#111] border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/50 text-xs">
                                <CheckCircle size={14} className="text-emerald-500" /> Auto-sync enabled for selected channels
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" onClick={() => handlePublish(true)} disabled={!activeContent}>
                                    <Clock size={16} /> Schedule
                                </Button>
                                <Button variant="primary" onClick={() => handlePublish(false)} disabled={!activeContent}>
                                    <Send size={16} /> Publish Now
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};
