import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../UI';
import { Video, Loader2, Film, Music, Mic, Play, Send, Clapperboard, MonitorPlay, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanData } from '../DataContext';
import { chatWithLola } from '../../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';
import { toast } from 'sonner';

export const VideoCreator = () => {
    const navigate = useNavigate();
    const { addMarketingPost } = useArtisanData();
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Form State
    const [topic, setTopic] = useState('');
    const [duration, setDuration] = useState('15 Seconds (Reel/Short)');
    const [audioTrack, setAudioTrack] = useState('Trending Lo-Fi Beats');
    
    // Output State
    const [generatedScript, setGeneratedScript] = useState('');
    const [storyboard, setStoryboard] = useState<any[]>([]);

    const audioOptions = [
        "Trending Lo-Fi Beats",
        "Upbeat Pop (Viral)",
        "Calm Acoustic/Nature",
        "Original Voiceover Only",
        "Dramatic Cinematic"
    ];

    const handleGenerate = async () => {
        if (!topic) return toast.error("Please enter a video topic.");
        setIsGenerating(true);
        const toastId = toast.loading("Synthesizing script and storyboard frames...");
        
        try {
            const prompt = `Write a video script for a ${duration} video about: ${topic}. Format the response as a JSON array of scenes. Each scene object must have these keys: 'time' (e.g. "0:00-0:03"), 'visual' (description of the shot), 'audio' (voiceover or sound effect), and 'caption' (on-screen text). Make it luxurious and artisanal. Return ONLY valid JSON.`;
            
            const result = await chatWithLola(prompt, null, 'fast');
            
            // Try to parse JSON from Lola
            try {
                let jsonStr = result.text;
                // strip markdown if any
                if (jsonStr.includes('```json')) {
                    jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
                } else if (jsonStr.includes('```')) {
                    jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
                }
                const frames = JSON.parse(jsonStr);
                setStoryboard(Array.isArray(frames) ? frames : [frames]);
                
                // Construct a raw script for fallback viewing
                const rawScript = Array.isArray(frames) ? frames.map(f => `[${f.time}] VISUAL: ${f.visual}\nAUDIO: ${f.audio}\nCAPTION: ${f.caption}`).join('\n\n') : jsonStr;
                setGeneratedScript(rawScript);
                
                toast.success("Script synthesis complete.", { id: toastId });
            } catch (e) {
                // Fallback if not valid JSON
                setGeneratedScript(result.text);
                setStoryboard([]);
                toast.success("Script generated (raw format).", { id: toastId });
            }
            
        } catch (error) {
            console.error("Generation failed", error);
            toast.error("Synthesis failed: Node offline.", { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!generatedScript) return;
        addMarketingPost({
            platform: 'Instagram', // Defaulting to IG Reels for now
            topic: topic || 'Video Script',
            content: `[AUDIO: ${audioTrack}]\n\n${generatedScript}`,
            scheduledDate: new Date().toISOString().split('T')[0],
            status: 'Draft',
            type: 'Video'
        });
        toast.success("Video blueprint saved to vault.");
        navigate('/marketing/approvals');
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
                  title="Video Creator"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="AI Script Generator & Storyboard Visualizer for Reels/TikToks"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="p-8 bg-black/40 border-white/5 backdrop-blur-xl">
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 ml-1">
                                    <Clapperboard size={14} className="mr-2 text-magenta-500" /> Video Concept
                                </label>
                                <textarea 
                                    value={topic} 
                                    onChange={(e) => setTopic(e.target.value)} 
                                    placeholder="e.g., Unboxing the new Rosehip Serum..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-sans font-light focus:bg-white/10 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 h-32 resize-none transition-all outline-none text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-sans font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">Format Duration</label>
                                    <Select value={duration} onChange={(e) => setDuration(e.target.value)} className="h-12 bg-white/5 border-white/10">
                                        <option className="bg-black">15 Seconds (Reel/Short)</option>
                                        <option className="bg-black">30 Seconds (Commercial)</option>
                                        <option className="bg-black">60 Seconds (Deep Dive)</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="flex items-center text-[10px] font-sans font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                        <Music size={12} className="mr-1"/> Audio Vibe
                                    </label>
                                    <Select value={audioTrack} onChange={(e) => setAudioTrack(e.target.value)} className="h-12 bg-white/5 border-white/10">
                                        {audioOptions.map(opt => <option key={opt} className="bg-black">{opt}</option>)}
                                    </Select>
                                </div>
                            </div>

                            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-gradient-to-r from-pink-600 to-[#6A2C91] text-white h-14 rounded-2xl shadow-lg border-none">
                                {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <MonitorPlay className="mr-2" />}
                                {isGenerating ? "Rendering Storyboard..." : "Generate Script & Frames"}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Output Panel */}
                <div className="lg:col-span-7 flex flex-col h-full">
                    <Card className="flex-1 flex flex-col p-0 overflow-hidden bg-[#0A0A0A] border-white/10 shadow-2xl relative min-h-[600px]">
                        <div className="h-14 bg-[#111] border-b border-white/10 flex items-center px-6 justify-between">
                            <h3 className="text-white/80 font-serif flex items-center gap-2">
                                <Film size={18} className="text-pink-500" /> Storyboard Visualizer
                            </h3>
                            {generatedScript && (
                                <Badge color="magenta">{duration}</Badge>
                            )}
                        </div>
                        
                        <div className="flex-1 p-6 overflow-y-auto bg-black/40">
                            {storyboard.length > 0 ? (
                                <div className="space-y-6">
                                    {storyboard.map((frame, idx) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-6"
                                        >
                                            {/* Fake Visual Frame */}
                                            <div className="w-32 h-48 bg-gradient-to-br from-black to-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
                                                <Video size={24} className="text-white/20 mb-2" />
                                                <Badge color="gray" className="absolute bottom-2 left-2 right-2 text-center">{frame.time}</Badge>
                                            </div>
                                            
                                            <div className="flex-1 space-y-4 py-2">
                                                <div>
                                                    <span className="text-[10px] uppercase tracking-widest text-pink-500 font-black">Visual</span>
                                                    <p className="text-sm text-gray-300 font-sans mt-1">{frame.visual}</p>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black flex items-center"><Mic size={10} className="mr-1"/> Audio</span>
                                                        <p className="text-xs text-gray-400 font-sans italic mt-1">"{frame.audio}"</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-black flex items-center"><Layers size={10} className="mr-1"/> Caption</span>
                                                        <p className="text-xs text-white font-bold font-sans mt-1 bg-black/40 px-2 py-1 rounded inline-block">{frame.caption}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : generatedScript ? (
                                <div className="h-full">
                                    <textarea 
                                        value={generatedScript}
                                        readOnly
                                        className="w-full h-full bg-transparent border-none text-gray-300 font-mono text-sm resize-none focus:outline-none"
                                    />
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-30">
                                    <Clapperboard size={64} className="mx-auto mb-4 text-white" />
                                    <p className="text-white font-serif text-lg">Awaiting Script Parameters</p>
                                </div>
                            )}
                        </div>

                        {generatedScript && (
                            <div className="p-6 bg-[#111] border-t border-white/10 flex justify-end gap-4">
                                <Button variant="outline" className="h-12 px-6">Discard</Button>
                                <Button onClick={handleSave} className="h-12 px-6 bg-pink-600 hover:bg-pink-700 text-white border-none">
                                    <Save size={16} className="mr-2" /> Save to Vault
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};
