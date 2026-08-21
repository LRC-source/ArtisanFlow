import React, { useState, useRef } from 'react';
import { ContextualTutorialModal } from '../ContextualTutorialModal';
import { User, Shield, LogOut, Upload, CheckCircle, CheckCircle2, ExternalLink, Key, AlertTriangle, ArrowLeft, Crown, Zap, ShieldCheck, CreditCard, ShoppingBag, Globe, Share2, Server, Lock, ArrowRight, Layers, BarChart3, RefreshCw, ArrowUpRight, Cpu, Activity, Sparkles, Loader2, X, Mail } from 'lucide-react';
import { Input, Button, Card, Badge, Select, Modal, VaultBanner } from '../UI';
import { useArtisanData, Integration, UserTier } from '../DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentGateway } from '../Auth';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const SubscriptionManagement = () => {
    const { userTier, updateTier, businessProfile } = useArtisanData();
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [selectedUpgrade, setSelectedUpgrade] = useState<UserTier | null>(null);
    const navigate = useNavigate();

    const location = useLocation();

    const handleSuccess = async (tierToApply: UserTier) => {
        await updateTier(tierToApply);
        toast.success("Protocol Authorized. Access Granted.");
        setSelectedUpgrade(null);
        if (location.state?.from) navigate(location.state.from);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-10 lg:space-y-12 max-w-7xl mx-auto pb-8 sm:pb-12 lg:pb-20"
        >
            <ContextualTutorialModal
                hubId="subscription_status"
                title="Subscription Status"
                description="Manage your ArtisanFlow plan and billing."
                steps={["Review your current tier and usage limits.","Upgrade to unlock advanced features.","Manage payment methods and billing history."]}
            />
            <Modal isOpen={!!selectedUpgrade} onClose={() => setSelectedUpgrade(null)} title="Vault Payment Gateway">
                {selectedUpgrade && (
                   <PaymentGateway 
                      tier={selectedUpgrade} 
                      email={businessProfile.email} 
                      onSuccess={() => handleSuccess(selectedUpgrade)} 
                      onBack={() => setSelectedUpgrade(null)} 
                   />
                )}
            </Modal>

            <div className="w-full md:w-1/2">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-white sm:text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                    <ArrowLeft size={16} /> Back to Command Center
                </button>
                <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">Access Level</h1>
                <p className="text-sm sm:text-base text-white sm:text-white/40 font-sans font-light leading-relaxed">Defining system throughput and logic capabilities.</p>
            </div>
            
            {businessProfile.status === 'Past Due' && (
                <div className="bg-red-900/30 border-l-4 border-red-500 p-4 sm:p-6 rounded-2xl shadow-lg mb-8">
                    <h3 className="text-lg sm:text-2xl lg:text-3xl text-red-400 font-bold leading-relaxed flex items-center gap-2 mb-2"><AlertTriangle size={20} /> ACTION REQUIRED: PAST DUE BALANCE</h3>
                    <p className="text-sm sm:text-base text-white/80 font-sans font-light leading-relaxed mb-4">
                        Your most recent tier payment was declined or could not be processed. Tier features and architectural logic modules <strong>can and will be restricted at any time</strong>. Express urgency by processing your payment below to retain your uninhibited access to all ArtisanFlow features.
                    </p>
                    <Button onClick={() => setSelectedUpgrade(userTier as UserTier)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-xl transition-colors">
                        Process Secure Payment Now
                    </Button>
                </div>
            )}
            
            <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-12 flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6 relative overflow-hidden group rounded-[3rem]">
               <div className="absolute top-0 right-0 p-4 sm:p-12 opacity-[0.02] text-[#C5A059] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700"><Crown size={160} /></div>
               <div className="flex items-center gap-3 sm:gap-6 relative z-10">
                  <div className="w-14 h-14 sm:w-24 sm:h-24 bg-white/5 rounded-full flex items-center justify-center text-[#C5A059] shadow-sm border border-[#C5A059]/20 group-hover:scale-105 transition-transform duration-700">
                      <Crown size={40} strokeWidth={1.5} />
                  </div>
                  <div>
                      <span className="text-[10px] font-sans text-white sm:text-white/50 font-bold uppercase tracking-widest mb-2 block">Deployment Level</span>
                      <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">{userTier}</h3>
                      <p className="text-sm sm:text-base text-emerald-400 mt-3 font-sans font-medium tracking-wide flex items-center gap-2">
                        <CheckCircle size={14} /> Systems Active & Verified
                      </p>
                  </div>
               </div>
               <div className="flex flex-col items-center md:items-end gap-3 sm:gap-4 relative z-10">
                   <div className="text-center md:text-right mb-4">
                      <p className="text-sm sm:text-base text-[10px] font-sans text-white sm:text-white/50 font-bold uppercase tracking-widest mb-1">Access Initialized</p>
                      <p className="text-sm sm:text-base text-white sm:text-slate-400 leading-relaxed font-serif text-white/80 tracking-tight">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                   </div>
                   {userTier !== 'Margin Protection Pro' && (
                     <Button variant="premium" onClick={() => setSelectedUpgrade('Margin Protection Pro')} className="w-auto mx-auto py-1 px-3 text-[10px] px-10 rounded-full font-sans font-medium text-[10px] uppercase tracking-widest shadow-md">
                        Activate Pro Access <Crown size={16} className="ml-2"/>
                     </Button>
                   )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mt-6 sm:mt-8 lg:mt-12">
               <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10">
                  <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">Deployment Protocols</h3>
                  <ul className="space-y-6">
                     {[
                        { icon: ShieldCheck, text: 'Advanced Synaptic Protection' },
                        { icon: Crown, text: 'Architectural Logic Modules' },
                        { icon: Zap, text: 'High-Throughput Node Access' },
                        { icon: CheckCircle, text: 'Bidirectional Database Sync' }
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-5 group/item">
                          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl shadow-sm text-[#C5A059] group-hover/item:bg-[#C5A059] group-hover/item:text-black transition-all duration-300">
                             <item.icon size={20} strokeWidth={1.5} />
                          </div>
                          <span className="text-sm font-sans font-medium text-white sm:text-white/70">{item.text}</span>
                       </li>
                     ))}
                  </ul>
               </div>

               <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-3.5 sm:p-6 lg:p-12 flex flex-col justify-center items-center text-center group">
                  <div className="w-12 h-12 sm:w-20 sm:h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/30 mb-8 shadow-sm group-hover:text-[#C5A059] group-hover:scale-105 transition-all duration-500">
                      <ExternalLink size={32} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm sm:text-base text-white sm:text-white/50 leading-relaxed mb-4">Access the global billing repository and transaction historicals.</p>
                  <Button variant="outline" className="text-[10px] uppercase font-sans font-bold tracking-widest w-auto mx-auto py-1 px-3 text-[10px] px-10 rounded-full border-white/20 text-white sm:text-white/70 hover:bg-white/10 transition-colors">Open Billing Vault</Button>
               </div>
            </div>
        </motion.div>
    );
};

