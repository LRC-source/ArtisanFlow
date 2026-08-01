import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, CheckCircle, HelpCircle } from 'lucide-react';
import { Button, Card } from './UI';
import { useArtisanData } from './DataContext';
import { toast } from 'sonner';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
    const { businessProfile } = useArtisanData();
    const [issueType, setIssueType] = useState('General Inquiry');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !description.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Mock POST to GAS Web App endpoint
            const gasUrl = import.meta.env.VITE_GAS_DATABASE_URL;
            if (gasUrl) {
                await fetch(gasUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'createSupportTicket',
                        userId: businessProfile.email,
                        issueType,
                        subject,
                        description
                    })
                }).catch(e => console.warn("GAS Mock Error", e));
            }

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const ticketId = `#TKT-${Math.floor(100 + Math.random() * 900)}`;
            setIsSubmitting(false);
            setIsSuccess(true);
            toast.success(`Ticket ${ticketId} created successfully! Our team will respond shortly.`);

            setTimeout(() => {
                onClose();
                // Reset form
                setIssueType('General Inquiry');
                setSubject('');
                setDescription('');
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            toast.error("Failed to submit ticket. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg z-[101]"
                    >
                        <Card className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                                        <HelpCircle size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white font-serif">ArtisanFlow Support Node</h3>
                                </div>
                                <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                                    <X size={20} />
                                </button>
                            </div>

                            {isSuccess ? (
                                <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white">Ticket Submitted</h4>
                                    <p className="text-white/50 text-sm max-w-xs mx-auto">Your request has been routed to our support architects. We will be in touch shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Issue Type</label>
                                        <select 
                                            value={issueType}
                                            onChange={(e) => setIssueType(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors"
                                        >
                                            <option>General Inquiry</option>
                                            <option>Bug Report</option>
                                            <option>Feature Suggestion</option>
                                            <option>Billing Question</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Subject</label>
                                        <input 
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Brief summary of your inquiry"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-white/20"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Description</label>
                                        <textarea 
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Provide as much detail as possible..."
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors min-h-[120px] resize-none placeholder:text-white/20"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <button type="button" className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                                            <Paperclip size={16} /> Attach File (Optional)
                                        </button>
                                        <Button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-[#C5A059] hover:bg-[#b08d4a] text-black px-6 h-12 rounded-xl font-bold tracking-wider uppercase flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>Sending...</>
                                            ) : (
                                                <>Submit Node <Send size={16} /></>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
