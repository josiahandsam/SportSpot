import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, Trophy, AlertTriangle, ShieldCheck, Tag, Loader2, RefreshCw } from 'lucide-react';
import { cancelUserBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

export default function BookingDetailsModal({ booking, onClose, onBookingUpdated }) {
  const { user } = useAuth();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  if (!booking) return null;

  const handleConfirmCancel = async () => {
    if (!user) {
      setCancelError('You must be signed in to cancel this booking.');
      return;
    }

    setIsCancelling(true);
    setCancelError(null);

    try {
      await cancelUserBooking(booking.id, user.uid);
      setShowCancelConfirm(false);
      if (onBookingUpdated) onBookingUpdated();
      onClose();
    } catch (err) {
      console.error('Cancellation failed:', err);
      setCancelError(err.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const statusColor = 
    booking.status === 'Confirmed' ? 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/30' :
    booking.status === 'Completed' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
    'bg-rose-500/10 text-rose-400 border-rose-500/30';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#061208] rounded-3xl border border-[#00FF66]/30 shadow-2xl overflow-hidden text-white p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-panel text-gray-300 hover:text-[#00FF66] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="font-mono text-xs font-extrabold text-[#00FF66] bg-[#00FF66]/10 px-3 py-1 rounded-full border border-[#00FF66]/30">
            {booking.id}
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor}`}>
            ● {booking.status.toUpperCase()}
          </span>
        </div>

        {/* Venue Preview */}
        <div className="flex items-center gap-4">
          <img
            src={booking.image || '/images/venue_football.jpg'}
            alt={booking.venue}
            className="w-20 h-20 object-cover rounded-2xl border border-white/10 shrink-0"
          />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#00FF66] tracking-wider flex items-center gap-1">
              <Trophy className="w-3 h-3 text-[#00FF66]" />
              <span>{booking.sport}</span>
            </span>
            <h3 className="font-heading font-black text-xl text-white">
              {booking.venue}
            </h3>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>{booking.address || booking.location}</span>
            </p>
          </div>
        </div>

        {/* Detailed Items List */}
        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3 text-xs">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#00FF66]" /> Date:
            </span>
            <span className="font-bold text-white">{booking.date}</span>
          </div>

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#00FF66]" /> Time Slot:
            </span>
            <span className="font-bold text-white">{booking.time}</span>
          </div>

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#00FF66]" /> Duration:
            </span>
            <span className="font-semibold text-white">{booking.duration || '2 hours'}</span>
          </div>

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-400">Rate per Hour:</span>
            <span className="font-semibold text-white">₹{booking.pricePerHour}</span>
          </div>

          <div className="flex justify-between pt-1 text-sm">
            <span className="font-bold text-white uppercase tracking-wider">Total Paid:</span>
            <span className="font-heading font-black text-xl text-[#00FF66]">
              ₹{booking.totalPrice?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Cancel Confirmation Prompt OR Action Buttons */}
        {!showCancelConfirm ? (
          <div className="space-y-3">
            {booking.status === 'Confirmed' && (
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)}
                className="w-full py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                CANCEL BOOKING
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl glass-panel text-gray-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          /* CANCEL CONFIRMATION DIALOG */
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3 animate-in fade-in duration-200">
            <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
            <h4 className="font-heading font-bold text-base text-white">
              Cancel this booking?
            </h4>
            <p className="text-xs text-gray-300">
              Are you sure you want to cancel your reservation for <strong className="text-white">{booking.venue}</strong> on {booking.date}?
            </p>

            {cancelError && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                {cancelError}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 rounded-xl glass-panel text-xs font-bold text-gray-300 hover:text-white cursor-pointer disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-600 shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Cancel Booking</span>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
