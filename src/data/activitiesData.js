// SportSpot Activities & Discovery Hub Data Architecture

export const quickSearchChips = [
  { label: 'Football', type: 'sport', slug: 'football' },
  { label: 'Badminton', type: 'sport', slug: 'badminton' },
  { label: 'Cricket', type: 'sport', slug: 'cricket' },
  { label: 'Gym', type: 'activity', query: 'Gym' },
  { label: 'Swimming', type: 'activity', query: 'Swimming' },
  { label: 'Table Tennis', type: 'activity', query: 'Table Tennis' }
];

export const activityCategories = [
  {
    id: 'outdoor-games',
    slug: 'outdoor-games',
    title: 'Outdoor Games',
    subtitle: 'Play under the open sky',
    image: '/images/card_football.jpg',
    query: 'Outdoor'
  },
  {
    id: 'indoor-games',
    slug: 'indoor-games',
    title: 'Indoor Games',
    subtitle: 'All-weather fun',
    image: '/images/venue_badminton.jpg',
    query: 'Indoor'
  },
  {
    id: 'kids-family',
    slug: 'kids-family',
    title: 'Kids & Family',
    subtitle: 'Fun for all ages',
    image: '/images/activity_kids_family.jpg',
    query: 'Kids'
  },
  {
    id: 'fitness-training',
    slug: 'fitness-training',
    title: 'Fitness & Training',
    subtitle: 'Stronger every day',
    image: '/images/activity_fitness_gym.jpg',
    query: 'Gym'
  },
  {
    id: 'fun-recreation',
    slug: 'fun-recreation',
    title: 'Fun & Recreation',
    subtitle: 'Play. Chill. Enjoy.',
    image: '/images/venue_basketball.jpg',
    query: 'Recreation'
  },
  {
    id: 'competitive-sports',
    slug: 'competitive-sports',
    title: 'Competitive Sports',
    subtitle: 'Take it to the next level',
    image: '/images/stadium_wide.jpg',
    query: 'Competitive'
  }
];

export const popularActivitiesList = [
  { id: 'tt', name: 'Table Tennis', category: 'Indoor Games', query: 'Table Tennis' },
  { id: 'swim', name: 'Swimming', category: 'Pool & Water', query: 'Swimming' },
  { id: 'skate', name: 'Skating', category: 'Rink & Outdoor', query: 'Skating' },
  { id: 'yoga', name: 'Yoga', category: 'Mind & Fitness', query: 'Yoga' },
  { id: 'box', name: 'Boxing', category: 'Fitness & Combat', query: 'Boxing' },
  { id: 'trampoline', name: 'Trampoline Park', category: 'Kids & Recreation', query: 'Trampoline' },
  { id: 'snooker', name: 'Snooker', category: 'Indoor Recreation', query: 'Snooker' },
  { id: 'arcade', name: 'Arcade Games', category: 'Fun & Chill', query: 'Arcade' }
];

export const searchableSuggestions = [
  { name: 'Football', category: 'Turf & Fields', type: 'sport', slug: 'football' },
  { name: 'Cricket', category: 'Pitches & Arenas', type: 'sport', slug: 'cricket' },
  { name: 'Badminton', category: 'Indoor Courts', type: 'sport', slug: 'badminton' },
  { name: 'Basketball', category: 'Indoor & Outdoor', type: 'sport', slug: 'basketball' },
  { name: 'Tennis', category: 'Hard & Clay Courts', type: 'sport', slug: 'tennis' },
  { name: 'Volleyball', category: 'Courts & Sand', type: 'sport', slug: 'volleyball' },
  { name: 'Gym & Fitness', category: 'Fitness & Training', type: 'activity', query: 'Gym' },
  { name: 'Swimming Pool', category: 'Pool & Water', type: 'activity', query: 'Swimming' },
  { name: 'Table Tennis', category: 'Indoor Games', type: 'activity', query: 'Table Tennis' },
  { name: 'Kids Play Arena', category: 'Kids & Family', type: 'activity', query: 'Kids' },
  { name: 'Trampoline Park', category: 'Kids & Family', type: 'activity', query: 'Trampoline' },
  { name: 'Snooker & Pool', category: 'Fun & Recreation', type: 'activity', query: 'Snooker' }
];
