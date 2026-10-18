import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  X, Star, MapPin, Trophy, Calendar, Clock, CheckCircle2, ShieldCheck,
  ChevronLeft, ChevronRight, Maximize2, Zap, Utensils, Car, Dumbbell, DoorClosed, AlertCircle, Navigation
} from 'lucide-react';
import BookingSummary from './BookingSummary';

export default function VenueDetailsModal({ venue, onClose }) {
  // Refs for animations & sticky bar scroll target
  const modalContentRef = useRef(null);
  const galleryRef = useRef(null);
  const titleRef = useRef(null);
  const infoRef = useRef(null);
  const amenitiesRef = useRef(null);
  const availabilityRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Sep 10');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [currentStep, setCurrentStep] = useState('details'); // 'details' | 'summary'

  // Venue Gallery Images (5 Cohesive Photos for Venue)
  const defaultGallery = [
    venue?.image || '/images/venue_football.jpg',
    '/images/card_football.jpg',
    '/images/stadium_wide.jpg',
    '/images/turf_macro.jpg',
    '/images/venue_football_5.jpg'
  ];
  const galleryImages = venue?.gallery && venue.gallery.length >= 5 ? venue.gallery : defaultGallery;

  // Upcoming Dates starting from Sep 10
  const datesList = [
    { id: 'Sep 10', label: 'Sep 10', day: 'Today' },
    { id: 'Sep 11', label: 'Sep 11', day: 'Tomorrow' },
    { id: 'Sep 12', label: 'Sep 12', day: 'Sat' },
    { id: 'Sep 13', label: 'Sep 13', day: 'Sun' },
    { id: 'Sep 14', label: 'Sep 14', day: 'Mon' },
  ];

  // Mock Available Slots dynamic per date
  const mockSlotsByDate = {
    'Sep 10': [
      { id: 'slot-1', time: '5:00 – 7:00 PM', status: 'Available', badgeColor: 'bg-emerald-500/10 text-[#00FF66] border-[#00FF66]/30' },
      { id: 'slot-2', time: '6:00 – 8:00 PM', status: 'Available', badgeColor: 'bg-emerald-500/10 text-[#00FF66] border-[#00FF66]/30' },
      { id: 'slot-3', time: '7:00 – 9:00 PM', status: 'Few slots left', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
      { id: 'slot-4', time: '8:00 – 10:00 PM', status: 'Booked', badgeColor: 'bg-white/5 text-gray-500 border-white/10' }
    ],
    'Sep 11': [
      { id: 'slot-1', time: '5:00 – 7:00 PM', status: 'Available', badgeColor: 'bg-emerald-500/10 text-[#00FF66] border-[#00FF66]/30' },
      { id: 'slot-2', time: '6:00 – 8:00 PM', status: 'Few slots left', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
      { id: 'slot-3', time: '7:00 – 9:00 PM', status: 'Booked', badgeColor: 'bg-white/5 text-gray-500 border-white/10' },
      { id: 'slot-4', time: '8:00 – 10:00 PM', status: 'Available', badgeColor: 'bg-emerald-500/10 text-[#00FF66] border-[#00FF66]/30' }
    ],
    'Sep 12': [
      { id: 'slot-1', time: '4:00 – 6:00 PM', status: 'Available', badgeColor: 'bg-emerald-500/10 text-[#00FF66] border-[#00FF66]/30' },
      { id: 'slot-2', time: '6:00 – 8:00 PM', status: 'Available', badgeColor: 'bg-emerald-500/10 text-[#00FF66] border-[#00FF66]/30' },
      { id: 'slot-3', time: '8:00 – 10:00 PM', status: 'Available', badgeColor: 'bg-emerald-500/10 text-[#00FF66] border-[#00FF66]/30' }
    ],
    'Sep 13': [
      { id: 'slot-1', time: '5:00 – 7:00 PM', status: 'Available', badgeColor: 'bg-emerald-500/10 text-[#00FF66] border-[#00FF66]/30' },
      { id: 'slot-2', time: '7:00 – 9:00 PM', status: 'Booked', badgeColor: 'bg-white/5 text-gray-500 border-white/10' },
      { id: 'slot-3', time: '9:00 – 11:00 PM', status: 'Available', badgeColor: 'bg-emerald-500/10 text-[#00FF66] border-[#00FF66]/30' }
    ],
    'Sep 14': [
      { id: 'slot-1', time: '6:00 – 8:00 PM', status: 'Available', badgeColor: 'bg-emerald-500/10 text-[#00FF66] border-[#00FF66]/30' },
      { id: 'slot-2', time: '8:00 – 10:00 PM', status: 'Available', badgeColor: 'bg-emerald-500/10 text-[#00FF66] border-[#00FF66]/30' }
    ]
  };

  const currentSlots = mockSlotsByDate[selectedDate] || mockSlotsByDate['Sep 10'];

  // GSAP Entrance Animations
  useEffect(() => {
    if (!venue) return;
    const ctx = gsap.context(() => {
      // Gallery entrance: fade and scale in
      gsap.fromTo(
        galleryRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
      );

      // Title & badges slide upward
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power2.out' }
      );

      // Info block stagger
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.2, ease: 'power2.out' }
      );

      // Amenities stagger
      if (amenitiesRef.current) {
        gsap.fromTo(
          amenitiesRef.current.children,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, delay: 0.25, ease: 'power2.out' }
        );
      }

      // Availability fade in
      gsap.fromTo(
        availabilityRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.3, ease: 'power2.out' }
      );
    }, modalContentRef);

    return () => ctx.revert();
  }, [venue]);

  if (!venue) return null;

  // Handle scroll detection for sticky booking bar
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    if (scrollTop > 220) {
      setShowStickyBar(true);
    } else {
      setShowStickyBar(false);
    }
  };

  // Gallery Prev/Next
  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Date selection change
  const handleDateSelect = (dateId) => {
    setSelectedDate(dateId);
    setSelectedSlot(null); // reset selected slot on date change
    setValidationError('');
  };

  // Time Slot Selection
  const handleSlotSelect = (slot) => {
    if (slot.status === 'Booked') return;
    setSelectedSlot(slot.time);
    setValidationError('');
  };

  // Book Now CTA Click
  const handleBookNowClick = () => {
    if (!selectedSlot) {
      setValidationError('Please select an available time slot.');
      // Smooth scroll down to availability section if needed
      if (availabilityRef.current) {
        availabilityRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setValidationError('');
    setCurrentStep('summary');
  };

  // Render Booking Summary Step
  if (currentStep === 'summary') {
    return (
      <BookingSummary
        bookingData={{
          venue,
          date: selectedDate,
          timeSlot: selectedSlot
        }}
        onBack={() => setCurrentStep('details')}
        onComplete={(targetView = 'home') => {
          setCurrentStep('details');
          onClose(targetView);
        }}
        onViewBookings={() => {
          setCurrentStep('details');
          onClose('my-bookings');
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Main Scrollable Modal Card */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#061208] rounded-3xl border border-[#00FF66]/30 shadow-2xl overflow-y-auto custom-results-scroll flex flex-col text-white scroll-smooth"
      >
        
        {/* Sticky Close Button (Always visible on top right) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-[#040906]/80 text-gray-300 hover:text-[#00FF66] border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* INNER CONTAINER FOR ANIMATIONS */}
        <div ref={modalContentRef} className="p-4 sm:p-8 space-y-8">
          
          {/* ==================================================
              SECTION 2: VENUE IMAGE GALLERY
             ================================================== */}
          <div ref={galleryRef} className="space-y-3">
            
            {/* Main Venue Display Box */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-white/10 group cursor-pointer shadow-2xl bg-black/40"
            >
              <img
                src={galleryImages[activeImageIndex]}
                alt={`${venue.name} Gallery ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-102"
              />
              
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061208] via-transparent to-black/40 pointer-events-none" />

              {/* Counter Badge "1 / 5" */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#040906]/80 text-white border border-white/10 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                <Maximize2 className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>{activeImageIndex + 1} / {galleryImages.length}</span>
              </div>

              {/* Expand Lightbox Hint */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-gray-200 border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Click to view fullscreen
              </div>

              {/* Prev / Next Image Overlay Controls */}
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:text-[#00FF66] border border-white/10 backdrop-blur-md opacity-80 hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:text-[#00FF66] border border-white/10 backdrop-blur-md opacity-80 hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnails Row (5 Thumbnails) */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto custom-results-scroll pb-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-16 sm:w-24 h-14 sm:h-18 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#00FF66] scale-105 shadow-lg shadow-[#00FF66]/20'
                      : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {activeImageIndex === idx && (
                    <div className="absolute inset-0 bg-[#00FF66]/10 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>


          {/* ==================================================
              SECTION 3 & 4: VENUE TITLE, METADATA & PRICE
             ================================================== */}
          <div ref={titleRef} className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/10 pb-6">
            
            {/* Title & Metadata */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Football Badge */}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{venue.sport || 'Football'}</span>
                </span>

                {/* Rating Badge */}
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.8</span>
                  <span className="text-gray-400 font-normal ml-0.5">(126 reviews)</span>
                </span>
              </div>

              <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
                {venue.name || 'Elite Football Arena'}
              </h1>

              {/* Location & Realistic Address */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-300 font-semibold">
                  <MapPin className="w-4 h-4 text-[#00FF66]" />
                  <span>Coimbatore • 1.8 km</span>
                </div>
                <p className="text-xs text-gray-400 pl-6">
                  Avinashi Road, Coimbatore
                </p>
              </div>

              {/* View on Map Button (UI Only) */}
              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00FF66] hover:underline cursor-pointer pt-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>View on Map →</span>
              </button>
            </div>

            {/* Visually Prominent PRICE PER HOUR Card */}
            <div className="p-4 rounded-2xl glass-panel border border-[#00FF66]/30 min-w-[200px] text-left md:text-right bg-gradient-to-br from-[#00FF66]/5 to-transparent">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                PRICE PER HOUR
              </span>
              <span className="font-heading font-black text-3xl text-[#00FF66] tracking-tight block">
                {venue.price || '₹800 / hour'}
              </span>
              <span className="text-[10px] text-gray-400 block mt-1">Includes turf floodlighting</span>
            </div>
          </div>


          {/* ==================================================
              SECTION 5: ABOUT THIS VENUE
             ================================================== */}
          <div ref={infoRef} className="space-y-2">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[#00FF66]">
              ABOUT THIS VENUE
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
              Premium artificial turf with professional floodlighting, quality playing surface and convenient facilities for football sessions.
            </p>
          </div>


          {/* ==================================================
              SECTION 6: VENUE FEATURES & AMENITIES
             ================================================== */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[#00FF66]">
              VENUE FEATURES & AMENITIES
            </h3>
            <div ref={amenitiesRef} className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-xl glass-panel border border-white/10 hover:border-[#00FF66]/40 transition-colors">
                <Zap className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span className="font-medium text-gray-200">Floodlit Arena</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl glass-panel border border-white/10 hover:border-[#00FF66]/40 transition-colors">
                <DoorClosed className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span className="font-medium text-gray-200">Locker Rooms</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl glass-panel border border-white/10 hover:border-[#00FF66]/40 transition-colors">
                <Car className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span className="font-medium text-gray-200">Free Parking</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl glass-panel border border-white/10 hover:border-[#00FF66]/40 transition-colors">
                <Dumbbell className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span className="font-medium text-gray-200">Equipment Available</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl glass-panel border border-white/10 hover:border-[#00FF66]/40 transition-colors">
                <Utensils className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span className="font-medium text-gray-200">Snack Bar</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl glass-panel border border-white/10 hover:border-[#00FF66]/40 transition-colors">
                <ShieldCheck className="w-4 h-4 text-[#00FF66] shrink-0" />
                <span className="font-medium text-gray-200">Instant Booking</span>
              </div>
            </div>
          </div>


          {/* ==================================================
              SECTION 8 & 7: DATE SELECTION & AVAILABILITY PREVIEW
             ================================================== */}
          <div ref={availabilityRef} className="space-y-5 p-5 sm:p-6 rounded-2xl glass-panel border border-[#00FF66]/20 bg-gradient-to-b from-[#00FF66]/5 to-transparent">
            
            {/* DATE SELECTOR */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold tracking-widest text-[#00FF66] flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>SELECT DATE</span>
              </label>

              <div className="flex gap-2 overflow-x-auto custom-results-scroll pb-1">
                {datesList.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleDateSelect(d.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col items-center min-w-[85px] cursor-pointer ${
                      selectedDate === d.id
                        ? 'bg-[#00FF66] text-[#040906] shadow-lg shadow-[#00FF66]/30 border-2 border-[#00FF66] scale-102'
                        : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span>{d.label}</span>
                    <span className={`text-[10px] font-normal ${selectedDate === d.id ? 'text-[#040906]' : 'text-gray-400'}`}>
                      {d.day}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AVAILABLE SLOTS */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-bold tracking-widest text-[#00FF66] flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>AVAILABLE SLOTS</span>
                </label>
                {selectedSlot && (
                  <span className="text-xs text-[#00FF66] font-bold">
                    Selected: {selectedSlot}
                  </span>
                )}
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentSlots.map((slot) => {
                  const isBooked = slot.status === 'Booked';
                  const isSelected = selectedSlot === slot.time;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isBooked}
                      onClick={() => handleSlotSelect(slot)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#00FF66] text-[#040906] border-[#00FF66] font-extrabold shadow-lg shadow-[#00FF66]/20 scale-102'
                          : isBooked
                          ? 'bg-white/5 text-gray-500 border-white/5 opacity-50 cursor-not-allowed'
                          : 'bg-white/5 text-gray-200 border-white/10 hover:border-[#00FF66]/50 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs font-bold block mb-1">
                        [ {slot.time} ]
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block w-max ${
                          isSelected
                            ? 'bg-[#040906] text-[#00FF66]'
                            : slot.badgeColor
                        }`}
                      >
                        {slot.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INLINE VALIDATION ERROR MESSAGE (No alert()) */}
            {validationError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* MAIN CTA: BOOK NOW → */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleBookNowClick}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00FF66] to-[#10B981] text-[#040906] font-heading font-black text-lg uppercase tracking-wider shadow-lg shadow-[#00FF66]/20 hover:shadow-[#00FF66]/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Book Now →</span>
              </button>
            </div>

          </div>


          {/* ==================================================
              SECTION 9: REVIEWS
             ================================================== */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold tracking-widest text-[#00FF66]">
                REVIEWS
              </h3>
              <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>4.8 / 5 • </span><span className="text-gray-400 font-normal">126 reviews</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2">
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 italic">
                  "Great turf, excellent lighting and very clean facilities."
                </p>
                <div className="text-[11px] font-bold text-[#00FF66]">
                  — Rahul
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2">
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 italic">
                  "Good place for weekend football."
                </p>
                <div className="text-[11px] font-bold text-[#00FF66]">
                  — Arjun
                </div>
              </div>
            </div>
          </div>

        </div>


        {/* ==================================================
            SECTION 11: STICKY BOOKING BAR (ON SCROLL)
           ================================================== */}
        {showStickyBar && (
          <div className="sticky bottom-0 left-0 right-0 z-40 p-4 bg-[#040906]/90 border-t border-[#00FF66]/30 backdrop-blur-xl animate-in slide-in-from-bottom duration-300 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-white block">
                  {venue.name || 'Elite Football Arena'}
                </span>
                <span className="text-[11px] text-[#00FF66] font-bold">
                  {venue.price || '₹800/hour'}
                </span>
              </div>
              {selectedSlot ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 font-bold">
                  {selectedDate} • {selectedSlot}
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  {venue.price || '₹800/hour'}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleBookNowClick}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#00FF66] to-[#10B981] text-[#040906] font-heading font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              Book Now →
            </button>
          </div>
        )}

      </div>


      {/* ==================================================
          SECTION 2 LIGHTBOX: FULLSCREEN IMAGE VIEWER
         ================================================== */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-300 cursor-pointer"
        >
          
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold">
              {activeImageIndex + 1} / {galleryImages.length}
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-3 rounded-full bg-white/10 hover:bg-rose-500 text-white transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Fullscreen Main Image & Arrow Nav */}
          <div className="relative flex-1 flex items-center justify-center my-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[activeImageIndex]}
              alt={`Fullscreen view ${activeImageIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />

            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 sm:left-6 p-4 rounded-full bg-black/60 text-white hover:text-[#00FF66] border border-white/20 backdrop-blur-md hover:scale-110 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 sm:right-6 p-4 rounded-full bg-black/60 text-white hover:text-[#00FF66] border border-white/20 backdrop-blur-md hover:scale-110 transition-all cursor-pointer"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Lightbox Footer Thumbnails */}
          <div className="flex justify-center gap-3 overflow-x-auto py-2 z-10">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'border-[#00FF66] scale-110' : 'border-white/20 opacity-50'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}


      {/* ==================================================
          SECTION 3: MAP MODAL (UI ONLY)
         ================================================== */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#061208] border border-[#00FF66]/30 rounded-3xl p-6 text-white space-y-4 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:text-[#00FF66]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00FF66]">
              <MapPin className="w-4 h-4" />
              <span>VENUE LOCATION</span>
            </div>

            <h3 className="font-heading font-bold text-xl text-white">
              {venue.name || 'Elite Football Arena'}
            </h3>
            <p className="text-xs text-gray-300">
              Avinashi Road, Coimbatore (1.8 km from city center)
            </p>

            {/* Dark Styled Mock Map View */}
            <div className="h-56 w-full rounded-2xl bg-[#09180d] border border-white/10 relative overflow-hidden flex items-center justify-center">
              {/* Map grid lines simulation */}
              <div className="absolute inset-0 bg-[radial-gradient(#00FF66_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              
              {/* Map roads simulation */}
              <div className="absolute w-full h-2 bg-white/10 top-1/2 -rotate-12" />
              <div className="absolute h-full w-2 bg-white/10 left-1/3 rotate-6" />

              {/* Pin */}
              <div className="relative z-10 flex flex-col items-center animate-bounce">
                <div className="px-3 py-1 rounded-full bg-[#00FF66] text-[#040906] font-extrabold text-[10px] shadow-lg mb-1">
                  {venue.name || 'Elite Football Arena'}
                </div>
                <MapPin className="w-8 h-8 text-[#00FF66] fill-[#00FF66]/30 drop-shadow-[0_0_10px_#00FF66]" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMapModal(false)}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-[#00FF66] hover:text-[#040906] font-bold text-xs transition-colors"
            >
              Close Map
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
