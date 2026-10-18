import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import IntroAnimation from '../components/IntroAnimation';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PopularVenues from '../components/PopularVenues';
import Footer from '../components/Footer';
import SpotSearch from '../components/SpotSearch';
import MyBookings from '../components/MyBookings';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import SportsPage from '../pages/SportsPage';
import SportDetailPage from '../pages/SportDetailPage';
import CategoryDetailPage from '../pages/CategoryDetailPage';
import LocationSelectorModal from '../components/LocationSelectorModal';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const [isIntroActive, setIsIntroActive] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.replace('#', '');
      if (['login', 'signup'].includes(h)) return false;
    }
    return true;
  });
  const [activeView, setActiveView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.replace('#', '');
      if (['home', 'spot-search', 'my-bookings', 'login', 'signup', 'sports', 'sports-detail', 'category-detail'].includes(h)) {
        return h;
      }
    }
    return 'home';
  }); // 'home' | 'spot-search' | 'my-bookings' | 'login' | 'signup' | 'sports' | 'sports-detail' | 'category-detail'
  const [selectedSportSlug, setSelectedSportSlug] = useState('football');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('outdoor-games');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [authNotice, setAuthNotice] = useState('');

  // Location-First & Shared Sport State
  const [location, setLocation] = useState('Coimbatore');
  const [sport, setSport] = useState('Football');
  const [date, setDate] = useState('September 10');
  const [timeSlot, setTimeSlot] = useState('6:00 PM – 8:00 PM');

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const pageContainerRef = useRef(null);

  const handleIntroComplete = () => {
    setIsIntroActive(false);
    if (!location) {
      setIsLocationModalOpen(true);
    }
  };

  const handleSelectLocation = (newLocation) => {
    setLocation(newLocation);
  };

  // View Navigation with GSAP Animation & History Push + Route Protection
  const handleNavigate = (targetView, options = {}) => {
    const { pushHistory = true, categorySlug, sportSlug, sportName } = options;

    if (categorySlug) setSelectedCategorySlug(categorySlug);
    if (sportSlug) setSelectedSportSlug(sportSlug);
    if (sportName) setSport(sportName);

    // Route Protection: Intercept unauthenticated access to My Bookings
    let effectiveTarget = targetView;
    if (targetView === 'my-bookings' && !user && !loading) {
      setRedirectAfterLogin('my-bookings');
      setAuthNotice('Please log in to access My Bookings.');
      effectiveTarget = 'login';
    } else if (targetView !== 'login' && targetView !== 'signup') {
      setAuthNotice('');
    }

    if (pushHistory) {
      const stateObj = { 
        view: effectiveTarget, 
        categorySlug: categorySlug || selectedCategorySlug,
        sportSlug: sportSlug || selectedSportSlug,
        sportName: sportName || sport
      };
      window.history.pushState(stateObj, '', `#${effectiveTarget}`);
    }

    if (activeView === effectiveTarget) return;

    gsap.to(pageContainerRef.current, {
      opacity: 0,
      y: 15,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setActiveView(effectiveTarget);
        window.scrollTo({ top: 0, behavior: 'instant' });
        gsap.fromTo(
          pageContainerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
      }
    });
  };

  // Protect my-bookings if activeView was set via URL hash or on auth change
  useEffect(() => {
    if (!loading && !user && activeView === 'my-bookings') {
      const timer = setTimeout(() => {
        setRedirectAfterLogin('my-bookings');
        setAuthNotice('Please log in to access My Bookings.');
        handleNavigate('login');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [loading, user, activeView]);

  // Listen to browser Back/Forward popstate events
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        if (event.state.categorySlug) setSelectedCategorySlug(event.state.categorySlug);
        if (event.state.sportSlug) setSelectedSportSlug(event.state.sportSlug);
        if (event.state.sportName) setSport(event.state.sportName);
        handleNavigate(event.state.view, { pushHistory: false });
      } else {
        handleNavigate('home', { pushHistory: false });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedCategorySlug, selectedSportSlug, sport]);

  // Listen to hashchange events
  useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash.replace('#', '');
      if (['home', 'spot-search', 'my-bookings', 'login', 'signup', 'sports', 'sports-detail', 'category-detail'].includes(h)) {
        setIsIntroActive(false);
        handleNavigate(h, { pushHistory: false });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigate to Sport Detail view
  const handleSelectSportCard = (sportSlug) => {
    handleNavigate('sports-detail', { sportSlug });
  };

  // Navigate to Category Detail view
  const handleSelectCategoryCard = (categorySlug) => {
    handleNavigate('category-detail', { categorySlug });
  };

  // Navigate to Spot Search from Sport/Category Detail with sport/activity preselected
  const handleSearchSportVenues = (sportName) => {
    handleNavigate('spot-search', { sportName });
  };

  // GSAP Smooth Transition to Spot Search Page (500–800ms)
  const handleInitiateSearch = (params) => {
    gsap.to('.booking-search-bar', {
      scale: 1.04,
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => {
        handleNavigate('spot-search');
      }
    });
  };

  return (
    <div className="bg-[#040906] min-h-screen text-white relative overflow-x-hidden">
      {/* Cinematic Camera Opening Experience */}
      {isIntroActive && <IntroAnimation onComplete={handleIntroComplete} />}

      {/* Cinematic Location Selector Overlay / Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={handleSelectLocation}
        currentLocation={location}
      />

      {/* Homepage Navigation Header with Active City Pill */}
      <Navbar
        isIntroFinished={!isIntroActive}
        selectedLocation={location}
        onChangeLocationClick={() => setIsLocationModalOpen(true)}
        activeView={activeView}
        onNavigate={handleNavigate}
      />
      
      {/* View Switcher Container */}
      <div ref={pageContainerRef}>
        {activeView === 'home' && (
          <main>
            {/* HERO SECTION (CONTAINS HERO, BOOKING SEARCH BAR, POPULAR SPORTS & TRUST INDICATORS) */}
            <Hero
              isIntroFinished={!isIntroActive}
              location={location}
              sport={sport}
              date={date}
              timeSlot={timeSlot}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onChangeSport={(s) => setSport(s)}
              onChangeDate={(d) => setDate(d)}
              onChangeTimeSlot={(t) => setTimeSlot(t)}
              onSearch={handleInitiateSearch}
            />

            {/* POPULAR VENUES */}
            <PopularVenues onNavigate={handleNavigate} />

            <Footer />
          </main>
        )}

        {activeView === 'spot-search' && (
          <div>
            <SpotSearch
              searchParams={{ location, sport, date, time: timeSlot }}
              onBack={() => handleNavigate('home')}
              onNavigate={handleNavigate}
              onUpdateSearch={(updated) => {
                setLocation(updated.location);
                setSport(updated.sport);
                setDate(updated.date);
                setTimeSlot(updated.time);
              }}
            />
            <Footer />
          </div>
        )}

        {activeView === 'my-bookings' && (
          <div>
            <MyBookings
              onFindSpot={() => handleNavigate('spot-search')}
              onBackToHome={() => handleNavigate('home')}
              onNavigate={handleNavigate}
            />
            <Footer />
          </div>
        )}

        {activeView === 'login' && (
          <div>
            <LoginPage
              onNavigate={handleNavigate}
              redirectNotice={authNotice}
              onSuccess={() => {
                const target = redirectAfterLogin || 'home';
                setRedirectAfterLogin(null);
                setAuthNotice('');
                handleNavigate(target);
              }}
            />
            <Footer />
          </div>
        )}

        {activeView === 'signup' && (
          <div>
            <SignUpPage
              onNavigate={handleNavigate}
              onSuccess={() => {
                const target = redirectAfterLogin || 'home';
                setRedirectAfterLogin(null);
                setAuthNotice('');
                handleNavigate(target);
              }}
            />
            <Footer />
          </div>
        )}

        {activeView === 'sports' && (
          <div>
            <SportsPage
              selectedLocation={location}
              onSelectSport={handleSelectSportCard}
              onSelectCategory={handleSelectCategoryCard}
              onNavigate={handleNavigate}
              onSearchSportVenues={handleSearchSportVenues}
            />
            <Footer />
          </div>
        )}

        {activeView === 'sports-detail' && (
          <div>
            <SportDetailPage
              sportSlug={selectedSportSlug}
              selectedLocation={location}
              onBackToSports={() => handleNavigate('sports')}
              onSearchSportVenues={handleSearchSportVenues}
            />
            <Footer />
          </div>
        )}

        {activeView === 'category-detail' && (
          <div>
            <CategoryDetailPage
              categorySlug={selectedCategorySlug}
              selectedLocation={location}
              onBackToSports={() => handleNavigate('sports')}
              onSearchSportVenues={handleSearchSportVenues}
            />
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
}
