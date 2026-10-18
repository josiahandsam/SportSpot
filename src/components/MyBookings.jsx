import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Calendar, Clock, MapPin, Trophy, Sparkles, ChevronRight, Ticket,
  ArrowLeft, AlertTriangle, RefreshCw, Lock, AlertCircle
} from 'lucide-react';
import { getUserBookings, isBookingPast } from '../services/bookingService.js';
import { getBookings as getLocalBookings } from '../utils/bookingStorage.js';
import { useAuth } from '../context/AuthContext';
import BookingDetailsModal from './BookingDetailsModal';

export default function MyBookings({ onFindSpot, onBackToHome, onNavigate }) {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'UPCOMING' | 'PAST' | 'CANCELLED'
  const [bookingsList, setBookingsList] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);

  // Fetch live bookings for the signed-in user from Firestore using their Auth UID
  useEffect(() => {
    let isMounted = true;

    async function loadUserBookings() {
      if (authLoading) return;

      if (!user) {
        if (isMounted) {
          setBookingsList([]);
          setIsLoadingBookings(false);
        }
        return;
      }

      setIsLoadingBookings(true);
      setError(null);

      try {
        // Query Firestore for this authenticated user's bookings without silently masking errors
        const liveBookings = await getUserBookings(user.uid, {
          fallbackOnError: false,
          includeLocalStorageFallback: false
        });

        if (!isMounted) return;
        setBookingsList(liveBookings);
        setIsUsingFallback(false);
      } catch (err) {
        if (!isMounted) return;
        console.error('Firestore getUserBookings query failed:', err);
        // Do not silently substitute mock data after a Firestore error
        setError(err.message || 'Failed to retrieve bookings from Firestore.');
      } finally {
        if (isMounted) {
          setIsLoadingBookings(false);
        }
      }
    }

    loadUserBookings();

    const handleUpdate = () => {
      setFetchTrigger((prev) => prev + 1);
    };

    window.addEventListener('sportspot_bookings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('sportspot_bookings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [user, authLoading, fetchTrigger]);

  const handleRetry = () => {
    setFetchTrigger((prev) => prev + 1);
  };

  const handleLoadOfflineBookings = () => {
    setError(null);
    const local = getLocalBookings();
    const userLocal = user ? local.filter((b) => b.userId === user.uid || !b.userId) : local;
    setBookingsList(userLocal);
    setIsUsingFallback(true);
  };

  // Filter bookings based on activeTab
  const filteredBookings = bookingsList.filter((b) => {
    const isPast = isBookingPast(b.date);
    if (activeTab === 'UPCOMING') return b.status === 'Confirmed' && !isPast;
    if (activeTab === 'PAST') return b.status === 'Completed' || (b.status === 'Confirmed' && isPast);
    if (activeTab === 'CANCELLED') return b.status === 'Cancelled';
    return true; // 'ALL'
  });

  const getStatusBadge = (status) => {
    if (status === 'Confirmed') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30 shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
          <span>CONFIRMED</span>
        </span>
      );
    }
    if (status === 'Completed') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>COMPLETED</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-rose-400" />
        <span>CANCELLED</span>
      </span>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#040906] text-white pt-32 pb-16 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-[#00FF66] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040906] text-white pt-24 pb-16 px-4 sm:px-8 relative overflow-hidden">
      
      {/* Background Accent Blur */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-radial from-[#00FF66]/10 to-transparent blur-3xl pointer-events-none rounded-full z-0" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Header Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-[#00FF66] transition-colors mb-2 group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase leading-none">
              MY <span className="text-gradient-bright">BOOKINGS</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 font-medium">
              Your upcoming and past games
            </p>
          </div>

          {/* Quick CTA */}
          <button
            type="button"
            onClick={onFindSpot}
            className="px-5 py-2.5 rounded-full bg-[#00FF66] text-[#040906] font-heading font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#00FF66]/20 hover:scale-105 transition-all cursor-pointer self-start sm:self-auto"
          >
            Find a Spot →
          </button>
        </div>

        {/* Development / Offline Notice */}
        {isUsingFallback && (
          <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Showing offline session bookings cache.</span>
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

        {/* Tab Selector Pills */}
        <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto custom-results-scroll">
          {[
            { id: 'ALL', label: 'All Bookings' },
            { id: 'UPCOMING', label: 'Upcoming' },
            { id: 'PAST', label: 'Past' },
            { id: 'CANCELLED', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#00FF66] text-[#040906] shadow-md shadow-[#00FF66]/20'
                  : 'glass-panel text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. UNAUTHENTICATED STATE */}
        {!user ? (
          <div className="p-12 text-center glass-panel rounded-3xl border border-white/10 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-black text-2xl text-white uppercase tracking-tight">
                Authentication Required
              </h3>
              <p className="text-xs text-gray-400">
                Please sign in to view your confirmed bookings and game reservations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('login');
                else if (onBackToHome) onBackToHome();
              }}
              className="px-6 py-3 rounded-full bg-[#00FF66] text-[#040906] font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-[#00FF66]/20 inline-flex items-center gap-2"
            >
              <span>Sign In to Continue →</span>
            </button>
          </div>
        ) : isLoadingBookings ? (
          /* 2. LOADING SKELETON STATE */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl glass-panel border border-white/10 overflow-hidden flex flex-col justify-between h-[380px] animate-pulse"
              >
                <div className="h-44 w-full bg-white/5 relative">
                  <div className="absolute top-3 left-3 w-24 h-6 rounded-full bg-white/10" />
                  <div className="absolute top-3 right-3 w-20 h-6 rounded-full bg-white/10" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-16 h-4 rounded bg-white/10" />
                    <div className="w-3/4 h-5 rounded bg-white/10" />
                    <div className="w-1/2 h-3 rounded bg-white/5" />
                  </div>
                  <div className="h-16 rounded-2xl bg-white/5 p-3 space-y-2">
                    <div className="w-1/3 h-3 rounded bg-white/10" />
                    <div className="w-1/2 h-3 rounded bg-white/10" />
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="w-16 h-5 rounded bg-white/10" />
                    <div className="w-24 h-8 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* 3. ERROR STATE - Preserves Firestore integrity and does not silently substitute mock data */
          <div className="p-8 text-center glass-panel rounded-3xl border border-red-500/20 bg-red-950/10 space-y-4 my-4 max-w-xl mx-auto">
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
                onClick={handleLoadOfflineBookings}
                className="px-4 py-2 rounded-xl glass-panel border border-white/10 hover:border-white/30 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                View Local Offline Bookings
              </button>
            </div>
          </div>
        ) : filteredBookings.length > 0 ? (
          /* 4. BOOKINGS LIST GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="group relative rounded-3xl glass-panel border border-white/10 hover:border-[#00FF66]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Top Image & Status Overlay */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={b.image || b.venueImage || '/images/venue_football.jpg'}
                    alt={b.venue || b.venueName || 'Venue'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061208] via-transparent to-black/30" />

                  {/* Top ID & Status */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="font-mono text-[10px] font-extrabold bg-[#040906]/90 text-[#00FF66] px-2.5 py-1 rounded-full border border-[#00FF66]/30 backdrop-blur-md">
                      {b.id}
                    </span>
                    {getStatusBadge(b.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold text-[#00FF66] tracking-wider px-2 py-0.5 rounded-md bg-[#00FF66]/10 border border-[#00FF66]/20 flex items-center gap-1.5 w-fit">
                        <Trophy className="w-3 h-3 text-[#00FF66]" />
                        <span>{b.sport || 'Sport'}</span>
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#00FF66] transition-colors">
                      {b.venue || b.venueName || 'Sports Venue'}
                    </h3>
                    
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
                      <span>{b.location || 'Coimbatore'}</span>
                    </p>
                  </div>

                  {/* Date & Time Info */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-gray-200 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-[#00FF66]" />
                      <span>{b.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#00FF66]" />
                      <span>{b.time || b.timeSlot}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Total</span>
                      <span className="font-heading font-extrabold text-lg text-[#00FF66]">
                        ₹{b.totalPrice?.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedBookingForDetails(b)}
                      className="px-4 py-2 rounded-full glass-panel hover:bg-[#00FF66] text-white hover:text-[#040906] text-xs font-bold transition-all cursor-pointer shadow-md"
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* 5. EMPTY STATE */
          <div className="p-12 sm:p-16 text-center glass-panel rounded-3xl border border-white/10 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 flex items-center justify-center mx-auto shadow-lg">
              <Ticket className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-black text-2xl text-white uppercase tracking-tight">
                NO BOOKINGS YET
              </h3>
              <p className="text-xs text-gray-400">
                Your next game is waiting.
              </p>
            </div>

            <button
              type="button"
              onClick={onFindSpot}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00FF66] to-[#10B981] text-[#040906] font-heading font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#00FF66]/20 hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>FIND A SPOT →</span>
            </button>
          </div>
        )}

      </div>

      {/* DETAILS MODAL */}
      {selectedBookingForDetails && (
        <BookingDetailsModal
          booking={selectedBookingForDetails}
          onClose={() => setSelectedBookingForDetails(null)}
          onBookingUpdated={() => setFetchTrigger((prev) => prev + 1)}
        />
      )}

    </div>
  );
}
