import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, credential, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
    try {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey) {
            initializeApp({
                credential: credential.cert(JSON.parse(serviceAccountKey))
            });
        } else {
            initializeApp({
                credential: credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
        }
    } catch (error) {
        console.error("Firebase admin init error", error);
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = await getAuth().verifyIdToken(token);
    const db = getFirestore();
    const docSnap = await db.collection('users').doc(decoded.uid).get();
    return res.status(200).json({ success: true, tier: docSnap.data()?.tier || 'Free Trial' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
