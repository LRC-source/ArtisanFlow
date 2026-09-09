import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "artisanflow.lrcholisticmarketing.online",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "artisanflow-b6abf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "artisanflow-b6abf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "202144552685",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:202144552685:web:7cab6681811d210aa15ee4"
};

// Only initialize Firebase if an API key is present — prevents build-time crash on Vercel
// when environment variables are not yet configured.
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("[Firebase] Initialization failed:", e);
  }
} else {
  console.warn("[Firebase] VITE_FIREBASE_API_KEY is not set. Auth and Firestore will be unavailable.");
}

export { auth, db };
