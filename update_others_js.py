code = """import { initializeApp, cert, getApps } from 'firebase-admin/app';
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
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\\\n/g, '\\n'),
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
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY || "AIzaSyAR3lLvfKpc5Cey2NPiph54AVNTc7a9TN8";
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
    
    const db = getFirestore();
    const docSnap = await db.collection('users').doc(uid).get();
    return res.status(200).json({ success: true, tier: docSnap.data()?.tier || 'Free Trial' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
"""
with open(r'c:\Users\lacar\Desktop\ArtisanFlow\api\woocommerce-validate.js', 'w', encoding='utf-8') as f:
    f.write(code)

code2 = """export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY || "AIzaSyAR3lLvfKpc5Cey2NPiph54AVNTc7a9TN8";
    const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.users || !verifyData.users.length) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Server-side genai proxy logic
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing Gemini API Key' });

    const fetchRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      })
    });
    
    const data = await fetchRes.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
"""
with open(r'c:\Users\lacar\Desktop\ArtisanFlow\api\gemini.js', 'w', encoding='utf-8') as f:
    f.write(code2)

import os
os.remove(r'c:\Users\lacar\Desktop\ArtisanFlow\api\woocommerce-validate.ts')
os.remove(r'c:\Users\lacar\Desktop\ArtisanFlow\api\gemini.ts')
print("Updated other JS files")
