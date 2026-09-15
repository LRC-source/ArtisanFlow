import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../UI';
import { Bot, User, Loader2, Sparkles, ShieldAlert, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SubPageHeader } from '../SubPageHeader';
import { chatWithLola } from '../../services/geminiService';
import { toast } from 'sonner';

export const ReceptionistLogic = () => {
    const navigate = useNavigate();
    
    const [messages, setMessages] = useState<{role: 'user'|'bot', content: string}[]>([
        { role: 'bot', content: 'Welcome to our artisanal boutique. How may I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Custom FAQ Builder
    const [faqs, setFaqs] = useState<{q: string, a: string}[]>([
        { q: "What are your shipping times?", a: "Standard shipping takes 3-5 business days for domestic orders." },
        { q: "Do you offer wholesale?", a: "Yes, we have a dedicated wholesale program. Let me route you to our B2B team." }
    ]);

    // Escalation Rules
    const [escalationTrigger, setEscalationTrigger] = useState('urgent, refund, complaint, manager');
    const [escalationMethod, setEscalationMethod] = useState<'Email' | 'SMS'>('Email');
    
    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setIsGenerating(true);
        
        try {
            // Check for escalation triggers
            const triggers = escalationTrigger.split(',').map(t => t.trim().toLowerCase());
            const isEscalation = triggers.some(t => userText.toLowerCase().includes(t));
            
            if (isEscalation) {
                setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'bot', content: `[ESCALATION TRIGGERED: ${escalationMethod}] I am routing your request to our management team right away. They will reach out shortly.` }]);
                    setIsGenerating(false);
                }, 1000);
                return;
            }

            // Build context for Lola
            const contextStr = faqs.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n');
            const systemPrompt = `You are an AI receptionist for an artisanal boutique. 
Respond professionally and helpfully to the customer based on these FAQs: 
${contextStr}

If they ask something outside the FAQs, be polite and try to help based on general artisanal business knowledge, but keep it brief.`;

            const reply = await chatWithLola(userText, systemPrompt);
            setMessages(prev => [...prev, { role: 'bot', content: reply.text || "Response error" }]);
        } catch (error) {
            console.error(error);
            toast.error("Failed to connect to AI logic.");
            setMessages(prev => [...prev, { role: 'bot', content: "I'm sorry, my logic is currently offline. Please try again." }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 sm:space-y-8 pb-20"
        >
            <SubPageHeader 
                title="AI Receptionist Logic"
                description="Train and configure your autonomous front-desk AI. This is a real, live integration with Gemini."
                onBack={() => navigate('/marketing')}
                badge="Live Integration"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-8">
                
                {/* Configuration Panel */}
                <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                    <Card title="Knowledge Base (FAQs)" className="bg-[#0A0A0A] border-white/10 shadow-2xl">
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="space-y-2 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/5">
                                    <Input value={faq.q} onChange={(e) => {
                                        const newFaqs = [...faqs];
                                        newFaqs[i].q = e.target.value;
                                        setFaqs(newFaqs);
                                    }} label="Trigger Question" className="bg-black/50" />
                                    <Input value={faq.a} onChange={(e) => {
                                        const newFaqs = [...faqs];
                                        newFaqs[i].a = e.target.value;
                                        setFaqs(newFaqs);
                                    }} label="AI Response" className="bg-black/50" />
                                </div>
                            ))}
                            <Button variant="outline" onClick={() => setFaqs([...faqs, {q:'', a:''}])} className="w-full text-xs font-sans uppercase tracking-widest text-white/50 border-white/10 hover:bg-white/5 hover:text-white transition-all">
                                + Add Knowledge Item
                            </Button>
                        </div>
                    </Card>

                    <Card title="Escalation Rules" className="bg-[#0A0A0A] border-rose-900/30 shadow-2xl">
                        <div className="space-y-4">
                            <Input 
                                label="Trigger Keywords (comma separated)"
                                value={escalationTrigger}
                                onChange={(e) => setEscalationTrigger(e.target.value)}
                                className="bg-black/50 border-rose-900/50 focus:border-rose-500/50"
                            />
                            <div className="flex gap-4">
                                <Button 
                                    variant={escalationMethod === 'Email' ? 'primary' : 'outline'}
                                    onClick={() => setEscalationMethod('Email')}
                                    className={escalationMethod === 'Email' ? 'bg-rose-600 hover:bg-rose-700 text-white flex-1' : 'flex-1'}
                                >Email</Button>
                                <Button 
                                    variant={escalationMethod === 'SMS' ? 'primary' : 'outline'}
                                    onClick={() => setEscalationMethod('SMS')}
                                    className={escalationMethod === 'SMS' ? 'bg-rose-600 hover:bg-rose-700 text-white flex-1' : 'flex-1'}
                                >SMS</Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Live Chat Panel */}
                <div className="lg:col-span-6 h-[600px] flex flex-col">
                    <Card title="Live Receptionist" className="flex-1 flex flex-col p-0 overflow-hidden bg-[#0A0A0A] border-white/10 shadow-2xl">
                        
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-black/40 flex flex-col">
                            {messages.map((m, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                                    className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${m.role === 'user' ? 'bg-[#111] border border-white/10 text-gray-400' : 'bg-[#6A2C91] text-white'}`}>
                                        {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-lg ${
                                        m.role === 'user' 
                                            ? 'bg-emerald-600 text-white rounded-tr-none' 
                                            : m.content.includes('[ESCALATION TRIGGERED') 
                                                ? 'bg-rose-900/80 text-rose-100 rounded-tl-none border border-rose-500/50'
                                                : 'bg-white/10 backdrop-blur-md text-white rounded-tl-none border border-white/5'
                                    }`}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isGenerating && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#6A2C91] flex items-center justify-center shrink-0 shadow-lg text-white">
                                        <Bot size={14} />
                                    </div>
                                    <div className="p-3 rounded-2xl rounded-tl-none bg-white/10 backdrop-blur-md text-white/50 text-sm border border-white/5 flex items-center gap-2">
                                        <Loader2 size={14} className="animate-spin" /> Thinking...
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="p-4 sm:p-6 bg-[#111] border-t border-white/10 shrink-0">
                            <div className="flex gap-2">
                                <Input 
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Type a message to test the logic..."
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    className="flex-1 bg-black/50"
                                />
                                <Button onClick={handleSend} disabled={isGenerating || !input.trim()} className="bg-[#6A2C91] hover:bg-[#552374] text-white shadow-lg font-cta font-semibold uppercase tracking-[0.08em]">
                                    <Send size={18} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </motion.div>
    );
};
