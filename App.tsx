import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, TrendingUp, Settings, ShoppingBag, Activity, 
  DollarSign, Zap, Plus, Users, Truck, ClipboardList,
  BarChart3, FileText, Calendar, Layers, ArrowLeft, 
  MapPin, Boxes, Factory, MessageSquare, X, Shield, ShieldCheck, CreditCard, Sparkles, Loader2, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

import Layout from './components/Layout';
import { 
    MarketingStudio as MarketingPage, 
    MarketingHub,
    BlogGenerator, 
    VideoCreator, 
    SocialMediaCreator, 
    ContentCalendar,
    MarketingCreator,
    AIAvatarStudio,
    AdvancedContentGenerator,
    ContentApprovals,
    BrandVoiceProfile,
    ReceptionistLogic,
    VisualAnalysisNode
} from './components/Marketing';
import { 
    AccountSettings, 
    BusinessSetup, 
    SubscriptionManagement, 
    Integrations, 
    CustomerPortal,
    PrivacyGovernance
} from './components/Settings';
import { BusinessPulse } from './components/BusinessPulse';
import { BusinessPulseCheck } from './components/BusinessPulseCheck';
import { MarketingStrategyReport } from './components/MarketingStrategyReport';
import { Inventory } from './components/Inventory';
import { Forecasting } from './components/Forecasting';
import { Reports } from './components/Reports';
import { ProductionScheduler } from './components/ProductionScheduler';
import { ProductionWorkflow } from './components/ProductionWorkflow';
import { SupplierManager } from './components/SupplierManager';
import { SupplierCommunication } from './components/SupplierCommunication'; 
import { QualityControl } from './components/QualityControl'; 
import { Locations } from './components/Locations'; 
import { Recipes } from './components/Recipes';
import { RecipeBuilder } from './components/RecipeBuilder';
import { WarehouseView } from './components/WarehouseView';
import { CRM } from './components/CRM';
import { Orders } from './components/Orders';
import { ProfitGuardPage } from './components/ProfitGuard';
import { AIAssistant } from './components/AIAssistant';
import { AuthGateway } from './components/Auth';
import { FinanceHub, FinancialProjections } from './components/Finance';
import { BudgetGuard } from './components/BudgetGuard';
import { LolaTodos } from './components/LolaTodos';
import { SuperAdmin } from './components/SuperAdmin';
import { Card, Button, LockedNode, VaultBanner } from './components/UI';
import { ArtisanDataProvider, useArtisanData } from './components/DataContext';

/**
 * ArtisanFlow Architecture 1.2 - STATUS: COMPLETE ✅
 */

const OperationsDashboard = () => {
  const navigate = useNavigate();
  const { userTier } = useArtisanData();
  
  const MODULES = [
    { id: 'orders', title: 'Orders', icon: ShoppingBag, desc: 'Process commerce orders', color: 'text-purple-600', route: '/operations/orders', requiredTier: 'Artisan Flow Basic' },
    { id: 'crm', title: 'CRM', icon: Users, desc: 'Customer Relationships', color: 'text-[#C5A059]', route: '/operations/crm', requiredTier: 'Artisan Flow Basic' },
    { id: 'inventory', title: 'Inventory Hub', icon: Boxes, desc: 'Stock overview', color: 'text-emerald-600', route: '/inventory', requiredTier: 'Artisan Flow Basic' },
    { id: 'recipes', title: 'Recipes (BOM)', icon: FileText, desc: 'Formulas & Costs', color: 'text-gray-600', route: '/recipes', requiredTier: 'Artisan Flow Basic' },
    { id: 'production_scheduler', title: 'Scheduler', icon: Calendar, desc: 'Daily batches', color: 'text-pink-600', route: '/production_scheduler', requiredTier: 'Artisan Flow Basic' },
    { id: 'production_workflow', title: 'Workflow', icon: Layers, desc: 'Kanban active jobs', color: 'text-cyan-600', route: '/production_workflow', requiredTier: 'Artisan Flow Basic' },
    { id: 'supplier_manager', title: 'Suppliers', icon: Truck, desc: 'Vendor database', color: 'text-orange-600', route: '/supplier_manager', requiredTier: 'Artisan Flow Basic' },
    { id: 'qc', title: 'Quality Control', icon: ClipboardList, desc: 'Pass/Fail logs', color: 'text-red-600', route: '/qc', requiredTier: 'Artisan Flow Basic' },
  ];

  const handleNavigate = (mod: any) => {
      if (userTier === 'Free Audit' && mod.requiredTier !== 'Free Audit') {
          navigate('/settings/subscription');
          return;
      }
      navigate(mod.route);
  };

  return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <VaultBanner 
          title="Operations Command Center"
          subtitle="Central nervous system for manufacturing and logistics. Synchronizing industrial precision with artisanal craftsmanship."
          badge="Operations Protocol Active"
        >
          <div className="flex gap-4">
            <Button 
              variant="premium" 
              onClick={() => navigate('/operations/warehouse')} 
              className="h-16 px-10 rounded-full shadow-2xl shadow-black/20"
            >
              <Factory size={18} className="mr-3" /> VIRTUAL WAREHOUSE
            </Button>
          </div>
        </VaultBanner>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {MODULES.map((mod) => (
            <div key={mod.id} className="relative group h-full">
                <div 
                    onClick={() => handleNavigate(mod)}
                    className={`luxury-card bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 cursor-pointer group flex flex-col h-full overflow-hidden transition-all duration-500 hover:border-[#C5A059]/50 ${userTier === 'Free Audit' ? 'opacity-50' : ''}`}
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/10`}>
                        <mod.icon className={`${mod.color}`} size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-3 tracking-tight group-hover:text-[#C5A059] transition-colors">
                        {mod.title}
                    </h3>
                    <p className="text-sm font-sans font-light text-white/50 leading-relaxed flex-1">
                        {mod.desc}
                    </p>
                    {userTier === 'Free Audit' && <div className="absolute top-6 right-6"><Shield size={16} className="text-white/30" strokeWidth={1.5} /></div>}
                </div>
            </div>
          ))}
        </div>
      </div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { getTotalRevenue, orders, inventory, userTier } = useArtisanData();
  
  const revenue = getTotalRevenue();
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;
  const totalStock = inventory.reduce((acc, i) => acc + i.stock, 0);

  const VAULT_NODES = [
    { id: 'operations', title: 'Operations Hub', icon: Factory, desc: 'Manufacturing, Orders & CRM', route: '/operations', color: 'text-purple-400', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800' },
    { id: 'finance', title: 'Finance Hub', icon: DollarSign, desc: 'Budget & Projections', route: '/finance', color: 'text-emerald-400', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800' },
    { id: 'marketing', title: 'Marketing Hub', icon: Sparkles, desc: 'Brand Voice & Strategy', route: '/marketing', color: 'text-[#C5A059]', image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800' },
    { id: 'profit-guard', title: 'Profit Guard™', icon: ShieldCheck, desc: 'High-Precision Margin Analysis', route: '/profit-guard', color: 'text-blue-400', image: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <VaultBanner 
        title="Vault Access Authorized"
        subtitle={`Precision architecture online. Membership Level: ${userTier}. Synchronizing brand craftsmanship with automated growth nodes.`}
        badge="Secure Vault Protocol Active"
      >
        <div className="flex gap-4">
          <Button 
            variant="premium" 
            onClick={() => navigate('/business-pulse-check')} 
            className="h-16 px-10 rounded-full shadow-2xl shadow-black/20"
          >
            <Zap size={18} className="mr-3" /> FULL DIAGNOSTIC
          </Button>
        </div>
      </VaultBanner>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Revenue" value={`$${revenue.toFixed(2)}`} icon={DollarSign} color="text-emerald-400" trend="+12%" />
          <StatCard title="Inventory" value={totalStock.toString()} icon={Package} color="text-purple-400" trend="Units" />
          <StatCard title="Orders" value={pendingOrders.toString()} icon={ShoppingBag} color="text-blue-400" trend="Pending" />
          <StatCard title="Status" value="Active" icon={Activity} color="text-[#C5A059]" trend="Batches" />
      </div>

      <div className="space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-serif text-white tracking-tight">Vault Entry Points</h2>
          <div className="h-px flex-1 bg-white/5 mx-8"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {VAULT_NODES.map((node) => (
            <div 
              key={node.id}
              onClick={() => navigate(node.route)}
              className="group relative h-96 bg-black/40 rounded-[2.5rem] border border-white/5 hover:border-[#C5A059]/50 transition-all duration-700 cursor-pointer overflow-hidden shadow-2xl"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={node.image} 
                  alt={node.title}
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              </div>

              <div className="absolute top-0 left-0 w-full h-1 bg-white/5 group-hover:bg-[#C5A059] transition-colors duration-500 z-10"></div>
              
              <div className="relative z-10 h-full p-12 flex flex-col justify-end">
                <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#C5A059]/10 transition-all duration-500 border border-white/10">
                  <node.icon className={node.color} size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-serif text-white mb-4 tracking-tight group-hover:text-[#C5A059] transition-colors">{node.title}</h3>
                <p className="text-sm font-sans font-light text-white/50 uppercase tracking-[0.3em] leading-relaxed">{node.desc}</p>
                
                <div className="mt-8 flex items-center text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  Access Node <ChevronRight size={14} className="ml-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
            <Card className="p-10 border-none shadow-2xl bg-black/40 backdrop-blur-3xl rounded-[2.5rem]" title="Omnichannel Output Visualization">
                <div className="h-80 w-full mt-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            { name: 'Aug', units: 120, revenue: 5400, cost: 1800 },
                            { name: 'Sep', units: 145, revenue: 6525, cost: 2100 },
                            { name: 'Oct', units: 132, revenue: 5940, cost: 1950 },
                            { name: 'Nov', units: 168, revenue: 7560, cost: 2400 },
                            { name: 'Dec', units: 190, revenue: 8550, cost: 2700 },
                        ]}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2}/><stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontWeight: 500}} dy={10}/>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(10,10,10,0.9)', 
                                borderRadius: '1.5rem', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', 
                                fontFamily: 'Inter', 
                                fontSize: '12px',
                                color: '#fff'
                              }} 
                              itemStyle={{ color: '#C5A059' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#C5A059" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <Card className="luxury-card flex flex-col relative overflow-hidden group bg-black/40 backdrop-blur-xl border-white/5">
    <div className="absolute top-0 left-0 w-1 h-full bg-white/5 group-hover:bg-[#C5A059] transition-colors duration-500"></div>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform duration-500 ${color}`}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <span className="text-white/30 font-sans font-medium text-[10px] uppercase tracking-[0.2em]">{title}</span>
    </div>
    <div className="text-4xl font-serif text-white tracking-tight mb-2">{value}</div>
    <div className={`${color} text-[10px] font-sans font-medium uppercase tracking-[0.2em]`}>{trend}</div>
  </Card>
);

const InsightRow = ({ color, text }: any) => (
  <div className={`p-4 bg-white/5 rounded-2xl border-l-2 ${color} backdrop-blur-sm`}><p className="text-sm font-sans font-light leading-relaxed text-white/90">{text}</p></div>
);

const AppContent = () => {
  const { isAuthenticated, userTier, isSessionVerifying } = useArtisanData();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return <AuthGateway />;
  
  if (isSessionVerifying) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-50 gap-4">
              <div className="relative">
                  <div className="w-12 h-12 border-4 border-purple-100 border-t-[#6A2C91] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <ShieldCheck size={16} className="text-[#C5A059]" />
                  </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Verifying Vault Session...</p>
          </div>
      );
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full"
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<BusinessPulse />} />
            <Route path="/business-pulse-check" element={<BusinessPulseCheck />} />
        
        <Route path="/command-center" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <DashboardPage />
            </LockedNode>
        } />
        <Route path="/inventory" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <Inventory />
            </LockedNode>
        } />

        <Route path="/recipes" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <Recipes />
            </LockedNode>
        } />
        <Route path="/recipes/builder/:id?" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <RecipeBuilder />
            </LockedNode>
        } />
        <Route path="/supplier_manager" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <SupplierManager />
            </LockedNode>
        } />
        <Route path="/qc" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <QualityControl />
            </LockedNode>
        } />
        
        <Route path="/operations" element={
             <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <OperationsDashboard />
             </LockedNode>
        } />
        <Route path="/operations/warehouse" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <WarehouseView />
            </LockedNode>
        } />
        <Route path="/operations/orders" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <Orders />
            </LockedNode>
        } />
        <Route path="/operations/crm" element={
             <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <CRM />
             </LockedNode>
        } />
        <Route path="/production_scheduler" element={
             <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <ProductionScheduler />
             </LockedNode>
        } />
        <Route path="/production_workflow" element={
             <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <ProductionWorkflow />
             </LockedNode>
        } />
        
        <Route path="/marketing" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <MarketingPage />
            </LockedNode>
        } />
        <Route path="/marketing/hub" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <MarketingHub />
            </LockedNode>
        } />
        <Route path="/marketing/strategy-report" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <MarketingStrategyReport />
            </LockedNode>
        } />
        <Route path="/marketing/brand-voice" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <BrandVoiceProfile />
            </LockedNode>
        } />
        <Route path="/marketing/receptionist" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <ReceptionistLogic />
            </LockedNode>
        } />
        <Route path="/marketing/calendar" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <ContentCalendar />
            </LockedNode>
        } />
        <Route path="/marketing/creator" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <MarketingCreator />
            </LockedNode>
        } />
        <Route path="/marketing/analysis" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <VisualAnalysisNode />
            </LockedNode>
        } />
        <Route path="/marketing/social" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <SocialMediaCreator />
            </LockedNode>
        } />
        <Route path="/marketing/video" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <VideoCreator />
            </LockedNode>
        } />
        <Route path="/marketing/blog" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <BlogGenerator />
            </LockedNode>
        } />
        <Route path="/marketing/avatar" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <AIAvatarStudio />
            </LockedNode>
        } />
        <Route path="/marketing/advanced" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <AdvancedContentGenerator />
            </LockedNode>
        } />
        <Route path="/marketing/approvals" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <ContentApprovals />
            </LockedNode>
        } />

        <Route path="/finance" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <FinanceHub />
            </LockedNode>
        } />
        <Route path="/finance/projections" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <FinancialProjections />
            </LockedNode>
        } />
        <Route path="/finance/budget-guard" element={
            <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <BudgetGuard />
            </LockedNode>
        } />
        
        <Route path="/lola/todos" element={<LolaTodos />} />
        
        <Route path="/profit-guard" element={
            <LockedNode isLocked={userTier !== 'Margin Protection Pro'} requiredTier="Margin Protection Pro" onUpgrade={() => navigate('/settings/subscription')}>
                <ProfitGuardPage />
            </LockedNode>
        } />
        <Route path="/forecasting" element={
            <LockedNode isLocked={userTier !== 'Margin Protection Pro'} requiredTier="Margin Protection Pro" onUpgrade={() => navigate('/settings/subscription')}>
                <Forecasting />
            </LockedNode>
        } />
        
        <Route path="/settings/account" element={<AccountSettings />} />
        <Route path="/settings/business" element={<BusinessSetup />} />
        <Route path="/settings/subscription" element={<SubscriptionManagement />} />
        <Route path="/settings/integrations" element={
             <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <Integrations />
             </LockedNode>
        } />
        <Route path="/settings/portal" element={
             <LockedNode isLocked={userTier === 'Free Audit'} requiredTier="Artisan Flow Basic" onUpgrade={() => navigate('/settings/subscription')}>
                <CustomerPortal />
             </LockedNode>
        } />
        <Route path="/settings/privacy" element={<PrivacyGovernance />} />
        <Route path="/super-admin" element={<SuperAdmin />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <AIAssistant />
    </Layout>
  );
};

export default function App() {
  return (
    <Router>
        <ArtisanDataProvider>
          <AppContent />
        </ArtisanDataProvider>
    </Router>
  );
}