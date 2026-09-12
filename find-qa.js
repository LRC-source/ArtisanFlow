import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'));

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();
db.settings({ preferRest: true });

async function findQA() {
  const users = await db.collection('users').get();
  for (const user of users.docs) {
    const customers = await db.collection('users').doc(user.id).collection('manualCustomers').get();
    for (const c of customers.docs) {
      if (c.data().email === 'qarecheck@example.com') {
        console.log('Found QA record:', c.id, 'in user:', user.id);
        const token = await getAuth().createCustomToken(user.id);
        console.log('Login Token:', token);
        fs.writeFileSync('qa-token.txt', token);
        return;
      }
    }
  }
  console.log('QA record not found');
}
findQA();
