import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function BackToSportsButton({ onClick, label = 'Back to Sports', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-[#00FF66] transition-all duration-300 group cursor-pointer px-4 py-2 rounded-full glass-panel border border-white/10 hover:border-[#00FF66]/50 shadow-md backdrop-blur-md hover:bg-[#00FF66]/10 active:scale-95 ${className}`}
    >
      <ArrowLeft className="w-4 h-4 text-[#00FF66] group-hover:-translate-x-1 transition-transform duration-300 shrink-0" />
      <span className="tracking-wide">{label}</span>
    </button>
  );
}
