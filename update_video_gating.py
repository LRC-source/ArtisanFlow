import re

with open(r"components\Marketing\VideoCreator.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make sure useArtisanData is imported and checkFeatureGate is destructured
if "checkFeatureGate" not in content:
    content = content.replace(
        '''const { addMarketingPost } = useArtisanData();''',
        '''const { addMarketingPost, checkFeatureGate } = useArtisanData();'''
    )
    
    # Add the check inside handleGenerate
    old_handle = '''    const handleGenerate = async () => {
        if (!topic) return toast.error("Please enter a video topic.");
        setIsGenerating(true);'''
        
    new_handle = '''    const handleGenerate = async () => {
        if (!checkFeatureGate('mktg_ai_actions')) return;
        if (!topic) return toast.error("Please enter a video topic.");
        setIsGenerating(true);'''
    
    content = content.replace(old_handle, new_handle)

with open(r"components\Marketing\VideoCreator.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("VideoCreator updated.")
