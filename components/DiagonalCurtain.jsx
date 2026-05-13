'use client';

import { useEffect, useState } from 'react';

export default function CurtainReveal({ onComplete }) {
  const [phase, setPhase] = useState('closed'); // closed | opening | open

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('opening'), 100);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase === 'opening') {
      const t2 = setTimeout(() => {
        setPhase('open');
        onComplete?.();
      }, 1800);
      return () => clearTimeout(t2);
    }
  }, [phase, onComplete]);

  if (phase === 'open') return null;

  const opening = phase === 'opening';

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Left curtain */}
      <div
        className="absolute inset-y-0 left-0 transition-transform duration-[1400ms]"
        style={{
          right: '50%',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          transform: opening ? 'translateX(-105%) skewX(-6deg)' : 'translateX(0) skewX(0deg)',
          transformOrigin: 'left center',
          background: `
            linear-gradient(90deg, #020305 0%, #080c14 40%, #0d1117 100%)
          `,
          boxShadow: opening
            ? 'none'
            : 'inset -20px 0 60px rgba(0,0,0,0.8), 4px 0 20px rgba(0,0,0,0.5)',
        }}
      />

      {/* Right curtain */}
      <div
        className="absolute inset-y-0 right-0 transition-transform duration-[1400ms]"
        style={{
          left: '50%',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          transform: opening ? 'translateX(105%) skewX(6deg)' : 'translateX(0) skewX(0deg)',
          transformOrigin: 'right center',
          background: `
            linear-gradient(90deg, #0d1117 0%, #080c14 60%, #020305 100%)
          `,
          boxShadow: opening
            ? 'none'
            : 'inset 20px 0 60px rgba(0,0,0,0.8), -4px 0 20px rgba(0,0,0,0.5)',
        }}
      />

      {/* Inner glow line — center seam */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] transition-opacity duration-[800ms]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(34,211,238,0.6) 20%, rgba(34,211,238,0.6) 80%, transparent 100%)',
          opacity: opening ? 1 : 0.15,
          boxShadow: opening
            ? '0 0 30px rgba(34,211,238,0.5), 0 0 60px rgba(34,211,238,0.2)'
            : 'none',
          transitionDelay: opening ? '200ms' : '0ms',
        }}
      />

      {/* Radial burst from center */}
      <div
        className="absolute inset-0 transition-opacity duration-[1000ms]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.15) 0%, transparent 50%)',
          opacity: opening ? 1 : 0,
          transitionDelay: opening ? '300ms' : '0ms',
        }}
      />

      {/* Logo block */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-700"
        style={{
          opacity: opening ? 0 : 1,
          transform: opening ? 'scale(0.92) translateY(8px)' : 'scale(1) translateY(0)',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="text-center">
          <span className="block text-3xl sm:text-5xl font-black tracking-tighter text-[#f0e8dc]">
            BACK SOFTWARE
          </span>
          <div className="mt-3 mx-auto h-[1px] w-0 animate-expand-line" />
        </div>
      </div>

      <style jsx>{`
        @keyframes expand-line {
          0% { width: 0; opacity: 0; }
          40% { width: 0; opacity: 1; }
          100% { width: 80px; opacity: 1; }
        }
        .animate-expand-line {
          background: linear-gradient(90deg, transparent, #22d3ee, transparent);
          animation: expand-line 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}
