import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export default async function handler(req, res) {
  try {
    if (!getApps().length) {
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
    }
    
    const email = 'lrenee@herbalisticwellness.com';
    let user;
    try {
      user = await getAuth().getUserByEmail(email);
    } catch(e) {}
    
    if (user) {
      await getAuth().updateUser(user.uid, { password: 'Bossbabe26##' });
      res.status(200).json({ success: true, message: 'Password updated' });
    } else {
      await getAuth().createUser({ email: email, password: 'Bossbabe26##' });
      res.status(200).json({ success: true, message: 'User created' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}
