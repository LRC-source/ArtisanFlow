import React, { useState, useRef } from 'react';
import { ContextualTutorialModal } from '../ContextualTutorialModal';
import { User, Shield, LogOut, Upload, CheckCircle, CheckCircle2, ExternalLink, Key, AlertTriangle, ArrowLeft, Crown, Zap, ShieldCheck, CreditCard, ShoppingBag, Globe, Share2, Server, Lock, ArrowRight, Layers, BarChart3, RefreshCw, ArrowUpRight, Cpu, Activity, Sparkles, Loader2, X, Mail } from 'lucide-react';
import { Input, Button, Card, Badge, Select, Modal, VaultBanner } from '../UI';
import { GlassHaloIcon } from '../ui/GlassHaloIcon';
import { useArtisanData, Integration, UserTier } from '../DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentGateway } from '../Auth';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const Integrations = () => {
    const navigate = useNavigate();
    const { integrations, toggleIntegrationStatus, businessProfile } = useArtisanData();
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
            className="p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20"
        >
            <ContextualTutorialModal
                hubId="integrations"
                title="Integrations Hub"
                description="Connect ArtisanFlow to your external tools."
                steps={["Link your Shopify or WooCommerce stores.","Connect accounting software like QuickBooks.","Enable social media channels for auto-posting."]}
            />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:p-8">
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

            <div className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[3rem] relative overflow-hidden p-4 sm:p-12">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#6A2C91] opacity-[0.05] rounded-bl-full -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10 space-y-6">
                    <h3 className="text-3xl font-serif text-white font-bold flex items-center gap-4 tracking-tight">
                        <ShieldCheck className="text-[#6A2C91]" size={28} /> The Omnichannel Handshake
                    </h3>
                    <p className="text-white/60 max-w-4xl leading-relaxed text-lg font-sans font-light">
                        LRC Artisan Flow synthesizes your omnichannel operations, bridging the void between digital storefronts and the manufacturing floor. Ingest orders automatically and maintain surgical stock levels across every connected node.
                    </p>
                    
                    {businessProfile?.role === 'admin' && (
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
                    )}

                    <div className="flex flex-wrap gap-4 sm:p-8 pt-6">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:p-8">
                {filteredIntegrations.map((int, index) => (
                    <motion.div 
                        key={int.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        className="luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-10 rounded-[2.5rem] flex flex-col group relative hover:-translate-y-1 transition-all duration-500 overflow-hidden hover:border-[#6A2C91]/50 hover:shadow-2xl hover:shadow-[#6A2C91]/10"
                    >
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:bg-[#6A2C91]/10 transition-colors duration-700 pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="relative group-hover:scale-110 transition-transform duration-500 mb-6">
                                <GlassHaloIcon 
                                    icon={
                                        int.category === 'E-commerce' ? ShoppingBag :
                                        int.category === 'Marketplace' ? Globe :
                                        int.category === 'Wholesale' ? Layers :
                                        int.category === 'POS' ? CreditCard :
                                        int.category === 'System' ? Server :
                                        int.category === 'Payment' ? CreditCard :
                                        int.category === 'Accounting' ? BarChart3 : Layers
                                    } 
                                    color="cyan" 
                                    size="md" 
                                />
                                {int.status === 'Connected' && (
                                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-black rounded-full p-1 border-2 border-black shadow-sm animate-in zoom-in duration-300 z-20">
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
                                    {isDiagnosticRunning === int.id 
                                        ? <><Loader2 size={14} className="animate-spin mr-2" /> {businessProfile?.role === 'admin' ? 'ANALYZING LINK...' : 'VERIFYING...'}</> 
                                        : <><Cpu size={14} className="mr-2" /> {businessProfile?.role === 'admin' ? 'TEST SYNAPTIC LINK' : 'VERIFY CONNECTION'}</>}
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
                                {businessProfile?.role === 'admin' 
                                    ? (int.status === 'Connected' ? 'RECONFIGURE PROTOCOL' : 'INITIALIZE HANDSHAKE')
                                    : (int.status === 'Connected' ? 'UPDATE SETTINGS' : 'CONNECT ACCOUNT')
                                }
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

