import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
db.settings({ preferRest: true });

async function deleteQA() {
  const q = await db.collection('customers').where('email', '==', 'qarecheck@example.com').get();
  q.forEach(async (doc) => {
    await doc.ref.delete();
    console.log('Deleted QA record:', doc.id);
  });
  console.log('Done');
}
deleteQA();
