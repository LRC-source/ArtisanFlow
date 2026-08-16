import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../UI';
import { Bot, User, Loader2, Plus, Trash2, Mail, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';
import { toast } from 'sonner';

export const ReceptionistLogic = () => {
    const navigate = useNavigate();
    
    const [greeting, setGreeting] = useState('Welcome to our artisanal boutique. How may I assist you today?');
    
    // Custom FAQ Builder
    const [faqs, setFaqs] = useState<{q: string, a: string}[]>([
        { q: "What are your shipping times?", a: "Standard shipping takes 3-5 business days for domestic orders." },
        { q: "Do you offer wholesale?", a: "Yes, we have a dedicated wholesale program. Let me route you to our B2B team." }
    ]);

    // Escalation Rules
    const [escalationTrigger, setEscalationTrigger] = useState('urgent, refund, complaint, manager');
    const [escalationMethod, setEscalationMethod] = useState<'Email' | 'SMS'>('Email');
    const [escalationContact, setEscalationContact] = useState('support@herbalisticwellness.com');

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Receptionist logic & routing deployed successfully.");
        }, 1000);
    };

    const addFaq = () => setFaqs([...faqs, { q: '', a: '' }]);
    const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
    const updateFaq = (index: number, key: 'q' | 'a', value: string) => {
        const newFaqs = [...faqs];
        newFaqs[index][key] = value;
        setFaqs(newFaqs);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-8 space-y-12 pb-20 max-w-7xl mx-auto"
        >
            <div className="w-full">
                <SubPageHeader 
                  title="Receptionist Logic"
                  parentTitle="Marketing Hub"
                  onBack={() => navigate('/marketing')}
                  description="Lola AI custom FAQ builder & escalation routing."
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* General Greeting */}
                    <Card className="p-8 bg-black/40 border-white/5 backdrop-blur-xl space-y-6">
                        <div>
                            <label className="flex items-center text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 ml-1">
                                <Sparkles size={14} className="mr-2 text-magenta-500" /> Initial Greeting
                            </label>
                            <Input 
                                value={greeting} 
                                onChange={(e) => setGreeting(e.target.value)} 
                                className="h-14 rounded-2xl bg-white/5 border-white/10 focus:bg-white/10 focus:border-[#C5A059] text-white" 
                            />
                        </div>
                    </Card>

                    {/* FAQ Builder */}
                    <Card title="Custom FAQ Matrix" className="p-8 bg-black/40 border-white/5 backdrop-blur-xl">
                        <div className="space-y-6 mt-6">
                            <AnimatePresence>
                                {faqs.map((faq, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 bg-white/5 border border-white/10 rounded-2xl relative group"
                                    >
                                        <button onClick={() => removeFaq(index)} className="absolute top-4 right-4 text-gray-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="space-y-4 pr-8">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Trigger Question</label>
                                                <Input value={faq.q} onChange={(e) => updateFaq(index, 'q', e.target.value)} className="h-10 bg-black/40 border-white/10 text-sm" placeholder="e.g., Where is my order?" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-1 block">Lola's Answer</label>
                                                <textarea 
                                                    value={faq.a} 
                                                    onChange={(e) => updateFaq(index, 'a', e.target.value)} 
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-gray-300 resize-none h-20 outline-none focus:border-[#C5A059]" 
                                                    placeholder="Automated response..."
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            <Button onClick={addFaq} variant="outline" className="w-full h-12 border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/50">
                                <Plus size={16} className="mr-2" /> Add FAQ Pair
                            </Button>
                        </div>
                    </Card>

                    {/* Escalation Routing */}
                    <Card title="Escalation Routing" className="p-8 bg-[#1A1115] border-rose-500/20 backdrop-blur-xl">
                        <div className="space-y-6 mt-6">
                            <div>
                                <label className="flex items-center text-[10px] font-black text-rose-500/70 uppercase tracking-widest mb-3 ml-1">
                                    <ShieldAlert size={14} className="mr-2" /> Keyword Triggers (Comma Separated)
                                </label>
                                <Input 
                                    value={escalationTrigger} 
                                    onChange={(e) => setEscalationTrigger(e.target.value)} 
                                    className="h-12 bg-black/40 border-rose-500/20 text-rose-200 focus:border-rose-500" 
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Routing Method</label>
                                    <Select value={escalationMethod} onChange={(e) => setEscalationMethod(e.target.value as any)} className="h-12 bg-black/40 border-white/10">
                                        <option value="Email" className="bg-black">High Priority Email</option>
                                        <option value="SMS" className="bg-black">SMS Alert to Manager</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Destination Contact</label>
                                    <Input 
                                        value={escalationContact} 
                                        onChange={(e) => setEscalationContact(e.target.value)} 
                                        className="h-12 bg-black/40 border-white/10" 
                                        placeholder={escalationMethod === 'Email' ? "admin@..." : "+1 (555)..."}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                </div>

                {/* Simulation Panel */}
                <div className="lg:col-span-5 h-[800px] flex flex-col">
                    <Card title="Live Logic Simulator" className="flex-1 flex flex-col p-0 overflow-hidden bg-[#0A0A0A] border-white/10 shadow-2xl">
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/40">
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#6A2C91] flex items-center justify-center text-white shrink-0 shadow-lg">
                                    <Bot size={18} />
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl rounded-tl-none border border-white/5 text-sm text-white shadow-lg">
                                    {greeting}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex gap-4 flex-row-reverse">
                                <div className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-gray-400 shrink-0">
                                    <User size={18} />
                                </div>
                                <div className="bg-emerald-600 text-white p-4 rounded-2xl rounded-tr-none text-sm shadow-lg">
                                    {faqs[0]?.q || "I have a question."}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#6A2C91] flex items-center justify-center text-white shrink-0 shadow-lg">
                                    <Bot size={18} />
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl rounded-tl-none border border-white/5 text-sm text-white shadow-lg">
                                    {faqs[0]?.a || "I can help with that."}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} className="flex gap-4 flex-row-reverse mt-8">
                                <div className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-gray-400 shrink-0">
                                    <User size={18} />
                                </div>
                                <div className="bg-emerald-600 text-white p-4 rounded-2xl rounded-tr-none text-sm shadow-lg">
                                    This is {escalationTrigger.split(',')[0] || 'urgent'}, I need a manager!
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2 }} className="mx-12 my-6">
                                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-center justify-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-widest">
                                    <ShieldAlert size={14} /> Escalation Triggered
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#6A2C91] flex items-center justify-center text-white shrink-0 shadow-lg">
                                    <Bot size={18} />
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl rounded-tl-none border border-white/5 text-sm text-white shadow-lg">
                                    I understand. I am routing your request to our management team via {escalationMethod} right away. They will reach out shortly.
                                </div>
                            </motion.div>
                        </div>

                        <div className="p-6 bg-[#111] border-t border-white/10 shrink-0">
                            <Button onClick={handleSave} disabled={isSaving} className="w-full bg-[#6A2C91] hover:bg-[#552374] text-white h-14 rounded-2xl font-sans font-medium text-[11px] uppercase tracking-[0.2em] shadow-xl border-none">
                                {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                                Deploy Logic to Lola Node
                            </Button>
                        </div>
                    </Card>
                </div>

            </div>
        </motion.div>
    );
};
