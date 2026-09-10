import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAR3lLvfKpc5Cey2NPiph54AVNTc7a9TN8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "official-artisanflow.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "official-artisanflow",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "official-artisanflow.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "518242670072",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:518242670072:web:d0956f031c2f359f30f20d"
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
