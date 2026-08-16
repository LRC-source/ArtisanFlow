import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../UI';
import { FileText, Loader2, ListTree, Image as ImageIcon, Sparkles, Plus, X, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanData } from '../DataContext';
import { chatWithLola } from '../../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';
import { toast } from 'sonner';

export const BlogGenerator = () => {
    const navigate = useNavigate();
    const { addMarketingPost } = useArtisanData();
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Form State
    const [topic, setTopic] = useState('');
    const [keywordInput, setKeywordInput] = useState('');
    const [keywords, setKeywords] = useState<string[]>(['sustainability', 'artisanal', 'wellness']);
    
    // Output State
    const [outline, setOutline] = useState<any[]>([]);
    const [generatedBlog, setGeneratedBlog] = useState('');
    const [featuredImage, setFeaturedImage] = useState<string | null>(null);

    const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && keywordInput.trim()) {
            if (!keywords.includes(keywordInput.trim())) {
                setKeywords([...keywords, keywordInput.trim()]);
            }
            setKeywordInput('');
        }
    };

    const removeKeyword = (kw: string) => {
        setKeywords(keywords.filter(k => k !== kw));
    };

    const generateOutline = async () => {
        if (!topic) return toast.error("Please enter a topic.");
        setIsGenerating(true);
        const toastId = toast.loading("Synthesizing SEO Structure...");
        
        try {
            const prompt = `Create a blog post outline about: ${topic}. Include these keywords: ${keywords.join(', ')}. Format as JSON array with { "type": "H1"|"H2"|"H3", "title": "string", "keywords": ["string"] }. Only return JSON.`;
            const result = await chatWithLola(prompt, null, 'fast');
            
            try {
                let jsonStr = result.text;
                if (jsonStr.includes('```json')) jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
                else if (jsonStr.includes('```')) jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
                const parsed = JSON.parse(jsonStr);
                setOutline(Array.isArray(parsed) ? parsed : [parsed]);
                toast.success("Outline generated.", { id: toastId });
            } catch (e) {
                toast.error("Failed to parse outline.", { id: toastId });
            }
        } catch (error) {
            toast.error("Synthesis failed: Node offline.", { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    const generateFullArticle = async () => {
        if (outline.length === 0) return toast.error("Generate an outline first.");
        setIsGenerating(true);
        const toastId = toast.loading("Drafting full article...");
        
        try {
            const prompt = `Write a comprehensive, SEO-optimized blog post based on this outline: ${JSON.stringify(outline)}. Use a luxurious, artisanal brand voice. Format with markdown headings.`;
            const result = await chatWithLola(prompt, null, 'deep');
            setGeneratedBlog(result.text);
            
            // Simulate auto-fetching a featured image from vault
            setFeaturedImage('https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop');
            
            toast.success("Article drafted successfully.", { id: toastId });
        } catch (error) {
            toast.error("Drafting failed.", { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!generatedBlog) return;
        addMarketingPost({
            platform: 'Blog',
            topic: topic || 'Blog Post',
            content: generatedBlog,
            scheduledDate: new Date().toISOString().split('T')[0],
            status: 'Draft',
            type: 'Text',
            mediaUrl: featuredImage || undefined
        });
        toast.success("Article saved to content calendar.");
        navigate('/marketing/calendar');
    };

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
                  title="Blog Generator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="SEO-optimized content synthesis node with structural preview"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="p-8 bg-black/40 border-white/5 backdrop-blur-xl">
                        <div className="space-y-8">
                            <div>
                                <label className="flex items-center text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 ml-1">
                                    <FileText size={14} className="mr-2 text-emerald-500" /> Article Topic
                                </label>
                                <Input 
                                    value={topic} 
                                    onChange={(e) => setTopic(e.target.value)} 
                                    placeholder="e.g., The Art of Sustainable Sourcing..."
                                    className="h-14 rounded-2xl bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 ml-1">
                                    <Search size={14} className="mr-2 text-[#C5A059]" /> Target SEO Keywords
                                </label>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-2 min-h-[56px] flex flex-wrap gap-2 items-center focus-within:border-[#C5A059]">
                                    {keywords.map(kw => (
                                        <Badge key={kw} color="gold" className="flex items-center gap-1 pl-3 pr-2 py-1.5 rounded-xl">
                                            {kw} <X size={12} className="cursor-pointer hover:text-white" onClick={() => removeKeyword(kw)} />
                                        </Badge>
                                    ))}
                                    <input 
                                        type="text" 
                                        value={keywordInput}
                                        onChange={(e) => setKeywordInput(e.target.value)}
                                        onKeyDown={handleAddKeyword}
                                        placeholder={keywords.length === 0 ? "Type and press enter..." : ""}
                                        className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none min-w-[120px] px-2 h-8"
                                    />
                                </div>
                            </div>

                            <Button onClick={generateOutline} disabled={isGenerating || !!generatedBlog} className="w-full bg-gradient-to-r from-[#111] to-[#222] border border-white/10 text-white h-14 rounded-2xl shadow-lg">
                                {isGenerating && !generatedBlog ? <Loader2 className="animate-spin mr-2" /> : <ListTree className="mr-2" />}
                                {isGenerating && !generatedBlog ? "Analyzing SERP..." : "1. Generate Structure Outline"}
                            </Button>
                        </div>
                    </Card>

                    {/* Outline Preview */}
                    <AnimatePresence>
                        {outline.length > 0 && !generatedBlog && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                <Card className="p-6 bg-[#0A0A0A] border-white/10" title="Proposed Structure">
                                    <div className="space-y-4 mt-6">
                                        {outline.map((node, i) => (
                                            <div key={i} className={`flex items-start gap-3 ${node.type === 'H1' ? 'ml-0' : node.type === 'H2' ? 'ml-6' : 'ml-12'}`}>
                                                <Badge color={node.type === 'H1' ? 'purple' : 'gray'}>{node.type}</Badge>
                                                <div>
                                                    <p className={`text-white font-serif ${node.type === 'H1' ? 'text-lg font-bold' : 'text-md'}`}>{node.title}</p>
                                                    {node.keywords && node.keywords.length > 0 && (
                                                        <p className="text-xs text-emerald-500/70 font-mono mt-1 flex gap-2">
                                                            {node.keywords.map((k: string) => <span key={k}>#{k}</span>)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <Button onClick={generateFullArticle} disabled={isGenerating} className="w-full mt-6 bg-[#6A2C91] hover:bg-[#5a257a] text-white h-14 rounded-2xl shadow-lg border-none">
                                            {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                                            2. Synthesize Full Article
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Output Panel */}
                <div className="lg:col-span-7 h-full min-h-[600px]">
                    <Card className="h-full flex flex-col p-0 overflow-hidden bg-[#0A0A0A] border-white/10 shadow-2xl relative">
                        {generatedBlog ? (
                            <div className="flex flex-col h-full">
                                <div className="h-14 bg-[#111] border-b border-white/10 flex items-center px-6 justify-between shrink-0">
                                    <h3 className="text-white/80 font-serif flex items-center gap-2">
                                        <FileText size={18} className="text-emerald-500" /> Article Editor
                                    </h3>
                                    <Badge color="green"><CheckCircle size={12} className="mr-1 inline"/> SEO Optimized</Badge>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-8 bg-black/40 space-y-6">
                                    {featuredImage && (
                                        <div className="relative w-full h-64 rounded-2xl overflow-hidden group">
                                            <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <Button variant="outline" className="border-white text-white bg-black/50 hover:bg-black/80">
                                                    <ImageIcon size={16} className="mr-2" /> Change Featured Image
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    <textarea 
                                        value={generatedBlog}
                                        onChange={(e) => setGeneratedBlog(e.target.value)}
                                        className="w-full min-h-[800px] bg-transparent border-none text-gray-300 font-sans text-base resize-none focus:outline-none leading-relaxed"
                                    />
                                </div>

                                <div className="p-6 bg-[#111] border-t border-white/10 flex justify-end gap-4 shrink-0">
                                    <Button onClick={handleSave} className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl font-sans font-medium uppercase tracking-widest text-xs">
                                        Approve & Schedule
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <FileText size={64} className="mx-auto mb-4 text-white" />
                                <p className="text-white font-serif text-lg">Awaiting SEO Parameters</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};
