import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { FALLBACK_MOCK_VENUES } from './venueService.js';

const VENUES_COLLECTION = 'venues';

/**
 * Safe, idempotent venue data migration procedure
 * 
 * Safety guarantees:
 * 1. NEVER touches or overwrites the `users` collection.
 * 2. NEVER creates fake users or bookings.
 * 3. NEVER overwrites existing venue documents if `skipIfExists: true`.
 * 4. NEVER executes automatically upon import.
 * 5. Strictly seeds valid, active venue documents containing:
 *    - name, sport, sports, location, address, pricePerHour, rating, facilities, images, image, status ('active')
 * 
 * @param {Object} [options]
 * @param {boolean} [options.skipIfExists=true] - When true, does not overwrite existing venues in Firestore
 * @param {Function} [options.onProgress] - Optional callback receiving progress events
 * @returns {Promise<Object>} Summary of operations: { success, total, created, skipped, errors }
 */
export async function seedInitialVenues({ skipIfExists = true, onProgress = null } = {}) {
  const summary = {
    total: FALLBACK_MOCK_VENUES.length,
    created: 0,
    skipped: 0,
    errors: [],
    details: []
  };

  for (let index = 0; index < FALLBACK_MOCK_VENUES.length; index++) {
    const venue = FALLBACK_MOCK_VENUES[index];
    const venueDocRef = doc(db, VENUES_COLLECTION, venue.id);

    try {
      if (skipIfExists) {
        const snap = await getDoc(venueDocRef);
        if (snap.exists()) {
          summary.skipped += 1;
          const detail = { id: venue.id, name: venue.name, action: 'skipped', reason: 'Already exists in Firestore' };
          summary.details.push(detail);
          if (onProgress) onProgress(detail, index + 1, summary.total);
          continue;
        }
      }

      const primaryImage = venue.image || '/images/venue_football.jpg';
      const imagesList = Array.isArray(venue.images) && venue.images.length > 0
        ? venue.images
        : [
            primaryImage,
            '/images/card_football.jpg',
            '/images/stadium_wide.jpg',
            '/images/turf_macro.jpg',
            '/images/venue_football_5.jpg'
          ];

      // Ensure all required fields and schema constraints are strictly present
      const payload = {
        id: venue.id,
        name: venue.name,
        slug: venue.slug || venue.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        sport: venue.sport,
        sports: Array.isArray(venue.sports) && venue.sports.length > 0 ? venue.sports : [venue.sport],
        location: venue.location,
        address: venue.address || `${venue.location || 'Coimbatore'}`,
        distanceKm: typeof venue.distanceKm === 'number' ? venue.distanceKm : 2.0,
        distance: venue.distance || `${venue.distanceKm || 2.0} km`,
        rating: typeof venue.rating === 'number' ? venue.rating : 4.8,
        reviewCount: typeof venue.reviewCount === 'number' ? venue.reviewCount : 100,
        pricePerHour: typeof venue.pricePerHour === 'number' ? venue.pricePerHour : (venue.priceNum || 800),
        price: venue.price || `₹${venue.pricePerHour || venue.priceNum || 800} / hour`,
        priceFormatted: venue.priceFormatted || venue.price || `₹${venue.pricePerHour || venue.priceNum || 800} / hour`,
        venueType: venue.venueType || 'Outdoor',
        facilities: Array.isArray(venue.facilities) && venue.facilities.length > 0
          ? venue.facilities
          : ['Parking', 'Floodlights', 'Locker Rooms'],
        amenitiesDescription: venue.amenitiesDescription || venue.amenities || '',
        image: primaryImage,
        images: imagesList,
        gallery: imagesList,
        operatingHours: venue.operatingHours || {
          open: '06:00 AM',
          close: '11:00 PM',
          slotDurationMinutes: 120
        },
        status: 'active', // Required for public read queries under published security rules
        ownerId: venue.ownerId || null,
        createdAt: venue.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(venueDocRef, payload);
      summary.created += 1;
      const detail = { id: venue.id, name: venue.name, action: 'created', status: 'active' };
      summary.details.push(detail);
      if (onProgress) onProgress(detail, index + 1, summary.total);

    } catch (err) {
      const errDetail = { id: venue.id, name: venue.name, action: 'error', error: err.message };
      summary.errors.push(errDetail);
      summary.details.push(errDetail);
      if (onProgress) onProgress(errDetail, index + 1, summary.total);
    }
  }

  const isSuccess = summary.errors.length === 0;
  return {
    success: isSuccess,
    ...summary
  };
}

// Backward-compatible alias
export const seedVenuesAndReviews = seedInitialVenues;
