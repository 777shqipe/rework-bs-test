'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

const CARD_W_DESKTOP = 266;
const CARD_H_DESKTOP = 342;
const AUTO_MS = 5000;

const catColors = {
  management: { accent: '#c4a76c' },
  website: { accent: '#8ab4c4' },
  marketing: { accent: '#c48a8a' },
  crm: { accent: '#8ac4a7' },
};

function getCardSize(vw) {
  if (vw >= 768) return { w: CARD_W_DESKTOP, h: CARD_H_DESKTOP };
  const w = Math.round(Math.min(vw * 0.62, 260));
  const h = Math.round(w * (CARD_H_DESKTOP / CARD_W_DESKTOP));
  return { w, h };
}

export default function ThreeDCarousel({ projects, t }) {
  const n = projects.length;
  const [current, setCurrent] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startRot: 0 });
  const autoRef = useRef(null);
  const timerRef = useRef(null);
  const trackRef = useRef(null);
  const [vw, setVw] = useState(0);

  useEffect(() => {
    setVw(window.innerWidth);
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw > 0 && vw < 640;
  const { w: CARD_W, h: CARD_H } = getCardSize(vw || 1200);
  const step = 360 / n;
  const radius = (() => {
    const base = Math.max(CARD_W / (2 * Math.sin(Math.PI / n)), CARD_W * 0.8);
    return isMobile ? Math.min(base, vw * 0.50) : base;
  })();
  const perspective = isMobile ? 1000 : 1400;
  const touchSensitivity = isMobile ? 0.55 : 0.35;

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

  useEffect(() => { if (vw > 0) { startAuto(); } return stopAuto; }, [startAuto, stopAuto, vw]);

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
    setRotation(dragRef.current.startRot + dx * touchSensitivity);
  }, [dragging, touchSensitivity]);

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

  const cardPad = isMobile ? 14 : 24;
  const cardRadius = isMobile ? 18 : 24;
  const tagClass = isMobile
    ? 'px-1.5 py-0.5 text-[8px]'
    : 'px-2 py-0.5 text-[10px]';

  return (
    <div className="relative w-full select-none" style={{ perspective: `${perspective}px` }}>
      <div
        className="relative mx-auto overflow-visible"
        style={{ height: CARD_H + (isMobile ? 36 : 60), perspective: `${perspective}px` }}
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
        onTouchStart={stopAuto}
        onTouchEnd={resetTimer}
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

            const opacity = Math.max(0.12, 1 - absN / 105);
            const blur = absN > 20 ? Math.min(absN / 18, 5) : 0;
            const scaleFactor = 1 - (absN / 1800);

            return (
              <div
                key={p.key}
                className="flex flex-col justify-between"
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
                  borderRadius: cardRadius,
                  padding: cardPad,
                  background: 'linear-gradient(150deg, #faf7f0 0%, #f1ebdd 100%)',
                  border: '1px solid rgba(166, 159, 147, 0.30)',
                  borderTopColor: 'rgba(255, 255, 255, 0.50)',
                  borderLeftColor: 'rgba(255, 255, 255, 0.40)',
                  boxShadow: '6px 8px 22px rgba(42, 30, 16, 0.28), -3px -3px 14px rgba(255, 250, 238, 0.10), inset 2px 2px 7px rgba(255, 255, 255, 0.40), inset -1px -1px 5px rgba(166, 159, 147, 0.08)',
                  overflow: 'hidden',
                }}
              >
                {/* Category badge + year */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={{
                        fontSize: isMobile ? 8 : 10,
                        color: cat.accent,
                        background: `${cat.accent}14`,
                        border: `1px solid ${cat.accent}2e`,
                      }}
                    >
                      {t(`projects.categories.${p.categoryKey}`)}
                    </span>
                    <span
                      className="font-black tracking-tighter select-none leading-none"
                      style={{
                        fontSize: isMobile ? 20 : 30,
                        color: '#3d3828',
                        opacity: 0.07,
                      }}
                    >
                      {p.year}
                    </span>
                  </div>

                  <h3
                    className="font-black leading-tight text-[#2d2818] line-clamp-2"
                    style={{ fontSize: isMobile ? 14 : 17, marginBottom: isMobile ? 4 : 6 }}
                  >
                    {p.n}
                  </h3>
                  <p
                    className="leading-relaxed line-clamp-3"
                    style={{ fontSize: isMobile ? 11 : 13, color: '#6a6050', marginBottom: isMobile ? 8 : 10 }}
                  >
                    {p.desc}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-2 border-t" style={{ borderColor: 'rgba(166, 159, 147, 0.25)' }}>
                  {p.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className={`${tagClass} font-bold uppercase tracking-wider rounded-full`}
                      style={{
                        color: cat.accent,
                        background: `${cat.accent}0e`,
                        border: `1px solid ${cat.accent}18`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute top-1/2 -translate-y-1/2 z-[200] flex items-center justify-center rounded-full transition-all duration-200 group"
        style={{
          left: isMobile ? 4 : 8,
          width: isMobile ? 36 : 46,
          height: isMobile ? 36 : 46,
          background: 'linear-gradient(145deg, rgba(61, 40, 32, 0.85) 0%, rgba(42, 30, 22, 0.95) 100%)',
          border: '1px solid rgba(212, 164, 90, 0.20)',
          borderTopColor: 'rgba(212, 164, 90, 0.30)',
          boxShadow: '2px 3px 10px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(212, 164, 90, 0.10)',
          color: '#d4a45a',
        }}
        aria-label="Previous"
      >
        <svg width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 -translate-y-1/2 z-[200] flex items-center justify-center rounded-full transition-all duration-200 group"
        style={{
          right: isMobile ? 4 : 8,
          width: isMobile ? 36 : 46,
          height: isMobile ? 36 : 46,
          background: 'linear-gradient(145deg, rgba(61, 40, 32, 0.85) 0%, rgba(42, 30, 22, 0.95) 100%)',
          border: '1px solid rgba(212, 164, 90, 0.20)',
          borderTopColor: 'rgba(212, 164, 90, 0.30)',
          boxShadow: '2px 3px 10px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(212, 164, 90, 0.10)',
          color: '#d4a45a',
        }}
        aria-label="Next"
      >
        <svg width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  );
}