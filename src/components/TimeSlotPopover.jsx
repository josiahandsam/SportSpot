import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Clock, Check, X } from 'lucide-react';

export default function TimeSlotPopover({
  isOpen,
  onClose,
  triggerRef,
  selectedSlot,
  onSelectSlot
}) {
  const popoverRef = useRef(null);
  const [position, setPosition] = useState({ top: -9999, left: -9999 });

  const timeSlots = [
    '5:00 PM – 7:00 PM',
    '6:00 PM – 8:00 PM',
    '7:00 PM – 9:00 PM',
    '8:00 PM – 10:00 PM',
    '9:00 PM – 11:00 PM'
  ];

  // Position calculation relative to viewport with auto-flip ABOVE trigger if needed
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = triggerRect.bottom + 8;
    if (top + popoverRect.height > viewportHeight - 12) {
      top = Math.max(12, triggerRect.top - popoverRect.height - 8);
    }

    let left = triggerRect.left;
    if (left + popoverRect.width > viewportWidth - 16) {
      left = viewportWidth - popoverRect.width - 16;
    }
    left = Math.max(16, left);

    setPosition({ top, left });
  }, [isOpen, triggerRef]);

  // Dismiss event listeners
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleScrollOrResize = () => {
      onClose();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 999999
      }}
      className="w-[280px] sm:w-[300px] p-4.5 rounded-[20px] bg-[#061208]/95 backdrop-blur-2xl border border-[#00FF66]/30 shadow-2xl shadow-black/90 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
        <div className="flex items-center gap-2 text-[#00FF66] font-extrabold text-xs uppercase tracking-wider">
          <Clock className="w-4 h-4 text-[#00FF66]" />
          <span>Select Time Slot</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Time Slot Horizontal Buttons */}
      <div className="flex flex-col gap-2">
        {timeSlots.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => {
                onSelectSlot(slot);
                onClose();
              }}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] shadow-md shadow-[#00FF66]/20 font-extrabold'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200 hover:text-white hover:border-[#00FF66]/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00FF66]' : 'text-gray-400'}`} />
                <span>{slot}</span>
              </div>
              {isSelected && <Check className="w-4 h-4 text-[#00FF66] shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
