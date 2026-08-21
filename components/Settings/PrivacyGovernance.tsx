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
            className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-10 lg:space-y-12 max-w-7xl mx-auto pb-8 sm:pb-12 lg:pb-20"
        >
            <div className="w-full md:w-1/2">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-white sm:text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                    <ArrowLeft size={16} /> Back to Command Center
                </button>
                <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">Security & Governance</h1>
                <p className="text-sm sm:text-base text-white sm:text-white/40 font-sans font-light leading-relaxed">Systems integrity and data protection protocols.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white mb-4">Security Protocols</h2>
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-500 group">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white/5 rounded-xl shadow-sm text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition-colors duration-500 border border-white/10">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-sm sm:text-base font-serif text-white text-white sm:text-slate-400 leading-relaxed tracking-tight">Two-Factor Authentication</p>
                                    <p className="text-sm sm:text-base text-[10px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-widest mt-1">Mandatory for all vault access.</p>
                                </div>
                            </div>
                            <Badge color="green" className="shadow-sm font-sans font-bold text-[9px] tracking-widest uppercase px-3 py-1 border-emerald-500/20">Active</Badge>
                        </div>
                        
                        <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 transition-all duration-500 group">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white/5 rounded-xl shadow-sm text-blue-400 group-hover:bg-blue-400 group-hover:text-black transition-colors duration-500 border border-white/10">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <p className="text-sm sm:text-base font-serif text-white text-white sm:text-slate-400 leading-relaxed tracking-tight">GDPR & CCPA Handshake</p>
                                    <p className="text-sm sm:text-base text-[10px] text-white sm:text-white/40 font-sans font-bold uppercase tracking-widest mt-1">Data residency: USA-East-1.</p>
                                </div>
                            </div>
                            <Badge color="blue" className="shadow-sm font-sans font-bold text-[9px] tracking-widest uppercase px-3 py-1 border-blue-500/20">Compliant</Badge>
                        </div>
                    </div>
                </div>

                <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-3.5 sm:p-6 lg:p-12 flex flex-col h-full">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white mb-4">System Audits</h2>
                    <div className="space-y-2 flex-1">
                        <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg">
                            <span className="text-white/30 font-mono text-xs tracking-widest">2025-12-14 09:30 AM</span>
                            <span className="text-white font-sans font-medium text-sm">API Key Rotation Executed</span>
                        </div>
                        <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg">
                            <span className="text-white/30 font-mono text-xs tracking-widest">2025-12-13 04:12 PM</span>
                            <span className="text-white font-sans font-medium text-sm">Omnichannel Node Refresh</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full w-auto mx-auto py-1 px-3 text-[10px] mt-8 rounded-full border-white/20 text-white sm:text-white/70 font-sans font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors">
                        <Server size={16} className="mr-3 text-[#C5A059]"/> Download System Audit Trail
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
