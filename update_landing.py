import re

with open(r"components\LandingPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove Top VIP Banner
content = re.sub(
    r'\{/\* Top VIP Announcement Banner \*/\}.*?</div>\s*\{/\* Nav \*/\}',
    '{/* Nav */}',
    content,
    flags=re.DOTALL
)

# 2. Hero Section changes
content = content.replace(
    '''<h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">
                            Precision Manufacturing <br/> For <span className="bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-transparent bg-clip-text">Artisanal</span> Brands
                        </h1>
                        <p className="text-sm sm:text-base text-white sm:text-slate-400 leading-relaxed max-w-xl">
                            Synchronize your inventory, calculate real-time material burn rates, generate high-fidelity marketing assets, and protect your margins with Lola AI. Join the VIP waitlist for exclusive Lifetime Deal access.
                        </p>''',
    '''<h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">
                            Stop Spreadsheet Chaos. <br/> Automate Your <span className="bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-transparent bg-clip-text">Manufacturing</span>.
                        </h1>
                        <p className="text-sm sm:text-base text-white sm:text-slate-400 leading-relaxed max-w-xl">
                            Synchronize your inventory, dynamically scale recipe formulations, generate high-fidelity marketing assets, and protect your margins. Built by makers, for makers.
                        </p>'''
)

# 3. Replace Waitlist Form with CTA Buttons
content = re.sub(
    r'\{/\* Waitlist Form \*/\}.*?</div>\s*</div>\s*\{/\* Right Column:',
    '''{/* CTA Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Button 
                                onClick={() => setView('login')}
                                className="py-4 px-8 text-sm font-black tracking-widest bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-black hover:opacity-90 shadow-[0_0_30px_rgba(197,160,89,0.25)] border-none rounded-full transition-all flex items-center justify-center uppercase"
                            >
                                Start Free (Free Audit Tier) <ArrowRight size={18} className="ml-2" />
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="py-4 px-8 text-sm font-bold border-white/20 text-white hover:bg-white/10 rounded-full tracking-widest uppercase transition-all"
                            >
                                Explore Live Platform
                            </Button>
                        </div>
                    </div>

                    {/* Right Column:''',
    content,
    flags=re.DOTALL
)

# 4. Give features-section an ID
content = content.replace(
    '''{/* Platform Feature Nodes Section */}
                <div className="mt-8 sm:mt-12 lg:mt-16 md:mt-20 w-full max-w-6xl relative z-10 px-2">''',
    '''{/* Platform Feature Nodes Section */}
                <div id="features-section" className="mt-8 sm:mt-12 lg:mt-16 md:mt-20 w-full max-w-6xl relative z-10 px-2">'''
)

# 5. Social Proof / Origin story
content = content.replace(
    '''<span className="block bg-[#0d0d0d] rounded-full py-1.5 px-4 md:py-2 md:px-6 text-[#E2C792] text-xs md:text-sm font-black uppercase tracking-widest">
                               Designed by a Maker, Built for Makers
                            </span>''',
    '''<span className="block bg-[#0d0d0d] rounded-full py-1.5 px-4 md:py-2 md:px-6 text-[#E2C792] text-xs md:text-sm font-black uppercase tracking-widest">
                               Built from the ground up at Herbalistic Wellness to solve real-world hurdles
                            </span>'''
)

# 6. Feature Hubs Descriptions Update
content = content.replace(
    '''<h3 className="text-lg sm:text-2xl lg:text-3xl text-white sm:text-slate-400 leading-relaxed font-bold text-white mb-2">Operations & Recipe Builder</h3>
                            <p className="text-sm sm:text-base text-white sm:text-gray-400 leading-relaxed">Bill of Materials tracking, automated batch inventory deduction, and supplier quality control ledgers.</p>''',
    '''<h3 className="text-lg sm:text-2xl lg:text-3xl text-white sm:text-slate-400 leading-relaxed font-bold text-white mb-2">Dynamic Recipe Builder & Operations</h3>
                            <p className="text-sm sm:text-base text-white sm:text-gray-400 leading-relaxed">Dynamic Bill of Materials (BOM) tracking, automated inventory deductions, and supplier quality control ledgers.</p>'''
)

# 7. Pricing Section Update
new_pricing_section = '''{/* Transparent Pricing Tier Matrix */}
                <div className="mt-8 sm:mt-12 lg:mt-20 md:mt-32 w-full max-w-6xl relative z-10 mb-20 px-2">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase mb-4">Transparent Pricing Tiers</h2>
                        <p className="text-sm sm:text-base text-white sm:text-slate-400 leading-relaxed max-w-2xl mx-auto px-2">Select a live plan that scales with your manufacturing needs. Free forever baseline, with powerful pro upgrades.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                        <PricingCard 
                            title="Free Audit"
                            price="$0"
                            subtitle="Baseline access to get started"
                            features={[
                                "Dynamic Recipe Builder (BOM)",
                                "Baseline Inventory Tracking",
                                "Basic Pulse Check",
                                "Universal CSV Importer"
                            ]}
                        />
                        <PricingCard 
                            title="Artisan Flow Basic"
                            price="$49"
                            subtitle="For scaling artisans"
                            isFeatured
                            features={[
                                "Full Operations Command Center",
                                "Automated Inventory Deductions",
                                "Lola AI Marketing Hub",
                                "Supplier & QC Ledgers",
                                "Omnichannel Sales Sync"
                            ]}
                        />
                        <PricingCard 
                            title="Margin Protection Pro"
                            price="$99"
                            subtitle="Advanced enterprise suite"
                            features={[
                                "Everything in Basic, PLUS:",
                                "Profit Guard™ Real-Time Margin Alerts",
                                "Advanced Predictive Forecasting",
                                "Multi-Location Warehouse Tracking",
                                "Priority Concierge Support"
                            ]}
                        />
                    </div>

                    <div className="mt-8 sm:mt-12 lg:mt-16 flex justify-center">
                        <Button 
                            onClick={() => setView('login')}
                            className="w-auto mx-auto py-3 px-8 text-sm font-black tracking-widest bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-black hover:opacity-90 shadow-[0_0_30px_rgba(197,160,89,0.2)] border-none rounded-full transition-all"
                        >
                            GET STARTED NOW <ArrowRight size={18} className="ml-2 inline" />
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

const PricingCard = ({ title, price, subtitle, features, isFeatured }: { title: string, price: string, subtitle: string, features: string[], isFeatured?: boolean }) => {
    const containerClasses = isFeatured 
        ? "p-[2px] bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_35px_rgba(168,85,247,0.15)] scale-105 z-10" 
        : "border border-white/10 hover:border-white/30 p-4 sm:p-5 lg:p-6";

    return (
        <div className={`group relative flex flex-col h-full rounded-[2rem] transition-all duration-500 bg-white/[0.02] backdrop-blur-xl ${containerClasses}`}>
            <div className={`flex flex-col h-full relative ${isFeatured ? 'bg-[#0d0d0d] rounded-[calc(2rem-2px)] p-4 sm:p-5 lg:p-6' : ''}`}>
                {isFeatured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] text-black text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                        Most Popular
                    </div>
                )}
                <div className="mb-6 text-center">
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-white tracking-tight mb-2">{title}</h3>
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
};'''

content = re.sub(
    r'\{/\* LTD Teaser Cards Section \*/\}.*',
    new_pricing_section,
    content,
    flags=re.DOTALL
)

# 8. Clean up unused waitlist form state variables
content = re.sub(r'const \[formData, setFormData\].*?\n', '', content)
content = re.sub(r'const \[isSubmitting, setIsSubmitting\].*?\n', '', content)
content = re.sub(r'const \[isSubmitted, setIsSubmitted\].*?\n', '', content)
content = re.sub(r'const formRef = useRef<HTMLDivElement>\(null\);\n', '', content)
content = re.sub(r'const handleSubmit = async.*?};\n', '', content, flags=re.DOTALL)
content = re.sub(r'const scrollToForm = \(\) =>.*?};\n', '', content, flags=re.DOTALL)
content = content.replace('const { submitVIPWaitlist } = useArtisanData();\n', '')
content = content.replace('import { useArtisanData } from \'./DataContext\';\n', '')
content = content.replace('import { Lock, ArrowRight, Sparkles, CheckCircle, ChevronDown, Activity, Shield, Cpu, FlaskConical, Bot, ShieldCheck, Rocket } from \'lucide-react\';\n', 'import { ArrowRight, Sparkles, CheckCircle, ChevronDown, Activity, Shield, Cpu, FlaskConical, Bot, ShieldCheck, Rocket } from \'lucide-react\';\n')

# Check for unused categories array
content = re.sub(r'const CATEGORIES = \[.*?\];\n\n', '', content, flags=re.DOTALL)

with open(r"components\LandingPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updates applied successfully.")
