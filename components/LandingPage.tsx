import React, { useState } from 'react';
import { Card, Button, Input } from './UI';
import { useArtisanData, UserTier } from './DataContext';
import { Hexagon, Lock, ArrowRight, ShieldCheck, Zap, Crown, CheckCircle, Mail, Chrome, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthGateway } from './Auth';

export const LandingPage = () => {
    const { login, googleLogin, signUp } = useArtisanData();
    const navigate = useNavigate();
    const [view, setView] = useState<'hero' | 'login' | 'signup'>('hero');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [selectedTier, setSelectedTier] = useState<UserTier | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(email, pass);
        if (success) {
            navigate('/command-center');
        }
    };

    const handleGoogleAuth = async () => {
        await googleLogin();
        navigate('/command-center');
    };

    const handlePurchase = (tier: UserTier) => {
        setSelectedTier(tier);
        setView('signup');
    };

    if (view === 'login' || view === 'signup') {
        return <AuthGateway initialView={view} selectedTier={selectedTier || undefined} onBack={() => setView('hero')} />;
    }

    return (
        <div 
            className="min-h-screen bg-stone-900 relative overflow-hidden flex flex-col bg-cover bg-center bg-fixed bg-no-repeat"
            style={{ backgroundImage: 'url(/artisan_flow_hero.png)' }}
        >
            {/* 20% overlay for 80% image visibility across entire page */}
            <div className="absolute inset-0 bg-black/20 z-0"></div>
            
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#6A2C91] opacity-[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C5A059] opacity-[0.04] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>
            
            {/* Nav */}
            <nav className="w-full px-8 py-5 flex justify-between items-center z-50 bg-black border-b border-white/20 shadow-sm sticky top-0">
                <div className="flex items-center">
                    <img src="/LOGO%20Official-Trans.png" alt="ArtisanFlow Logo" className="h-20 w-auto object-contain" />
                </div>
                <div>
                    <Button variant="primary" onClick={() => setView('login')} className="h-10 px-8 font-black bg-[#6A2C91] text-white hover:bg-purple-800 hover:shadow-[0_0_20px_rgba(106,44,145,0.8)] transition-all duration-300 rounded-full tracking-widest text-xs uppercase">
                        Sign In
                    </Button>
                </div>
            </nav>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 mt-12 mb-24 relative">
                <div className="max-w-4xl text-center space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                        <Sparkles size={14} /> Built-in AI-Supported Operations
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9] drop-shadow-xl">
                        Precision Manufacturing <br/> <span className="text-[#C5A059]">For Artisanal Brands</span>
                    </h1>
                    <p className="text-xl text-white font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                        Synchronize your inventory, calculate real-time material burn rates, generate high-fidelity marketing assets, and protect your margins with Lola AI.
                    </p>
                </div>

                {/* Tiers */}
                <div className="mt-24 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4 relative z-10">
                    <TierCard 
                        title="Free Audit" 
                        price="$0" 
                        tierNumber="1"
                        color="bg-slate-700"
                        buttonText="Join Our Free Tier"
                        features={[
                            'Basic CRM: Client Tracking', 
                            'Basic Inventory: Spreadsheet Sync', 
                            'Basic Manufacturing: Manual Batch Entry', 
                            'Public Resources & Strategy Session'
                        ]}
                        onSelect={() => handlePurchase('Free Audit')}
                    />
                    <TierCard 
                        title="Artisan Flow Basic" 
                        price="$49" 
                        isPopular 
                        tierNumber="2"
                        color="bg-[#6A2C91]"
                        buttonText="Join Our Basic Tier"
                        features={[
                            'Advanced CRM: Automated Follow-ups', 
                            'Advanced Inventory: Omnichannel Sync', 
                            'Advanced Manufacturing: Production Scheduler', 
                            'Lola AI Basic Access'
                        ]}
                        onSelect={() => handlePurchase('Artisan Flow Basic')}
                    />
                    <TierCard 
                        title="Margin Protection Pro" 
                        price="$149" 
                        tierNumber="3"
                        color="bg-[#C5A059]"
                        buttonText="Join Our Pro Tier"
                        features={[
                            'Pro CRM: Sentiment Analysis', 
                            'Pro Inventory: Predictive Reordering', 
                            'Pro Manufacturing: Margin Anomaly Detection', 
                            'AI Competitive Intelligence'
                        ]}
                        onSelect={() => handlePurchase('Margin Protection Pro')}
                    />
                </div>

                {/* Contact Form Section */}
                <div className="mt-32 w-full max-w-3xl relative z-10">
                    <Card className="shadow-2xl border-stone-200 bg-white/80 backdrop-blur-lg">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic mb-2">Need a Custom Solution?</h2>
                            <p className="text-gray-500">Reach out for tier selection assistance or to inquire about a custom app built specifically for your business.</p>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            alert("Message sent to Admins (lacarmsu38@gmail.com & lcarter@lrcholisticmarketing.online). We will be in touch shortly!");
                        }} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                                    <Input type="text" placeholder="Your Name" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                    <Input type="email" placeholder="you@company.com" required />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                                <select className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-4 h-12 outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all font-medium text-sm" required>
                                    <option value="tier_help">Help selecting a tier</option>
                                    <option value="custom_app">Inquire about a custom app build</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                                <textarea className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-4 py-3 outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all font-medium text-sm h-32 resize-none" placeholder="Tell us about your business needs..." required></textarea>
                            </div>
                            <Button variant="primary" type="submit" className="w-full h-14 font-black tracking-widest bg-[#6A2C91] hover:bg-purple-900 shadow-xl shadow-purple-900/20">
                                SEND MESSAGE <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </form>
                    </Card>
                </div>
            </main>
        </div>
    );
};

const TierCard = ({ title, price, features, tierNumber, isPopular, buttonText, onSelect }: any) => (
    <div className={`group relative flex flex-col h-full rounded-[2rem] p-8 border transition-all hover:-translate-y-2 duration-500 bg-black/40 backdrop-blur-xl ${isPopular ? 'border-[#6A2C91] hover:shadow-[0_0_40px_rgba(106,44,145,0.6)]' : 'border-white/10 hover:border-[#C5A059]/50 hover:shadow-[0_0_40px_rgba(197,160,89,0.3)]'}`}>
        {isPopular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6A2C91] to-purple-800 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg border border-purple-400/30">
                Recommended for Growth
            </div>
        )}
        <div className="mb-8">
            <div className={`w-14 h-14 bg-white/10 backdrop-blur-lg text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl font-black text-2xl italic border border-white/20`}>
                {tierNumber}
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
            <div className="flex items-baseline mt-2">
                <span className="text-3xl font-black text-[#6A2C91]">{price}</span>
                <span className="text-gray-400 text-sm font-bold ml-1 uppercase">/month</span>
            </div>
        </div>
        <div className="space-y-4 mb-10 flex-1">
            {features.map((f: string) => (
                <div key={f} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-gray-300">{f}</span>
                </div>
            ))}
        </div>
        <Button 
            variant={isPopular ? 'primary' : 'outline'} 
            onClick={onSelect}
            className={`w-full h-14 font-black tracking-widest text-xs uppercase rounded-xl transition-all duration-300 ${isPopular ? 'bg-[#6A2C91] hover:bg-purple-800 group-hover:shadow-[0_0_25px_rgba(106,44,145,0.8)] border-none' : 'border-white/20 text-white hover:bg-white/5 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.4)]'}`}
        >
            {buttonText || `Initialize ${title}`}
        </Button>
    </div>
);
