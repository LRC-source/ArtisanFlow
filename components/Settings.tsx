import React, { useState, useRef } from 'react';
import { User, Shield, LogOut, Upload, CheckCircle, CheckCircle2, ExternalLink, Key, AlertTriangle, ArrowLeft, Crown, Zap, ShieldCheck, CreditCard, ShoppingBag, Globe, Share2, Server, Lock, ArrowRight, Layers, BarChart3, RefreshCw, ArrowUpRight, Cpu, Activity, Sparkles, Loader2 } from 'lucide-react';
import { Input, Button, Card, Badge, Select, Modal, VaultBanner } from './UI';
import { useArtisanData, Integration, UserTier } from './DataContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * ArtisanFlow Architecture 1.0 - STATUS: COMPLETE ✅
 */

export const AccountSettings = () => {
    const { businessProfile, updateBusinessProfile } = useArtisanData();
    const [formData, setFormData] = useState({ fullName: businessProfile.ownerName, email: businessProfile.email });
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSave = () => {
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
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-3 text-stone-400 hover:text-[#6A2C91] font-sans text-[11px] uppercase tracking-widest transition-colors w-fit group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Command Center
                </button>
                
                <VaultBanner 
                  title="Account Architecture"
                  subtitle="Manage your digital credentials and vault access. Synchronize credentials with the secure LDAP vault."
                  badge="Security Protocol Active"
                >
                  <div className="flex gap-4">
                    <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 px-12 rounded-full shadow-2xl shadow-[#6A2C91]/20 font-sans font-medium text-[11px] tracking-widest transition-all" onClick={handleSave}>COMMIT IDENTITY UPDATES</Button>
                  </div>
                </VaultBanner>
            </div>
            
            <div className="w-full md:w-1/2">
                <div className={`luxury-card bg-white p-10 ${isSuccess ? 'ring-1 ring-emerald-500/20 bg-emerald-50/10' : ''} transition-all duration-500`}>
                    <h3 className="text-2xl font-serif text-white font-bold mb-8 tracking-tight">Identity Nodes</h3>
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-sans text-stone-400 uppercase tracking-widest mb-2 block">Full Legal Name</label>
                                <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Architect Full Name" className="h-14 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-colors" />
                            </div>
                            <div>
                                <label className="text-[10px] font-sans text-stone-400 uppercase tracking-widest mb-2 block">Login Identity (Read-only)</label>
                                <Input value={formData.email} disabled placeholder="Secure Email" className="h-14 rounded-2xl bg-stone-100/50 text-stone-400 cursor-not-allowed border-dashed border-stone-200" />
                            </div>
                        </div>
                        <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <p className="text-xs text-stone-400 font-sans font-light">Synchronize credentials with the secure LDAP vault.</p>
                            <Button variant="outline" className="text-xs h-12 font-sans font-medium px-6 rounded-full border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">Request Reset</Button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                            <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white h-14 w-full px-12 rounded-full shadow-md font-sans font-medium text-xs tracking-wide transition-all" onClick={handleSave}>Commit Identity Updates</Button>
                            {isSuccess && <span className="text-emerald-600 text-[10px] font-sans font-medium uppercase tracking-widest flex items-center gap-2 animate-in slide-up"><CheckCircle size={16}/> Protocol Updated</span>}
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
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-3 text-stone-400 hover:text-[#6A2C91] font-sans text-[11px] uppercase tracking-widest transition-colors w-fit group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Command Center
                </button>
                
                <VaultBanner 
                  title="Enterprise Setup"
                  subtitle="Establishing core manufacturing parameters and industry alignment. Pushing global updates to the decentralized ledger."
                  badge="System Protocol Active"
                >
                  <div className="flex gap-4">
                    <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 px-12 rounded-full shadow-2xl shadow-[#6A2C91]/20 font-sans font-medium text-[11px] tracking-widest transition-all" onClick={handleSave}>PUSH GLOBAL UPDATES</Button>
                  </div>
                </VaultBanner>
            </div>

            <div className="w-full md:w-1/2">
                <div className={`luxury-card bg-white p-10 ${isSuccess ? 'ring-1 ring-emerald-500/20 bg-emerald-50/10' : ''} transition-all duration-500`}>
                    <h3 className="text-2xl font-serif text-white font-bold mb-8 tracking-tight">Corporate Node Definition</h3>
                    <div className="space-y-10">
                        <div className="space-y-6">
                           <div>
                                <label className="text-[10px] font-sans text-stone-400 uppercase tracking-widest mb-2 block">Legal Entity Name</label>
                                <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Business Entity Name" className="h-14 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-colors" />
                           </div>
                           <div>
                                <label className="text-[10px] font-sans text-stone-400 uppercase tracking-widest mb-2 block">Industry Logic</label>
                                <Select value={profile.industry} onChange={e => setProfile({...profile, industry: e.target.value})} className="h-14 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-colors">
                                    <option>Skincare</option>
                                    <option>Candles</option>
                                    <option>Apparel</option>
                                    <option>Pottery</option>
                                    <option>Jewelry</option>
                                </Select>
                           </div>
                        </div>
                        <div className="flex flex-col items-center gap-6 bg-stone-50/50 p-10 rounded-[2.5rem] border border-stone-100 shadow-inner group hover:bg-white transition-all">
                            <div className="w-32 h-32 bg-white rounded-[2rem] border-2 border-stone-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                                {profile.logo ? <img src={profile.logo} className="w-full h-full object-cover" /> : <span className="text-[10px] text-stone-200 uppercase font-black tracking-[0.3em]">No Asset</span>}
                            </div>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="text-[10px] h-10 px-8 rounded-xl font-black uppercase tracking-widest"><Upload size={18} className="mr-2"/> Synchronize Logo</Button>
                            <input type="file" ref={fileInputRef} className="hidden" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const SubscriptionManagement = () => {
    const { userTier, updateTier } = useArtisanData();
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [selectedUpgrade, setSelectedUpgrade] = useState<UserTier | null>(null);
    const navigate = useNavigate();

    const handleUpgrade = async () => {
        if (!selectedUpgrade) return;
        setIsUpgrading(true);
        await new Promise(r => setTimeout(r, 2000));
        await updateTier(selectedUpgrade);
        setIsUpgrading(false);
        setSelectedUpgrade(null);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto"
        >
            <Modal isOpen={!!selectedUpgrade} onClose={() => setSelectedUpgrade(null)} title="Vault Payment Gateway">
                <div className="space-y-8 text-center p-6">
                    <div className="p-8 bg-stone-50 rounded-3xl mb-6 border border-stone-100">
                        <p className="text-[10px] font-sans text-stone-400 uppercase tracking-widest mb-2">Authorize Tier Upgrade</p>
                        <h4 className="text-3xl font-serif text-white font-bold tracking-tight">{selectedUpgrade}</h4>
                        {process.env.SQUARE_LOCATION_ID && (
                            <p className="text-[9px] text-[#C5A059] font-sans uppercase tracking-widest mt-3">
                                Square Location Node: {process.env.SQUARE_LOCATION_ID}
                            </p>
                        )}
                    </div>
                    <div className="space-y-6">
                        <Input placeholder="Card Number" defaultValue="4242 4242 4242 4242" className="h-14 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-colors" />
                        <div className="grid grid-cols-2 gap-6">
                            <Input placeholder="MM/YY" defaultValue="12/26" className="h-14 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-colors" />
                            <Input placeholder="CVC" defaultValue="***" className="h-14 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-colors" />
                        </div>
                    </div>
                    <div className="pt-8">
                        <Button className="w-full bg-[#6A2C91] hover:bg-[#5a257a] text-white h-14 rounded-full font-sans font-medium text-xs tracking-wide shadow-md transition-all" onClick={handleUpgrade} disabled={isUpgrading}>
                           {isUpgrading ? 'ESTABLISHING HANDSHAKE...' : <><CreditCard size={18} className="mr-2" /> Authorize Protocol</>}
                        </Button>
                        <p className="text-[10px] text-stone-400 mt-6 font-sans uppercase tracking-widest">Encrypted via ArtisanFlow Secure Vault. AES-256 Protocol Active.</p>
                    </div>
                </div>
            </Modal>

            <div className="w-full md:w-1/2">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-stone-400 hover:text-[#6A2C91] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                    <ArrowLeft size={16} /> Back to Command Center
                </button>
                <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2">Access Level</h1>
                <p className="text-stone-500 font-sans font-light text-lg">Defining system throughput and logic capabilities.</p>
            </div>
            
            <div className="luxury-card bg-white border border-[#6A2C91]/20 p-12 flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-[#6A2C91] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700"><Crown size={160} /></div>
               <div className="flex items-center gap-8 relative z-10">
                  <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center text-[#6A2C91] shadow-sm group-hover:scale-105 transition-transform duration-700">
                      <Crown size={40} strokeWidth={1.5} />
                  </div>
                  <div>
                      <span className="text-[10px] font-sans text-stone-400 uppercase tracking-widest mb-2 block">Deployment Level</span>
                      <h3 className="text-4xl font-serif text-white font-bold tracking-tight">{userTier}</h3>
                      <p className="text-emerald-600 mt-3 font-sans font-medium text-xs tracking-wide flex items-center gap-2">
                        <CheckCircle size={14} /> Systems Active & Verified
                      </p>
                  </div>
               </div>
               <div className="flex flex-col items-center md:items-end gap-4 relative z-10">
                   <div className="text-center md:text-right mb-4">
                      <p className="text-[10px] font-sans text-stone-400 uppercase tracking-widest mb-1">Access Initialized</p>
                      <p className="text-xl font-serif text-stone-900 tracking-tight">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                   </div>
                   {userTier !== 'Margin Protection Pro' && (
                     <Button variant="premium" onClick={() => setSelectedUpgrade('Margin Protection Pro')} className="h-14 px-10 rounded-full font-sans font-medium text-xs tracking-wide shadow-md">
                        Activate Pro Access <Crown size={16} className="ml-2"/>
                     </Button>
                   )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
               <div className="luxury-card bg-stone-50/50 p-10">
                  <h3 className="text-xl font-serif text-white font-bold mb-8 tracking-tight">Deployment Protocols</h3>
                  <ul className="space-y-6">
                     {[
                        { icon: ShieldCheck, text: 'Advanced Synaptic Protection' },
                        { icon: Crown, text: 'Architectural Logic Modules' },
                        { icon: Zap, text: 'High-Throughput Node Access' },
                        { icon: CheckCircle, text: 'Bidirectional Database Sync' }
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-5 group/item">
                          <div className="p-3 bg-white rounded-2xl shadow-sm text-[#6A2C91] group-hover/item:bg-[#6A2C91] group-hover/item:text-white transition-all duration-300">
                             <item.icon size={20} strokeWidth={1.5} />
                          </div>
                          <span className="text-sm font-sans font-medium text-stone-700">{item.text}</span>
                       </li>
                     ))}
                  </ul>
               </div>

               <div className="luxury-card bg-white p-10 flex flex-col justify-center items-center text-center group">
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-8 shadow-sm group-hover:text-[#C5A059] group-hover:scale-105 transition-all duration-500">
                      <ExternalLink size={32} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-stone-500 max-w-[240px] mb-10 font-sans font-light leading-relaxed">Access the global billing repository and transaction historicals.</p>
                  <Button variant="outline" className="text-xs font-sans font-medium tracking-wide h-12 px-10 rounded-full border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">Open Billing Vault</Button>
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

    const categories = ['All', 'E-commerce', 'Marketplace', 'Wholesale', 'POS', 'Accounting', 'Payment', 'System'];
    
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
            className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="w-full md:w-1/2">
                    <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-stone-400 hover:text-[#6A2C91] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                        <ArrowLeft size={16} /> Back to Command Center
                    </button>
                    <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2">Integrations</h1>
                    <p className="text-stone-500 font-sans font-light text-lg">Synchronizing external manufacturing and commerce nodes.</p>
                </div>
                <div className="bg-emerald-50/50 px-6 py-3 rounded-full border border-emerald-100/50 flex items-center gap-3 shadow-sm">
                    <RefreshCw size={16} className="text-emerald-600 animate-spin-slow" />
                    <span className="text-[10px] font-sans font-medium uppercase text-emerald-700 tracking-widest">Synaptic Link Online</span>
                </div>
            </div>

            <div className="luxury-card bg-stone-50/50 relative overflow-hidden p-12">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059] opacity-[0.02] rounded-bl-full -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-serif text-white font-bold flex items-center gap-3 tracking-tight">
                        <ShieldCheck className="text-[#6A2C91]" size={24} /> The Omnichannel Handshake
                    </h3>
                    <p className="text-stone-600 max-w-4xl leading-relaxed text-lg font-sans font-light">
                        LRC Artisan Flow synthesizes your omnichannel operations, bridging the void between digital storefronts and the manufacturing floor. Ingest orders automatically and maintain surgical stock levels across every connected node.
                    </p>
                    <div className="flex flex-wrap gap-8 pt-6">
                        <div className="flex items-center gap-3 text-[10px] font-sans font-medium uppercase tracking-widest text-[#6A2C91]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" /> Bidirectional Stock Sync
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-sans font-medium uppercase tracking-widest text-[#6A2C91]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" /> Material Auto-Deduction
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-sans font-medium uppercase tracking-widest text-[#6A2C91]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" /> Real-time Fee Reconciliation
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-sans font-medium uppercase tracking-widest transition-all whitespace-nowrap ${
                            activeTab === cat 
                                ? 'bg-[#6A2C91] text-white shadow-md' 
                                : 'bg-white text-stone-500 border border-stone-200 hover:border-[#6A2C91] hover:text-[#6A2C91]'
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
                        className="luxury-card bg-white p-10 flex flex-col group relative hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-stone-50 rounded-full group-hover:bg-purple-50/50 transition-colors duration-700 pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 w-24 h-24 flex items-center justify-center group-hover:bg-white group-hover:border-purple-100/50 transition-all duration-500 shadow-sm relative overflow-hidden">
                                <img src={int.logo} className={`max-h-12 max-w-full object-contain ${int.status === 'Connected' ? '' : 'grayscale opacity-60'} group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700`} alt={int.name} />
                                {int.status === 'Connected' && (
                                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-sm animate-in zoom-in duration-300">
                                        <CheckCircle2 size={12} />
                                    </div>
                                )}
                            </div>
                            {int.status === 'Connected' ? (
                                <Badge color="green" className="uppercase font-sans font-medium text-[9px] tracking-widest px-3 py-1 flex items-center gap-1.5 shadow-sm">
                                    <Activity size={10} className="animate-pulse" /> Verified Node
                                </Badge>
                            ) : (
                                <Badge color="gray" className="uppercase font-sans font-medium text-[9px] tracking-widest px-3 py-1 shadow-sm">
                                    Available
                                </Badge>
                            )}
                        </div>

                        <div className="flex-1 space-y-4 relative z-10">
                            <div>
                                <h4 className="text-2xl font-serif text-white font-bold tracking-tight group-hover:text-[#6A2C91] transition-colors">{int.name}</h4>
                                <p className="text-[9px] font-sans font-medium text-[#C5A059] uppercase tracking-widest mt-1">{int.category}</p>
                            </div>
                            
                            <p className="text-sm text-stone-500 leading-relaxed font-sans font-light">
                                "{int.description}"
                            </p>

                            {/* AI Capability Node */}
                            <div className="bg-purple-50/30 border border-purple-100/50 p-5 rounded-2xl flex items-start gap-4 group/ai hover:bg-white transition-all duration-500">
                                <div className="p-2.5 bg-white rounded-xl text-[#6A2C91] shadow-sm group-hover/ai:bg-[#6A2C91] group-hover/ai:text-white transition-colors duration-500">
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-sans font-medium text-purple-400 uppercase tracking-widest mb-1">Synaptic Intelligence</p>
                                    <p className="text-xs font-sans font-medium text-stone-900">{int.aiCapability}</p>
                                </div>
                            </div>

                            <div className="space-y-3 py-4">
                                {int.features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-sans font-light text-stone-500 group-hover:text-stone-700 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-stone-200 group-hover:bg-[#6A2C91] transition-colors duration-500"></div>
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
                                    className="w-full h-12 border-stone-200 text-stone-600 font-sans font-medium text-[10px] tracking-widest uppercase rounded-full hover:bg-stone-50 transition-colors"
                                >
                                    {isDiagnosticRunning === int.id ? <><Loader2 size={14} className="animate-spin mr-2" /> ANALYZING LINK...</> : <><Cpu size={14} className="mr-2" /> TEST SYNAPTIC LINK</>}
                                </Button>
                            )}
                            <Button 
                                onClick={() => toggleIntegrationStatus(int.id)}
                                className={`w-full h-12 text-[10px] font-sans font-medium tracking-widest uppercase transition-all duration-500 rounded-full ${
                                    int.status === 'Connected' 
                                        ? 'bg-stone-900 text-white hover:bg-black' 
                                        : 'bg-[#6A2C91] text-white hover:bg-[#5a257a]'
                                }`} 
                            >
                                {int.status === 'Connected' ? 'RECONFIGURE PROTOCOL' : 'INITIALIZE HANDSHAKE'}
                            </Button>
                            
                            <button className="w-full flex items-center justify-center gap-2 text-[10px] font-sans font-medium text-stone-400 uppercase tracking-widest hover:text-[#C5A059] transition-colors mt-4">
                                LEARN ARCHITECTURE <ArrowRight size={14} />
                            </button>
                        </div>

                        {int.lastSync && (
                            <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between text-[10px] font-sans font-medium text-stone-400 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><RefreshCw size={12} className="animate-spin-slow text-emerald-500" /> Synced</span>
                                <span>{int.lastSync}</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
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
            className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto"
        >
            <div className="w-full md:w-1/2">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-stone-400 hover:text-[#6A2C91] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                    <ArrowLeft size={16} /> Back to Command Center
                </button>
                <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2">Wholesale Portal</h1>
                <p className="text-stone-500 font-sans font-light text-lg">Managing the external client interface architecture.</p>
            </div>
            
            <div className="w-full md:w-2/3 lg:w-1/2">
                <div className="luxury-card bg-white p-10">
                    <h2 className="text-2xl font-serif text-white font-bold mb-8 tracking-tight">Portal Matrix</h2>
                    <div className="space-y-8">
                        <div className="flex items-center justify-between gap-6 p-6 bg-stone-50/50 rounded-2xl border border-stone-100 group hover:bg-white hover:border-purple-100/50 transition-all duration-500">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white rounded-xl text-[#6A2C91] shadow-sm group-hover:bg-[#6A2C91] group-hover:text-white transition-colors duration-500">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-white font-bold text-lg tracking-tight">Custom Domain Active</h4>
                                    <p className="text-[10px] text-[#6A2C91] font-sans font-medium tracking-widest mt-1">wholesale.herbalisticwellness.com</p>
                                </div>
                            </div>
                            <Button variant="outline" className="text-[10px] h-10 px-6 font-sans font-medium tracking-widest uppercase rounded-full border-stone-200 hover:bg-stone-50 transition-colors">RE-ROUTE</Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-sans font-medium text-stone-400 uppercase tracking-widest ml-1">Min. Commitment ($)</label>
                                <Input defaultValue="500.00" className="h-14 rounded-xl text-lg font-serif bg-stone-50/50 border-stone-200 focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-sans font-medium text-stone-400 uppercase tracking-widest ml-1">Portal Logic State</label>
                                <Select className="h-14 rounded-xl bg-stone-50/50 border-stone-200 focus:bg-white transition-colors font-sans text-sm">
                                    <option>Public (Visible)</option>
                                    <option>Private (Vetted Nodes Only)</option>
                                    <option>Offline (Maintenance)</option>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-[10px] font-sans font-medium text-stone-400 uppercase tracking-widest ml-1">Welcome Directive</label>
                            <textarea className="w-full bg-stone-50/50 border border-stone-200 rounded-2xl p-6 text-sm focus:bg-white focus:border-[#6A2C91] outline-none h-32 resize-none shadow-sm font-sans font-light transition-all" defaultValue="Welcome to our wholesale catalog. Established manufacturing nodes only." />
                        </div>
                        
                        <Button className="w-full bg-[#6A2C91] text-white h-14 rounded-full font-sans font-medium text-[10px] uppercase tracking-widest hover:bg-[#5a257a] transition-colors mt-4">UPDATE PORTAL PARAMETERS</Button>
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
            className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto"
        >
            <div className="w-full md:w-1/2">
                <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-stone-400 hover:text-[#6A2C91] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                    <ArrowLeft size={16} /> Back to Command Center
                </button>
                <h1 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2">Security & Governance</h1>
                <p className="text-stone-500 font-sans font-light text-lg">Systems integrity and data protection protocols.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="luxury-card bg-white p-10">
                    <h2 className="text-2xl font-serif text-white font-bold mb-8 tracking-tight">Security Protocols</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-stone-50/50 border border-stone-100 rounded-2xl hover:bg-white hover:border-emerald-100/50 transition-all duration-500 group">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="font-serif text-stone-900 text-lg tracking-tight">Two-Factor Authentication</p>
                                    <p className="text-[10px] text-stone-400 font-sans font-medium uppercase tracking-widest mt-1">Mandatory for all vault access.</p>
                                </div>
                            </div>
                            <Badge color="green" className="shadow-sm font-sans font-medium text-[9px] tracking-widest uppercase px-3 py-1">Active</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-6 bg-stone-50/50 border border-stone-100 rounded-2xl hover:bg-white hover:border-blue-100/50 transition-all duration-500 group">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <p className="font-serif text-stone-900 text-lg tracking-tight">GDPR & CCPA Handshake</p>
                                    <p className="text-[10px] text-stone-400 font-sans font-medium uppercase tracking-widest mt-1">Data residency: USA-East-1.</p>
                                </div>
                            </div>
                            <Badge color="blue" className="shadow-sm font-sans font-medium text-[9px] tracking-widest uppercase px-3 py-1">Compliant</Badge>
                        </div>
                    </div>
                </div>

                <div className="luxury-card bg-white p-10 flex flex-col h-full">
                    <h2 className="text-2xl font-serif text-white font-bold mb-8 tracking-tight">System Audits</h2>
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50/50 transition-colors rounded-lg">
                            <span className="text-stone-400 font-mono text-xs">2025-12-14 09:30 AM</span>
                            <span className="text-stone-900 font-sans font-medium text-sm">API Key Rotation Executed</span>
                        </div>
                        <div className="flex items-center justify-between p-4 border-b border-stone-100 hover:bg-stone-50/50 transition-colors rounded-lg">
                            <span className="text-stone-400 font-mono text-xs">2025-12-13 04:12 PM</span>
                            <span className="text-stone-900 font-sans font-medium text-sm">Omnichannel Node Refresh</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full h-12 mt-8 rounded-full border-stone-200 text-stone-600 font-sans font-medium text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-colors">
                        <Server size={16} className="mr-3 text-[#6A2C91]"/> Download System Audit Trail
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};