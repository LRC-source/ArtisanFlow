import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const admin = require('firebase-admin');
        res.status(200).json({ ok: true, version: 'require worked' });
    } catch (e: any) {
        res.status(200).json({ ok: false, error: e.message });
    }
}
