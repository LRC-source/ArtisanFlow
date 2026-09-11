import { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';
const adminAny = admin as any;

if (!adminAny.apps || !adminAny.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      adminAny.initializeApp({
        credential: adminAny.credential.cert(JSON.parse(serviceAccountKey))
      });
    } else {
      adminAny.initializeApp({
          credential: adminAny.credential.cert({
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
        
        const decoded = await adminAny.auth().verifyIdToken(token);
        const uid = decoded.uid;
        
        const { url, key, secret } = req.body;
        if (!url || !key || !secret) {
            return res.status(400).json({ error: 'Missing required credentials' });
        }
        
        // Remove trailing slash
        const baseUrl = url.replace(/\/$/, '');
        const authHeader = 'Basic ' + Buffer.from(key + ':' + secret).toString('base64');
        
        // Validate with actual WooCommerce REST API
        const wpRes = await fetch(baseUrl + '/wp-json/wc/v3/system_status', {
            method: 'GET',
            headers: { 'Authorization': authHeader }
        });
        
        if (!wpRes.ok) {
            return res.status(401).json({ error: 'Invalid WooCommerce credentials or store URL.' });
        }
        
        // Save to integrations subcollection securely
        const db = adminAny.firestore();
        await db.collection('users').doc(uid).collection('integrations').doc('woocommerce').set({
            url: baseUrl,
            key: key,
            secret: secret,
            connectedAt: new Date().toISOString(),
            status: 'Connected'
        });
        
        return res.status(200).json({ success: true });
        
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
}