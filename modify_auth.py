import re

with open(r"components\Auth.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add hasPaid state
content = content.replace(
    '''const [isNewUser, setIsNewUser] = useState(!!activeTier);''',
    '''const [isNewUser, setIsNewUser] = useState(!!activeTier);
  const [hasPaid, setHasPaid] = useState(false);'''
)

# 2. Update handleLogin
old_handle_login = '''      } else if (selectedTier) {
        setView('payment');
      } else {
        setView('tiers');
      }'''

new_handle_login = '''      } else if (selectedTier) {
        if (hasPaid) {
            try {
              await signUp({ email, password: pass, tier: selectedTier, status: 'Active' });
            } catch (e) {
              toast.error("Account creation failed.");
            }
        } else {
            setView('payment');
        }
      } else {
        setView('tiers');
      }'''
content = content.replace(old_handle_login, new_handle_login)

# 3. Update PaymentGateway onSuccess inside AuthGateway
old_on_success = '''             onSuccess={async () => {
               try {
                 await signUp({ email, password: pass, tier: selectedTier, status: 'Active' });
               } catch (e) {
                 alert("Account creation failed. You may already have an account with this email.");
               }
             }}'''

new_on_success = '''             onSuccess={() => {
                 setHasPaid(true);
                 setView('signup');
             }}'''
content = content.replace(old_on_success, new_on_success)

with open(r"components\Auth.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Auth.tsx updated.")
