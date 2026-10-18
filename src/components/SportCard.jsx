import React, { useRef } from 'react';
import { ArrowUpRight, Trophy, CheckCircle2 } from 'lucide-react';

export default function SportCard({ sport, isSelected, onClick }) {
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(sport)}
      className={`sport-card-container group relative flex-shrink-0 w-72 sm:w-80 h-[420px] rounded-3xl cursor-pointer perspective-1000 select-none transition-all duration-500 ${
        isSelected ? 'scale-[1.03] z-20' : 'scale-100'
      }`}
    >
      {/* Outer 3D Card Shell */}
      <div
        className={`w-full h-full rounded-3xl p-5 backdrop-blur-xl border transition-all duration-500 transform-gpu preserve-3d flex flex-col justify-between overflow-hidden ${
          isSelected
            ? 'glass-panel-glow border-[#00FF66] shadow-[0_0_40px_rgba(0,255,102,0.35)] -translate-y-2'
            : 'glass-panel border-white/10 group-hover:border-[#00FF66]/60 group-hover:-translate-y-3 group-hover:rotate-x-2 group-hover:rotate-y-2 group-hover:shadow-[0_25px_60px_rgba(0,255,102,0.2)]'
        }`}
      >
        {/* Background Sport Image Plane */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
          <img
            src={sport.image}
            alt={sport.name}
            className={`w-full h-full object-cover object-center transform transition-transform duration-700 ease-out ${
              isSelected
                ? 'scale-110 filter brightness-105'
                : 'group-hover:scale-110 filter brightness-90 group-hover:brightness-105'
            }`}
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040906] via-[#040906]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040906]/60 via-transparent to-transparent" />
        </div>

        {/* Top Header Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md ${
              isSelected
                ? 'bg-[#00FF66] text-[#040906] shadow-md'
                : 'bg-[#040906]/70 text-[#00FF66] border border-[#00FF66]/30'
            }`}
          >
            {sport.tag}
          </span>

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 transform group-hover:scale-110 ${
              isSelected
                ? 'bg-[#00FF66] text-[#040906] shadow-lg shadow-[#00FF66]/40'
                : 'bg-white/10 group-hover:bg-[#00FF66] text-white group-hover:text-[#040906]'
            }`}
          >
            {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className="relative z-10 transform group-hover:translate-z-6 transition-transform duration-500">
          <div className="flex items-center gap-2 mb-1 text-xs text-gray-300 font-semibold">
            <Trophy className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>{sport.count} Active Venues</span>
          </div>

          <h3
            className={`font-heading font-extrabold text-3xl sm:text-4xl tracking-tight transition-colors ${
              isSelected ? 'text-[#00FF66]' : 'text-white group-hover:text-[#00FF66]'
            }`}
          >
            {sport.name}
          </h3>
          
          <p className="text-xs text-gray-300 line-clamp-2 mt-1 font-normal leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
            {sport.description}
          </p>

          {/* Interactive Action Bar */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
            <span
              className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isSelected ? 'text-[#00FF66]' : 'text-gray-200 group-hover:text-[#00FF66]'
              }`}
            >
              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66]" />}
              <span>{isSelected ? 'Sport Selected' : 'Explore Fields'}</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#00FF66] font-extrabold">
              {isSelected ? 'Selected' : 'Book Spot →'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
