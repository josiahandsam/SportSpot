import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Trophy, Star, CheckCircle, ShieldCheck, Sparkles, Home, Ticket, AlertCircle, Lock, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/bookingService';

export default function BookingSummary({ bookingData, onBack, onComplete, onViewBookings }) {
  const { user, loading: authLoading } = useAuth();
  const [createdBooking, setCreatedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  if (!bookingData) return null;

  const { venue, date, timeSlot } = bookingData;
  const priceNum = venue.priceNum || (typeof venue.pricePerHour === 'number' ? venue.pricePerHour : 800);
  const serviceFee = 40;
  const totalPrice = priceNum + serviceFee;

  const handleConfirm = async () => {
    if (!user) {
      setSubmitError('Authentication required: Please sign in or register to complete your booking reservation.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const newBooking = await createBooking({
        venue,
        venueId: venue.id,
        venueName: venue.name,
        sport: venue.sport || 'Football',
        location: venue.location || 'Coimbatore',
        address: venue.address || 'Avinashi Road, Coimbatore',
        date: date.includes('202') ? date : `${date}, 2026`,
        timeSlot: timeSlot,
        duration: '2 hours',
        pricePerHour: priceNum,
        platformFee: serviceFee,
        totalPrice: totalPrice,
        status: 'Confirmed'
      }, user.uid, { fallbackOnError: false });

      setCreatedBooking(newBooking);
    } catch (err) {
      console.error('Firestore createBooking failed:', err);
      setSubmitError(err.message || 'Failed to confirm booking with Firestore. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#040906]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#061208] border border-[#00FF66]/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden my-auto">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#00FF66]/10 rounded-full blur-3xl pointer-events-none" />

        {!createdBooking ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-[#00FF66] transition-colors group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Venue Details</span>
              </button>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30">
                Step 2 of 2: Review & Confirm
              </span>
            </div>

            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase mb-6 tracking-tight">
              BOOKING <span className="text-[#00FF66]">SUMMARY</span>
            </h2>

            {/* Venue Preview Card */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl glass-panel border border-white/10 mb-6">
              <img
                src={venue.image || '/images/venue_football.jpg'}
                alt={venue.name}
                className="w-full sm:w-36 h-28 object-cover rounded-xl border border-white/10"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-[#00FF66] tracking-wider px-2 py-0.5 rounded-md bg-[#00FF66]/10 border border-[#00FF66]/20">
                      {venue.sport || 'Football'}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    {venue.name || 'Elite Football Arena'}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
                    <span>Avinashi Road, Coimbatore</span>
                  </p>
                </div>

                <div className="text-xs text-gray-300 flex items-center gap-1.5 font-semibold mt-2">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>4.8 (126 reviews)</span>
                </div>
              </div>
            </div>

            {/* Selected Booking Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Selected Date</span>
                  <span className="text-sm font-bold text-white">{date}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Selected Time Slot</span>
                  <span className="text-sm font-bold text-white">{timeSlot}</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 mb-6 space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1">
                PRICE DETAILS
              </h4>
              <div className="flex justify-between text-xs text-gray-300">
                <span>Slot Rate (1 Hour)</span>
                <span className="font-semibold text-white">₹{priceNum}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-300">
                <span>Convenience & Platform Fee</span>
                <span className="font-semibold text-white">₹{serviceFee}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center text-sm">
                <span className="font-bold text-white uppercase tracking-wider">Total Payable</span>
                <span className="font-heading font-extrabold text-2xl text-[#00FF66]">
                  ₹{totalPrice}
                </span>
              </div>
            </div>

            {/* Guarantee Note */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 bg-[#00FF66]/5 p-3 rounded-xl border border-[#00FF66]/20">
              <ShieldCheck className="w-4 h-4 text-[#00FF66] shrink-0" />
              <span>Instant Confirmation • Saved securely to Firestore & your account</span>
            </div>

            {/* Unauthenticated User Warning */}
            {!authLoading && !user && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>You must be signed in to confirm this reservation.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onComplete) onComplete('login');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-[#040906] font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer shrink-0"
                >
                  Sign In →
                </button>
              </div>
            )}

            {/* Submit Error Banner */}
            {submitError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3 mb-4 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{submitError}</span>
                </div>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Confirm CTA */}
            {!user ? (
              <button
                type="button"
                onClick={() => {
                  if (onComplete) onComplete('login');
                }}
                className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#040906] font-heading font-extrabold text-base tracking-wider uppercase shadow-lg shadow-amber-400/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                <span>SIGN IN TO CONFIRM BOOKING</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl bg-gradient-to-r from-[#00FF66] to-[#10B981] text-[#040906] font-heading font-extrabold text-base tracking-wider uppercase shadow-lg shadow-[#00FF66]/20 hover:shadow-[#00FF66]/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isSubmitting ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>CONFIRMING RESERVATION...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>CONFIRM BOOKING</span>
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          /* ==================================================
             SECTION 3: BOOKING CONFIRMATION SCREEN
             ================================================== */
          <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-300">
            
            {/* Animated Checkmark Circle */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-[#00FF66]/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#00FF66] to-[#10B981] text-[#040906] flex items-center justify-center shadow-2xl shadow-[#00FF66]/40">
                <CheckCircle className="w-10 h-10 stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00FF66] uppercase tracking-widest bg-[#00FF66]/10 px-3.5 py-1 rounded-full border border-[#00FF66]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BOOKING CONFIRMED</span>
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight pt-1">
                {createdBooking.venue}
              </h2>
            </div>

            {/* Booking Summary Card */}
            <div className="p-5 rounded-2xl glass-panel border border-[#00FF66]/30 text-left max-w-md mx-auto space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-gray-400 font-medium">Booking ID</span>
                <span className="font-mono font-extrabold text-[#00FF66] text-sm bg-[#00FF66]/10 px-2.5 py-0.5 rounded-md border border-[#00FF66]/20">
                  {createdBooking.id}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400 font-medium">Sport</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>{createdBooking.sport}</span>
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400 font-medium">Location</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>{createdBooking.location}</span>
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400 font-medium">Date</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>{createdBooking.date}</span>
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400 font-medium">Time Slot</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>{createdBooking.time}</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-gray-400 font-medium">Total Price</span>
                <span className="font-heading font-black text-xl text-[#00FF66]">
                  ₹{createdBooking.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons: VIEW MY BOOKINGS & BACK TO HOME */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onViewBookings) onViewBookings();
                  else if (onComplete) onComplete('my-bookings');
                }}
                className="px-6 py-3.5 rounded-2xl bg-[#00FF66] text-[#040906] font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-[#00FF66]/20 flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>VIEW MY BOOKINGS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onComplete) onComplete('home');
                }}
                className="px-6 py-3.5 rounded-2xl glass-panel border border-white/10 text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-gray-300" />
                <span>BACK TO HOME</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
