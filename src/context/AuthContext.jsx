import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { getAuthErrorMessage } from '../utils/authErrors';
import { ensureGoogleUserProfile } from '../services/userService';

const AuthContext = createContext(null);

const CURRENT_USER_STORAGE_KEY = 'sportspot_current_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync session state to localStorage for synchronous utilities like bookingStorage
  const syncLocalSession = (firebaseUser, profileData) => {
    if (typeof window === 'undefined') return;

    if (firebaseUser) {
      const sessionData = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        name: profileData?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Player',
        email: firebaseUser.email,
        role: profileData?.role || 'user'
      };
      try {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.error('Failed to update local session cache:', e);
      }
    } else {
      try {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      } catch (e) {
        console.error('Failed to clear local session cache:', e);
      }
    }

    window.dispatchEvent(new Event('sportspot_auth_updated'));
  };

  // Fetch or construct user profile document from Firestore
  const fetchUserProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setUserProfile(null);
      syncLocalSession(null, null);
      return null;
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        setUserProfile(data);
        syncLocalSession(firebaseUser, data);
        return data;
      } else {
        // Graceful fallback if user document does not exist yet in Firestore
        const fallback = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Player'),
          email: firebaseUser.email,
          role: 'user', // Default safe client role
          createdAt: new Date().toISOString()
        };
        setUserProfile(fallback);
        syncLocalSession(firebaseUser, fallback);
        return fallback;
      }
    } catch (err) {
      console.warn('Notice: Firestore user profile query failed (check rules or database init):', err);
      // Graceful fallback without breaking user's authenticated session
      const fallback = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Player'),
        email: firebaseUser.email,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      setUserProfile(fallback);
      syncLocalSession(firebaseUser, fallback);
      return fallback;
    }
  };

  // Monitor Firebase Authentication state with automatic persistence across refreshes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
        syncLocalSession(null, null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Register a new user with Firebase Auth and initialize a user document in Firestore
   * Security: role is explicitly hardcoded to 'user' to prevent privilege escalation.
   */
  const register = async ({ name, email, password }) => {
    const trimmedName = (name || '').trim();
    const normalizedEmail = (email || '').trim().toLowerCase();

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      const firebaseUser = userCredential.user;

      // 2. Set Firebase Auth display name
      if (trimmedName) {
        await updateProfile(firebaseUser, { displayName: trimmedName });
      }

      // 3. Create user profile in Firestore (under users/{uid})
      // Role is hardcoded to 'user' for security. Never accept role from form or client.
      const profileData = {
        uid: firebaseUser.uid,
        name: trimmedName || firebaseUser.email.split('@')[0],
        email: normalizedEmail,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), profileData);
      } catch (firestoreErr) {
        console.warn('Firestore profile creation notice:', firestoreErr);
      }

      setUserProfile(profileData);
      syncLocalSession(firebaseUser, profileData);

      return { success: true, user: firebaseUser, profile: profileData };
    } catch (err) {
      console.error('Firebase registration error:', err);
      return { success: false, error: getAuthErrorMessage(err), rawError: err };
    }
  };

  /**
   * Login user with Firebase Auth
   */
  const login = async (email, password) => {
    const normalizedEmail = (email || '').trim().toLowerCase();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const profile = await fetchUserProfile(userCredential.user);
      return { success: true, user: userCredential.user, profile };
    } catch (err) {
      console.error('Firebase login error:', err);
      return { success: false, error: getAuthErrorMessage(err), rawError: err };
    }
  };

  /**
   * Sign in with Google using Firebase signInWithPopup
   * Creates Firestore profile if new; preserves all existing fields if profile already exists.
   */
  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user;

      // Ensure profile document exists in Firestore without overwriting roles or fields
      let profile = null;
      try {
        profile = await ensureGoogleUserProfile(firebaseUser);
      } catch (firestoreErr) {
        console.warn('Firestore profile synchronization notice:', firestoreErr);
        profile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Player'),
          email: firebaseUser.email || '',
          role: 'user',
          avatarUrl: firebaseUser.photoURL || '',
          createdAt: new Date().toISOString()
        };
      }

      setUser(firebaseUser);
      setUserProfile(profile);
      syncLocalSession(firebaseUser, profile);

      return { success: true, user: firebaseUser, profile };
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return { success: false, cancelled: true, error: 'Sign-in window was closed. Please try again.' };
      }
      console.error('Firebase Google Sign-In error:', err);
      return { success: false, error: getAuthErrorMessage(err), rawError: err };
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      syncLocalSession(null, null);
      return { success: true };
    } catch (err) {
      console.error('Firebase logout error:', err);
      return { success: false, error: getAuthErrorMessage(err) };
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      return { success: true };
    } catch (err) {
      console.error('Firebase reset password error:', err);
      return { success: false, error: getAuthErrorMessage(err) };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    fetchUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
export { useAuth } from './useAuth';
