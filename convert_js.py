with open(r'c:\Users\lacar\Desktop\ArtisanFlow\api\setup-account.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Strip types
content = content.replace("import { VercelRequest, VercelResponse } from '@vercel/node';", "")
content = content.replace("export default async function handler(req: VercelRequest, res: VercelResponse)", "export default async function handler(req, res)")
content = content.replace("catch (e: any)", "catch (e)")
content = content.replace("(d: any)", "(d)")
content = content.replace("catch (error)", "catch (error)")

with open(r'c:\Users\lacar\Desktop\ArtisanFlow\api\setup-account.js', 'w', encoding='utf-8') as f:
    f.write(content)
