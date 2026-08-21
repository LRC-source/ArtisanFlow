import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { 
  LayoutDashboard, Package, TrendingUp, Settings, 
  ShoppingBag, Activity, Menu, X, Hexagon, User, ChevronDown, ChevronRight, LogOut, Crown, Search, Sparkles, Loader2,
  Boxes, FileText, Truck, ClipboardList, Target, Volume2, Headphones, Calendar, Share2, Video, PenTool, CheckSquare, Factory, MapPin, DollarSign, Shield, ShieldCheck, RefreshCw, Layers, HelpCircle,
  ArrowLeft, Bell, MoreHorizontal, Lock, Unlock, AlertTriangle
} from 'lucide-react';
import { useArtisanData } from './DataContext';
import { LRCLogo } from './UI';
import { GlassHaloIcon } from './ui/GlassHaloIcon';
import { searchBusinessData } from '../services/geminiService';
import { TutorialOverlay } from './TutorialOverlay';
import { SupportModal } from './SupportModal';

/**
 * ArtisanFlow Synaptic Layout Engine - STATUS: COMPLETE ✅
 */

export default function Layout({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { businessProfile, userTier, logout, inventory, orders, getMarginMetrics, startTutorial } = useArtisanData();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const context = { inventory, orders, margins: getMarginMetrics() };
    const result = await searchBusinessData(searchQuery, context);
    setSearchResult(result || null);
    setIsSearching(false);
    setTimeout(() => setSearchResult(null), 10000);
  };

  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <div className="flex min-h-dvh w-full overflow-x-hidden bg-[#0A0A0A] text-white font-sans selection:bg-purple-900/30">
      <Toaster position="top-right" richColors expand={false} />
      <TutorialOverlay />
      <div className="carbon-texture"></div>
      <div className="light-streak-top"></div>
      <div className="light-streak-bottom"></div>
      <div className="light-streak-left"></div>
      <style>{`
        @keyframes soft-success-glow {
          0% { box-shadow: 0 0 0 0 rgba(120, 190, 32, 0); border-color: transparent; transform: scale(1); }
          50% { box-shadow: 0 0 30px 10px rgba(120, 190, 32, 0.3); border-color: rgba(120, 190, 32, 0.6); transform: scale(1.01); }
          100% { box-shadow: 0 0 0 0 rgba(120, 190, 32, 0); border-color: transparent; transform: scale(1); }
        }
        .animate-soft-success {
          animation: soft-success-glow 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar - Artisan Flow Glassmorphic Floating Panel Redesign */}
      <aside className={`artisan-flow-sidebar z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : isSidebarCollapsed ? '-translate-x-[120%]' : '-translate-x-[120%] md:translate-x-0'} flex flex-col shrink-0`}>
          <div className="sidebar-brand-block flex items-center justify-center relative">
              <div className="flex items-center justify-center w-full py-2">
                <div className="flex items-center cursor-pointer group" onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}>
                    <span className="text-sm sm:text-base lg:text-xl text-white sm:text-slate-400 leading-relaxed sm:text-lg md:text-2xl tracking-tight flex items-center font-extrabold">
                        {/* LRC Prefix */}
                        <span className="text-white mr-2">LRC</span>
                        
                        {/* Artisan (White) + Flow (Electric Ombré Gradient) fused together */}
                        <span className="text-white">Artisan</span>
                        <span className="font-black bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-transparent bg-clip-text">Flow</span>
                    </span>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden absolute right-0 top-0 text-white sm:text-white/50 hover:text-[#C5A059] transition-colors">
                  <X size={20} />
              </button>
              <button onClick={() => setIsSidebarCollapsed(true)} className="hidden md:block absolute right-0 top-0 text-white sm:text-white/50 hover:text-[#C5A059] transition-colors">
                  <Menu size={20} />
              </button>
          </div>

          <nav className="sidebar-nav-container">

              <div className="nav-section-group">
                  <span className="nav-section-title">Primary Nodes</span>
                  <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                      <GlassHaloIcon icon={LayoutDashboard} color="cyan" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">Dashboard</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
                  <button onClick={() => { navigate('/marketing'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/marketing' ? 'active' : ''}`}>
                      <GlassHaloIcon icon={Sparkles} color="magenta" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">Marketing Studio</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
                  <button onClick={() => { navigate('/recipes'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/recipes' ? 'active' : ''}`}>
                      <GlassHaloIcon icon={Factory} color="cyan" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">Manufacturing</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
                  <button onClick={() => { navigate('/operations/crm'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/operations/crm' ? 'active' : ''}`}>
                      <GlassHaloIcon icon={User} color="purple" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">CRM Hub</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
                  <button onClick={() => { navigate('/finance'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/finance' ? 'active' : ''}`}>
                      <GlassHaloIcon icon={TrendingUp} color="gold" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">Orders & Finance</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
              </div>

              <div className="nav-section-group">
                  <span className="nav-section-title">Supply Logistics</span>
                  <button onClick={() => { navigate('/inventory'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/inventory' ? 'active' : ''}`}>
                      <GlassHaloIcon icon={Package} color="cyan" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">Inventory Hub</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
                  <button onClick={() => { navigate('/forecasting'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/forecasting' ? 'active' : ''}`}>
                      <GlassHaloIcon icon={Activity} color="gold" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">Forecasting</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]"></span>
                  </button>
                  <button onClick={() => { navigate('/qc'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/qc' ? 'active' : ''}`}>
                      <GlassHaloIcon icon={DollarSign} color="emerald" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">Trapped Cash Audit</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]"></span>
                  </button>
              </div>

              <div className="nav-section-group mt-auto pt-8">
                  <span className="nav-section-title text-[#C5A059]">My Account</span>
                  <button onClick={() => { navigate('/settings/account'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/settings/account' ? 'active' : ''}`}>
                      <GlassHaloIcon icon={Crown} color="gold" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">Subscription Status</span>
                  </button>
                  {businessProfile.role === 'super_admin' && (
                    <button onClick={() => { navigate('/super-admin'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/super-admin' ? 'active' : ''}`}>
                        <GlassHaloIcon icon={ShieldCheck} color="cyan" size="sm" className="mr-3" />
                        <span className="flex-1 text-left">Super-Admin</span>
                    </button>
                  )}
                  <button onClick={() => { navigate('/settings/integrations'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/settings/integrations' ? 'active' : ''}`}>
                      <GlassHaloIcon icon={Layers} color="purple" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">Integrations</span>
                  </button>
                  <button onClick={() => { navigate('/marketing/brand-voice'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/marketing/brand-voice' ? 'active' : ''}`}>
                      <GlassHaloIcon icon={FileText} color="cyan" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">Brand Voice Profile</span>
                  </button>
                  <button onClick={() => { setIsSupportOpen(true); setIsMobileMenuOpen(false); }} className="nav-item">
                      <GlassHaloIcon icon={HelpCircle} color="magenta" size="sm" className="mr-3" />
                      <span className="flex-1 text-left">Support Node</span>
                  </button>
              </div>
          </nav>

          <div className="sidebar-user-footer">
              <GlassHaloIcon icon={User} color="purple" size="sm" className="mr-3" />
              <div className="user-details text-left flex-1 min-w-0">
                  <span className="user-name truncate">{businessProfile.ownerName || 'LaToya Carter'}</span>
                  <span className="user-role truncate">Sovereign Architect</span>
              </div>
              <button onClick={logout} className="ml-2 p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors" title="Revoke Access">
                  <LogOut size={16} />
              </button>
          </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 min-w-0 w-full min-h-dvh overflow-auto relative bg-transparent flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-0' : 'md:ml-[280px]'}`}>
        {/* TOP BAR: SYNAPTIC HEADER */}
        <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md h-14 px-4 md:px-10 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-500">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-4 sm:gap-6">
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-white sm:text-white/60 hover:text-white">
                <Menu size={24} />
              </button>
              {isSidebarCollapsed && (
                <button onClick={() => setIsSidebarCollapsed(false)} className="hidden md:block p-2 -ml-2 text-white sm:text-white/60 hover:text-[#C5A059] transition-colors">
                  <Menu size={24} />
                </button>
              )}

              {/* Mobile/Collapsed Logo */}
              <div className={`transition-all duration-300 ${!isSidebarCollapsed ? 'md:hidden' : ''}`}>
                 <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
                     <span className="text-sm sm:text-base lg:text-xl text-white sm:text-slate-400 leading-relaxed sm:text-lg tracking-tight flex items-center font-extrabold">
                         <span className="text-white mr-2">LRC</span>
                         <span className="text-white">Artisan</span>
                         <span className="font-black bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-transparent bg-clip-text">Flow</span>
                     </span>
                 </div>
              </div>

              {/* Breadcrumbs - Path Navigator */}
              <nav className="hidden md:flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                  <span className="hover:text-[#C5A059] cursor-pointer transition-colors flex items-center gap-1" onClick={() => navigate('/')}>
                    <Hexagon size={10} className="text-[#C5A059]/40" /> Vault
                  </span>
                  {pathnames.map((name, index) => {
                      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                      const isLast = index === pathnames.length - 1;
                      return (
                          <React.Fragment key={name}>
                              <ChevronRight size={12} className="text-white/10" />
                              <span 
                                className={`transition-all duration-300 ${isLast ? 'text-[#C5A059] font-black' : 'hover:text-white cursor-pointer'}`} 
                                onClick={() => !isLast && navigate(routeTo)}
                              >
                                  {name.replace(/[-_]/g, ' ')}
                              </span>
                          </React.Fragment>
                      );
                  })}
              </nav>
            </div>

            {/* Global AI Search Gateway */}
            <form onSubmit={handleSearch} className="flex-1 min-w-[150px] w-full order-3 sm:order-none mt-2 sm:mt-0 max-w-xs relative group">
                <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C5A059] transition-colors" size={10} />
                    <input 
                        type="text"
                        placeholder="Ask Lola..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 sm:py-3 pl-9 sm:pl-12 pr-10 sm:pr-12 text-xs focus:bg-white/10 focus:border-[#C5A059] focus:ring-4 focus:ring-amber-500/5 transition-all outline-none shadow-inner font-medium text-white"
                    />
                    <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                        {isSearching ? <Loader2 size={10} className="animate-spin text-[#C5A059]" /> : <Sparkles size={10} className="text-[#C5A059] animate-pulse" />}
                    </div>
                </div>

                {/* AI Search Result Dropdown */}
                {searchResult && (
                    <div className="absolute top-full left-0 right-0 mt-5 bg-white border border-stone-200 rounded-[2.5rem] shadow-2xl p-3.5 sm:p-6 lg:p-12 animate-in slide-up z-50 border-t-8 border-t-[#6A2C91]">
                        <div className="flex items-start gap-3 sm:gap-6">
                            <div className="p-4 bg-purple-50 rounded-3xl text-[#6A2C91] shadow-inner"><Sparkles size={28} /></div>
                            <div className="flex-1">
                                <p className="text-sm sm:text-base text-[10px] font-black uppercase tracking-[0.3em] text-[#6A2C91] mb-2 italic">Synaptic Analysis Result</p>
                                <p className="text-sm sm:text-base leading-relaxed text-gray-800 leading-relaxed font-semibold">{searchResult}</p>
                            </div>
                            <button onClick={() => setSearchResult(null)} className="text-white sm:text-gray-300 hover:text-red-500 p-2 transition-colors"><X size={20}/></button>
                        </div>
                    </div>
                )}
            </form>

            <div className="flex items-center gap-3 sm:gap-6">
                 {/* Contextual Actions Area */}
                 <div className="hidden lg:flex items-center gap-2 pr-6 border-r border-white/5">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 rounded-xl bg-white/5 text-white sm:text-white/40 hover:text-[#C5A059] transition-colors"
                    >
                      <Bell size={18} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 rounded-xl bg-white/5 text-white sm:text-white/40 hover:text-[#C5A059] transition-colors"
                    >
                      <RefreshCw size={18} />
                    </motion.button>
                 </div>

                 <div className="text-right hidden sm:block">
                     <p className="text-sm sm:text-base font-black font-serif tracking-tight text-white mb-4">{businessProfile.ownerName}</p>
                     <p className="text-sm sm:text-base text-[9px] text-emerald-400 font-black uppercase tracking-[0.2em] flex items-center gap-1.5 justify-end">
                       <ShieldCheck size={10} className="mr-0.5" /> Systems Verified ✅
                     </p>
                 </div>
                 <div onClick={() => navigate('/settings/account')} className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#6A2C91] to-[#C5A059] p-[2px] flex items-center justify-center overflow-x-hidden shadow-[0_0_15px_rgba(197,160,89,0.3)] group cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(197,160,89,0.6)] transition-all">
                    <div className="w-full h-full rounded-[14px] overflow-x-hidden bg-black flex items-center justify-center">
                        {businessProfile.avatarUrl ? (
                            <img src={businessProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User size={22} className="text-[#C5A059] group-hover:scale-110 transition-transform" />
                        )}
                    </div>
                 </div>
            </div>
        </header>

        {businessProfile.status === 'Past Due' && location.pathname !== '/settings/subscription' && (
            <div className="bg-red-900/90 border-b border-red-500/50 p-4 w-full flex flex-col sm:flex-col sm:flex-row items-center justify-between px-6 md:px-12 gap-3 sm:gap-4 z-20 shadow-md">
                <div className="flex items-center gap-3 text-red-200">
                    <AlertTriangle size={20} className="text-red-400" />
                    <span className="font-sans font-medium text-sm">
                        <strong className="text-white">ACTION REQUIRED:</strong> Your tier subscription payment is past due. Tier access may be restricted at any time.
                    </span>
                </div>
                <button 
                    onClick={() => navigate('/settings/account')}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-sans font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors shadow-sm"
                >
                    Resolve Now
                </button>
            </div>
        )}
        
        <div className="flex-1 p-4 sm:p-8 md:p-12 max-w-7xl mx-auto relative z-10 w-full overflow-x-hidden">
          {children}
        </div>
        
        <footer className="w-full py-6 sm:py-12 lg:py-16 px-4 sm:px-8 mt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-sm sm:text-base text-white/60 bg-[#0A0A0A] z-20">
            <span>© 2026 LRC ArtisanFlow. All rights reserved.</span>
            <div className="flex items-center gap-3 sm:gap-4">
                <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/terms')}>Terms & Conditions</span>
                <span className="text-white/20">|</span>
                <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/privacy')}>Privacy Policy</span>
            </div>
        </footer>
      </main>

      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
}
