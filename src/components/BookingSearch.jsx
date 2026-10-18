import React, { useState, useRef } from 'react';
import { MapPin, Trophy, Calendar, Clock, Search, ChevronDown, Lock } from 'lucide-react';
import SportPickerPopover from './SportPickerPopover';
import DatePickerPopover from './DatePickerPopover';
import TimeSlotPopover from './TimeSlotPopover';

export default function BookingSearch({
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
  const [activePopover, setActivePopover] = useState(null); // 'sport' | 'date' | 'time' | null

  const sportTriggerRef = useRef(null);
  const dateTriggerRef = useRef(null);
  const timeTriggerRef = useRef(null);

  const sportsList = [
    { name: 'Football' },
    { name: 'Cricket' },
    { name: 'Badminton' },
    { name: 'Basketball' },
    { name: 'Tennis' },
    { name: 'Volleyball' }
  ];

  const selectedSportObj = sportsList.find((s) => s.name === sport);

  const isLocationSelected = Boolean(location && location !== 'Select Location');
  const isFormComplete = isLocationSelected && Boolean(sport) && Boolean(date) && Boolean(timeSlot);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!isFormComplete) return;
    if (onSearch) {
      onSearch({ location, sport, date, time: timeSlot });
    }
  };

  const togglePopover = (type) => {
    if (!isLocationSelected) return;
    setActivePopover((prev) => (prev === type ? null : type));
  };

  // Format time slot for compact display without clipping (e.g. "6:00 PM – 8:00 PM" -> "6 PM – 8 PM")
  const formatTimeDisplay = (slot) => {
    if (!slot) return 'Select Time';
    return slot.replace(/:00/g, '');
  };

  return (
    <div className="booking-search-bar w-full max-w-5xl mx-auto p-2 sm:p-2.5 lg:p-3 rounded-2xl sm:rounded-full glass-panel-glow border border-[#00FF66]/30 shadow-2xl shadow-black/80">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_1.1fr_1.35fr_1.25fr] gap-2 items-center w-full">
        
        {/* 1. LOCATION */}
        <div
          onClick={onOpenLocationModal}
          className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-full bg-white/5 hover:bg-[#00FF66]/10 transition-all border border-white/5 hover:border-[#00FF66]/40 group cursor-pointer"
        >
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#00FF66] shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col text-left overflow-hidden min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300">1. Location</span>
            <span className="text-xs sm:text-sm font-extrabold text-white truncate">
              {location || 'Select City'}
            </span>
          </div>
        </div>

        {/* 2. SPORT SELECTOR (Custom Trigger - NO HTML SELECT) */}
        <div
          ref={sportTriggerRef}
          onClick={() => togglePopover('sport')}
          className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-full transition-all border ${
            isLocationSelected
              ? activePopover === 'sport'
                ? 'bg-[#00FF66]/15 border-[#00FF66]/60 cursor-pointer shadow-lg shadow-[#00FF66]/10'
                : 'bg-white/5 hover:bg-white/10 border-white/5 cursor-pointer group'
              : 'bg-white/5 opacity-40 cursor-not-allowed border-transparent'
          }`}
        >
          <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 ${isLocationSelected ? 'text-[#00FF66] group-hover:scale-110' : 'text-gray-500'} shrink-0 transition-transform`} />
          <div className="flex flex-col text-left overflow-hidden min-w-0 w-full">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300 flex items-center justify-between">
              <span>2. Sport</span>
              {!isLocationSelected && <Lock className="w-2.5 h-2.5 text-gray-500" />}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-white truncate flex items-center gap-1.5">
              <span className="truncate">{selectedSportObj ? selectedSportObj.name : (sport || 'Select Sport')}</span>
              {isLocationSelected && <ChevronDown className={`w-3 h-3 text-[#00FF66] ml-auto shrink-0 transition-transform ${activePopover === 'sport' ? 'rotate-180' : ''}`} />}
            </span>
          </div>
        </div>

        {/* 3. DATE SELECTOR */}
        <div
          ref={dateTriggerRef}
          onClick={() => togglePopover('date')}
          className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-full transition-all border ${
            isLocationSelected
              ? activePopover === 'date'
                ? 'bg-[#00FF66]/15 border-[#00FF66]/60 cursor-pointer shadow-lg shadow-[#00FF66]/10'
                : 'bg-white/5 hover:bg-white/10 border-white/5 cursor-pointer group'
              : 'bg-white/5 opacity-40 cursor-not-allowed border-transparent'
          }`}
        >
          <Calendar className={`w-4 h-4 sm:w-5 sm:h-5 ${isLocationSelected ? 'text-[#00FF66] group-hover:scale-110' : 'text-gray-500'} shrink-0 transition-transform`} />
          <div className="flex flex-col text-left overflow-hidden min-w-0 w-full">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300 flex items-center justify-between">
              <span>3. Date</span>
              {!isLocationSelected && <Lock className="w-2.5 h-2.5 text-gray-500" />}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-white truncate flex items-center gap-1.5">
              {date || 'Select Date'}
              {isLocationSelected && <ChevronDown className={`w-3 h-3 text-[#00FF66] ml-auto shrink-0 transition-transform ${activePopover === 'date' ? 'rotate-180' : ''}`} />}
            </span>
          </div>
        </div>

        {/* 4. TIME SLOT SELECTOR */}
        <div
          ref={timeTriggerRef}
          onClick={() => togglePopover('time')}
          className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-full transition-all border ${
            isLocationSelected
              ? activePopover === 'time'
                ? 'bg-[#00FF66]/15 border-[#00FF66]/60 cursor-pointer shadow-lg shadow-[#00FF66]/10'
                : 'bg-white/5 hover:bg-white/10 border-white/5 cursor-pointer group'
              : 'bg-white/5 opacity-40 cursor-not-allowed border-transparent'
          }`}
        >
          <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${isLocationSelected ? 'text-[#00FF66] group-hover:scale-110' : 'text-gray-500'} shrink-0 transition-transform`} />
          <div className="flex flex-col text-left overflow-hidden min-w-0 w-full">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300 flex items-center justify-between">
              <span>4. Time Slot</span>
              {!isLocationSelected && <Lock className="w-2.5 h-2.5 text-gray-500" />}
            </span>
            <span
              className="text-xs sm:text-[13px] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1.5"
              title={timeSlot || 'Select Time'}
            >
              <span>{formatTimeDisplay(timeSlot)}</span>
              {isLocationSelected && <ChevronDown className={`w-3 h-3 text-[#00FF66] ml-auto shrink-0 transition-transform ${activePopover === 'time' ? 'rotate-180' : ''}`} />}
            </span>
          </div>
        </div>

        {/* 5. SUBMIT CTA BUTTON */}
        <div className="w-full">
          <button
            type="submit"
            disabled={!isFormComplete}
            onClick={handleSubmit}
            className={`w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-full font-extrabold text-xs sm:text-sm lg:text-base flex items-center justify-center gap-2 transition-all duration-300 ${
              isFormComplete
                ? 'bg-gradient-to-r from-[#00FF66] to-[#10B981] text-[#040906] shadow-lg shadow-[#00FF66]/25 hover:shadow-[#00FF66]/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                : 'bg-white/10 text-gray-400 cursor-not-allowed opacity-50 border border-white/5'
            }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Find a Spot</span>
          </button>
        </div>

      </form>

      {/* React Portal Floating Popovers */}
      <SportPickerPopover
        isOpen={activePopover === 'sport'}
        onClose={() => setActivePopover(null)}
        triggerRef={sportTriggerRef}
        selectedSport={sport}
        onSelectSport={onChangeSport}
        sportsList={sportsList}
      />

      <DatePickerPopover
        isOpen={activePopover === 'date'}
        onClose={() => setActivePopover(null)}
        triggerRef={dateTriggerRef}
        selectedDateStr={date}
        onSelectDate={onChangeDate}
      />

      <TimeSlotPopover
        isOpen={activePopover === 'time'}
        onClose={() => setActivePopover(null)}
        triggerRef={timeTriggerRef}
        selectedSlot={timeSlot}
        onSelectSlot={onChangeTimeSlot}
      />

    </div>
  );
}
