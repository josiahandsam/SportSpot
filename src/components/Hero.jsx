import React from 'react';
import BookingSearch from './BookingSearch';
import SportsSection from './SportsSection';
import { Sparkles, ShieldCheck, Clock, Award } from 'lucide-react';

export default function Hero({
  isIntroFinished,
  location,
  sport,
  date,
  timeSlot,
  onOpenLocationModal,
  onChangeSport,
  onChangeDate,
  onChangeTimeSlot,
  onSearch
}) {
  return (
    <section
      id="home"
      className="relative flex flex-col justify-start items-center pt-24 sm:pt-28 pb-8 px-4 overflow-hidden bg-[#040906]"
    >
      {/* Background Stadium Fill */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/stadium-wide.png"
          alt="Stadium background"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-110 transform scale-100 transition-all duration-1000"
        />
        {/* Dark Vignette & Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040906] via-[#040906]/60 to-[#040906]/85" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#040906]/40 to-[#040906]/90" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-radial from-[#00FF66]/20 via-[#10B981]/5 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Main Hero Content */}
      <div
        className={`relative z-10 max-w-5xl mx-auto text-center w-full transition-all duration-1000 ease-out ${
          isIntroFinished
            ? 'opacity-100 translate-y-0 filter blur-0'
            : 'opacity-0 translate-y-10 filter blur-md pointer-events-none'
        }`}
      >
        {/* Top Feature Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-panel border border-[#00FF66]/30 mb-4 shadow-xl shadow-[#00FF66]/10">
          <Sparkles className="w-3.5 h-3.5 text-[#00FF66] animate-pulse" />
          <span className="text-[11px] font-semibold tracking-wider text-gray-200 uppercase">
            Next-Gen Sports Venue Booking
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.95] mb-3 text-white drop-shadow-2xl">
          FIND YOUR <span className="text-gradient-bright glow-text">PLAY.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-gray-300 font-normal leading-relaxed mb-6 drop-shadow-md">
          Find the perfect sports facility. Pick your slot. Play.
        </p>

        {/* Location-First Booking Search Bar */}
        <div className="mb-4 w-full">
          <BookingSearch
            location={location}
            sport={sport}
            date={date}
            timeSlot={timeSlot}
            onOpenLocationModal={onOpenLocationModal}
            onChangeSport={onChangeSport}
            onChangeDate={onChangeDate}
            onChangeTimeSlot={onChangeTimeSlot}
            onSearch={onSearch}
          />
        </div>

        {/* POPULAR SPORTS SECTION (Compact Sized Photographic Cards) */}
        <div className="mb-4 w-full">
          <SportsSection
            selectedSport={sport}
            onSelectSport={onChangeSport}
          />
        </div>

        {/* Hero Trust Indicators with High Contrast & Clear Hierarchy */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto pt-4 pb-2 border-t border-white/15">
          <div className="flex items-center justify-center gap-2 text-gray-200 hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-colors">
            <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#00FF66] shrink-0" />
            <span>Instant Confirmation</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-200 hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-colors">
            <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#00FF66] shrink-0" />
            <span>24/7 Turf Availability</span>
          </div>
          <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 text-gray-200 hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-colors">
            <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#00FF66] shrink-0" />
            <span>Verified Arenas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
