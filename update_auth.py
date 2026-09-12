with open(r'c:\Users\lacar\Desktop\ArtisanFlow\components\Auth.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useNavigate
content = content.replace("import { useLocation } from 'react-router-dom';", "import { useLocation, useNavigate } from 'react-router-dom';")

# Add navigate = useNavigate()
content = content.replace("const [email, setEmail] = useState('');", "const navigate = useNavigate();\n  const [email, setEmail] = useState('');")

# Add navigate('/dashboard') to Free Trial paths
content = content.replace(
"""      if (selectedTier === 'Free Trial') {
        try {
          await signUp({ email: trimmedEmail, password: trimmedPass, tier: 'Free Trial', status: 'Active' });
        } catch (e: any) {""",
"""      if (selectedTier === 'Free Trial') {
        try {
          await signUp({ email: trimmedEmail, password: trimmedPass, tier: 'Free Trial', status: 'Active' });
          navigate('/dashboard');
        } catch (e: any) {"""
)

content = content.replace(
"""          if (selectedTier === 'Free Trial') {
            try {
              await signUp({ email: user.email, name: user.displayName || 'New Artisan Business', password: '', tier: 'Free Trial', status: 'Active' });
            } catch (e) {""",
"""          if (selectedTier === 'Free Trial') {
            try {
              await signUp({ email: user.email, name: user.displayName || 'New Artisan Business', password: '', tier: 'Free Trial', status: 'Active' });
              navigate('/dashboard');
            } catch (e) {"""
)

with open(r'c:\Users\lacar\Desktop\ArtisanFlow\components\Auth.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Auth.tsx")
