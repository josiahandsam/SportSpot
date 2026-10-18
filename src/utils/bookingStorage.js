// SportSpot LocalStorage Booking Manager
import { getCurrentUser } from './authStorage.js';

const STORAGE_KEY = 'sportspot_bookings';

/**
 * Helper to dispatch custom event so UI components auto-update on data changes
 */
const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sportspot_bookings_updated'));
  }
};

/**
 * Get raw bookings list from localStorage
 */
const getAllRawBookings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading sportspot_bookings from localStorage:', err);
    return [];
  }
};

/**
 * Get saved bookings for the currently logged-in user (or guest)
 */
export const getBookings = () => {
  const all = getAllRawBookings();
  const currentUser = getCurrentUser();

  if (currentUser && currentUser.id) {
    // Return bookings created by this specific user (or legacy bookings without userId if first user)
    return all.filter((b) => b.userId === currentUser.id || !b.userId);
  }

  // If guest, show guest bookings or all bookings created in guest session
  return all.filter((b) => b.userId === 'guest-user' || !b.userId);
};

/**
 * Generate a unique sequential Booking ID in format SS-2026-XXXX
 */
export const generateBookingId = () => {
  const existing = getAllRawBookings();
  let maxSeq = 0;
  
  existing.forEach((b) => {
    if (b.id && typeof b.id === 'string') {
      const match = b.id.match(/SS-\d{4}-(\d+)/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  });

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  const currentYear = new Date().getFullYear();
  return `SS-${currentYear}-${nextSeq}`;
};

/**
 * Save a new booking to localStorage (includes userId)
 * @param {Object} bookingData 
 */
export const saveBooking = (bookingData) => {
  const existingAll = getAllRawBookings();
  const currentUser = getCurrentUser();
  const activeUserId = bookingData.userId || (currentUser ? currentUser.id : 'guest-user');

  // Format total price cleanly
  const priceNum = typeof bookingData.price === 'number' 
    ? bookingData.price 
    : parseInt(String(bookingData.price || '800').replace(/[^\d]/g, ''), 10) || 800;

  const totalPrice = bookingData.totalPrice || (priceNum + 40);

  const newBooking = {
    id: bookingData.id || generateBookingId(),
    userId: activeUserId,
    venue: bookingData.venue?.name || bookingData.venueName || 'Elite Football Arena',
    image: bookingData.venue?.image || bookingData.image || '/images/venue_football.jpg',
    sport: bookingData.venue?.sport || bookingData.sport || 'Football',
    location: bookingData.venue?.location || bookingData.location || 'Coimbatore',
    address: bookingData.address || 'Avinashi Road, Coimbatore',
    date: bookingData.date || 'September 10, 2026',
    time: bookingData.timeSlot || bookingData.time || '6:00 PM – 8:00 PM',
    duration: bookingData.duration || '2 hours',
    pricePerHour: priceNum,
    totalPrice: totalPrice,
    status: bookingData.status || 'Confirmed', // 'Confirmed' | 'Completed' | 'Cancelled'
    createdAt: new Date().toISOString()
  };

  // Prepend so newest appears first
  const updated = [newBooking, ...existingAll];
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyChange();
    return newBooking;
  } catch (err) {
    console.error('Error saving booking to localStorage:', err);
    return newBooking;
  }
};

/**
 * Update an existing booking by ID
 */
export const updateBooking = (id, updates) => {
  const existingAll = getAllRawBookings();
  const index = existingAll.findIndex((b) => b.id === id);
  if (index === -1) return null;

  existingAll[index] = { ...existingAll[index], ...updates };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingAll));
    notifyChange();
    return existingAll[index];
  } catch (err) {
    console.error('Error updating booking in localStorage:', err);
    return null;
  }
};

/**
 * Cancel a booking by ID
 */
export const cancelBooking = (id) => {
  return updateBooking(id, { status: 'Cancelled' });
};

/**
 * Helper to determine if a date string is in the past
 */
export const isPastDate = (dateStr) => {
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
};

/**
 * Get upcoming bookings for active user
 */
export const getUpcomingBookings = () => {
  const userBookings = getBookings();
  return userBookings.filter((b) => b.status === 'Confirmed' && !isPastDate(b.date));
};

/**
 * Get past bookings for active user
 */
export const getPastBookings = () => {
  const userBookings = getBookings();
  return userBookings.filter((b) => b.status === 'Completed' || (b.status === 'Confirmed' && isPastDate(b.date)));
};

/**
 * Get cancelled bookings for active user
 */
export const getCancelledBookings = () => {
  const userBookings = getBookings();
  return userBookings.filter((b) => b.status === 'Cancelled');
};
