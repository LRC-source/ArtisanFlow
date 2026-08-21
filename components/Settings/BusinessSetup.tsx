import React, { useState, useRef } from 'react';
import { ContextualTutorialModal } from '../ContextualTutorialModal';
import { User, Shield, LogOut, Upload, CheckCircle, CheckCircle2, ExternalLink, Key, AlertTriangle, ArrowLeft, Crown, Zap, ShieldCheck, CreditCard, ShoppingBag, Globe, Share2, Server, Lock, ArrowRight, Layers, BarChart3, RefreshCw, ArrowUpRight, Cpu, Activity, Sparkles, Loader2, X, Mail } from 'lucide-react';
import { Input, Button, Card, Badge, Select, Modal, VaultBanner } from '../UI';
import { useArtisanData, Integration, UserTier } from '../DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentGateway } from '../Auth';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const BusinessSetup = () => {
    const { businessProfile, updateBusinessProfile } = useArtisanData();
    const [profile, setProfile] = useState(businessProfile);
    const [isSuccess, setIsSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleSave = () => {
        updateBusinessProfile(profile);
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
                  title="Enterprise Setup"
                  subtitle="Establishing core manufacturing parameters and industry alignment. Pushing global updates to the decentralized ledger."
                  badge="System Protocol Active"
                >
                  <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-center justify-center gap-3 w-auto">
                    <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white py-3 px-6 px-12 rounded-full shadow-2xl shadow-[#6A2C91]/20 font-sans font-medium text-[11px] tracking-widest transition-all uppercase" onClick={handleSave}>PUSH GLOBAL UPDATES</Button>
                  </div>
                </VaultBanner>
            </div>

            <div className="w-full md:w-1/2">
                <div className={`luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-10 ${isSuccess ? 'ring-1 ring-emerald-500/50 bg-emerald-900/10' : ''} transition-all duration-500 rounded-[2.5rem]`}>
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">Corporate Node Definition</h3>
                    <div className="space-y-10">
                        <div className="space-y-6">
                           <div>
                                <label className="text-[10px] font-sans text-white sm:text-white/40 uppercase tracking-widest mb-2 block font-bold">Legal Entity Name</label>
                                <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Business Entity Name" className="w-auto mx-auto py-1 px-3 text-[10px] rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" />
                           </div>
                           <div>
                                <label className="text-[10px] font-sans text-white sm:text-white/40 uppercase tracking-widest mb-2 block font-bold">Industry Logic</label>
                                <Select value={profile.industry} onChange={e => setProfile({...profile, industry: e.target.value})} className="w-auto mx-auto py-1 px-3 text-[10px] rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors">
                                    <option className="bg-black text-white">Skincare</option>
                                    <option className="bg-black text-white">Candles</option>
                                    <option className="bg-black text-white">Apparel</option>
                                    <option className="bg-black text-white">Pottery</option>
                                    <option className="bg-black text-white">Jewelry</option>
                                </Select>
                           </div>
                        </div>
                        <div className="flex flex-col items-center gap-3 sm:gap-6 bg-white/5 p-3.5 sm:p-6 lg:p-12 rounded-[2.5rem] border border-white/10 shadow-inner group hover:bg-white/10 transition-all">
                            <div className="w-32 h-32 bg-black/50 rounded-[2rem] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                                {profile.logo ? <img src={profile.logo} className="w-full h-full object-cover" /> : <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">No Asset</span>}
                            </div>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="text-[10px] h-10 px-8 rounded-xl font-black uppercase tracking-widest border-white/20 text-white sm:text-white/60 hover:bg-white/10 hover:text-white"><Upload size={18} className="mr-2"/> Synchronize Logo</Button>
                            <input type="file" ref={fileInputRef} className="hidden" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

