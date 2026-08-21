import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../UI';
import { Loader2, Zap, FileText, Globe, Mail, Sparkles, Sliders, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanData } from '../DataContext';
import { chatWithLola } from '../../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';
import { toast } from 'sonner';

export const AdvancedContentGenerator = () => {
    const navigate = useNavigate();
    const { addMarketingPost } = useArtisanData();
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [topic, setTopic] = useState('');
    const [campaignGoal, setCampaignGoal] = useState('Brand Awareness');
    const [activeTab, setActiveTab] = useState<'newsletter' | 'press' | 'landing'>('newsletter');
    const [wordCount, setWordCount] = useState(500);
    
    const [outputs, setOutputs] = useState<{
        newsletter: string;
        press: string;
        landing: string;
    }>({ newsletter: '', press: '', landing: '' });

    const handleGenerate = async () => {
        if (!topic) return toast.error("Please enter a campaign topic.");
        setIsGenerating(true);
        const toastId = toast.loading(`Synthesizing ${activeTab} content...`);
        
        try {
            let prompt = `Write a comprehensive marketing piece for an artisanal luxury brand. Topic: ${topic}. Goal: ${campaignGoal}. Target word count: ~${wordCount} words. `;
            
            if (activeTab === 'newsletter') {
                prompt += "Format as an engaging email newsletter with a subject line, hook, body, and clear Call to Action.";
            } else if (activeTab === 'press') {
                prompt += "Format as a formal Press Release (FOR IMMEDIATE RELEASE, Dateline, Headline, body paragraphs, and boilerplate).";
            } else if (activeTab === 'landing') {
                prompt += "Format as high-converting Landing Page Copy (Hero headline, sub-headline, 3 key benefits/features, social proof section, and final CTA).";
            }

            const result = await chatWithLola(prompt, null, 'deep');
            
            setOutputs(prev => ({
                ...prev,
                [activeTab]: result.text
            }));
            
            toast.success("Content synthesis complete.", { id: toastId });
        } catch (error) {
            console.error("Generation failed", error);
            toast.error("Synthesis failed: Node offline.", { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!outputs[activeTab]) return;
        
        addMarketingPost({
            platform: activeTab === 'newsletter' ? 'Email' : 'Blog',
            topic: `${topic} - ${activeTab.toUpperCase()}`,
            content: outputs[activeTab],
            scheduledDate: new Date().toISOString().split('T')[0],
            status: 'Draft',
            type: 'Text'
        });
        
        toast.success(`Saved ${activeTab} to Drafts.`);
        navigate('/marketing/calendar');
    };

    const renderSlider = () => (
        <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-sans font-medium uppercase tracking-widest text-gray-500">
                <span>Target Length</span>
                <span className="text-[#C5A059] font-bold">{wordCount} words</span>
            </div>
            <input 
                type="range" 
                min="100" max="2000" step="100"
                value={wordCount} 
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
            />
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-3.5 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 lg:space-y-12 pb-8 sm:pb-12 lg:pb-20 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Advanced Generator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Long-form cognitive synthesis for email, press, and web."
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 sm:p-5 lg:p-6">
                {/* Configuration Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="luxury-card border-white/10 rounded-3xl p-4 sm:p-6 sm:p-8 bg-black/40 backdrop-blur-xl">
                        <div className="space-y-8">
                            <div>
                                <label className="flex items-center text-[10px] font-black text-white sm:text-white/40 uppercase tracking-widest mb-3 ml-1">
                                    <Sparkles size={14} className="mr-2 text-magenta-500" /> Core Topic / Campaign
                                </label>
                                <textarea 
                                    value={topic} 
                                    onChange={(e) => setTopic(e.target.value)} 
                                    placeholder="e.g., Summer Solstice Collection Launch" 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-sans font-light focus:bg-white/10 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 h-28 resize-none transition-all outline-none text-white shadow-sm" 
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center text-[10px] font-black text-white sm:text-white/40 uppercase tracking-widest mb-3 ml-1">
                                    <Globe size={14} className="mr-2 text-blue-400" /> Campaign Goal
                                </label>
                                <Select value={campaignGoal} onChange={(e) => setCampaignGoal(e.target.value)} className="w-auto mx-auto py-1 px-3 text-[10px] rounded-2xl bg-white/5 border-white/10 text-white font-sans text-sm shadow-sm">
                                    <option className="bg-black">Brand Awareness</option>
                                    <option className="bg-black">Lead Generation</option>
                                    <option className="bg-black">Direct Sales</option>
                                    <option className="bg-black">Customer Retention</option>
                                </Select>
                            </div>
                            
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                                {renderSlider()}
                            </div>

                            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white w-auto mx-auto py-1 px-3 text-[10px] rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.2em] shadow-xl border-none transition-all">
                                {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Zap size={14} className="mr-2" />}
                                {isGenerating ? "Synthesizing..." : `Generate ${activeTab}`}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Output Panel */}
                <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
                    <Card className="flex-1 border-white/10 rounded-3xl p-0 bg-black/20 backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
                        
                        {/* Tab Headers */}
                        <div className="h-16 bg-[#111] border-b border-white/10 flex items-center px-4 gap-2">
                            <button 
                                onClick={() => setActiveTab('newsletter')}
                                className={`flex-1 flex items-center justify-center gap-2 w-auto mx-auto py-1 px-3 text-[10px] rounded-xl text-xs font-sans font-medium uppercase tracking-widest transition-all ${activeTab === 'newsletter' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Mail size={16} /> Newsletter
                            </button>
                            <button 
                                onClick={() => setActiveTab('press')}
                                className={`flex-1 flex items-center justify-center gap-2 w-auto mx-auto py-1 px-3 text-[10px] rounded-xl text-xs font-sans font-medium uppercase tracking-widest transition-all ${activeTab === 'press' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                <FileText size={16} /> Press Release
                            </button>
                            <button 
                                onClick={() => setActiveTab('landing')}
                                className={`flex-1 flex items-center justify-center gap-2 w-auto mx-auto py-1 px-3 text-[10px] rounded-xl text-xs font-sans font-medium uppercase tracking-widest transition-all ${activeTab === 'landing' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Globe size={16} /> Landing Page
                            </button>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 p-4 sm:p-6 bg-black/40 overflow-y-auto">
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full"
                                >
                                    {outputs[activeTab] ? (
                                        <textarea 
                                            value={outputs[activeTab]}
                                            onChange={(e) => setOutputs({...outputs, [activeTab]: e.target.value})}
                                            className="w-full h-full min-h-[250px] sm:min-h-[300px] w-full max-w-full overflow-hidden bg-transparent border-none text-white sm:text-gray-300 font-sans text-sm leading-relaxed resize-none focus:outline-none"
                                        />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center py-6 sm:py-12 lg:py-16 px-4 sm:px-8 opacity-30 text-center">
                                            {activeTab === 'newsletter' && <Mail size={64} className="text-white mb-6" />}
                                            {activeTab === 'press' && <FileText size={64} className="text-white mb-6" />}
                                            {activeTab === 'landing' && <Globe size={64} className="text-white mb-6" />}
                                            <p className="text-sm sm:text-base text-[11px] font-sans font-medium text-white uppercase tracking-[0.2em]">Awaiting {activeTab} parameters</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Action Footer */}
                        <div className="h-20 bg-[#111] border-t border-white/10 flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between px-6 shrink-0">
                            <Badge color="gray">Est. Length: {outputs[activeTab] ? outputs[activeTab].split(' ').length : 0} words</Badge>
                            <Button 
                                onClick={handleSave} 
                                disabled={!outputs[activeTab]}
                                className="bg-[#6A2C91] hover:bg-[#552374] text-white w-auto mx-auto py-1 px-3 text-[10px] px-8 rounded-xl font-sans font-medium text-[11px] uppercase tracking-[0.2em] shadow-xl border-none"
                            >
                                <CheckCircle size={14} className="mr-2" /> Save {activeTab} to Drafts
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};
