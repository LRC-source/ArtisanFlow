import re

with open(r"components\Marketing\SocialMediaCreator.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make sure useArtisanData is imported and checkFeatureGate is destructured
if "checkFeatureGate" not in content:
    content = content.replace(
        '''const { inventory, addMarketingPost } = useArtisanData();''',
        '''const { inventory, addMarketingPost, checkFeatureGate } = useArtisanData();'''
    )
    
    # Add the check inside handleGenerate
    old_handle = '''    const handleGenerate = async () => {
        if (!topic && !selectedProduct) return toast.error("Please enter a topic or select a product.");
        setIsGenerating(true);'''
        
    new_handle = '''    const handleGenerate = async () => {
        if (!checkFeatureGate('mktg_ai_actions')) return;
        if (!topic && !selectedProduct) return toast.error("Please enter a topic or select a product.");
        setIsGenerating(true);'''
    
    content = content.replace(old_handle, new_handle)

with open(r"components\Marketing\SocialMediaCreator.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("SocialMediaCreator updated.")
