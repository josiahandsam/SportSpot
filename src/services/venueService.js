import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { createVenueDoc } from '../models/schemas.js';

const VENUES_COLLECTION = 'venues';

// Complete, standard baseline mock venues (preserves existing mock data for zero-breakage migration)
export const FALLBACK_MOCK_VENUES = [
  createVenueDoc({
    id: 'venue_1',
    name: 'Elite Football Arena',
    location: 'Coimbatore',
    address: 'Avinashi Road, Peelamedu, Coimbatore',
    distanceKm: 1.8,
    distance: '1.8 km',
    sport: 'Football',
    sports: ['Football'],
    rating: 4.8,
    reviewCount: 126,
    priceNum: 800,
    price: '₹800 / hour',
    venueType: 'Outdoor',
    facilities: ['Parking', 'Floodlights', 'Locker Rooms', 'Equipment', 'Snack Bar'],
    amenities: 'FIFA Quality Turf, Floodlights, Locker Rooms, Cafe & Parking.',
    availability: 'Available',
    timeSlot: '6:00 PM – 8:00 PM',
    image: '/images/venue_football.jpg',
    status: 'active'
  }),
  createVenueDoc({
    id: 'venue_2',
    name: 'Urban Turf Arena',
    location: 'Coimbatore',
    address: 'Saravanampatti, Coimbatore',
    distanceKm: 3.2,
    distance: '3.2 km',
    sport: 'Football',
    sports: ['Football'],
    rating: 4.6,
    reviewCount: 84,
    priceNum: 700,
    price: '₹700 / hour',
    venueType: 'Covered',
    facilities: ['Parking', 'Floodlights', 'Locker Rooms'],
    amenities: 'All-weather covered turf, shower rooms, free parking.',
    availability: 'Few slots left',
    timeSlot: '5:00 PM – 7:00 PM',
    image: '/images/card_football.jpg',
    status: 'active'
  }),
  createVenueDoc({
    id: 'venue_3',
    name: 'Smash Badminton Club',
    location: 'Coimbatore',
    address: 'Race Course, Coimbatore',
    distanceKm: 2.4,
    distance: '2.4 km',
    sport: 'Badminton',
    sports: ['Badminton'],
    rating: 4.9,
    reviewCount: 195,
    priceNum: 450,
    price: '₹450 / hour',
    venueType: 'Indoor',
    facilities: ['Locker Rooms', 'Equipment', 'Snack Bar'],
    amenities: '6 BWF Synthetic Courts, Air Conditioned, Pro Shop & Lounge.',
    availability: 'Available',
    timeSlot: '6:00 PM – 8:00 PM',
    image: '/images/venue_badminton.jpg',
    status: 'active'
  }),
  createVenueDoc({
    id: 'venue_4',
    name: 'Grand Slam Tennis Academy',
    location: 'Coimbatore',
    address: 'Gandhipuram, Coimbatore',
    distanceKm: 4.5,
    distance: '4.5 km',
    sport: 'Tennis',
    sports: ['Tennis'],
    rating: 4.7,
    reviewCount: 62,
    priceNum: 650,
    price: '₹650 / hour',
    venueType: 'Outdoor',
    facilities: ['Parking', 'Floodlights', 'Equipment'],
    amenities: 'Night Floodlit Hard Courts, Ball Machine Rental, Coaching.',
    availability: 'Available',
    timeSlot: '7:00 PM – 9:00 PM',
    image: '/images/venue_tennis.jpg',
    status: 'active'
  }),
  createVenueDoc({
    id: 'venue_5',
    name: 'Apex Basketball Arena',
    location: 'Coimbatore',
    address: 'R.S. Puram, Coimbatore',
    distanceKm: 1.2,
    distance: '1.2 km',
    sport: 'Basketball',
    sports: ['Basketball'],
    rating: 4.8,
    reviewCount: 110,
    priceNum: 700,
    price: '₹700 / hour',
    venueType: 'Indoor',
    facilities: ['Parking', 'Locker Rooms', 'Snack Bar'],
    amenities: 'Indoor Wooden Flooring, Glass Backboards, Scoreboard.',
    availability: 'Available',
    timeSlot: '6:00 PM – 8:00 PM',
    image: '/images/venue_basketball.jpg',
    status: 'active'
  }),
  createVenueDoc({
    id: 'venue_6',
    name: 'Greenfield Sports Hub',
    location: 'Coimbatore',
    address: 'Singanallur, Coimbatore',
    distanceKm: 4.1,
    distance: '4.1 km',
    sport: 'Cricket',
    sports: ['Cricket'],
    rating: 4.7,
    reviewCount: 78,
    priceNum: 900,
    price: '₹900 / hour',
    venueType: 'Outdoor',
    facilities: ['Parking', 'Floodlights', 'Equipment', 'Snack Bar'],
    amenities: 'Natural turf box cricket pitch, floodlit boundary nets, kit rental.',
    availability: 'Available',
    timeSlot: '6:00 PM – 8:00 PM',
    image: '/images/card_cricket.jpg',
    status: 'active'
  }),
  createVenueDoc({
    id: 'venue_7',
    name: 'ProKick Soccer Turf',
    location: 'Coimbatore',
    address: 'Kalapatti, Coimbatore',
    distanceKm: 1.4,
    distance: '1.4 km',
    sport: 'Football',
    sports: ['Football'],
    rating: 4.8,
    reviewCount: 93,
    priceNum: 820,
    price: '₹820 / hour',
    venueType: 'Covered',
    facilities: ['Parking', 'Floodlights', 'Locker Rooms', 'Equipment'],
    amenities: 'Monofilament turf, dugouts, HD replay cameras, hydration station.',
    availability: 'Available',
    timeSlot: '6:00 PM – 8:00 PM',
    image: '/images/stadium_wide.jpg',
    status: 'active'
  }),
  createVenueDoc({
    id: 'venue_8',
    name: 'Champions Pitch Club',
    location: 'Coimbatore',
    address: 'Vadavalli, Coimbatore',
    distanceKm: 3.8,
    distance: '3.8 km',
    sport: 'Football',
    sports: ['Football'],
    rating: 4.7,
    reviewCount: 51,
    priceNum: 750,
    price: '₹750 / hour',
    venueType: 'Outdoor',
    facilities: ['Floodlights', 'Locker Rooms', 'Snack Bar'],
    amenities: 'Fast-paced 5v5 turf, floodlights, sports cafe.',
    availability: 'Few slots left',
    timeSlot: '8:00 PM – 10:00 PM',
    image: '/images/card_football.jpg',
    status: 'active'
  }),
  createVenueDoc({
    id: 'venue_9',
    name: 'Velocity Sports Park',
    location: 'Coimbatore',
    address: 'Thudiyalur, Coimbatore',
    distanceKm: 2.9,
    distance: '2.9 km',
    sport: 'Football',
    sports: ['Football', 'Badminton'],
    rating: 4.9,
    reviewCount: 142,
    priceNum: 780,
    price: '₹780 / hour',
    venueType: 'Indoor',
    facilities: ['Parking', 'Floodlights', 'Locker Rooms', 'Equipment', 'Snack Bar'],
    amenities: 'Multi-sport arena, high ceiling, spectator gallery.',
    availability: 'Available',
    timeSlot: '6:00 PM – 8:00 PM',
    image: '/images/venue_football.jpg',
    status: 'active'
  }),
  createVenueDoc({
    id: 'venue_10',
    name: 'ThunderTurf Ground',
    location: 'Chennai',
    address: 'OMR, Chennai',
    distanceKm: 4.5,
    distance: '4.5 km',
    sport: 'Football',
    sports: ['Football'],
    rating: 4.7,
    reviewCount: 88,
    priceNum: 720,
    price: '₹720 / hour',
    venueType: 'Outdoor',
    facilities: ['Parking', 'Floodlights', 'Snack Bar'],
    amenities: '7v7 regulation football turf, LED floodlights, sound system.',
    availability: 'Available',
    timeSlot: '6:00 PM – 8:00 PM',
    image: '/images/card_football.jpg',
    status: 'active'
  }),
  createVenueDoc({
    id: 'venue_11',
    name: 'Strikers Arena',
    location: 'Chennai',
    address: 'Adyar, Chennai',
    distanceKm: 3.0,
    distance: '3.0 km',
    sport: 'Football',
    sports: ['Football'],
    rating: 4.8,
    reviewCount: 104,
    priceNum: 880,
    price: '₹880 / hour',
    venueType: 'Covered',
    facilities: ['Parking', 'Floodlights', 'Locker Rooms'],
    amenities: 'Weatherproof roof, FIFA approved infill, changing rooms.',
    availability: 'Available',
    timeSlot: '7:00 PM – 9:00 PM',
    image: '/images/stadium_wide.jpg',
    status: 'active'
  }),
  createVenueDoc({
    id: 'venue_12',
    name: 'Premier Turf Club',
    location: 'Bangalore',
    address: 'Indiranagar, Bangalore',
    distanceKm: 5.0,
    distance: '5.0 km',
    sport: 'Football',
    sports: ['Football'],
    rating: 4.9,
    reviewCount: 167,
    priceNum: 900,
    price: '₹900 / hour',
    venueType: 'Outdoor',
    facilities: ['Parking', 'Floodlights', 'Locker Rooms', 'Equipment', 'Snack Bar'],
    amenities: 'Premium astroturf, lounge, pro-shop, juice bar, shower suites.',
    availability: 'Available',
    timeSlot: '6:00 PM – 8:00 PM',
    image: '/images/turf_macro.jpg',
    status: 'active'
  })
];

/**
 * List active venues from Firestore
 * 
 * By default, queries live Firestore data. When fallbackOnError is false (default),
 * genuine Firestore errors (e.g. permission-denied, unavailable) are thrown to
 * allow the UI to present real error states rather than silently masking them.
 * 
 * @param {Object} [options]
 * @param {string} [options.status='active']
 * @param {number} [options.maxResults=50]
 * @param {boolean} [options.fallbackOnEmpty=false] - When true, returns fallback mock data if collection has 0 docs
 * @param {boolean} [options.fallbackOnError=false] - When true, suppresses errors and returns fallback mock data
 * @returns {Promise<Array>}
 */
export async function getVenues({
  status = 'active',
  maxResults = 50,
  fallbackOnEmpty = false,
  fallbackOnError = false
} = {}) {
  try {
    const venuesRef = collection(db, VENUES_COLLECTION);
    const q = query(
      venuesRef,
      where('status', '==', status),
      limit(maxResults)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    }

    // If Firestore collection is empty
    if (fallbackOnEmpty) {
      return FALLBACK_MOCK_VENUES.filter((v) => v.status === status);
    }

    return [];
  } catch (error) {
    if (fallbackOnError) {
      console.warn('Notice: Firestore venue listing used fallback mock data:', error.message);
      return FALLBACK_MOCK_VENUES.filter((v) => v.status === status);
    }
    // Propagate the real Firestore error so caller can display the error state
    throw error;
  }
}

/**
 * Retrieve a specific venue by its ID from Firestore (or fallback mock)
 * @param {string|number} venueId 
 * @returns {Promise<Object|null>}
 */
export async function getVenueById(venueId) {
  if (!venueId) return null;

  const idStr = String(venueId);

  try {
    const venueRef = doc(db, VENUES_COLLECTION, idStr);
    const snap = await getDoc(venueRef);

    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }

    // Try finding by ID or numeric ID in fallback mock venues
    const match = FALLBACK_MOCK_VENUES.find(
      (v) => String(v.id) === idStr || v.slug === idStr || String(v.id) === `venue_${idStr}`
    );

    return match || null;
  } catch (error) {
    console.warn(`Notice: getVenueById (${idStr}) using fallback data:`, error.message);
    const match = FALLBACK_MOCK_VENUES.find(
      (v) => String(v.id) === idStr || v.slug === idStr || String(v.id) === `venue_${idStr}`
    );
    return match || null;
  }
}

/**
 * Search venues by location, sport, and optional filters
 * @param {Object} params
 * @param {string} [params.location] - City name e.g. 'Coimbatore'
 * @param {string} [params.sport] - Sport name e.g. 'Football'
 * @param {number} [params.maxPrice] - Max price ceiling
 * @param {number} [params.minRating] - Min rating threshold
 * @param {string} [params.venueType] - 'Indoor' | 'Outdoor' | 'Covered' | 'All'
 * @param {Array<string>} [params.facilities] - List of required facility tags
 * @returns {Promise<Array>}
 */
export async function searchVenues({
  location,
  sport,
  maxPrice,
  minRating,
  venueType,
  facilities = [],
  fallbackOnError = true,
  fallbackOnEmpty = true
} = {}) {
  // Retrieve candidate active venues
  const allVenues = await getVenues({ status: 'active', fallbackOnError, fallbackOnEmpty });

  return allVenues.filter((v) => {
    // 1. Location match (case-insensitive)
    if (location && location.trim() !== '') {
      const locQuery = location.trim().toLowerCase();
      const vLoc = (v.location || '').toLowerCase();
      if (!vLoc.includes(locQuery) && !locQuery.includes(vLoc)) {
        return false;
      }
    }

    // 2. Sport match
    if (sport && sport.trim() !== '') {
      const sportQuery = sport.trim().toLowerCase();
      const vSport = (v.sport || '').toLowerCase();
      const vSports = Array.isArray(v.sports) ? v.sports.map((s) => s.toLowerCase()) : [];
      const vName = (v.name || '').toLowerCase();

      const matchesSport =
        vSport === sportQuery ||
        vSport.includes(sportQuery) ||
        vSports.includes(sportQuery) ||
        vName.includes(sportQuery);

      if (!matchesSport) {
        // Activity/Environment keyword fallback
        if (sportQuery === 'indoor' && (v.venueType === 'Indoor' || v.venueType === 'Covered')) {
          // match
        } else if (sportQuery === 'outdoor' && (v.venueType === 'Outdoor' || v.venueType === 'Covered')) {
          // match
        } else {
          return false;
        }
      }
    }

    // 3. Price filter
    if (typeof maxPrice === 'number' && maxPrice > 0) {
      const price = typeof v.pricePerHour === 'number' ? v.pricePerHour : (v.priceNum || 800);
      if (price > maxPrice) return false;
    }

    // 4. Rating filter
    if (typeof minRating === 'number' && minRating > 0) {
      if ((v.rating || 0) < minRating) return false;
    }

    // 5. Venue Type filter
    if (venueType && venueType !== 'All') {
      if (v.venueType !== venueType) return false;
    }

    // 6. Facilities filter
    if (Array.isArray(facilities) && facilities.length > 0) {
      const vFacilities = Array.isArray(v.facilities) ? v.facilities : [];
      const hasAll = facilities.every((f) => vFacilities.includes(f));
      if (!hasAll) return false;
    }

    return true;
  });
}
