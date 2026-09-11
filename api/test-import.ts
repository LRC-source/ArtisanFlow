import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from 'firebase-admin/app';

export default function handler(req: VercelRequest, res: VercelResponse) {
    try {
        res.status(200).json({ ok: true, typeofInit: typeof initializeApp });
    } catch (e: any) {
        res.status(200).json({ ok: false, error: e.message });
    }
}
