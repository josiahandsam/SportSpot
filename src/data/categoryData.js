// Centralized SportSpot Category & Activity Data Architecture

export const categoriesData = [
  {
    id: 'outdoor-games',
    slug: 'outdoor-games',
    route: '/sports/outdoor',
    title: 'OUTDOOR GAMES',
    tagline: 'Find your next game under the open sky.',
    subtitle: 'From FIFA-standard football turfs to floodlit cricket pitches and tennis courts, discover top outdoor sports venues.',
    headerImage: '/images/card_football.jpg',
    badge: '8 Outdoor Sports & Arenas',
    activities: [
      {
        id: 'out-1',
        name: 'Football',
        type: 'Turf & Pitch',
        description: 'FIFA quality synthetic turf pitches with night floodlights and locker facilities.',
        image: '/images/venue_football.jpg',
        query: 'Football'
      },
      {
        id: 'out-2',
        name: 'Cricket',
        type: 'Pitch & Nets',
        description: 'Full-length turf pitches, box cricket arenas, and automated bowling machine nets.',
        image: '/images/card_cricket.jpg',
        query: 'Cricket'
      },
      {
        id: 'out-3',
        name: 'Tennis',
        type: 'Hard & Clay Courts',
        description: 'ITF-certified hard courts and authentic red clay surfaces with ball machine rental.',
        image: '/images/venue_tennis.jpg',
        query: 'Tennis'
      },
      {
        id: 'out-4',
        name: 'Volleyball',
        type: 'Beach & Hard Court',
        description: 'Beach sand volleyball pits and cushioned outdoor courts equipped for high-flying rallies.',
        image: '/images/card_volleyball.jpg',
        query: 'Volleyball'
      },
      {
        id: 'out-5',
        name: 'Basketball',
        type: 'Outdoor Hoops',
        description: 'High-traction acrylic outdoor courts with glass backboards and night LED lighting.',
        image: '/images/venue_basketball.jpg',
        query: 'Basketball'
      },
      {
        id: 'out-6',
        name: 'Hockey',
        type: 'AstroTurf Arena',
        description: 'Watered astro-turf field hockey pitches suitable for 6-a-side and 11-a-side practice.',
        image: '/images/stadium_wide.jpg',
        query: 'Hockey'
      },
      {
        id: 'out-7',
        name: 'Athletics',
        type: 'Track & Field',
        description: 'Synthetic running tracks and field facilities for sprinting, long jump, and endurance training.',
        image: '/images/turf_macro.jpg',
        query: 'Athletics'
      },
      {
        id: 'out-8',
        name: 'Golf',
        type: 'Driving Range',
        description: 'Spacious driving ranges with automated teeing systems and pro coaching assistance.',
        image: '/images/stadium_wide.jpg',
        query: 'Golf'
      }
    ]
  },

  {
    id: 'indoor-games',
    slug: 'indoor-games',
    route: '/sports/indoor',
    title: 'INDOOR GAMES',
    tagline: 'All-weather indoor sports and club fun.',
    subtitle: 'Climate-controlled courts, BWF synthetic surfaces, and indoor lounges engineered for year-round action.',
    headerImage: '/images/venue_badminton.jpg',
    badge: '9 Indoor Sports & Clubs',
    activities: [
      {
        id: 'ind-1',
        name: 'Badminton',
        type: 'BWF Synthetic Courts',
        description: 'Air-conditioned badminton courts featuring teak wood and synthetic rubber mats.',
        image: '/images/venue_badminton.jpg',
        query: 'Badminton'
      },
      {
        id: 'ind-2',
        name: 'Table Tennis',
        type: 'Pro Indoor Tables',
        description: 'ITTF approved tournament tables with anti-glare lighting and robot practice systems.',
        image: '/images/venue_badminton.jpg',
        query: 'Table Tennis'
      },
      {
        id: 'ind-3',
        name: 'Squash',
        type: 'Glass Back Courts',
        description: 'ASBF standard indoor squash courts with sprung wooden flooring and viewing gallery.',
        image: '/images/venue_badminton.jpg',
        query: 'Squash'
      },
      {
        id: 'ind-4',
        name: 'Indoor Cricket',
        type: 'High Roof Box Nets',
        description: 'High ceiling netted indoor cricket arenas with digital scoring screens.',
        image: '/images/card_cricket.jpg',
        query: 'Cricket'
      },
      {
        id: 'ind-5',
        name: 'Chess',
        type: 'Mind Sports Lounge',
        description: 'Quiet, air-conditioned chess clubs with FIDE wooden chessboards and clocks.',
        image: '/images/venue_badminton.jpg',
        query: 'Chess'
      },
      {
        id: 'ind-6',
        name: 'Carrom',
        type: 'Club Arena',
        description: 'Smooth tournament carrom boards with precise lighting and relaxed seating.',
        image: '/images/venue_badminton.jpg',
        query: 'Carrom'
      },
      {
        id: 'ind-7',
        name: 'Bowling',
        type: 'Neon Alley',
        description: 'Cosmic bowling lanes with automated pinsetters, light shows, and shoes included.',
        image: '/images/venue_basketball.jpg',
        query: 'Bowling'
      },
      {
        id: 'ind-8',
        name: 'Snooker',
        type: 'Billiards Lounge',
        description: 'Full-size 12ft championship snooker tables with high quality felt and pro cues.',
        image: '/images/venue_badminton.jpg',
        query: 'Snooker'
      },
      {
        id: 'ind-9',
        name: 'Pool',
        type: 'American 9-Ball',
        description: '8-ball and 9-ball pool tables in premium sports lounges with music and snacks.',
        image: '/images/venue_badminton.jpg',
        query: 'Pool'
      }
    ]
  },

  {
    id: 'kids-family',
    slug: 'kids-family',
    route: '/sports/kids-family',
    title: 'KIDS & FAMILY',
    tagline: 'A safer, happier playground for all ages.',
    subtitle: 'Child-safe equipment, padded play areas, trampoline parks, and family sports zones verified for safety.',
    headerImage: '/images/activity_kids_family.jpg',
    badge: '9 Family & Play Activities',
    activities: [
      {
        id: 'kf-1',
        name: 'Kids Play Area',
        type: 'Soft Play Zone',
        description: 'Multi-level soft play structures, ball pits, and toddler exploration zones.',
        image: '/images/activity_kids_family.jpg',
        query: 'Kids'
      },
      {
        id: 'kf-2',
        name: 'Trampoline Park',
        type: 'Bounce Arena',
        description: 'Wall-to-wall interconnected trampolines, foam pits, and slam-dunk zones.',
        image: '/images/activity_kids_family.jpg',
        query: 'Trampoline'
      },
      {
        id: 'kf-3',
        name: 'Indoor Playground',
        type: 'Fun & Adventure',
        description: 'Padded obstacle courses, indoor climbing walls, and safe play towers for kids.',
        image: '/images/activity_kids_family.jpg',
        query: 'Kids'
      },
      {
        id: 'kf-4',
        name: 'Kids Football',
        type: 'Junior Turf',
        description: 'Mini 5-a-side turfs tailored with softer impact padding and junior gear.',
        image: '/images/card_football.jpg',
        query: 'Football'
      },
      {
        id: 'kf-5',
        name: 'Kids Cricket',
        type: 'Junior Box Nets',
        description: 'Soft ball box cricket designed for safe family matches and junior coaching.',
        image: '/images/card_cricket.jpg',
        query: 'Cricket'
      },
      {
        id: 'kf-6',
        name: 'Family Badminton',
        type: 'Court Rental',
        description: 'Friendly court bookings with lightweight racquets and non-slip wooden flooring.',
        image: '/images/venue_badminton.jpg',
        query: 'Badminton'
      },
      {
        id: 'kf-7',
        name: 'Bowling',
        type: 'Family Alley',
        description: 'Bumper bowling lanes suitable for kids and beginner friendly family games.',
        image: '/images/venue_basketball.jpg',
        query: 'Bowling'
      },
      {
        id: 'kf-8',
        name: 'Arcade Games',
        type: 'Gaming Zone',
        description: 'Retro & modern arcade cabinets, claw machines, and virtual sports simulators.',
        image: '/images/activity_kids_family.jpg',
        query: 'Arcade'
      },
      {
        id: 'kf-[#9]',
        name: 'Skating',
        type: 'Roller Rink',
        description: 'Smooth indoor roller rinks with protective gear hire and beginner handrails.',
        image: '/images/activity_kids_family.jpg',
        query: 'Skating'
      }
    ]
  },

  {
    id: 'fitness-training',
    slug: 'fitness-training',
    route: '/sports/fitness',
    title: 'FITNESS & TRAINING',
    tagline: 'Stronger, faster, healthier every day.',
    subtitle: 'From modern strength gyms to high-intensity CrossFit boxes, yoga studios, and combat centers.',
    headerImage: '/images/activity_fitness_gym.jpg',
    badge: '9 Fitness & Strength Hubs',
    activities: [
      {
        id: 'ft-1',
        name: 'Gym',
        type: 'Fitness Center',
        description: 'State-of-the-art cardio decks, weight plates, cable machines, and locker rooms.',
        image: '/images/activity_fitness_gym.jpg',
        query: 'Gym'
      },
      {
        id: 'ft-2',
        name: 'CrossFit',
        type: 'Cross Training Box',
        description: 'Olympic lifting platforms, kettlebells, rowing machines, and daily WOD sessions.',
        image: '/images/activity_fitness_gym.jpg',
        query: 'CrossFit'
      },
      {
        id: 'ft-3',
        name: 'Yoga',
        type: 'Mind & Wellness Studio',
        description: 'Tranquil studios for Hatha, Vinyasa, and Hot Yoga with certified instructors.',
        image: '/images/activity_fitness_gym.jpg',
        query: 'Yoga'
      },
      {
        id: 'ft-4',
        name: 'Zumba',
        type: 'Dance Fitness',
        description: 'High-energy cardio dance workouts with vibrant sound systems and energetic coaches.',
        image: '/images/activity_fitness_gym.jpg',
        query: 'Zumba'
      },
      {
        id: 'ft-5',
        name: 'Boxing',
        type: 'Combat Ring',
        description: 'Professional boxing rings, heavy bags, speed bags, and sparring equipment.',
        image: '/images/activity_fitness_gym.jpg',
        query: 'Boxing'
      },
      {
        id: 'ft-6',
        name: 'MMA',
        type: 'Octagon & Tatami',
        description: 'Mixed Martial Arts training mats for Brazilian Jiu-Jitsu, Kickboxing, and Muay Thai.',
        image: '/images/activity_fitness_gym.jpg',
        query: 'MMA'
      },
      {
        id: 'ft-7',
        name: 'Personal Training',
        type: '1-on-1 Studio',
        description: 'Customized fitness programs, body composition analysis, and dedicated trainers.',
        image: '/images/activity_fitness_gym.jpg',
        query: 'Gym'
      },
      {
        id: 'ft-8',
        name: 'Strength Training',
        type: 'Powerlifting Rack',
        description: 'Squat racks, deadlift platforms, calibrated plates, and powerlifting gear.',
        image: '/images/activity_fitness_gym.jpg',
        query: 'Gym'
      },
      {
        id: 'ft-9',
        name: 'Functional Training',
        type: 'Movement Studio',
        description: 'TRX suspension trainers, plyo boxes, battle ropes, and agility ladders.',
        image: '/images/activity_fitness_gym.jpg',
        query: 'Gym'
      }
    ]
  },

  {
    id: 'fun-recreation',
    slug: 'fun-recreation',
    route: '/sports/recreation',
    title: 'FUN & RECREATION',
    tagline: 'Play. Chill. Enjoy.',
    subtitle: 'Unwind with friends and colleagues at high-octane gaming arenas, laser tag fields, and go-kart tracks.',
    headerImage: '/images/venue_basketball.jpg',
    badge: '9 Recreation & Gaming Zones',
    activities: [
      {
        id: 'fr-1',
        name: 'Bowling',
        type: 'Neon Bowling Alley',
        description: '12-lane cosmic bowling with live DJ music, glow pins, and lane-side dining.',
        image: '/images/venue_basketball.jpg',
        query: 'Bowling'
      },
      {
        id: 'fr-2',
        name: 'Arcade Games',
        type: 'Arcade Arena',
        description: 'VR motion simulators, racing simulators, air hockey, and prize redemption games.',
        image: '/images/activity_kids_family.jpg',
        query: 'Arcade'
      },
      {
        id: 'fr-3',
        name: 'Go-Karting',
        type: 'Racing Track',
        description: 'High-speed electric go-kart tracks with computerized lap timing and helmet safety.',
        image: '/images/stadium_wide.jpg',
        query: 'Go-Karting'
      },
      {
        id: 'fr-4',
        name: 'Laser Tag',
        type: 'Futuristic Arena',
        description: 'Multi-level fog-filled arena with neon obstacles and chest-vest infrared phasers.',
        image: '/images/venue_basketball.jpg',
        query: 'Laser Tag'
      },
      {
        id: 'fr-5',
        name: 'Paintball',
        type: 'Tactical Field',
        description: 'Outdoor scenario paintball fields with bunkers, protective suits, and markers.',
        image: '/images/stadium_wide.jpg',
        query: 'Paintball'
      },
      {
        id: 'fr-6',
        name: 'Trampoline Park',
        type: 'Freestyle Jump',
        description: 'High bounce trampolines, dodgeball courts, and airbag stunt jump pits.',
        image: '/images/activity_kids_family.jpg',
        query: 'Trampoline'
      },
      {
        id: 'fr-7',
        name: 'Pool',
        type: 'Billiards Room',
        description: 'Classic 8-ball pool tables in air-conditioned sports bars and recreational lounges.',
        image: '/images/venue_badminton.jpg',
        query: 'Pool'
      },
      {
        id: 'fr-8',
        name: 'Snooker',
        type: 'Snooker Lounge',
        description: 'Championship 12ft snooker tables with high quality lighting and relaxed ambience.',
        image: '/images/venue_badminton.jpg',
        query: 'Snooker'
      },
      {
        id: 'fr-9',
        name: 'Gaming Arena',
        type: 'Esports Lounge',
        description: 'High-end gaming PCs, PS5 console booths, 240Hz monitors, and gaming chairs.',
        image: '/images/venue_basketball.jpg',
        query: 'Gaming'
      }
    ]
  },

  {
    id: 'competitive-sports',
    slug: 'competitive-sports',
    route: '/sports/competitive',
    title: 'COMPETITIVE SPORTS',
    tagline: 'Take your game to the next level.',
    subtitle: 'Professional arenas, referee-assisted matches, and tournament grade facilities built for athletes.',
    headerImage: '/images/stadium_wide.jpg',
    badge: '10 Competitive Sports Arenas',
    activities: [
      {
        id: 'cs-1',
        name: 'Football',
        type: 'Match Stadium',
        description: 'FIFA Quality Pro turf for league matches, tournaments, and 11v11 official fixtures.',
        image: '/images/venue_football.jpg',
        query: 'Football'
      },
      {
        id: 'cs-2',
        name: 'Cricket',
        type: 'Tournament Pitch',
        description: 'Full size turf pitches with electronic scoreboard, pavilion, and umpire support.',
        image: '/images/card_cricket.jpg',
        query: 'Cricket'
      },
      {
        id: 'cs-3',
        name: 'Basketball',
        type: 'FIBA Standard Court',
        description: 'Hardwood maple courts with glass backboards, shot clocks, and spectator seats.',
        image: '/images/venue_basketball.jpg',
        query: 'Basketball'
      },
      {
        id: 'cs-4',
        name: 'Badminton',
        type: 'BWF Arena',
        description: 'BWF Grade 1 synthetic courts with glare-free LED lighting and umpire chairs.',
        image: '/images/venue_badminton.jpg',
        query: 'Badminton'
      },
      {
        id: 'cs-5',
        name: 'Tennis',
        type: 'ITF Pro Court',
        description: 'ITF Cushion court surfaces with tournament lighting and ball boys assistance.',
        image: '/images/venue_tennis.jpg',
        query: 'Tennis'
      },
      {
        id: 'cs-6',
        name: 'Volleyball',
        type: 'Official Court',
        description: 'Indoor sprung floor volleyball courts with professional net tension systems.',
        image: '/images/card_volleyball.jpg',
        query: 'Volleyball'
      },
      {
        id: 'cs-7',
        name: 'Athletics',
        type: 'Olympic Track',
        description: '8-lane synthetic polyurethane track with electronic timing systems.',
        image: '/images/turf_macro.jpg',
        query: 'Athletics'
      },
      {
        id: 'cs-8',
        name: 'Boxing',
        type: 'Sanctioned Ring',
        description: 'Competition-sized 20ft elevated boxing ring with cornermen stools and timing bells.',
        image: '/images/activity_fitness_gym.jpg',
        query: 'Boxing'
      },
      {
        id: 'cs-9',
        name: 'Swimming',
        type: 'Olympic Pool',
        description: '50-meter temperature controlled 8-lane lap pool with starting blocks.',
        image: '/images/stadium_wide.jpg',
        query: 'Swimming'
      },
      {
        id: 'cs-10',
        name: 'Table Tennis',
        type: 'ITTF Stadium',
        description: 'Enclosed court table tennis setups with red floor mats and barrier surround.',
        image: '/images/venue_badminton.jpg',
        query: 'Table Tennis'
      }
    ]
  }
];

export const getCategoryBySlug = (slug) => {
  if (!slug) return categoriesData[0];
  const normalized = slug.toLowerCase().replace('/sports/', '');
  return categoriesData.find((c) => 
    c.slug.toLowerCase() === normalized || 
    c.id.toLowerCase() === normalized ||
    c.route.toLowerCase().includes(normalized)
  ) || categoriesData[0];
};
