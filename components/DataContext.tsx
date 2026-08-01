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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

/**
 * ArtisanFlow Architecture 1.1 - Lola Intelligence Node
 */

export type UserTier = 'Free Audit' | 'Artisan Flow Basic' | 'Margin Protection Pro';

export interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  category: 'orders' | 'inventory' | 'marketing' | 'recipes' | 'general';
  createdDate: string;
}

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
  status: 'Active' | 'Inactive';
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
  appointments: Appointment[];
  isSessionVerifying: boolean;
  demandInsights: any[];
  budgets: BudgetConfig;
  todos: TodoItem[];
  isTutorialActive: boolean;
  tutorialStep: number;
  login: (email: string, pass: string) => Promise<boolean>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  signUp: (data: any) => Promise<void>;
  updateTier: (tier: UserTier) => Promise<void>;
  updateBusinessProfile: (updates: Partial<BusinessProfile>) => void;
  getInventoryValue: () => number;
  getTotalRevenue: () => number;
  getMarginMetrics: () => { isMarginHealthy: boolean; marginMultiplier: number };
  saveReport: (report: Omit<Report, 'id'>) => void;
  deleteReport: (id: string) => void;
  importData: (files: File[]) => Promise<boolean>;
  addInventoryItem: (item: any) => void;
  addSupplier: (supplier: any) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addLocation: (location: any) => void;
  addCommunication: (comm: any) => void;
  addQualityCheck: (check: any) => void;
  addMarketingPost: (post: any) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  addManualCustomer: (customer: Omit<ManualCustomer, 'id' | 'createdDate'>) => void;
  updateMarketingPost: (id: string, updates: Partial<MarketingPost>) => void;
  generateSchedule: () => void;
  processOrder: (id: string) => void;
  syncWooCommerce: () => Promise<{ success: boolean; count?: number; error?: string }>;
  addRecipe: (recipe: any) => void;
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const ArtisanDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [userTier, setUserTier] = useState<UserTier>('Artisan Flow Basic');
  const [isSessionVerifying, setIsSessionVerifying] = useState(true);
  const [demandInsights, setDemandInsights] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [manualCustomers, setManualCustomers] = useState<ManualCustomer[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([
      { id: '1', task: 'Process pending orders', completed: false, category: 'orders', createdDate: new Date().toISOString() },
      { id: '2', task: 'Review raw material burn rates', completed: false, category: 'inventory', createdDate: new Date().toISOString() },
      { id: '3', task: 'Initialize Q4 marketing strategy', completed: false, category: 'marketing', createdDate: new Date().toISOString() },
  ]);
  
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStepState] = useState(0);

  // Read initial onboarding state from localStorage if available
  const [onboardingState, setOnboardingState] = useState<Record<string, boolean>>(() => {
      try {
          const stored = localStorage.getItem('artisanflow_onboarding');
          if (stored) return JSON.parse(stored);
      } catch (e) { console.error(e); }
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

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    name: 'Artisan Flow Demo', 
    ownerName: 'Admin User', 
    email: 'admin@artisanflow.app', 
    industry: 'Skincare',
    tier: 'Artisan Flow Basic',
    role: 'admin',
    status: 'Active',
    brandVoice: { adjectives: ['Artisanal', 'Luxurious'], restrictedWords: [] },
    receptionistLogic: { qualificationQuestions: ['What is your wholesale budget?', 'Do you have a physical storefront?'] }
  });

  const [budgets, setBudgets] = useState<BudgetConfig>({
      daily: 50,
      weekly: 350,
      monthly: 1500,
      yearly: 18000
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: '100% Grain Alcohol', sku: 'ALC-100', stock: 230, unit: 'oz', unitCost: 0.77, stockValue: 177.10, reorderPoint: 50, type: 'raw', supplier: 'Essence Org' },
    { id: 2, name: 'Rosemary Leaf', sku: 'Herb-115', stock: 6, unit: 'oz', unitCost: 2.50, stockValue: 15.00, reorderPoint: 10, type: 'raw', lowStock: true, supplier: 'Global Botanicals' },
    { id: 3, name: 'Lavender Buds', sku: 'LAV-B', stock: 45, unit: 'oz', unitCost: 1.20, stockValue: 54.00, reorderPoint: 20, type: 'raw', supplier: 'Global Botanicals' },
    { id: 101, name: 'Lavender Rose SOAP', sku: 'SOAP-LR', stock: 7, unit: 'piece', unitCost: 3.20, retailPrice: 8.00, stockValue: 22.40, reorderPoint: 20, type: 'finished', category: 'Soaps' },
    { id: 102, name: 'Turmeric Myrrh Soap', sku: 'SOAP-TM', stock: 12, unit: 'piece', unitCost: 3.50, retailPrice: 9.00, stockValue: 42.00, reorderPoint: 15, type: 'finished', category: 'Soaps' },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: '#13086', customer: 'RJ Baise', email: 'rj.baise@me.com', date: new Date().toLocaleDateString(), location: 'Cave City, KY', status: 'Processing', platform: 'Direct', total: 24.59, items: [{ name: 'Turmeric Myrrh Soap', qty: 10, price: 6.15 }] }
  ]);

  const [reports, setReports] = useState<Report[]>([]);
  const [productionStats, setProductionStats] = useState({ active: 2, inProgress: 1, awaiting: 1, completed: 5, pending: 2 });
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 's1', name: 'Essence Org', contactName: 'Sarah Miles', email: 'orders@essence.org', phone: '555-0102', rating: 5, tier: 'Reliable', pricePerUnit: 12.50, leadTime: 7, paymentTerms: 'Net 30' },
    { id: 's2', name: 'Global Botanicals', contactName: 'Marcus Thorne', email: 'sales@globalbotanicals.com', phone: '555-0941', rating: 4, tier: 'Moderate', pricePerUnit: 8.00, leadTime: 14, paymentTerms: 'Net 15' }
  ]);

  const [marketingPosts, setMarketingPosts] = useState<MarketingPost[]>([
    { id: 'm1', platform: 'Instagram', topic: 'Behind the Scenes', content: 'Our rosemary is freshly sourced...', scheduledDate: '2025-12-01', status: 'Scheduled', type: 'Image' }
  ]);
  
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([
    { id: 'qc1', productName: 'Lavender Rose SOAP', batchNumber: 'B-1024', status: 'Passed', inspector: 'L. Carter', date: '2025-11-20' },
    { id: 'qc2', productName: 'Turmeric Myrrh Soap', batchNumber: 'B-1025', status: 'Pending', inspector: 'L. Carter', date: '2025-11-24' }
  ]);

  const [locations, setLocations] = useState<Location[]>([
    { id: 'l1', name: 'Main Studio', type: 'Warehouse', address: '123 Artisan Way', capacity: '5000 sqft' }
  ]);

  const [supplierCommunications, setSupplierCommunications] = useState<SupplierCommunication[]>([]);
  
  const [recipes, setRecipes] = useState<Recipe[]>([
    { 
        id: 'r1', 
        name: 'Lavender Rose SOAP', 
        version: '2.1', 
        sku: 'SOAP-LR', 
        yield: '50 Units',
        yieldValue: 50,
        materialCost: 150.00, 
        laborCost: 50.00,
        totalCost: 200.00, 
        productionTime: 120,
        ingredients: [
            { name: '100% Grain Alcohol', qty: '10 oz' },
            { name: 'Lavender Buds', qty: '5 oz' }
        ],
        rawIngredients: [
            { inventoryItemId: '1', quantity: 10, unit: 'oz' },
            { inventoryItemId: '3', quantity: 5, unit: 'oz' }
        ]
    },
    { 
        id: 'r2', 
        name: 'Turmeric Myrrh Soap', 
        version: '1.0', 
        sku: 'SOAP-TM', 
        yield: '25 Units',
        yieldValue: 25,
        materialCost: 85.00, 
        laborCost: 25.00,
        totalCost: 110.00, 
        productionTime: 90,
        ingredients: [
            { name: 'Rosemary Leaf', qty: '2 oz' }
        ],
        rawIngredients: [
            { inventoryItemId: '2', quantity: 2, unit: 'oz' }
        ]
    }
  ]);
  
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([
    { id: 'usr_8x92a', name: 'John A.', email: 'admin1@domain.com', tier: 'Margin Protection Pro', status: 'Active', lastLogin: 'Today, 08:24 AM', revenueProcessed: 145020 },
    { id: 'usr_9j2bb', name: 'Sarah M.', email: 'admin2@domain.com', tier: 'Artisan Flow Basic', status: 'Active', lastLogin: 'Yesterday, 14:12 PM', revenueProcessed: 42000 },
    { id: 'usr_2m4cc', name: 'Client X.', email: 'client@domain.com', tier: 'Free Audit', status: 'Pending', lastLogin: 'Never', revenueProcessed: 0 },
  ]);

  const [integrations, setIntegrations] = useState<Integration[]>([
    { 
      id: 'shopify', 
      name: 'Shopify', 
      category: 'E-commerce', 
      status: 'Connected', 
      logo: 'https://logo.clearbit.com/shopify.com', 
      description: 'Unified storefront commerce logic.',
      aiCapability: 'Predictive Stock Reconciliation',
      features: ['Real-time Order Ingestion', 'Inventory Sync'],
      lastSync: 'Today, 09:12 AM'
    },
    { 
      id: 'woocommerce', 
      name: 'WooCommerce', 
      category: 'Wholesale', 
      status: 'Connected', 
      logo: 'https://logo.clearbit.com/woocommerce.com', 
      description: 'Daily metadata sync active.',
      aiCapability: 'Profit Margin Shield',
      features: ['Daily Metadata Sync', 'Bidirectional Stock Push'],
      lastSync: 'Today, 04:12 AM'
    },
    { 
      id: 'etsy', 
      name: 'Etsy', 
      category: 'Marketplace', 
      status: 'Connect', 
      logo: 'https://logo.clearbit.com/etsy.com', 
      description: 'Artisanal marketplace integration.',
      aiCapability: 'SEO Tag Synthesizer',
      features: ['Listing Management', 'Order Tracking'],
    },
    { 
      id: 'square', 
      name: 'Square', 
      category: 'POS', 
      status: 'Connect', 
      logo: 'https://logo.clearbit.com/squareup.com', 
      description: 'Physical point-of-sale reconciliation.',
      aiCapability: 'Foot-Traffic Forecasting',
      features: ['In-person Sales Sync', 'Stock Adjustment'],
    },
    { 
      id: 'gmail', 
      name: 'Gmail', 
      category: 'System', 
      status: 'Connected', 
      logo: 'https://logo.clearbit.com/gmail.com', 
      description: 'Synaptic communication protocols.',
      aiCapability: 'Lead Analysis Node',
      features: ['Lead Notification Parsing', 'Auto-Reply Synthesis'],
      lastSync: 'Today, 10:45 AM'
    },
    { 
      id: 'gdrive', 
      name: 'Google Drive', 
      category: 'System', 
      status: 'Connected', 
      logo: 'https://logo.clearbit.com/drive.google.com', 
      description: 'Secure architectural asset storage.',
      aiCapability: 'BOM Metadata Extraction',
      features: ['BOM Export Sync', 'Production Asset Ingestion'],
      lastSync: 'Today, 08:30 AM'
    }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsSessionVerifying(true);
      if (user) {
        setIsAuthenticated(true);
        // Load user profile from Firestore (Phase 3 implementation)
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBusinessProfile(prev => ({ ...prev, ...docSnap.data().profile }));
            setUserTier(docSnap.data().tier || 'Artisan Flow Basic');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        
        setDemandInsights([
            { id: '1', material: 'Rosemary Leaf', isCritical: true, recommendedBatch: 50, daysRemaining: 2 }
        ]);
      } else {
        setIsAuthenticated(false);
      }
      setIsSessionVerifying(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => { 
    // Hardcoded Admin Bypass
    const adminEmails = [
      'admin@artisanflow.app',
      'lacarmsu38@gmail.com',
      'lcarter@lrcholisticmarketing.online'
    ];
    
    if (adminEmails.includes(email.toLowerCase()) && pass === 'Bossbabe26##') {
      setIsAuthenticated(true);
      setBusinessProfile(prev => ({ 
        ...prev, 
        email: email,
        role: 'admin',
        ownerName: 'Super Admin'
      }));
      toast.success('Architect Authorization Confirmed.');
      return true;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  };

  const googleLogin = async () => { 
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  const logout = () => { 
    signOut(auth);
  };

  const signUp = async (data: any) => {
    try {
      // First, create the auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password || 'TemporaryPass123!');
      const user = userCredential.user;

      // Then save their profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: data.email,
        tier: data.tier,
        status: data.status,
        profile: {
          name: data.name || 'New Artisan Business',
          ownerName: data.ownerName || 'Admin User',
          email: data.email,
        },
        createdAt: new Date().toISOString()
      });

      setBusinessProfile(prev => ({ ...prev, ...data }));
      setUserTier(data.tier);
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  const updateTier = async (tier: UserTier) => {
    setUserTier(tier);
    setBusinessProfile(prev => ({ ...prev, tier }));
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), { tier }, { merge: true });
      } catch (e) {
        console.error("Failed to sync tier upgrade", e);
      }
    }
  };

  const updateBusinessProfile = (updates: Partial<BusinessProfile>) => setBusinessProfile(prev => ({ ...prev, ...updates }));
  const getInventoryValue = () => inventory.reduce((acc, i) => acc + (i.stock * i.unitCost), 0);
  const getTotalRevenue = () => orders.reduce((acc, o) => acc + o.total, 0);

  const getMarginMetrics = () => {
    const finished = inventory.filter(i => i.type === 'finished');
    if (finished.length === 0) return { isMarginHealthy: true, marginMultiplier: 2.2 };
    const avgMultiplier = finished.reduce((acc, i) => acc + (i.retailPrice && i.unitCost ? i.retailPrice / i.unitCost : 2.2), 0) / finished.length;
    return { isMarginHealthy: avgMultiplier >= 2.2, marginMultiplier: avgMultiplier };
  };

  const saveReport = (r: any) => setReports(prev => [{ ...r, id: Date.now().toString() }, ...prev]);
  const deleteReport = (id: string) => setReports(prev => prev.filter(r => r.id !== id));
  const importData = async (files: File[]) => true;
  const addInventoryItem = (item: any) => setInventory(prev => [...prev, { ...item, id: Date.now(), stockValue: (item.stock || 0) * (item.unitCost || 0) }]);
  
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
  const addManualCustomer = (c: Omit<ManualCustomer, 'id' | 'createdDate'>) => {
    setManualCustomers(prev => [...prev, { ...c, id: `M-${Date.now()}`, createdDate: new Date().toLocaleDateString() }]);
  };
  const updateMarketingPost = (id: string, updates: any) => setMarketingPosts(prev => prev.map(post => post.id === id ? { ...post, ...updates } : post));
  const generateSchedule = () => setProductionStats(prev => ({ ...prev, active: prev.active + 1 }));
  
  const processOrder = (id: string) => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Shipped' } : o));
      completeTodoByCategory('orders');
  };

  const syncWooCommerce = async () => {
      completeTodoByCategory('orders');
      return { success: true, count: 0 };
  };

  const addRecipe = (recipe: any) => {
    setRecipes(prev => [...prev, { ...recipe, id: `r-${Date.now()}` }]);
    completeTodoByCategory('recipes');
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

  return (
    <DataContext.Provider value={{ 
      inventory, orders, manualCustomers, businessProfile, isAuthenticated, userTier, reports, productionStats,
      suppliers, marketingPosts, integrations, qualityChecks, locations, supplierCommunications, recipes, appointments, 
      isSessionVerifying, demandInsights, budgets, todos, isTutorialActive, tutorialStep, login, googleLogin, logout, signUp, updateTier, updateBusinessProfile,
      onboardingState, markHubVisited,
      getInventoryValue, getTotalRevenue, getMarginMetrics, saveReport, deleteReport,
      importData, addInventoryItem, addSupplier, updateSupplier, deleteSupplier, addLocation, addCommunication, addQualityCheck, addMarketingPost, addAppointment, addManualCustomer, updateMarketingPost, 
      generateSchedule, processOrder, syncWooCommerce, addRecipe, updateRecipe, updateBudget, addTodo, toggleTodo, completeTodoByCategory,
      startTutorial, setTutorialStep, completeTutorial, toggleIntegrationStatus,
      systemUsers, updateSystemUser, deleteSystemUser, inviteSystemUser,
      connectedChannels,
      toggleChannelConnection
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