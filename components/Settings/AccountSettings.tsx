import React, { useState, useRef } from 'react';
import { ContextualTutorialModal } from '../ContextualTutorialModal';
import { User, Shield, LogOut, Upload, CheckCircle, CheckCircle2, ExternalLink, Key, AlertTriangle, ArrowLeft, Crown, Zap, ShieldCheck, CreditCard, ShoppingBag, Globe, Share2, Server, Lock, ArrowRight, Layers, BarChart3, RefreshCw, ArrowUpRight, Cpu, Activity, Sparkles, Loader2, X, Mail } from 'lucide-react';
import { Input, Button, Card, Badge, Select, Modal, VaultBanner } from '../UI';
import { useArtisanData, Integration, UserTier } from '../DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentGateway } from '../Auth';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const AccountSettings = () => {
    const { businessProfile, updateBusinessProfile } = useArtisanData();
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
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">Identity Nodes</h3>
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
        </motion.div>
    );
};

