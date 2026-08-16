import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge, VaultBanner } from '../UI';
import { CheckCircle, FileText, Loader2, Target, Sliders, Users, Sparkles, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';
import { toast } from 'sonner';

export const BrandVoiceProfile = () => {
    const navigate = useNavigate();
    
    // Linguistic Architecture
    const [tagline, setTagline] = useState('Crafting the extraordinary.');
    const [adjectives, setAdjectives] = useState('Luxurious, Artisanal, Precise, Bold');
    const [restrictedWords, setRestrictedWords] = useState('Cheap, Discount, Mass-produced');
    
    // Tone Sliders
    const [toneFormal, setToneFormal] = useState(70); // 0 = Playful, 100 = Formal
    const [toneSalesy, setToneSalesy] = useState(30); // 0 = Educational, 100 = Salesy
    const [toneComplex, setToneComplex] = useState(60); // 0 = Simple, 100 = Complex/Technical
    
    // Personas
    const [activePersona, setActivePersona] = useState('0');
    const personas = [
        { id: '0', name: 'High-End Retailer', description: 'Boutique owners looking for premium shelf products. Values margins and exclusivity.' },
        { id: '1', name: 'Wellness Enthusiast', description: 'Individual consumers focused on organic, sustainable, and luxurious self-care rituals.' },
        { id: '2', name: 'Corporate Gifter', description: 'HR managers seeking high-quality, memorable gifts for VIP clients and employees.' }
    ];

    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Voice Matrix calibrated successfully.");
        }, 1000);
    };

    const handleGenerateBrandBook = () => {
        setIsGenerating(true);
        const toastId = toast.loading("Synthesizing Voice Matrix Documentation...");
        setTimeout(() => {
            setIsGenerating(false);
            toast.success("Matrix Book generated and added to Vault.", { id: toastId });
        }, 2000);
    };

    const renderSlider = (val: number, setVal: (v: number) => void, leftLabel: string, rightLabel: string) => (
        <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-sans font-medium uppercase tracking-widest text-gray-500">
                <span className={val < 50 ? "text-[#C5A059]" : ""}>{leftLabel}</span>
                <span className={val > 50 ? "text-[#C5A059]" : ""}>{rightLabel}</span>
            </div>
            <input 
                type="range" 
                min="0" max="100" 
                value={val} 
                onChange={(e) => setVal(parseInt(e.target.value))}
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
            className="p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <div className="flex flex-col gap-4 sm:p-8">
                <SubPageHeader 
                  title="Brand Voice Profile"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Lola Voice Matrix calibration and target persona management."
                />
                
                <VaultBanner 
                  title="Lola Voice Matrix"
                  subtitle="Calibrate the linguistic parameters that define how Lola speaks on behalf of your brand."
                  badge="Matrix Active"
                >
                  <div className="flex gap-4">
                    <Button 
                        variant="primary"
                        className="bg-black/40 hover:bg-black/60 border border-white/10 text-white font-sans font-medium text-[11px] tracking-[0.2em] h-14 px-8 rounded-full shadow-2xl transition-all"
                        onClick={handleGenerateBrandBook}
                        disabled={isGenerating}
                    >
                        {isGenerating ? <Loader2 className="animate-spin mr-3" size={16} /> : <FileText size={16} className="mr-3"/>}
                        EXPORT MATRIX
                    </Button>
                    <Button 
                        variant="primary"
                        className="bg-gradient-to-r from-[#C5A059] to-[#b08e4d] border-none text-white font-sans font-medium text-[11px] tracking-[0.2em] h-14 px-10 rounded-full shadow-2xl transition-all"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="animate-spin mr-3" size={16} /> : <CheckCircle size={16} className="mr-3"/>}
                        COMMIT CALIBRATION
                    </Button>
                  </div>
                </VaultBanner>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:p-8">
                {/* Sliders */}
                <Card title="Lola Voice Matrix Calibration" className="luxury-card border-white/10 rounded-3xl p-6 bg-black/40 backdrop-blur-xl">
                    <div className="space-y-10 mt-6">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-8">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <Sliders className="text-[#C5A059]" size={20} />
                                <h3 className="text-white font-serif tracking-wide">Tone Adjustments</h3>
                            </div>
                            {renderSlider(toneFormal, setToneFormal, "Playful & Casual", "Formal & Authoritative")}
                            {renderSlider(toneSalesy, setToneSalesy, "Educational & Value-Driven", "Sales & Conversion-Oriented")}
                            {renderSlider(toneComplex, setToneComplex, "Simple & Accessible", "Technical & Sophisticated")}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-sans font-medium text-gray-500 uppercase tracking-widest mb-3 ml-1">Brand Adjectives (Comma separated)</label>
                                <Input value={adjectives} onChange={(e) => setAdjectives(e.target.value)} placeholder="e.g., Luxurious, Artisanal..." className="h-14 rounded-2xl bg-white/5 border-white/10 text-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans font-medium text-gray-500 uppercase tracking-widest mb-3 ml-1">Restricted Vocabulary</label>
                                <Input value={restrictedWords} onChange={(e) => setRestrictedWords(e.target.value)} placeholder="Words AI should never use" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Personas */}
                <Card title="Saved Target Personas" className="luxury-card border-white/10 rounded-3xl p-6 bg-black/40 backdrop-blur-xl flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="text-[#6A2C91]" size={20} />
                        <h3 className="text-white font-sans text-sm font-medium">Audience Segmentation</h3>
                    </div>
                    <div className="space-y-4 flex-1">
                        {personas.map(persona => (
                            <div 
                                key={persona.id} 
                                onClick={() => setActivePersona(persona.id)}
                                className={`p-5 rounded-2xl border cursor-pointer transition-all ${activePersona === persona.id ? 'bg-[#6A2C91]/20 border-[#6A2C91]/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-white font-serif tracking-tight">{persona.name}</h4>
                                    {activePersona === persona.id && <Badge color="purple">Active</Badge>}
                                </div>
                                <p className="text-sm font-light text-gray-400">{persona.description}</p>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full h-14 border-dashed border-white/20 text-gray-400 hover:text-white rounded-2xl mt-4">
                            <Plus size={16} className="mr-2" /> Add New Persona
                        </Button>
                    </div>
                </Card>

                {/* Preview */}
                <div className="lg:col-span-2">
                    <Card className="border-white/10 rounded-3xl p-8 bg-gradient-to-br from-black/60 to-[#6A2C91]/10 backdrop-blur-xl relative overflow-hidden">
                        <Wand2 size={120} className="absolute -right-10 -bottom-10 text-[#6A2C91]/10 transform -rotate-12" />
                        <div className="relative z-10 space-y-6 max-w-4xl">
                            <h3 className="text-[#C5A059] font-serif text-xl flex items-center gap-3">
                                <Sparkles size={20} /> Output Calibration Preview
                            </h3>
                            <p className="text-sm text-gray-400 font-sans font-light">
                                Based on your current Matrix settings and the <strong className="text-white">[{personas.find(p => p.id === activePersona)?.name}]</strong> persona, Lola will generate content with this linguistic signature:
                            </p>
                            <div className="p-6 sm:p-8 bg-black/40 border-l-4 border-[#C5A059] rounded-r-3xl shadow-lg italic text-gray-200 font-serif text-lg leading-relaxed">
                                {toneFormal > 50 
                                    ? `"Discover the uncompromising precision of our latest artisanal collection. Crafted for those who demand excellence, each piece reflects our dedication to bold innovation."`
                                    : `"Ready to elevate your everyday? Our new collection brings serious artisanal vibes right to your door. You've never seen precision like this before!"`}
                            </div>
                            <div className="flex flex-wrap gap-2 pt-4">
                                {adjectives.split(',').map(adj => adj.trim()).filter(Boolean).map((adj, i) => (
                                    <Badge key={i} color="gold" className="text-[10px] tracking-widest">{adj}</Badge>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};
