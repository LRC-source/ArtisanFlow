import React, { useState, useRef } from 'react';
import { ContextualTutorialModal } from '../ContextualTutorialModal';
import { User, Shield, LogOut, Upload, CheckCircle, CheckCircle2, ExternalLink, Key, AlertTriangle, ArrowLeft, Crown, Zap, ShieldCheck, CreditCard, ShoppingBag, Globe, Share2, Server, Lock, ArrowRight, Layers, BarChart3, RefreshCw, ArrowUpRight, Cpu, Activity, Sparkles, Loader2, X, Mail } from 'lucide-react';
import { Input, Button, Card, Badge, Select, Modal, VaultBanner } from '../UI';
import { useArtisanData, Integration, UserTier } from '../DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentGateway } from '../Auth';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const PrivacyGovernance = () => {
    const navigate = useNavigate();
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <div className="w-full md:w-1/2">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                    <ArrowLeft size={16} /> Back to Command Center
                </button>
                <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2">Security & Governance</h1>
                <p className="text-white/40 font-sans font-light text-lg">Systems integrity and data protection protocols.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-8">
                <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10">
                    <h2 className="text-3xl font-serif text-white font-bold mb-8 tracking-tight">Security Protocols</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-500 group">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white/5 rounded-xl shadow-sm text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition-colors duration-500 border border-white/10">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="font-serif text-white text-xl tracking-tight">Two-Factor Authentication</p>
                                    <p className="text-[10px] text-white/40 font-sans font-bold uppercase tracking-widest mt-1">Mandatory for all vault access.</p>
                                </div>
                            </div>
                            <Badge color="green" className="shadow-sm font-sans font-bold text-[9px] tracking-widest uppercase px-3 py-1 border-emerald-500/20">Active</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 transition-all duration-500 group">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white/5 rounded-xl shadow-sm text-blue-400 group-hover:bg-blue-400 group-hover:text-black transition-colors duration-500 border border-white/10">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <p className="font-serif text-white text-xl tracking-tight">GDPR & CCPA Handshake</p>
                                    <p className="text-[10px] text-white/40 font-sans font-bold uppercase tracking-widest mt-1">Data residency: USA-East-1.</p>
                                </div>
                            </div>
                            <Badge color="blue" className="shadow-sm font-sans font-bold text-[9px] tracking-widest uppercase px-3 py-1 border-blue-500/20">Compliant</Badge>
                        </div>
                    </div>
                </div>

                <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10 flex flex-col h-full">
                    <h2 className="text-3xl font-serif text-white font-bold mb-8 tracking-tight">System Audits</h2>
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg">
                            <span className="text-white/30 font-mono text-xs tracking-widest">2025-12-14 09:30 AM</span>
                            <span className="text-white font-sans font-medium text-sm">API Key Rotation Executed</span>
                        </div>
                        <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg">
                            <span className="text-white/30 font-mono text-xs tracking-widest">2025-12-13 04:12 PM</span>
                            <span className="text-white font-sans font-medium text-sm">Omnichannel Node Refresh</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full h-12 mt-8 rounded-full border-white/20 text-white/70 font-sans font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors">
                        <Server size={16} className="mr-3 text-[#C5A059]"/> Download System Audit Trail
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
