
import { 
  InventoryItem, ProductionOrder, ContentPost, 
  Recipe, BaseEntity, IntegrationConfig, IntegrationPlatform,
  BusinessProfile, UserProfile, PortalConfig, MembershipTier, UserRole
} from '../types';
import { MOCK_INVENTORY, MOCK_PRODUCTION, MOCK_POSTS, DEFAULT_TIER } from '../constants';

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

// Initialize on load
if (typeof window !== 'undefined') {
  initializeStore();
}

// Generic Data Service Class
class DataService {
  private getCollection<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setCollection<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- CRUD Operations ---

  async list<T extends BaseEntity>(collection: string): Promise<T[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getCollection<T>(collection);
  }

  async get<T extends BaseEntity>(collection: string, id: string): Promise<T | undefined> {
    const items = this.getCollection<T>(collection);
    return items.find(i => i.id === id);
  }

  // Helper for singletons (User, Business Profile)
  async getFirst<T extends BaseEntity>(collection: string): Promise<T | undefined> {
    const items = this.getCollection<T>(collection);
    return items[0];
  }

  async create<T extends BaseEntity>(collection: string, item: Omit<T, keyof BaseEntity>): Promise<T> {
    const items = this.getCollection<T>(collection);
    // Cast item to T to satisfy withTimestamps signature and return type constraint
    const newItem = withTimestamps(item as unknown as T);
    this.setCollection(collection, [...items, newItem]);
    return newItem;
  }

  async update<T extends BaseEntity>(collection: string, id: string, updates: Partial<T>): Promise<T> {
    const items = this.getCollection<T>(collection);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');
    
    const updatedItem = { 
      ...items[index], 
      ...updates, 
      updated_date: new Date().toISOString() 
    };
    
    items[index] = updatedItem;
    this.setCollection(collection, items);
    return updatedItem;
  }

  async delete(collection: string, id: string): Promise<void> {
    const items = this.getCollection<BaseEntity>(collection);
    this.setCollection(collection, items.filter(i => i.id !== id));
  }
}

export const db = new DataService();
export const Collections = COLLECTIONS;
