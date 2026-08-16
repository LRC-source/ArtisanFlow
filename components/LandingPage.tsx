import React, { useState, useRef } from 'react';
import { Card, Button, Input } from './UI';
import { useArtisanData } from './DataContext';
import { Lock, ArrowRight, Sparkles, CheckCircle, ChevronDown, Activity, Shield, Cpu, FlaskConical, Bot, ShieldCheck, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthGateway } from './Auth';

const CATEGORIES = [
    "What type of maker are you? Click here",
    "Skincare or Formulator",
    "Herbalist & Apothecary",
    "Candle & Wax Melt Maker",
    "Soap & Bath Product Artisan",
    "Perfumer & Fragrance Creator",
    "Essential Oil & Aromatherapy Blender",
    "Hair Care & Body Care Artisan",
    "Herbal Tea & Beverage Formulator",
    "Tincture & Botanical Extract Craftsman",
    "Resin & Home Decor Maker",
    "Ceramic & Pottery Artisan",
    "Leather Goods Craftsman",
    "Woodworking & Custom Furniture Maker",
    "Jewelry & Metal Accessories Designer",
    "Textile, Fiber & Apparel Artisan",
    "Custom T-Shirt & Clothing Maker",
    "Specialty Food & Confectioner",
    "Gourmet Sauce & Condiment Artisan",
    "Bakery & Artisan Treats Maker",
    "Stationery, Paper & Printmaker",
    "Other Artisan / Handmade Goods"
];

export const LandingPage = () => {
    const { submitVIPWaitlist } = useArtisanData();
    const navigate = useNavigate();
    const [view, setView] = useState<'hero' | 'login'>('hero');
    const [formData, setFormData] = useState({ fullName: '', email: '', businessType: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const formRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (submitVIPWaitlist) {
             const success = await submitVIPWaitlist(formData);
             if (success) {
                 setIsSubmitted(true);
             }
        }
        setIsSubmitting(false);
    };

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (view === 'login') {
        return <AuthGateway initialView="login" onBack={() => setView('hero')} />;
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] relative overflow-hidden flex flex-col font-sans">
            
            {/* Ambient luxury lighting */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C5A059]/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#6A2C91]/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
            
            {/* Top VIP Announcement Banner */}
            <div className="w-full bg-gradient-to-r from-[#06B6D4]/30 via-[#A855F7]/30 to-[#C5A059]/30 backdrop-blur-md border-b border-white/15 text-center flex items-center justify-center gap-2 text-white font-bold tracking-wide text-sm py-3 px-6 z-50 relative">
                <span className="relative inline-flex items-center justify-center w-[26px] h-[26px] rounded-lg bg-white/10 border border-white/25 backdrop-blur-md mr-2 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] opacity-50 blur-[2px] animate-pulse" />
                    <Rocket className="w-3.5 h-3.5 text-white relative z-10 -rotate-12" />
                </span>
                VIP Launch: September 1st
            </div>

            {/* Nav */}
            <nav className="w-full px-8 py-5 flex justify-between items-center z-50 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5 sticky top-0">
                <div className="flex items-center cursor-pointer group">
                    <span className="text-2xl tracking-tight flex items-center font-extrabold">
                        {/* LRC Prefix */}
                        <span className="text-white mr-2">LRC</span>
                        
                        {/* Artisan (White) + Flow (Electric Ombré Gradient) fused together */}
                        <span className="text-white">Artisan</span>
                        <span className="font-black bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-transparent bg-clip-text">Flow</span>
                    </span>
                </div>
                <div>
                    <Button variant="outline" onClick={() => setView('login')} className="h-10 px-8 font-bold border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10 transition-all duration-300 rounded-full tracking-widest text-xs uppercase">
                        Sign In
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-start p-6 z-10 mt-12 relative w-full max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                    
                    {/* Left Column: Copy & Form */}
                    <div className="text-left space-y-8 relative z-10">
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[1.1]">
                            Precision Manufacturing <br/> For <span className="bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-transparent bg-clip-text">Artisanal</span> Brands
                        </h1>
                        <p className="text-lg text-gray-400 font-medium max-w-xl leading-relaxed">
                            Synchronize your inventory, calculate real-time material burn rates, generate high-fidelity marketing assets, and protect your margins with Lola AI. Join the VIP waitlist for exclusive Lifetime Deal access.
                        </p>

                        {/* Waitlist Form */}
                        <div ref={formRef} className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
                            {isSubmitted ? (
                                <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in duration-500">
                                    <CheckCircle size={48} className="text-[#10B981] mx-auto mb-4" />
                                    <h3 className="text-2xl font-black text-white">You're Officially on the VIP List!</h3>
                                    <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                                        We've reserved your priority spot. Keep an eye on your inbox for exclusive behind-the-scenes previews before doors open September 1st @ 10:00 AM EST.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">🔒 VIP Spots Claimed: 74 / 100</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-full" style={{ width: '74%' }}></div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">Secure Your VIP Spot</h3>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <Input 
                                                type="text" 
                                                placeholder="Full Name" 
                                                required 
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                                className="bg-[#0d0d0d] border-white/10 text-white placeholder:text-gray-600 h-12"
                                            />
                                        </div>
                                        <div>
                                            <Input 
                                                type="email" 
                                                placeholder="Email Address" 
                                                required 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="bg-[#0d0d0d] border-white/10 text-white placeholder:text-gray-600 h-12"
                                            />
                                        </div>
                                        <div className="relative">
                                            <select 
                                                required
                                                value={formData.businessType}
                                                onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                                                className="w-full bg-[#0d0d0d] border border-white/10 text-white rounded-xl px-4 h-12 outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all font-medium text-sm appearance-none pr-10"
                                            >
                                                {CATEGORIES.map((cat, index) => (
                                                    <option key={cat} value={index === 0 ? "" : cat} disabled={index === 0} hidden={index === 0}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C5A059] pointer-events-none" />
                                        </div>
                                        <Button 
                                            variant="primary" 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full h-12 font-black tracking-widest bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-black hover:opacity-90 shadow-xl shadow-[#C5A059]/20 hover:shadow-[0_0_30px_rgba(197,160,89,0.15)] transition-all border-none"
                                        >
                                            {isSubmitting ? 'JOINING...' : 'JOIN VIP WAITLIST'} <ArrowRight size={18} className="ml-2" />
                                        </Button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Tablet Mockup Image */}
                    <div className="relative w-full flex justify-center lg:justify-end items-center z-10">
                        {/* Glow behind the tablet */}
                        <div className="absolute inset-0 bg-[#C5A059]/10 blur-[80px] rounded-full pointer-events-none"></div>
                        <img 
                            src="/artisan_flow_hero.png" 
                            alt="Artisan Flow Dashboard Mockup" 
                            className="relative z-10 w-full max-w-2xl object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700" 
                        />
                    </div>
                </div>

                {/* Anti-Spreadsheet Comparison Section */}
                <div className="mt-24 w-full max-w-5xl relative z-10 mx-auto mb-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-4">The Anti-Spreadsheet <span className="bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-transparent bg-clip-text">OS for Modern Makers</span></h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Why artisans are ditching legacy inventory sheets for automated precision.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Legacy */}
                        <div className="bg-white/[0.01] border border-white/5 p-8 rounded-[2rem] flex flex-col items-center text-center text-gray-400 opacity-70 transition-all">
                            <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-6">Legacy Craftybase & Spreadsheets</h3>
                            <ul className="space-y-4 text-sm w-full text-left">
                                <li className="flex items-start gap-3"><span className="text-red-400/80 font-bold text-lg leading-none">×</span> Manual batch math & spreadsheet errors</li>
                                <li className="flex items-start gap-3"><span className="text-red-400/80 font-bold text-lg leading-none">×</span> Silent cost increases eating margins</li>
                                <li className="flex items-start gap-3"><span className="text-red-400/80 font-bold text-lg leading-none">×</span> Zero marketing or sales tools</li>
                                <li className="flex items-start gap-3"><span className="text-red-400/80 font-bold text-lg leading-none">×</span> Clunky 2012 interface</li>
                            </ul>
                        </div>
                        {/* Artisan Flow */}
                        <div className="p-[2px] rounded-[2rem] relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059]">
                            <div className="bg-[#0d0d0d] w-full h-full p-8 rounded-[calc(2rem-2px)] flex flex-col items-center text-center">
                                <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 relative z-10">Artisan Flow Modern OS</h3>
                                <ul className="space-y-4 text-gray-200 text-sm w-full text-left relative z-10">
                                    <li className="flex items-start gap-3">
                                        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                            <CheckCircle size={12} className="text-[#06B6D4] relative z-10" />
                                        </span> Automated batch deduction & stock ledgers
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                            <CheckCircle size={12} className="text-[#06B6D4] relative z-10" />
                                        </span> Profit Guard™ real-time margin alerts
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                            <CheckCircle size={12} className="text-[#06B6D4] relative z-10" />
                                        </span> Lola AI multi-channel marketing engine
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                            <CheckCircle size={12} className="text-[#06B6D4] relative z-10" />
                                        </span> Next-gen dark mode interface
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Feature Nodes Section */}
                <div className="mt-20 w-full max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">Built For Industrial Manufacturing Precision</h2>
                        <div className="p-[1.5px] rounded-full bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_20px_rgba(168,85,247,0.3)] mt-3 inline-block">
                            <span className="block bg-[#0d0d0d] rounded-full py-2 px-6 text-[#E2C792] text-sm font-black uppercase tracking-widest">
                               Designed by a Maker, Built for Makers
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Recipe Builder */}
                        <div className="group bg-white/[0.02] border border-white/10 p-6 rounded-2xl hover:border-white/30 transition-all flex flex-col items-start text-left">
                            <div className="relative w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/20 backdrop-blur-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] opacity-30 blur-md group-hover:opacity-70 transition-all" />
                                <FlaskConical size={24} className="text-[#06B6D4] relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Operations & Recipe Builder</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">Bill of Materials tracking, automated batch inventory deduction, and supplier quality control ledgers.</p>
                        </div>
                        {/* Lola AI */}
                        <div className="group bg-white/[0.02] border border-white/10 p-6 rounded-2xl hover:border-white/30 transition-all flex flex-col items-start text-left">
                            <div className="relative w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/20 backdrop-blur-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] opacity-30 blur-md group-hover:opacity-70 transition-all" />
                                <Bot size={24} className="text-[#A855F7] relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Lola AI Marketing Co-Pilot</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">Automate multi-channel content creation, social calendar scheduling, and blog writing tailored to your brand voice.</p>
                        </div>
                        {/* Profit Guard */}
                        <div className="group bg-white/[0.02] border border-white/10 p-6 rounded-2xl hover:border-white/30 transition-all flex flex-col items-start text-left">
                            <div className="relative w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/20 backdrop-blur-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] opacity-30 blur-md group-hover:opacity-70 transition-all" />
                                <ShieldCheck size={24} className="text-[#C5A059] relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Finance Hub & Profit Guard™</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">Real-time margin anomaly detection that alerts you before raw material cost increases destroy your margins.</p>
                        </div>
                    </div>
                </div>

                {/* LTD Teaser Cards Section */}
                <div className="mt-32 w-full max-w-6xl relative z-10 mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">Lifetime Deal Tiers</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Lock in lifetime access for a single payment. Limited to 100 licenses. Prices reveal on launch day.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <LTDCert 
                            title="Starter Maker LTD"
                            features={[
                                "Precision Bill of Materials (BOM) Recipe Costing",
                                "Automated Batch Inventory Deduction",
                                "Warehouse Stock Ledger & Low-Stock Alerts",
                                "Universal CSV Importer (Craftybase Migration)",
                                "Track Up to 500 Active SKUs"
                            ]}
                        />
                        <LTDCert 
                            title="Artisan Pro LTD"
                            isFeatured
                            features={[
                                "Everything in Starter Maker, PLUS:",
                                "Lola AI Marketing Suite (Social, Blogs, Scripts)",
                                "Kanban Production Scheduler & Curing Workflow",
                                "Supplier QC Ledgers & Purchase Orders",
                                "Square SDK Omnichannel Sales Sync"
                            ]}
                        />
                        <LTDCert 
                            title="Master Formulator LTD"
                            features={[
                                "Everything in Artisan Pro, PLUS:",
                                "Profit Guard™ Real-Time Margin Protection",
                                "Predictive Raw Material Reordering Alerts",
                                "Multi-Location Warehouse Tracking",
                                "Unlimited SKUs & Priority VIP Concierge Support"
                            ]}
                        />
                    </div>

                    <div className="mt-16 flex justify-center">
                        <Button 
                            onClick={scrollToForm}
                            className="h-14 px-10 font-black tracking-widest bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-black hover:opacity-90 shadow-xl shadow-[#C5A059]/20 hover:shadow-[0_0_30px_rgba(197,160,89,0.15)] border-none rounded-full transition-all"
                        >
                            JOIN VIP WAITLIST <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

const LTDCert = ({ title, features, isFeatured }: { title: string, features: string[], isFeatured?: boolean }) => {
    const containerClasses = isFeatured 
        ? "p-[2px] bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_35px_rgba(168,85,247,0.15)] scale-105 z-10" 
        : "border border-white/10 hover:border-white/30 p-8";

    return (
        <div className={`group relative flex flex-col h-full rounded-[2rem] transition-all duration-500 bg-white/[0.02] backdrop-blur-xl ${containerClasses}`}>
            <div className={`flex flex-col h-full relative ${isFeatured ? 'bg-[#0d0d0d] rounded-[calc(2rem-2px)] p-8' : ''}`}>
                {isFeatured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] text-black text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                        Most Popular
                    </div>
                )}
                <div className="mb-6">
                    <h3 className="text-2xl font-black text-white tracking-tight mb-6 text-center">{title}</h3>
                    
                    {/* Locked Price UI */}
                    <div className="relative overflow-hidden rounded-2xl p-4 flex items-center justify-center min-h-[100px] w-full">
                        <div className="absolute inset-0 backdrop-blur-[6px] z-10 flex flex-col items-center justify-center">
                            <div className="p-[1.5px] rounded-full bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_20px_rgba(168,85,247,0.35)]">
                                <div className="bg-[#0d0d0d]/90 backdrop-blur-md text-[#E2C792] px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Lock size={12} className="text-[#06B6D4]" /> VIP PRICE REVEALED SEP 1ST @ 10:00 AM EST
                                </div>
                            </div>
                        </div>
                        <span className="text-4xl font-black text-white/10 blur-sm">$???</span>
                    </div>
                </div>
                
                <div className="space-y-4 mb-8 flex-1 mt-6">
                    {features.map((f: string) => (
                        <div key={f} className="flex items-start gap-3">
                            <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                <CheckCircle size={12} className="text-[#06B6D4] relative z-10" />
                            </span>
                            <span className="text-sm font-medium text-gray-300">{f}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
