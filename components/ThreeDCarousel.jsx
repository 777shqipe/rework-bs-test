'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

const CARD_W = 266;
const CARD_H = 342;
const AUTO_MS = 5000;

const catColors = {
  management: { accent: '#c4a76c' },
  website: { accent: '#8ab4c4' },
  marketing: { accent: '#c48a8a' },
  crm: { accent: '#8ac4a7' },
};

export default function ThreeDCarousel({ projects, t }) {
  const n = projects.length;
  const step = 360 / n;
  const [current, setCurrent] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startRot: 0 });
  const autoRef = useRef(null);
  const timerRef = useRef(null);
  const trackRef = useRef(null);

  const goTo = useCallback((idx) => {
    const next = ((idx % n) + n) % n;
    setCurrent(next);
    setRotation(-next * step);
  }, [n, step]);

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  const startAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (!dragging) goTo(current < n - 1 ? current + 1 : 0);
    }, AUTO_MS);
  }, [current, n, goTo, dragging]);

  const stopAuto = useCallback(() => clearInterval(autoRef.current), []);

  useEffect(() => { startAuto(); return stopAuto; }, [startAuto, stopAuto]);

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(startAuto, 3000);
  }, [startAuto]);

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    stopAuto();
    dragRef.current = { startX: e.clientX, startRot: rotation };
  }, [rotation, stopAuto]);

  const onPointerMove = useCallback((e) => {
    if (!dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    setRotation(dragRef.current.startRot + dx * 0.35);
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const snapped = Math.round(-rotation / step);
    const idx = ((snapped % n) + n) % n;
    setCurrent(idx);
    setRotation(-idx * step);
    resetTimer();
  }, [dragging, rotation, step, n, resetTimer]);

  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `rotateY(${rotation}deg)`;
  }, [rotation]);

  const radius = Math.max(CARD_W / (2 * Math.sin(Math.PI / n)), CARD_W * 0.8);

  return (
    <div className="relative w-full select-none" style={{ perspective: '1400px' }}>
      <div
        className="relative mx-auto overflow-visible"
        style={{ height: CARD_H + 60, perspective: '1400px' }}
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <div
          ref={trackRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            transition: dragging ? 'none' : 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={dragging ? onPointerUp : undefined}
          onPointerCancel={onPointerUp}
        >
          {projects.map((p, i) => {
            const cat = catColors[p.categoryKey] || catColors.website;
            const angle = i * step;
            const diff = ((angle + rotation) % 360 + 360) % 360;
            const norm = diff > 180 ? diff - 360 : diff;
            const absN = Math.abs(norm);

            if (absN > 110) return (
              <div
                key={p.key}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: CARD_W,
                  height: CARD_H,
                  marginLeft: -CARD_W / 2,
                  marginTop: -CARD_H / 2,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            );

            const opacity = Math.max(0.15, 1 - absN / 100);
            const blur = absN > 25 ? Math.min(absN / 20, 5) : 0;
            const scaleFactor = 1 - (absN / 2200);

            return (
              <div
                key={p.key}
                className="flex flex-col justify-between p-6"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: CARD_W,
                  height: CARD_H,
                  marginLeft: -CARD_W / 2,
                  marginTop: -CARD_H / 2,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) scale3d(${scaleFactor}, ${scaleFactor}, 1)`,
                  backfaceVisibility: 'hidden',
                  opacity,
                  filter: blur > 0 ? `blur(${blur}px)` : 'none',
                  zIndex: 100 - Math.round(absN),
                  transition: dragging ? 'none' : 'opacity 0.3s, filter 0.3s, transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
                  borderRadius: 24,
                  background: 'linear-gradient(145deg, #faf6ee 0%, #f0ead8 100%)',
                  border: '1px solid rgba(166, 159, 147, 0.35)',
                  borderTopColor: 'rgba(255, 255, 255, 0.55)',
                  borderLeftColor: 'rgba(255, 255, 255, 0.45)',
                  boxShadow: '8px 10px 24px rgba(42, 30, 16, 0.30), -4px -4px 16px rgba(255, 248, 235, 0.12), inset 3px 3px 8px rgba(255, 255, 255, 0.45), inset -2px -2px 6px rgba(166, 159, 147, 0.10)',
                  overflow: 'hidden',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent 0%, ${cat.accent}60 50%, transparent 100%)` }} />
                <div>
                  <div className="absolute font-black tracking-tighter select-none top-4 right-5 text-4xl opacity-[0.06]" style={{ color: '#3d3828' }}>{p.year}</div>
                  <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3" style={{ color: cat.accent, background: `${cat.accent}12`, border: `1px solid ${cat.accent}28` }}>
                    {t(`projects.categories.${p.categoryKey}`)}
                  </span>
                  <h3 className="text-base sm:text-lg font-black leading-tight text-[#2d2818] mb-1.5 line-clamp-2">{p.n}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed line-clamp-3 text-[#6a6050]">{p.desc}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-[#d4cfc5]/40">
                  {p.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full" style={{ color: cat.accent, background: `${cat.accent}10`, border: `1px solid ${cat.accent}1a` }}>{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={prev}
        className="absolute left-2 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-[200] w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 group"
        style={{
          background: 'linear-gradient(145deg, rgba(61, 40, 32, 0.85) 0%, rgba(42, 30, 22, 0.95) 100%)',
          border: '1px solid rgba(212, 164, 90, 0.20)',
          borderTopColor: 'rgba(212, 164, 90, 0.30)',
          boxShadow: '3px 4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(212, 164, 90, 0.10)',
          color: '#d4a45a',
        }}
        aria-label="Previous"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button onClick={next}
        className="absolute right-2 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-[200] w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 group"
        style={{
          background: 'linear-gradient(145deg, rgba(61, 40, 32, 0.85) 0%, rgba(42, 30, 22, 0.95) 100%)',
          border: '1px solid rgba(212, 164, 90, 0.20)',
          borderTopColor: 'rgba(212, 164, 90, 0.30)',
          boxShadow: '3px 4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(212, 164, 90, 0.10)',
          color: '#d4a45a',
        }}
        aria-label="Next"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      
    </div>
  );
}