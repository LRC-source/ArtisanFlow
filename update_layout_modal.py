import re

with open(r"components\Layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    '''import { LRCLogo } from './UI';''',
    '''import { LRCLogo, Modal } from './UI';'''
)

# 2. Add useArtisanData hooks
content = content.replace(
    '''const { businessProfile, userTier, logout, inventory, orders, getMarginMetrics, startTutorial } = useArtisanData();''',
    '''const { businessProfile, userTier, logout, inventory, orders, getMarginMetrics, startTutorial, upgradePrompt, setUpgradePrompt } = useArtisanData();'''
)

# 3. Add modal to end of Layout
old_footer = '''      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
}'''

new_footer = '''      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      {upgradePrompt && (
        <Modal isOpen={!!upgradePrompt} onClose={() => setUpgradePrompt(null)} title="Tier Limit Reached">
          <div className="space-y-6">
             <p className="text-white/80">
                You have reached the usage limit for <strong className="text-white">{upgradePrompt.feature}</strong> or it is a gated feature. 
             </p>
             <p className="text-white/80">
                Please upgrade your account to <strong className="text-[#C5A059]">{upgradePrompt.requiredTier}</strong> to unlock this capability.
             </p>
             <div className="flex gap-4 mt-8">
               <button onClick={() => setUpgradePrompt(null)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-colors">
                 Maybe Later
               </button>
               <button onClick={() => { setUpgradePrompt(null); navigate('/settings/subscription'); }} className="flex-1 bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] text-white py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity">
                 Upgrade Tier
               </button>
             </div>
          </div>
        </Modal>
      )}
    </div>
  );
}'''
content = content.replace(old_footer, new_footer)

with open(r"components\Layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Layout updated with upgrade prompt.")
