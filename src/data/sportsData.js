// SportSpot Sports Discovery Hub Data
export const sportsData = [
  {
    id: 'football',
    slug: 'football',
    name: 'Football',
    category: 'Turf & Fields',
    cardImage: '/images/card_football.jpg',
    heroImage: '/images/venue_football.jpg',
    bannerImage: '/images/stadium_wide.jpg',
    tagline: "THE WORLD'S GAME",
    subtitle: "From friendly matches to competitive leagues, find the best FIFA-quality artificial turf and floodlit pitches near you.",
    formats: ['5-a-side', '7-a-side', '11-a-side'],
    venueTypes: ['Indoor', 'Outdoor', 'Floodlit Arena'],
    stats: {
      venues: '120+',
      players: '5K+',
      rating: '4.8',
      safety: '100% Verified'
    },
    sampleVenues: [
      {
        id: 1,
        name: 'Elite Football Arena',
        location: 'Coimbatore',
        sport: 'Football',
        rating: '4.8',
        price: '₹800/hr',
        amenities: 'FIFA Quality Turf, Floodlights, Locker Rooms, Cafe & Parking.',
        image: '/images/venue_football.jpg'
      },
      {
        id: 2,
        name: 'Urban Turf Arena',
        location: 'Coimbatore',
        sport: 'Football',
        rating: '4.6',
        price: '₹700/hr',
        amenities: 'Covered Turf, High intensity floodlights, changing rooms.',
        image: '/images/card_football.jpg'
      },
      {
        id: 7,
        name: 'ProKick Soccer Turf',
        location: 'Coimbatore',
        sport: 'Football',
        rating: '4.8',
        price: '₹820/hr',
        amenities: 'FIFA approved surface, locker rooms, pro shop.',
        image: '/images/stadium_wide.jpg'
      },
      {
        id: 9,
        name: 'Velocity Sports Park',
        location: 'Coimbatore',
        sport: 'Football',
        rating: '4.9',
        price: '₹780/hr',
        amenities: 'Indoor synthetic grass, spectators seating area.',
        image: '/images/turf_macro.jpg'
      }
    ]
  },
  {
    id: 'cricket',
    slug: 'cricket',
    name: 'Cricket',
    category: 'Pitches & Arenas',
    cardImage: '/images/card_cricket.jpg',
    heroImage: '/images/card_cricket.jpg',
    bannerImage: '/images/stadium_wide.jpg',
    tagline: "GENTLEMAN'S GAME",
    subtitle: "Experience top-tier box cricket nets, turf pitches, and indoor bowling machines designed for explosive action.",
    formats: ['Box Cricket', 'Net Practice', 'Full Pitch Match'],
    venueTypes: ['Indoor Nets', 'Outdoor Pitch', 'Night Floodlit'],
    stats: {
      venues: '85+',
      players: '4.2K+',
      rating: '4.7',
      safety: '100% Verified'
    },
    sampleVenues: [
      {
        id: 6,
        name: 'Greenfield Sports Hub',
        location: 'Coimbatore',
        sport: 'Cricket',
        rating: '4.7',
        price: '₹900/hr',
        amenities: 'Full length turf pitches, bowling machines, floodlights.',
        image: '/images/card_cricket.jpg'
      },
      {
        id: 13,
        name: 'Strikers Cricket Arena',
        location: 'Coimbatore',
        sport: 'Cricket',
        rating: '4.8',
        price: '₹750/hr',
        amenities: 'High roof box cricket, automated bowling machine.',
        image: '/images/stadium_wide.jpg'
      },
      {
        id: 14,
        name: 'Super Kings Nets',
        location: 'Coimbatore',
        sport: 'Cricket',
        rating: '4.9',
        price: '₹850/hr',
        amenities: 'Astro turf nets, pro coaching staff, night LED lights.',
        image: '/images/card_cricket.jpg'
      },
      {
        id: 15,
        name: 'Master Blasters Pitch',
        location: 'Coimbatore',
        sport: 'Cricket',
        rating: '4.6',
        price: '₹680/hr',
        amenities: 'Indoor nets with video analysis equipment.',
        image: '/images/turf_macro.jpg'
      }
    ]
  },
  {
    id: 'badminton',
    slug: 'badminton',
    name: 'Badminton',
    category: 'Indoor Courts',
    cardImage: '/images/card_badminton.jpg',
    heroImage: '/images/venue_badminton.jpg',
    bannerImage: '/images/venue_badminton.jpg',
    tagline: "SPEED & PRECISION",
    subtitle: "Book BWF-certified synthetic and wooden badminton courts with anti-glare lighting and climate control.",
    formats: ['Singles', 'Doubles', 'Coaching Session'],
    venueTypes: ['BWF Synthetic', 'Wooden Flooring', 'Air Conditioned'],
    stats: {
      venues: '95+',
      players: '6K+',
      rating: '4.9',
      safety: '100% Verified'
    },
    sampleVenues: [
      {
        id: 3,
        name: 'Smash Badminton Club',
        location: 'Coimbatore',
        sport: 'Badminton',
        rating: '4.9',
        price: '₹450/hr',
        amenities: '6 BWF Synthetic Courts, Air Conditioned, Pro Shop & Lounge.',
        image: '/images/venue_badminton.jpg'
      },
      {
        id: 16,
        name: 'Feather Touch Arena',
        location: 'Coimbatore',
        sport: 'Badminton',
        rating: '4.8',
        price: '₹400/hr',
        amenities: 'Teak wooden courts, shower facilities, gear rental.',
        image: '/images/card_badminton.jpg'
      },
      {
        id: 17,
        name: 'Apex Shuttle Club',
        location: 'Coimbatore',
        sport: 'Badminton',
        rating: '4.7',
        price: '₹480/hr',
        amenities: '8 Courts, LED non-glare lighting, juice bar.',
        image: '/images/venue_badminton.jpg'
      },
      {
        id: 18,
        name: 'Velocity Badminton Hub',
        location: 'Coimbatore',
        sport: 'Badminton',
        rating: '4.9',
        price: '₹500/hr',
        amenities: 'Air conditioned pro courts with stringing service.',
        image: '/images/card_badminton.jpg'
      }
    ]
  },
  {
    id: 'basketball',
    slug: 'basketball',
    name: 'Basketball',
    category: 'Indoor & Outdoor',
    cardImage: '/images/card_basketball.jpg',
    heroImage: '/images/venue_basketball.jpg',
    bannerImage: '/images/venue_basketball.jpg',
    tagline: "HIGH FLYING HOOPS",
    subtitle: "Dominate the hardwood on professional indoor maple wood courts and high-traction outdoor hoops.",
    formats: ['3x3 Half Court', '5x5 Full Court', 'Pickup Games'],
    venueTypes: ['Maple Wood Court', 'Outdoor Acrylic', 'Glass Backboards'],
    stats: {
      venues: '60+',
      players: '3.5K+',
      rating: '4.8',
      safety: '100% Verified'
    },
    sampleVenues: [
      {
        id: 5,
        name: 'Apex Basketball Arena',
        location: 'Coimbatore',
        sport: 'Basketball',
        rating: '4.8',
        price: '₹700/hr',
        amenities: 'Indoor Wooden Flooring, Glass Backboards, Scoreboard.',
        image: '/images/venue_basketball.jpg'
      },
      {
        id: 19,
        name: 'Hoop Dreams Club',
        location: 'Coimbatore',
        sport: 'Basketball',
        rating: '4.7',
        price: '₹600/hr',
        amenities: 'Full court maple floor, electronic scoreboard.',
        image: '/images/card_basketball.jpg'
      },
      {
        id: 20,
        name: 'Downtown Hoops Arena',
        location: 'Coimbatore',
        sport: 'Basketball',
        rating: '4.9',
        price: '₹750/hr',
        amenities: 'FIBA standard indoor court, player lounge.',
        image: '/images/venue_basketball.jpg'
      },
      {
        id: 21,
        name: 'Skyline Outdoor Court',
        location: 'Coimbatore',
        sport: 'Basketball',
        rating: '4.6',
        price: '₹500/hr',
        amenities: 'Acrylic outdoor surface, night floodlights.',
        image: '/images/card_basketball.jpg'
      }
    ]
  },
  {
    id: 'tennis',
    slug: 'tennis',
    name: 'Tennis',
    category: 'Hard & Clay Courts',
    cardImage: '/images/card_tennis.jpg',
    heroImage: '/images/venue_tennis.jpg',
    bannerImage: '/images/venue_tennis.jpg',
    tagline: "POWER & FINESSE",
    subtitle: "Sharpen your serve on ITF-approved hard courts, clay surfaces, and floodlit night tennis facilities.",
    formats: ['Singles', 'Doubles', 'Ball Machine Practice'],
    venueTypes: ['ITF Acrylic Hard Court', 'Red Clay Surface', 'Night Floodlit'],
    stats: {
      venues: '45+',
      players: '2.8K+',
      rating: '4.7',
      safety: '100% Verified'
    },
    sampleVenues: [
      {
        id: 4,
        name: 'Grand Slam Tennis Academy',
        location: 'Coimbatore',
        sport: 'Tennis',
        rating: '4.7',
        price: '₹650/hr',
        amenities: 'Night Floodlit Hard Courts, Ball Machine Rental, Coaching.',
        image: '/images/venue_tennis.jpg'
      },
      {
        id: 22,
        name: 'Roland Garros Clay Club',
        location: 'Coimbatore',
        sport: 'Tennis',
        rating: '4.9',
        price: '₹800/hr',
        amenities: 'Authentic clay courts, shower & change rooms.',
        image: '/images/card_tennis.jpg'
      },
      {
        id: 23,
        name: 'Wimbledon Hard Courts',
        location: 'Coimbatore',
        sport: 'Tennis',
        rating: '4.8',
        price: '₹700/hr',
        amenities: '4 Hard courts with ball machine assistant.',
        image: '/images/venue_tennis.jpg'
      },
      {
        id: 24,
        name: 'Ace Tennis Park',
        location: 'Coimbatore',
        sport: 'Tennis',
        rating: '4.6',
        price: '₹600/hr',
        amenities: 'Synthetic acrylic courts with pro stringer shop.',
        image: '/images/card_tennis.jpg'
      }
    ]
  },
  {
    id: 'volleyball',
    slug: 'volleyball',
    name: 'Volleyball',
    category: 'Courts & Sand',
    cardImage: '/images/card_volleyball.jpg',
    heroImage: '/images/card_volleyball.jpg',
    bannerImage: '/images/stadium_wide.jpg',
    tagline: "SPIKE & RALLY",
    subtitle: "Rally on indoor cushioned wood floors and beach sand volleyball courts built for high-energy play.",
    formats: ['Beach Volleyball 2v2', 'Indoor 6v6', 'Recreational Rally'],
    venueTypes: ['Beach Sand Court', 'Indoor Wooden Floor', 'Floodlit Outdoor'],
    stats: {
      venues: '40+',
      players: '2.5K+',
      rating: '4.8',
      safety: '100% Verified'
    },
    sampleVenues: [
      {
        id: 25,
        name: 'Spike Zone Volleyball Arena',
        location: 'Coimbatore',
        sport: 'Volleyball',
        rating: '4.8',
        price: '₹550/hr',
        amenities: 'Beach Sand Court, Night Lights, Changing Rooms.',
        image: '/images/card_volleyball.jpg'
      },
      {
        id: 26,
        name: 'Volley Park Indoor Court',
        location: 'Coimbatore',
        sport: 'Volleyball',
        rating: '4.7',
        price: '₹600/hr',
        amenities: 'Cushioned wood floor, high roof, net equipment.',
        image: '/images/stadium_wide.jpg'
      },
      {
        id: 27,
        name: 'Sandstorm Beach Volley',
        location: 'Coimbatore',
        sport: 'Volleyball',
        rating: '4.9',
        price: '₹500/hr',
        amenities: 'Fine quartz sand pit, shower facility.',
        image: '/images/card_volleyball.jpg'
      },
      {
        id: 28,
        name: 'Apex Volleyball Club',
        location: 'Coimbatore',
        sport: 'Volleyball',
        rating: '4.6',
        price: '₹480/hr',
        amenities: 'Outdoor synthetic surface, electronic score board.',
        image: '/images/turf_macro.jpg'
      }
    ]
  }
];

export const getSportBySlug = (slug) => {
  if (!slug) return sportsData[0];
  return sportsData.find((s) => s.slug.toLowerCase() === slug.toLowerCase()) || sportsData[0];
};
