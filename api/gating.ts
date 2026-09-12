import { VercelRequest, VercelResponse } from '@vercel/node';

// Database Schema Mock for Serverless Environment
const Tier_Permissions_Matrix = {
  'free-audit': {
    vault_recipes: 5,
    mktg_ai_actions: 5,
    mktg_avatar: false,
    logistics_forecast: false,
    dash_diagnostic: false,
    profit_guard: false,
    ADD_INVENTORY: 50
  },
  'artisan-flow-basic': {
    vault_recipes: Infinity,
    mktg_ai_actions: 100,
    mktg_avatar: false,
    logistics_forecast: false,
    dash_diagnostic: false,
    profit_guard: false,
    ADD_INVENTORY: Infinity
  },
  'pro-artisan': {
    vault_recipes: Infinity,
    mktg_ai_actions: Infinity,
    mktg_avatar: true,
    logistics_forecast: true,
    dash_diagnostic: true,
    profit_guard: true,
    ADD_INVENTORY: Infinity
  },
  'master-artisan': {
    vault_recipes: Infinity,
    mktg_ai_actions: Infinity,
    mktg_avatar: true,
    logistics_forecast: true,
    dash_diagnostic: true,
    profit_guard: true,
    ADD_INVENTORY: Infinity
  },
  'margin-protection-pro': {
    vault_recipes: Infinity,
    mktg_ai_actions: Infinity,
    mktg_avatar: true,
    logistics_forecast: true,
    dash_diagnostic: true,
    profit_guard: true,
    ADD_INVENTORY: Infinity
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // We extract 'userId' for Usage_Counters tracking if connected to a live DB
  const { tier, action, currentCount, userId } = req.body;

  if (!tier || !action) {
    return res.status(400).json({ error: 'Missing required fields: tier, action' });
  }

  // Normalize tier name to match matrix
  const normalizedTier = tier.toLowerCase().replace(/ /g, '-');
  const limits = Tier_Permissions_Matrix[normalizedTier as keyof typeof Tier_Permissions_Matrix] || Tier_Permissions_Matrix['free-audit'];
  
  const limit = limits[action as keyof typeof limits];

  if (limit === undefined) {
    return res.status(400).json({ error: `Invalid action type or gated feature: ${action}` });
  }

  // Boolean features (Hard Gates)
  if (typeof limit === 'boolean') {
    if (!limit) {
      return res.status(403).json({ allowed: false, isFeatureGated: true, limit: 0, message: `Feature ${action} is locked for ${tier} tier.` });
    }
    return res.status(200).json({ allowed: true, isFeatureGated: false, limit: null });
  }

  // Quota features (Usage Counters)
  if (currentCount === undefined) {
    return res.status(400).json({ error: 'Missing currentCount for quota-based action' });
  }

  if (currentCount >= limit) {
    return res.status(403).json({ allowed: false, isFeatureGated: false, limit });
  }

  // If using live DB, here is where we would increment Usage_Counters table for this userId & action

  return res.status(200).json({ allowed: true, isFeatureGated: false, limit });
}
