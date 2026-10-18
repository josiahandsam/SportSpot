import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { createBookingDoc } from '../models/schemas.js';
import {
  getBookings as getLocalBookings,
  saveBooking as saveLocalBooking,
  updateBooking as updateLocalBooking
} from '../utils/bookingStorage.js';

const BOOKINGS_COLLECTION = 'bookings';

/**
 * Create a new booking in Firestore for the authenticated user
 * 
 * Security: Strictly enforces that currentUserId is present and attached to the booking document.
 * Adheres to Firestore Security Rule: allow create: if isOwner(request.resource.data.userId) && status == 'Confirmed'.
 * 
 * @param {Object} bookingData - Details from booking selection (venue, date, timeSlot, price, etc.)
 * @param {string} currentUserId - Authenticated Firebase Auth user's UID
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.fallbackOnError=false] - Whether to silently fall back to localStorage on Firestore error
 * @returns {Promise<Object>} Created booking document
 */
export async function createBooking(bookingData, currentUserId, options = { fallbackOnError: false }) {
  if (!currentUserId) {
    throw new Error('Authentication required: You must be signed in to create a booking.');
  }

  // Generate standardized schema document
  const bookingPayload = createBookingDoc({
    ...bookingData,
    userId: currentUserId,
    status: 'Confirmed'
  });

  try {
    const bookingDocRef = doc(db, BOOKINGS_COLLECTION, bookingPayload.id);
    await setDoc(bookingDocRef, bookingPayload);

    // Also mirror to local storage for offline session access
    saveLocalBooking(bookingPayload);

    return bookingPayload;
  } catch (error) {
    console.error('Firestore createBooking error:', error);
    if (!options.fallbackOnError) {
      throw new Error(`Failed to save booking to Firestore: ${error.message || 'Permission denied or network failure'}`);
    }
    console.warn('Notice: Firestore createBooking falling back to local session storage:', error.message);
    const local = saveLocalBooking(bookingPayload);
    return local;
  }
}

/**
 * Helper to determine if a date string is in the past
 * @param {string} dateStr 
 * @returns {boolean}
 */
export function isBookingPast(dateStr) {
  if (!dateStr) return false;
  try {
    const now = new Date();
    const target = new Date(dateStr.includes('202') ? dateStr : `${dateStr}, ${now.getFullYear()}`);
    if (isNaN(target.getTime())) return false;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return target < today;
  } catch (e) {
    return false;
  }
}

/**
 * Retrieve all bookings for the specified user from Firestore
 * 
 * Security: Queries specifically where userId == currentUserId, strictly adhering to
 * Firestore security rules (allow read: if isOwner(resource.data.userId)).
 * 
 * @param {string} userId - User's Firebase UID
 * @param {Object} [options] - Query options
 * @param {boolean} [options.fallbackOnError=false] - If false, throws error instead of silently returning mock/local data
 * @param {boolean} [options.includeLocalStorageFallback=false] - If true and Firestore is empty, checks local session
 * @returns {Promise<Array>} List of bookings belonging to this user
 */
export async function getUserBookings(userId, options = { fallbackOnError: false, includeLocalStorageFallback: false }) {
  if (!userId) {
    throw new Error('getUserBookings requires a valid userId.');
  }

  try {
    const bookingsRef = collection(db, BOOKINGS_COLLECTION);
    // Use single-field query to avoid requiring composite indexes
    const q = query(
      bookingsRef,
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      // Sort by creation time (or date) in memory
      return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    // If Firestore has no documents for this user
    if (options.includeLocalStorageFallback) {
      const local = getLocalBookings();
      const userLocal = local.filter((b) => b.userId === userId);
      return userLocal.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return [];
  } catch (error) {
    console.error(`Firestore getUserBookings error for user (${userId}):`, error);
    if (!options.fallbackOnError) {
      throw error;
    }
    console.warn('Notice: Firestore getUserBookings falling back to local session bookings:', error.message);
    const local = getLocalBookings();
    return local.filter((b) => b.userId === userId);
  }
}

/**
 * Retrieve upcoming confirmed bookings for a user
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export async function getUpcomingUserBookings(userId) {
  const all = await getUserBookings(userId);
  return all.filter((b) => b.status === 'Confirmed' && !isBookingPast(b.date));
}

/**
 * Retrieve past or completed bookings for a user
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export async function getPastUserBookings(userId) {
  const all = await getUserBookings(userId);
  return all.filter((b) => b.status === 'Completed' || (b.status === 'Confirmed' && isBookingPast(b.date)));
}

/**
 * Retrieve a specific booking by ID, ensuring user ownership
 * @param {string} bookingId 
 * @param {string} currentUserId 
 * @returns {Promise<Object|null>}
 */
export async function getBookingById(bookingId, currentUserId) {
  if (!bookingId) return null;

  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const snap = await getDoc(bookingRef);

    if (snap.exists()) {
      const data = snap.data();
      // Enforce ownership: user can only inspect their own bookings
      if (currentUserId && data.userId !== currentUserId) {
        throw new Error('Access denied: You are not authorized to view this booking.');
      }
      return { id: snap.id, ...data };
    }

    // Check local storage fallback
    const local = getLocalBookings();
    const found = local.find((b) => b.id === bookingId);
    if (found && currentUserId && found.userId && found.userId !== currentUserId) {
      throw new Error('Access denied: You are not authorized to view this booking.');
    }
    return found || null;
  } catch (error) {
    console.error(`Error retrieving booking (${bookingId}):`, error);
    throw error;
  }
}

/**
 * Cancel an existing booking belonging to the user
 * @param {string} bookingId 
 * @param {string} currentUserId 
 * @param {string} [reason='Cancelled by player'] 
 * @returns {Promise<Object>}
 */
export async function cancelUserBooking(bookingId, currentUserId, reason = 'Cancelled by player') {
  if (!bookingId || !currentUserId) {
    throw new Error('cancelUserBooking requires both bookingId and currentUserId.');
  }

  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const snap = await getDoc(bookingRef);

    if (snap.exists()) {
      const data = snap.data();
      if (data.userId !== currentUserId) {
        throw new Error('Unauthorized: You cannot cancel another user\'s booking.');
      }

      await updateDoc(bookingRef, {
        status: 'Cancelled',
        cancellationReason: reason,
        updatedAt: new Date().toISOString()
      });

      // Keep local session storage in sync
      updateLocalBooking(bookingId, { status: 'Cancelled', cancellationReason: reason });

      return { id: snap.id, ...data, status: 'Cancelled', cancellationReason: reason };
    }

    // Fallback: local storage update with ownership verification
    const local = getLocalBookings();
    const target = local.find((b) => b.id === bookingId);
    if (target && target.userId && target.userId !== currentUserId) {
      throw new Error('Unauthorized: You cannot cancel another user\'s booking.');
    }

    return updateLocalBooking(bookingId, { status: 'Cancelled', cancellationReason: reason });
  } catch (error) {
    console.error(`Error cancelling booking (${bookingId}):`, error);
    throw error;
  }
}
