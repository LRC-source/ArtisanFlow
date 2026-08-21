import React, { useState, useRef } from 'react';
import { ContextualTutorialModal } from '../ContextualTutorialModal';
import { User, Shield, LogOut, Upload, CheckCircle, CheckCircle2, ExternalLink, Key, AlertTriangle, ArrowLeft, Crown, Zap, ShieldCheck, CreditCard, ShoppingBag, Globe, Share2, Server, Lock, ArrowRight, Layers, BarChart3, RefreshCw, ArrowUpRight, Cpu, Activity, Sparkles, Loader2, X, Mail } from 'lucide-react';
import { Input, Button, Card, Badge, Select, Modal, VaultBanner } from '../UI';
import { useArtisanData, Integration, UserTier } from '../DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentGateway } from '../Auth';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const CustomerPortal = () => {
    const navigate = useNavigate();
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-10 lg:space-y-12 max-w-7xl mx-auto pb-8 sm:pb-12 lg:pb-20"
        >
            <div className="w-full md:w-1/2">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-white sm:text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                    <ArrowLeft size={16} /> Back to Command Center
                </button>
                <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">Wholesale Portal</h1>
                <p className="text-sm sm:text-base text-white sm:text-white/40 font-sans font-light leading-relaxed">Managing the external client interface architecture.</p>
            </div>
            
            <div className="w-full md:w-2/3 lg:w-1/2">
                <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-3.5 sm:p-6 lg:p-12 rounded-[2.5rem]">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white mb-4">Portal Matrix</h2>
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 hover:border-[#6A2C91]/30 transition-all duration-500">
                            <div className="flex items-center gap-3 sm:gap-6">
                                <div className="p-4 bg-white/5 rounded-xl text-[#C5A059] shadow-sm group-hover:bg-[#C5A059] group-hover:text-black transition-colors duration-500">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-white font-bold text-sm sm:text-base lg:text-xl text-white sm:text-slate-400 leading-relaxed sm:text-lg tracking-tight">Custom Domain Active</h4>
                                    <p className="text-sm sm:text-base text-[10px] text-[#C5A059] font-sans font-bold tracking-widest mt-1 uppercase">wholesale.herbalisticwellness.com</p>
                                </div>
                            </div>
                            <Button variant="outline" className="text-[10px] h-10 px-6 font-sans font-bold tracking-widest uppercase rounded-full border-white/20 text-white sm:text-white/70 hover:bg-white/10 hover:text-white transition-colors">RE-ROUTE</Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-widest ml-1">Min. Commitment ($)</label>
                                <Input defaultValue="500.00" className="w-auto mx-auto py-1 px-3 text-[10px] rounded-xl text-sm sm:text-base leading-relaxed font-serif bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-widest ml-1">Portal Logic State</label>
                                <Select className="w-auto mx-auto py-1 px-3 text-[10px] rounded-xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors font-sans text-sm">
                                    <option className="bg-black text-white">Public (Visible)</option>
                                    <option className="bg-black text-white">Private (Vetted Nodes Only)</option>
                                    <option className="bg-black text-white">Offline (Maintenance)</option>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-[10px] font-sans font-bold text-white sm:text-white/40 uppercase tracking-widest ml-1">Welcome Directive</label>
                            <textarea className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 sm:p-6 text-sm focus:bg-white/10 focus:border-[#6A2C91]/50 outline-none h-32 resize-none shadow-sm font-sans font-light transition-all" defaultValue="Welcome to our wholesale catalog. Established manufacturing nodes only." />
                        </div>
                        
                        <Button className="w-full bg-[#6A2C91] text-white w-auto mx-auto py-1 px-3 text-[10px] rounded-full font-sans font-bold text-[10px] uppercase tracking-widest hover:bg-[#5a257a] transition-colors mt-4">UPDATE PORTAL PARAMETERS</Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

