import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FastForward } from 'lucide-react';

export default function IntroAnimation({ onComplete }) {
  const containerRef = useRef(null);
  const cameraRigRef = useRef(null);
  const stadiumImgRef = useRef(null);
  const overlayRef = useRef(null);
  const flareRef = useRef(null);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      if (onComplete) onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => {
              if (onComplete) onComplete();
            }
          });
        }
      });

      // --- INITIAL STATES (Frame 1: Stadium Visible Immediately) ---
      // Single Image: stadium-wide.png (Scale: 2.8, Blur: 12px, Brightness: 0.4)
      gsap.set(stadiumImgRef.current, {
        scale: 2.8,
        filter: 'blur(12px) brightness(0.4) contrast(1.25)',
        transformOrigin: '50% 45%',
        opacity: 1
      });

      gsap.set(cameraRigRef.current, {
        perspective: 1200,
        rotateX: 4,
        rotateY: -2,
        z: -80
      });

      gsap.set(overlayRef.current, {
        opacity: 0.85
      });

      gsap.set(flareRef.current, {
        scale: 0.4,
        opacity: 0
      });

      // --- SINGLE-IMAGE CINEMATIC REVEAL TIMELINE (2.0 SECONDS) ---
      tl.to(stadiumImgRef.current, {
        scale: 1.0,
        filter: 'blur(0px) brightness(1.0) contrast(1.0)',
        duration: 2.0,
        ease: 'power3.inOut'
      })
      .to(cameraRigRef.current, {
        rotateX: 0,
        rotateY: 0,
        z: 0,
        duration: 2.0,
        ease: 'power2.out'
      }, 0)
      .to(overlayRef.current, {
        opacity: 0.25,
        duration: 2.0,
        ease: 'power2.inOut'
      }, 0)
      .to(flareRef.current, {
        scale: 1.6,
        opacity: 0.85,
        duration: 0.6,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      }, 0.8);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSkip = () => {
    setIsSkipped(true);
    if (containerRef.current) {
      gsap.killTweensOf('*');
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });
    } else if (onComplete) {
      onComplete();
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#040906] flex flex-col items-center justify-center overflow-hidden select-none pointer-events-auto"
    >
      {/* Small Skip Intro Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-[11px] tracking-wider font-bold text-gray-300 hover:text-white hover:border-[#00FF66]/50 transition-all duration-300 cursor-pointer shadow-xl group"
        aria-label="Skip introduction animation"
      >
        <span>SKIP INTRO</span>
        <FastForward className="w-3 h-3 text-[#00FF66] group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* 3D Camera Rig Window */}
      <div
        ref={cameraRigRef}
        className="relative w-full h-full preserve-3d overflow-hidden flex items-center justify-center"
      >
        {/* Single Image Stadium Reveal (stadium-wide.png visible from Frame 1) */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <img
            ref={stadiumImgRef}
            src="/images/stadium-wide.png"
            alt="Stadium Cinematic Reveal"
            className="w-full h-full object-cover object-center transform"
          />
        </div>

        {/* Stadium Floodlight Lens Flare Pulse */}
        <div
          ref={flareRef}
          className="absolute z-20 w-[650px] h-[650px] rounded-full pointer-events-none bg-radial from-[#00FF66]/35 via-[#00FF66]/10 to-transparent blur-3xl"
        />

        {/* Atmospheric Dark Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-30 bg-radial from-transparent via-[#040906]/60 to-[#040906]/95 pointer-events-none"
        />
      </div>
    </div>
  );
}
