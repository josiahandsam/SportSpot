import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function DarkDatePickerModal({ isOpen, onClose, onSelectDate, selectedDateStr: _selectedDateStr }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  if (!isOpen) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

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
    const formattedWithYear = `${monthNames[currentMonth]} ${day}`;
    onSelectDate(formattedWithYear);
    onClose();
  };

  const handleQuickSelect = (offsetDays) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    const formattedWithYear = `${monthNames[target.getMonth()]} ${target.getDate()}`;
    setSelectedDay(target.getDate());
    setCurrentMonth(target.getMonth());
    setCurrentYear(target.getFullYear());
    onSelectDate(formattedWithYear);
    onClose();
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyPads = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <>
      {/* Invisible backdrop overlay to catch click-outside */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Dropdown Popover Card positioned directly below DATE item */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 mt-3 w-80 sm:w-84 bg-[#061109]/95 backdrop-blur-2xl border border-[#00FF66]/40 rounded-3xl p-5 shadow-2xl shadow-black/90 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        
        {/* Top Pointer Arrow pointing up to the DATE field */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 lg:left-10 lg:translate-x-0 w-4 h-4 bg-[#061109] border-t border-l border-[#00FF66]/40 rotate-45 z-10" />

        {/* Header */}
        <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2 text-[#00FF66] font-bold text-xs uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4" />
            <span>Select Play Date</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Date Chips */}
        <div className="relative z-20 flex items-center gap-1.5 mb-3.5">
          <button
            type="button"
            onClick={() => handleQuickSelect(0)}
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-[#00FF66]/20 border border-white/10 hover:border-[#00FF66]/50 text-[11px] font-bold text-gray-200 hover:text-[#00FF66] transition-all cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(1)}
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-[#00FF66]/20 border border-white/10 hover:border-[#00FF66]/50 text-[11px] font-bold text-gray-200 hover:text-[#00FF66] transition-all cursor-pointer"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(2)}
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-[#00FF66]/20 border border-white/10 hover:border-[#00FF66]/50 text-[11px] font-bold text-gray-200 hover:text-[#00FF66] transition-all cursor-pointer"
          >
            +2 Days
          </button>
        </div>

        {/* Month Navigation */}
        <div className="relative z-20 flex items-center justify-between text-white font-heading font-extrabold text-sm mb-3 px-1">
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
        <div className="relative z-20 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>

        {/* Calendar Grid */}
        <div className="relative z-20 grid grid-cols-7 gap-1 text-center">
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

      </div>
    </>
  );
}

