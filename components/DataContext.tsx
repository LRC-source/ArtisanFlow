import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, deleteDoc, setDoc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { db as dataLayer } from '../services/dataLayer';
import { toast } from 'sonner';

/**
 * ArtisanFlow Architecture 1.1 - Lola Intelligence Node
 */

export type UserTier = 'Free Trial' | 'Basic Artisan' | 'Pro Artisan' | 'Master Artisan';

export interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  category: 'orders' | 'inventory' | 'marketing' | 'recipes' | 'general';
  createdDate: string;
}

export interface Lot {
  id: string;
  lotNumber: string;
  supplierId?: string;
  receivedDate: string;
  quantity: number;
  originalQuantity: number;
  unitCost: number;
  expirationDate?: string;
  status: 'Active' | 'Quarantined' | 'Depleted';
}

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  recipeId: string;
  yieldQuantity: number;
  actualTotalCost: number;
  actualUnitCost: number;
  ingredientsConsumed: {
    itemId: string;
    lotId?: string;
    quantity: number;
    costCalculated: number;
  }[];
  producedDate: string;
  status: 'In Progress' | 'Completed' | 'Quarantined';
}

export const calculateDerivedStockAndCost = (item: InventoryItem): { stock: number, unitCost: number, stockValue: number, hasExpiredLots: boolean } => {
  if (!item.isLotTracked || !item.lots || item.lots.length === 0) {
    return { stock: item.stock || 0, unitCost: item.unitCost || 0, stockValue: (item.stock || 0) * (item.unitCost || 0), hasExpiredLots: false };
  }
  
  let totalStock = 0;
  let totalValue = 0;
  let hasExpiredLots = false;
  
  item.lots.forEach(lot => {
    if (lot.expirationDate) {
      const expDate = new Date(lot.expirationDate);
      if (expDate < new Date() && lot.quantity > 0) {
        hasExpiredLots = true;
      }
    }
    totalStock += lot.quantity;
    totalValue += (lot.quantity * lot.unitCost);
  });
  
  const unitCost = totalStock > 0 ? (totalValue / totalStock) : (item.unitCost || 0);
  return { stock: totalStock, unitCost, stockValue: totalValue, hasExpiredLots };
};

export interface InventoryItem {
  id: string | number;
  name: string;
  sku: string;
  stock: number;
  unit: string;
  unitCost: number;
  retailPrice?: number;
  stockValue: number;
  reorderPoint: number;
  type: 'raw' | 'finished';
  category?: string;
  img?: string;
  lowStock?: boolean;
  description?: string;
  supplier?: string;
  isLotTracked?: boolean;
  migratedToLots?: boolean;
  lots?: Lot[];
}

export interface Order {
  id: string;
  customer: string;
  email?: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  platform: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  location: string;
}

export interface ManualCustomer {
  id: string;
  name: string;
  email: string;
  location: string;
  createdDate: string;
}

export interface BusinessProfile {
  name: string;
  ownerName: string;
  email: string;
  logo?: string;
  avatarUrl?: string;
  industry: string;
  tier: UserTier;
  role?: 'admin' | 'user';
  status: 'Active' | 'Inactive' | 'Past Due' | 'Pending Payment' | 'trialing';
  trialEndsAt?: string;
  brandVoice: { adjectives: string[]; restrictedWords: string[] };
  receptionistLogic: { qualificationQuestions: string[] };
}

export interface SystemUser {
    id: string;
    name: string;
    email: string;
    tier: string;
    status: 'Active' | 'Suspended' | 'Pending';
    lastLogin: string;
    revenueProcessed: number;
}

export interface Report {
  id: string;
  title: string;
  category: string;
  type: string;
  generatedDate: string;
  headers: string[];
  data: any[];
  summaryStats: { label: string; value: string | number; color?: string }[];
}

export interface MarketingPost {
  id: string;
  platform: 'Instagram' | 'TikTok' | 'Pinterest' | 'Email' | 'Blog' | 'Facebook' | 'YouTube' | 'LinkedIn';
  topic: string;
  content: string;
  scheduledDate: string;
  status: 'Draft' | 'Pending Approval' | 'Scheduled' | 'Published';
  type: 'Text' | 'Image' | 'Video';
  mediaUrl?: string;
}

export interface Integration {
  id: string;
  name: string;
  category: 'E-commerce' | 'Marketplace' | 'Wholesale' | 'POS' | 'Payment' | 'Accounting' | 'System';
  status: 'Connected' | 'Connect' | 'Reconfigure';
  logo: string; 
  description: string;
  aiCapability: string; // New: Specific AI feature per node
  features: string[];
  lastSync?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  rating: number;
  tier: 'Reliable' | 'Moderate' | 'Risk';
  pricePerUnit: number;
  leadTime: number;
  paymentTerms: string;
}

export interface SupplierCommunication {
  id: string;
  supplierId: string;
  supplierName: string;
  subject: string;
  type: 'Email' | 'Phone' | 'Portal';
  status: 'Pending' | 'Sent' | 'Responded' | 'Resolved';
  date: string;
}

export interface QualityCheck {
  id: string;
  productName: string;
  batchNumber: string;
  status: 'Pending' | 'Passed' | 'Failed';
  inspector: string;
  date: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'Warehouse' | 'Retail' | 'Storage';
  address: string;
  capacity: string;
}

export interface Recipe {
  id: string;
  name: string;
  version: string;
  sku: string;
  yield: string;
  yieldValue?: number;
  materialCost: number;
  laborCost?: number;
  totalCost: number;
  productionTime: number;
  ingredients: { name: string; qty: string }[];
  rawIngredients?: { inventoryItemId: string; quantity: number; unit: string }[];
  subRecipes?: { recipeId: string; quantity: number; unit: string }[];
  finishedGoodsItemId?: string;
}

export interface Appointment {
    id: string;
    clientName: string;
    email: string;
    date: string;
    time: string;
    type: 'Wholesale Strategy' | 'Manufacturing Audit';
    status: 'Pending' | 'Confirmed' | 'Completed';
}

export interface BudgetConfig {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
}

interface DataContextType {
  isDemoMode: boolean;
  loadDemoData: () => void;
  clearDemoData: () => void;
  inventory: InventoryItem[];
  orders: Order[];
  manualCustomers: ManualCustomer[];
  businessProfile: BusinessProfile;
  isAuthenticated: boolean;
  userTier: UserTier;
  reports: Report[];
  productionStats: { active: number; inProgress: number; awaiting: number; completed: number; pending: number };
  suppliers: Supplier[];
  marketingPosts: MarketingPost[];
  integrations: Integration[];
  qualityChecks: QualityCheck[];
  locations: Location[];
  supplierCommunications: SupplierCommunication[];
  recipes: Recipe[];
  productionBatches: ProductionBatch[];
  appointments: Appointment[];
  isSessionVerifying: boolean;
  demandInsights: any[];
  budgets: BudgetConfig;
  todos: TodoItem[];
  isTutorialActive: boolean;
  tutorialStep: number;
  login: (email: string, pass: string) => Promise<boolean>;
  googleLogin: () => Promise<any>;
  logout: () => void;
  signUp: (data: any) => Promise<void>;
  updateTier: (tier: UserTier) => Promise<void>;
  activateAccount: () => Promise<void>;
  updateBusinessProfile: (updates: Partial<BusinessProfile>) => void;
  getInventoryValue: () => number;
  getTotalRevenue: () => number;
  getMarginMetrics: () => { isMarginHealthy: boolean; marginMultiplier: number };
  saveReport: (report: Omit<Report, 'id'>) => void;
  deleteReport: (id: string) => void;
  importData: (files: File[]) => Promise<boolean>;
  addInventoryItem: (item: any) => Promise<void>;
  updateInventory: (id: string | number, updates: Partial<InventoryItem>) => void;
  addSupplier: (supplier: any) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addLocation: (location: any) => void;
  addCommunication: (comm: any) => void;
  addQualityCheck: (check: any) => void;
  addMarketingPost: (post: any) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  addManualCustomer: (customer: Omit<ManualCustomer, 'id' | 'createdDate'>) => void;
  deleteManualCustomer: (id: string) => void;
  updateMarketingPost: (id: string, updates: Partial<MarketingPost>) => void;
  generateSchedule: () => void;
  produceBatch: (recipeId: string, multiplier: number) => Promise<{ success: boolean; warnings: string[] }>;
  processOrder: (id: string) => Promise<void>;
  migrateInventoryToLots: () => Promise<void>;
  getRecipeActualCost: (recipeId: string, visited?: Set<string>, depth?: number) => number;
  syncWooCommerce: () => Promise<{ success: boolean; count?: number; error?: string }>;
  addRecipe: (recipe: any) => Promise<void>;
  updateRecipe: (id: string, updates: any) => void;
  updateBudget: (updates: Partial<BudgetConfig>) => void;
  addTodo: (task: string, category: TodoItem['category']) => void;
  toggleTodo: (id: string) => void;
  completeTodoByCategory: (category: TodoItem['category']) => void;
  startTutorial: () => void;
  setTutorialStep: (step: number) => void;
  completeTutorial: () => void;
  toggleIntegrationStatus: (id: string) => void;
  systemUsers: SystemUser[];
  updateSystemUser: (id: string, updates: Partial<SystemUser>) => void;
  deleteSystemUser: (id: string) => void;
  inviteSystemUser: (email: string, tier: string) => void;
  connectedChannels: Record<string, boolean>;
  toggleChannelConnection: (platform: string) => void;
  onboardingState: Record<string, boolean>;
  markHubVisited: (hubId: string) => void;
  submitVIPWaitlist: (data: { fullName: string; email: string; businessType: string }) => Promise<boolean>;
  upgradePrompt: { feature: string; requiredTier: UserTier } | null;
  setUpgradePrompt: (prompt: { feature: string; requiredTier: UserTier } | null) => void;
  checkFeatureGate: (feature: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const ArtisanDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('artisanflow_demo_mode') === 'true';
    }
    return false;
  });
  const [realDataBackup, setRealDataBackup] = React.useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [userTier, setUserTier] = useState<UserTier>('Basic Artisan');
  const [isSessionVerifying, setIsSessionVerifying] = useState(true);
  const [demandInsights, setDemandInsights] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStepState] = useState(0);

  // Read initial onboarding state from localStorage if available
  const [upgradePrompt, setUpgradePrompt] = useState<{ feature: string; requiredTier: UserTier } | null>(null);

  const checkFeatureGate = (action: string): boolean => {
    const limits: Record<UserTier, any> = {
      'Free Trial': { vault_recipes: 5, mktg_ai_actions: 5, mktg_avatar: false, logistics_forecast: false, dash_diagnostic: false, profit_guard: false },
      'Basic Artisan': { vault_recipes: Infinity, mktg_ai_actions: 100, mktg_avatar: false, logistics_forecast: false, dash_diagnostic: false, profit_guard: false },
      'Pro Artisan': { vault_recipes: Infinity, mktg_ai_actions: Infinity, mktg_avatar: true, logistics_forecast: true, dash_diagnostic: true, profit_guard: true },
      'Master Artisan': { vault_recipes: Infinity, mktg_ai_actions: Infinity, mktg_avatar: true, logistics_forecast: true, dash_diagnostic: true, profit_guard: true }
    };
    
    const limit = limits[userTier]?.[action];
    
    if (typeof limit === 'boolean') {
      if (!limit) {
        setUpgradePrompt({ feature: action, requiredTier: 'Pro Artisan' });
        return false;
      }
      return true;
    }
    
    if (action === 'vault_recipes' && recipes.length >= limit) {
      setUpgradePrompt({ feature: 'Recipe Builder Limit', requiredTier: 'Basic Artisan' });
      return false;
    }
    
    return true;
  };

  const [onboardingState, setOnboardingState] = useState<Record<string, boolean>>(() => {
      if (typeof window !== 'undefined') {
          try {
              const stored = localStorage.getItem('artisanflow_onboarding');
              if (stored) return JSON.parse(stored);
          } catch (e) { console.error(e); }
      }
      return {};
  });

  const markHubVisited = (hubId: string) => {
      setOnboardingState(prev => {
          const newState = { ...prev, [hubId]: true };
          localStorage.setItem('artisanflow_onboarding', JSON.stringify(newState));
          return newState;
      });
  };

  const [connectedChannels, setConnectedChannels] = useState<Record<string, boolean>>({
      'Instagram': false,
      'Facebook': false,
      'LinkedIn': false,
      'Twitter': false,
      'Email': false,
      'Pinterest': false,
      'TikTok': false,
      'YouTube': false
  });

  const toggleChannelConnection = (platform: string) => {
      setConnectedChannels(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
    name: '', 
    ownerName: '', 
    email: '', 
    industry: 'Skincare',
    tier: 'Free Trial',
    role: 'user',
    status: 'Active',
    brandVoice: { adjectives: ['Artisanal', 'Luxurious'], restrictedWords: [] },
    receptionistLogic: { qualificationQuestions: ['What is your wholesale budget?', 'Do you have a physical storefront?'] }
  };
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(INITIAL_BUSINESS_PROFILE);

  const [budgets, setBudgets] = useState<BudgetConfig>({
      daily: 50,
      weekly: 350,
      monthly: 1500,
      yearly: 18000
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  const [reports, setReports] = useState<Report[]>([]);
  const [productionStats, setProductionStats] = useState({ active: 0, inProgress: 0, awaiting: 0, completed: 0, pending: 0 });
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [marketingPosts, setMarketingPosts] = useState<MarketingPost[]>([]);
  
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);

  const [locations, setLocations] = useState<Location[]>([]);

  const [supplierCommunications, setSupplierCommunications] = useState<SupplierCommunication[]>([]);
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);

  const [integrations, setIntegrations] = useState<Integration[]>([
    { 
      id: 'shopify', 
      name: 'Shopify', 
      category: 'E-commerce', 
      status: 'Connect', 
      logo: 'https://logo.clearbit.com/shopify.com', 
      description: 'Unified storefront commerce logic.',
      aiCapability: 'Predictive Stock Reconciliation',
      features: ['Real-time Order Ingestion', 'Inventory Sync'],
      lastSync: undefined
    },
    { 
      id: 'woocommerce', 
      name: 'WooCommerce', 
      category: 'Wholesale', 
      status: 'Connect', 
      logo: 'https://logo.clearbit.com/woocommerce.com', 
      description: 'Daily metadata sync active.',
      aiCapability: 'Profit Margin Shield',
      features: ['Daily Metadata Sync', 'Bidirectional Stock Push'],
      lastSync: undefined
    },
    { 
      id: 'etsy', 
      name: 'Etsy', 
      category: 'Marketplace', 
      status: 'Connect', 
      logo: 'https://logo.clearbit.com/etsy.com', 
      description: 'Artisanal marketplace integration.',
      aiCapability: 'SEO Tag Synthesizer',
      features: ['Automated Listing Sync', 'Review Sentiment Analysis'],
      lastSync: undefined
    },
    {
      id: 'square',
      name: 'Square SDK',
      category: 'POS',
      status: 'Connect',
      logo: 'https://logo.clearbit.com/squareup.com',
      description: 'Physical storefront reconciliation.',
      aiCapability: 'Foot Traffic & Sales Forecasting',
      features: ['Omnichannel Inventory', 'Location-based Analytics'],
      lastSync: undefined
    },
    {
      id: 'firebase_auth',
      name: 'Firebase Auth',
      category: 'System',
      status: 'Connect',
      logo: 'https://logo.clearbit.com/firebase.google.com',
      description: 'Secure user identity and session management.',
      aiCapability: 'Anomaly Login Detection',
      features: ['Google OAuth', 'JWT Session Management'],
      lastSync: undefined
    },
    {
      id: 'email_smtp',
      name: 'Email / SMTP',
      category: 'System',
      status: 'Connect',
      logo: 'https://logo.clearbit.com/sendgrid.com',
      description: 'Transactional email routing.',
      aiCapability: 'Smart Bounce Handling',
      features: ['Automated Receipts', 'Supplier Comms'],
      lastSync: undefined
    },
    {
      id: 'api_login_cards',
      name: 'API Login Cards',
      category: 'System',
      status: 'Connect',
      logo: 'https://logo.clearbit.com/auth0.com',
      description: 'Single sign-on provider cards.',
      aiCapability: 'Adaptive MFA',
      features: ['Social Logins', 'Passwordless Flow'],
      lastSync: undefined
    },
    {
      id: 'csv_importer',
      name: 'CSV Importer',
      category: 'System',
      status: 'Connect',
      logo: 'https://logo.clearbit.com/microsoft.com',
      description: 'Bulk data ingestion tool.',
      aiCapability: 'Automated Column Mapping',
      features: ['Inventory Import', 'Legacy Data Migration'],
      lastSync: undefined
    }
  ]);

  useEffect(() => {
    if (!auth) {
      console.error("[Auth] Firebase Auth is not initialized. Check VITE_FIREBASE_API_KEY in Vercel.");
      setIsSessionVerifying(false);
      return;
    }
    let isInitialCheck = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isInitialCheck) setIsSessionVerifying(true);
      if (user) {
        // Load user profile from Firestore (Phase 3 implementation)
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setIsAuthenticated(true);
            const rawData = docSnap.data();
            const profileData = rawData.profile || {};
            const adminEmails = ['lacarmsu38@gmail.com', 'lcarter@lrcholisticmarketing.online', 'lrenee@herbalisticwellness.com'];
            
            // Securely grant admin rights if the authenticated Firebase user matches an admin email
            if (user.email && adminEmails.includes(user.email.toLowerCase())) {
              profileData.role = 'admin';
            }
            
            setBusinessProfile(prev => ({ 
              ...prev, 
              ...profileData, 
              tier: rawData.tier || 'Basic Artisan',
              status: rawData.status || 'Active',
              trialEndsAt: rawData.trialEndsAt 
            }));
            setUserTier(docSnap.data().tier || 'Basic Artisan');
            // Hydrate manual customers from Firestore so they survive reloads/new devices
            try {
              const custSnap = await getDocs(collection(db, 'users', user.uid, 'manualCustomers'));
              if (!custSnap.empty) {
                const firestoreCustomers = custSnap.docs.map(d => d.data() as ManualCustomer);
                setManualCustomers(firestoreCustomers);
                if (typeof window !== 'undefined') localStorage.setItem('artisan_manual_customers', JSON.stringify(firestoreCustomers));
              }
            } catch (e) { console.error('Failed to load manual customers from Firestore', e); }
          } else {
            const adminEmails = ['lacarmsu38@gmail.com', 'lcarter@lrcholisticmarketing.online', 'lrenee@herbalisticwellness.com'];
            if (user.email && adminEmails.includes(user.email.toLowerCase())) {
              const defaultProfile = { name: 'Admin Hub', email: user.email, role: 'admin' as const };
              if (!isDemoMode) await setDoc(docRef, {
                email: user.email,
                tier: 'Pro Artisan',
                status: 'Active',
                profile: defaultProfile,
                createdAt: new Date().toISOString()
              });
              setIsAuthenticated(true);
              setBusinessProfile(prev => ({ ...prev, ...defaultProfile }));
              setUserTier('Pro Artisan');
            } else {
              // No Firestore doc yet — user may be mid-signup (just created Auth, hasn't selected a tier yet).
              // Do NOT sign them out here; let the signup flow complete the Firestore write.
              // We removed setIsAuthenticated(false) to prevent a race condition from clobbering signUp()'s success state.
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAuthenticated(false);
        }
        
        setDemandInsights([
            { id: '1', material: 'Rosemary Leaf', isCritical: true, recommendedBatch: 50, daysRemaining: 2 }
        ]);
      } else {
        setIsAuthenticated(false);
      }
      if (isInitialCheck) {
        setIsSessionVerifying(false);
        isInitialCheck = false;
      }
    });
    return () => unsubscribe();
  }, []);


  const loadDemoData = () => {
    if (!isDemoMode && inventory.length > 0) {
       if (typeof window !== 'undefined') {
           const confirm = window.confirm("You have real data. Loading demo data will temporarily hide it. Continue?");
           if (!confirm) return;
       }
    }
    
    const backup = {
      inventory, orders, recipes, productionStats, budgets, todos, businessProfile, suppliers, marketingPosts
    };
    if (typeof window !== 'undefined') {
        localStorage.setItem('artisanflow_real_data_backup', JSON.stringify(backup));
        localStorage.setItem('artisanflow_demo_mode', 'true');
    }
    setIsDemoMode(true);
  };

  const clearDemoData = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('artisanflow_demo_mode');
    }
    setIsDemoMode(false);
    
    if (typeof window !== 'undefined') {
        const backupStr = localStorage.getItem('artisanflow_real_data_backup');
        if (backupStr) {
          try {
            const backup = JSON.parse(backupStr);
            setInventory(backup.inventory || []);
            setOrders(backup.orders || []);
            setRecipes(backup.recipes || []);
            setProductionStats(backup.productionStats || { active: 0, inProgress: 0, awaiting: 0, completed: 0, pending: 0 });
            setBudgets(backup.budgets || { daily: 0, weekly: 0, monthly: 0, yearly: 0 });
            setTodos(backup.todos || []);
            setBusinessProfile(backup.businessProfile || { name: 'Artisan Business', ownerName: 'Owner', niche: '', currency: 'USD' });
            setSuppliers(backup.suppliers || []);
            setMarketingPosts(backup.marketingPosts || []);
          } catch (e) {
            console.warn("Failed to restore real data backup", e);
          }
          localStorage.removeItem('artisanflow_real_data_backup');
        } else {
          setInventory([]); setOrders([]); setRecipes([]);
        }
    } else {
        setInventory([]); setOrders([]); setRecipes([]);
    }
  };

  const getRecipeActualCost = (recipeId: string, visited: Set<string> = new Set(), depth: number = 0): number => {
    if (depth > 10) throw new Error("Maximum recipe depth exceeded. Check for circular dependencies.");
    if (visited.has(recipeId)) throw new Error("Circular dependency detected in recipe.");
    
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return 0;
    
    visited.add(recipeId);
    let totalCost = 0;
    
    if (recipe.rawIngredients) {
      recipe.rawIngredients.forEach(ing => {
        const item = inventory.find(i => i.id === ing.inventoryItemId);
        if (item) {
          const { unitCost } = calculateDerivedStockAndCost(item);
          totalCost += (unitCost * ing.quantity);
        }
      });
    }
    
    if (recipe.subRecipes) {
      recipe.subRecipes.forEach(sub => {
        const subCost = getRecipeActualCost(sub.recipeId, new Set(visited), depth + 1);
        const subRecipe = recipes.find(r => r.id === sub.recipeId);
        if (subRecipe && subRecipe.yieldValue) {
           const costPerUnit = subCost / subRecipe.yieldValue;
           totalCost += (costPerUnit * sub.quantity);
        }
      });
    }
    
    totalCost += (recipe.laborCost || 0);
    return totalCost;
  };

  const migrateInventoryToLots = async () => {
    if (!auth.currentUser) {
        toast.error("You must be logged in to migrate inventory.");
        return;
    }
    const uid = auth.currentUser.uid;
    let migratedCount = 0;
    
    const updatedInventory = [...inventory];
    
    for (let i = 0; i < updatedInventory.length; i++) {
      const item = updatedInventory[i];
      if (!item.migratedToLots && item.type === 'raw') {
        const legacyLot: Lot = {
          id: `legacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          lotNumber: 'LEGACY-01',
          receivedDate: new Date().toISOString(),
          quantity: item.stock,
          originalQuantity: item.stock,
          unitCost: item.unitCost,
          status: 'Active'
        };
        
        try {
          if (!isDemoMode) {
            await setDoc(doc(db, 'users', uid, 'inventory', String(item.id)), {
              isLotTracked: true,
              migratedToLots: true,
              lots: [legacyLot]
            }, { merge: true });
          }
          updatedInventory[i] = { ...item, isLotTracked: true, migratedToLots: true, lots: [legacyLot] };
          migratedCount++;
        } catch (e) {
          console.error("Migration failed for item", item.id, e);
        }
      }
    }
    
    if (migratedCount > 0) {
      setInventory(updatedInventory);
      toast.success(`Successfully migrated ${migratedCount} items to Lot Tracking.`);
    } else {
      toast.info("No items required migration.");
    }
  };

  const login = async (email: string, pass: string) => {
    toast.info("Starting login sequence...");
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast.info("Firebase Auth login successful.");
      return true;
    } catch (error: any) {
      console.error("Login Error:", error);
      let msg = error.message;
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        msg = "That email and password don't match. Try again.";
      }
      throw new Error(msg);
    }
  };

  const googleLogin = async () => { 
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Google Auth Error:", error);
      throw error;
    }
  };

  const logout = async () => { 
    try {
      await signOut(auth);
      setBusinessProfile(INITIAL_BUSINESS_PROFILE);
      setInventory([]);
      setOrders([]);
      setSuppliers([]);
      setRecipes([]);
      setMarketingPosts([]);
      setManualCustomers([]);
      if (typeof window !== 'undefined') localStorage.removeItem('artisan_manual_customers');
      window.location.href = '/'; // Force reload to clear all state and route to landing
    } catch (err) {
      console.error("Error signing out", err);
    }
  };

  const signUp = async (data: any) => {
    toast.info("Starting signup...");
    try {
      let user = auth.currentUser;
      if (data.password) {
        try {
          toast.info("Creating auth user...");
          const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
          user = userCredential.user;
          toast.info("Auth user created.");
        } catch (authError: any) {
          if (authError.code === 'auth/email-already-in-use') {
            toast.info("Email exists, attempting sign-in...");
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            user = userCredential.user;
          } else {
            // Map Firebase auth errors
            let msg = authError.message;
            if (authError.code === 'auth/weak-password') msg = 'Password is too weak. Minimum 6 characters.';
            if (authError.code === 'auth/invalid-email') msg = 'Invalid email address.';
            throw new Error(msg);
          }
        }
      }
      
      if (!user) throw new Error("No authenticated user found for signup.");

      // Fingerprinting
      toast.info("Generating fingerprint...");
      const nav = window.navigator;
      const screen = window.screen;
      const deviceFingerprint = btoa(`${nav.userAgent}-${nav.language}-${screen.colorDepth}-${screen.width}x${screen.height}-${new Date().getTimezoneOffset()}`);

      if (!isDemoMode) {
        toast.info("Fetching token...");
        const token = await user.getIdToken();
        const { password, ...safeData } = data;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        try {
            toast.info("Calling setup-account...");
            const res = await fetch('/api/setup-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ data: safeData, deviceFingerprint }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            toast.info("Setup-account returned " + res.status);
            
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Failed to initialize account (Status ${res.status}).`);
            }
        } catch (e: any) {
            clearTimeout(timeoutId);
            if (e.name === 'AbortError') {
                throw new Error("Server took too long to respond. Please try again.");
            }
            throw e;
        }
      }

      // SYNC TO GOOGLE SHEET
      const dbUrl = (import.meta as any).env?.VITE_GAS_DATABASE_URL;
      if (dbUrl) {
          fetch(dbUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                  action: 'syncNewUser',
                  payload: {
                      email: data.email,
                      name: data.name || 'New Artisan Business',
                      tier: data.tier,
                      status: data.status || 'Active',
                      date: new Date().toISOString()
                  }
              })
          }).catch(e => console.error("Failed to sync new user to Google Sheet", e));
      }

      setBusinessProfile(prev => ({ ...prev, ...data }));
      setUserTier(data.tier);
      setIsAuthenticated(true);
      setIsTutorialActive(true); // Trigger tutorial for new users
    } catch (error: any) {
      console.error("Signup Error:", error);
      throw error;
    }
  };

  const updateTier = async (tier: UserTier) => {
    setUserTier(tier);
    setBusinessProfile(prev => ({ ...prev, tier }));
    if (auth.currentUser) {
      try {
        if (!isDemoMode) await setDoc(doc(db, 'users', auth.currentUser.uid), { tier }, { merge: true });
      } catch (e) {
        console.error("Failed to sync tier upgrade", e);
      }
    }
  };

  const activateAccount = async () => {
    setBusinessProfile(prev => ({ ...prev, status: 'Active' }));
    if (auth.currentUser) {
      try {
        if (!isDemoMode) await setDoc(doc(db, 'users', auth.currentUser.uid), { status: 'Active' }, { merge: true });
      } catch (e) {
        console.error("Failed to activate account", e);
      }
    }
  };

  const updateBusinessProfile = (updates: Partial<BusinessProfile>) => setBusinessProfile(prev => ({ ...prev, ...updates }));
  const getInventoryValue = () => inventory.reduce((acc, i) => acc + (i.stock * i.unitCost), 0);
  const getTotalRevenue = () => orders.reduce((acc, o) => acc + o.total, 0);

  const getMarginMetrics = () => {
    const finished = inventory.filter(i => i.type === 'finished');
    if (finished.length === 0) return { isMarginHealthy: true, marginMultiplier: 2.2 };
    const avgMultiplier = finished.reduce((acc, i) => {
        const cost = (i.unitCost && i.unitCost > 0) ? i.unitCost : 1; // Prevent division by zero
        return acc + (i.retailPrice ? i.retailPrice / cost : 2.2);
    }, 0) / finished.length;
    return { isMarginHealthy: avgMultiplier >= 2.2, marginMultiplier: avgMultiplier };
  };

  const saveReport = (r: any) => setReports(prev => [{ ...r, id: Date.now().toString() }, ...prev]);
  const deleteReport = (id: string) => setReports(prev => prev.filter(r => r.id !== id));
  const importData = async (files: File[]) => true;
  const addInventoryItem = async (item: any) => {
    try {
      const res = await fetch('/api/gating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: userTier.toLowerCase().replace(/ /g, '-'), action: 'ADD_INVENTORY', currentCount: inventory.length })
      });
      const gate = await res.json();
      if (!gate.allowed) {
        throw new Error(`Tier limit reached: ${gate.limit}`);
      }
      
      const newItem = { ...item, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, stockValue: (item.stock || 0) * (item.unitCost || 0) };
      setInventory(prev => [...prev, newItem]);
      if (!isDemoMode) await dataLayer.create('inventory', newItem);
    } catch (e: any) {
      toast.error(e.message || 'Failed to add inventory item');
      throw e;
    }
  };
  const updateInventory = (id: string | number, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => String(item.id) === String(id) ? { ...item, ...updates, stockValue: ((updates.stock ?? item.stock) || 0) * ((updates.unitCost ?? item.unitCost) || 0) } : item));
  };
  
  const addSupplier = (s: any) => setSuppliers(prev => [...prev, { ...s, id: Date.now().toString() }]);
  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };
  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const addLocation = (l: any) => setLocations(prev => [...prev, { ...l, id: Date.now().toString() }]);
  const addCommunication = (c: any) => setSupplierCommunications(prev => [...prev, { ...c, id: Date.now().toString() }]);
  const addQualityCheck = (q: any) => setQualityChecks(prev => [...prev, { ...q, id: Date.now().toString() }]);
  const addMarketingPost = (post: any) => setMarketingPosts(prev => [...prev, { ...post, id: Date.now().toString() }]);
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => setAppointments(prev => [...prev, { ...appointment, id: Date.now().toString() }]);
  
  const [manualCustomers, setManualCustomers] = useState<ManualCustomer[]>(() => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem('artisan_manual_customers');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }
    return [];
  });

    const addManualCustomer = async (c: Omit<ManualCustomer, 'id' | 'createdDate'>) => {
      const newCust = { ...c, id: 'M-' + Date.now(), createdDate: new Date().toLocaleDateString() };
      setManualCustomers(prev => {
          const next = [...prev, newCust];
          if (typeof window !== 'undefined') localStorage.setItem('artisan_manual_customers', JSON.stringify(next));
          return next;
      });
      if (!isDemoMode && auth.currentUser) {
          try {
              await setDoc(doc(db, 'users', auth.currentUser.uid, 'manualCustomers', newCust.id), newCust);
          } catch (e) { console.error('Failed to sync manual customer', e); }
      }
  };

  const deleteManualCustomer = async (id: string) => {
      setManualCustomers(prev => {
          const next = prev.filter(c => c.id !== id);
          if (typeof window !== 'undefined') localStorage.setItem('artisan_manual_customers', JSON.stringify(next));
          return next;
      });
      if (!isDemoMode && auth.currentUser) {
          try {
              await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'manualCustomers', id));
          } catch (e) { console.error('Failed to delete manual customer', e); }
      }
  };
  const updateMarketingPost = (id: string, updates: any) => setMarketingPosts(prev => prev.map(post => post.id === id ? { ...post, ...updates } : post));
  const generateSchedule = () => setProductionStats(prev => ({ ...prev, active: prev.active + 1 }));
  
  const produceBatch = async (recipeId: string, multiplier: number) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return { success: false, warnings: ['Recipe not found.'] };

    if (!auth.currentUser) return { success: false, warnings: ['Not authenticated.'] };
    const uid = auth.currentUser.uid;
    const warnings: string[] = [];
    let isQuarantined = false;

    const newBatch: ProductionBatch = {
      id: `batch-${Date.now()}`,
      batchNumber: `BAT-${Date.now().toString().slice(-6)}`,
      recipeId,
      yieldQuantity: (recipe.yieldValue || 1) * multiplier,
      actualTotalCost: 0,
      actualUnitCost: 0,
      ingredientsConsumed: [],
      producedDate: new Date().toISOString(),
      status: 'Completed'
    };

    let actualTotal = 0;
    const updatesToSave: { item: InventoryItem; newLots: Lot[]; newStock: number }[] = [];

    const flattenRequirements = (rId: string, mult: number): { [itemId: string]: number } => {
       const reqs: { [itemId: string]: number } = {};
       const rec = recipes.find(x => x.id === rId);
       if (!rec) return reqs;
       
       if (rec.rawIngredients) {
          rec.rawIngredients.forEach(ing => {
             reqs[ing.inventoryItemId] = (reqs[ing.inventoryItemId] || 0) + (ing.quantity * mult);
          });
       }
       if (rec.subRecipes) {
          rec.subRecipes.forEach(sub => {
             const subRec = recipes.find(x => x.id === sub.recipeId);
             if (subRec && subRec.yieldValue) {
                 const subMult = (sub.quantity * mult) / subRec.yieldValue;
                 const subReqs = flattenRequirements(sub.recipeId, subMult);
                 for (const [sId, sQty] of Object.entries(subReqs)) {
                     reqs[sId] = (reqs[sId] || 0) + sQty;
                 }
             }
          });
       }
       return reqs;
    };

    const flatReqs = flattenRequirements(recipeId, multiplier);
    
    for (const [itemId, qtyNeeded] of Object.entries(flatReqs)) {
        const item = inventory.find(i => i.id === itemId || i.id.toString() === itemId);
        if (!item) {
          warnings.push(`Missing ingredient: ${itemId}`);
          continue;
        }

        if (item.isLotTracked && item.lots && item.lots.length > 0) {
          let remainingNeeded = qtyNeeded;
          const newLots = JSON.parse(JSON.stringify(item.lots)) as Lot[];
          newLots.sort((a, b) => new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime());
          
          for (const lot of newLots) {
            if (remainingNeeded <= 0) break;
            if (lot.quantity <= 0) continue;
            
            if (lot.expirationDate && new Date(lot.expirationDate) < new Date()) {
                warnings.push(`Quarantine Warning: Pulled from expired lot ${lot.lotNumber} for ${item.name}.`);
                isQuarantined = true;
            }

            const take = Math.min(lot.quantity, remainingNeeded);
            lot.quantity -= take;
            remainingNeeded -= take;
            
            const cost = take * lot.unitCost;
            actualTotal += cost;
            
            if (lot.quantity === 0) {
              lot.status = 'Depleted';
            }
            
            newBatch.ingredientsConsumed.push({
              itemId: item.id.toString(),
              lotId: lot.id,
              quantity: take,
              costCalculated: cost
            });
          }
          
          if (remainingNeeded > 0) {
            warnings.push(`Not enough stock in lots for ${item.name}.`);
          }
          
          const newStock = newLots.reduce((acc, l) => acc + l.quantity, 0);
          updatesToSave.push({ item, newLots, newStock });
          
        } else {
          if (item.stock < qtyNeeded) {
            warnings.push(`Not enough stock for ${item.name}.`);
          }
          const cost = qtyNeeded * item.unitCost;
          actualTotal += cost;
          newBatch.ingredientsConsumed.push({
            itemId: item.id.toString(),
            quantity: qtyNeeded,
            costCalculated: cost
          });
          
          updatesToSave.push({ item, newLots: item.lots || [], newStock: Math.max(0, item.stock - qtyNeeded) });
        }
    }
    
    const getLaborCost = (rId: string, mult: number): number => {
       let labor = 0;
       const rec = recipes.find(x => x.id === rId);
       if (!rec) return 0;
       labor += (rec.laborCost || 0) * mult;
       if (rec.subRecipes) {
          rec.subRecipes.forEach(sub => {
             const subRec = recipes.find(x => x.id === sub.recipeId);
             if (subRec && subRec.yieldValue) {
                const subMult = (sub.quantity * mult) / subRec.yieldValue;
                labor += getLaborCost(sub.recipeId, subMult);
             }
          });
       }
       return labor;
    };

    actualTotal += getLaborCost(recipeId, multiplier);
    newBatch.actualTotalCost = actualTotal;
    newBatch.actualUnitCost = actualTotal / newBatch.yieldQuantity;
    if (isQuarantined) {
       newBatch.status = 'Quarantined';
    }
    
    try {
      for (const update of updatesToSave) {
        if (!isDemoMode) {
          await setDoc(doc(db, 'users', uid, 'inventory', String(update.item.id)), {
             stock: update.newStock,
             lots: update.newLots
          }, { merge: true });
        }
        setInventory(prev => prev.map(invItem => invItem.id === update.item.id ? { ...invItem, stock: update.newStock, lots: update.newLots } : invItem));
      }
      
      if (!isDemoMode) await setDoc(doc(db, 'users', uid, 'productionBatches', newBatch.id), newBatch);
      setProductionBatches(prev => [...prev, newBatch]);
      
      let fgItem: InventoryItem | undefined;
      if (recipe.finishedGoodsItemId) {
         fgItem = inventory.find(i => String(i.id) === String(recipe.finishedGoodsItemId));
      }
      if (fgItem) {
          const finishedProductIndex = inventory.findIndex(i => i.id === fgItem.id);
          const newStock = fgItem.stock + newBatch.yieldQuantity;
          if (!isDemoMode) await setDoc(doc(db, 'users', uid, 'inventory', String(fgItem.id)), { stock: newStock }, { merge: true });
          setInventory(prev => {
             const copy = [...prev];
             copy[finishedProductIndex] = { ...copy[finishedProductIndex], stock: newStock };
             return copy;
          });
      } else {
          warnings.push("Formula is not explicitly linked to a Finished Good asset. Stock not incremented.");
      }
      
      if (isQuarantined) {
         toast.error(`Batch ${newBatch.batchNumber} produced but marked QUARANTINED due to expired lots.`);
      } else {
         toast.success(`Batch ${newBatch.batchNumber} produced successfully.`);
      }
      return { success: true, warnings };
    } catch (e: any) {
      console.error(e);
      return { success: false, warnings: ['Database write failed'] };
    }
  };

  const processOrder = async (id: string) => {
      const order = orders.find(o => o.id === id);
      const itemsToUpdate: any[] = [];
      if (order && order.status !== 'Shipped') {
          // Deduct from finished goods inventory
          setInventory(prev => {
              const newInv = [...prev];
              order.items.forEach(item => {
                  const invItemIndex = newInv.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase() || i.sku === item.name);
                  if (invItemIndex >= 0) {
                      const newStock = newInv[invItemIndex].stock - item.qty;
                      if (newStock < 0) {
                          toast.warning(`Negative stock: ${newInv[invItemIndex].name} is now ${newStock}.`);
                      }
                      newInv[invItemIndex] = { ...newInv[invItemIndex], stock: newStock, stockValue: newStock * newInv[invItemIndex].unitCost };
                      itemsToUpdate.push(newInv[invItemIndex]);
                  }
              });
              return newInv;
          });
      }

      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Shipped' } : o));
      completeTodoByCategory('orders');

      // Persist changes asynchronously
      try {
          await Promise.all([
              ...itemsToUpdate.map(item => !isDemoMode ? dataLayer.update('inventory', String(item.id), item) : Promise.resolve()),
              (!isDemoMode ? dataLayer.update('orders', id, { status: 'Shipped' } as any) : Promise.resolve())
          ]);
      } catch (err) {
          console.error("Failed to persist order processing to backend:", err);
          toast.error("Failed to sync order processing to backend.");
      }
  };

  const syncWooCommerce = async () => {
      completeTodoByCategory('orders');
      return { success: true, count: 0 };
  };

  const addRecipe = async (recipe: any) => {
    try {
      if (!checkFeatureGate('vault_recipes')) {
        return; // Modal will be shown by checkFeatureGate
      }
      
      const res = await fetch('/api/gating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: userTier.toLowerCase().replace(/ /g, '-'), action: 'vault_recipes', currentCount: recipes.length })
      });
      const gate = await res.json();
      if (!gate.allowed) {
        setUpgradePrompt({ feature: 'Recipe Builder Limit', requiredTier: 'Basic Artisan' });
        return;
      }
      
      const newRecipe = { ...recipe, id: `r-${Date.now()}` };
      setRecipes(prev => [...prev, newRecipe]);
      if (!isDemoMode) await dataLayer.create('recipes', newRecipe);
      completeTodoByCategory('recipes');
    } catch (e: any) {
      toast.error(e.message || 'Failed to add formula');
      throw e;
    }
  };

  const updateRecipe = (id: string, updates: any) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    completeTodoByCategory('recipes');
  };

  const updateBudget = (updates: Partial<BudgetConfig>) => {
      setBudgets(prev => ({ ...prev, ...updates }));
  };

  const addTodo = (task: string, category: TodoItem['category']) => {
    setTodos(prev => [{ id: Date.now().toString(), task, completed: false, category, createdDate: new Date().toISOString() }, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completeTodoByCategory = (category: TodoItem['category']) => {
    setTodos(prev => prev.map(t => t.category === category ? { ...t, completed: true } : t));
  };

  const startTutorial = () => {
    setTutorialStepState(0);
    setIsTutorialActive(true);
  };

  const setTutorialStep = (step: number) => setTutorialStepState(step);

  const completeTutorial = () => {
    setIsTutorialActive(false);
    setTutorialStepState(0);
  };

  const toggleIntegrationStatus = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        const newStatus = int.status === 'Connected' ? 'Connect' : 'Connected';
        return { 
          ...int, 
          status: newStatus, 
          lastSync: newStatus === 'Connected' ? 'Just now' : int.lastSync 
        };
      }
      return int;
    }));
  };

  const updateSystemUser = (id: string, updates: Partial<SystemUser>) => {
      setSystemUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };
  
  const deleteSystemUser = (id: string) => {
      setSystemUsers(prev => prev.filter(u => u.id !== id));
  };
  
  const inviteSystemUser = (email: string, tier: string) => {
      setSystemUsers(prev => [...prev, {
          id: `usr_${Math.random().toString(36).substr(2, 5)}`,
          name: 'Pending User',
          email,
          tier,
          status: 'Pending',
          lastLogin: 'Never',
          revenueProcessed: 0
      }]);
  };

  const submitVIPWaitlist = async (data: { fullName: string; email: string; businessType: string }) => {
    try {
      // 1. Call Webhook for Google Sheets directly
      const googleAppScriptUrl = 'https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec';
      const payload = {
        action: 'artisan_flow_lead',
        name: data.fullName,
        email: data.email,
        businessType: data.businessType
      };

      await fetch(googleAppScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });

      // 2. Write to Firestore (Don't let permissions block success message)
      try {
        const waitlistRef = doc(db, 'vip_waitlist', data.email);
        if (!isDemoMode) await setDoc(waitlistRef, {
          ...data,
          timestamp: new Date().toISOString()
        });
      } catch (fbError) {
        console.warn('Firestore write failed (likely permissions), but webhook succeeded:', fbError);
      }

      toast.success('You have been added to the VIP Waitlist!');
      return true;
    } catch (error: any) {
      console.error('Waitlist submission failed', error);
      toast.error('Submission failed. Please try again.');
      return false;
    }
  };

  return (
    <DataContext.Provider value={{ 
      inventory, orders, manualCustomers, businessProfile, isAuthenticated, userTier, reports, productionStats,
      suppliers, marketingPosts, integrations, qualityChecks, locations, supplierCommunications, recipes, appointments, 
      isSessionVerifying, demandInsights, budgets, todos, isTutorialActive, tutorialStep, login, googleLogin, logout, signUp, updateTier, activateAccount, updateBusinessProfile,
      onboardingState, markHubVisited,
      getInventoryValue, getTotalRevenue, getMarginMetrics, saveReport, deleteReport,
      importData, addInventoryItem, updateInventory, addSupplier, updateSupplier, deleteSupplier, addLocation, addCommunication, addQualityCheck, addMarketingPost, addAppointment, addManualCustomer, deleteManualCustomer, updateMarketingPost, 
      generateSchedule, produceBatch, processOrder, syncWooCommerce, addRecipe, updateRecipe, updateBudget, addTodo, toggleTodo, completeTodoByCategory,
      startTutorial, setTutorialStep, completeTutorial, toggleIntegrationStatus,
      systemUsers, updateSystemUser, deleteSystemUser, inviteSystemUser,
      connectedChannels,
      toggleChannelConnection,
      submitVIPWaitlist,
      upgradePrompt,
      setUpgradePrompt,
      checkFeatureGate, isDemoMode, loadDemoData, clearDemoData,
      productionBatches, migrateInventoryToLots, getRecipeActualCost,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useArtisanData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useArtisanData error');
  return context;
};



