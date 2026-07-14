
import { db, Collections } from './dataLayer';
import { InventoryItem, Recipe, Supplier, ProductionOrder } from '../types';
import { generateMarketingStrategy } from './geminiService';

export const Api = {
  // Inventory
  getInventory: () => db.list<InventoryItem>(Collections.INVENTORY),
  getInventoryItem: (id: string) => db.get<InventoryItem>(Collections.INVENTORY, id),
  saveInventoryItem: (item: Omit<InventoryItem, 'id' | 'created_date' | 'updated_date' | 'created_by'>) => 
    db.create<InventoryItem>(Collections.INVENTORY, item),
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => 
    db.update<InventoryItem>(Collections.INVENTORY, id, item),
  
  // Suppliers
  getSuppliers: () => db.list<Supplier>('suppliers'), // Assuming 'suppliers' collection exists or mapped
  saveSupplier: (supplier: any) => db.create('suppliers', supplier),
  deleteSupplier: (id: string) => db.delete('suppliers', id),

  // Recipes
  getRecipes: () => db.list<Recipe>(Collections.RECIPES),
  saveRecipe: (recipe: any) => db.create<Recipe>(Collections.RECIPES, recipe),
  
  // Production
  getProductionSchedule: () => db.list<ProductionOrder>(Collections.PRODUCTION),
  
  // AI
  generateMarketingPlan: async (pulseData: string, tier: string) => {
    return await generateMarketingStrategy(pulseData, tier);
  }
};
