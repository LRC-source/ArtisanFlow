/**
 * Centralized Mock Data & Architecture for Artisan Flow
 * Module 1: Forecasting (/forecasting)
 * Module 2: Trapped Cash Audit (/trapped-cash-audit & /qc)
 */

export interface ForecastItem {
  id: string;
  name: string;
  sku: string;
  category: 'Raw Materials' | 'Finished Goods' | 'Botanicals' | 'Packaging';
  currentStock: number;
  unit: string;
  unitCost: number;
  dailyBurnRate: number;
  leadTimeDays: number;
  supplier: string;
  forecastedDemand: number;
  dir: number;
  reorderDate: string;
  reorderCost: number;
  status: 'Stocked' | 'Reorder Soon' | 'Critical Stockout Risk';
}

export interface TrappedCashAsset {
  id: string;
  name: string;
  skuCode?: string;
  category: 'Raw Material' | 'Finished Goods' | 'B2B Invoice' | 'Supplier Terms';
  amountTrapped: number;
  daysIdle: number;
  monthlyCarryingCost: number;
  recommendedAction: string;
  potentialCashRecoverable: number;
  clientOrSupplier?: string;
  actionType: 'clearance' | 'batch' | 'invoice' | 'terms';
}

export const INITIAL_FORECAST_DATA: ForecastItem[] = [
  {
    id: 'SKU-01',
    name: 'Organic French Lavender Essential Oil',
    sku: 'EO-LAV-500',
    category: 'Raw Materials',
    currentStock: 45,
    unit: 'oz',
    unitCost: 18.50,
    dailyBurnRate: 1.8,
    leadTimeDays: 14,
    supplier: 'Provence Botanicals Inc.',
    forecastedDemand: 162,
    dir: 25,
    reorderDate: 'Oct 04',
    reorderCost: 2164.50,
    status: 'Reorder Soon'
  },
  {
    id: 'SKU-02',
    name: 'Cold-Pressed Unrefined Shea Butter',
    sku: 'RM-SHEA-25K',
    category: 'Raw Materials',
    currentStock: 120,
    unit: 'lbs',
    unitCost: 4.20,
    dailyBurnRate: 4.5,
    leadTimeDays: 10,
    supplier: 'Ghana Soapcraft Co-op',
    forecastedDemand: 405,
    dir: 27,
    reorderDate: 'Oct 08',
    reorderCost: 1197.00,
    status: 'Stocked'
  },
  {
    id: 'SKU-03',
    name: 'Calming Chamomile Herbal Body Salve',
    sku: 'FG-SLV-04',
    category: 'Finished Goods',
    currentStock: 28,
    unit: 'jars',
    unitCost: 6.80,
    dailyBurnRate: 3.2,
    leadTimeDays: 7,
    supplier: 'In-House Batch Lab',
    forecastedDemand: 288,
    dir: 9,
    reorderDate: 'Immediate',
    reorderCost: 1768.00,
    status: 'Critical Stockout Risk'
  },
  {
    id: 'SKU-04',
    name: 'Amber Glass Heavy Jars (4oz w/ Lids)',
    sku: 'PKG-J4A-100',
    category: 'Packaging',
    currentStock: 180,
    unit: 'units',
    unitCost: 0.95,
    dailyBurnRate: 12.0,
    leadTimeDays: 21,
    supplier: 'Pacific Glassworks',
    forecastedDemand: 1080,
    dir: 15,
    reorderDate: 'Immediate',
    reorderCost: 855.00,
    status: 'Critical Stockout Risk'
  },
  {
    id: 'SKU-05',
    name: 'Wildcrafted Butterfly Pea Flower Extract',
    sku: 'BOT-BPF-1K',
    category: 'Botanicals',
    currentStock: 12,
    unit: 'kg',
    unitCost: 42.00,
    dailyBurnRate: 0.7,
    leadTimeDays: 30,
    supplier: 'Chiang Mai Extracts Ltd.',
    forecastedDemand: 63,
    dir: 17,
    reorderDate: 'Oct 02',
    reorderCost: 2142.00,
    status: 'Reorder Soon'
  },
  {
    id: 'SKU-06',
    name: 'Artisan Honey & Oat Exfoliating Soap',
    sku: 'FG-SOP-01',
    category: 'Finished Goods',
    currentStock: 140,
    unit: 'bars',
    unitCost: 1.85,
    dailyBurnRate: 6.5,
    leadTimeDays: 5,
    supplier: 'In-House Soapery',
    forecastedDemand: 585,
    dir: 22,
    reorderDate: 'Oct 12',
    reorderCost: 823.25,
    status: 'Stocked'
  },
  {
    id: 'SKU-07',
    name: 'Pure Golden Jojoba Carrier Oil',
    sku: 'RM-JOJ-05G',
    category: 'Raw Materials',
    currentStock: 18,
    unit: 'gal',
    unitCost: 65.00,
    dailyBurnRate: 0.9,
    leadTimeDays: 12,
    supplier: 'Sonora Organics',
    forecastedDemand: 81,
    dir: 20,
    reorderDate: 'Oct 05',
    reorderCost: 4095.00,
    status: 'Stocked'
  },
  {
    id: 'SKU-08',
    name: 'Biodegradable Craft Soap Boxes (Custom)',
    sku: 'PKG-BOX-S1',
    category: 'Packaging',
    currentStock: 350,
    unit: 'boxes',
    unitCost: 0.45,
    dailyBurnRate: 18.0,
    leadTimeDays: 14,
    supplier: 'EcoPack Print Solutions',
    forecastedDemand: 1620,
    dir: 19,
    reorderDate: 'Oct 06',
    reorderCost: 571.50,
    status: 'Reorder Soon'
  }
];

export const INITIAL_TRAPPED_CASH_DATA: TrappedCashAsset[] = [
  {
    id: 'TC-01',
    name: 'Butterfly Pea Flower Extract (20kg Bulk)',
    skuCode: 'BOT-BPF-20K',
    category: 'Raw Material',
    amountTrapped: 9850.00,
    daysIdle: 142,
    monthlyCarryingCost: 145.00,
    recommendedAction: 'Schedule Botanical Salve Production Batch',
    potentialCashRecoverable: 8860.00,
    clientOrSupplier: 'Chiang Mai Extracts Ltd.',
    actionType: 'batch'
  },
  {
    id: 'TC-02',
    name: 'Holiday Edition Botanical Soap Gift Sets (150 Units)',
    skuCode: 'FG-HOL-SET',
    category: 'Finished Goods',
    amountTrapped: 14250.00,
    daysIdle: 98,
    monthlyCarryingCost: 210.00,
    recommendedAction: 'Launch 25% Off Clearance Bundle Campaign',
    potentialCashRecoverable: 11400.00,
    clientOrSupplier: 'Shopify Store Front',
    actionType: 'clearance'
  },
  {
    id: 'TC-03',
    name: 'Wholesale Invoice #1042 - Apothecary Goods Co.',
    skuCode: 'INV-1042-AG',
    category: 'B2B Invoice',
    amountTrapped: 8600.00,
    daysIdle: 45,
    monthlyCarryingCost: 86.00,
    recommendedAction: 'Send Automated 1-Click Payment Reminder',
    potentialCashRecoverable: 8600.00,
    clientOrSupplier: 'Apothecary Goods Co.',
    actionType: 'invoice'
  },
  {
    id: 'TC-04',
    name: 'Prepaid Shea Butter Vendor Deposit (Net 0 Terms)',
    skuCode: 'AP-SHEA-V1',
    category: 'Supplier Terms',
    amountTrapped: 5800.00,
    daysIdle: 60,
    monthlyCarryingCost: 40.00,
    recommendedAction: 'Negotiate Net-45 Vendor Payment Terms',
    potentialCashRecoverable: 5800.00,
    clientOrSupplier: 'Ghana Soapcraft Co-op',
    actionType: 'terms'
  },
  {
    id: 'TC-05',
    name: 'Overstocked Amber Glass Bottles (500ml - 1,200 Units)',
    skuCode: 'PKG-AMB-500',
    category: 'Raw Material',
    amountTrapped: 3450.00,
    daysIdle: 115,
    monthlyCarryingCost: 65.00,
    recommendedAction: 'Schedule Lotion Formulation Batch',
    potentialCashRecoverable: 3100.00,
    clientOrSupplier: 'Pacific Glassworks',
    actionType: 'batch'
  },
  {
    id: 'TC-06',
    name: 'B2B Wholesale Order #1088 - Herbal Wellness Collective',
    skuCode: 'INV-1088-HW',
    category: 'B2B Invoice',
    amountTrapped: 4200.00,
    daysIdle: 38,
    monthlyCarryingCost: 42.00,
    recommendedAction: 'Send Follow-up Email with Payment Portal Link',
    potentialCashRecoverable: 4200.00,
    clientOrSupplier: 'Herbal Wellness Collective',
    actionType: 'invoice'
  }
];
