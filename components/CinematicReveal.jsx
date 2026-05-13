'use client';

import { useEffect, useState } from 'react';

export default function CinematicReveal({ onComplete }) {
  const [phase, setPhase] = useState('closed');

  useEffect(() => {
    const t = setTimeout(() => setPhase('opening'), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 'opening') {
      const t = setTimeout(() => {
        setPhase('open');
        onComplete?.();
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  if (phase === 'open') return null;
  const opening = phase === 'opening';

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Top black bar */}
      <div
        className="absolute top-0 left-0 right-0 bg-[#020305] transition-transform duration-[1400ms]"
        style={{
          height: '50%',
          transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
          transform: opening ? 'translateY(-101%)' : 'translateY(0)',
          boxShadow: opening ? 'none' : '0 20px 80px rgba(0,0,0,0.9)',
        }}
      />

      {/* Bottom black bar */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#020305] transition-transform duration-[1400ms]"
        style={{
          height: '50%',
          transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
          transform: opening ? 'translateY(101%)' : 'translateY(0)',
          boxShadow: opening ? 'none' : '0 -20px 80px rgba(0,0,0,0.9)',
        }}
      />

      {/* Horizontal lens flare sweep */}
      <div
        className="absolute left-0 right-0 h-[1px] transition-all duration-[800ms]"
        style={{
          top: '50%',
          background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.8), rgba(167,139,250,0.6), rgba(34,211,238,0.8), transparent)',
          opacity: opening ? 1 : 0,
          transform: opening ? 'scaleX(1)' : 'scaleX(0)',
          boxShadow: opening
            ? '0 0 20px rgba(34,211,238,0.6), 0 0 60px rgba(34,211,238,0.3), 0 0 100px rgba(167,139,250,0.2)'
            : 'none',
          transitionDelay: opening ? '200ms' : '0ms',
        }}
      />

      {/* Radial glow burst from center line */}
      <div
        className="absolute inset-0 transition-opacity duration-[1200ms]"
        style={{
          background: 'radial-gradient(ellipse 100% 4% at 50% 50%, rgba(34,211,238,0.15) 0%, transparent 70%)',
          opacity: opening ? 1 : 0,
          transitionDelay: opening ? '300ms' : '0ms',
        }}
      />

      {/* Logo — centered between the bars */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-700"
        style={{
          opacity: opening ? 0 : 1,
          transform: opening ? 'scale(0.95) translateY(4px)' : 'scale(1) translateY(0)',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="text-center">
          <span className="block text-2xl sm:text-4xl font-black tracking-[0.15em] text-[#f0e8dc]/80">
            BACK SOFTWARE
          </span>
        </div>
      </div>
    </div>
  );
}
