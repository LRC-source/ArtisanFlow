import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAR3lLvfKpc5Cey2NPiph54AVNTc7a9TN8",
  authDomain: 'artisanflow.lrcholisticmarketing.online',
  projectId: "official-artisanflow"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = 'lrenee@herbalisticwellness.com';
const password = 'Bossbabe26##';

async function testLogin() {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log(`Successfully logged in as ${email}`);
  } catch (e) {
    console.log(`Failed to log in: ${e.code} - ${e.message}`);
  }
  process.exit(0);
}
testLogin();
