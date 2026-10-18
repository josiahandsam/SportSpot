import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Helper to access Vite environment variables with static property access for Vite AST replacement
// and process.env fallback for Node test environments
const getEnvVar = (viteVal, nodeKey, fallbackVal) => {
  if (viteVal) return viteVal;
  if (typeof process !== 'undefined' && process?.env?.[nodeKey]) {
    return process.env[nodeKey];
  }
  return fallbackVal;
};

const firebaseConfig = {
  apiKey: getEnvVar(import.meta.env?.VITE_FIREBASE_API_KEY, 'VITE_FIREBASE_API_KEY', 'AIzaSyC_JU941sJvM29kMDS1H0QnZKn5M_Tdy8'),
  authDomain: getEnvVar(import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN, 'VITE_FIREBASE_AUTH_DOMAIN', 'sportspot-d561b.firebaseapp.com'),
  projectId: getEnvVar(import.meta.env?.VITE_FIREBASE_PROJECT_ID, 'VITE_FIREBASE_PROJECT_ID', 'sportspot-d561b'),
  storageBucket: getEnvVar(import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET, 'VITE_FIREBASE_STORAGE_BUCKET', 'sportspot-d561b.firebasestorage.app'),
  messagingSenderId: getEnvVar(import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID, 'VITE_FIREBASE_MESSAGING_SENDER_ID', '787866550544'),
  appId: getEnvVar(import.meta.env?.VITE_FIREBASE_APP_ID, 'VITE_FIREBASE_APP_ID', '1:787866550544:web:02f43290783836ebd6595'),
  measurementId: getEnvVar(import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID, 'VITE_FIREBASE_MEASUREMENT_ID', 'G-BH8P2E6VXE'),
};

// Initialize Firebase instance (avoid re-initialization during HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Authentication and Firestore instances
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db, googleProvider };
export default app;
