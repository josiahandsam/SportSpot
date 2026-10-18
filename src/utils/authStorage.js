// SportSpot Firebase Authentication & Local Session Bridge
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import { getAuthErrorMessage } from './authErrors.js';

const CURRENT_USER_KEY = 'sportspot_current_user';

/**
 * Dispatch custom event so legacy listeners auto-update on auth changes
 */
export const notifyAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sportspot_auth_updated'));
  }
};

/**
 * Get currently logged-in user object or null (synchronous reading for utilities like bookingStorage)
 */
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading sportspot_current_user from localStorage:', err);
    return null;
  }
};

/**
 * Register a new user with Firebase Auth and initialize a Firestore user profile document
 * @param {Object} param0 { name, email, password }
 */
export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const trimmedName = (name || '').trim();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    const firebaseUser = userCredential.user;

    if (trimmedName) {
      await updateProfile(firebaseUser, { displayName: trimmedName });
    }

    // Role is hardcoded to 'user' to prevent client privilege escalation.
    // Passwords are NEVER saved in Firestore or localStorage.
    const profileData = {
      uid: firebaseUser.uid,
      name: trimmedName || firebaseUser.email.split('@')[0],
      email: normalizedEmail,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), profileData);
    } catch (fsErr) {
      console.warn('Firestore user document setup warning:', fsErr);
    }

    const sessionUser = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      name: profileData.name,
      email: normalizedEmail,
      role: 'user'
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    notifyAuthChange();
    return { success: true, user: sessionUser };
  } catch (err) {
    console.error('Error in registerUser:', err);
    return { success: false, error: getAuthErrorMessage(err), rawError: err };
  }
};

/**
 * Login user with Firebase Auth email and password
 * @param {string} email 
 * @param {string} password 
 */
export const loginUser = async (email, password) => {
  const normalizedEmail = (email || '').trim().toLowerCase();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    const firebaseUser = userCredential.user;

    let profileName = firebaseUser.displayName || firebaseUser.email.split('@')[0];
    let profileRole = 'user';

    try {
      const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        if (data.name) profileName = data.name;
        if (data.role) profileRole = data.role;
      }
    } catch (fsErr) {
      console.warn('Firestore profile lookup notice:', fsErr);
    }

    const sessionUser = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      name: profileName,
      email: normalizedEmail,
      role: profileRole
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    notifyAuthChange();
    return { success: true, user: sessionUser };
  } catch (err) {
    console.error('Error in loginUser:', err);
    return { success: false, error: getAuthErrorMessage(err), rawError: err };
  }
};

/**
 * Logout current user via Firebase signOut
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem(CURRENT_USER_KEY);
    notifyAuthChange();
    return true;
  } catch (err) {
    console.error('Error logging out user:', err);
    return false;
  }
};
