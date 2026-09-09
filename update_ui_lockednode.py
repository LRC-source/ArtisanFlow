import re

with open(r"components\UI.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove the blur and opacity from the wrapper, keeping pointer-events-none
content = content.replace(
    '''<div className="filter blur-sm opacity-30 pointer-events-none select-none transition-all duration-700">''',
    '''<div className="pointer-events-none select-none transition-all duration-700 relative z-0">'''
)

# 2. Remove the heavy black/40 backdrop-blur-xl overlay from LockedNode so they can clearly see the UI.
# Wait, if we remove the overlay, we should probably remove the entire second <div> that shows "Vault Node Locked". 
# Because Layout.tsx is already throwing our new global Modal! 
# Let's replace the whole overlay div with just a subtle gradient or nothing, since the Modal handles the prompt.

old_overlay = '''      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center p-4 sm:p-8 text-center animate-in fade-in duration-700 shadow-[inset_0_0_50px_rgba(106,44,145,0.2)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6A2C91_0%,transparent_50%)] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#C5A059_0%,transparent_50%)] opacity-20 pointer-events-none"></div>
        <GlassHaloIcon icon={Lock} color="magenta" size="lg" className="mb-6 relative z-10" />
        <h4 className="text-2xl font-serif text-white tracking-tight mb-3 relative z-10">Vault Node Locked</h4>
        <p className="text-white/50 font-sans font-light text-sm mb-8 max-w-[240px] leading-relaxed relative z-10">This synaptic protocol requires a <span className="font-medium text-[#6A2C91]">{requiredTier}</span> authorization.</p>
        <Button variant="primary" onClick={handleUpgradeClick} className="h-12 px-10 relative z-10">
          <Crown size={16} className="mr-2 text-[#C5A059]" strokeWidth={1.5} /> UPGRADE ACCESS
        </Button>
      </div>'''

new_overlay = '''      {/* Lock overlay removed to provide a clear 'window into value'. The global Upgrade Modal now handles the prompt. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none z-10 rounded-[2rem] border border-white/5"></div>
'''

content = content.replace(old_overlay, new_overlay)

with open(r"components\UI.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("UI.tsx LockedNode updated to provide window into value.")
