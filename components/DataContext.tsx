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
import { db as dataLayer } from '../services/dataLayer';
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
  status: 'Active' | 'Inactive' | 'Past Due';
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
  googleLogin: () => Promise<any>;
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
  updateMarketingPost: (id: string, updates: Partial<MarketingPost>) => void;
  generateSchedule: () => void;
  produceBatch: (recipeId: string, multiplier: number) => Promise<{ success: boolean; warnings: string[] }>;
  processOrder: (id: string) => Promise<void>;
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const ArtisanDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [userTier, setUserTier] = useState<UserTier>('Artisan Flow Basic');
  const [isSessionVerifying, setIsSessionVerifying] = useState(true);
  const [demandInsights, setDemandInsights] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [manualCustomers, setManualCustomers] = useState<ManualCustomer[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStepState] = useState(0);

  // Read initial onboarding state from localStorage if available
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
    tier: 'Free Audit',
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
  
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);

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
      status: 'Connected',
      logo: 'https://logo.clearbit.com/firebase.google.com',
      description: 'Secure user identity and session management.',
      aiCapability: 'Anomaly Login Detection',
      features: ['Google OAuth', 'JWT Session Management'],
      lastSync: 'Today, 08:00 AM'
    },
    {
      id: 'email_smtp',
      name: 'Email / SMTP',
      category: 'System',
      status: 'Connected',
      logo: 'https://logo.clearbit.com/sendgrid.com',
      description: 'Transactional email routing.',
      aiCapability: 'Smart Bounce Handling',
      features: ['Automated Receipts', 'Supplier Comms'],
      lastSync: 'Today, 10:15 AM'
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsSessionVerifying(true);
      if (user) {
        // Load user profile from Firestore (Phase 3 implementation)
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setIsAuthenticated(true);
            const profileData = docSnap.data().profile;
            const adminEmails = ['lacarmsu38@gmail.com', 'lcarter@lrcholisticmarketing.online', 'lrenee@herbalisticwellness.com'];
            
            // Securely grant admin rights if the authenticated Firebase user matches an admin email
            if (user.email && adminEmails.includes(user.email.toLowerCase())) {
              profileData.role = 'admin';
            }
            
            setBusinessProfile(prev => ({ ...prev, ...profileData }));
            setUserTier(docSnap.data().tier || 'Artisan Flow Basic');
          } else {
            const adminEmails = ['lacarmsu38@gmail.com', 'lcarter@lrcholisticmarketing.online', 'lrenee@herbalisticwellness.com'];
            if (user.email && adminEmails.includes(user.email.toLowerCase())) {
              const defaultProfile = { name: 'Admin Hub', email: user.email, role: 'admin' };
              await setDoc(docRef, {
                email: user.email,
                tier: 'Margin Protection Pro',
                status: 'Active',
                profile: defaultProfile,
                createdAt: new Date().toISOString()
              });
              setIsAuthenticated(true);
              setBusinessProfile(prev => ({ ...prev, ...defaultProfile }));
              setUserTier('Margin Protection Pro');
            } else {
              auth.signOut();
              toast.error("Account incomplete. Please finish checkout.");
            }
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
      window.location.href = '/'; // Force reload to clear all state and route to landing
    } catch (err) {
      console.error("Error signing out", err);
    }
  };

  const signUp = async (data: any) => {
    try {
      let user = auth.currentUser;
      // First, create the auth user if this is a standard email/password signup
      if (data.password) {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        user = userCredential.user;
      }
      
      if (!user) {
         throw new Error("No authenticated user found for signup.");
      }

      // Then save their profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: data.email,
        tier: data.tier,
        status: data.status,
        profile: {
          name: data.name || 'New Artisan Business',
          ownerName: data.ownerName || 'Business Owner',
          email: data.email,
        },
        createdAt: new Date().toISOString(),
        isNewUser: true // explicitly marking as new user for the database if needed
      });

      // SYNC TO GOOGLE SHEET
      const dbUrl = (import.meta as any).env?.VITE_GAS_DATABASE_URL;
      if (dbUrl) {
          try {
              await fetch(dbUrl, {
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
              });
          } catch (e) {
              console.error("Failed to sync new user to Google Sheet", e);
          }
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
      await dataLayer.create('inventory', newItem);
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
  const addManualCustomer = (c: Omit<ManualCustomer, 'id' | 'createdDate'>) => {
    setManualCustomers(prev => [...prev, { ...c, id: `M-${Date.now()}`, createdDate: new Date().toLocaleDateString() }]);
  };
  const updateMarketingPost = (id: string, updates: any) => setMarketingPosts(prev => prev.map(post => post.id === id ? { ...post, ...updates } : post));
  const generateSchedule = () => setProductionStats(prev => ({ ...prev, active: prev.active + 1 }));
  
  const produceBatch = async (recipeId: string, multiplier: number) => {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return { success: false, warnings: ['Recipe not found.'] };

      const warnings: string[] = [];
      let newInventory = [...inventory];
      const itemsToUpdate: any[] = [];
      const itemsToCreate: any[] = [];

      // 1. Deduct Raw Materials
      recipe.ingredients.forEach(ing => {
          const invItemIndex = newInventory.findIndex(i => i.name.toLowerCase() === ing.name.toLowerCase() || i.sku === ing.name);
          const deduction = parseFloat(ing.qty) * multiplier;
          
          if (invItemIndex >= 0) {
              const currentStock = newInventory[invItemIndex].stock;
              const newStock = currentStock - deduction;
              if (newStock < 0) {
                  warnings.push(`Negative stock warning: ${newInventory[invItemIndex].name} dropped to ${newStock.toFixed(2)} units.`);
              }
              newInventory[invItemIndex] = { ...newInventory[invItemIndex], stock: newStock, stockValue: newStock * newInventory[invItemIndex].unitCost };
              itemsToUpdate.push(newInventory[invItemIndex]);
          } else {
              warnings.push(`Material not found in inventory: ${ing.name}. Batch will proceed without deduction for this item.`);
          }
      });

      // 2. Add Finished Goods Yield
      const yieldAmount = (parseFloat(recipe.yield) || 1) * multiplier;
      const finishedProductIndex = newInventory.findIndex(i => i.name.toLowerCase() === recipe.name.toLowerCase());
      
      if (finishedProductIndex >= 0) {
          const newStock = newInventory[finishedProductIndex].stock + yieldAmount;
          newInventory[finishedProductIndex] = { ...newInventory[finishedProductIndex], stock: newStock, stockValue: newStock * newInventory[finishedProductIndex].unitCost };
          itemsToUpdate.push(newInventory[finishedProductIndex]);
      } else {
          // Auto-create finished product if it doesn't exist
          const newItem = {
              id: Date.now(),
              name: recipe.name,
              sku: recipe.sku || `SKU-${Date.now()}`,
              type: 'finished',
              category: 'Finished Goods',
              stock: yieldAmount,
              unitCost: recipe.totalCost / (parseFloat(recipe.yield) || 1),
              retailPrice: recipe.totalCost * 2.5, // Default markup
              stockValue: recipe.totalCost * multiplier,
              unit: 'pcs',
              reorderPoint: 5
          };
          newInventory.push(newItem as any);
          itemsToCreate.push(newItem);
      }

      setInventory(newInventory);
      setProductionStats(prev => ({ ...prev, active: prev.active + 1, completed: prev.completed + 1 }));

      // Persist changes asynchronously
      try {
          await Promise.all([
              ...itemsToUpdate.map(item => dataLayer.update('inventory', String(item.id), item)),
              ...itemsToCreate.map(item => dataLayer.create('inventory', item))
          ]);
      } catch (err) {
          console.error("Failed to persist batch production to backend:", err);
          warnings.push("Backend persistence failed. Data may be lost on reload.");
      }

      return { success: true, warnings };
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
              ...itemsToUpdate.map(item => dataLayer.update('inventory', String(item.id), item)),
              dataLayer.update('orders', id, { status: 'Shipped' })
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
      const res = await fetch('/api/gating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: userTier.toLowerCase().replace(/ /g, '-'), action: 'ADD_RECIPE', currentCount: recipes.length })
      });
      const gate = await res.json();
      if (!gate.allowed) {
        throw new Error(`Tier limit reached: ${gate.limit}`);
      }
      
      const newRecipe = { ...recipe, id: `r-${Date.now()}` };
      setRecipes(prev => [...prev, newRecipe]);
      await dataLayer.create('recipes', newRecipe);
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
        await setDoc(waitlistRef, {
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
      isSessionVerifying, demandInsights, budgets, todos, isTutorialActive, tutorialStep, login, googleLogin, logout, signUp, updateTier, updateBusinessProfile,
      onboardingState, markHubVisited,
      getInventoryValue, getTotalRevenue, getMarginMetrics, saveReport, deleteReport,
      importData, addInventoryItem, updateInventory, addSupplier, updateSupplier, deleteSupplier, addLocation, addCommunication, addQualityCheck, addMarketingPost, addAppointment, addManualCustomer, updateMarketingPost, 
      generateSchedule, produceBatch, processOrder, syncWooCommerce, addRecipe, updateRecipe, updateBudget, addTodo, toggleTodo, completeTodoByCategory,
      startTutorial, setTutorialStep, completeTutorial, toggleIntegrationStatus,
      systemUsers, updateSystemUser, deleteSystemUser, inviteSystemUser,
      connectedChannels,
      toggleChannelConnection,
      submitVIPWaitlist
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
