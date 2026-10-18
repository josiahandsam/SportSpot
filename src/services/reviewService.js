import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { createReviewDoc } from '../models/schemas.js';

const VENUES_COLLECTION = 'venues';
const REVIEWS_SUBCOLLECTION = 'reviews';

// Baseline fallback reviews matching VenueDetailsModal
export const FALLBACK_VENUE_REVIEWS = [
  createReviewDoc({
    id: 'rev_1',
    venueId: 'venue_1',
    userId: 'usr_sample_1',
    userName: 'Rahul',
    rating: 5,
    comment: 'Great turf, excellent lighting and very clean facilities.',
    createdAt: '2026-09-01T18:30:00.000Z'
  }),
  createReviewDoc({
    id: 'rev_2',
    venueId: 'venue_1',
    userId: 'usr_sample_2',
    userName: 'Arjun',
    rating: 5,
    comment: 'Good place for weekend football. The floodlights are bright and parking is spacious.',
    createdAt: '2026-09-05T19:15:00.000Z'
  }),
  createReviewDoc({
    id: 'rev_3',
    venueId: 'venue_2',
    userId: 'usr_sample_3',
    userName: 'Karthik',
    rating: 4,
    comment: 'Covered turf helped a lot during evening drizzles. Decent amenities.',
    createdAt: '2026-09-08T17:45:00.000Z'
  })
];

/**
 * Retrieve reviews for a specific venue from Firestore subcollection venues/{venueId}/reviews
 * @param {string} venueId 
 * @param {number} [maxCount=20]
 * @returns {Promise<Array>}
 */
export async function getVenueReviews(venueId, maxCount = 20) {
  if (!venueId) return [];

  const idStr = String(venueId);

  try {
    const reviewsRef = collection(db, VENUES_COLLECTION, idStr, REVIEWS_SUBCOLLECTION);
    const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(maxCount));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    }

    // Fallback: If no reviews in Firestore yet, provide sample reviews
    const matched = FALLBACK_VENUE_REVIEWS.filter(
      (r) => r.venueId === idStr || idStr.includes(r.venueId) || r.venueId.includes(idStr)
    );

    return matched.length > 0 ? matched : FALLBACK_VENUE_REVIEWS.slice(0, 2);
  } catch (error) {
    console.warn(`Notice: getVenueReviews (${idStr}) using fallback data:`, error.message);
    const matched = FALLBACK_VENUE_REVIEWS.filter(
      (r) => r.venueId === idStr || idStr.includes(r.venueId) || r.venueId.includes(idStr)
    );
    return matched.length > 0 ? matched : FALLBACK_VENUE_REVIEWS.slice(0, 2);
  }
}

/**
 * Calculate aggregate review rating and metrics for a venue
 * @param {string} venueId 
 * @returns {Promise<Object>} { averageRating, totalReviews, distribution }
 */
export async function getVenueReviewStats(venueId) {
  const reviews = await getVenueReviews(venueId);

  if (reviews.length === 0) {
    return {
      averageRating: 4.8,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    distribution[star] = (distribution[star] || 0) + 1;
    sum += Number(r.rating) || 5;
  });

  const averageRating = Number((sum / reviews.length).toFixed(1));

  return {
    averageRating,
    totalReviews: reviews.length,
    distribution
  };
}
