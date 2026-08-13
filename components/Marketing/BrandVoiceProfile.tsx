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

export const BrandVoiceProfile = () => {
    const navigate = useNavigate();
    
    // Business DNA
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [primaryFont, setPrimaryFont] = useState('Inter (Sans-serif)');
    const [secondaryFont, setSecondaryFont] = useState('Playfair Display (Serif)');
    const [primaryColor, setPrimaryColor] = useState('#000000');
    const [secondaryColor, setSecondaryColor] = useState('#C5A059');
    const [brandValues, setBrandValues] = useState('Excellence, Sustainability, Artisanship');
    const [tagline, setTagline] = useState('Crafting the extraordinary.');
    
    // Linguistic Architecture
    const [adjectives, setAdjectives] = useState('Luxurious, Artisanal, Precise, Bold');
    const [restrictedWords, setRestrictedWords] = useState('Cheap, Discount, Mass-produced');
    const [targetAudience, setTargetAudience] = useState('High-end wellness consumers and boutique retailers.');
    const [tone, setTone] = useState('Authoritative & Elegant');
    
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Business DNA & Voice Profile updated successfully.");
        }, 1000);
    };

    const handleGenerateBrandBook = () => {
        setIsGenerating(true);
        const toastId = toast.loading("Synthesizing Brand Book & Asset Site...");
        setTimeout(() => {
            setIsGenerating(false);
            toast.success("Brand Book generated and added to Vault.", { id: toastId });
        }, 2000);
    };
    
    const handleLogoUpload = (files: File[]) => {
        if (files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(files[0]);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <ContextualTutorialModal
                hubId="brand_voice"
                title="Brand Voice Profile"
                description="Define and enforce your brands unique tone and style."
                steps={["Upload reference materials to train the AI.","Select core brand adjectives.","Establish restricted vocabulary to avoid off-brand messaging."]}
            />
            <div className="flex flex-col gap-4 sm:p-8">
                <SubPageHeader 
                  title="Business DNA & Brand Voice"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Core identity matrix: visual, linguistic, and strategic brand parameters."
                />
                
                <VaultBanner 
                  title="Business DNA"
                  subtitle="Core identity matrix: Define the visual and linguistic parameters that represent your brand's essence."
                  badge="DNA Protocol Active"
                >
                  <div className="flex gap-4">
                    <Button 
                        variant="primary"
                        className="bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-8 rounded-full shadow-2xl shadow-black/20 transition-all"
                        onClick={handleGenerateBrandBook}
                        disabled={isGenerating}
                    >
                        {isGenerating ? <Loader2 className="animate-spin mr-3" size={16} /> : <FileText size={16} className="mr-3"/>}
                        GENERATE BRAND BOOK
                    </Button>
                    <Button 
                        variant="primary"
                        className="bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 rounded-full shadow-2xl shadow-[#6A2C91]/20 transition-all"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="animate-spin mr-3" size={16} /> : <CheckCircle size={16} className="mr-3"/>}
                        COMMIT DNA PROTOCOL
                    </Button>
                  </div>
                </VaultBanner>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-10">
                <Card title="Visual DNA (Assets & Styling)" className="luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-8 mt-4">
                        <div>
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Master Logo</label>
                            <FileUploader onUpload={handleLogoUpload} acceptedFormats=".svg, .png, .jpg" label="Upload Primary Logo" />
                            {logoPreview && (
                                <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-center">
                                    <img src={logoPreview} alt="Brand Logo" className="h-16 object-contain" />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Primary Font</label>
                                <Input value={primaryFont} onChange={(e) => setPrimaryFont(e.target.value)} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Secondary Font</label>
                                <Input value={secondaryFont} onChange={(e) => setSecondaryFont(e.target.value)} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Primary Color (Hex)</label>
                                <div className="flex gap-3 items-center">
                                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-14 h-14 rounded-2xl bg-transparent border-0 cursor-pointer" />
                                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 h-14 rounded-2xl bg-black/40 border-white/10 text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Accent Color (Hex)</label>
                                <div className="flex gap-3 items-center">
                                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-14 h-14 rounded-2xl bg-transparent border-0 cursor-pointer" />
                                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1 h-14 rounded-2xl bg-black/40 border-white/10 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Strategic DNA & Tone" className="luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-8 mt-4">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Brand Tagline</label>
                                <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g., Crafting the extraordinary." className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Core Values</label>
                                <Input value={brandValues} onChange={(e) => setBrandValues(e.target.value)} placeholder="e.g., Excellence, Sustainability..." className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Brand Adjectives (Comma separated)</label>
                            <Input value={adjectives} onChange={(e) => setAdjectives(e.target.value)} placeholder="e.g., Luxurious, Artisanal..." className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Target Audience</label>
                            <textarea 
                                value={targetAudience} 
                                onChange={(e) => setTargetAudience(e.target.value)} 
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm font-sans font-light text-gray-300 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 h-24 resize-none transition-all shadow-sm outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Primary Tone</label>
                                <Select value={tone} onChange={(e) => setTone(e.target.value)} className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm">
                                    <option className="bg-black">Authoritative & Elegant</option>
                                    <option className="bg-black">Warm & Approachable</option>
                                    <option className="bg-black">Technical & Precise</option>
                                    <option className="bg-black">Bold & Disruptive</option>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Restricted Vocabulary</label>
                                <Input value={restrictedWords} onChange={(e) => setRestrictedWords(e.target.value)} placeholder="Words AI should never use" className="h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="lg:col-span-2">
                    <Card title="AI Persona Preview" className="luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/20 backdrop-blur-xl">
                        <div className="space-y-8 mt-4">
                            <p className="text-sm text-gray-500 font-sans font-light leading-relaxed">
                                Based on your current parameters, Lola will generate content that aligns with your DNA:
                            </p>
                            <div className="p-4 sm:p-8 bg-black/40 border border-white/10 rounded-3xl shadow-sm italic text-gray-300 font-serif text-lg leading-relaxed">
                                "Discover the uncompromising precision of our latest artisanal collection. Crafted for those who demand excellence, each piece reflects our dedication to bold innovation and luxurious quality. {tagline}"
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {adjectives.split(',').map(adj => adj.trim()).filter(Boolean).map((adj, i) => (
                                    <Badge key={i} color="purple" className="text-[#6A2C91] border-[#6A2C91]/20 bg-[#6A2C91]/10 px-4 py-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] rounded-full">{adj}</Badge>
                                ))}
                                {brandValues.split(',').map(val => val.trim()).filter(Boolean).map((val, i) => (
                                    <Badge key={`v-${i}`} color="gold" className="text-[#C5A059] border-[#C5A059]/20 bg-[#C5A059]/10 px-4 py-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] rounded-full">{val}</Badge>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

