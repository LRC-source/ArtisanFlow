with open(r'c:\Users\lacar\Desktop\ArtisanFlow\components\DataContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
"""            const profileData = docSnap.data().profile;
            const adminEmails = ['lacarmsu38@gmail.com', 'lcarter@lrcholisticmarketing.online', 'lrenee@herbalisticwellness.com'];
            
            // Securely grant admin rights if the authenticated Firebase user matches an admin email
            if (user.email && adminEmails.includes(user.email.toLowerCase())) {
              profileData.role = 'admin';
            }
            
            setBusinessProfile(prev => ({ ...prev, ...profileData }));""",
"""            const rawData = docSnap.data();
            const profileData = rawData.profile || {};
            const adminEmails = ['lacarmsu38@gmail.com', 'lcarter@lrcholisticmarketing.online', 'lrenee@herbalisticwellness.com'];
            
            // Securely grant admin rights if the authenticated Firebase user matches an admin email
            if (user.email && adminEmails.includes(user.email.toLowerCase())) {
              profileData.role = 'admin';
            }
            
            setBusinessProfile(prev => ({ 
              ...prev, 
              ...profileData, 
              tier: rawData.tier || 'Basic Artisan',
              status: rawData.status || 'Active',
              trialEndsAt: rawData.trialEndsAt 
            }));"""
)

with open(r'c:\Users\lacar\Desktop\ArtisanFlow\components\DataContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated DataContext profile loading")
