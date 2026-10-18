import React, { useState } from 'react';
import { MapPin, Search, X, Navigation, Check, Sparkles } from 'lucide-react';

export default function LocationSelectorModal({ isOpen, onClose, onSelectLocation, currentLocation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [detecting, setDetecting] = useState(false);

  if (!isOpen) return null;

  const popularCities = [
    { name: 'Coimbatore', state: 'Tamil Nadu' },
    { name: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Kochi', state: 'Kerala' },
    { name: 'Bangalore', state: 'Karnataka' },
    { name: 'Hyderabad', state: 'Telangana' },
    { name: 'Mumbai', state: 'Maharashtra' },
    { name: 'Delhi', state: 'NCR' }
  ];

  const filteredCities = popularCities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (cityName) => {
    onSelectLocation(cityName);
    onClose();
  };

  const handleDetectLocation = () => {
    setDetecting(true);
    setTimeout(() => {
      setDetecting(false);
      onSelectLocation('Coimbatore');
      onClose();
    }, 600);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelectLocation(searchQuery.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel-glow border border-[#00FF66]/30 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-[#00FF66]/30 text-xs font-bold text-[#00FF66]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 1: Choose City</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight uppercase">
            WHERE ARE YOU <span className="text-gradient-bright">PLAYING?</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-normal">
            Choose your city to discover sports facilities near you.
          </p>
        </div>

        {/* City Search Form */}
        <form onSubmit={handleCustomSubmit} className="relative">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl glass-panel border border-white/10 focus-within:border-[#00FF66]/60 transition-all">
            <Search className="w-5 h-5 text-[#00FF66] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your city (e.g. Coimbatore, Chennai...)"
              className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none placeholder-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Use My Current Location CTA */}
        <button
          type="button"
          onClick={handleDetectLocation}
          className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-[#00FF66]/15 border border-white/10 hover:border-[#00FF66]/40 text-xs sm:text-sm font-bold text-[#00FF66] flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
        >
          <Navigation className={`w-4 h-4 ${detecting ? 'animate-spin' : ''}`} />
          <span>{detecting ? 'Detecting Location...' : 'Use my current location'}</span>
        </button>

        {/* Popular Locations Grid */}
        <div>
          <span className="text-[11px] uppercase font-extrabold tracking-wider text-gray-400 block mb-3">
            POPULAR LOCATIONS
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {(searchQuery ? filteredCities : popularCities).map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => handleSelect(city.name)}
                className={`px-4 py-3 rounded-2xl text-left transition-all duration-300 flex items-center justify-between cursor-pointer border ${
                  currentLocation === city.name
                    ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] font-extrabold'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-200 hover:text-white font-semibold'
                }`}
              >
                <div>
                  <div className="text-xs sm:text-sm">{city.name}</div>
                  <div className="text-[10px] text-gray-400 font-normal">{city.state}</div>
                </div>
                {currentLocation === city.name && <Check className="w-4 h-4 text-[#00FF66]" />}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
