
import { 
  InventoryItem, ProductionOrder, ContentPost, 
  Recipe, BaseEntity, IntegrationConfig, IntegrationPlatform,
  BusinessProfile, UserProfile, PortalConfig, MembershipTier, UserRole
} from '../types';
import { MOCK_INVENTORY, MOCK_PRODUCTION, MOCK_POSTS, DEFAULT_TIER } from '../constants';
import { db as firestoreDb } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Collection Names
const COLLECTIONS = {
  INVENTORY: 'inventory',
  PRODUCTION: 'production',
  CONTENT: 'content',
  RECIPES: 'recipes',
  INTEGRATIONS: 'integrations',
  USERS: 'users',
  BUSINESS_PROFILE: 'business_profile',
  PORTAL_CONFIG: 'portal_config'
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to add timestamps
const withTimestamps = <T extends Partial<BaseEntity>>(item: T): T & BaseEntity => ({
  ...item,
  id: item.id || generateId(),
  created_date: item.created_date || new Date().toISOString(),
  updated_date: new Date().toISOString(),
  created_by: 'current_user',
} as T & BaseEntity);

// Initialization Logic
const initializeStore = () => {
  if (!localStorage.getItem(COLLECTIONS.INVENTORY)) {
    localStorage.setItem(COLLECTIONS.INVENTORY, JSON.stringify(MOCK_INVENTORY.map(withTimestamps)));
  }
  if (!localStorage.getItem(COLLECTIONS.PRODUCTION)) {
    localStorage.setItem(COLLECTIONS.PRODUCTION, JSON.stringify(MOCK_PRODUCTION.map(withTimestamps)));
  }
  if (!localStorage.getItem(COLLECTIONS.CONTENT)) {
    localStorage.setItem(COLLECTIONS.CONTENT, JSON.stringify(MOCK_POSTS.map(withTimestamps)));
  }
  if (!localStorage.getItem(COLLECTIONS.INTEGRATIONS)) {
    // Default integrations mocked
    const mockIntegrations: Partial<IntegrationConfig>[] = [
      { platform: IntegrationPlatform.SHOPIFY, status: 'DISCONNECTED' },
      { platform: IntegrationPlatform.ETSY, status: 'DISCONNECTED' }
    ];
    localStorage.setItem(COLLECTIONS.INTEGRATIONS, JSON.stringify(mockIntegrations.map(withTimestamps)));
  }
  
  // Settings Initialization
  if (!localStorage.getItem(COLLECTIONS.USERS)) {
    const defaultUser: Partial<UserProfile> = {
      fullName: 'Alex Artisan',
      email: 'alex@lrcflow.com',
      role: UserRole.ADMIN,
      notificationsEnabled: true
    };
    localStorage.setItem(COLLECTIONS.USERS, JSON.stringify([withTimestamps(defaultUser)]));
  }
  if (!localStorage.getItem(COLLECTIONS.BUSINESS_PROFILE)) {
    const defaultBusiness: Partial<BusinessProfile> = {
      name: 'Luxe Artisan Co.',
      tier: DEFAULT_TIER,
      currency: 'USD',
      timezone: 'GMT-5',
      settings: {}
    };
    localStorage.setItem(COLLECTIONS.BUSINESS_PROFILE, JSON.stringify([withTimestamps(defaultBusiness)]));
  }
  if (!localStorage.getItem(COLLECTIONS.PORTAL_CONFIG)) {
    const defaultConfig: Partial<PortalConfig> = {
      brandColor: '#FFD700',
      welcomeMessage: 'Welcome to our wholesale portal.',
      minOrderValue: 500,
      isActive: false
    };
    localStorage.setItem(COLLECTIONS.PORTAL_CONFIG, JSON.stringify([withTimestamps(defaultConfig)]));
  }
};

const GAS_URL = import.meta.env.VITE_GAS_DATABASE_URL;

const syncToGAS = (action: string, collectionName: string, payload: any) => {
  if (!GAS_URL) return;
  fetch(GAS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, collection: collectionName, data: payload, timestamp: new Date().toISOString() })
  }).catch(err => console.error('GAS Sync Error:', err));
};

// Initialize on load
if (typeof window !== 'undefined') {
  initializeStore();
}

// Data Service Interface definition for swappable backends
export interface DataService {
  list<T extends BaseEntity>(collection: string): Promise<T[]>;
  get<T extends BaseEntity>(collection: string, id: string): Promise<T | undefined>;
  getFirst<T extends BaseEntity>(collection: string): Promise<T | undefined>;
  create<T extends BaseEntity>(collection: string, item: Omit<T, keyof BaseEntity>): Promise<T>;
  update<T extends BaseEntity>(collection: string, id: string, updates: Partial<T>): Promise<T>;
  delete(collection: string, id: string): Promise<void>;
}

// Firestore-based Implementation of DataService with Dual-Write to GAS
class FirestoreDataService implements DataService {
  async list<T extends BaseEntity>(collectionName: string): Promise<T[]> {
    const snap = await getDocs(collection(firestoreDb, collectionName));
    if (snap.empty) {
      // Fallback to local storage for initial seeding logic
      const local = localStorage.getItem(collectionName);
      if (local) return JSON.parse(local);
      return [];
    }
    return snap.docs.map(d => d.data() as T);
  }

  async get<T extends BaseEntity>(collectionName: string, id: string): Promise<T | undefined> {
    const snap = await getDoc(doc(firestoreDb, collectionName, id));
    return snap.exists() ? (snap.data() as T) : undefined;
  }

  async getFirst<T extends BaseEntity>(collectionName: string): Promise<T | undefined> {
    const snap = await getDocs(collection(firestoreDb, collectionName));
    return snap.docs[0]?.data() as T;
  }

  async create<T extends BaseEntity>(collectionName: string, item: Omit<T, keyof BaseEntity>): Promise<T> {
    const itemData = item as any;
    const id = itemData.id || generateId();
    const newItem = {
      ...itemData,
      id,
      created_date: itemData.created_date || new Date().toISOString(),
      updated_date: new Date().toISOString(),
      created_by: 'current_user'
    } as unknown as T;
    
    await setDoc(doc(firestoreDb, collectionName, id), newItem);
    syncToGAS('CREATE', collectionName, newItem);
    return newItem;
  }

  async update<T extends BaseEntity>(collectionName: string, id: string, updates: Partial<T>): Promise<T> {
    const docRef = doc(firestoreDb, collectionName, id);
    const updatedData = { ...updates, updated_date: new Date().toISOString() };
    await updateDoc(docRef, updatedData);
    
    const fullDoc = (await getDoc(docRef)).data() as T;
    syncToGAS('UPDATE', collectionName, fullDoc);
    return fullDoc;
  }

  async delete(collectionName: string, id: string): Promise<void> {
    await deleteDoc(doc(firestoreDb, collectionName, id));
    syncToGAS('DELETE', collectionName, { id });
  }
}

export const db: DataService = new FirestoreDataService();
export const Collections = COLLECTIONS;
