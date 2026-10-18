import React, { useState, useEffect } from 'react';
import { Menu, X, User, ArrowRight, MapPin, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ isIntroFinished, selectedLocation, onChangeLocationClick, activeView = 'home', onNavigate }) {
  const { user, userProfile, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = userProfile?.name || user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (item.id === 'home') {
      if (onNavigate) onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.id === 'sports') {
      if (onNavigate) onNavigate('sports');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.id === 'venues') {
      if (onNavigate) onNavigate('spot-search');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.id === 'bookings') {
      if (onNavigate) onNavigate('my-bookings');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate('home');
  };

  const navLinks = [
    { id: 'home', name: 'Home', href: '#home', isActive: activeView === 'home' },
    { id: 'sports', name: 'Sports', href: '#sports', isActive: activeView === 'sports' || activeView === 'sports-detail' || activeView === 'category-detail' },
    { id: 'venues', name: 'Venues', href: '#venues', isActive: activeView === 'spot-search' },
    { id: 'bookings', name: 'My Bookings', href: '#bookings', isActive: activeView === 'my-bookings' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isIntroFinished ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <nav
        className={`w-full px-4 sm:px-8 py-4 transition-all duration-300 ${
          scrolled ? 'glass-nav py-3' : 'bg-gradient-to-b from-[#040906]/90 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LEFT: Logo & Location Pill */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={(e) => handleNavClick(e, { id: 'home' })}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00FF66] to-[#10B981] flex items-center justify-center shadow-md shadow-[#00FF66]/20 group-hover:scale-105 transition-transform duration-300">
                <span className="font-heading font-black text-xl text-[#040906] tracking-tighter">S</span>
              </div>
              <span className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
                Sport<span className="text-[#00FF66]">Spot</span>
              </span>
            </button>

            {/* LOCATION SELECTOR BUTTON IN NAVBAR */}
            <button
              onClick={onChangeLocationClick}
              className="px-3.5 py-1.5 rounded-full glass-panel border border-[#00FF66]/30 text-xs font-bold text-[#00FF66] hover:text-white hover:border-[#00FF66]/60 transition-all flex items-center gap-1.5 cursor-pointer shadow-md group"
            >
              <MapPin className="w-3.5 h-3.5 text-[#00FF66] group-hover:scale-110 transition-transform" />
              <span>{selectedLocation || 'Select City'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
            </button>
          </div>

          {/* CENTER: Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 bg-[#08140c]/40 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={(e) => handleNavClick(e, link)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  link.isActive
                    ? 'bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30 font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* RIGHT: Desktop Auth State Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              /* LOGGED IN USER STATE */
              <div className="flex items-center gap-2">
                {/* User Profile Pill */}
                <div className="px-3 py-1.5 rounded-full glass-panel border border-[#00FF66]/30 text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
                  <div className="w-5 h-5 rounded-full bg-[#00FF66] text-[#040906] flex items-center justify-center font-black text-[10px]">
                    {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              /* LOGGED OUT STATE */
              <>
                <button
                  onClick={() => onNavigate && onNavigate('login')}
                  className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    activeView === 'login' ? 'text-[#00FF66]' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('signup')}
                  className="px-5 py-2.5 text-xs font-bold text-[#040906] bg-[#00FF66] hover:bg-[#10B981] rounded-full shadow-lg shadow-[#00FF66]/20 hover:shadow-[#00FF66]/40 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white glass-panel focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-2xl glass-panel-glow flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onChangeLocationClick();
              }}
              className="w-full p-3 rounded-xl glass-panel text-xs font-bold text-[#00FF66] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00FF66]" />
                <span>Current City: {selectedLocation || 'Select City'}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={(e) => handleNavClick(e, link)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  link.isActive ? 'bg-[#00FF66]/15 text-[#00FF66] font-bold' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </button>
            ))}

            {/* Mobile Auth Actions */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl glass-panel flex items-center gap-2 text-xs font-bold text-white">
                    <User className="w-4 h-4 text-[#00FF66]" />
                    <span>Logged in as {displayName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 border border-rose-500/30 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onNavigate) onNavigate('login');
                    }}
                    className="w-full py-2.5 text-sm font-semibold text-gray-300 glass-panel rounded-xl"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onNavigate) onNavigate('signup');
                    }}
                    className="w-full py-2.5 text-sm font-bold text-[#040906] bg-[#00FF66] rounded-xl flex items-center justify-center gap-2"
                  >
                    <span>Sign Up</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
