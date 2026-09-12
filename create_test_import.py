code = """import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from 'firebase-admin/app';

export default function handler(req: VercelRequest, res: VercelResponse) {
    try {
        res.status(200).json({ ok: true, typeofInit: typeof initializeApp });
    } catch (e: any) {
        res.status(200).json({ ok: false, error: e.message });
    }
}
"""
with open(r'c:\Users\lacar\Desktop\ArtisanFlow\api\test-import.ts', 'w', encoding='utf-8') as f:
    f.write(code)
print("Created test-import.ts")
