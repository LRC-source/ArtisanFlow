import re

with open(r"components\LandingPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update imports to include UserTier
if 'UserTier' not in content:
    content = content.replace(
        '''import { AuthGateway } from './Auth';''',
        '''import { AuthGateway } from './Auth';\nimport { UserTier } from './DataContext';'''
    )

# 2. Update state definitions and View routing in LandingPage
old_state = '''    const [view, setView] = useState<'hero' | 'login'>('hero');'''
new_state = '''    const [view, setView] = useState<'hero' | 'login' | 'signup' | 'checkout'>('hero');
    const [selectedTier, setSelectedTier] = useState<UserTier>('Free Audit');'''
content = content.replace(old_state, new_state)

old_routing = '''    if (view === 'login') {
        return <AuthGateway initialView="login" onBack={() => setView('hero')} />;
    }'''

new_routing = '''    if (view === 'login') {
        return <AuthGateway initialView="login" onBack={() => setView('hero')} />;
    }
    if (view === 'signup') {
        return <AuthGateway initialView="signup" selectedTier={selectedTier} onBack={() => setView('hero')} />;
    }
    if (view === 'checkout') {
        return <AuthGateway initialView="payment" selectedTier={selectedTier} onBack={() => setView('hero')} />;
    }'''
content = content.replace(old_routing, new_routing)

# 3. Update Hero Button for Start Free
content = content.replace(
    '''onClick={() => setView('login')}''',
    '''onClick={() => { setSelectedTier('Free Audit'); setView('signup'); }}'''
)

# 4. Rename Transparent Pricing Tiers to Pricing Tiers
content = content.replace(
    '''<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase mb-4">Transparent Pricing Tiers</h2>''',
    '''<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase mb-4">Pricing Tiers</h2>'''
)

# 5. Update PricingCards to take onClick and isSelected, and update them in grid
old_pricing_grid = '''                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
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
                    </div>'''

new_pricing_grid = '''                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                        <PricingCard 
                            title="Free Audit"
                            price="$0"
                            subtitle="Baseline access to get started"
                            isSelected={selectedTier === 'Free Audit'}
                            onClick={() => setSelectedTier('Free Audit')}
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
                            isSelected={selectedTier === 'Artisan Flow Basic'}
                            onClick={() => { setSelectedTier('Artisan Flow Basic'); setView('checkout'); }}
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
                            isSelected={selectedTier === 'Margin Protection Pro'}
                            onClick={() => { setSelectedTier('Margin Protection Pro'); setView('checkout'); }}
                            features={[
                                "Everything in Basic, PLUS:",
                                "Profit Guard™ Real-Time Margin Alerts",
                                "Advanced Predictive Forecasting",
                                "Multi-Location Warehouse Tracking",
                                "Priority Concierge Support"
                            ]}
                        />
                    </div>'''

content = content.replace(old_pricing_grid, new_pricing_grid)

# 6. Update GET STARTED NOW button
old_get_started = '''                    <div className="mt-8 sm:mt-12 lg:mt-16 flex justify-center">
                        <Button 
                            onClick={() => { setSelectedTier('Free Audit'); setView('signup'); }}
                            className="w-auto mx-auto py-3 px-8 text-sm font-black tracking-widest bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-black hover:opacity-90 shadow-[0_0_30px_rgba(197,160,89,0.2)] border-none rounded-full transition-all"
                        >
                            GET STARTED NOW <ArrowRight size={18} className="ml-2 inline" />
                        </Button>
                    </div>'''

new_get_started = '''                    <div className="mt-8 sm:mt-12 lg:mt-16 flex justify-center">
                        <Button 
                            onClick={() => {
                                if (selectedTier === 'Free Audit') {
                                    setView('signup');
                                } else {
                                    setView('checkout');
                                }
                            }}
                            className="w-auto mx-auto py-3 px-8 text-sm font-black tracking-widest bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-black hover:opacity-90 shadow-[0_0_30px_rgba(197,160,89,0.2)] border-none rounded-full transition-all"
                        >
                            GET STARTED NOW <ArrowRight size={18} className="ml-2 inline" />
                        </Button>
                    </div>'''

# wait, the previous replace changed onClick={() => setView('login')} for ALL buttons to `onClick={() => { setSelectedTier('Free Audit'); setView('signup'); }}`
# so we need to match the new one. Let's fix that.
content = content.replace(old_get_started, new_get_started)

# 7. Update PricingCard definition
old_pricing_card = '''const PricingCard = ({ title, price, subtitle, features, isFeatured }: { title: string, price: string, subtitle: string, features: string[], isFeatured?: boolean }) => {
    const containerClasses = isFeatured 
        ? "p-[2px] bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_35px_rgba(168,85,247,0.15)] scale-105 z-10" 
        : "border border-white/10 hover:border-white/30 p-4 sm:p-5 lg:p-6";

    return (
        <div className={`group relative flex flex-col h-full rounded-[2rem] transition-all duration-500 bg-white/[0.02] backdrop-blur-xl ${containerClasses}`}>'''

new_pricing_card = '''const PricingCard = ({ title, price, subtitle, features, isFeatured, isSelected, onClick }: { title: string, price: string, subtitle: string, features: string[], isFeatured?: boolean, isSelected?: boolean, onClick?: () => void }) => {
    const isOmbre = isSelected || isFeatured;
    const containerClasses = isOmbre
        ? "p-[2px] bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_35px_rgba(168,85,247,0.15)] scale-105 z-10 cursor-pointer" 
        : "border border-white/10 hover:border-white/30 p-4 sm:p-5 lg:p-6 cursor-pointer opacity-70 hover:opacity-100";

    return (
        <div onClick={onClick} className={`group relative flex flex-col h-full rounded-[2rem] transition-all duration-500 bg-white/[0.02] backdrop-blur-xl ${containerClasses}`}>'''

content = content.replace(old_pricing_card, new_pricing_card)

# Need to fix the nested background for PricingCard when it's ombre
content = content.replace(
    '''<div className={`flex flex-col h-full relative ${isFeatured ? 'bg-[#0d0d0d] rounded-[calc(2rem-2px)] p-4 sm:p-5 lg:p-6' : ''}`}>''',
    '''<div className={`flex flex-col h-full relative ${(isSelected || isFeatured) ? 'bg-[#0d0d0d] rounded-[calc(2rem-2px)] p-4 sm:p-5 lg:p-6' : ''}`}>'''
)

with open(r"components\LandingPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("LandingPage.tsx updated.")
