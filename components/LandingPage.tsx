import React, { useState } from 'react';
import { Card, Button, Input } from './UI';
import { useArtisanData, UserTier } from './DataContext';
import { Hexagon, Lock, ArrowRight, ShieldCheck, Zap, Crown, CheckCircle, Mail, Chrome, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        if (tier === 'Free Audit') {
            signUp({ email: 'newuser@artisanflow.app', tier, status: 'Active' });
            navigate('/command-center');
        } else {
            // Square Payment SDK Placeholder
            setSelectedTier(tier);
            setView('signup');
        }
    };

    if (view === 'login') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#6A2C91] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C5A059] opacity-[0.03] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
                    <button onClick={() => setView('hero')} className="absolute -top-12 left-0 text-sm font-bold text-gray-500 hover:text-[#6A2C91] transition-colors">
                        &larr; Back to Platform
                    </button>
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4">
                            <Hexagon size={64} className="text-[#C5A059] fill-[#C5A059]/10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-4 h-4 bg-[#6A2C91] rounded-full shadow-lg animate-pulse"></div>
                            </div>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">LRC Artisan Flow</h1>
                        <p className="text-gray-500 font-medium text-sm mt-1">Orchestrating High-Precision Manufacturing</p>
                    </div>
                    <Card className="shadow-2xl border-stone-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Lock size={20} className="text-[#6A2C91]"/>
                            Sign In To Vault
                        </h2>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                                <Input type="email" placeholder="alex@artisanflow.app" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vault Key (Password)</label>
                                <Input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} required />
                            </div>
                            <Button variant="primary" type="submit" className="w-full h-12 font-black tracking-widest shadow-[#6A2C91]/20">
                                ENTER DASHBOARD <ArrowRight size={18} className="ml-1" />
                            </Button>
                        </form>
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase bg-white px-4 text-gray-400 tracking-[0.2em]">Secure Entry Point</div>
                        </div>
                        <Button variant="outline" onClick={handleGoogleAuth} className="w-full h-12 font-bold border-stone-200 hover:bg-stone-50">
                            <Chrome size={18} className="mr-2 text-[#4285F4]" /> Continue with Google
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    if (view === 'signup') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#6A2C91] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
                    <button onClick={() => setView('hero')} className="absolute -top-12 left-0 text-sm font-bold text-gray-500 hover:text-[#6A2C91] transition-colors">
                        &larr; Back to Platform
                    </button>
                    <Card className="shadow-2xl border-stone-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Initialize {selectedTier}
                        </h2>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mb-6">
                            <p className="text-sm font-medium text-[#6A2C91] mb-2">Secure Checkout via Square</p>
                            <p className="text-xs text-purple-700/70">Enter your business email to proceed to the Square Payment Gateway and complete your subscription setup.</p>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            alert("Redirecting to Square SDK Gateway...");
                            signUp({ email, tier: selectedTier, status: 'Active' });
                            navigate('/command-center');
                        }} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                                <Input type="email" placeholder="alex@artisanflow.app" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <Button variant="primary" type="submit" className="w-full h-12 font-black tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 border-none">
                                PROCEED TO PAYMENT <ArrowRight size={18} className="ml-1" />
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#6A2C91] opacity-[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C5A059] opacity-[0.04] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            
            {/* Nav */}
            <nav className="w-full px-8 py-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <Hexagon size={32} className="text-[#C5A059]" />
                    <span className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Artisan Flow</span>
                </div>
                <div>
                    <Button variant="outline" onClick={() => setView('login')} className="h-10 px-6 font-bold border-[#6A2C91] text-[#6A2C91] hover:bg-purple-50">
                        Sign In
                    </Button>
                </div>
            </nav>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 mt-12 mb-24">
                <div className="max-w-4xl text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-[#6A2C91] text-xs font-bold uppercase tracking-widest">
                        <Sparkles size={14} /> AI-Powered Operations
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.9]">
                        Precision Manufacturing <br/> <span className="text-[#6A2C91]">For Artisanal Brands</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Synchronize your inventory, calculate real-time material burn rates, generate high-fidelity marketing assets, and protect your margins with Lola AI.
                    </p>
                </div>

                {/* Tiers */}
                <div className="mt-24 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    <TierCard 
                        title="Free Audit" 
                        price="$0" 
                        icon={ShieldCheck} 
                        color="bg-slate-500"
                        features={['Public Resources', 'Initial Strategy Session', 'Manual Batch Entry', 'Basic Inventory List']}
                        onSelect={() => handlePurchase('Free Audit')}
                    />
                    <TierCard 
                        title="Artisan Flow Basic" 
                        price="$49" 
                        isPopular 
                        icon={Zap}
                        color="bg-[#6A2C91]"
                        features={['Omnichannel Sync', 'Automated Inventory', 'Lola AI Basic Access', 'Production Scheduler']}
                        onSelect={() => handlePurchase('Artisan Flow Basic')}
                    />
                    <TierCard 
                        title="Margin Protection Pro" 
                        price="$149" 
                        icon={Crown}
                        color="bg-[#C5A059]"
                        features={['Everything in Basic', 'Margin Anomaly Detection', 'AI Competitive Intelligence', 'Advanced Forecast Generator']}
                        onSelect={() => handlePurchase('Margin Protection Pro')}
                    />
                </div>
            </main>
        </div>
    );
};

const TierCard = ({ title, price, features, icon: Icon, color, isPopular, onSelect }: any) => (
    <Card className={`relative flex flex-col h-full border-2 transition-all hover:scale-[1.02] hover:shadow-2xl ${isPopular ? 'border-[#6A2C91] shadow-xl' : 'border-gray-100 shadow-sm'}`}>
        {isPopular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6A2C91] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                Recommended for Growth
            </div>
        )}
        <div className="mb-8">
            <div className={`w-12 h-12 ${color} text-white rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={24} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
            <div className="flex items-baseline mt-2">
                <span className="text-3xl font-black text-[#6A2C91]">{price}</span>
                <span className="text-gray-400 text-sm font-bold ml-1 uppercase">/month</span>
            </div>
        </div>
        <div className="space-y-4 mb-10 flex-1">
            {features.map((f: string) => (
                <div key={f} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-gray-600">{f}</span>
                </div>
            ))}
        </div>
        <Button 
            variant={isPopular ? 'primary' : 'outline'} 
            onClick={onSelect}
            className={`w-full h-14 font-black tracking-widest text-xs uppercase ${isPopular ? '' : 'border-[#6A2C91] text-[#6A2C91] hover:bg-purple-50'}`}
        >
            Initialize {title}
        </Button>
    </Card>
);
