import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({ projectId: "test" });
const db = getFirestore();
try {
  db.settings({ preferRest: true });
  console.log("Success 1");
  db.settings({ preferRest: true });
  console.log("Success 2");
} catch(e) {
  console.error("Error:", e.message);
}
