import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export default async function handler(req, res) {
    if (!getApps().length) {
        try {
            const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
            if (serviceAccountKey) {
                initializeApp({ credential: cert(JSON.parse(serviceAccountKey)) });
            } else {
                initializeApp({
                    credential: cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    }),
                });
            }
        } catch (error) {}
    }
    
    try {
        const db = getFirestore();
        try { db.settings({ preferRest: true }); } catch(e) {}
        
        const email = 'lrenee@herbalisticwellness.com';
        const snapshot = await db.collection('users').where('email', '==', email).get();
        
        if (snapshot.empty) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        let count = 0;
        for (const doc of snapshot.docs) {
            await doc.ref.update({
                tier: 'Pro Artisan',
                status: 'Active',
                trialEndsAt: null
            });
            count++;
        }
        
        res.status(200).json({ success: true, updated: count });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}
