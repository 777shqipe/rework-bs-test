'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShinyButton } from './ui/shiny-button';

/* ===========================================================
   MODERN TYPEWRITER — animated placeholder for modern form
=========================================================== */
function ModernTypewriter({ servizio }) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const suggestions = {
    'Siti Web': [
      'Ho un\'attività e mi serve un sito vetrina...',
      'Vorrei un e-commerce per vendere online...',
      'Mi serve una landing page per un servizio...',
    ],
    'Marketing': [
      'Vorrei più clienti con la pubblicità online...',
      'Ho bisogno di una strategia social efficace...',
      'Voglio promuovere un\'offerta specifica...',
    ],
    'Foto & Video': [
      'Mi servono foto professionali per il sito...',
      'Vorrei un video per presentare l\'azienda...',
      'Devo fotografare prodotti per il catalogo...',
    ],
    'Grafica & Brand': [
      'Non ho un logo e vorrei partire da zero...',
      'Il mio marchio è vecchio, vorrei rinnovarlo...',
      'Mi serve un\'identità visiva completa...',
    ],
    'Software su Misura': [
      'Gestisco tutto con fogli di calcolo...',
      'Mi serve un gestionale su misura...',
      'Ho bisogno di un\'app web per prenotazioni...',
    ],
    'Case Famiglia': [
      'Gestisco una struttura e mi serve booking...',
      'Vorrei un sito con prenotazioni online...',
      'Mi serve digitalizzare la gestione...',
    ],
    'Altro': [
      'Ho bisogno di più servizi insieme...',
      'Non so cosa mi serva, vorrei un confronto...',
      'Vorrei un pacchetto completo...',
    ],
  };

  const getPlaceholders = () => {
    return suggestions[servizio] || ['Dicci brevemente cosa ti serve...'];
  };

  React.useEffect(() => {
    const placeholders = getPlaceholders();
    const currentText = placeholders[currentIdx];

    if (isTyping && idx < currentText.length) {
      const timer = setTimeout(() => {
        setText(currentText.slice(0, idx + 1));
        setIdx(prev => prev + 1);
      }, 55);
      return () => clearTimeout(timer);
    }

    if (isTyping && idx >= currentText.length) {
      setIsTyping(false);
      const timer = setTimeout(() => {
        setIdx(prev => prev - 1);
      }, 3200);
      return () => clearTimeout(timer);
    }

    if (!isTyping && idx > 0) {
      const timer = setTimeout(() => {
        setText(currentText.slice(0, idx - 1));
        setIdx(prev => prev - 1);
      }, 32);
      return () => clearTimeout(timer);
    }

    if (!isTyping && idx === 0) {
      setCurrentIdx(prev => (prev + 1) % placeholders.length);
      setIsTyping(true);
    }
  }, [idx, servizio, currentIdx, isTyping]);

  React.useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 p-4 pointer-events-none flex items-start"
      style={{ color: '#a69f93' }}>
      <span className="font-medium text-sm">{text}</span>
      {showCursor && <span className="inline-block w-0.5 h-5 bg-[#a69f93] ml-0.5 animate-pulse" />}
    </div>
  );
}

/* ===========================================================
   PROJECT CARD — Animated card with FLIP layout transitions
=========================================================== */
function ProjectCard({ project, index, isCompact, onClick, direction, enableMorph }) {
  return (
    <motion.div
      layout={enableMorph}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, x: direction > 0 ? -14 : 14 }}
      transition={{
        duration: enableMorph ? 0.22 : 0.2,
        delay: Math.min(index * (enableMorph ? 0.008 : 0.004), enableMorph ? 0.06 : 0.04),
        ease: [0.22, 1, 0.36, 1],
        layout: enableMorph ? {
          type: 'spring',
          stiffness: 520,
          damping: 44,
          mass: 0.6,
        } : undefined,
      }}
      onClick={onClick}
      className={`cursor-pointer group overflow-hidden relative clay-card-dark ${
        isCompact
          ? 'p-3 sm:p-4 flex flex-col justify-between min-h-[104px]'
          : 'p-5 sm:p-6 min-h-[196px]'
      } transform-gpu will-change-transform`}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div className="absolute top-0 left-6 right-6 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196, 180, 148, 0.2) 50%, transparent 100%)' }} />
      <div className={`absolute opacity-[0.05] font-black tracking-tighter text-[#d4cabb] select-none ${isCompact ? 'top-0 right-0 p-2 sm:p-3 text-2xl sm:text-4xl' : 'top-1 right-1 sm:top-0 sm:right-0 p-2 sm:p-3 text-4xl sm:text-4xl'}`}>{project.year}</div>

      <div className={isCompact ? '' : 'flex justify-between items-start mb-3'}>
        <h4 className={`font-black leading-tight text-[#ede8de] group-hover:text-[#f5f2ec] ${isCompact ? 'text-sm pr-8' : 'text-base sm:text-lg max-w-[80%]'}`}>
          {project.n}
        </h4>
        {!isCompact && <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm clay-pill-dark text-[#b8ad98] group-hover:rotate-45 transition-transform">↗</div>}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {!isCompact ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: '#9a9484' }}>{project.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map(t => (
                <span key={t} className="px-2 py-1 text-[10px] font-black uppercase tracking-wider clay-pill-dark text-[#8a7f6a]">{t}</span>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="compact"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-auto pt-2 flex justify-between items-end"
          >
            <span className="text-xs text-[#7a7568] font-bold">{project.year}</span>
            <div className="w-6 h-6 flex items-center justify-center rounded-full text-xs clay-pill-dark text-[#b8ad98] group-hover:rotate-45 transition-transform">↗</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ===========================================================
   MODERN SITE — CLAYMORPHISM MODE (COMPLETE LANDING PAGE)
   NOTE: Only use REAL data from https://backsoftware.it
   NEVER invent information, stats, or claims not present on the official site.
=========================================================== */

export default function ModernSite({ onSwitchToTerminal }) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [categoryDirection, setCategoryDirection] = useState(1);
  const [categoryTransitionType, setCategoryTransitionType] = useState('morph');
  const [showFooter, setShowFooter] = useState(false);
  const contactSectionRef = useRef(null);
  const footerCardRef = useRef(null);
  const [footerStrokeActive, setFooterStrokeActive] = useState(false);

  // Orbiting text around header — pixel-perfect (mobile & desktop refs)
  const headerRefMobile = useRef(null);
  const headerRefDesktop = useRef(null);
  const orbitSvgRefMobile = useRef(null);
  const orbitSvgRefDesktop = useRef(null);
  const orbitRef1Mobile = useRef(null);
  const orbitRef1Desktop = useRef(null);
  const orbitRef2Mobile = useRef(null);
  const orbitRef2Desktop = useRef(null);
  const [headerPathMobile, setHeaderPathMobile] = useState('');
  const [headerPathDesktop, setHeaderPathDesktop] = useState('');
  const [orbitTextMobile, setOrbitTextMobile] = useState('');
  const [orbitTextDesktop, setOrbitTextDesktop] = useState('');
  const [pathLenMobile, setPathLenMobile] = useState(0);
  const [pathLenDesktop, setPathLenDesktop] = useState(0);
  const [isDesktopView, setIsDesktopView] = useState(false);
  const ORBIT_TOKEN = 'BACK SOFTWARE \u2022 ';
  const DESKTOP_ORBIT_FONT_SIZE = 8;
  const DESKTOP_ORBIT_LETTER_SPACING = 1.2;
  const DESKTOP_ORBIT_SPEED = 16.8;

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)');
    const syncViewport = () => setIsDesktopView(media.matches);
    syncViewport();

    if (media.addEventListener) {
      media.addEventListener('change', syncViewport);
      return () => media.removeEventListener('change', syncViewport);
    }

    media.addListener(syncViewport);
    return () => media.removeListener(syncViewport);
  }, []);

  useEffect(() => {
    const recalcMobile = () => {
      const el = headerRefMobile.current;
      const svg = orbitSvgRefMobile.current;
      if (!el || !svg) return;

      const w = el.clientWidth;
      const h = el.clientHeight;
      const r = Math.min(h / 2, 16);
      const pad = 12;
      const left = -pad;
      const right = w + pad;
      const top = -pad;
      const bottom = h + pad;
      const rr = Math.min(r + pad, h / 2 + pad);

      const startX = (left + right) / 2;
      const path = [
        `M ${startX} ${top}`,
        `H ${right - rr}`,
        `A ${rr} ${rr} 0 0 1 ${right} ${top + rr}`,
        `V ${bottom - rr}`,
        `A ${rr} ${rr} 0 0 1 ${right - rr} ${bottom}`,
        `H ${left + rr}`,
        `A ${rr} ${rr} 0 0 1 ${left} ${bottom - rr}`,
        `V ${top + rr}`,
        `A ${rr} ${rr} 0 0 1 ${left + rr} ${top}`,
        `H ${startX}`,
        'Z',
      ].join(' ');

      setHeaderPathMobile(path);

      const pathWidth = right - left;
      const pathHeight = bottom - top;
      const straight = 2 * (pathWidth + pathHeight - rr * 4);
      const curved = 2 * Math.PI * rr;
      const perimeter = straight + curved;
      setPathLenMobile(perimeter);

      const measureContext = document.createElement('canvas').getContext('2d');
      let tokenWidth = 54;
      if (measureContext) {
        measureContext.font = `700 6px sans-serif`;
        tokenWidth = measureContext.measureText(ORBIT_TOKEN).width;
      }

      const reps = Math.max(2, Math.round(perimeter / tokenWidth));
      setOrbitTextMobile(Array(reps).fill(ORBIT_TOKEN).join(''));
    };

    const recalcDesktop = () => {
      const el = headerRefDesktop.current;
      if (!el) return;

      const w = el.clientWidth;
      const h = el.clientHeight;
      const computed = window.getComputedStyle(el);
      const baseRadius = parseFloat(computed.borderTopLeftRadius) || Math.min(h / 2, 28);
      const orbitInset = 6;
      const left = -orbitInset;
      const right = w + orbitInset;
      const top = -orbitInset;
      const bottom = h + orbitInset;
      const rr = Math.max(
        0,
        Math.min(
          baseRadius + orbitInset,
          (w + orbitInset * 2) / 2,
          (h + orbitInset * 2) / 2,
        ),
      );

      const startX = (left + right) / 2;
      const path = [
        `M ${startX} ${top}`,
        `H ${right - rr}`,
        `A ${rr} ${rr} 0 0 1 ${right} ${top + rr}`,
        `V ${bottom - rr}`,
        `A ${rr} ${rr} 0 0 1 ${right - rr} ${bottom}`,
        `H ${left + rr}`,
        `A ${rr} ${rr} 0 0 1 ${left} ${bottom - rr}`,
        `V ${top + rr}`,
        `A ${rr} ${rr} 0 0 1 ${left + rr} ${top}`,
        `H ${startX}`,
        'Z',
      ].join(' ');

      setHeaderPathDesktop(path);

      const pathWidth = w + orbitInset * 2;
      const pathHeight = h + orbitInset * 2;
      const straight = 2 * (pathWidth + pathHeight - rr * 4);
      const curved = 2 * Math.PI * rr;
      const perimeter = straight + curved;
      setPathLenDesktop(perimeter);

      const measureContext = document.createElement('canvas').getContext('2d');
      let tokenWidth = 80;
      if (measureContext) {
        measureContext.font = `800 ${DESKTOP_ORBIT_FONT_SIZE}px sans-serif`;
        const baseWidth = measureContext.measureText(ORBIT_TOKEN).width;
        const trackingWidth = DESKTOP_ORBIT_LETTER_SPACING * Math.max(0, ORBIT_TOKEN.length - 1);
        tokenWidth = baseWidth + trackingWidth;
      }

      const reps = Math.max(2, Math.round(perimeter / tokenWidth));
      setOrbitTextDesktop(Array(reps).fill(ORBIT_TOKEN).join(''));
    };

    recalcMobile();
    recalcDesktop();
    
    const ro = new ResizeObserver(() => {
      recalcMobile();
      recalcDesktop();
    });
    
    if (headerRefMobile.current) ro.observe(headerRefMobile.current);
    if (headerRefDesktop.current) ro.observe(headerRefDesktop.current);
    
    return () => ro.disconnect();
  }, []);

  // Detect dark/light background under header
  const [orbitOnDark, setOrbitOnDark] = useState(false);

  useEffect(() => {
    const check = () => {
      const headerDesktop = headerRefDesktop.current;
      const headerMobile = headerRefMobile.current;
      
      const header = headerDesktop || headerMobile;
      if (!header) return;
      
      const rect = header.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const darkSections = document.querySelectorAll('[data-dark-section]');
      let inDark = false;
      darkSections.forEach((sec) => {
        const r = sec.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) inDark = true;
      });
      setOrbitOnDark(inDark);
    };
    check();
    const scroller = document.querySelector('.modern-snap-container');
    if (scroller) scroller.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      if (scroller) scroller.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  // Animate orbiting text - mobile only in mobile viewport
  useEffect(() => {
    if (isDesktopView || pathLenMobile <= 0) return;

    let mobileOffset = 0;
    let raf;
    let lastTs = performance.now();
    const MOBILE_SPEED = 14;

    const step = (ts) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      mobileOffset = (mobileOffset + MOBILE_SPEED * dt) % pathLenMobile;
      if (orbitRef1Mobile.current) orbitRef1Mobile.current.setAttribute('startOffset', mobileOffset);
      if (orbitRef2Mobile.current) orbitRef2Mobile.current.setAttribute('startOffset', mobileOffset - pathLenMobile);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame((ts) => {
      lastTs = ts;
      step(ts);
    });

    return () => cancelAnimationFrame(raf);
  }, [isDesktopView, pathLenMobile]);

  // Animate orbiting text - desktop only in desktop viewport
  useEffect(() => {
    if (!isDesktopView || pathLenDesktop <= 0) return;

    let desktopOffset = 0;
    let raf;
    let lastTs = performance.now();

    const step = (ts) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      desktopOffset = (desktopOffset + DESKTOP_ORBIT_SPEED * dt) % pathLenDesktop;
      if (orbitRef1Desktop.current) orbitRef1Desktop.current.setAttribute('startOffset', desktopOffset);
      if (orbitRef2Desktop.current) orbitRef2Desktop.current.setAttribute('startOffset', desktopOffset - pathLenDesktop);

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame((ts) => {
      lastTs = ts;
      step(ts);
    });

    return () => cancelAnimationFrame(raf);
  }, [isDesktopView, pathLenDesktop]);

  // Orbit color: brownish on light, warm beige on dark
  const orbitColor = orbitOnDark ? '#d4cabb' : '#5a5244';
  const orbitColorMobile = orbitColor;

  // Footer reveal on wheel in contact section
  useEffect(() => {
    const section = contactSectionRef.current;
    if (!section) return;
    let cooldown = false;
    const onWheel = (e) => {
      // Only act if this section is actually in view (snapped)
      const rect = section.getBoundingClientRect();
      if (Math.abs(rect.top) > 50) return;
      // When footer is open, block ALL scroll events to prevent snap from firing
      if (showFooter) {
        e.preventDefault();
        e.stopPropagation();
        if (!cooldown && e.deltaY < -30) {
          setShowFooter(false);
          cooldown = true;
          setTimeout(() => { cooldown = false; }, 600);
        }
        return;
      }
      if (e.deltaY > 30 && !cooldown) {
        e.preventDefault();
        setShowFooter(true);
        cooldown = true;
        setTimeout(() => { cooldown = false; }, 600);
      }
    };
    section.addEventListener('wheel', onWheel, { passive: false });
    return () => section.removeEventListener('wheel', onWheel);
  }, [showFooter]);

  const handleFooterPointerMove = (e) => {
    const el = footerCardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    const hue = 34 + xPct * 0.14;
    const saturation = 60 + (100 - yPct) * 0.09;
    el.style.setProperty('--footer-stroke-y', `${yPct}%`);
    el.style.setProperty('--footer-stroke-x', `${xPct}%`);
    el.style.setProperty('--footer-stroke-h', `${hue.toFixed(2)}`);
    el.style.setProperty('--footer-stroke-s', `${saturation.toFixed(2)}%`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  };

  const sectionTitleClass = 'text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.96]';
  const sectionTitleReveal = {
    initial: { opacity: 0, y: 42, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { amount: 0.58, once: false },
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] }
  };
  const sectionSubtitleReveal = {
    initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { amount: 0.52, once: false },
    transition: { duration: 0.58, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
  };

  // Clean SVG icon components — unique per service
  const IconCasaFamiglia = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M12 11.5c.8-.9 2.5-.9 2.5.7 0 1.8-2.5 3.3-2.5 3.3s-2.5-1.5-2.5-3.3c0-1.6 1.7-1.6 2.5-.7z" />
    </svg>
  );
  const IconSitiLanding = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <rect x="2" y="3" width="20" height="16" rx="2" />
      <path d="M2 8h20" />
      <circle cx="5" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="10" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
      <path d="M8 22l4-3 4 3" />
    </svg>
  );
  const IconMarketing = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
  const IconFotoVideo = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <rect x="1" y="5" width="15" height="14" rx="2" />
      <path d="M16 9.5l5-3v11l-5-3z" />
    </svg>
  );
  const IconGraficaCopy = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
  const IconDigitali = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 8h20" />
      <path d="M7 12l3 3-3 3" />
      <path d="M13 17h4" />
    </svg>
  );

  const handleCloseService = () => {
    const source = selectedService?.source;
    setSelectedService(null);
    setTimeout(() => {
      const targetId = source === 'progetti' ? 'progetti' : 'servizi';
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const services = useMemo(() => [
    {
      icon: <IconCasaFamiglia />,
      title: 'Case Famiglia',
      desc: 'Pacchetti completi per strutture che ospitano famiglie in difficoltà.',
      details: 'Servizio dedicato alle strutture che ospitano famiglie in difficoltà. Gestiamo tutto: sito web, social media, campagne pubblicitarie mirate e sistema di prenotazioni.',
      packages: [
        { name: '6 Mesi', desc: 'Soluzione completa per 6 mesi: sito, social, campagne e prenotazioni' },
        { name: '3 Mesi', desc: 'Soluzione completa per 3 mesi: sito, social, campagne e prenotazioni' },
        { name: 'Campagna Spot', desc: 'Campagna spot per 6 mesi con gestione completa' }
      ],
      span: 'md:col-span-2',
      source: 'servizi'
    },
    {
      icon: <IconSitiLanding />,
      title: 'Siti e Landing',
      source: 'servizi',
      desc: 'Siti web professionali e landing page ottimizzate per conversioni.',
      details: 'Siti web professionali e landing page ottimizzate per le conversioni. Dal sito aziendale completo alla landing page mirata, tutto responsive e pronto per Google.',
      packages: [
        { name: 'Sito 5-10 Pagine', desc: 'Sito web completo con 5-10 pagine, responsive e ottimizzato' },
        { name: 'Landing Page', desc: 'Landing page ottimizzata per conversioni e lead generation' }
      ],
      span: '',
      source: 'servizi'
    },
    {
      icon: <IconMarketing />,
      title: 'Marketing & ADS',
      source: 'servizi',
      desc: 'Analisi, Meta Ads e Google Ads. Strategie che portano risultati.',
      details: 'Strategie di marketing digitale e campagne pubblicitarie mirate. Analisi, pianificazione e gestione completa delle tue campagne su Meta e Google.',
      packages: [
        { name: 'Analisi Marketing', desc: 'Analisi completa per campagne pubblicitarie efficaci' },
        { name: 'Meta Ads', desc: 'Campagne su Meta e altri canali social' },
        { name: 'Google Ads', desc: 'Campagne pubblicitarie su Google Search e Display' }
      ],
      span: '',
      source: 'servizi'
    },
    {
      icon: <IconFotoVideo />,
      title: 'Foto & Video',
      source: 'servizi',
      desc: 'Servizi fotografici e video professionali per la tua azienda.',
      details: 'Servizi professionali di fotografia e video per la tua azienda. Shooting fotografici, riprese con drone, video corporate e contenuti per i social.',
      packages: [
        { name: 'Servizio Fotografico', desc: 'Servizi fotografici professionali per aziende e prodotti' },
        { name: 'Video Drone', desc: 'Riprese video aeree con drone professionale' },
        { name: 'Video Staff', desc: 'Riprese video con staff professionale' }
      ],
      span: '',
      source: 'servizi'
    },
    {
      icon: <IconGraficaCopy />,
      title: 'Grafica & Copy',
      source: 'servizi',
      desc: 'Design grafico e copywriting per la tua comunicazione.',
      details: 'Servizi di design grafico e copywriting per la tua comunicazione. Loghi, identità visiva, materiali grafici e testi che parlano al tuo pubblico.',
      packages: [
        { name: 'Grafica', desc: 'Servizi di design grafico, visual e brand identity' },
        { name: 'Copywriting', desc: 'Servizi di scrittura, comunicazione e testi SEO' }
      ],
      span: '',
      source: 'servizi'
    },
    {
      icon: <IconDigitali />,
      title: 'Software su Misura',
      source: 'servizi',
      desc: 'Gestionali, applicazioni e integrazioni API su misura.',
      details: 'Soluzioni digitali avanzate per la gestione aziendale. Software su misura, gestionali, applicazioni web/mobile e integrazioni API.',
      packages: [
        { name: 'Gestionali', desc: 'Sistemi gestionali personalizzati per la tua azienda' },
        { name: 'Applicazioni', desc: 'Applicazioni web e mobile su misura' },
        { name: 'Collegamento API', desc: 'Integrazioni e collegamenti API con altri servizi' }
      ],
      span: 'md:col-span-2',
      source: 'servizi'
    },
  ], []);

  const projects = [
    {
      n: 'Sistema Gestione Cantina',
      category: 'Gestionale',
      tags: ['Gestionale', 'PWA', 'E-commerce'],
      year: '2025',
      desc: 'Sistema di gestione vitivinicolo completo per cantina con vendita online di esperienze, gestione coupon regali e spedizioni internazionali.'
    },
    {
      n: 'CRM Magazzino',
      category: 'Gestionale',
      tags: ['Gestionale', 'Logistica'],
      year: '2024',
      desc: 'Sistema gestionale su misura per gestione magazzino, stoccaggio e spedizioni con ottimizzazione logistica avanzata.'
    },
    {
      n: 'BPres Presenze',
      category: 'Gestionale',
      tags: ['Gestionale', 'HR'],
      year: '2024',
      desc: 'Sistema presenze completo per gestire ingressi, uscite, pause. Calcolo permessi automatici e richiesta ferie/malattia con approvazione via email.'
    },
    {
      n: 'Sistema Autodemolizioni',
      category: 'CRM',
      tags: ['CRM', 'API', 'Compliance'],
      year: '2024',
      desc: 'CRM completo per pratiche bonifica, registrazione portali statali, API Rentri, vendita componenti, gestione serbatoi e controllo codici CER.'
    },
    {
      n: '7Lakes Aparthotel',
      category: 'Sito Web',
      tags: ['Sito Web', 'Booking', 'Drone'],
      year: '2024',
      desc: 'Sito web con shooting drone per tour virtuale, collegamento Octorate per booking engine centralizzato con Booking.com e Airbnb.'
    },
    {
      n: 'Salute a Domicilio',
      category: 'Sito Web',
      tags: ['Sito Web', 'Marketing', 'ADS'],
      year: '2024',
      desc: 'Sito web, analisi marketing intelligence, landing page pubblicitarie e campagne Google Search + retargeting social.'
    },
    {
      n: 'CRM Task e Progetti',
      category: 'Gestionale',
      tags: ['Gestionale', 'AI', 'Project'],
      year: '2024',
      desc: 'Sistema gestionale per progetti, task e andamento lavorazioni. Gestione clienti e collaboratori con integrazione AI tramite API.'
    },
    {
      n: 'My Place Malpensa',
      category: 'Sito Web',
      tags: ['Sito Web', 'Booking', 'Multilingua'],
      year: '2024',
      desc: 'Sito web multilingua con collegamento a Octorate per booking engine centralizzato e gestione prenotazioni automatizzata.'
    },
    {
      n: 'Marazzato Moto',
      category: 'Sito Web',
      tags: ['Sito Web', 'Vetrina', 'E-commerce'],
      year: '2024',
      desc: 'Sito web vetrina con caricamento dinamico prodotti da pannello dedicato e vetrina online per vendita moto e accessori.'
    },
    {
      n: 'Casa Famiglia Villa Katia',
      category: 'Marketing',
      tags: ['Marketing', 'Meta Ads', 'Landing'],
      year: '2024',
      desc: 'Soluzione completa: sito web, landing page e sponsorizzazioni Meta Ads con focus su Facebook e target di riferimento specifico.'
    },
    {
      n: 'Casa Famiglia Quercia',
      category: 'Marketing',
      tags: ['Marketing', 'Meta Ads', 'Social'],
      year: '2024',
      desc: 'Sito web, landing page e campagne sponsorizzate Meta Ads per casa famiglia con strategia marketing mirata.'
    },
    {
      n: 'Casa Famiglia Gramsci',
      category: 'Marketing',
      tags: ['Marketing', 'Social', 'Landing'],
      year: '2024',
      desc: 'Progetto completo con sito web istituzionale, landing page dedicate e campagne pubblicitarie social mirate.'
    },
    {
      n: 'Casa Famiglia Benissimo',
      category: 'Marketing',
      tags: ['Marketing', 'Facebook Ads', 'Web'],
      year: '2024',
      desc: 'Sviluppo sito web, landing page ottimizzate e strategia marketing digitale con campagne Facebook Ads mirate.'
    },
    {
      n: 'Casa Alloggio Sociale Anziani',
      category: 'Marketing',
      tags: ['Marketing', 'Web', 'Social'],
      year: '2024',
      desc: 'Casa alloggio sociale per anziani ad Abbiategrasso: sito web istituzionale, landing page e campagne marketing dedicate.'
    },
  ];

  // Group projects by category for modern view
  const modernCategories = ['Gestionale', 'Sito Web', 'Marketing', 'CRM'];
  const allProjectCategories = ['Tutti', ...modernCategories];
  const groupedModernProjects = modernCategories.map(cat => ({
    name: cat,
    projects: projects.filter(p => p.category === cat)
  })).filter(g => g.projects.length > 0);

  const handleCategoryChange = (cat) => {
    if (cat === selectedCategory) return;
    const prevIndex = allProjectCategories.indexOf(selectedCategory);
    const nextIndex = allProjectCategories.indexOf(cat);
    const prevIsCompact = selectedCategory === 'Tutti';
    const nextIsCompact = cat === 'Tutti';

    setCategoryTransitionType(prevIsCompact !== nextIsCompact ? 'morph' : 'swap');
    setCategoryDirection(nextIndex >= prevIndex ? 1 : -1);
    setSelectedCategory(cat);
  };

  const isCompactCategory = selectedCategory === 'Tutti';
  const visibleProjects = useMemo(() => {
    if (isCompactCategory) return groupedModernProjects.flatMap(g => g.projects);
    return groupedModernProjects.find(g => g.name === selectedCategory)?.projects || [];
  }, [groupedModernProjects, isCompactCategory, selectedCategory]);

  const galleryGridVariants = {
    initial: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -30 : 30,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    }),
  };

  const footerServiceLinks = [
    { label: 'Siti Web', href: '#servizi' },
    { label: 'Marketing', href: '#servizi' },
    { label: 'Grafica', href: '#servizi' },
    { label: 'Video', href: '#servizi' },
  ];

  const footerCompanyLinks = [
    { label: 'Come lavoriamo', href: '#come-lavoriamo' },
    { label: 'Contatti', href: '#contatti' },
    { label: 'Servizi e Prezzi', href: '#servizi' },
  ];

  // Contact form state
  const initialFormData = {
    nome: '',
    azienda: '',
    email: '',
    prefissoTelefono: '+39',
    telefono: '',
    servizio: '',
    descrizione: ''
  };

  const [formData, setFormData] = useState({
    ...initialFormData
  });
  const [formStep, setFormStep] = useState(1);
  const [formDirection, setFormDirection] = useState(1);
  const stackLayers = [1, 2, 3];

  const serviziOptions = ['Siti Web', 'Marketing', 'Foto & Video', 'Grafica & Brand', 'Software su Misura', 'Case Famiglia', 'Altro'];

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const goToNextStep = () => {
    setFormDirection(1);
    setFormStep(prev => Math.min(4, prev + 1));
  };

  const goToPrevStep = () => {
    setFormDirection(-1);
    setFormStep(prev => Math.max(1, prev - 1));
  };

  const normalizedEmail = formData.email.trim();
  const normalizedPrefix = formData.prefissoTelefono.trim();
  const normalizedPhone = formData.telefono.replace(/\s+/g, '');
  const fullPhoneNumber = `${normalizedPrefix} ${normalizedPhone}`.trim();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(normalizedEmail);
  const isPhonePrefixValid = /^\+\d{1,4}$/.test(normalizedPrefix);
  const isPhoneValid = /^\d{6,14}$/.test(normalizedPhone);

  const isStep1Valid = Boolean(formData.nome.trim()) && isEmailValid && isPhonePrefixValid && isPhoneValid;
  const isStep2Valid = Boolean(formData.servizio);
  const isStep3Valid = Boolean(formData.descrizione.trim());

  const stepPanelVariants = {
    enter: (direction) => ({
      opacity: 0,
      y: 14,
      x: direction > 0 ? 32 : -32,
      scale: 0.985,
      filter: 'blur(3px)',
    }),
    center: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.36,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (direction) => ({
      opacity: 0,
      y: -10,
      x: direction > 0 ? -24 : 24,
      scale: 0.99,
      filter: 'blur(3px)',
      transition: {
        duration: 0.22,
        ease: [0.4, 0, 1, 1],
      },
    }),
  };

  const buildContactMessage = () => {
    const lines = [
      'Nuova richiesta commerciale',
      '',
      'DATI CONTATTO',
      `Nome: ${formData.nome.trim()}`,
      `Attivita/Azienda: ${formData.azienda.trim() || 'Non specificata'}`,
      `Email: ${normalizedEmail}`,
      `Cellulare: ${fullPhoneNumber}`,
      '',
      'RICHIESTA',
      `Servizio: ${formData.servizio}`,
      '',
      'DESCRIZIONE',
      formData.descrizione.trim(),
    ];

    return lines.join('\n');
  };

  const generateWhatsAppMessage = () => {
    return encodeURIComponent(buildContactMessage());
  };

  const sendViaWhatsApp = () => {
    window.open(`https://wa.me/393513052627?text=${generateWhatsAppMessage()}`, '_blank', 'noopener,noreferrer');
  };

  const sendViaEmail = () => {
    const subject = encodeURIComponent(`Richiesta preventivo - ${formData.servizio} - ${formData.nome.trim()}`);
    const body = encodeURIComponent(buildContactMessage());
    window.open(`mailto:info@backsoftware.it?subject=${subject}&body=${body}`, '_blank', 'noopener,noreferrer');
  };

  // Service detail modal
  if (selectedService) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="pt-4 sm:pt-6 lg:pt-10 pb-6 sm:pb-10 lg:pb-20 px-6 sm:px-10 lg:px-20 h-full flex flex-col font-sans modern-mode relative overflow-y-auto overflow-x-hidden"
        style={{ background: '#f5f2ec' }}>
        <div className="absolute inset-0 crt-glitch-overlay" />
        <div className="modern-crt-flicker max-w-4xl mx-auto w-full">
          <motion.button onClick={handleCloseService}
            className="clay-btn px-6 py-3 mb-6 text-sm font-bold !rounded-xl text-[#3d3828] flex items-center gap-2"
            whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            ← Torna ai servizi
          </motion.button>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div className="clay-card p-8 sm:p-12 mb-8">
              <div className="text-5xl mb-4">{selectedService.icon}</div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#2d2818] mb-4 tracking-tight">{selectedService.title}</h2>
              <p className="text-lg leading-relaxed text-[#6a6050] font-medium">{selectedService.details}</p>
            </div>
            
            {/* Pacchetti disponibili */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#2d2818] mb-4 px-2">Scegli il pacchetto:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedService.packages?.map((pkg, idx) => (
                  <motion.div
                    key={idx}
                    className="clay-card p-6 cursor-pointer group hover:scale-[1.02] transition-transform"
                    onClick={() => { handleCloseService(); setFormData(prev => ({ ...prev, servizio: `${selectedService.title} - ${pkg.name}` })); setShowContactForm(true); }}
                    whileTap={{ scale: 0.98 }}>
                    <h4 className="text-lg font-black text-[#2d2818] mb-2 group-hover:text-[#7c6f5b] transition-colors">{pkg.name}</h4>
                    <p className="text-sm text-[#6a6050] leading-relaxed">{pkg.desc}</p>
                    <div className="mt-4 text-xs font-bold text-[#7c6f5b] opacity-0 group-hover:opacity-100 transition-opacity">
                      Richiedi preventivo →
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 px-2">
              <button onClick={() => { handleCloseService(); setShowContactForm(true); setFormData(prev => ({ ...prev, servizio: selectedService.title })); }}
                className="clay-btn px-6 py-3 text-base font-bold !rounded-2xl text-[#3d3828] bg-[#fdfcf9] hover:scale-105 transition-transform">
                Richiedi info generale →
              </button>
              <button onClick={handleCloseService}
                className="clay-btn px-6 py-3 text-base font-bold !rounded-2xl text-[#6a6050]">
                Altri servizi
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Contact form view
  if (showContactForm) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="p-6 sm:p-10 lg:p-20 h-full flex flex-col font-sans modern-mode relative overflow-y-auto overflow-x-hidden"
        style={{ background: '#f5f2ec' }}>
        <div className="absolute inset-0 crt-glitch-overlay" />
        <div className="modern-crt-flicker max-w-3xl mx-auto w-full">
          <motion.button onClick={() => { setShowContactForm(false); setFormStep(1); setFormDirection(1); setFormData({ ...initialFormData }); }}
            className="clay-btn px-6 py-3 mb-8 text-sm font-bold !rounded-xl text-[#3d3828] flex items-center gap-2"
            whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            ← Torna alla home
          </motion.button>

          <div className="relative pb-12 sm:pb-14 [perspective:1400px]">
            <motion.div
              aria-hidden="true"
              initial={false}
              animate={{
                opacity: 0.14 + (formStep * 0.05),
                scale: 1 + (formStep * 0.02),
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute -top-12 left-1/2 h-24 w-[68%] -translate-x-1/2 rounded-full"
              style={{ background: 'radial-gradient(ellipse at center, rgba(124,111,91,0.22) 0%, rgba(124,111,91,0) 72%)' }}
            />

            {stackLayers.map((layer) => {
              const revealStrength = Math.min(1, Math.max(0, formStep - layer));
              const directionTilt = formDirection > 0 ? 1 : -1;

              return (
                <motion.div
                  key={`form-stack-layer-${layer}`}
                  initial={false}
                  animate={{
                    opacity: 0.08 + revealStrength * (0.24 - (layer * 0.04)),
                    y: (layer * 8) + (revealStrength * (12 + layer)),
                    x: revealStrength * directionTilt * (layer + 1),
                    scale: 1 - (layer * 0.018) - (revealStrength * 0.006),
                    rotateX: revealStrength * 1.4,
                    rotateZ: revealStrength * directionTilt * (0.55 + (layer * 0.12)),
                    borderColor: revealStrength > 0 ? '#d8d0c2' : '#e7e0d5',
                  }}
                  transition={{ type: 'spring', stiffness: 250, damping: 26, mass: 0.75 }}
                  className="pointer-events-none absolute inset-0 rounded-[2.1rem] border-2"
                  style={{
                    zIndex: 12 - layer,
                    background: 'linear-gradient(148deg, rgba(253,252,249,0.97) 0%, rgba(247,242,234,0.92) 100%)',
                    boxShadow: '0 16px 28px rgba(61, 56, 40, 0.10)',
                  }}
                />
              );
            })}

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                rotateZ: formDirection > 0 ? 0.12 : -0.12,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative z-20 clay-card p-10 sm:p-14 overflow-hidden"
            >
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  opacity: 0.44,
                  x: formDirection > 0 ? ['-14%', '102%'] : ['102%', '-14%'],
                }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute top-0 h-full w-24 blur-xl"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 100%)' }}
              />
            <h2 className="text-3xl sm:text-4xl font-black text-[#2d2818] mb-1 tracking-tight">Scrivici</h2>
            <p className="text-[#6a6050] mb-8 text-sm">Ti rispondiamo entro 24 ore.</p>

            {/* Progress */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-1.5 flex-1 rounded-full bg-[#e4dfd4] overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: i <= formStep ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full origin-left rounded-full bg-[#7c6f5b]"
                  />
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait" custom={formDirection}>
            {/* Step 1: Dati */}
            {formStep === 1 && (
              <motion.div
                key="contact-step-1"
                custom={formDirection}
                variants={stepPanelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4">
                <h3 className="text-xl font-black text-[#2d2818]">I tuoi dati</h3>
                <input type="text" placeholder="Nome" value={formData.nome} onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]" />
                <input type="text" placeholder="Nome attivita/azienda (facoltativo)" value={formData.azienda} onChange={(e) => handleInputChange('azienda', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]" />
                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]" />

                {!isEmailValid && formData.email.length > 0 && (
                  <p className="text-xs font-semibold text-[#b94242]">Inserisci un indirizzo email valido (es. nome@azienda.it).</p>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="+39"
                    value={formData.prefissoTelefono}
                    onChange={(e) => handleInputChange('prefissoTelefono', e.target.value)}
                    className="p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]"
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="Cellulare"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value.replace(/[^\d\s]/g, ''))}
                    className="col-span-2 p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]"
                  />
                </div>

                {!isPhonePrefixValid && formData.prefissoTelefono.length > 0 && (
                  <p className="text-xs font-semibold text-[#b94242]">Prefisso non valido. Usa il formato internazionale, ad esempio +39.</p>
                )}
                {!isPhoneValid && formData.telefono.length > 0 && (
                  <p className="text-xs font-semibold text-[#b94242]">Numero non valido. Inserisci da 6 a 14 cifre.</p>
                )}
                <p className="text-xs text-[#8a856f]">Prefisso paese e cellulare sono richiesti.</p>
              </motion.div>
            )}

            {/* Step 2: Servizio */}
            {formStep === 2 && (
              <motion.div
                key="contact-step-2"
                custom={formDirection}
                variants={stepPanelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4">
                <h3 className="text-xl font-black text-[#2d2818]">Cosa ti serve?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {serviziOptions.map(s => (
                    <button key={s} onClick={() => handleInputChange('servizio', s)}
                      className={`p-4 rounded-2xl border-2 text-left text-sm font-bold transition-all ${formData.servizio === s ? 'bg-[#7c6f5b] text-[#f5f2ec] border-[#7c6f5b]' : 'bg-[#fdfcf9] border-[#d4cfc5] hover:border-[#7c6f5b] text-[#2d2818]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Descrizione */}
            {formStep === 3 && (
              <motion.div
                key="contact-step-3"
                custom={formDirection}
                variants={stepPanelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4">
                <h3 className="text-xl font-black text-[#2d2818]">Raccontaci</h3>
                <div className="relative">
                  <textarea
                    value={formData.descrizione}
                    onChange={(e) => handleInputChange('descrizione', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors min-h-[120px] resize-none text-[#2d2818]" />
                  {!formData.descrizione && (
                    <ModernTypewriter servizio={formData.servizio} />
                  )}
                </div>
              </motion.div>
            )}

            {/* Review */}
            {formStep === 4 && (
              <motion.div
                key="contact-step-4"
                custom={formDirection}
                variants={stepPanelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5">
                <h3 className="text-xl font-black text-[#2d2818]">Conferma e invia richiesta</h3>
                <p className="text-sm text-[#6a6050]">Ultimo passaggio: scegli il canale di invio. Precompiliamo il messaggio in modo ordinato e professionale.</p>

                <div className="p-5 sm:p-6 rounded-3xl bg-[linear-gradient(145deg,#fffdf9_0%,#f8f4ec_100%)] border-2 border-[#d4cfc5] space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-[#2d2818]">Scheda contatto</p>
                    <span className="text-[11px] font-black tracking-wide px-3 py-1 rounded-full bg-[#e9e3d7] text-[#5a5041]">PRONTA ALL'INVIO</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <p className="rounded-xl bg-[#fdfcf9] px-3 py-2 border border-[#e8e2d6]"><span className="font-bold text-[#8a856f]">Nome:</span> {formData.nome}</p>
                    <p className="rounded-xl bg-[#fdfcf9] px-3 py-2 border border-[#e8e2d6]"><span className="font-bold text-[#8a856f]">Azienda:</span> {formData.azienda || 'Non specificata'}</p>
                    <p className="rounded-xl bg-[#fdfcf9] px-3 py-2 border border-[#e8e2d6]"><span className="font-bold text-[#8a856f]">Email:</span> {normalizedEmail}</p>
                    <p className="rounded-xl bg-[#fdfcf9] px-3 py-2 border border-[#e8e2d6]"><span className="font-bold text-[#8a856f]">Cellulare:</span> {fullPhoneNumber}</p>
                  </div>
                  <p className="rounded-xl bg-[#fdfcf9] px-3 py-2 border border-[#e8e2d6]"><span className="font-bold text-[#8a856f]">Servizio:</span> {formData.servizio}</p>
                  <div className="rounded-xl bg-[#fdfcf9] px-3 py-3 border border-[#e8e2d6]">
                    <p className="font-bold text-[#8a856f] mb-1">Descrizione:</p>
                    <p className="text-[#6a6050] whitespace-pre-wrap">{formData.descrizione}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <button onClick={sendViaWhatsApp}
                    className="w-full p-4 rounded-2xl text-white font-bold bg-[linear-gradient(135deg,#1fbf62_0%,#128c7e_100%)] shadow-[0_10px_24px_rgba(18,140,126,0.25)] hover:translate-y-[-1px] hover:shadow-[0_14px_28px_rgba(18,140,126,0.35)] transition-all">
                    Invia su WhatsApp
                  </button>
                  <button onClick={sendViaEmail}
                    className="w-full p-4 rounded-2xl text-white font-bold bg-[linear-gradient(135deg,#4a4234_0%,#2f2a1d_100%)] shadow-[0_10px_24px_rgba(47,42,29,0.25)] hover:translate-y-[-1px] hover:shadow-[0_14px_28px_rgba(47,42,29,0.35)] transition-all">
                    Invia via Email
                  </button>
                </div>
              </motion.div>
            )}
            </AnimatePresence>

            {/* Navigation */}
            {formStep >= 1 && formStep <= 3 && (
              <div className="flex gap-4 mt-8 pt-6 border-t border-[#e4dfd4]">
                <button onClick={goToPrevStep}
                  className="clay-btn px-6 py-4 font-bold text-[#6a6050]">
                  ← Indietro
                </button>
                <button onClick={goToNextStep}
                  disabled={(formStep === 1 && !isStep1Valid) || (formStep === 2 && !isStep2Valid) || (formStep === 3 && !isStep3Valid)}
                  className="flex-1 clay-btn px-6 py-4 font-bold !rounded-2xl text-[#3d3828] bg-[#fdfcf9] disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform">
                  {formStep === 3 ? 'Conferma invio →' : 'Avanti →'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
      className="h-[100dvh] w-full overflow-x-hidden overflow-y-auto font-sans modern-mode modern-snap-container selection:bg-[#7c6f5b]/20 relative"
      style={{ background: 'linear-gradient(180deg, #f5f2ec 0%, #f2eee7 100%)' }}>
      {/* CRT Glitch Effect */}
      <div className="absolute inset-0 crt-glitch-overlay pointer-events-none" />
      
      {/* ── HEADER ── */}
      <motion.nav variants={itemVariants}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ pointerEvents: 'none' }}
      >
        {/* Mobile Header - Compact WITH animation */}
        <div className="sm:hidden mx-auto mt-8 w-[calc(100%-2.5rem)] max-w-md">
          <div 
            ref={headerRefMobile}
            className="flex items-center justify-between gap-2 py-1 px-2.5 rounded-[1.5rem] pointer-events-auto relative overflow-visible"
            style={{
              background: 'linear-gradient(145deg, rgba(248, 245, 239, 0.95) 0%, rgba(242, 237, 228, 0.92) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 2px 12px rgba(60, 48, 34, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}
          >
            {/* Orbiting text border - Mobile (small) */}
            <svg
              ref={orbitSvgRefMobile}
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              style={{ zIndex: 0 }}
              aria-hidden="true"
            >
              {headerPathMobile && (
                <>
                  <defs>
                    <path id="header-orbit-path-mobile" d={headerPathMobile} fill="none" />
                  </defs>
                  {orbitTextMobile && (
                    <>
                      <text
                        fill={orbitColorMobile}
                        style={{ fontSize: '6px', fontWeight: 700, letterSpacing: '0', opacity: 0.58, transition: 'fill 0.4s ease', textRendering: 'geometricPrecision' }}
                      >
                        <textPath ref={orbitRef1Mobile} href="#header-orbit-path-mobile" startOffset="0" textLength={pathLenMobile} lengthAdjust="spacing">
                          {orbitTextMobile}
                        </textPath>
                        <textPath ref={orbitRef2Mobile} href="#header-orbit-path-mobile" startOffset="0" textLength={pathLenMobile} lengthAdjust="spacing">
                          {orbitTextMobile}
                        </textPath>
                      </text>
                    </>
                  )}
                </>
              )}
            </svg>

            {/* Logo Mobile */}
            <div className="flex items-center min-w-0 relative z-10">
              <span className="text-[13px] font-black tracking-tight text-[#2f2a1d] leading-none truncate">Back Software</span>
            </div>

            {/* Actions Mobile */}
            <div className="flex items-center gap-1.5 shrink-0 relative z-10">
              <button 
                onClick={onSwitchToTerminal}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#746a57] bg-[#f8f4ec] border border-[#dbd3c6]/70 active:scale-95 transition-transform"
              >
                <span className="text-[10px]">🎮</span>
              </button>
              <ShinyButton
                href="#contatti"
                tone="espresso"
                size="sm"
                intensity="strong"
                className="font-bold !text-[10px] !px-2 !py-1"
              >
                Scrivici
              </ShinyButton>
            </div>
          </div>
        </div>

        {/* Desktop Header - With animation */}
        <div 
          ref={headerRefDesktop}
          className="hidden sm:flex max-w-6xl mx-auto mt-5 items-center justify-between gap-3 py-2.5 px-4 lg:px-5 rounded-2xl lg:rounded-[1.75rem] pointer-events-auto relative"
          style={{
            background: 'linear-gradient(145deg, rgba(248, 245, 239, 0.58) 0%, rgba(242, 237, 228, 0.46) 100%)',
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.28)',
            boxShadow: `
              0 4px 16px rgba(60, 48, 34, 0.1),
              0 1px 4px rgba(60, 48, 34, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.58)
            `
          }}
        >
          {/* Orbiting text border - Desktop */}
          <svg
            ref={orbitSvgRefDesktop}
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            style={{ zIndex: 0 }}
            aria-hidden="true"
          >
            {headerPathDesktop && (
              <>
                <defs>
                  <path id="header-orbit-path-desktop" d={headerPathDesktop} fill="none" />
                </defs>
                {orbitTextDesktop && (
                  <>
                    <text
                      fill={orbitColor}
                      style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '1.2px', opacity: 0.62, transition: 'fill 0.4s ease', textRendering: 'geometricPrecision' }}
                    >
                      <textPath ref={orbitRef1Desktop} href="#header-orbit-path-desktop" startOffset="0" textLength={pathLenDesktop} lengthAdjust="spacing">
                        {orbitTextDesktop}
                      </textPath>
                    </text>
                    <text
                      fill={orbitColor}
                      style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '1.2px', opacity: 0.62, transition: 'fill 0.4s ease', textRendering: 'geometricPrecision' }}
                    >
                      <textPath ref={orbitRef2Desktop} href="#header-orbit-path-desktop" startOffset="0" textLength={pathLenDesktop} lengthAdjust="spacing">
                        {orbitTextDesktop}
                      </textPath>
                    </text>
                  </>
                )}
              </>
            )}
          </svg>

          {/* Logo Desktop */}
          <div className="flex items-center gap-3 min-w-0 relative z-10">
            <div className="min-w-0">
              <span className="text-[16px] lg:text-[20px] font-black tracking-tight text-[#2f2a1d] leading-none truncate">Back Software</span>
              <p className="text-[9px] lg:text-[11px] font-bold text-[#807865] opacity-80 tracking-[0.14em] uppercase truncate">Studio digitale su misura</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <div className="hidden md:flex items-center gap-1 rounded-full bg-[#f8f4ec] p-1 border border-[#d8d0c1]">
              {[
                { label: 'Servizi', href: '#servizi' },
                { label: 'Progetti', href: '#progetti' },
                { label: 'Contatti', href: '#contatti' }
              ].map((item) => (
                <a 
                  key={item.label}
                  href={item.href}
                  className="px-2 lg:px-4 py-1.5 text-xs lg:text-sm font-bold text-[#665d4c] hover:text-[#2f2a1d] rounded-full hover:bg-[#ebe3d7] transition-all"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <button 
              onClick={onSwitchToTerminal}
              className="px-2 py-1 text-[11px] lg:text-xs font-bold rounded-full text-[#746a57] hover:text-[#3d3528] bg-[#f8f4ec] border border-[#dbd3c6] hover:bg-[#f1e9dc] transition-all min-w-[40px] min-h-[32px] flex items-center justify-center active:scale-95"
            >
              <span>🎮 Giochi Arcade</span>
            </button>
            
            <ShinyButton
              href="#contatti"
              tone="espresso"
              size="md"
              intensity="strong"
              className="font-bold !text-sm !px-5 !py-3"
            >
              Scrivici
            </ShinyButton>
          </div>
        </div>
      </motion.nav>


      {/* ── HERO ── */}
      <motion.section variants={itemVariants} className="modern-snap-section flex items-center justify-center relative px-6 sm:px-6 lg:px-8">
        {/* Floating Accents - Hidden on mobile */}
        <div className="hidden sm:block absolute -top-10 left-10 w-24 h-24 clay-pill opacity-10 animate-float pointer-events-none" />
        <div className="hidden sm:block absolute top-40 right-10 w-32 h-32 clay-pill opacity-10 animate-float-delayed pointer-events-none" />

        <div className="max-w-5xl mx-auto w-full">
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-[3rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.12] sm:leading-[1.05] mb-8 sm:mb-8 tracking-tight text-[#2d2818]">
            <span className="block mb-2">Software che</span>
            <span className="block mb-2">funziona.</span>
            <span className="text-[#8a7f6a] drop-shadow-sm block">Fatto da <span className="transition-all duration-500 ease-out hover:text-[#c4b494] hover:drop-shadow-[0_0_30px_rgba(196,180,148,0.8),0_0_60px_rgba(196,180,148,0.4)] cursor-default">persone reali</span>.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-base lg:text-xl xl:text-2xl leading-relaxed max-w-3xl font-medium mb-6 sm:mb-12 text-[#6a6050]">
            Tecnologia che semplifica, non complica.<br className="hidden sm:block"/> Costruiamo il tuo progetto come se fosse il nostro.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-3 sm:gap-6 items-center">
            <ShinyButton
              href="#contatti"
              tone="espresso"
              size="lg"
              intensity="strong"
              className="!w-[92vw] max-w-[420px] sm:!w-auto !rounded-2xl lg:!rounded-2xl !text-lg sm:!text-base !px-8 sm:!px-6 !py-4 sm:!py-5"
            >
              <span className="sm:hidden">Parliamone →</span>
              <span className="hidden sm:inline">Parlaci del tuo progetto →</span>
            </ShinyButton>
          </motion.div>

          <motion.a
            href="#come-lavoriamo"
            className="absolute bottom-8 sm:bottom-16 left-1/2 -translate-x-1/2 group cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-14 h-14 sm:w-14 sm:h-14">
              {/* Background circle for contrast */}
              <div className="absolute inset-0 rounded-full bg-[#f5f2ec]/80 backdrop-blur-sm border border-[#d4cfc5]/50 shadow-[0_4px_20px_rgba(138,127,106,0.15)]" />
              
              {/* Rotating thin ring */}
              <motion.svg
                className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)]"
                viewBox="0 0 48 48"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-[#b8ad98]"
                  strokeDasharray="3 3"
                />
              </motion.svg>
              {/* Arrow */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: [0.4, 0, 0.6, 1] }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#6a6050] group-hover:text-[#4a4336] transition-colors">
                  <path d="M12 6v12m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </motion.a>
        </div>
      </motion.section>

      {/* ── DARK SECTION: Why Us ── */}
      <motion.section id="come-lavoriamo" data-dark-section variants={itemVariants} className="modern-snap-section flex flex-col justify-center relative px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 pb-12 sm:py-20 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1a1810 0%, #1c1917 50%, #1a1810 100%)',
      }}>
        {/* Subtle dark texture overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }} />
        {/* Ambient warm glow - hidden on mobile */}
        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] rounded-full opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(ellipse, #b8a88a 0%, transparent 70%)' }} />
        <div className="hidden sm:block absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none" style={{ background: 'radial-gradient(circle, #c4a76c 0%, transparent 60%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <motion.div variants={itemVariants} className="mb-6 sm:mb-12 space-y-3 sm:space-y-4">
            <motion.h2 {...sectionTitleReveal} className={`${sectionTitleClass} text-[#f5f2ec]`}>
              Perché Back Software.
            </motion.h2>
            <motion.p {...sectionSubtitleReveal} className="text-sm sm:text-lg leading-relaxed max-w-2xl font-medium" style={{ color: '#a09a88' }}>
              Non siamo solo sviluppatori. Siamo partner che capiscono il tuo business.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { num: '01', title: 'Ascolto', desc: 'Prima di scrivere codice, ascoltiamo. Capire il problema è più importante della soluzione tecnica.' },
              { num: '02', title: 'Chiarezza', desc: 'Niente gergo incomprensibile. Ti spieghiamo tutto in modo semplice, senza sorprese.' },
              { num: '03', title: 'Risultati', desc: 'Non vendiamo progetti, vendiamo soluzioni che funzionano davvero nel mondo reale.' }
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants}
                className="clay-card-dark p-4 sm:p-8 relative group transition-all duration-300 sm:hover:scale-[1.02] overflow-hidden">
                {/* Top accent line — glows on hover */}
                <div className="absolute top-0 left-6 sm:left-8 right-6 sm:right-8 h-px transition-all duration-500 sm:group-hover:left-6 sm:group-hover:right-6" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196, 180, 148, 0.25) 50%, transparent 100%)' }} />
                <div className="hidden sm:block absolute top-0 left-12 right-12 h-px opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-500" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196, 180, 148, 0.4) 50%, transparent 100%)' }} />
                <div className="text-4xl sm:text-6xl font-black mb-2 sm:mb-4 tracking-tighter opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500 select-none" style={{ color: '#d4cabb', WebkitTextStroke: '1px rgba(212, 202, 187, 0.15)' }}>
                  {item.num}
                </div>
                <h4 className="text-lg sm:text-2xl font-black mb-2 sm:mb-3 tracking-tight text-[#ede8de] group-hover:text-[#f5f2ec] transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#9a9484' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── SERVIZI Section ── */}
      <motion.section id="servizi" variants={itemVariants} className="modern-snap-section flex flex-col justify-center px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 pb-12 sm:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8 space-y-2 sm:space-y-4">
            <motion.h2 {...sectionTitleReveal} className={`${sectionTitleClass} text-[#2d2818]`}>Cosa facciamo.</motion.h2>
            <motion.p {...sectionSubtitleReveal} className="text-sm sm:text-lg text-[#6a6050] font-medium">
              Soluzioni concrete per problemi reali.
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {services.map((s, i) => (
              <motion.div key={i} variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedService(s)}
                className={`clay-card py-3 sm:py-5 px-4 sm:px-6 flex items-center gap-3 sm:gap-5 cursor-pointer group min-h-[72px] sm:min-h-[108px] ${s.span}`}>
                <span className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-lg sm:text-xl clay-pill bg-[#f5f2ec] shadow-sm group-hover:scale-110 transition-transform shrink-0">{s.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-black text-[#2d2818] group-hover:text-[#7c6f5b] transition-colors leading-tight">{s.title}</h4>
                  <p className="text-[11px] sm:text-xs text-[#6a6050] opacity-80 line-clamp-2">{s.desc}</p>
                </div>
                <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm transition-transform group-hover:rotate-45 bg-[#f5f2ec] border border-[#d4cfc5] text-[#3d3828] shrink-0" aria-hidden="true">
                  ↗
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── PROGETTI Section (DARK) ── */}
      <motion.section id="progetti" data-dark-section variants={itemVariants}
        className="modern-snap-section flex min-h-0 flex-col px-4 sm:px-6 lg:px-10 pt-24 pb-16 sm:pb-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1810 0%, #1c1917 50%, #1a1810 100%)',
        }}
      >
        {/* Subtle dark texture overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }} />
        {/* Ambient warm glows */}
        <div className="absolute top-1/3 left-1/4 w-[60%] h-[50%] rounded-full opacity-[0.035] pointer-events-none" style={{ background: 'radial-gradient(ellipse, #b8a88a 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.025] pointer-events-none" style={{ background: 'radial-gradient(circle, #c4a76c 0%, transparent 60%)' }} />
        
        {/* Fixed header — stays at same height as "Cosa facciamo" */}
        <div className="relative z-10 max-w-6xl mx-auto w-full shrink-0">
          <div className="mt-3 sm:mt-4 mb-8 sm:mb-10 lg:mb-12 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 sm:gap-6">
            <motion.div variants={itemVariants} className="space-y-4 lg:max-w-2xl">
              <motion.h2 className={`${sectionTitleClass} text-[#f5f2ec]`}>Galleria Progetti.</motion.h2>
              <motion.p className="text-base sm:text-lg font-medium" style={{ color: '#a09a88' }}>
                {projects.length} Successi Reali
              </motion.p>
            </motion.div>

            {/* Category Selector - Raycast Style */}
            <div className="self-start w-full lg:w-auto lg:mt-1 px-1">
              <div className="w-full lg:w-auto lg:overflow-x-auto pb-1 -mx-1 px-1">
                <div className="flex lg:inline-flex lg:min-w-max p-1.5 rounded-[2rem] justify-between lg:justify-start w-full lg:w-auto" style={{
                  background: 'linear-gradient(145deg, rgba(43, 39, 32, 0.9) 0%, rgba(31, 29, 24, 0.95) 100%)',
                  border: '1px solid rgba(255, 248, 230, 0.08)',
                  borderTopColor: 'rgba(255, 248, 230, 0.12)',
                }}>
                  {allProjectCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`relative flex-1 lg:flex-none px-2 sm:px-6 py-2 sm:py-3 text-[11px] sm:text-base font-bold transition-all duration-200 rounded-[1.25rem] sm:rounded-[1.5rem] whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'text-[#f5f2ec]'
                          : 'text-[#8a7f6a] hover:text-[#c4bba8]'
                      }`}
                    >
                      {selectedCategory === cat && (
                        <motion.div
                          layoutId="categoryPill"
                          className="absolute inset-0 rounded-[1.5rem]"
                          style={{
                            background: 'linear-gradient(145deg, rgba(58, 52, 40, 0.8) 0%, rgba(38, 35, 28, 0.9) 100%)',
                            border: '1px solid rgba(255, 248, 230, 0.12)',
                            borderTopColor: 'rgba(255, 248, 230, 0.18)',
                            boxShadow: '4px 6px 14px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 248, 230, 0.08)'
                          }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable cards area */}
        <div className="relative z-10 max-w-6xl mx-auto w-full flex-1 min-h-0 overflow-y-auto pt-1 sm:pt-2">
          {categoryTransitionType === 'morph' ? (
            <motion.div
              layout
              transition={{ layout: { type: 'spring', stiffness: 380, damping: 42, mass: 0.7 } }}
              className={`grid gap-3 sm:gap-4 ${isCompactCategory
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5'
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
              }`}
            >
              <AnimatePresence initial={false} custom={categoryDirection}>
                {visibleProjects.map((p, i) => (
                  <ProjectCard
                    key={`slot-${i}`}
                    project={p}
                    index={i}
                    direction={categoryDirection}
                    enableMorph={true}
                    isCompact={isCompactCategory}
                    onClick={() => setSelectedService({ title: p.n, icon: '', details: p.desc, source: 'progetti' })}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait" initial={false} custom={categoryDirection}>
              <motion.div
                key={selectedCategory}
                variants={galleryGridVariants}
                custom={categoryDirection}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              >
                {visibleProjects.map((p, i) => (
                  <ProjectCard
                    key={`${selectedCategory}-${p.n}`}
                    project={p}
                    index={i}
                    direction={categoryDirection}
                    enableMorph={false}
                    isCompact={false}
                    onClick={() => setSelectedService({ title: p.n, icon: '', details: p.desc, source: 'progetti' })}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.section>

      {/* ── CONTATTI Section ── */}
      <motion.section ref={contactSectionRef} id="contatti" variants={itemVariants} className="modern-snap-section flex flex-col justify-center px-4 sm:px-6 lg:px-10 pt-24 pb-16 sm:py-20 relative" style={{ background: '#f5f2ec' }}>
        {/* Contact content — shifts up when footer appears */}
        <motion.div
          className="max-w-6xl mx-auto w-full relative z-10"
          animate={showFooter ? { y: '-18%', scale: 0.92, opacity: 0.4, filter: 'blur(6px)' } : { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div variants={itemVariants} className="mb-8 text-center space-y-4">
            <motion.h2 {...sectionTitleReveal} className={`${sectionTitleClass} text-[#2d2818]`}>Parliamo del tuo futuro.</motion.h2>
            <motion.p {...sectionSubtitleReveal} className="text-base sm:text-lg text-[#6a6050] font-medium max-w-2xl mx-auto">
              Parlaci del tuo progetto. Prima analizziamo, poi ti diciamo cosa serve davvero.
            </motion.p>
          </motion.div>
          <div className="clay-card p-6 sm:p-12 lg:p-20 text-center relative overflow-hidden bg-gradient-to-br from-[#f8f6f2] to-[#eeeae0] border-2 border-[#d4cfc5]/40">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 clay-pill opacity-10 blur-3xl" />
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <ShinyButton
              onClick={() => setShowContactForm(true)}
              tone="clay"
              size="lg"
              className="font-black"
            >
              Compila il form
            </ShinyButton>
            <a href="mailto:info@backsoftware.it" className="clay-btn px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-bold !rounded-2xl text-[#6a6050] hover:text-[#3d3828] transition-colors flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">✉</span> E-mail
            </a>
            <a href="tel:+393513052627" className="group flex flex-col items-start gap-1">
              <span className="text-xs sm:text-sm font-black text-[#8a856f] uppercase tracking-widest opacity-60">O chiamaci:</span>
              <span className="text-base sm:text-2xl font-black text-[#3d3828] border-b-2 border-[#7c6f5b]/20 group-hover:border-[#7c6f5b] transition-colors">+39 351 305 2627</span>
            </a>
          </div>
          </div>
        </motion.div>

        {/* ── FOOTER (slides up from below, overlaying contact) ── */}
        <motion.div
          id="footer"
          className="absolute inset-x-4 sm:inset-x-6 lg:inset-x-10 bottom-0 z-20 pb-6 sm:pb-10 h-[66vh] sm:h-auto max-h-[66vh] sm:max-h-none"
          initial={false}
          animate={showFooter ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: showFooter ? 'auto' : 'none' }}
        >
          <div className="max-w-6xl mx-auto w-full">
          <footer
            ref={footerCardRef}
            onMouseEnter={() => setFooterStrokeActive(true)}
            onMouseLeave={() => setFooterStrokeActive(false)}
            onMouseMove={handleFooterPointerMove}
            className="clay-card relative overflow-hidden sm:overflow-hidden overflow-y-auto p-5 sm:p-10 lg:p-12 border border-[#d4cfc5]/50 bg-gradient-to-br from-[#f7f4ee] via-[#f3efe7] to-[#ece5d8] h-full sm:h-auto"
            style={{ '--footer-stroke-x': '50%', '--footer-stroke-y': '50%', '--footer-stroke-h': '40', '--footer-stroke-s': '66%' }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[1px] rounded-[30px] border border-[#cdbfa8]/55"
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-4 left-0 w-[2.5px] rounded-full transition-opacity duration-500 ${footerStrokeActive ? 'opacity-100' : 'opacity-62'}`}
              style={{
                background: 'linear-gradient(180deg, transparent 0%, hsl(var(--footer-stroke-h) var(--footer-stroke-s) 66% / 0.14) calc(var(--footer-stroke-y) - 28%), hsl(var(--footer-stroke-h) var(--footer-stroke-s) 74% / 0.98) var(--footer-stroke-y), hsl(var(--footer-stroke-h) var(--footer-stroke-s) 66% / 0.14) calc(var(--footer-stroke-y) + 28%), transparent 100%)',
                boxShadow: '0 0 28px hsl(var(--footer-stroke-h) var(--footer-stroke-s) 72% / 0.5)',
              }}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-4 right-0 w-[2.5px] rounded-full transition-opacity duration-500 ${footerStrokeActive ? 'opacity-100' : 'opacity-62'}`}
              style={{
                background: 'linear-gradient(180deg, transparent 0%, hsl(calc(var(--footer-stroke-h) + 5) var(--footer-stroke-s) 66% / 0.14) calc(var(--footer-stroke-y) - 28%), hsl(calc(var(--footer-stroke-h) + 5) var(--footer-stroke-s) 74% / 0.98) var(--footer-stroke-y), hsl(calc(var(--footer-stroke-h) + 5) var(--footer-stroke-s) 66% / 0.14) calc(var(--footer-stroke-y) + 28%), transparent 100%)',
                boxShadow: '0 0 28px hsl(calc(var(--footer-stroke-h) + 5) var(--footer-stroke-s) 72% / 0.5)',
              }}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-5 top-0 h-[2.5px] rounded-full transition-opacity duration-500 ${footerStrokeActive ? 'opacity-100' : 'opacity-58'}`}
              style={{
                background: 'linear-gradient(90deg, transparent 0%, hsl(var(--footer-stroke-h) var(--footer-stroke-s) 74% / 0.14) calc(var(--footer-stroke-x) - 26%), hsl(var(--footer-stroke-h) var(--footer-stroke-s) 80% / 0.99) var(--footer-stroke-x), hsl(var(--footer-stroke-h) var(--footer-stroke-s) 74% / 0.14) calc(var(--footer-stroke-x) + 26%), transparent 100%)',
                boxShadow: '0 0 22px hsl(var(--footer-stroke-h) var(--footer-stroke-s) 74% / 0.42)',
              }}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-5 bottom-0 h-[2.5px] rounded-full transition-opacity duration-500 ${footerStrokeActive ? 'opacity-100' : 'opacity-58'}`}
              style={{
                background: 'linear-gradient(90deg, transparent 0%, hsl(calc(var(--footer-stroke-h) + 4) var(--footer-stroke-s) 72% / 0.14) calc(var(--footer-stroke-x) - 26%), hsl(calc(var(--footer-stroke-h) + 4) var(--footer-stroke-s) 77% / 0.97) var(--footer-stroke-x), hsl(calc(var(--footer-stroke-h) + 4) var(--footer-stroke-s) 72% / 0.14) calc(var(--footer-stroke-x) + 26%), transparent 100%)',
                boxShadow: '0 0 22px hsl(calc(var(--footer-stroke-h) + 4) var(--footer-stroke-s) 72% / 0.4)',
              }}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-8 -left-3 w-5 blur-md transition-opacity duration-500 ${footerStrokeActive ? 'opacity-82' : 'opacity-22'}`}
              style={{
                background: 'linear-gradient(180deg, transparent 0%, hsl(var(--footer-stroke-h) var(--footer-stroke-s) 74% / 0.5) var(--footer-stroke-y), transparent 100%)',
              }}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-8 -right-3 w-5 blur-md transition-opacity duration-500 ${footerStrokeActive ? 'opacity-82' : 'opacity-22'}`}
              style={{
                background: 'linear-gradient(180deg, transparent 0%, hsl(calc(var(--footer-stroke-h) + 5) var(--footer-stroke-s) 74% / 0.5) var(--footer-stroke-y), transparent 100%)',
              }}
            />
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5 sm:gap-8 lg:gap-14">
              <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-3 sm:gap-4">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 shrink-0">
                  <motion.svg
                    viewBox="0 0 200 200"
                    className="w-full h-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, ease: 'linear', duration: 18 }}
                  >
                    <defs>
                      <path id="modern-footer-circle-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                    </defs>
                    <text fill="#4f4637" className="text-[12px] font-black tracking-[2px] uppercase">
                      <textPath href="#modern-footer-circle-path" startOffset="0%" textLength="490" lengthAdjust="spacing">
                        backsoftware • backsoftware • backsoftware •
                      </textPath>
                    </text>
                  </motion.svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[11px] sm:text-xs font-black tracking-[0.16em] uppercase text-[#2d2818] text-center leading-tight">
                      Back<br/>Software
                    </span>
                  </div>
                </div>
                <div className="sm:flex-1 lg:flex-none">
                  <p className="text-xs sm:text-sm text-[#6a6050] leading-relaxed">
                    Progettiamo e sviluppiamo soluzioni digitali con obiettivi chiari, tempi definiti e supporto continuo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5 sm:gap-6 lg:gap-8">
                <div>
                  <h5 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#8a7f6a] mb-2 sm:mb-3">Servizi</h5>
                  <div className="space-y-1 sm:space-y-2">
                    {footerServiceLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="block text-xs sm:text-sm font-semibold text-[#4b4336] hover:text-[#2d2818] transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#8a7f6a] mb-2 sm:mb-3">Azienda</h5>
                  <div className="space-y-1 sm:space-y-2">
                    {footerCompanyLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="block text-xs sm:text-sm font-semibold text-[#4b4336] hover:text-[#2d2818] transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <h5 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#8a7f6a] mb-2 sm:mb-3">Contatti</h5>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-[#4b4336]">
                    <a href="mailto:info@backsoftware.it" className="block font-semibold hover:text-[#2d2818] transition-colors">
                      info@backsoftware.it
                    </a>
                    <a href="mailto:julian.rovera@pec.it" className="block font-semibold hover:text-[#2d2818] transition-colors truncate">
                      PEC: julian.rovera@pec.it
                    </a>
                    <a href="tel:+393513052627" className="block font-semibold hover:text-[#2d2818] transition-colors">
                      +39 351 305 2627
                    </a>
                    <p className="font-medium text-[#7a705d]">Ivrea (TO)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 lg:mt-8 pt-4 sm:pt-5 border-t border-[#b8ad98]/30 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-between text-[10px] sm:text-xs text-[#7a705d]">
              <p>© {new Date().getFullYear()} Back Software</p>
              <div className="flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-1">
                <span>P.IVA: IT13227980011</span>
                <span aria-hidden="true" className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">C.F.: RVRJLN05E26B455T</span>
                <span aria-hidden="true">|</span>
                <span className="hidden sm:inline">Privacy Policy</span>
                <span aria-hidden="true" className="hidden sm:inline">|</span>
                <a href="https://www.backsoftware.it/cookies" target="_blank" rel="noreferrer" className="hover:text-[#5e5444] transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </footer>
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
