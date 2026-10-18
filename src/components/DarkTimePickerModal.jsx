import React from 'react';
import { Clock, X, Check } from 'lucide-react';

export default function DarkTimePickerModal({ isOpen, onClose, onSelectSlot, selectedSlot }) {
  if (!isOpen) return null;

  const timeSlots = [
    '5:00 PM – 7:00 PM',
    '6:00 PM – 8:00 PM',
    '7:00 PM – 9:00 PM',
    '8:00 PM – 10:00 PM',
    '9:00 PM – 11:00 PM'
  ];

  const handleSelect = (slot) => {
    onSelectSlot(slot);
    onClose();
  };

  return (
    <>
      {/* Invisible backdrop to catch click-outside */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Time Slot Popover Dropdown */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 mt-3 w-72 bg-[#061109]/95 backdrop-blur-2xl border border-[#00FF66]/40 rounded-3xl p-4 shadow-2xl shadow-black/90 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        
        {/* Pointer Arrow pointing to TIME SLOT field */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 lg:left-10 lg:translate-x-0 w-4 h-4 bg-[#061109] border-t border-l border-[#00FF66]/40 rotate-45 z-10" />

        <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
          <div className="flex items-center gap-2 text-[#00FF66] font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
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

        <div className="relative z-20 flex flex-col gap-2">
          {timeSlots.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => handleSelect(slot)}
                className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#00FF66] text-[#040906] border-[#00FF66] shadow-lg shadow-[#00FF66]/30 font-extrabold'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200 hover:text-white'
                }`}
              >
                <span>{slot}</span>
                {isSelected && <Check className="w-4 h-4 text-[#040906]" />}
              </button>
            );
          })}
        </div>

      </div>
    </>
  );
}

