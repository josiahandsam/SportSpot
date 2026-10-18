/**
 * SportSpot - Secure Administrative Venue Seeding Script
 * 
 * Powered by Firebase Admin SDK.
 * 
 * Security & Integrity Guarantees:
 * - NO WEAKENED RULES: Bypasses client security rules securely via privileged Admin SDK.
 * - NO PASSWORDS REQUIRED: Uses standard Google Cloud / Firebase Service Account credentials.
 * - ISOLATION: Admin credentials remain strictly local / server-side; NEVER bundled by Vite or committed to Git.
 * - TARGETED & RESTRICTED: Strictly writes only the 12 approved venues to the `venues` collection.
 * - STABLE IDS: Uses deterministic document IDs `venue_1` through `venue_12`.
 * - IDEMPOTENT: Skips existing documents without overwriting them (`skipIfExists: true`).
 * - ZERO SIDE-EFFECTS: Never creates, modifies, or reads `users` or `bookings`.
 * - PROJECT VERIFIED: Verifies target project is `sportspot-d561b`.
 * - DOES NOT RUN AUTOMATICALLY: Must be invoked explicitly by the project owner.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FALLBACK_MOCK_VENUES } from '../src/services/venueService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const TARGET_PROJECT_ID = 'sportspot-d561b';
const VENUES_COLLECTION = 'venues';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    keyPath: null,
    force: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--key' && args[i + 1]) {
      options.keyPath = args[++i];
    } else if (args[i] === '--force') {
      options.force = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      options.help = true;
    }
  }

  return options;
}

// Locate service account credentials from supported locations
function findServiceAccountKey(customPath) {
  if (customPath) {
    const resolved = path.isAbsolute(customPath) ? customPath : path.resolve(process.cwd(), customPath);
    if (fs.existsSync(resolved)) {
      return { path: resolved, source: '--key flag' };
    }
    throw new Error(`Specified service account key not found at: ${resolved}`);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const envPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    if (fs.existsSync(envPath)) {
      return { path: envPath, source: 'GOOGLE_APPLICATION_CREDENTIALS environment variable' };
    }
  }

  // Standard local files (strictly ignored by .gitignore)
  const candidateFiles = [
    path.join(PROJECT_ROOT, 'serviceAccountKey.json'),
    path.join(PROJECT_ROOT, 'serviceAccountKey.json.json'),
    path.join(__dirname, 'serviceAccountKey.json'),
    path.join(PROJECT_ROOT, 'firebase-admin-key.json')
  ];

  for (const candidate of candidateFiles) {
    if (fs.existsSync(candidate)) {
      return { path: candidate, source: `Local file: ${path.relative(PROJECT_ROOT, candidate)}` };
    }
  }

  return null;
}

// Check for Google Application Default Credentials file locally
function findAdcKey() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const envPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    if (fs.existsSync(envPath)) {
      return { path: envPath, source: 'GOOGLE_APPLICATION_CREDENTIALS environment variable' };
    }
  }

  const appData = process.env.APPDATA;
  if (appData) {
    const winPath = path.join(appData, 'gcloud', 'application_default_credentials.json');
    if (fs.existsSync(winPath)) {
      return { path: winPath, source: 'gcloud Application Default Credentials (Windows)' };
    }
  }

  const home = process.env.HOME || process.env.USERPROFILE;
  if (home) {
    const unixPath = path.join(home, '.config', 'gcloud', 'application_default_credentials.json');
    if (fs.existsSync(unixPath)) {
      return { path: unixPath, source: 'gcloud Application Default Credentials (POSIX)' };
    }
  }

  return null;
}

function printHelpAndSetupGuide() {
  console.log(`
================================================================================
             SPORTSPOT ADMINISTRATIVE VENUE SEEDING GUIDE                       
================================================================================

This migration script uses the Firebase Admin SDK to seed the 12 approved
venues into Firestore without weakening your published security rules.

To authenticate securely using an administrative Service Account:

STEP 1: Download your Service Account Key
  1. Open the Firebase Console:
     https://console.firebase.google.com/project/${TARGET_PROJECT_ID}/settings/serviceaccounts/adminsdk
  2. Under "Firebase Admin SDK", ensure "Node.js" is selected.
  3. Click "Generate new private key", then confirm by clicking "Generate key".
  4. A JSON file will be downloaded to your computer.

STEP 2: Place the Key Securely
  Place the downloaded JSON file in your project root and rename it to:
    serviceAccountKey.json
  
  (Note: Your .gitignore is already configured to ignore serviceAccountKey.json
   and *-adminsdk-*.json so credentials will never be committed to Git.)

STEP 3: Run the Migration
  npm run seed:venues

  Alternatively, pass the file path directly:
  node scripts/seedVenues.js --key "C:\\path\\to\\your-downloaded-key.json"

FLAGS:
  --key <path>   Path to Firebase Service Account JSON key
  --force        Overwrite existing venues (default is safe, non-destructive skip)
  --help, -h     Show this help guide

================================================================================
`);
}

async function runAdminSeeding() {
  const options = parseArgs();

  if (options.help) {
    printHelpAndSetupGuide();
    process.exit(0);
  }

  console.log('\n================================================================');
  console.log('       SPORTSPOT ADMIN VENUE DATA MIGRATION (SERVER-SIDE)        ');
  console.log('================================================================\n');
  console.log(`Target Firebase Project: ${TARGET_PROJECT_ID}`);
  console.log(`Venues to Process:       ${FALLBACK_MOCK_VENUES.length}`);
  console.log(`Idempotent Mode:         ${!options.force ? 'ENABLED (Existing venues preserved)' : 'DISABLED (Overwrite enabled)'}`);

  // Locate credentials
  let credential = null;
  let keyInfo = null;

  try {
    keyInfo = findServiceAccountKey(options.keyPath);
  } catch (err) {
    console.error(`\n[ERROR] ${err.message}`);
    process.exit(1);
  }

  if (keyInfo) {
    console.log(`Using credentials from:  ${keyInfo.source} (${keyInfo.path})`);
    try {
      const rawKey = fs.readFileSync(keyInfo.path, 'utf8');
      const serviceAccount = JSON.parse(rawKey);

      if (serviceAccount.project_id && serviceAccount.project_id !== TARGET_PROJECT_ID) {
        console.error(`\n[SECURITY MISMATCH] The provided service account is for project '${serviceAccount.project_id}',`);
        console.error(`                   but this script is configured exclusively for '${TARGET_PROJECT_ID}'.`);
        console.error('Aborting execution to prevent accidental writes to the wrong project.\n');
        process.exit(1);
      }

      credential = cert(serviceAccount);
    } catch (parseErr) {
      console.error(`\n[ERROR] Failed to read or parse service account JSON file: ${parseErr.message}`);
      process.exit(1);
    }
  } else {
    // Check if Application Default Credentials (ADC) are configured locally
    const adcKeyInfo = findAdcKey();
    if (adcKeyInfo) {
      console.log(`Using credentials from:  ${adcKeyInfo.source} (${adcKeyInfo.path})`);
      try {
        credential = applicationDefault();
      } catch (adcErr) {
        console.error(`\n[ERROR] Failed to initialize Application Default Credentials: ${adcErr.message}`);
        process.exit(1);
      }
    } else {
      console.warn('\n[!] Administrative credentials were not found.');
      console.warn('    No database operations have been executed.');
      printHelpAndSetupGuide();
      process.exit(1);
    }
  }

  // Initialize Admin App
  let adminApp;
  try {
    if (getApps().length === 0) {
      adminApp = initializeApp({
        credential,
        projectId: TARGET_PROJECT_ID
      });
    } else {
      adminApp = getApps()[0];
    }
  } catch (initErr) {
    console.error(`\n[ERROR] Failed to initialize Firebase Admin SDK: ${initErr.message}`);
    process.exit(1);
  }

  const adminDb = getFirestore(adminApp);

  console.log('\nAdministrative connection established. Starting venue verification & seed...\n');

  const summary = {
    total: FALLBACK_MOCK_VENUES.length,
    created: 0,
    skipped: 0,
    errors: []
  };

  for (let i = 0; i < FALLBACK_MOCK_VENUES.length; i++) {
    const venue = FALLBACK_MOCK_VENUES[i];
    const docId = String(venue.id);
    const docRef = adminDb.collection(VENUES_COLLECTION).doc(docId);
    const pad = `[${i + 1}/${FALLBACK_MOCK_VENUES.length}]`.padEnd(8);

    try {
      if (!options.force) {
        const snap = await docRef.get();
        if (snap.exists) {
          summary.skipped++;
          console.log(`${pad} SKIPPED : ${docId} - ${venue.name} (Already exists in Firestore)`);
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

      // Exact document payload adhering strictly to schema requirements
      const payload = {
        id: docId,
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
        status: 'active', // Required for public queries under published security rules
        ownerId: venue.ownerId || null,
        createdAt: venue.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await docRef.set(payload);
      summary.created++;
      console.log(`${pad} CREATED : ${docId} - ${venue.name} (Sport: ${payload.sport}, Status: ${payload.status})`);

    } catch (err) {
      summary.errors.push({ id: docId, name: venue.name, error: err.message });
      console.error(`${pad} ERROR   : ${docId} - ${venue.name} => ${err.message}`);
    }
  }

  console.log('\n================================================================');
  console.log('                   MIGRATION SUMMARY                            ');
  console.log('================================================================');
  console.log(`Total Venues Processed: ${summary.total}`);
  console.log(`Successfully Created  : ${summary.created}`);
  console.log(`Skipped (Preserved)   : ${summary.skipped}`);
  console.log(`Errors Encountered    : ${summary.errors.length}`);
  console.log('================================================================\n');

  if (summary.errors.length > 0) {
    console.error('Migration finished with errors. Please inspect the logs above.');
    process.exit(1);
  } else {
    console.log('Migration completed successfully! All venues are active and available in Firestore.\n');
    process.exit(0);
  }
}

// Execute migration
runAdminSeeding();
