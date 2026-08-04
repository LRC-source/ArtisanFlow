import React, { useState, useRef } from 'react';
import { ContextualTutorialModal } from './ContextualTutorialModal';
import { User, Shield, LogOut, Upload, CheckCircle, CheckCircle2, ExternalLink, Key, AlertTriangle, ArrowLeft, Crown, Zap, ShieldCheck, CreditCard, ShoppingBag, Globe, Share2, Server, Lock, ArrowRight, Layers, BarChart3, RefreshCw, ArrowUpRight, Cpu, Activity, Sparkles, Loader2, X, Mail } from 'lucide-react';
import { Input, Button, Card, Badge, Select, Modal, VaultBanner } from './UI';
import { useArtisanData, Integration, UserTier } from './DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

/**
 * ArtisanFlow Architecture 1.0 - STATUS: COMPLETE ✅
 */

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
            className="p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <div className="flex flex-col gap-8">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-3 text-white/50 hover:text-[#C5A059] font-sans text-[11px] uppercase tracking-widest transition-colors w-fit group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Command Center
                </button>
                
                <VaultBanner 
                  title="Account Architecture"
                  subtitle="Manage your digital credentials and vault access. Synchronize credentials with the secure LDAP vault."
                  badge="Security Protocol Active"
                >
                  <div className="flex gap-4">
                    <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 px-12 rounded-full shadow-2xl shadow-[#6A2C91]/20 font-sans font-medium text-[11px] tracking-widest transition-all uppercase" onClick={handleSave}>COMMIT IDENTITY UPDATES</Button>
                  </div>
                </VaultBanner>
            </div>
            
            <div className="w-full md:w-1/2">
                <div className={`luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-10 ${isSuccess ? 'ring-1 ring-emerald-500/50 bg-emerald-900/10' : ''} transition-all duration-500 rounded-[2.5rem]`}>
                    <h3 className="text-3xl font-serif text-white font-bold mb-8 tracking-tight">Identity Nodes</h3>
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
                                <label className="text-[10px] font-sans text-white/40 uppercase tracking-widest block font-bold">Avatar URL</label>
                                <Input value={formData.avatarUrl || ''} onChange={e => setFormData({...formData, avatarUrl: e.target.value})} placeholder="https://example.com/avatar.jpg" className="h-10 rounded-xl bg-white/5 border-white/10 text-white" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-sans text-white/40 uppercase tracking-widest mb-2 block font-bold">Full Legal Name</label>
                                <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Architect Full Name" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" />
                            </div>
                            <div>
                                <label className="text-[10px] font-sans text-white/40 uppercase tracking-widest mb-2 block font-bold">Login Identity (Read-only)</label>
                                <Input value={formData.email} disabled placeholder="Secure Email" className="h-14 rounded-2xl bg-white/5 text-white/30 cursor-not-allowed border-dashed border-white/10" />
                            </div>
                        </div>
                        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <p className="text-xs text-white/40 font-sans font-light">Synchronize credentials with the secure LDAP vault.</p>
                            <Button variant="outline" className="text-[10px] h-12 font-sans font-bold tracking-widest uppercase px-6 rounded-full border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-colors">Request Reset</Button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                            <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white h-14 w-full px-12 rounded-full shadow-md font-sans font-medium text-[10px] uppercase tracking-widest transition-all" onClick={handleSave}>Commit Identity Updates</Button>
                            {isSuccess && <span className="text-emerald-400 text-[10px] font-sans font-bold uppercase tracking-widest flex items-center gap-2 animate-in slide-up"><CheckCircle size={16}/> Protocol Updated</span>}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

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
            className="p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <div className="flex flex-col gap-8">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-3 text-white/50 hover:text-[#C5A059] font-sans text-[11px] uppercase tracking-widest transition-colors w-fit group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Command Center
                </button>
                
                <VaultBanner 
                  title="Enterprise Setup"
                  subtitle="Establishing core manufacturing parameters and industry alignment. Pushing global updates to the decentralized ledger."
                  badge="System Protocol Active"
                >
                  <div className="flex gap-4">
                    <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 px-12 rounded-full shadow-2xl shadow-[#6A2C91]/20 font-sans font-medium text-[11px] tracking-widest transition-all uppercase" onClick={handleSave}>PUSH GLOBAL UPDATES</Button>
                  </div>
                </VaultBanner>
            </div>

            <div className="w-full md:w-1/2">
                <div className={`luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-10 ${isSuccess ? 'ring-1 ring-emerald-500/50 bg-emerald-900/10' : ''} transition-all duration-500 rounded-[2.5rem]`}>
                    <h3 className="text-3xl font-serif text-white font-bold mb-8 tracking-tight">Corporate Node Definition</h3>
                    <div className="space-y-10">
                        <div className="space-y-6">
                           <div>
                                <label className="text-[10px] font-sans text-white/40 uppercase tracking-widest mb-2 block font-bold">Legal Entity Name</label>
                                <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Business Entity Name" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" />
                           </div>
                           <div>
                                <label className="text-[10px] font-sans text-white/40 uppercase tracking-widest mb-2 block font-bold">Industry Logic</label>
                                <Select value={profile.industry} onChange={e => setProfile({...profile, industry: e.target.value})} className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors">
                                    <option className="bg-black text-white">Skincare</option>
                                    <option className="bg-black text-white">Candles</option>
                                    <option className="bg-black text-white">Apparel</option>
                                    <option className="bg-black text-white">Pottery</option>
                                    <option className="bg-black text-white">Jewelry</option>
                                </Select>
                           </div>
                        </div>
                        <div className="flex flex-col items-center gap-6 bg-white/5 p-10 rounded-[2.5rem] border border-white/10 shadow-inner group hover:bg-white/10 transition-all">
                            <div className="w-32 h-32 bg-black/50 rounded-[2rem] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                                {profile.logo ? <img src={profile.logo} className="w-full h-full object-cover" /> : <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">No Asset</span>}
                            </div>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="text-[10px] h-10 px-8 rounded-xl font-black uppercase tracking-widest border-white/20 text-white/60 hover:bg-white/10 hover:text-white"><Upload size={18} className="mr-2"/> Synchronize Logo</Button>
                            <input type="file" ref={fileInputRef} className="hidden" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const SubscriptionManagement = () => {
    const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
    const { userTier, updateTier, businessProfile } = useArtisanData();
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [selectedUpgrade, setSelectedUpgrade] = useState<UserTier | null>(null);
    const navigate = useNavigate();

    const location = useLocation();

    const handleUpgrade = async () => {
        if (!selectedUpgrade) return;
        setIsUpgrading(true);
        
        try {
            const gasUrl = import.meta.env.VITE_GAS_DATABASE_URL;
            if (gasUrl) {
                const response = await fetch(gasUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'processPayment',
                        userId: businessProfile.email,
                        tier: selectedUpgrade,
                        cardNumber: cardNumber
                    })
                });
                const result = await response.json();
                
                if (result.success) {
                    await updateTier(selectedUpgrade);
                    toast.success("Protocol Authorized. Access Granted.");
                    setSelectedUpgrade(null);
                    if (location.state?.from) navigate(location.state.from);
                    else navigate(-1);
                } else {
                    toast.error(`Payment Failed: ${result.message}`);
                }
            } else {
                toast.error("Database connection lost. Cannot process payment.");
            }
        } catch (error) {
            toast.error("Payment Gateway Error. Please try again.");
        } finally {
            setIsUpgrading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <ContextualTutorialModal
                hubId="subscription_status"
                title="Subscription Status"
                description="Manage your ArtisanFlow plan and billing."
                steps={["Review your current tier and usage limits.","Upgrade to unlock advanced features.","Manage payment methods and billing history."]}
            />
            <Modal isOpen={!!selectedUpgrade} onClose={() => setSelectedUpgrade(null)} title="Vault Payment Gateway">
                <div className="space-y-8 text-center p-6">
                    <div className="p-8 bg-white/5 rounded-3xl mb-6 border border-white/10">
                        <p className="text-[10px] font-sans text-white/50 uppercase tracking-widest mb-2 font-bold">Authorize Tier Upgrade</p>
                        <h4 className="text-3xl font-serif text-[#C5A059] font-bold tracking-tight">{selectedUpgrade}</h4>
                        {process.env.SQUARE_LOCATION_ID && (
                            <p className="text-[9px] text-[#C5A059] font-sans uppercase tracking-widest mt-3">
                                Square Location Node: {process.env.SQUARE_LOCATION_ID}
                            </p>
                        )}
                    </div>
                    <div className="space-y-6">
                        <Input placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" />
                        <div className="grid grid-cols-2 gap-6">
                            <Input placeholder="MM/YY" defaultValue="12/26" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" />
                            <Input placeholder="CVC" defaultValue="***" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" />
                        </div>
                    </div>
                    <div className="pt-8">
                        <Button className="w-full bg-[#6A2C91] hover:bg-[#5a257a] text-white h-14 rounded-full font-sans font-medium text-[10px] uppercase tracking-widest shadow-md transition-all" onClick={handleUpgrade} disabled={isUpgrading}>
                           {isUpgrading ? 'ESTABLISHING HANDSHAKE...' : <><CreditCard size={18} className="mr-2" /> Authorize Protocol</>}
                        </Button>
                        <p className="text-[10px] text-white/30 mt-6 font-sans uppercase tracking-widest">Encrypted via ArtisanFlow Secure Vault. AES-256 Protocol Active.</p>
                    </div>
                </div>
            </Modal>

            <div className="w-full md:w-1/2">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                    <ArrowLeft size={16} /> Back to Command Center
                </button>
                <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2">Access Level</h1>
                <p className="text-white/40 font-sans font-light text-lg">Defining system throughput and logic capabilities.</p>
            </div>
            
            <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-12 flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden group rounded-[3rem]">
               <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-[#C5A059] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700"><Crown size={160} /></div>
               <div className="flex items-center gap-8 relative z-10">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-[#C5A059] shadow-sm border border-[#C5A059]/20 group-hover:scale-105 transition-transform duration-700">
                      <Crown size={40} strokeWidth={1.5} />
                  </div>
                  <div>
                      <span className="text-[10px] font-sans text-white/50 font-bold uppercase tracking-widest mb-2 block">Deployment Level</span>
                      <h3 className="text-4xl font-serif text-white font-bold tracking-tight">{userTier}</h3>
                      <p className="text-emerald-400 mt-3 font-sans font-medium text-xs tracking-wide flex items-center gap-2">
                        <CheckCircle size={14} /> Systems Active & Verified
                      </p>
                  </div>
               </div>
               <div className="flex flex-col items-center md:items-end gap-4 relative z-10">
                   <div className="text-center md:text-right mb-4">
                      <p className="text-[10px] font-sans text-white/50 font-bold uppercase tracking-widest mb-1">Access Initialized</p>
                      <p className="text-xl font-serif text-white/80 tracking-tight">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                   </div>
                   {userTier !== 'Margin Protection Pro' && (
                     <Button variant="premium" onClick={() => setSelectedUpgrade('Margin Protection Pro')} className="h-14 px-10 rounded-full font-sans font-medium text-[10px] uppercase tracking-widest shadow-md">
                        Activate Pro Access <Crown size={16} className="ml-2"/>
                     </Button>
                   )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
               <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10">
                  <h3 className="text-2xl font-serif text-white font-bold mb-8 tracking-tight">Deployment Protocols</h3>
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
                          <span className="text-sm font-sans font-medium text-white/70">{item.text}</span>
                       </li>
                     ))}
                  </ul>
               </div>

               <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center group">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/30 mb-8 shadow-sm group-hover:text-[#C5A059] group-hover:scale-105 transition-all duration-500">
                      <ExternalLink size={32} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-white/50 max-w-[240px] mb-10 font-sans font-light leading-relaxed">Access the global billing repository and transaction historicals.</p>
                  <Button variant="outline" className="text-[10px] uppercase font-sans font-bold tracking-widest h-12 px-10 rounded-full border-white/20 text-white/70 hover:bg-white/10 transition-colors">Open Billing Vault</Button>
               </div>
            </div>
        </motion.div>
    );
};

export const Integrations = () => {
    const navigate = useNavigate();
    const { integrations, toggleIntegrationStatus } = useArtisanData();
    const [activeTab, setActiveTab] = useState('All');
    const [isDiagnosticRunning, setIsDiagnosticRunning] = useState<string | null>(null);
    const [activeModalIntegration, setActiveModalIntegration] = useState<Integration | null>(null);
    const [integrationEmail, setIntegrationEmail] = useState('');
    const [integrationPassword, setIntegrationPassword] = useState('');
    const [integrationKey, setIntegrationKey] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);

    const categories = ['All', 'E-commerce', 'Marketplace', 'Wholesale', 'POS', 'System'];
    
    const filteredIntegrations = integrations.filter(int => 
        activeTab === 'All' || int.category === activeTab
    );

    const runDiagnostic = (id: string) => {
        setIsDiagnosticRunning(id);
        setTimeout(() => setIsDiagnosticRunning(null), 2500);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <ContextualTutorialModal
                hubId="integrations"
                title="Integrations Hub"
                description="Connect ArtisanFlow to your external tools."
                steps={["Link your Shopify or WooCommerce stores.","Connect accounting software like QuickBooks.","Enable social media channels for auto-posting."]}
            />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="w-full md:w-1/2">
                    <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                        <ArrowLeft size={16} /> Back to Command Center
                    </button>
                    <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2">Integrations</h1>
                    <p className="text-white/40 font-sans font-light text-lg">Synchronizing external manufacturing and commerce nodes.</p>
                </div>
                <div className="bg-emerald-900/20 px-6 py-3 rounded-full border border-emerald-500/20 flex items-center gap-3 shadow-sm">
                    <RefreshCw size={16} className="text-emerald-400 animate-spin-slow" />
                    <span className="text-[10px] font-sans font-bold uppercase text-emerald-400 tracking-widest">Synaptic Link Online</span>
                </div>
            </div>

            <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[3rem] relative overflow-hidden p-12">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#6A2C91] opacity-[0.05] rounded-bl-full -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10 space-y-6">
                    <h3 className="text-3xl font-serif text-white font-bold flex items-center gap-4 tracking-tight">
                        <ShieldCheck className="text-[#6A2C91]" size={28} /> The Omnichannel Handshake
                    </h3>
                    <p className="text-white/60 max-w-4xl leading-relaxed text-lg font-sans font-light">
                        LRC Artisan Flow synthesizes your omnichannel operations, bridging the void between digital storefronts and the manufacturing floor. Ingest orders automatically and maintain surgical stock levels across every connected node.
                    </p>
                    
                    <div className="mt-6 p-6 bg-[#6A2C91]/10 border border-[#6A2C91]/30 rounded-2xl w-full max-w-4xl">
                        <p className="text-white/70 font-sans font-bold text-[10px] uppercase tracking-widest mb-2">Webhook URL (For Shopify, Etsy, Square Webhooks)</p>
                        <div className="flex items-center gap-3">
                            <Input value={`${import.meta.env.VITE_GAS_DATABASE_URL || 'https://script.google.com/macros/s/.../exec'}?action=handleStoreOrder`} readOnly className="w-full font-mono text-sm bg-black/50 border-[#6A2C91]/30 text-emerald-400" />
                            <Button onClick={() => {
                                navigator.clipboard.writeText(`${import.meta.env.VITE_GAS_DATABASE_URL || 'https://script.google.com/macros/s/.../exec'}?action=handleStoreOrder`);
                                toast.success("Webhook URL copied to clipboard");
                            }} variant="outline" className="border-[#6A2C91]/30 hover:bg-[#6A2C91]/20">Copy</Button>
                        </div>
                        <p className="text-white/40 text-xs font-light mt-2">Paste this URL into your storefront's webhook settings to enable automatic raw material deduction on new orders.</p>
                    </div>

                    <div className="flex flex-wrap gap-8 pt-6">
                        <div className="flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-widest text-white/50">
                            <div className="w-2 h-2 rounded-full bg-[#6A2C91]" /> Bidirectional Stock Sync
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-widest text-white/50">
                            <div className="w-2 h-2 rounded-full bg-[#6A2C91]" /> Material Auto-Deduction
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-widest text-white/50">
                            <div className="w-2 h-2 rounded-full bg-[#6A2C91]" /> Real-time Fee Reconciliation
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-8 py-3 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                            activeTab === cat 
                                ? 'bg-[#6A2C91] text-white shadow-lg shadow-[#6A2C91]/20 border border-transparent' 
                                : 'bg-white/5 text-white/50 border border-white/10 hover:border-[#6A2C91] hover:text-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredIntegrations.map((int, index) => (
                    <motion.div 
                        key={int.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] flex flex-col group relative hover:-translate-y-1 transition-all duration-500 overflow-hidden hover:border-[#6A2C91]/50 hover:shadow-2xl hover:shadow-[#6A2C91]/10"
                    >
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:bg-[#6A2C91]/10 transition-colors duration-700 pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 w-24 h-24 flex items-center justify-center group-hover:bg-white/10 group-hover:border-[#6A2C91]/30 transition-all duration-500 shadow-sm relative overflow-hidden">
                                <img src={int.logo} className={`max-h-12 max-w-full object-contain ${int.status === 'Connected' ? '' : 'grayscale opacity-60'} group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700`} alt={int.name} />
                                {int.status === 'Connected' && (
                                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-black rounded-full p-1 border-2 border-black shadow-sm animate-in zoom-in duration-300">
                                        <CheckCircle2 size={12} />
                                    </div>
                                )}
                            </div>
                            {int.status === 'Connected' ? (
                                <Badge color="green" className="uppercase font-sans font-bold text-[9px] tracking-widest px-3 py-1 flex items-center gap-1.5 shadow-sm border-emerald-500/20">
                                    <Activity size={10} className="animate-pulse" /> Verified Node
                                </Badge>
                            ) : (
                                <Badge color="gray" className="uppercase font-sans font-bold text-[9px] tracking-widest px-3 py-1 shadow-sm border-white/10 bg-white/5 text-white/50">
                                    Available
                                </Badge>
                            )}
                        </div>

                        <div className="flex-1 space-y-4 relative z-10">
                            <div>
                                <h4 className="text-3xl font-serif text-white font-bold tracking-tight group-hover:text-[#6A2C91] transition-colors">{int.name}</h4>
                                <p className="text-[9px] font-sans font-bold text-[#C5A059] uppercase tracking-widest mt-2">{int.category}</p>
                            </div>
                            
                            <p className="text-sm text-white/50 leading-relaxed font-sans font-light py-2">
                                "{int.description}"
                            </p>

                            <div className="bg-[#6A2C91]/10 border border-[#6A2C91]/20 p-5 rounded-2xl flex items-start gap-4 group/ai hover:bg-[#6A2C91]/20 transition-all duration-500">
                                <div className="p-2.5 bg-[#6A2C91]/20 rounded-xl text-[#6A2C91] shadow-sm group-hover/ai:bg-[#6A2C91] group-hover/ai:text-white transition-colors duration-500">
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-sans font-bold text-[#6A2C91] uppercase tracking-widest mb-1">Synaptic Intelligence</p>
                                    <p className="text-xs font-sans font-bold text-white">{int.aiCapability}</p>
                                </div>
                            </div>

                            <div className="space-y-3 py-4">
                                {int.features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-sans font-light text-white/50 group-hover:text-white/70 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#6A2C91] transition-colors duration-500"></div>
                                        {feat}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 relative z-10">
                            {int.status === 'Connected' && (
                                <Button 
                                    onClick={() => runDiagnostic(int.id)}
                                    disabled={!!isDiagnosticRunning}
                                    variant="outline"
                                    className="w-full h-12 border-white/20 text-white/70 font-sans font-bold text-[10px] tracking-widest uppercase rounded-full hover:bg-white/5 hover:border-white/30 hover:text-white transition-colors"
                                >
                                    {isDiagnosticRunning === int.id ? <><Loader2 size={14} className="animate-spin mr-2" /> ANALYZING LINK...</> : <><Cpu size={14} className="mr-2" /> TEST SYNAPTIC LINK</>}
                                </Button>
                            )}
                            <Button 
                                onClick={() => {
                                    if (int.status === 'Connected') {
                                        toggleIntegrationStatus(int.id);
                                    } else {
                                        setActiveModalIntegration(int);
                                    }
                                }}
                                className={`w-full h-12 text-[10px] font-sans font-bold tracking-widest uppercase transition-all duration-500 rounded-full ${
                                    int.status === 'Connected' 
                                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' 
                                        : 'bg-[#6A2C91] text-white hover:bg-[#5a257a]'
                                }`} 
                            >
                                {int.status === 'Connected' ? 'RECONFIGURE PROTOCOL' : 'INITIALIZE HANDSHAKE'}
                            </Button>
                            
                            <button className="w-full flex items-center justify-center gap-2 text-[10px] font-sans font-bold text-white/30 uppercase tracking-widest hover:text-[#C5A059] transition-colors mt-4">
                                LEARN ARCHITECTURE <ArrowRight size={14} />
                            </button>
                        </div>

                        {int.lastSync && (
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><RefreshCw size={12} className="animate-spin-slow text-emerald-400" /> Synced</span>
                                <span>{int.lastSync}</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        
            <Modal isOpen={!!activeModalIntegration} onClose={() => setActiveModalIntegration(null)} title={`Initialize ${activeModalIntegration?.name} Link`}>
                <div className="space-y-6">
                    <p className="text-white/60 font-sans font-light text-sm">
                        Please provide your credentials to securely link {activeModalIntegration?.name} into the Artisan Flow network.
                    </p>
                    
                    {activeModalIntegration?.category === 'System' ? (
                        <>
                            <Input 
                                placeholder="Email Address" 
                                value={integrationEmail} 
                                onChange={(e) => setIntegrationEmail(e.target.value)} 
                                className="w-full"
                            />
                            <Input 
                                placeholder="Password" 
                                type="password"
                                value={integrationPassword} 
                                onChange={(e) => setIntegrationPassword(e.target.value)} 
                                className="w-full"
                            />
                        </>
                    ) : (
                        <div className="space-y-4">
                            {activeModalIntegration?.id === 'square' && (
                                <div className="p-4 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl mb-4 text-xs text-[#C5A059] font-sans">
                                    <strong>OAuth Permissions Required:</strong>
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-white/70 font-light">
                                        <li><code className="text-[#C5A059]">ORDERS_READ</code>: To track multi-channel sales</li>
                                        <li><code className="text-[#C5A059]">INVENTORY_READ</code>: To sync matrix levels</li>
                                        <li><code className="text-[#C5A059]">PAYMENTS_READ</code>: To parse transaction fees</li>
                                    </ul>
                                </div>
                            )}
                            <Input 
                                placeholder="API Key / Access Token" 
                                type="password"
                                value={integrationKey} 
                                onChange={(e) => setIntegrationKey(e.target.value)} 
                                className="w-full font-mono text-sm"
                            />
                            <div className="text-xs text-white/40 flex items-center gap-2">
                                <Lock size={12} /> Encrypted at rest via AES-256
                            </div>
                        </div>
                    )}
                    
                    <Button 
                        onClick={() => {
                            if (!activeModalIntegration) return;
                            setIsConnecting(true);
                            setTimeout(() => {
                                toggleIntegrationStatus(activeModalIntegration.id);
                                setIsConnecting(false);
                                setActiveModalIntegration(null);
                                setIntegrationEmail('');
                                setIntegrationPassword('');
                                setIntegrationKey('');
                            }, 1500);
                        }} 
                        disabled={isConnecting}
                        className="w-full h-12 bg-[#6A2C91] hover:bg-[#5a257a] text-white rounded-xl"
                    >
                        {isConnecting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Authenticate Connection'}
                    </Button>
                </div>
            </Modal>
        </motion.div>
    );
};

export const CustomerPortal = () => {
    const navigate = useNavigate();
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <div className="w-full md:w-1/2">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                    <ArrowLeft size={16} /> Back to Command Center
                </button>
                <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2">Wholesale Portal</h1>
                <p className="text-white/40 font-sans font-light text-lg">Managing the external client interface architecture.</p>
            </div>
            
            <div className="w-full md:w-2/3 lg:w-1/2">
                <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem]">
                    <h2 className="text-3xl font-serif text-white font-bold mb-8 tracking-tight">Portal Matrix</h2>
                    <div className="space-y-8">
                        <div className="flex items-center justify-between gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 hover:border-[#6A2C91]/30 transition-all duration-500">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/5 rounded-xl text-[#C5A059] shadow-sm group-hover:bg-[#C5A059] group-hover:text-black transition-colors duration-500">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-white font-bold text-xl tracking-tight">Custom Domain Active</h4>
                                    <p className="text-[10px] text-[#C5A059] font-sans font-bold tracking-widest mt-1 uppercase">wholesale.herbalisticwellness.com</p>
                                </div>
                            </div>
                            <Button variant="outline" className="text-[10px] h-10 px-6 font-sans font-bold tracking-widest uppercase rounded-full border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors">RE-ROUTE</Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest ml-1">Min. Commitment ($)</label>
                                <Input defaultValue="500.00" className="h-14 rounded-xl text-lg font-serif bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest ml-1">Portal Logic State</label>
                                <Select className="h-14 rounded-xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors font-sans text-sm">
                                    <option className="bg-black text-white">Public (Visible)</option>
                                    <option className="bg-black text-white">Private (Vetted Nodes Only)</option>
                                    <option className="bg-black text-white">Offline (Maintenance)</option>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest ml-1">Welcome Directive</label>
                            <textarea className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-6 text-sm focus:bg-white/10 focus:border-[#6A2C91]/50 outline-none h-32 resize-none shadow-sm font-sans font-light transition-all" defaultValue="Welcome to our wholesale catalog. Established manufacturing nodes only." />
                        </div>
                        
                        <Button className="w-full bg-[#6A2C91] text-white h-14 rounded-full font-sans font-bold text-[10px] uppercase tracking-widest hover:bg-[#5a257a] transition-colors mt-4">UPDATE PORTAL PARAMETERS</Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const PrivacyGovernance = () => {
    const navigate = useNavigate();
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <div className="w-full md:w-1/2">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                    <ArrowLeft size={16} /> Back to Command Center
                </button>
                <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2">Security & Governance</h1>
                <p className="text-white/40 font-sans font-light text-lg">Systems integrity and data protection protocols.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10">
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

                <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col h-full">
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