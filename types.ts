
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum MembershipTier {
  FLOW_STARTER = 'FLOW_STARTER',
  FLOW_BUILDER = 'FLOW_BUILDER',
  FLOW_ARCHITECT = 'FLOW_ARCHITECT',
  MARGIN_PROTECTION_MASTER = 'MARGIN_PROTECTION_MASTER',
}

export enum InventoryType {
  RAW_MATERIAL = 'RAW_MATERIAL',
  PRODUCT = 'PRODUCT',
  COMPONENT = 'COMPONENT',
  PACKAGING = 'PACKAGING'
}

export enum ProductionStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  QUALITY_CHECK = 'QUALITY_CHECK',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum IntegrationPlatform {
  SHOPIFY = 'SHOPIFY',
  WOOCOMMERCE = 'WOOCOMMERCE',
  ETSY = 'ETSY',
  SQUARE = 'SQUARE'
}

// Base Entity Interface containing system fields
export interface BaseEntity {
  id: string;
  created_date: string;
  updated_date: string;
  created_by: string;
}

export interface UserProfile extends BaseEntity {
  fullName: string;
  email: string;
  role: UserRole;
  notificationsEnabled: boolean;
  avatarUrl?: string;
}

export interface BusinessProfile extends BaseEntity {
  name: string;
  tier: MembershipTier;
  currency: string;
  timezone: string;
  logoUrl?: string;
  goals?: string;
  contactEmail?: string;
  settings: Record<string, any>;
}

export interface PortalConfig extends BaseEntity {
  brandColor: string;
  welcomeMessage: string;
  minOrderValue: number;
  isActive: boolean;
}

export interface InventoryItem extends BaseEntity {
  name: string;
  sku: string;
  type: InventoryType;
  quantityOnHand: number;
  reorderPoint: number;
  unitCost: number;
  supplierId?: string;
  locationId?: string;
  description?: string;
  imageUrl?: string;
}

export interface RecipeIngredient {
  inventoryItemId: string;
  quantity: number; // Amount needed per batch
  unit: string;
}

export interface Recipe extends BaseEntity {
  name: string;
  yieldQuantity: number;
  yieldUnit: string;
  ingredients: RecipeIngredient[];
  laborCostPerBatch: number;
  instructions: string;
}

export interface ProductionOrder extends BaseEntity {
  orderNumber: string;
  recipeId: string;
  recipeName: string; // Denormalized for easy display
  status: ProductionStatus;
  quantity: number;
  dueDate: string;
  startDate?: string;
  completedDate?: string;
  assignedTo?: string;
}

export interface StockMovement extends BaseEntity {
  inventoryItemId: string;
  type: 'PURCHASE' | 'SALE' | 'PRODUCTION_USE' | 'PRODUCTION_YIELD' | 'ADJUSTMENT';
  quantity: number; // Negative for usage/sales, Positive for purchase/yield
  referenceId?: string; // ID of PO, Sales Order, or Production Order
  notes?: string;
}

export interface Supplier extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  leadTimeDays: number;
  paymentTerms?: string;
}

export interface SupplierCommunication extends BaseEntity {
  supplierId: string;
  type: 'EMAIL' | 'NOTE' | 'PO';
  content: string;
  date: string;
}

export interface QualityCheck extends BaseEntity {
  productionOrderId: string;
  passed: boolean;
  checkedBy: string;
  notes: string;
  metrics: Record<string, number>; // e.g., { pH: 7.2, viscosity: 400 }
}

export interface ContentPost extends BaseEntity {
  platform: 'Instagram' | 'TikTok' | 'Pinterest' | 'Email' | 'Blog';
  topic: string;
  scheduledDate: string;
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED';
  content: string;
  mediaUrl?: string;
  aiGenerated: boolean;
}

export interface IntegrationConfig extends BaseEntity {
  platform: IntegrationPlatform;
  apiKey: string; // Encrypted in backend
  apiSecret?: string; // Encrypted in backend
  storeUrl?: string;
  lastSync?: string;
  status: 'ACTIVE' | 'ERROR' | 'DISCONNECTED';
}

export interface Location extends BaseEntity {
  name: string;
  address?: string;
  type: 'WAREHOUSE' | 'RETAIL' | 'HOME_STUDIO';
}

export interface AIAvatar extends BaseEntity {
  name: string;
  voiceId: string;
  style: string;
  avatarUrl: string;
}
