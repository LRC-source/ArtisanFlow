import re

with open(r"components\DataContext.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add to DataContextType
old_interface = '''  submitVIPWaitlist: (data: { fullName: string; email: string; businessType: string }) => Promise<boolean>;
}'''

new_interface = '''  submitVIPWaitlist: (data: { fullName: string; email: string; businessType: string }) => Promise<boolean>;
  upgradePrompt: { feature: string; requiredTier: UserTier } | null;
  setUpgradePrompt: (prompt: { feature: string; requiredTier: UserTier } | null) => void;
  checkFeatureGate: (feature: string) => boolean;
}'''
content = content.replace(old_interface, new_interface)

# 2. Add state and checkFeatureGate in Provider
old_provider_state = '''  const [onboardingState, setOnboardingState] = useState<Record<string, boolean>>(() => {'''

new_provider_state = '''  const [upgradePrompt, setUpgradePrompt] = useState<{ feature: string; requiredTier: UserTier } | null>(null);

  const checkFeatureGate = (action: string): boolean => {
    const limits: Record<UserTier, any> = {
      'Free Audit': {
        vault_recipes: 5,
        mktg_ai_actions: 5,
        mktg_avatar: false,
        logistics_forecast: false,
        dash_diagnostic: false,
        profit_guard: false
      },
      'Artisan Flow Basic': {
        vault_recipes: Infinity,
        mktg_ai_actions: 100,
        mktg_avatar: false,
        logistics_forecast: false,
        dash_diagnostic: false,
        profit_guard: false
      },
      'Margin Protection Pro': {
        vault_recipes: Infinity,
        mktg_ai_actions: Infinity,
        mktg_avatar: true,
        logistics_forecast: true,
        dash_diagnostic: true,
        profit_guard: true
      }
    };
    
    const limit = limits[userTier]?.[action];
    
    if (typeof limit === 'boolean') {
      if (!limit) {
        setUpgradePrompt({ feature: action, requiredTier: 'Margin Protection Pro' });
        return false;
      }
      return true;
    }
    
    if (action === 'vault_recipes' && recipes.length >= limit) {
      setUpgradePrompt({ feature: 'Recipe Builder Limit', requiredTier: 'Artisan Flow Basic' });
      return false;
    }
    
    return true;
  };

  const [onboardingState, setOnboardingState] = useState<Record<string, boolean>>(() => {'''
content = content.replace(old_provider_state, new_provider_state)

# 3. Add to provider value
old_provider_value = '''        submitVIPWaitlist
      }}>
        {children}'''

new_provider_value = '''        submitVIPWaitlist,
        upgradePrompt, setUpgradePrompt, checkFeatureGate
      }}>
        {children}'''
content = content.replace(old_provider_value, new_provider_value)

# 4. Update addRecipe to use checkFeatureGate
old_add_recipe = '''  const addRecipe = async (recipe: any) => {
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
      
      const newRecipe = { ...recipe, id: `r-${Date.now()}` };'''

new_add_recipe = '''  const addRecipe = async (recipe: any) => {
    try {
      if (!checkFeatureGate('vault_recipes')) {
        return; // Modal will be shown by checkFeatureGate
      }
      
      const res = await fetch('/api/gating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: userTier.toLowerCase().replace(/ /g, '-'), action: 'vault_recipes', currentCount: recipes.length })
      });
      const gate = await res.json();
      if (!gate.allowed) {
        setUpgradePrompt({ feature: 'Recipe Builder Limit', requiredTier: 'Artisan Flow Basic' });
        return;
      }
      
      const newRecipe = { ...recipe, id: `r-${Date.now()}` };'''
content = content.replace(old_add_recipe, new_add_recipe)

with open(r"components\DataContext.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("DataContext.tsx updated for gating.")
