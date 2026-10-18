import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  ArrowLeft, MapPin, Trophy, Calendar, Clock, Filter,
  Star, Search, ChevronDown, Check, Sparkles, X, SlidersHorizontal, RefreshCw, AlertTriangle
} from 'lucide-react';
import VenueDetailsModal from './VenueDetailsModal';
import LocationSelectorModal from './LocationSelectorModal';
import SportPickerPopover from './SportPickerPopover';
import DatePickerPopover from './DatePickerPopover';
import TimeSlotPopover from './TimeSlotPopover';
import { getVenues, FALLBACK_MOCK_VENUES } from '../services/venueService.js';

export default function SpotSearch({ searchParams, onBack, onUpdateSearch, onNavigate }) {
  const containerRef = useRef(null);
  const cardsGridRef = useRef(null);

  // Active Applied Search State
  const [activeSearch, setActiveSearch] = useState({
    location: searchParams?.location || 'Coimbatore',
    sport: searchParams?.sport || 'Football',
    date: searchParams?.date || 'September 10',
    time: searchParams?.time || '6:00 PM – 8:00 PM'
  });

  // Draft Search State (Modified by popovers before clicking UPDATE SEARCH)
  const [draftSearch, setDraftSearch] = useState({
    location: searchParams?.location || 'Coimbatore',
    sport: searchParams?.sport || 'Football',
    date: searchParams?.date || 'September 10',
    time: searchParams?.time || '6:00 PM – 8:00 PM'
  });

  useEffect(() => {
    if (searchParams) {
      const initial = {
        location: searchParams.location || 'Coimbatore',
        sport: searchParams.sport || 'Football',
        date: searchParams.date || 'September 10',
        time: searchParams.time || '6:00 PM – 8:00 PM'
      };
      setActiveSearch(initial);
      setDraftSearch(initial);
    }
  }, [searchParams]);

  // Popover Open / Ref States
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  const [isSportPopoverOpen, setIsSportPopoverOpen] = useState(false);
  const sportTriggerRef = useRef(null);

  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const dateTriggerRef = useRef(null);

  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);
  const timeTriggerRef = useRef(null);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Left Filter States
  const [selectedDistance, setSelectedDistance] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('All');
  const [selectedVenueType, setSelectedVenueType] = useState('All');
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  const sportsList = [
    { name: 'Football' },
    { name: 'Cricket' },
    { name: 'Badminton' },
    { name: 'Basketball' },
    { name: 'Tennis' },
    { name: 'Volleyball' }
  ];

  // Live Firestore Data & Loading/Error States
  const [rawVenues, setRawVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Fetch active venues from Firestore on initialization (or retry)
  useEffect(() => {
    let isMounted = true;

    async function loadVenues() {
      setIsLoading(true);
      setError(null);

      try {
        // Query active venues from Firestore without suppressing real errors
        const data = await getVenues({ status: 'active', fallbackOnError: false, fallbackOnEmpty: false });
        if (!isMounted) return;

        if (Array.isArray(data) && data.length > 0) {
          setRawVenues(data);
          setIsUsingFallback(false);
        } else {
          // Firestore query succeeded but collection is empty
          setRawVenues([]);
          setIsUsingFallback(false);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Firestore getVenues error in SpotSearch:', err);
        // Do not silently mask the error with mock data; present it to the user
        setError(err.message || 'Failed to retrieve venues from Firestore.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVenues();

    return () => {
      isMounted = false;
    };
  }, [fetchTrigger]);

  // Handlers for controlled fallback and retry
  const handleUseFallback = () => {
    setError(null);
    setRawVenues(FALLBACK_MOCK_VENUES);
    setIsUsingFallback(true);
  };

  const handleRetry = () => {
    setFetchTrigger((prev) => prev + 1);
  };

  const resetFilters = () => {
    setSelectedDistance('All');
    setMaxPrice(2000);
    setMinRating(0);
    setPreferredTimeSlot('All');
    setSelectedVenueType('All');
    setSelectedFacilities([]);
  };

  // Normalize fetched venue objects for consistent client-side filtering and rendering
  const normalizedVenues = (rawVenues || []).map((v) => {
    const priceNum = typeof v.priceNum === 'number'
      ? v.priceNum
      : (typeof v.pricePerHour === 'number' ? v.pricePerHour : 800);
    const distanceKm = typeof v.distanceKm === 'number' ? v.distanceKm : 2.0;
    const distance = v.distance || `${distanceKm} km`;
    const price = v.price || v.priceFormatted || `₹${priceNum} / hour`;
    const availability = v.availability || 'Available';
    const availabilityColor = v.availabilityColor || (availability === 'Few slots left' ? 'bg-amber-400 text-black' : 'bg-[#00FF66] text-[#040906]');
    const timeSlot = v.timeSlot || '6:00 PM – 8:00 PM';
    const facilities = Array.isArray(v.facilities) ? v.facilities : ['Parking', 'Floodlights', 'Locker Rooms'];
    const sports = Array.isArray(v.sports) ? v.sports : [v.sport || 'Football'];

    return {
      ...v,
      priceNum,
      distanceKm,
      distance,
      price,
      availability,
      availabilityColor,
      timeSlot,
      facilities,
      sports,
      image: v.image || (Array.isArray(v.images) ? v.images[0] : '/images/venue_football.jpg')
    };
  });

  // Dynamic Filtering based on Search Parameters + Left Filters
  const filteredVenues = normalizedVenues.filter((v) => {
    // 1. Search Bar Location match (case-insensitive)
    if (activeSearch.location && v.location.toLowerCase() !== activeSearch.location.toLowerCase()) {
      return false;
    }

    // 2. Search Bar Sport & Activity match
    if (activeSearch.sport) {
      const q = activeSearch.sport.toLowerCase().trim();
      const s = v.sport.toLowerCase();
      const vt = v.venueType.toLowerCase();
      const name = v.name.toLowerCase();

      const isDirectMatch = s === q || s.includes(q) || name.includes(q) || vt.includes(q);

      if (!isDirectMatch) {
        if (q === 'indoor' && (v.venueType === 'Indoor' || v.venueType === 'Covered')) {
          // match indoor venues
        } else if (q === 'outdoor' && (v.venueType === 'Outdoor' || v.venueType === 'Covered')) {
          // match outdoor venues
        } else if (q.includes('kid') || q.includes('family') || q.includes('recreation') || q.includes('competitive')) {
          // match general category filters
        } else if (['gym', 'swimming', 'table tennis', 'bowling', 'snooker', 'pool', 'arcade', 'skating', 'trampoline', 'yoga', 'boxing', 'mma', 'zumba', 'crossfit', 'athletics', 'golf', 'hockey', 'squash', 'chess', 'carrom', 'go-karting', 'laser tag', 'paintball', 'gaming'].some(act => q.includes(act))) {
          // match activity keywords or show available top venues
        } else {
          return false;
        }
      }
    }

    // 3. Left Panel Distance Radius Filter
    if (selectedDistance === '2km' && v.distanceKm > 2) return false;
    if (selectedDistance === '5km' && v.distanceKm > 5) return false;
    if (selectedDistance === '10km' && v.distanceKm > 10) return false;

    // 4. Left Panel Max Price Filter
    if (v.priceNum > maxPrice) return false;

    // 5. Left Panel Rating Filter
    if (v.rating < minRating) return false;

    // 6. Left Panel Preferred Time Slot Filter
    if (preferredTimeSlot !== 'All' && v.timeSlot !== preferredTimeSlot) return false;

    // 7. Left Panel Venue Type Filter
    if (selectedVenueType !== 'All' && v.venueType !== selectedVenueType) return false;

    // 8. Left Panel Facilities Checkboxes Filter
    if (selectedFacilities.length > 0) {
      const hasAll = selectedFacilities.every((fac) => v.facilities && v.facilities.includes(fac));
      if (!hasAll) return false;
    }

    return true;
  });

  // Entrance animation for cards
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.venue-search-card',
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1.0, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
      );
    }, cardsGridRef);

    return () => ctx.revert();
  }, [filteredVenues.length, activeSearch]);

  // Handle Update Search Button Click
  const handleUpdateSearchClick = () => {
    setActiveSearch({ ...draftSearch });
    if (onUpdateSearch) {
      onUpdateSearch(draftSearch);
    }
  };

  // Facilities Checkbox Toggle
  const toggleFacility = (facilityName) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityName)
        ? prev.filter((f) => f !== facilityName)
        : [...prev, facilityName]
    );
  };

  // Render Left Filter Panel Content
  const renderFilterContent = () => (
    <>
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#00FF66]" />
          <span>Refine Results</span>
        </h3>
        <button
          type="button"
          onClick={() => {
            setSelectedDistance('All');
            setMaxPrice(2000);
            setMinRating(0);
            setPreferredTimeSlot('All');
            setSelectedVenueType('All');
            setSelectedFacilities([]);
          }}
          className="text-[11px] font-bold text-[#00FF66] hover:underline cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Distance Radius */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
          Distance Radius
        </label>
        <div className="flex flex-wrap gap-2">
          {['All', '2km', '5km', '10km'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDistance(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedDistance === d
                  ? 'bg-[#00FF66] text-[#040906] font-bold shadow-md'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {d === 'All' ? 'Any' : `Under ${d}`}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Max Price / Hour
          </label>
          <span className="text-xs font-extrabold text-[#00FF66]">₹{maxPrice}</span>
        </div>
        <input
          type="range"
          min="400"
          max="2000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#00FF66] cursor-pointer"
        />
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
          Minimum Rating
        </label>
        <div className="flex gap-2">
          {[0, 4.5, 4.8].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                minRating === r
                  ? 'bg-[#00FF66] text-[#040906] font-bold shadow-md'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {r === 0 ? 'All' : <><Star className="w-3.5 h-3.5 fill-current" /> {r}+</>}
            </button>
          ))}
        </div>
      </div>

      {/* Venue Type */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
          Venue Type
        </label>
        <div className="flex flex-wrap gap-2">
          {['All', 'Indoor', 'Outdoor', 'Covered'].map((vt) => (
            <button
              key={vt}
              type="button"
              onClick={() => setSelectedVenueType(vt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedVenueType === vt
                  ? 'bg-[#00FF66] text-[#040906] font-bold shadow-md'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {vt}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Checkboxes */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
          Facilities
        </label>
        <div className="space-y-2">
          {['Parking', 'Floodlights', 'Locker Rooms', 'Equipment', 'Snack Bar'].map((fac) => {
            const isChecked = selectedFacilities.includes(fac);
            return (
              <label
                key={fac}
                onClick={() => toggleFacility(fac)}
                className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer hover:text-white group select-none"
              >
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                  isChecked
                    ? 'bg-[#00FF66] border-[#00FF66] text-[#040906]'
                    : 'bg-white/5 border-white/20 group-hover:border-[#00FF66]/50'
                }`}>
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{fac}</span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div
      ref={containerRef}
      className="h-screen max-h-screen bg-[#040906] text-white pt-20 pb-4 px-4 sm:px-8 relative overflow-hidden flex flex-col"
    >
      {/* Background Accent Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-radial from-[#00FF66]/10 to-transparent blur-3xl pointer-events-none rounded-full z-0" />

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={(loc) => setDraftSearch((prev) => ({ ...prev, location: loc }))}
        currentLocation={draftSearch.location}
      />

      {/* Sport Picker Popover */}
      <SportPickerPopover
        isOpen={isSportPopoverOpen}
        onClose={() => setIsSportPopoverOpen(false)}
        triggerRef={sportTriggerRef}
        selectedSport={draftSearch.sport}
        onSelectSport={(sport) => setDraftSearch((prev) => ({ ...prev, sport }))}
        sportsList={sportsList}
      />

      {/* Date Picker Popover */}
      <DatePickerPopover
        isOpen={isDatePopoverOpen}
        onClose={() => setIsDatePopoverOpen(false)}
        triggerRef={dateTriggerRef}
        selectedDateStr={draftSearch.date}
        onSelectDate={(date) => setDraftSearch((prev) => ({ ...prev, date }))}
      />

      {/* Time Slot Popover */}
      <TimeSlotPopover
        isOpen={isTimePopoverOpen}
        onClose={() => setIsTimePopoverOpen(false)}
        triggerRef={timeTriggerRef}
        selectedSlot={draftSearch.time}
        onSelectSlot={(time) => setDraftSearch((prev) => ({ ...prev, time }))}
      />

      <div className="max-w-7xl mx-auto w-full h-full flex flex-col relative z-10 overflow-hidden">
        
        {/* ==================================================
            FIXED TOP SECTION (Back Button, Title & Result Count)
           ================================================== */}
        <div className="flex-none mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-[#00FF66] transition-colors mb-1 group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </button>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-none">
                FIND YOUR <span className="text-gradient-bright">SPOT</span>
              </h1>
            </div>

            {/* DYNAMIC RESULT COUNT AT TOP RIGHT */}
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 font-heading font-extrabold text-xs tracking-wide shadow-md flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>{filteredVenues.length} Venues Available</span>
              </span>
            </div>
          </div>

          {/* ==================================================
              SECTION 1: EDITABLE MODIFY SEARCH BAR
             ================================================== */}
          <div className="p-3 sm:p-3.5 rounded-2xl glass-panel-glow border border-[#00FF66]/30 shadow-xl bg-[#061208]/90">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-center">
              
              {/* 1. LOCATION FIELD */}
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00FF66]/50 flex items-center justify-between text-xs text-white transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-[#00FF66] shrink-0" />
                  <div className="text-left truncate">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Location</span>
                    <span className="font-bold text-white truncate">{draftSearch.location}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white shrink-0 ml-1" />
              </button>

              {/* 2. SPORT FIELD */}
              <button
                ref={sportTriggerRef}
                type="button"
                onClick={() => setIsSportPopoverOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00FF66]/50 flex items-center justify-between text-xs text-white transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 truncate">
                  <Trophy className="w-4 h-4 text-[#00FF66] shrink-0" />
                  <div className="text-left truncate">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Sport</span>
                    <span className="font-bold text-white truncate">{draftSearch.sport}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white shrink-0 ml-1" />
              </button>

              {/* 3. DATE FIELD */}
              <button
                ref={dateTriggerRef}
                type="button"
                onClick={() => setIsDatePopoverOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00FF66]/50 flex items-center justify-between text-xs text-white transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 truncate">
                  <Calendar className="w-4 h-4 text-[#00FF66] shrink-0" />
                  <div className="text-left truncate">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Date</span>
                    <span className="font-bold text-white truncate">{draftSearch.date}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white shrink-0 ml-1" />
              </button>

              {/* 4. TIME SLOT FIELD */}
              <button
                ref={timeTriggerRef}
                type="button"
                onClick={() => setIsTimePopoverOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00FF66]/50 flex items-center justify-between text-xs text-white transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 truncate">
                  <Clock className="w-4 h-4 text-[#00FF66] shrink-0" />
                  <div className="text-left truncate">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Time Slot</span>
                    <span className="font-bold text-white whitespace-nowrap">{draftSearch.time}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white shrink-0 ml-1" />
              </button>

              {/* 5. UPDATE SEARCH BUTTON */}
              <button
                type="button"
                onClick={handleUpdateSearchClick}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#10B981] text-[#040906] font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00FF66]/20 hover:shadow-[#00FF66]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>UPDATE SEARCH</span>
              </button>

            </div>
          </div>
        </div>

        {/* ==================================================
            MAIN SPLIT CONTENT (Left Static Filter | Right Independent Scrollable Results)
           ================================================== */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-6 overflow-hidden">
          
          {/* LEFT: STATIC / STICKY FILTER PANEL (Desktop) */}
          <aside className="hidden lg:flex flex-col h-full glass-panel border border-white/10 rounded-3xl p-5 overflow-y-auto custom-results-scroll space-y-5">
            {renderFilterContent()}
          </aside>

          {/* RIGHT: VENUE RESULTS AREA (INDEPENDENTLY SCROLLABLE) */}
          <main className="h-full overflow-y-auto custom-results-scroll pr-1 lg:pr-2">
            
            {/* Mobile Filter Toggle Button & Status */}
            <div className="lg:hidden mb-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="px-4 py-2 rounded-xl glass-panel border border-[#00FF66]/30 text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#00FF66]" />
                <span>Filters & Sort</span>
              </button>

              <div className="flex items-center gap-2">
                {isUsingFallback && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Demo Mode
                  </span>
                )}
                <span className="text-xs font-bold text-[#00FF66]">
                  {isLoading ? 'Searching...' : `${filteredVenues.length} Venues`}
                </span>
              </div>
            </div>

            {/* Desktop Fallback Warning Banner */}
            {isUsingFallback && (
              <div className="hidden lg:flex items-center justify-between mb-4 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-12">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="rounded-3xl glass-panel border border-white/10 overflow-hidden flex flex-col justify-between h-[380px] animate-pulse"
                  >
                    <div className="h-48 sm:h-52 w-full bg-white/5 relative">
                      <div className="absolute top-3 left-3 w-20 h-5 rounded-full bg-white/10" />
                      <div className="absolute top-3 right-3 w-12 h-5 rounded-full bg-white/10" />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="w-24 h-3 rounded bg-[#00FF66]/20" />
                        <div className="w-3/4 h-5 rounded bg-white/10" />
                        <div className="flex gap-2 pt-1">
                          <div className="w-16 h-4 rounded bg-white/5" />
                          <div className="w-20 h-4 rounded bg-white/5" />
                        </div>
                      </div>
                      <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                        <div className="w-16 h-6 rounded bg-white/10" />
                        <div className="w-24 h-8 rounded-full bg-white/10" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              /* 2. ERROR STATE - Preserves Firestore integrity and avoids masking */
              <div className="p-8 sm:p-12 text-center glass-panel rounded-3xl border border-red-500/20 bg-red-950/10 space-y-4 my-4">
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
            ) : filteredVenues.length > 0 ? (
              /* 3. LIVE VENUES CARDS GRID */
              <div
                ref={cardsGridRef}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-12"
              >
                {filteredVenues.map((venue) => (
                  <div
                    key={venue.id}
                    className="venue-search-card group relative rounded-3xl glass-panel border border-white/10 hover:border-[#00FF66]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                  >
                    {/* Image & Top Badges */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#040906] via-transparent to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${venue.availabilityColor} backdrop-blur-md shadow-md`}>
                          ● {venue.availability}
                        </span>
                        <div className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#040906]/80 text-amber-400 border border-amber-400/30 backdrop-blur-md flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{venue.rating}</span>
                        </div>
                      </div>

                      {/* Distance & Location */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-gray-200 font-semibold drop-shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
                        <span>{venue.location} • {venue.distance}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase font-bold text-[#00FF66] tracking-wider flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-[#00FF66]" />
                            <span>{venue.sport}</span>
                          </span>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {venue.timeSlot}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#00FF66] transition-colors mb-2">
                          {venue.name}
                        </h3>

                        {/* Venue Type & Facilities Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-gray-300 border border-white/10">
                            {venue.venueType}
                          </span>
                          {venue.facilities && venue.facilities.slice(0, 2).map((f) => (
                            <span key={f} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 text-[#00FF66]" />
                              <span>{f}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price & View Spot CTA */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">Rate</span>
                          <span className="font-heading font-extrabold text-lg text-[#00FF66]">
                            {venue.price}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedVenue(venue)}
                          className="px-4 py-2 rounded-full bg-white/10 group-hover:bg-[#00FF66] text-white group-hover:text-[#040906] text-xs font-bold transition-all duration-300 cursor-pointer shadow-md"
                        >
                          View Spot
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : rawVenues.length === 0 ? (
              /* 4. EMPTY DATABASE STATE (Connected to Firestore, 0 documents) */
              <div className="p-10 text-center glass-panel rounded-3xl space-y-4 border border-[#00FF66]/20 my-4">
                <Sparkles className="w-8 h-8 text-[#00FF66] mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-xl text-white">Connected to Firestore (0 Venues)</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Live connection established with project <span className="text-[#00FF66] font-mono">sportspot-d561b</span>. The collection is currently waiting for initial venue seeding.
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
            ) : (
              /* 5. FILTER MISMATCH STATE */
              <div className="p-12 text-center glass-panel rounded-3xl space-y-3 my-4">
                <Sparkles className="w-8 h-8 text-[#00FF66] mx-auto" />
                <h3 className="font-heading font-bold text-xl text-white">No Venues Found</h3>
                <p className="text-xs text-gray-400">
                  No venues match your current filter combination.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* MOBILE FILTER DRAWER / BOTTOM SHEET */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200 lg:hidden">
          <div className="w-full max-w-xs h-full bg-[#061208] border-l border-[#00FF66]/30 p-6 overflow-y-auto custom-results-scroll space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-lg text-white">Refine Results</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderFilterContent()}

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 rounded-xl bg-[#00FF66] text-[#040906] font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
}
