import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAR3lLvfKpc5Cey2NPiph54AVNTc7a9TN8",
  authDomain: 'artisanflow.lrcholisticmarketing.online',
  projectId: "official-artisanflow"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emails = ['lcarter@lrcholisticmarketing.online', 'lrenee@herbalisticwellness.com'];
const password = 'Bossbabe26##';

async function setup() {
  for (const email of emails) {
    try {
      console.log(`Trying to create user ${email}...`);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log(`Success! Created ${email}`);
    } catch (e) {
      console.log(`Error for ${email}:`, e.code, e.message);
    }
  }
  process.exit(0);
}
setup();
