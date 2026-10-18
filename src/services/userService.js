import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { sanitizeUserProfileUpdate, createUserProfileDoc } from '../models/schemas.js';

const USERS_COLLECTION = 'users';

/**
 * Retrieve user profile document from Firestore by UID
 * @param {string} uid 
 * @returns {Promise<Object|null>} user profile data or null
 */
export async function getUserProfile(uid) {
  if (!uid) {
    throw new Error('getUserProfile requires a valid user UID.');
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return null;
    }

    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error(`Error retrieving user profile (${uid}):`, error);
    throw error;
  }
}

/**
 * Check if a user document exists in Firestore
 * @param {string} uid 
 * @returns {Promise<boolean>}
 */
export async function userExists(uid) {
  if (!uid) return false;
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userRef);
    return snap.exists();
  } catch (error) {
    console.error(`Error checking user existence (${uid}):`, error);
    return false;
  }
}

/**
 * Update an existing user profile with permitted fields only
 * Enforces client-side validation against role elevation or immutable field mutation.
 * 
 * @param {string} uid 
 * @param {Object} updates 
 * @returns {Promise<Object>} updated profile data
 */
export async function updateUserProfile(uid, updates) {
  if (!uid) {
    throw new Error('updateUserProfile requires a valid user UID.');
  }

  // Sanitize and ensure no role or UID changes are permitted
  const sanitized = sanitizeUserProfileUpdate(updates);

  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, sanitized);

    const updatedSnap = await getDoc(userRef);
    return { id: updatedSnap.id, ...updatedSnap.data() };
  } catch (error) {
    console.error(`Error updating user profile (${uid}):`, error);
    throw error;
  }
}

/**
 * Ensure a user profile exists in Firestore after Google authentication.
 * 
 * Security & Integrity:
 * - Checks if users/{uid} already exists.
 * - If profile exists, it is preserved completely without overwriting role, preferences, or timestamps.
 * - If profile is missing, initializes standard profile with role forced to 'user'.
 * 
 * @param {Object} firebaseUser - Firebase Auth user object from Google sign-in
 * @returns {Promise<Object>} The resolved user profile
 */
export async function ensureGoogleUserProfile(firebaseUser) {
  if (!firebaseUser || !firebaseUser.uid) {
    throw new Error('ensureGoogleUserProfile requires an authenticated Firebase user.');
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      // Preserve existing profile and never overwrite role or preferences
      return { id: snap.id, ...snap.data() };
    }

    // Create new profile document conforming to createUserProfileDoc schema
    const newProfile = createUserProfileDoc({
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Player'),
      email: firebaseUser.email || ''
    });

    if (firebaseUser.photoURL) {
      newProfile.avatarUrl = firebaseUser.photoURL;
    }
    if (firebaseUser.phoneNumber) {
      newProfile.phone = firebaseUser.phoneNumber;
    }

    await setDoc(userRef, newProfile);
    return { id: firebaseUser.uid, ...newProfile };
  } catch (error) {
    console.error(`Error ensuring Google user profile for (${firebaseUser.uid}):`, error);
    throw error;
  }
}
