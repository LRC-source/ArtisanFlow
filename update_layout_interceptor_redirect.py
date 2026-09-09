import re

with open(r"components\Layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the navigate('/dashboard') with nothing, just setting the upgrade prompt and letting them stay on the page to see the background.
old_effect = '''          setTimeout(() => {
             if (!checkFeatureGate(feature)) {
               navigate('/dashboard', { replace: true });
             }
          }, 0);'''

new_effect = '''          setTimeout(() => {
             // We call checkFeatureGate just to trigger the modal.
             // We do NOT navigate away, allowing them to see the locked UI ("window into value")
             checkFeatureGate(feature);
          }, 0);'''

content = content.replace(old_effect, new_effect)

with open(r"components\Layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Layout.tsx updated to remove redirect.")
