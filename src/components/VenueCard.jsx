import React from 'react';
import { Star, MapPin, Trophy, Clock, ArrowRight } from 'lucide-react';

export default function VenueCard({ venue, onSelect }) {
  return (
    <div className="group relative rounded-3xl glass-panel border border-white/10 hover:border-[#00FF66]/50 transition-all duration-500 overflow-hidden flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
      
      {/* Venue Image & Top Badges */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040906] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#040906]/80 text-[#00FF66] border border-[#00FF66]/30 backdrop-blur-md flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>{venue.sport}</span>
          </span>
          <div className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#040906]/80 text-amber-400 border border-amber-400/30 backdrop-blur-md flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{venue.rating}</span>
          </div>
        </div>

        {/* Location pill on image */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1 text-xs text-gray-200 font-semibold drop-shadow-md">
          <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
          <span>{venue.location}</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-[#040906]/80">
        <div>
          <h3 className="font-heading font-bold text-xl text-white group-hover:text-[#00FF66] transition-colors mb-2">
            {venue.name}
          </h3>
          <p className="text-xs text-gray-400 font-normal line-clamp-2 leading-relaxed mb-4">
            {venue.amenities}
          </p>
        </div>

        {/* Pricing & Booking CTA */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Pricing</span>
            <span className="font-heading font-extrabold text-xl text-[#00FF66]">
              {venue.price}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelect && onSelect(venue)}
            className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-[#00FF66] text-white hover:text-[#040906] text-xs font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-md"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
