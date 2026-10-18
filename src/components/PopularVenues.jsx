import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import VenueCard from './VenueCard';
import VenueDetailsModal from './VenueDetailsModal';
import { Flame, ArrowUpRight, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { getVenues, FALLBACK_MOCK_VENUES } from '../services/venueService.js';

export default function PopularVenues({ onNavigate }) {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const gridRef = useRef(null);

  // Fetch active venues from Firestore
  useEffect(() => {
    let isMounted = true;

    async function fetchPopularVenues() {
      setIsLoading(true);
      setError(null);

      try {
        // Query active venues from Firestore without silently masking errors
        const liveVenues = await getVenues({
          status: 'active',
          maxResults: 8,
          fallbackOnError: false,
          fallbackOnEmpty: false
        });

        if (!isMounted) return;

        if (Array.isArray(liveVenues) && liveVenues.length > 0) {
          setVenues(liveVenues);
          setIsUsingFallback(false);
        } else {
          // Firestore query succeeded but collection is empty
          setVenues([]);
          setIsUsingFallback(false);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Firestore getVenues error in PopularVenues:', err);
        // Do not silently mask error with mock data; present it explicitly
        setError(err.message || 'Failed to retrieve popular venues from Firestore.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPopularVenues();

    return () => {
      isMounted = false;
    };
  }, [fetchTrigger]);

  const handleUseFallback = () => {
    setError(null);
    setVenues(FALLBACK_MOCK_VENUES);
    setIsUsingFallback(true);
  };

  const handleRetry = () => {
    setFetchTrigger((prev) => prev + 1);
  };

  // Normalize venue data for VenueCard expectations
  const normalizedVenues = venues.map((v) => {
    const priceNum = typeof v.priceNum === 'number'
      ? v.priceNum
      : (typeof v.pricePerHour === 'number' ? v.pricePerHour : 800);

    return {
      id: v.id,
      name: v.name || 'Elite Sports Arena',
      location: v.location || 'Coimbatore',
      sport: v.sport || 'Football',
      rating: v.rating ? String(v.rating) : '4.8',
      price: v.price || v.priceFormatted || `₹${priceNum}/hr`,
      amenities: v.amenitiesDescription || v.amenities || 'FIFA Quality Turf, Floodlights, Locker Rooms, Cafe & Parking.',
      image: v.image || (Array.isArray(v.images) ? v.images[0] : '/images/venue_football.jpg')
    };
  });

  // Display the first four suitable active venues
  const displayVenues = normalizedVenues.slice(0, 4);

  // Subtle GSAP entrance animation for venue cards when loaded
  useEffect(() => {
    if (!isLoading && displayVenues.length > 0 && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [isLoading, displayVenues.length]);

  return (
    <section id="venues" className="relative pt-4 sm:pt-6 pb-20 px-4 sm:px-8 bg-[#040906]">
      {/* Background Accent Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-radial from-[#00FF66]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#00FF66] font-bold text-xs uppercase tracking-widest mb-1.5">
              <Flame className="w-4 h-4 text-[#00FF66]" />
              <span>Trending Arenas</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
              POPULAR <span className="text-gradient-bright">VENUES</span>
            </h2>
            <p className="text-xs text-gray-300 mt-1 max-w-md font-medium">
              Verified sports arenas & floodlit turfs available for instant booking
            </p>
          </div>

          <a
            href="#venues"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('spot-search');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00FF66] hover:text-white transition-colors group cursor-pointer"
          >
            <span>View All Venues</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Development Fallback Mode Notice */}
        {isUsingFallback && (
          <div className="mb-6 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Showing development fallback mock venues.</span>
            </span>
            <button
              type="button"
              onClick={handleRetry}
              className="text-[#00FF66] hover:underline font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Connect Live Firestore</span>
            </button>
          </div>
        )}

        {/* 1. LOADING SKELETON STATE */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-3xl glass-panel border border-white/10 overflow-hidden flex flex-col justify-between h-[420px] animate-pulse"
              >
                <div className="h-56 w-full bg-white/5 relative">
                  <div className="absolute top-4 left-4 w-20 h-6 rounded-full bg-white/10" />
                  <div className="absolute top-4 right-4 w-12 h-6 rounded-full bg-white/10" />
                  <div className="absolute bottom-3 left-4 w-24 h-4 rounded bg-white/10" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-3/4 h-5 rounded bg-white/10" />
                    <div className="w-full h-3 rounded bg-white/5" />
                    <div className="w-2/3 h-3 rounded bg-white/5" />
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="w-16 h-6 rounded bg-white/10" />
                    <div className="w-24 h-9 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* 2. ERROR STATE - Preserves Firestore integrity and does not silently substitute mock data */
          <div className="p-8 text-center glass-panel rounded-3xl border border-red-500/20 bg-red-950/10 space-y-4 my-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-white">Firestore Query Notice</h3>
              <p className="text-xs text-red-300/80 max-w-md mx-auto">
                {error}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRetry}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#10B981] text-[#040906] font-bold text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00FF66]/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Query</span>
              </button>
              <button
                type="button"
                onClick={handleUseFallback}
                className="px-4 py-2 rounded-xl glass-panel border border-white/10 hover:border-white/30 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                Load Demo Venues (Fallback)
              </button>
            </div>
          </div>
        ) : displayVenues.length > 0 ? (
          /* 3. LIVE VENUES GRID */
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onSelect={(v) => setSelectedVenue(v)}
              />
            ))}
          </div>
        ) : (
          /* 4. EMPTY DATABASE STATE */
          <div className="p-10 text-center glass-panel rounded-3xl space-y-4 border border-[#00FF66]/20 my-4">
            <Sparkles className="w-8 h-8 text-[#00FF66] mx-auto" />
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-white">Connected to Firestore (0 Venues)</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Active connection established with project <span className="text-[#00FF66] font-mono">sportspot-d561b</span>. Awaiting venue data seeding.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleUseFallback}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#00FF66] text-white hover:text-[#040906] text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Preview Demo Venues</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* VENUE DETAILS MODAL */}
      {selectedVenue && (
        <VenueDetailsModal
          venue={selectedVenue}
          onClose={(targetView) => {
            setSelectedVenue(null);
            if (targetView && onNavigate) {
              onNavigate(targetView);
            }
          }}
        />
      )}
    </section>
  );
}
