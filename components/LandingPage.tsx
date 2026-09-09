import React, { useState } from 'react';
import { Card, Button, Input } from './UI';
import { ArrowRight, Sparkles, CheckCircle, Activity, FlaskConical, Bot, ShieldCheck, Rocket, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthGateway } from './Auth';
import { UserTier } from './DataContext';

export const LandingPage = () => {
        const navigate = useNavigate();
    const [view, setView] = useState<'hero' | 'login' | 'signup' | 'checkout'>('hero');
    const [selectedTier, setSelectedTier] = useState<UserTier>('Free Audit');
                
    if (view === 'login') {
        return <AuthGateway initialView="login" onBack={() => setView('hero')} />;
    }
    if (view === 'signup') {
        return <AuthGateway initialView="signup" selectedTier={selectedTier} onBack={() => setView('hero')} />;
    }
    if (view === 'checkout') {
        return <AuthGateway initialView="payment" selectedTier={selectedTier} onBack={() => setView('hero')} />;
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] relative overflow-x-hidden flex flex-col font-sans">
            
            {/* Ambient luxury lighting */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C5A059]/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#6A2C91]/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
            
            {/* Nav */}
            <nav className="w-full px-6 sm:px-8 py-5 flex justify-between items-center z-50 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5 sticky top-0">
                <div className="flex items-center cursor-pointer group">
                    <span className="text-xl sm:text-2xl font-black tracking-tight flex items-center">
                        <span className="text-white mr-1">LRC</span>
                        <span className="text-white">Artisan</span>
                        <span className="font-black bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-transparent bg-clip-text">Flow</span>
                    </span>
                </div>
                <div>
                    <div className="p-[2px] rounded-full bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer inline-block">
                        <button 
                            onClick={() => setView('login')} 
                            className="bg-[#0d0d0d] flex items-center justify-center h-10 px-8 rounded-[calc(9999px-2px)] font-bold text-white tracking-widest text-xs uppercase hover:bg-black/50 transition-all duration-300"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 z-10 mt-6 sm:mt-8 lg:mt-12 relative w-full max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center w-full">
                    
                    {/* Left Column: Copy & Form */}
                    <div className="text-left space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                            Now Live — Free to Start
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white">
                            Stop Losing Money to Spreadsheets. <br/>
                            <span className="bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-transparent bg-clip-text">Run Your Maker Business Like a Pro.</span>
                        </h1>
                        <p className="text-base text-slate-400 leading-relaxed max-w-xl">
                            Whether you make candles, soap, jewelry, skincare, herbs, or anything handcrafted — ArtisanFlow gives you the tools to track inventory, protect your margins, manage recipes, and grow with AI. Built by makers, for makers of every craft.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Button 
                                onClick={() => { setSelectedTier('Free Audit'); setView('signup'); }}
                                className="py-4 px-8 text-sm font-black tracking-widest bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-black hover:opacity-90 shadow-[0_0_30px_rgba(197,160,89,0.25)] border-none rounded-full transition-all flex items-center justify-center uppercase"
                            >
                                Start Free — No Credit Card <ArrowRight size={18} className="ml-2" />
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="py-4 px-8 text-sm font-bold border-white/20 text-white hover:bg-white/10 rounded-full tracking-widest uppercase transition-all"
                            >
                                See Features
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Tablet Mockup Image */}
                    <div className="relative w-full max-w-full overflow-x-hidden flex justify-center lg:justify-end items-center z-10 mt-8 lg:mt-0 min-w-0">
                        {/* Glow behind the tablet */}
                        <div className="absolute inset-0 bg-[#C5A059]/10 blur-[80px] rounded-full pointer-events-none"></div>
                        <img 
                            src="/artisan_flow_hero.png" 
                            alt="Artisan Flow Dashboard" 
                            className="relative z-10 w-full max-w-sm md:max-w-md lg:max-w-2xl object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700" 
                        />
                    </div>
                </div>

                {/* Anti-Spreadsheet Comparison Section */}
                <div className="mt-16 w-full max-w-5xl relative z-10 mx-auto mb-12 px-2">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase mb-4">The Anti-Spreadsheet <br className="md:hidden" /><span className="bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-transparent bg-clip-text">OS for Modern Makers</span></h2>
                        <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto px-2">Why makers across every craft are leaving legacy tools behind.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 sm:gap-4 sm:p-5 lg:p-6">
                        {/* Legacy */}
                        <div className="bg-white/[0.01] border border-white/5 p-4 sm:p-5 lg:p-6 rounded-[2rem] flex flex-col items-center text-center text-gray-400 opacity-70 transition-all">
                            <h3 className="text-lg sm:text-2xl text-red-400 font-bold uppercase tracking-widest mb-6">Spreadsheets & Old Tools</h3>
                            <ul className="space-y-4 text-sm w-full text-left">
                                <li className="flex items-start gap-3"><span className="text-red-400/80 font-bold leading-none">×</span> Manual batch math & costly errors</li>
                                <li className="flex items-start gap-3"><span className="text-red-400/80 font-bold leading-none">×</span> Silent cost increases eating margins</li>
                                <li className="flex items-start gap-3"><span className="text-red-400/80 font-bold leading-none">×</span> No marketing or sales tools</li>
                                <li className="flex items-start gap-3"><span className="text-red-400/80 font-bold leading-none">×</span> Outdated, clunky interfaces</li>
                            </ul>
                        </div>
                        {/* Artisan Flow */}
                        <div className="p-[2px] rounded-[2rem] relative overflow-x-hidden shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059]">
                            <div className="bg-[#0d0d0d] w-full h-full p-4 sm:p-5 lg:p-6 rounded-[calc(2rem-2px)] flex flex-col items-center text-center">
                                <h3 className="text-lg sm:text-2xl text-white font-bold uppercase tracking-widest mb-6 relative z-10">ArtisanFlow</h3>
                                <ul className="space-y-4 text-gray-200 text-sm w-full text-left relative z-10">
                                    <li className="flex items-start gap-3">
                                        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                            <CheckCircle size={12} className="text-[#06B6D4] relative z-10" />
                                        </span> Automated batch deduction & stock ledgers
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                            <CheckCircle size={12} className="text-[#06B6D4] relative z-10" />
                                        </span> Profit Guard™ real-time margin protection
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                            <CheckCircle size={12} className="text-[#06B6D4] relative z-10" />
                                        </span> Lola AI multi-channel marketing engine
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                            <CheckCircle size={12} className="text-[#06B6D4] relative z-10" />
                                        </span> Purpose-built for every maker and craft
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Feature Nodes Section */}
                <div id="features-section" className="mt-8 sm:mt-12 lg:mt-16 w-full max-w-6xl relative z-10 px-2">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase mb-4">Everything a Maker Needs,<br className="md:hidden" /> In One Place</h2>
                        <div className="p-[1.5px] rounded-full bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_20px_rgba(168,85,247,0.3)] mt-3 inline-block">
                            <span className="block bg-[#0d0d0d] rounded-full py-1.5 px-4 md:py-2 md:px-6 text-[#E2C792] text-xs md:text-sm font-black uppercase tracking-widest">
                               Built from real-world maker problems
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                        {/* Recipe Builder */}
                        <div className="group bg-white/[0.02] border border-white/10 p-4 sm:p-6 rounded-2xl hover:border-white/30 transition-all flex flex-col items-start text-left">
                            <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.05] border border-white/20 backdrop-blur-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] opacity-30 blur-md group-hover:opacity-70 transition-all" />
                                <FlaskConical size={24} className="text-[#06B6D4] relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Recipe Builder & BOM</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">Dynamic Bill of Materials tracking, automated inventory deductions, and supplier quality control. Works for candles, soap, skincare, herbal blends, jewelry, and more.</p>
                        </div>
                        {/* Lola AI */}
                        <div className="group bg-white/[0.02] border border-white/10 p-4 sm:p-6 rounded-2xl hover:border-white/30 transition-all flex flex-col items-start text-left">
                            <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.05] border border-white/20 backdrop-blur-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] opacity-30 blur-md group-hover:opacity-70 transition-all" />
                                <Bot size={24} className="text-[#A855F7] relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Lola AI Marketing Co-Pilot</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">Automate social posts, blog content, and email campaigns — all tuned to your brand voice. Never stare at a blank page again.</p>
                        </div>
                        {/* Profit Guard */}
                        <div className="group bg-white/[0.02] border border-white/10 p-4 sm:p-6 rounded-2xl hover:border-white/30 transition-all flex flex-col items-start text-left">
                            <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-2xl bg-white/[0.05] border border-white/20 backdrop-blur-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] opacity-30 blur-md group-hover:opacity-70 transition-all" />
                                <ShieldCheck size={24} className="text-[#C5A059] relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Finance Hub & Profit Guard™</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">Real-time margin alerts before cost increases destroy your profits. Know exactly what you make on every single product.</p>
                        </div>
                    </div>

                    {/* Marketing Hub Callout */}
                    <div className="mt-3 sm:mt-6 w-full group bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-6 sm:p-10 rounded-2xl hover:border-white/30 transition-all flex flex-col md:flex-row items-center md:items-start text-left gap-6 sm:gap-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A855F7]/10 blur-[80px] pointer-events-none rounded-full"></div>
                        <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/[0.05] border border-white/20 backdrop-blur-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] opacity-30 blur-md group-hover:opacity-60 transition-all" />
                            <Rocket size={32} className="text-white relative z-10" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-3 flex flex-wrap items-center gap-3">
                                Built-In Marketing Hub 
                                <span className="bg-gradient-to-r from-[#06B6D4] to-[#A855F7] text-transparent bg-clip-text text-[10px] sm:text-xs uppercase tracking-widest font-black px-3 py-1 rounded-full border border-white/10 bg-white/5">Only platform of its kind</span>
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed max-w-4xl">
                                Most inventory tools stop at tracking. ArtisanFlow goes further — the built-in Marketing Hub connects your product catalog directly with Lola AI, turning your recipes into ready-to-publish social campaigns, blog posts, and SEO content. Operations and marketing, finally in one place.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trust / Founder Section */}
                <div className="mt-16 w-full max-w-4xl relative z-10 mx-auto px-2">
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 sm:p-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-[#6A2C91]/20 border border-[#6A2C91]/30 flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck size={20} className="text-[#6A2C91]" />
                        </div>
                        <h3 className="text-2xl font-black font-serif text-white mb-4">Built by a Maker, for Makers</h3>
                        <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto mb-6">
                            ArtisanFlow was created at Herbalistic Wellness to solve real problems: recipe chaos, margin blind spots, and marketing overwhelm. We're a small, independent team building in public. Your feedback shapes the roadmap.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/40">
                            <a href="mailto:hello@artisanflow.app" className="flex items-center gap-2 hover:text-[#C5A059] transition-colors">
                                <Mail size={14} /> hello@artisanflow.app
                            </a>
                            <span className="hidden sm:block">·</span>
                            <span>Your data is never sold. Ever.</span>
                        </div>
                    </div>
                </div>

                {/* Early Maker Stories — Testimonial Invitation */}
                <div className="mt-16 w-full max-w-4xl relative z-10 mx-auto px-2">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Early Maker Stories</h2>
                        <p className="text-slate-400 text-base">Coming soon. We're growing with our founding makers — their stories will live here.</p>
                    </div>
                    <div className="border border-dashed border-white/10 rounded-3xl p-8 sm:p-12 text-center bg-white/[0.02]">
                        <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-4">Are you an early maker?</p>
                        <p className="text-white/70 text-base mb-6">Join as a founding member and help shape ArtisanFlow. Your story could be first.</p>
                        <Button
                            onClick={() => { setSelectedTier('Free Audit'); setView('signup'); }}
                            className="py-3 px-8 text-sm font-black tracking-widest bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-all uppercase inline-flex items-center gap-2"
                        >
                            Become a Founding Maker <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>

                {/* Transparent Pricing Tier Matrix */}
                <div className="mt-16 w-full max-w-6xl relative z-10 mb-20 px-2">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase mb-4">Simple, Honest Pricing</h2>
                        <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto px-2">Free forever to start. Upgrade when you're ready to scale.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                        <PricingCard 
                            title="Free Audit"
                            price="$0"
                            subtitle="Start immediately, no card needed"
                            isSelected={selectedTier === 'Free Audit'}
                            onClick={() => setSelectedTier('Free Audit')}
                            features={[
                                "Recipe Builder & BOM",
                                "Inventory Tracking",
                                "Business Pulse Check",
                                "Universal CSV Importer"
                            ]}
                        />
                        <PricingCard 
                            title="Artisan Flow Basic"
                            price="$49"
                            subtitle="For makers ready to grow"
                            isSelected={selectedTier === 'Artisan Flow Basic'}
                            onClick={() => { setSelectedTier('Artisan Flow Basic'); setView('checkout'); }}
                            features={[
                                "Full Command Center",
                                "Automated Inventory Deductions",
                                "Lola AI Marketing Hub",
                                "Supplier & QC Ledgers",
                                "Multi-Channel Sales Sync"
                            ]}
                        />
                        <PricingCard 
                            title="Margin Protection Pro"
                            price="$149"
                            subtitle="Advanced suite for established makers"
                            isSelected={selectedTier === 'Margin Protection Pro'}
                            onClick={() => { setSelectedTier('Margin Protection Pro'); setView('checkout'); }}
                            features={[
                                "Everything in Basic, plus:",
                                "Profit Guard™ Real-Time Alerts",
                                "Advanced Demand Forecasting",
                                "Multi-Location Warehouse Tracking",
                                "Priority Support"
                            ]}
                        />
                    </div>

                    <div className="mt-8 sm:mt-12 lg:mt-16 flex justify-center">
                        <Button 
                            onClick={() => {
                                if (selectedTier === 'Free Audit') {
                                    setView('signup');
                                } else {
                                    setView('checkout');
                                }
                            }}
                            className="w-auto mx-auto py-4 px-10 text-sm font-black tracking-widest bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-black hover:opacity-90 shadow-[0_0_30px_rgba(197,160,89,0.2)] border-none rounded-full transition-all uppercase"
                        >
                            Get Started — It's Free <ArrowRight size={18} className="ml-2 inline" />
                        </Button>
                    </div>

                    {/* Footer micro-copy */}
                    <p className="text-center text-white/30 text-xs mt-6">No credit card required to start. Cancel anytime. Prices in USD.</p>
                </div>
            </main>
        </div>
    );
};

const PricingCard = ({ title, price, subtitle, features, isFeatured, isSelected, onClick }: { title: string, price: string, subtitle: string, features: string[], isFeatured?: boolean, isSelected?: boolean, onClick?: () => void }) => {
    const isOmbre = isSelected || isFeatured;
    const containerClasses = isOmbre
        ? "p-[2px] bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_35px_rgba(168,85,247,0.15)] scale-105 z-10 cursor-pointer" 
        : "border border-white/10 hover:border-white/30 p-4 sm:p-5 lg:p-6 cursor-pointer opacity-70 hover:opacity-100";

    return (
        <div onClick={onClick} className={`group relative flex flex-col h-full rounded-[2rem] transition-all duration-500 bg-white/[0.02] backdrop-blur-xl ${containerClasses}`}>
            <div className={`flex flex-col h-full relative ${(isSelected || isFeatured) ? 'bg-[#0d0d0d] rounded-[calc(2rem-2px)] p-4 sm:p-5 lg:p-6' : ''}`}>
                {isFeatured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] text-black text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                        Most Popular
                    </div>
                )}
                <div className="mb-6 text-center">
                    <h3 className="text-lg sm:text-2xl font-semibold text-white tracking-tight mb-2">{title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 mb-6">{subtitle}</p>
                    
                    <div className="flex justify-center items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">{price}</span>
                        {price !== "Custom" && price !== "$0" && <span className="text-gray-400 font-medium">/mo</span>}
                    </div>
                </div>
                
                <div className="space-y-4 mb-8 flex-1 mt-6">
                    {features.map((f: string) => (
                        <div key={f} className="flex items-start gap-3">
                            <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                <CheckCircle size={12} className="text-[#06B6D4] relative z-10" />
                            </span>
                            <span className="text-sm font-medium text-white sm:text-gray-300">{f}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
