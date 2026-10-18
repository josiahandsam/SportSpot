import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  ArrowRight, Trophy, ShieldCheck, Zap, Users, CheckCircle2,
  Layers, Activity, ChevronRight, Sparkles
} from 'lucide-react';
import {
  activityCategories,
  popularActivitiesList
} from '../data/activitiesData';
import { sportsData } from '../data/sportsData';

export default function SportsPage({ selectedLocation, onSelectSport, onNavigate, onSearchSportVenues, onSelectCategory }) {
  const containerRef = useRef(null);
  const activityGridRef = useRef(null);
  const sportGridRef = useRef(null);
  const kidsBannerRef = useRef(null);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Activity cards staggered entrance
      if (activityGridRef.current) {
        gsap.fromTo(
          activityGridRef.current.children,
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1.0, duration: 0.5, stagger: 0.08, delay: 0.1, ease: 'power3.out' }
        );
      }

      // Sport cards entrance
      if (sportGridRef.current) {
        gsap.fromTo(
          sportGridRef.current.children,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, delay: 0.25, ease: 'power2.out' }
        );
      }

      // Kids banner entrance
      if (kidsBannerRef.current) {
        gsap.fromTo(
          kidsBannerRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: 'power2.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Helper click handlers preserving location
  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category.slug || category.id);
    } else if (onSearchSportVenues) {
      onSearchSportVenues(category.query || category.title);
    }
  };

  const handleSportCardClick = (sportSlug) => {
    if (onSelectSport) {
      onSelectSport(sportSlug);
    }
  };

  const handlePopularActivityClick = (act) => {
    if (onSearchSportVenues) {
      onSearchSportVenues(act.query || act.name);
    }
  };

  const handleKidsBannerClick = () => {
    if (onSearchSportVenues) {
      onSearchSportVenues('Kids');
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#040906] text-white pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-radial from-[#00FF66]/10 via-[#00FF66]/5 to-transparent blur-3xl pointer-events-none rounded-full z-0" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-20 sm:space-y-24">
        
        {/* ==================================================
            EXPLORE BY ACTIVITY
           ================================================== */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-[#00FF66] font-extrabold text-xs uppercase tracking-widest">
              <Layers className="w-4 h-4 text-[#00FF66]" />
              <span>CATEGORY DISCOVERY</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
              EXPLORE BY <span className="text-gradient-bright">ACTIVITY</span>
            </h2>
            <p className="text-xs sm:text-base text-gray-300 font-medium">
              Find the right experience for every mood.
            </p>
          </div>

          {/* 6 Category Cards Grid */}
          <div
            ref={activityGridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activityCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#00FF66] transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(0,255,102,0.25)] hover:scale-[1.02] flex flex-col justify-end p-6"
              >
                {/* Background Image with Zoom */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040906] via-[#040906]/60 to-black/30 group-hover:via-[#040906]/40 transition-colors duration-500" />

                {/* Subtle Green Glow Overlay */}
                <div className="absolute inset-0 bg-[#00FF66]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Card Content */}
                <div className="relative z-10 flex items-end justify-between">
                  <div className="space-y-1">
                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight group-hover:text-[#00FF66] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs font-semibold text-gray-300">
                      "{cat.subtitle}"
                    </p>
                  </div>

                  {/* Circular Green Arrow Button */}
                  <div className="w-10 h-10 rounded-full border-2 border-[#00FF66]/40 group-hover:border-[#00FF66] bg-[#040906]/80 group-hover:bg-[#00FF66] text-white group-hover:text-[#040906] flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 shrink-0 ml-3">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================
            EXPLORE BY SPORT + POPULAR ACTIVITIES
           ================================================== */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#00FF66] font-extrabold text-xs uppercase tracking-widest mb-1">
                <Trophy className="w-4 h-4 text-[#00FF66]" />
                <span>POPULAR SPORTS</span>
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
                EXPLORE BY <span className="text-gradient-bright">SPORT</span>
              </h2>
              <p className="text-xs sm:text-base text-gray-300 font-medium mt-1">
                Choose your game. Find your spot.
              </p>
            </div>
          </div>

          {/* Responsive Split Section: Desktop 2/3 Sports Cards + 1/3 Popular Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT 2 COLUMNS: 6 CINEMATIC SPORT CARDS */}
            <div
              ref={sportGridRef}
              className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {sportsData.map((sport) => (
                <div
                  key={sport.id}
                  onClick={() => handleSportCardClick(sport.slug)}
                  className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#00FF66] transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(0,255,102,0.25)] hover:scale-[1.02] flex flex-col justify-between p-6"
                >
                  {/* Background Image */}
                  <img
                    src={sport.cardImage || sport.heroImage}
                    alt={sport.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040906] via-[#040906]/60 to-black/30 group-hover:via-[#040906]/40 transition-colors duration-500" />

                  {/* Top Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="w-10 h-10 rounded-2xl bg-[#040906]/80 text-[#00FF66] border border-[#00FF66]/30 backdrop-blur-md flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
                      {sport.icon}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#040906]/80 text-gray-300 border border-white/10 backdrop-blur-md">
                      {sport.stats?.venues || '50+'} Venues
                    </span>
                  </div>

                  {/* Bottom Information */}
                  <div className="relative z-10 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-[#00FF66] tracking-widest block mb-0.5">
                        {sport.category}
                      </span>
                      <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight group-hover:text-[#00FF66] transition-colors">
                        {sport.name}
                      </h3>
                    </div>

                    {/* Circular Green Arrow Button */}
                    <div className="w-10 h-10 rounded-full border-2 border-[#00FF66]/40 group-hover:border-[#00FF66] bg-[#040906]/80 group-hover:bg-[#00FF66] text-white group-hover:text-[#040906] flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 shrink-0 ml-3">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT 1 COLUMN: POPULAR ACTIVITIES PANEL */}
            <div className="glass-panel-glow border border-[#00FF66]/30 rounded-3xl p-6 space-y-4 shadow-2xl bg-[#061208]/90">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-white font-heading font-bold text-lg">
                  <Activity className="w-5 h-5 text-[#00FF66]" />
                  <span>POPULAR ACTIVITIES</span>
                </div>
                <span className="text-[10px] font-bold text-[#00FF66] uppercase tracking-wider">
                  Trending
                </span>
              </div>

              {/* List of 8 items */}
              <div className="space-y-2.5">
                {popularActivitiesList.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => handlePopularActivityClick(act)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-[#00FF66]/15 border border-white/5 hover:border-[#00FF66]/40 transition-all duration-300 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-[#040906] border border-white/10 group-hover:border-[#00FF66]/40 transition-colors flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4 text-[#00FF66]" />
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#00FF66] transition-colors">
                          {act.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          {act.category}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#00FF66] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================
            KIDS & FAMILY SECTION (PROMOTIONAL BANNER)
           ================================================== */}
        <div
          ref={kidsBannerRef}
          onClick={handleKidsBannerClick}
          className="group relative rounded-3xl overflow-hidden border border-[#00FF66]/30 hover:border-[#00FF66] transition-all duration-500 shadow-2xl cursor-pointer p-8 sm:p-12 lg:p-14"
        >
          {/* Background Image with Dark Overlay */}
          <img
            src="/images/activity_kids_family.jpg"
            alt="Kids Playground"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040906] via-[#040906]/90 to-black/60" />

          {/* Banner Content */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 inline-flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>FAMILY & RECREATION</span>
              </span>

              <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase leading-tight">
                A SAFER, HAPPIER <br />
                <span className="text-[#00FF66]">PLAYGROUND FOR KIDS.</span>
              </h2>

              <p className="text-xs sm:text-base text-gray-300 font-medium max-w-xl leading-relaxed">
                Kids sports, play areas and more — discover family-friendly venues near you.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKidsBannerClick();
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-[#00FF66] hover:bg-[#10B981] text-[#040906] font-heading font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-[#00FF66]/25 hover:shadow-[#00FF66]/40 hover:scale-[1.02] transition-all cursor-pointer inline-flex items-center gap-2 group-button"
                >
                  <span>Explore Kids & Family →</span>
                </button>
              </div>
            </div>

            {/* Feature Points on the Right */}
            <div className="space-y-3.5 glass-panel p-6 rounded-2xl border border-white/10 bg-[#040906]/80">
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span>Safe & Verified Venues</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span>Age-Appropriate Facilities</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span>Fun for All Ages</span>
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================
            BOTTOM BENEFITS
           ================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 hover:border-[#00FF66]/40 transition-all duration-300 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Wide Variety</h3>
            <p className="text-xs text-gray-400 font-medium">Multiple sports & activities</p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 hover:border-[#00FF66]/40 transition-all duration-300 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Verified Venues</h3>
            <p className="text-xs text-gray-400 font-medium">Play with confidence</p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 hover:border-[#00FF66]/40 transition-all duration-300 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Easy Booking</h3>
            <p className="text-xs text-gray-400 font-medium">Book in minutes</p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 hover:border-[#00FF66]/40 transition-all duration-300 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">For Everyone</h3>
            <p className="text-xs text-gray-400 font-medium">Kids, friends, families, athletes</p>
          </div>
        </div>

      </div>
    </div>
  );
}
