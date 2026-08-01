import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw3tkLQXi6E4d-TRATSlSC7roFLrWhtrw",
  authDomain: "artisanflow-b6abf.firebaseapp.com",
  projectId: "artisanflow-b6abf",
  storageBucket: "artisanflow-b6abf.firebasestorage.app",
  messagingSenderId: "202144552685",
  appId: "1:202144552685:web:7cab6681811d210aa15ee4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
