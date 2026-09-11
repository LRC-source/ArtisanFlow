import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, credential, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

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
        const payloadData = req.body?.data;


        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        
        const decoded = await getAuth().verifyIdToken(token);
        const uid = decoded.uid;
        
        const { deviceFingerprint } = req.body || {};
        
        const isTrial = true;
        const forcedTier = 'Free Trial';
        const forcedStatus = 'trialing';
        const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
        
        const db = getFirestore();
        
        const userRef = db.collection('users').doc(uid);
        const docSnap = await userRef.get();
        if (docSnap.exists) {
            return res.status(200).json({ success: true, message: 'Account already initialized' });
        }

        if (isTrial) {
            const emailDocs = await db.collection('users').where('email', '==', payloadData.email).get();
            const fpDocs = await db.collection('users').where('deviceFingerprint', '==', deviceFingerprint).get();
            
            let abuseDetected = false;
            emailDocs.forEach((d: any) => { if (d.id !== uid && d.data().tier === 'Free Trial') abuseDetected = true; });
            fpDocs.forEach((d: any) => { if (d.id !== uid && d.data().tier === 'Free Trial') abuseDetected = true; });
            
            if (abuseDetected) {
                return res.status(403).json({ error: 'Our system indicates you have already utilized a Free Trial.' });
            }
        }
        
        await userRef.set({
            email: payloadData.email,
            tier: forcedTier,
            status: forcedStatus,
            trialEndsAt: trialEndsAt,
            deviceFingerprint: deviceFingerprint,
            profile: {
              name: payloadData.name || 'New Artisan Business',
              ownerName: payloadData.ownerName || 'Business Owner',
              niche: payloadData.niche || '',
              currency: 'USD'
            }
        });
        
        return res.status(200).json({ success: true });
        
    } catch (e: any) {
        return res.status(500).json({ error: 'Handler error: ' + e.message });
    }
}
