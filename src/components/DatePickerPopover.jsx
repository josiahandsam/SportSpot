import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function DatePickerPopover({
  isOpen,
  onClose,
  triggerRef,
  selectedDateStr,
  onSelectDate
}) {
  const popoverRef = useRef(null);
  const [position, setPosition] = useState({ top: -9999, left: -9999 });

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Position calculation with view-port boundary checking and auto-flip ABOVE trigger if needed
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

  // Dismiss listeners: Outside click, Escape, Scroll, Resize
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

  const handlePrevMonth = () => {
    if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day) => {
    const isPast =
      currentYear < today.getFullYear() ||
      (currentYear === today.getFullYear() && currentMonth < today.getMonth()) ||
      (currentYear === today.getFullYear() && currentMonth === today.getMonth() && day < today.getDate());

    if (isPast) return;

    setSelectedDay(day);
    const formattedDate = `${monthNames[currentMonth]} ${day}`;
    onSelectDate(formattedDate);
    onClose();
  };

  const handleQuickSelect = (offsetDays) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    const formattedDate = `${monthNames[target.getMonth()]} ${target.getDate()}`;
    setSelectedDay(target.getDate());
    setCurrentMonth(target.getMonth());
    setCurrentYear(target.getFullYear());
    onSelectDate(formattedDate);
    onClose();
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyPads = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 999999
      }}
      className="w-[310px] sm:w-[330px] p-5 rounded-[20px] bg-[#061208]/95 backdrop-blur-2xl border border-[#00FF66]/30 shadow-2xl shadow-black/90 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2 text-[#00FF66] font-extrabold text-xs uppercase tracking-wider">
          <CalendarIcon className="w-4 h-4 text-[#00FF66]" />
          <span>Select Play Date</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Date Presets */}
      <div className="flex items-center gap-1.5 mb-3.5">
        <button
          type="button"
          onClick={() => handleQuickSelect(0)}
          className="flex-1 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-[#00FF66]/20 border border-white/10 hover:border-[#00FF66]/50 text-[11px] font-bold text-gray-200 hover:text-[#00FF66] transition-all cursor-pointer"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect(1)}
          className="flex-1 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-[#00FF66]/20 border border-white/10 hover:border-[#00FF66]/50 text-[11px] font-bold text-gray-200 hover:text-[#00FF66] transition-all cursor-pointer"
        >
          Tomorrow
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect(2)}
          className="flex-1 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-[#00FF66]/20 border border-white/10 hover:border-[#00FF66]/50 text-[11px] font-bold text-gray-200 hover:text-[#00FF66] transition-all cursor-pointer"
        >
          +2 Days
        </button>
      </div>

      {/* Month Header Navigation */}
      <div className="flex items-center justify-between text-white font-heading font-extrabold text-sm mb-3 px-1">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={currentMonth === today.getMonth() && currentYear === today.getFullYear()}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#00FF66] disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="tracking-wide text-white">{monthNames[currentMonth]} {currentYear}</span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#00FF66] transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {emptyPads.map((p) => (
          <div key={`pad-${p}`} className="h-8" />
        ))}

        {daysArray.map((day) => {
          const isPast =
            currentYear < today.getFullYear() ||
            (currentYear === today.getFullYear() && currentMonth < today.getMonth()) ||
            (currentYear === today.getFullYear() && currentMonth === today.getMonth() && day < today.getDate());

          const isToday =
            currentYear === today.getFullYear() &&
            currentMonth === today.getMonth() &&
            day === today.getDate();

          const isSelected = selectedDay === day && currentMonth === today.getMonth() && currentYear === today.getFullYear();

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={isPast}
              className={`h-8 w-8 mx-auto rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                isPast
                  ? 'text-gray-600 cursor-not-allowed opacity-30'
                  : isSelected
                  ? 'bg-[#00FF66] text-[#040906] shadow-lg shadow-[#00FF66]/40 font-extrabold scale-110'
                  : isToday
                  ? 'border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/20'
                  : 'text-gray-200 hover:bg-white/15 hover:text-white'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
