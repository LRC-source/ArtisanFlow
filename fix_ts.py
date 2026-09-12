files = [
    r'c:\Users\lacar\Desktop\ArtisanFlow\api\setup-account.ts',
    r'c:\Users\lacar\Desktop\ArtisanFlow\api\gemini.ts',
    r'c:\Users\lacar\Desktop\ArtisanFlow\api\woocommerce-validate.ts'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace credential import and usages
    content = content.replace("import { initializeApp, credential, getApps } from 'firebase-admin/app';", "import { initializeApp, cert, getApps } from 'firebase-admin/app';")
    content = content.replace("credential: credential.cert(", "credential: cert(")
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed firebase-admin/app imports")
