import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { 
  LayoutDashboard, Package, TrendingUp, Settings, 
  ShoppingBag, Activity, Menu, X, Hexagon, User, ChevronDown, ChevronRight, LogOut, Crown, Search, Sparkles, Loader2,
  Boxes, FileText, Truck, ClipboardList, Target, Volume2, Headphones, Calendar, Share2, Video, PenTool, CheckSquare, Factory, MapPin, DollarSign, Shield, ShieldCheck, RefreshCw, Layers, HelpCircle,
  ArrowLeft, Bell, MoreHorizontal, Lock, Unlock
} from 'lucide-react';
import { useArtisanData } from './DataContext';
import { LRCLogo } from './UI';
import { searchBusinessData } from '../services/geminiService';
import { TutorialOverlay } from './TutorialOverlay';

/**
 * ArtisanFlow Synaptic Layout Engine - STATUS: COMPLETE ✅
 */

export default function Layout({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { businessProfile, userTier, logout, inventory, orders, getMarginMetrics, startTutorial } = useArtisanData();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
    <div className="flex h-screen w-full bg-[#0A0A0A] text-white font-sans selection:bg-purple-900/30">
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
      
      {/* Sidebar - Artisan Flow Synaptic Redesign */}
      {/* Sidebar - Artisan Flow Glassmorphic Floating Panel Redesign */}
      <aside className={`artisan-flow-sidebar z-50 transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0' : isSidebarCollapsed ? '-translate-x-[120%]' : '-translate-x-[120%] md:translate-x-0'}`}>
          <div className="sidebar-brand-block flex items-center justify-between">
              <div className="flex items-center">
                  <LRCLogo size={32} className="sidebar-logo text-[#C5A059]" />
                  <div className="brand-meta ml-3">
                      <span className="brand-title text-base line-clamp-1">Artisan Flow</span>
                      <span className="version-tag">V2.5 Stable</span>
                  </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto text-white/50 hover:text-[#C5A059] transition-colors">
                  <X size={20} />
              </button>
              <button onClick={() => setIsSidebarCollapsed(true)} className="hidden md:block ml-auto text-white/50 hover:text-[#C5A059] transition-colors">
                  <Menu size={20} />
              </button>
          </div>

          <nav className="sidebar-nav-container">
              <div className="nav-section-group">
                  <span className="nav-section-title">Terminal Control</span>
                  <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                      <span className="nav-icon text-lg">📊</span>
                      <span className="flex-1 text-left">Overview Terminal</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
                  <button onClick={() => { navigate('/settings/account'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/settings/account' ? 'active' : ''}`}>
                      <span className="nav-icon text-lg">💎</span>
                      <span className="flex-1 text-left">Subscription Status</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
                  {businessProfile.role === 'admin' && (
                    <button onClick={() => { navigate('/super-admin'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/super-admin' ? 'active' : ''}`}>
                        <span className="nav-icon text-lg">🛡️</span>
                        <span className="flex-1 text-left">Super-Admin</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
                    </button>
                  )}
              </div>

              <div className="nav-section-group">
                  <span className="nav-section-title">Supply Logistics</span>
                  <button onClick={() => { navigate('/inventory'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/inventory' ? 'active' : ''}`}>
                      <span className="nav-icon text-lg">📦</span>
                      <span className="flex-1 text-left">Materials Matrix</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
                  <button onClick={() => { navigate('/finance/projections'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/finance/projections' ? 'active' : ''}`}>
                      <span className="nav-icon text-lg">⏳</span>
                      <span className="flex-1 text-left">Inventory Forecasting</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]"></span>
                  </button>
                  <button onClick={() => { navigate('/qc'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/qc' ? 'active' : ''}`}>
                      <span className="nav-icon text-lg">💸</span>
                      <span className="flex-1 text-left">Trapped Cash Audit</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]"></span>
                  </button>
              </div>

              <div className="nav-section-group">
                  <span className="nav-section-title">Formulation Vault</span>
                  <button onClick={() => { navigate('/recipes'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/recipes' ? 'active' : ''}`}>
                      <span className="nav-icon text-lg">🏺</span>
                      <span className="flex-1 text-left">Golden Ratio Ledger</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
                  <button onClick={() => { navigate('/finance'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/finance' ? 'active' : ''}`}>
                      <span className="nav-icon text-lg">🧮</span>
                      <span className="flex-1 text-left">COGS Confidence Matrix</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
              </div>

              <div className="nav-section-group">
                  <span className="nav-section-title">Client Logistics</span>
                  <button onClick={() => { navigate('/operations/crm'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/operations/crm' ? 'active' : ''}`}>
                      <span className="nav-icon text-lg">🤝</span>
                      <span className="flex-1 text-left">CRM Hub</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
              </div>

              <div className="nav-section-group">
                  <span className="nav-section-title">Secure Extensions</span>
                  <button onClick={() => { navigate('/settings/integrations'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/settings/integrations' ? 'active' : ''}`}>
                      <span className="nav-icon text-lg">💳</span>
                      <span className="flex-1 text-left">Integrations</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
                  <button onClick={() => { navigate('/marketing/brand-voice'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/marketing/brand-voice' ? 'active' : ''}`}>
                      <span className="nav-icon text-lg">✉️</span>
                      <span className="flex-1 text-left">Brand Voice Profile</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
                  <button onClick={() => { navigate('/marketing'); setIsMobileMenuOpen(false); }} className={`nav-item ${location.pathname === '/marketing' ? 'active' : ''}`}>
                      <span className="nav-icon text-lg">✨</span>
                      <span className="flex-1 text-left">Marketing Studio</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  </button>
              </div>
          </nav>

          <div className="sidebar-user-footer">
              <div className="user-avatar-frame text-xl">👤</div>
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
      <main className={`flex-1 overflow-auto relative bg-transparent flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-0' : 'md:ml-[280px]'}`}>
        {/* TOP BAR: SYNAPTIC HEADER */}
        <header className="sticky top-0 z-30 w-full bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 py-5 flex items-center justify-between gap-8 md:gap-12 transition-all duration-500">
            <div className="flex items-center gap-4 md:gap-8">
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-white/60 hover:text-white">
                <Menu size={24} />
              </button>
              {isSidebarCollapsed && (
                <button onClick={() => setIsSidebarCollapsed(false)} className="hidden md:block p-2 -ml-2 text-white/60 hover:text-[#C5A059] transition-colors">
                  <Menu size={24} />
                </button>
              )}

              {/* Mobile/Collapsed Logo */}
              <div className="md:hidden lg:hidden xl:hidden">
                <LRCLogo size={32} className="opacity-80" />
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
            <form onSubmit={handleSearch} className="flex-1 max-w-xl relative group">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C5A059] transition-colors" size={16} />
                    <input 
                        type="text"
                        placeholder="Ask Lola..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-xs focus:bg-white/10 focus:border-[#C5A059] focus:ring-4 focus:ring-amber-500/5 transition-all outline-none shadow-inner font-medium text-white"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isSearching ? <Loader2 size={14} className="animate-spin text-[#C5A059]" /> : <Sparkles size={14} className="text-[#C5A059] animate-pulse" />}
                    </div>
                </div>

                {/* AI Search Result Dropdown */}
                {searchResult && (
                    <div className="absolute top-full left-0 right-0 mt-5 bg-white border border-stone-200 rounded-[2.5rem] shadow-2xl p-10 animate-in slide-up z-50 border-t-8 border-t-[#6A2C91]">
                        <div className="flex items-start gap-6">
                            <div className="p-4 bg-purple-50 rounded-3xl text-[#6A2C91] shadow-inner"><Sparkles size={28} /></div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6A2C91] mb-2 italic">Synaptic Analysis Result</p>
                                <p className="text-lg text-gray-800 leading-relaxed font-semibold">{searchResult}</p>
                            </div>
                            <button onClick={() => setSearchResult(null)} className="text-gray-300 hover:text-red-500 p-2 transition-colors"><X size={20}/></button>
                        </div>
                    </div>
                )}
            </form>

            <div className="flex items-center gap-6">
                 {/* Contextual Actions Area */}
                 <div className="hidden lg:flex items-center gap-2 pr-6 border-r border-white/5">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-[#C5A059] transition-colors"
                    >
                      <Bell size={18} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-[#C5A059] transition-colors"
                    >
                      <RefreshCw size={18} />
                    </motion.button>
                 </div>

                 <div className="text-right hidden sm:block">
                     <p className="text-xs font-black text-white uppercase tracking-tighter">{businessProfile.ownerName}</p>
                     <p className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.2em] flex items-center gap-1.5 justify-end">
                       <ShieldCheck size={10} className="mr-0.5" /> Systems Verified ✅
                     </p>
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 overflow-hidden shadow-lg group cursor-pointer hover:border-[#C5A059] transition-colors">
                    <User size={24} className="group-hover:text-[#C5A059] transition-colors" />
                 </div>
            </div>
        </header>
        
        <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto pb-32 min-h-full relative z-10 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
