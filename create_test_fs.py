code = """import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const firestore = await import('firebase-admin/firestore');
        res.status(200).json({ ok: true, version: 'firestore dynamic import worked' });
    } catch (e: any) {
        res.status(200).json({ ok: false, error: e.message, stack: e.stack });
    }
}
"""
with open(r'c:\Users\lacar\Desktop\ArtisanFlow\api\test-firestore.ts', 'w', encoding='utf-8') as f:
    f.write(code)
print("Created test-firestore.ts")
