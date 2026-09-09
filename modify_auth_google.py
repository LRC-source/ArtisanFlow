import re

with open(r"components\Auth.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_google_auth = '''          if (selectedTier === 'Free Audit') {
            try {
              await signUp({ email: user.email, name: user.displayName || 'New Artisan Business', password: '', tier: 'Free Audit', status: 'Active' });
            } catch (e) {
              console.error(e);
            }
          } else if (selectedTier) {
            setEmail(user.email); // Pre-fill the email state for the payment gateway
            setView('payment');
          } else {
            setEmail(user.email);
            setView('tiers');
          }'''

new_google_auth = '''          if (selectedTier === 'Free Audit') {
            try {
              await signUp({ email: user.email, name: user.displayName || 'New Artisan Business', password: '', tier: 'Free Audit', status: 'Active' });
            } catch (e) {
              console.error(e);
            }
          } else if (selectedTier) {
            if (hasPaid) {
              try {
                await signUp({ email: user.email, name: user.displayName || 'New Artisan Business', password: '', tier: selectedTier, status: 'Active' });
              } catch (e) {
                console.error(e);
              }
            } else {
              setEmail(user.email); // Pre-fill the email state for the payment gateway
              setView('payment');
            }
          } else {
            setEmail(user.email);
            setView('tiers');
          }'''

content = content.replace(old_google_auth, new_google_auth)

with open(r"components\Auth.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Auth.tsx google auth updated.")
