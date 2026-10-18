import React from 'react';
import { Trophy, ShieldCheck, Mail, Phone, MapPin, Globe, Share2, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#030604] text-gray-400 border-t border-white/10 pt-16 pb-8 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Col 1: Brand */}
        <div className="md:col-span-1">
          <a href="#" className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00FF66] to-[#10B981] flex items-center justify-center shadow-md shadow-[#00FF66]/20">
              <span className="font-heading font-black text-xl text-[#040906] tracking-tighter">S</span>
            </div>
            <span className="font-heading font-bold text-2xl text-white tracking-tight">
              Sport<span className="text-[#00FF66]">Spot</span>
            </span>
          </a>
          <p className="text-xs leading-relaxed text-gray-400 mb-6">
            The ultimate sports venue booking platform. Experience instant pitch reservations with real-time slot availability.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-gray-300 hover:text-[#00FF66] hover:border-[#00FF66]/40 transition-all">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-gray-300 hover:text-[#00FF66] hover:border-[#00FF66]/40 transition-all">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-gray-300 hover:text-[#00FF66] hover:border-[#00FF66]/40 transition-all">
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
            Sports & Grounds
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#sports" className="hover:text-[#00FF66] transition-colors">Football Arenas</a></li>
            <li><a href="#sports" className="hover:text-[#00FF66] transition-colors">Cricket Box Pitches</a></li>
            <li><a href="#sports" className="hover:text-[#00FF66] transition-colors">Badminton Courts</a></li>
            <li><a href="#sports" className="hover:text-[#00FF66] transition-colors">Basketball Hardwood</a></li>
            <li><a href="#sports" className="hover:text-[#00FF66] transition-colors">Tennis Courts</a></li>
          </ul>
        </div>

        {/* Col 3: Company */}
        <div>
          <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
            Company
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#about" className="hover:text-[#00FF66] transition-colors">About SportSpot</a></li>
            <li><a href="#venues" className="hover:text-[#00FF66] transition-colors">Partner With Us</a></li>
            <li><a href="#" className="hover:text-[#00FF66] transition-colors">List Your Venue</a></li>
            <li><a href="#" className="hover:text-[#00FF66] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[#00FF66] transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
            Support & Concierge
          </h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#00FF66] shrink-0" />
              <span>Coimbatore, Tamil Nadu, India</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#00FF66] shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#00FF66] shrink-0" />
              <span>support@sportspot.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-300">
        <p>© 2026 SportSpot Inc. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Designed for Champions.</p>
      </div>
    </footer>
  );
}
