import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
dotenv.config();

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
initializeApp({ credential: cert(JSON.parse(serviceAccountKey)) });
const db = getFirestore();

async function test() {
  console.log("Fetching...");
  try {
    const docSnap = await db.collection('users').doc('nonexistent_uid').get();
    console.log("Exists:", docSnap.exists);
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
test();
