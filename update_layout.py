with open(r'c:\Users\lacar\Desktop\ArtisanFlow\components\Layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

badge_logic = """
  const renderTierBadge = () => {
    if (userTier === 'Free Trial' && businessProfile.trialEndsAt) {
      const daysLeft = Math.ceil((new Date(businessProfile.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return `FREE TRIAL (${Math.max(0, daysLeft)} days left)`;
    }
    return userTier === 'Free Trial' ? 'FREE TRIAL' : (userTier || 'Basic Artisan');
  };
"""

content = content.replace("  const [isSupportOpen, setIsSupportOpen] = useState(false);", "  const [isSupportOpen, setIsSupportOpen] = useState(false);\n" + badge_logic)

content = content.replace('<span className="user-role truncate">Master Artisan</span>', '<span className="user-role truncate font-bold text-[#E2C792] text-[10px] tracking-widest">{renderTierBadge()}</span>')

with open(r'c:\Users\lacar\Desktop\ArtisanFlow\components\Layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Layout.tsx")
