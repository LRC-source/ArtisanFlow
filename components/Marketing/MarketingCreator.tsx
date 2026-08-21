import React, { useState } from 'react';
import { Card, Button, Select, Badge } from '../UI';
import { Sparkles, Image as ImageIcon, Loader2, Package, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanData } from '../DataContext';
import { generateLolaImage } from '../../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';
import { toast } from 'sonner';

export const MarketingCreator = () => {
    const navigate = useNavigate();
    const { addMarketingPost, inventory } = useArtisanData();
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [topic, setTopic] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [assetType, setAssetType] = useState('Product Photo');
    const [style, setStyle] = useState('Photorealistic');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const aiSuggestions = [
        "Minimalist studio lighting on marble",
        "Golden hour nature lifestyle shot",
        "Dark moody aesthetic with neon accents",
        "Soft pastel colors with floral props"
    ];

    const handleGenerate = async () => {
        if (!topic && !selectedProduct) return toast.error("Please enter a topic or select a product.");
        setIsGenerating(true);
        setGeneratedImage(null);
        const toastId = toast.loading("Synthesizing high-fidelity asset...");
        try {
            const productContext = selectedProduct ? ` featuring ${selectedProduct}` : '';
            const prompt = `Generate a high-quality ${style} image for a ${assetType}${productContext}. Subject: ${topic}. Luxurious lighting, artisanal depth.`;
            const imageUrl = await generateLolaImage(prompt, { size: imageSize, aspectRatio });
            setGeneratedImage(imageUrl);
            toast.success("Asset synthesis complete.", { id: toastId });
        } catch (error: any) {
            console.error("Generation failed", error);
            toast.error("Synthesis failed: Node offline.", { id: toastId });
        } finally { 
            setIsGenerating(false); 
        }
    };

    const handleSave = () => {
        if (!generatedImage) return;
        addMarketingPost({
            platform: 'Instagram', 
            topic: topic || selectedProduct || 'Marketing Asset',
            content: `New ${assetType}`,
            scheduledDate: new Date().toISOString().split('T')[0],
            status: 'Draft', 
            type: 'Image', 
            mediaUrl: generatedImage
        });
        toast.success("Asset saved to approvals vault.");
        navigate('/marketing/approvals');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-3.5 sm:p-6 lg:p-12 max-w-7xl mx-auto space-y-6 sm:space-y-10 lg:space-y-12 pb-24"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Marketing Creator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Synthesize high-fidelity visual assets with Nano Banana Pro."
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 sm:p-5 lg:p-6">
                {/* Configuration Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="luxury-card p-4 sm:p-6 bg-black/40 backdrop-blur-xl border-white/10">
                        <div className="space-y-6">
                            {/* Product Selector */}
                            <div>
                                <label className="flex items-center text-[10px] font-black text-white sm:text-white/40 uppercase tracking-widest mb-3 ml-1">
                                    <Package size={14} className="mr-2 text-emerald-500" /> Featured Product
                                </label>
                                <Select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="h-14">
                                    <option value="">No product linked (Abstract Concept)</option>
                                    {inventory.filter(i => i.stock > 0).map(item => (
                                        <option key={item.id} value={item.name}>{item.name} ({item.stock} in stock)</option>
                                    ))}
                                </Select>
                            </div>

                            {/* Prompt Input & Pills */}
                            <div>
                                <label className="flex items-center text-[10px] font-black text-white sm:text-white/40 uppercase tracking-widest mb-3 ml-1">
                                    <Wand2 size={14} className="mr-2 text-[#C5A059]" /> Visual Description
                                </label>
                                <textarea 
                                    placeholder="Describe your image with high-sensory detail..." 
                                    value={topic} 
                                    onChange={(e) => setTopic(e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-sans font-light focus:bg-white/10 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 h-28 resize-none transition-all outline-none text-white"
                                />
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {aiSuggestions.map(sug => (
                                        <button 
                                            key={sug} 
                                            onClick={() => setTopic(sug)}
                                            className="px-3 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-[10px] font-medium tracking-wide hover:bg-[#C5A059]/20 transition-colors"
                                        >
                                            {sug}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-[10px] font-sans font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">Manifest Type</label>
                                    <Select value={assetType} onChange={(e) => setAssetType(e.target.value)} className="w-auto mx-auto py-1 px-3 text-[10px] bg-white/5 border-white/10">
                                        <option className="bg-black">Product Photo</option>
                                        <option className="bg-black">Social Media Post</option>
                                        <option className="bg-black">Email Header</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-sans font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">Resolution Node</label>
                                    <Select value={imageSize} onChange={(e) => setImageSize(e.target.value as any)} className="w-auto mx-auto py-1 px-3 text-[10px] bg-white/5 border-white/10">
                                        <option value="1K" className="bg-black">Standard 1K</option>
                                        <option value="2K" className="bg-black">High Definition 2K</option>
                                        <option value="4K" className="bg-black">Cinema Quality 4K</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-sans font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">Aspect Ratio</label>
                                    <Select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-auto mx-auto py-1 px-3 text-[10px] bg-white/5 border-white/10">
                                        <option value="1:1" className="bg-black">Square (1:1)</option>
                                        <option value="16:9" className="bg-black">Landscape (16:9)</option>
                                        <option value="9:16" className="bg-black">Portrait (9:16)</option>
                                        <option value="4:5" className="bg-black">Vertical (4:5)</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-sans font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">Aesthetic Style</label>
                                    <Select value={style} onChange={(e) => setStyle(e.target.value)} className="w-auto mx-auto py-1 px-3 text-[10px] bg-white/5 border-white/10">
                                        <option className="bg-black">Photorealistic</option>
                                        <option className="bg-black">Minimalist</option>
                                        <option className="bg-black">Vibrant</option>
                                    </Select>
                                </div>
                            </div>

                            <Button onClick={handleGenerate} className="w-full bg-gradient-to-r from-[#C5A059] to-[#b08e4d] text-white w-auto mx-auto py-1 px-3 text-[10px] rounded-2xl shadow-lg border-none" disabled={isGenerating}>
                                {isGenerating ? <Loader2 className="animate-spin mr-3" size={18} /> : <Sparkles size={18} className="mr-3" />}
                                {isGenerating ? 'Synthesizing Pixels...' : 'Initialize Visual Generation'}
                            </Button>
                        </div>
                    </Card>
                </div>
                
                {/* Preview Panel */}
                <div className="lg:col-span-7 h-full">
                    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[600px] h-full relative group hover:bg-black/30 transition-all duration-500 overflow-hidden shadow-sm">
                        <AnimatePresence mode="wait">
                            {generatedImage ? (
                                <motion.div 
                                    key="generated-image"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full h-full flex flex-col items-center p-4 sm:p-5 lg:p-6"
                                >
                                    <div className="flex-1 w-full flex items-center justify-center mb-8">
                                        <img src={generatedImage} alt="Generated" className="max-w-full max-min-h-[300px] sm:py-8 sm:py-16 px-4 sm:px-8 sm:min-h-[320px] h-auto aspect-video sm:aspect-auto w-full max-w-full overflow-hidden object-contain rounded-2xl shadow-2xl border border-white/10" />
                                    </div>
                                    <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md mx-auto">
                                        <Button variant="outline" onClick={() => setGeneratedImage(null)} className="flex-1 w-auto mx-auto py-1 px-3 text-[10px] rounded-full text-xs font-sans font-medium text-white sm:text-gray-400 border-white/10 hover:bg-white/5">Discard Node</Button>
                                        <Button onClick={handleSave} className="flex-[2] bg-[#6A2C91] hover:bg-[#5a257a] text-white w-auto mx-auto py-1 px-3 text-[10px] rounded-full font-sans font-medium text-xs tracking-wide shadow-md">Approve & Send to Vault</Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-6"
                                >
                                    <div className="w-14 h-14 sm:w-24 sm:h-24 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-white/20 mx-auto shadow-sm group-hover:scale-105 transition-transform duration-700 border border-white/10">
                                        <ImageIcon size={40} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-sm sm:text-base font-sans text-gray-500 uppercase tracking-widest">Output Preview Node</p>
                                        <p className="text-sm sm:text-base text-white sm:text-gray-400 font-serif italic mt-2">Awaiting Pulse</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
