import re

with open(r"components\Layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add route interceptor to Layout
old_effect = '''    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      if (businessProfile.status === 'Past Due' && location.pathname !== '/settings/subscription') {
         // handle warning or toast
      }
    }, [businessProfile.status, location.pathname]);'''

new_effect = '''    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      const gateMap: Record<string, string> = {
        '/marketing/avatar': 'mktg_avatar',
        '/forecasting': 'logistics_forecast',
        '/business-pulse-check': 'dash_diagnostic',
        '/business-pulse': 'dash_diagnostic',
        '/budget-guard': 'profit_guard'
      };
      
      const feature = gateMap[location.pathname];
      if (feature) {
        if (!checkFeatureGate(feature)) {
          navigate('/dashboard', { replace: true });
        }
      }
    }, [location.pathname, userTier]);

    useEffect(() => {
      if (businessProfile.status === 'Past Due' && location.pathname !== '/settings/subscription') {
         // handle warning or toast
      }
    }, [businessProfile.status, location.pathname]);'''

# But wait, does old_effect exactly match? Let's verify by just inserting it after `const [searchQuery, setSearchQuery] = useState('');`
content = content.replace(
    '''const [searchQuery, setSearchQuery] = useState('');''',
    '''const [searchQuery, setSearchQuery] = useState('');\n\n    useEffect(() => {\n      const gateMap: Record<string, string> = {\n        '/marketing/avatar': 'mktg_avatar',\n        '/forecasting': 'logistics_forecast',\n        '/business-pulse-check': 'dash_diagnostic',\n        '/business-pulse': 'dash_diagnostic',\n        '/budget-guard': 'profit_guard'\n      };\n      \n      const feature = gateMap[location.pathname];\n      if (feature) {\n        // Using settimeout to avoid state update during render if they click directly\n        setTimeout(() => {\n           if (!checkFeatureGate(feature)) {\n             navigate('/dashboard', { replace: true });\n           }\n        }, 0);\n      }\n    }, [location.pathname, userTier]);'''
)

with open(r"components\Layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Layout.tsx route interceptor added.")
