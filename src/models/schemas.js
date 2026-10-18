/**
 * SportSpot Firestore Document Schemas & Validation Models
 * 
 * Defines consistent schemas for:
 * - users/{uid}
 * - venues/{venueId}
 * - venues/{venueId}/reviews/{reviewId}
 * - bookings/{bookingId}
 */

// Permitted fields that regular users are authorized to update on their own profile
export const USER_PERMITTED_UPDATE_FIELDS = [
  'name',
  'phone',
  'avatarUrl',
  'preferredCity',
  'updatedAt'
];

// Protected user fields that can never be modified by client requests
export const USER_IMMUTABLE_FIELDS = [
  'uid',
  'email',
  'role',
  'createdAt'
];

/**
 * Validate and sanitize user profile updates
 * @param {Object} updates 
 * @returns {Object} sanitized update payload
 */
export function sanitizeUserProfileUpdate(updates) {
  if (!updates || typeof updates !== 'object') {
    throw new Error('Update payload must be a non-null object.');
  }

  const sanitized = {};
  for (const key of Object.keys(updates)) {
    if (USER_IMMUTABLE_FIELDS.includes(key)) {
      throw new Error(`Security violation: Modification of field '${key}' is strictly forbidden.`);
    }
    if (USER_PERMITTED_UPDATE_FIELDS.includes(key)) {
      sanitized[key] = updates[key];
    }
  }

  sanitized.updatedAt = new Date().toISOString();
  return sanitized;
}

/**
 * Factory for a new User Profile document
 */
export function createUserProfileDoc({ uid, name, email }) {
  if (!uid || !email) {
    throw new Error('User document requires both uid and email.');
  }

  return {
    uid,
    name: (name || '').trim() || email.split('@')[0],
    email: email.trim().toLowerCase(),
    role: 'user', // Security: always initialized to 'user'
    phone: '',
    avatarUrl: '',
    preferredCity: 'Coimbatore',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Factory for a new Venue document
 */
export function createVenueDoc(data = {}) {
  const sport = data.sport || 'Football';
  const name = data.name || 'Elite Football Arena';
  const slug = data.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const primaryImage = data.image || '/images/venue_football.jpg';

  return {
    id: data.id ? String(data.id) : `venue_${Date.now()}`,
    name,
    slug,
    sport,
    sports: Array.isArray(data.sports) && data.sports.length > 0 ? data.sports : [sport],
    location: data.location || 'Coimbatore',
    address: data.address || `${data.location || 'Peelamedu, Coimbatore'}`,
    distanceKm: typeof data.distanceKm === 'number' ? data.distanceKm : 2.0,
    distance: data.distance || `${data.distanceKm || 2.0} km`,
    rating: typeof data.rating === 'number' ? data.rating : 4.8,
    reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 120,
    pricePerHour: typeof data.priceNum === 'number' ? data.priceNum : (data.pricePerHour || 800),
    priceFormatted: data.price || `₹${data.pricePerHour || data.priceNum || 800} / hour`,
    venueType: data.venueType || 'Outdoor', // 'Indoor' | 'Outdoor' | 'Covered'
    facilities: Array.isArray(data.facilities) ? data.facilities : ['Parking', 'Floodlights', 'Locker Rooms'],
    amenitiesDescription: data.amenities || 'Professional quality turf, floodlights, parking and locker facilities.',
    image: primaryImage,
    images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [
      primaryImage,
      '/images/card_football.jpg',
      '/images/stadium_wide.jpg',
      '/images/turf_macro.jpg',
      '/images/venue_football_5.jpg'
    ],
    gallery: Array.isArray(data.gallery) && data.gallery.length >= 3 ? data.gallery : [
      primaryImage,
      '/images/card_football.jpg',
      '/images/stadium_wide.jpg',
      '/images/turf_macro.jpg',
      '/images/venue_football_5.jpg'
    ],
    operatingHours: {
      open: data.openTime || '06:00 AM',
      close: data.closeTime || '11:00 PM',
      slotDurationMinutes: 120
    },
    status: data.status || 'active', // 'active' | 'inactive' | 'pending'
    ownerId: data.ownerId || null,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Factory for a new Booking document
 */
export function createBookingDoc(data = {}) {
  if (!data.userId) {
    throw new Error('Booking requires a valid userId.');
  }

  const priceNum = typeof data.pricePerHour === 'number'
    ? data.pricePerHour
    : parseInt(String(data.price || '800').replace(/[^\d]/g, ''), 10) || 800;

  const platformFee = typeof data.platformFee === 'number' ? data.platformFee : 40;
  const totalPrice = typeof data.totalPrice === 'number' ? data.totalPrice : (priceNum + platformFee);

  const venueName = data.venue?.name || data.venueName || data.venue || 'Elite Football Arena';
  const venueImage = data.venue?.image || data.venueImage || data.image || '/images/venue_football.jpg';
  const timeSlot = data.timeSlot || data.time || '6:00 PM – 8:00 PM';

  return {
    id: data.id || `SS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: data.userId,
    venueId: data.venueId ? String(data.venueId) : (data.venue?.id ? String(data.venue.id) : 'venue_1'),
    venueName,
    venue: venueName,
    venueImage,
    image: venueImage,
    sport: data.venue?.sport || data.sport || 'Football',
    location: data.venue?.location || data.location || 'Coimbatore',
    address: data.address || 'Avinashi Road, Coimbatore',
    date: data.date || 'September 10, 2026',
    timeSlot,
    time: timeSlot,
    duration: data.duration || '2 hours',
    pricePerHour: priceNum,
    platformFee,
    totalPrice,
    status: data.status || 'Confirmed', // 'Confirmed' | 'Completed' | 'Cancelled'
    paymentStatus: data.paymentStatus || 'paid', // 'paid' | 'pending' | 'refunded'
    paymentId: data.paymentId || `PAY-${Date.now().toString(36).toUpperCase()}`,
    cancellationReason: data.cancellationReason || null,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Factory for a new Venue Review document
 */
export function createReviewDoc(data = {}) {
  if (!data.userId || !data.venueId) {
    throw new Error('Review requires both userId and venueId.');
  }

  const ratingNum = Math.min(5, Math.max(1, Number(data.rating) || 5));

  return {
    id: data.id || `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    venueId: String(data.venueId),
    userId: data.userId,
    userName: (data.userName || '').trim() || 'Player',
    userAvatar: data.userAvatar || '',
    rating: ratingNum,
    comment: (data.comment || '').trim(),
    createdAt: data.createdAt || new Date().toISOString()
  };
}
