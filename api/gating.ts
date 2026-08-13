import { VercelRequest, VercelResponse } from '@vercel/node';

const TIER_LIMITS = {
  free: {
    ADD_RECIPE: 5,
    ADD_INVENTORY: 50,
    ADD_CRM: 25,
  },
  basic: {
    ADD_RECIPE: Infinity,
    ADD_INVENTORY: 500,
    ADD_CRM: Infinity,
  },
  pro: {
    ADD_RECIPE: Infinity,
    ADD_INVENTORY: Infinity,
    ADD_CRM: Infinity,
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tier, action, currentCount } = req.body;

  if (!tier || !action || currentCount === undefined) {
    return res.status(400).json({ error: 'Missing required fields: tier, action, currentCount' });
  }

  const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.free;
  const limit = limits[action as keyof typeof limits];

  if (limit === undefined) {
    return res.status(400).json({ error: 'Invalid action type' });
  }

  if (currentCount >= limit) {
    return res.status(403).json({ allowed: false, limit });
  }

  return res.status(200).json({ allowed: true, limit });
}
