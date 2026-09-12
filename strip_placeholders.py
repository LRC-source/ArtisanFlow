with open(r'c:\Users\lacar\Desktop\ArtisanFlow\components\Auth.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('placeholder="Alex Morgan"', 'placeholder=""')
content = content.replace('placeholder="123 Artisan Way"', 'placeholder=""')
content = content.replace('placeholder="New York"', 'placeholder=""')
content = content.replace('placeholder="NY"', 'placeholder=""')
content = content.replace('placeholder="10001"', 'placeholder=""')

with open(r'c:\Users\lacar\Desktop\ArtisanFlow\components\Auth.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
