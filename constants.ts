import { InventoryItem, InventoryType, ProductionOrder, Supplier, ContentPost, MembershipTier, ProductionStatus } from './types';

export const COLORS = {
  background: '#0A0A0A',
  gold: '#FFD700',
  goldHover: '#E5C100',
  purple: '#8A2BE2',
  purpleDark: '#4B0082',
  text: '#FFFFFF',
  textMuted: '#A0A0A0',
  surface: '#111111',
  border: '#333333'
};

const BASE_ENTITY = {
  created_date: new Date().toISOString(),
  updated_date: new Date().toISOString(),
  created_by: 'system'
};

export const MOCK_INVENTORY: InventoryItem[] = [
  { ...BASE_ENTITY, id: '1', name: 'Lavender Essential Oil', sku: 'RM-LAV-001', type: InventoryType.RAW_MATERIAL, quantityOnHand: 450, reorderPoint: 500, unitCost: 12.50, supplierId: 's1' },
  { ...BASE_ENTITY, id: '2', name: 'Shea Butter (Raw)', sku: 'RM-SHE-002', type: InventoryType.RAW_MATERIAL, quantityOnHand: 2000, reorderPoint: 1000, unitCost: 8.00, supplierId: 's2' },
  { ...BASE_ENTITY, id: '3', name: 'Gold Mica Powder', sku: 'RM-MIC-003', type: InventoryType.RAW_MATERIAL, quantityOnHand: 150, reorderPoint: 200, unitCost: 25.00, supplierId: 's3' },
  { ...BASE_ENTITY, id: '4', name: 'Luxury Bath Bomb - Calm', sku: 'PR-BB-CLM', type: InventoryType.PRODUCT, quantityOnHand: 45, reorderPoint: 50, unitCost: 3.50 },
  { ...BASE_ENTITY, id: '5', name: 'Midnight Serum', sku: 'PR-SRM-MID', type: InventoryType.PRODUCT, quantityOnHand: 12, reorderPoint: 20, unitCost: 18.00 },
];

export const MOCK_PRODUCTION: ProductionOrder[] = [
  { ...BASE_ENTITY, id: 'po1', orderNumber: 'PO-001', recipeId: 'r1', recipeName: 'Midnight Serum Batch', status: ProductionStatus.IN_PROGRESS, quantity: 100, dueDate: '2023-11-05' },
  { ...BASE_ENTITY, id: 'po2', orderNumber: 'PO-002', recipeId: 'r2', recipeName: 'Calm Bath Bombs', status: ProductionStatus.PLANNED, quantity: 500, dueDate: '2023-11-10' },
  { ...BASE_ENTITY, id: 'po3', orderNumber: 'PO-003', recipeId: 'r3', recipeName: 'Holiday Gift Set', status: ProductionStatus.PLANNED, quantity: 50, dueDate: '2023-11-15' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { ...BASE_ENTITY, id: 's1', name: 'Essence Org', email: 'orders@essence.org', leadTimeDays: 7 },
  { ...BASE_ENTITY, id: 's2', name: 'Global Butters', email: 'sales@globalbutters.com', leadTimeDays: 14 },
];

export const MOCK_POSTS: ContentPost[] = [
  { ...BASE_ENTITY, id: 'cp1', platform: 'Instagram', topic: 'Behind the Scenes: Serum Pouring', scheduledDate: '2023-11-02', status: 'PUBLISHED', content: '', aiGenerated: false },
  { ...BASE_ENTITY, id: 'cp2', platform: 'TikTok', topic: 'ASMR Packaging', scheduledDate: '2023-11-04', status: 'DRAFT', content: '', aiGenerated: true },
];

export const DEFAULT_TIER = MembershipTier.FLOW_ARCHITECT;