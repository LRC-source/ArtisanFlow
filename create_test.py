code = """import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const admin = require('firebase-admin');
        res.status(200).json({ ok: true, version: 'require worked' });
    } catch (e: any) {
        res.status(200).json({ ok: false, error: e.message });
    }
}
"""
with open(r'c:\Users\lacar\Desktop\ArtisanFlow\api\test-admin.ts', 'w', encoding='utf-8') as f:
    f.write(code)
print("Created test-admin.ts")
