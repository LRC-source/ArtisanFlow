import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
    try {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey) {
            initializeApp({
                credential: cert(JSON.parse(serviceAccountKey))
            });
        } else {
            initializeApp({
                credential: cert({
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

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    try {
        const payloadData = req.body?.data;
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        
        // Use REST API to verify token to avoid firebase-admin/auth ESM require crash on Vercel Node 24
        const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;
        const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: token })
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.users || !verifyData.users.length) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        const uid = verifyData.users[0].localId;
        
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
            emailDocs.forEach((d) => { if (d.id !== uid && d.data().tier === 'Free Trial') abuseDetected = true; });
            fpDocs.forEach((d) => { if (d.id !== uid && d.data().tier === 'Free Trial') abuseDetected = true; });
            
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
        
    } catch (e) {
        return res.status(500).json({ error: 'Handler error: ' + e.message });
    }
}
