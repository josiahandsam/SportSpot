import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MapPin, Sparkles, ArrowRight, Trophy } from 'lucide-react';
import { getCategoryBySlug } from '../data/categoryData';
import BackToSportsButton from '../components/BackToSportsButton';

export default function CategoryDetailPage({ categorySlug, selectedLocation, onBackToSports, onSearchSportVenues }) {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const gridRef = useRef(null);

  const category = getCategoryBySlug(categorySlug);

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

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.06, delay: 0.15, ease: 'power2.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [categorySlug]);

  const handleActivityClick = (act) => {
    if (onSearchSportVenues) {
      onSearchSportVenues(act.query || act.name);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#040906] text-white pt-24 pb-24 relative overflow-hidden"
    >
      {/* Radial Background Accent Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-radial from-[#00FF66]/10 via-[#00FF66]/5 to-transparent blur-3xl pointer-events-none rounded-full z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-6">
        
        {/* ==================================================
            CLEARLY VISIBLE BACK TO SPORTS BUTTON (BELOW NAVBAR)
           ================================================== */}
        <div className="pt-2">
          <BackToSportsButton onClick={onBackToSports} />
        </div>

        {/* ==================================================
            CATEGORY HERO BANNER & HEADER
           ================================================== */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 glass-panel-glow shadow-2xl p-6 sm:p-10 lg:p-12 space-y-6">
          {/* Background Header Image */}
          <img
            src={category.headerImage}
            alt={category.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040906] via-[#040906]/90 to-black/60" />

          {/* Hero Content */}
          <div ref={heroRef} className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 shadow-md inline-flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>{category.badge}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>Active City: {selectedLocation || 'Coimbatore'}</span>
              </span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase leading-none">
              {category.title.split(' ')[0]} <span className="text-gradient-bright">{category.title.split(' ').slice(1).join(' ')}</span>
            </h1>

            <p className="text-xs sm:text-base text-gray-300 font-medium leading-relaxed max-w-2xl">
              "{category.tagline}" {category.subtitle}
            </p>
          </div>
        </div>

        {/* ==================================================
            MAIN ACTIVITIES GRID
           ================================================== */}
        <div className="space-y-8 pt-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-white font-heading font-bold text-xl uppercase tracking-wider">
              <Trophy className="w-5 h-5 text-[#00FF66]" />
              <span>SELECT AN ACTIVITY ({category.activities.length})</span>
            </div>
            <span className="text-xs font-bold text-gray-400">
              Click any activity to find nearby spots
            </span>
          </div>

          {/* Activity Cards Grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {category.activities.map((act) => (
              <div
                key={act.id}
                onClick={() => handleActivityClick(act)}
                className="group relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#00FF66] transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(0,255,102,0.25)] hover:scale-[1.02] flex flex-col justify-between p-6 bg-[#061208]/90 glass-panel-glow"
              >
                {/* Background Photo with Dark Gradient */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={act.image}
                    alt={act.name}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-35 group-hover:scale-110 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040906] via-[#040906]/90 to-[#040906]/60 group-hover:via-[#040906]/75 transition-colors" />
                </div>

                {/* Top Header Badge */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <span className="w-11 h-11 rounded-2xl bg-[#040906]/90 text-[#00FF66] border border-[#00FF66]/30 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5 text-[#00FF66]" />
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#040906]/90 text-gray-300 border border-white/10 backdrop-blur-md">
                    {act.type}
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 space-y-3">
                  <div>
                    <h3 className="font-heading font-black text-2xl text-white tracking-tight group-hover:text-[#00FF66] transition-colors">
                      {act.name}
                    </h3>
                    <p className="text-xs text-gray-300 font-medium leading-relaxed mt-1 line-clamp-2">
                      {act.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#00FF66] uppercase tracking-wider group-hover:underline">
                      Explore Venues
                    </span>

                    {/* Circular Green Arrow Button */}
                    <div className="w-10 h-10 rounded-full border-2 border-[#00FF66]/40 group-hover:border-[#00FF66] bg-[#040906]/80 group-hover:bg-[#00FF66] text-white group-hover:text-[#040906] flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 shrink-0 ml-2">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
