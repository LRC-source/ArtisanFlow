import re

with open(r"components\UI.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Define the old LockedNode component based on the previous output
old_lockednode_pattern = re.compile(r'export const LockedNode:.*?<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none z-10 \r?\nrounded-\[2rem\] border border-white/5"></div>\r?\n\r?\n      </div>\r?\n    \);\r?\n  };', re.DOTALL)

# In case it doesn't match perfectly, let's just find `export const LockedNode:` and end at `};` before `export const VaultBanner:`
start_idx = content.find('export const LockedNode:')
end_idx = content.find('export const VaultBanner:')

if start_idx != -1 and end_idx != -1:
    old_lockednode = content[start_idx:end_idx]
    
    new_lockednode = """export const LockedNode: React.FC<{ children: React.ReactNode; isLocked?: boolean; requiredTier: string; onUpgrade?: () => void; featureKey?: string }> = ({ children, isLocked, requiredTier, onUpgrade, featureKey }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // If featureKey is provided, use the global TierContext gate
  const gate = featureKey ? useFeatureGate(featureKey) : { isLocked: !!isLocked, isTierLoading: false };
  const effectiveIsLocked = featureKey ? gate.isLocked : !!isLocked;

  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/settings/subscription', { state: { from: location.pathname } });
    }
  };

  if (gate.isTierLoading) return <div className="flex items-center justify-center p-6 sm:p-20"><Loader2 className="animate-spin text-[#C5A059]" size={32} /></div>;
  if (!effectiveIsLocked) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-[2rem] group" onClick={handleUpgradeClick}>
      <div className="pointer-events-none select-none transition-all duration-700 relative z-0">
        {children}
      </div>
      
      {/* Click Interceptor Overlay: Sits invisibly on top of the UI. When clicked, it triggers the Upgrade flow. */}
      <div className="absolute inset-0 z-20 cursor-pointer" title={`Upgrade to ${requiredTier} to unlock`}></div>
      
      {/* Subtle locked styling (optional, just to indicate it's locked without blurring) */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-10 rounded-[2rem] border border-white/5"></div>
    </div>
  );
};

"""
    content = content[:start_idx] + new_lockednode + content[end_idx:]
    
    with open(r"components\UI.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    
    print("UI.tsx LockedNode fully replaced.")
else:
    print("Could not find start or end index.")
