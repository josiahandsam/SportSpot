import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function SportsSection({ selectedSport, onSelectSport }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const sportsData = [
    {
      id: 'football',
      name: 'Football',
      category: 'TURF & FIELDS',
      image: '/images/card_football.jpg'
    },
    {
      id: 'cricket',
      name: 'Cricket',
      category: 'NETS & PITCH',
      image: '/images/card_cricket.jpg'
    },
    {
      id: 'badminton',
      name: 'Badminton',
      category: 'INDOOR COURTS',
      image: '/images/card_badminton.jpg'
    },
    {
      id: 'basketball',
      name: 'Basketball',
      category: 'HARDWOOD',
      image: '/images/card_basketball.jpg'
    },
    {
      id: 'tennis',
      name: 'Tennis',
      category: 'CLAY & HARD',
      image: '/images/card_tennis.jpg'
    },
    {
      id: 'volleyball',
      name: 'Volleyball',
      category: 'SAND & COURT',
      image: '/images/card_volleyball.jpg'
    }
  ];

  // GSAP Stagger Entrance & Subtle Scroll Velocity Tilt
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      // Stagger entrance animation
      gsap.fromTo(
        '.photographic-sport-card',
        { opacity: 0, y: 20, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform'
        }
      );

      // Subtle scroll velocity tilt
      ScrollTrigger.create({
        trigger: track,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const tilt = Math.max(-4, Math.min(4, velocity / 350));
          gsap.to('.photographic-sport-card', {
            rotateY: tilt,
            duration: 0.25,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (sportName) => {
    if (onSelectSport) {
      onSelectSport(sportName);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto px-2 sm:px-0 py-2 my-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1 sm:px-0">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#00FF66]" />
          <h2 className="font-heading font-black text-xs sm:text-sm text-white tracking-wider uppercase">
            POPULAR <span className="text-[#00FF66]">SPORTS</span>
          </h2>
        </div>
        <span className="text-xs font-medium text-gray-300 hidden sm:inline-block tracking-wide">
          Select sport to filter facilities
        </span>
      </div>

      {/* Compact Responsive Track / Grid */}
      <div className="w-full overflow-x-auto scrollbar-none py-1.5 px-0.5">
        <div
          ref={trackRef}
          className="flex lg:grid lg:grid-cols-6 gap-3 sm:gap-3 lg:gap-3 items-stretch justify-start min-w-max lg:min-w-0 w-full preserve-3d"
        >
          {sportsData.map((sport) => {
            const isSelected = selectedSport === sport.name;
            return (
              <div
                key={sport.id}
                onClick={() => handleCardClick(sport.name)}
                className={`photographic-sport-card group relative flex-shrink-0 lg:flex-shrink w-[145px] sm:w-[155px] lg:w-full h-[210px] sm:h-[225px] rounded-2xl cursor-pointer select-none transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'scale-[1.02] z-20 shadow-[0_0_25px_rgba(0,255,102,0.35)] border-2 border-[#00FF66] -translate-y-1'
                    : 'scale-100 border border-white/15 hover:border-[#00FF66]/60 hover:-translate-y-1 hover:scale-[1.015] hover:shadow-lg'
                }`}
              >
                {/* Photographic Background Image with Enhanced Brightness & Clarity (+10-15%) */}
                <img
                  src={sport.image}
                  alt={sport.name}
                  className={`w-full h-full object-cover object-center transition-all duration-500 ease-out ${
                    isSelected
                      ? 'scale-105 filter brightness-125 contrast-[1.20] saturate-115'
                      : 'filter brightness-110 contrast-[1.15] saturate-110 group-hover:brightness-[1.20] group-hover:scale-105'
                  }`}
                />

                {/* Refined Gradient Overlay for Enhanced Equipment Visibility + Crisp Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040906]/80 via-[#040906]/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent pointer-events-none" />

                {/* Top Right Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 z-10 animate-in fade-in zoom-in duration-200">
                    <div className="w-6 h-6 rounded-full bg-[#00FF66] text-[#040906] flex items-center justify-center shadow-md shadow-[#00FF66]/40">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                )}

                {/* Bottom Content Area with Drop Shadows for Crisp Contrast */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10 flex flex-col justify-end text-left group-hover:translate-y-[-1px] transition-transform duration-200">
                  <h3
                    className={`font-heading font-extrabold text-lg sm:text-xl tracking-tight transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
                      isSelected ? 'text-[#00FF66]' : 'text-white group-hover:text-[#00FF66]'
                    }`}
                  >
                    {sport.name}
                  </h3>

                  <span
                    className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider mt-0.5 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${
                      isSelected ? 'text-gray-200' : 'text-gray-300 group-hover:text-white'
                    }`}
                  >
                    {sport.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
