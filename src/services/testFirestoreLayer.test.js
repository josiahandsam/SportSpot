import {
  sanitizeUserProfileUpdate,
  createUserProfileDoc,
  createVenueDoc,
  createBookingDoc,
  createReviewDoc,
  USER_IMMUTABLE_FIELDS,
  USER_PERMITTED_UPDATE_FIELDS
} from '../models/schemas.js';

import {
  FALLBACK_MOCK_VENUES,
  searchVenues,
  getVenueById
} from './venueService.js';

import { createBooking, cancelUserBooking, isBookingPast } from './bookingService.js';
import { FALLBACK_VENUE_REVIEWS, getVenueReviewStats } from './reviewService.js';
import { getAuthErrorMessage } from '../utils/authErrors.js';

console.log('--- RUNNING FIRESTORE DATA ACCESS LAYER TESTS ---');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failed++;
  }
}

// 1. User Schema Security Tests
try {
  const profile = createUserProfileDoc({ uid: 'test-uid-123', email: 'player@example.com', name: 'John Player' });
  assert(profile.role === 'user', 'User profile role defaults securely to "user"');
  assert(profile.uid === 'test-uid-123', 'User profile UID is set correctly');
  assert(profile.email === 'player@example.com', 'User email is normalized');

  // Test permitted updates
  const validUpdates = sanitizeUserProfileUpdate({ phone: '+91 9876543210', preferredCity: 'Chennai' });
  assert(validUpdates.phone === '+91 9876543210', 'Permitted phone update allowed');
  assert(validUpdates.preferredCity === 'Chennai', 'Permitted preferredCity update allowed');

  // Test prohibited privilege escalation
  let roleTamperCaught = false;
  try {
    sanitizeUserProfileUpdate({ role: 'admin' });
  } catch (err) {
    roleTamperCaught = true;
  }
  assert(roleTamperCaught, 'Attempt to change role to admin throws Security Violation error');

  let uidTamperCaught = false;
  try {
    sanitizeUserProfileUpdate({ uid: 'other-user-uid' });
  } catch (err) {
    uidTamperCaught = true;
  }
  assert(uidTamperCaught, 'Attempt to mutate UID throws Security Violation error');

  // Google Profile Creation & Error Mapping Tests
  const googleProfile = createUserProfileDoc({
    uid: 'google-uid-456',
    email: 'googler@example.com',
    name: 'Google User'
  });
  assert(googleProfile.role === 'user', 'Google user profile role strictly defaults to "user"');
  assert(googleProfile.uid === 'google-uid-456', 'Google profile UID mapped accurately');
  assert(googleProfile.email === 'googler@example.com', 'Google profile email normalized');

  // Verify auth error mappings for popup flows
  const popupClosedMsg = getAuthErrorMessage({ code: 'auth/popup-closed-by-user' });
  assert(popupClosedMsg.includes('closed before completion'), 'Popup closed error maps to helpful message');

  const popupBlockedMsg = getAuthErrorMessage({ code: 'auth/popup-blocked' });
  assert(popupBlockedMsg.includes('blocked'), 'Popup blocked error maps to helpful message');

  const unauthDomainMsg = getAuthErrorMessage({ code: 'auth/unauthorized-domain' });
  assert(unauthDomainMsg.includes('Authorized domains'), 'Unauthorized domain error gives setup guidance');
} catch (e) {
  console.error('User test error:', e);
  failed++;
}

// 2. Venue Data & Search Tests
try {
  assert(FALLBACK_MOCK_VENUES.length === 12, 'Fallback mock venues contains 12 verified venues');
  const allActive = FALLBACK_MOCK_VENUES.every(v => v.status === 'active');
  assert(allActive, 'All baseline venues have status: "active"');

  const singleVenue = await getVenueById('venue_1');
  assert(singleVenue && singleVenue.name === 'Elite Football Arena', 'getVenueById retrieves correct venue document');

  const coimbatoreFootball = await searchVenues({ location: 'Coimbatore', sport: 'Football' });
  assert(coimbatoreFootball.length > 0, 'searchVenues finds Coimbatore Football venues');
  const allMatch = coimbatoreFootball.every(v => v.location === 'Coimbatore' && (v.sport === 'Football' || v.sports.includes('Football')));
  assert(allMatch, 'searchVenues results accurately match location and sport criteria');

  const budgetVenues = await searchVenues({ maxPrice: 700 });
  assert(budgetVenues.every(v => v.pricePerHour <= 700), 'searchVenues filters by maxPrice ceiling correctly');
} catch (e) {
  console.error('Venue test error:', e);
  failed++;
}

// 3. Booking Schema & Flow Security Tests
try {
  const booking = createBookingDoc({
    userId: 'usr_test_999',
    venueName: 'Elite Football Arena',
    pricePerHour: 800,
    date: 'September 10, 2026',
    timeSlot: '6:00 PM – 8:00 PM'
  });
  assert(booking.userId === 'usr_test_999', 'Booking document stores userId');
  assert(booking.status === 'Confirmed', 'Booking status defaults to Confirmed');
  assert(booking.totalPrice === 840, 'Booking calculates totalPrice (800 + 40 platform fee)');
  assert(booking.venue === 'Elite Football Arena' && booking.venueName === 'Elite Football Arena', 'Booking aliases venue and venueName correctly');
  assert(booking.time === '6:00 PM – 8:00 PM' && booking.timeSlot === '6:00 PM – 8:00 PM', 'Booking aliases time and timeSlot correctly');

  let missingUserCaught = false;
  try {
    createBookingDoc({ venueName: 'Elite Football Arena' });
  } catch (err) {
    missingUserCaught = true;
  }
  assert(missingUserCaught, 'Booking without userId throws validation error');

  // Verify createBooking strictly requires authentication
  let unauthCaught = false;
  try {
    await createBooking({ venueName: 'Elite Football Arena' }, null);
  } catch (err) {
    unauthCaught = true;
  }
  assert(unauthCaught, 'createBooking strictly enforces authentication requirement');

  // Verify cancelUserBooking requires both parameters
  let missingCancelParamCaught = false;
  try {
    await cancelUserBooking(null, 'usr_test_999');
  } catch (err) {
    missingCancelParamCaught = true;
  }
  assert(missingCancelParamCaught, 'cancelUserBooking rejects requests missing bookingId');

  // Test isBookingPast helper
  assert(isBookingPast('January 1, 2020') === true, 'isBookingPast identifies historical date as past');
  assert(isBookingPast('December 31, 2099') === false, 'isBookingPast identifies future date as upcoming');
} catch (e) {
  console.error('Booking test error:', e);
  failed++;
}

// 4. Review Schema & Stats Tests
try {
  const review = createReviewDoc({
    venueId: 'venue_1',
    userId: 'usr_test_999',
    userName: 'Karthik',
    rating: 5,
    comment: 'Superb grass turf!'
  });
  assert(review.rating === 5, 'Review rating validated');
  assert(review.venueId === 'venue_1', 'Review venueId assigned');

  const stats = await getVenueReviewStats('venue_1');
  assert(stats.averageRating >= 4.0, 'Review stats computes realistic average rating');
  assert(typeof stats.totalReviews === 'number', 'Review stats computes totalReviews count');
} catch (e) {
  console.error('Review test error:', e);
  failed++;
}

console.log(`\nTEST SUMMARY: ${passed} Passed, ${failed} Failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL FIRESTORE DATA ACCESS LAYER TESTS PASSED SUCCESSFULLY.');
  process.exit(0);
}
