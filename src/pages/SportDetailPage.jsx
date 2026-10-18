import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MapPin, Trophy, Star, ArrowRight } from 'lucide-react';
import { getSportBySlug } from '../data/sportsData';
import VenueCard from '../components/VenueCard';
import BackToSportsButton from '../components/BackToSportsButton';

export default function SportDetailPage({ sportSlug, selectedLocation, onBackToSports, onSearchSportVenues, onViewVenueDetails }) {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  const sport = getSportBySlug(sportSlug);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }

      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, scale: 0.95, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.08, delay: 0.2, ease: 'power2.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [sportSlug]);

  const handleFindSpotsClick = () => {
    if (onSearchSportVenues) {
      onSearchSportVenues(sport.name);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#040906] text-white pt-24 pb-20 relative overflow-hidden"
    >
      {/* Radial Background Accent Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-radial from-[#00FF66]/10 via-[#00FF66]/5 to-transparent blur-3xl pointer-events-none rounded-full z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-6">
        
        {/* CLEARLY VISIBLE BACK TO SPORTS BUTTON (BELOW NAVBAR) */}
        <div className="pt-2">
          <BackToSportsButton onClick={onBackToSports} />
        </div>

        {/* HERO BANNER CARD */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 glass-panel-glow shadow-2xl p-6 sm:p-10 lg:p-12 space-y-6">
          <img
            src={sport.bannerImage || sport.heroImage}
            alt={sport.name}
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040906] via-[#040906]/90 to-black/60" />

          {/* Hero Content */}
          <div ref={heroRef} className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 shadow-md inline-flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>{sport.tagline}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>Active City: {selectedLocation || 'Coimbatore'}</span>
              </span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase leading-none">
              {sport.name} <span className="text-gradient-bright">TURFS & SPOTS</span>
            </h1>

            <p className="text-xs sm:text-base text-gray-300 font-medium leading-relaxed max-w-2xl">
              {sport.subtitle}
            </p>

            {/* Formats & Venue Types */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Formats:</span>
              {sport.formats.map((fmt) => (
                <span key={fmt} className="px-3 py-1 rounded-xl text-xs font-bold bg-white/10 text-white border border-white/15">
                  {fmt}
                </span>
              ))}

              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-2 mr-1">Types:</span>
              {sport.venueTypes.map((vt) => (
                <span key={vt} className="px-3 py-1 rounded-xl text-xs font-bold bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30">
                  {vt}
                </span>
              ))}
            </div>

            {/* MAIN CTA BUTTON */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleFindSpotsClick}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00FF66] to-[#10B981] text-[#040906] font-heading font-black text-sm uppercase tracking-wider shadow-xl shadow-[#00FF66]/25 hover:shadow-[#00FF66]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 group"
              >
                <span>FIND {sport.name.toUpperCase()} SPOTS →</span>
              </button>
            </div>

          </div>
        </div>

        {/* STATISTICS PANEL */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl glass-panel-glow border border-[#00FF66]/30 shadow-2xl bg-[#061208]/90">
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-[#00FF66] tracking-tight block">
              {sport.stats?.venues || '120+'}
            </span>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              {sport.name} Venues
            </span>
            <span className="text-[10px] text-gray-400 block">Available in {selectedLocation}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-[#00FF66] tracking-tight block">
              {sport.stats?.players || '5K+'}
            </span>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Players Every Month
            </span>
            <span className="text-[10px] text-gray-400 block">Active community</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 font-heading font-black text-3xl sm:text-4xl text-amber-400 tracking-tight">
              <span>{sport.stats?.rating || '4.8'}</span>
              <Star className="w-6 h-6 fill-amber-400 text-amber-400 shrink-0" />
            </div>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Average Rating
            </span>
            <span className="text-[10px] text-gray-400 block">From verified bookings</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-[#00FF66] tracking-tight block">
              100%
            </span>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Safe & Verified
            </span>
            <span className="text-[10px] text-gray-400 block">Instant slot confirmation</span>
          </div>

        </div>

        {/* POPULAR VENUES FOR THIS SPORT */}
        <div className="space-y-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#00FF66] font-bold text-xs uppercase tracking-widest mb-1">
                <Trophy className="w-4 h-4 text-[#00FF66]" />
                <span>Featured Facilities</span>
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
                POPULAR <span className="text-gradient-bright">{sport.name.toUpperCase()} VENUES</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={handleFindSpotsClick}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00FF66] hover:text-white transition-colors group cursor-pointer"
            >
              <span>View All {sport.name} Venues</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Venues Grid using VenueCard component */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sport.sampleVenues.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
