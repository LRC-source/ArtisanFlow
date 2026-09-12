import React, { useState, useRef } from 'react';
import { ContextualTutorialModal } from '../ContextualTutorialModal';
import { User, Shield, LogOut, Upload, CheckCircle, CheckCircle2, ExternalLink, Key, AlertTriangle, ArrowLeft, Crown, Zap, ShieldCheck, CreditCard, ShoppingBag, Globe, Share2, Server, Lock, ArrowRight, Layers, BarChart3, RefreshCw, ArrowUpRight, Cpu, Activity, Sparkles, Loader2, X, Mail, HelpCircle } from 'lucide-react';
import { Input, Button, Card, Badge, Select, Modal, VaultBanner } from '../UI';
import { useArtisanData, Integration, UserTier } from '../DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentGateway } from '../Auth';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const AccountSettings = () => {
    const { businessProfile, updateBusinessProfile, startTutorial } = useArtisanData();
    const [formData, setFormData] = useState({ fullName: businessProfile.ownerName, email: businessProfile.email, avatarUrl: businessProfile.avatarUrl });
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSave = () => {
        updateBusinessProfile({ ...businessProfile, ownerName: formData.fullName, email: formData.email, avatarUrl: formData.avatarUrl });
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2500);
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-10 lg:space-y-12 max-w-7xl mx-auto pb-8 sm:pb-12 lg:pb-20"
        >
            <div className="flex flex-col gap-3 sm:gap-6">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-3 text-white sm:text-white/50 hover:text-[#C5A059] font-sans text-[11px] uppercase tracking-widest transition-colors w-fit group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Command Center
                </button>
                
                <VaultBanner 
                  title="Account Settings"
                  subtitle="Manage your profile and account access."
                  badge="Security Protocol Active"
                >
                </VaultBanner>
            </div>
            
            <div className="w-full md:w-1/2">
                <div className={`luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-10 ${isSuccess ? 'ring-1 ring-emerald-500/50 bg-emerald-900/10' : ''} transition-all duration-500 rounded-[2.5rem]`}>
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">Profile</h3>
                    <div className="space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-[1.2rem] bg-gradient-to-tr from-[#6A2C91] to-[#C5A059] p-[2px] flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                                <div className="w-full h-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                                    {formData.avatarUrl ? (
                                        <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={32} className="text-[#C5A059]" />
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2 flex-1">
                                <label className="text-[10px] font-sans text-white/40 uppercase tracking-widest block font-bold">Profile Picture</label>
                                <Button 
                                    variant="outline" 
                                    className="border-white/10 text-white/60 hover:text-white"
                                    onClick={() => {
                                        toast.info('Image upload coming in v1.1. Using default avatar.');
                                        setFormData({...formData, avatarUrl: ''});
                                    }}
                                >
                                    <Upload size={16} className="mr-2" /> Upload Image
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-sans text-white/40 uppercase tracking-widest mb-2 block font-bold">Full Name</label>
                                <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Your Name" className="w-full rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" />
                            </div>
                            <div>
                                <label className="text-[10px] font-sans text-white/40 uppercase tracking-widest mb-2 block font-bold">Email (Read-only)</label>
                                <Input value={formData.email} disabled placeholder="Secure Email" className="w-full rounded-2xl bg-white/5 text-white/30 cursor-not-allowed border-dashed border-white/10" />
                            </div>
                        </div>
                        <div className="pt-8 border-t border-white/5 flex items-center gap-6">
                            <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white px-12 rounded-full shadow-md font-sans font-medium text-[10px] uppercase tracking-widest transition-all" onClick={handleSave}>Save Profile</Button>
                            {isSuccess && <span className="text-emerald-400 text-[10px] font-sans font-bold uppercase tracking-widest flex items-center gap-2 animate-in slide-up"><CheckCircle size={16}/> Saved</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing & Subscription */}
            <div className="w-full mt-6">
                <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-10 rounded-[2.5rem]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg sm:text-2xl font-black font-serif tracking-tight text-white">Billing &amp; Subscription</h3>
                        <Badge variant="outline" className="border-[#C5A059] text-[#C5A059]">Managed via Stripe</Badge>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Current Plan</p>
                                <p className="text-sm font-bold text-white">{businessProfile.tier}</p>
                            </div>
                            <Button variant="outline" className="text-[10px]" onClick={() => navigate('/settings/subscription')}>Manage Plan</Button>
                        </div>
                        <p className="text-xs text-white/50">Billing details, payment methods, and invoices are securely managed through our payment partner.</p>
                    </div>
                </div>
            </div>

            {/* Support & Tutorial */}
            <div className="w-full md:w-1/2 mt-6">
                <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-10 rounded-[2.5rem]">
                    <h3 className="text-lg sm:text-2xl font-black font-serif tracking-tight text-white mb-6">Support &amp; Help</h3>
                    <div className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full border-white/10 text-white/60 hover:text-white hover:border-[#6A2C91]/50 justify-start gap-3"
                            onClick={() => {
                                startTutorial();
                                toast.success('Tutorial started! Look for the panel in the top-right corner.');
                            }}
                        >
                            <HelpCircle size={16} /> Replay App Tutorial
                        </Button>
                        <p className="text-white/30 text-xs font-sans pl-1">
                            Re-launches the non-blocking quick-tour panel that guides you through the main features.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

