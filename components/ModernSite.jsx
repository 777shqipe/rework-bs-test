'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from 'lenis';
import Snap from 'lenis/snap';
import SplitType from 'split-type';
import { useI18n } from '../lib/i18n-context';
import { ShinyButton } from './ui/shiny-button';
import LanguageSwitcher from './LanguageSwitcher';
import { getServices } from '../data/services';
import { projectMeta, buildProjects } from '../data/projects';
import ProjectGallery3D from './ProjectGallery3D';
import InteractiveBackground from './InteractiveBackground';

gsap.registerPlugin(ScrollTrigger);

/* ===========================================================
   TILT CARD — Clean dark card with soft glow
============================================================ */
function TiltCard({ item, onCardHover }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseLeave = () => {
    setIsHovered(false);
    onCardHover?.(null);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onCardHover?.(`${item.accent}20`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        borderRadius: 28,
        background: 'linear-gradient(160deg, rgba(13,17,23,0.6) 0%, rgba(5,8,14,0.8) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${item.accent}18`,
        boxShadow: `
          0 2px 4px rgba(0,0,0,0.4),
          0 8px 16px rgba(0,0,0,0.35),
          0 16px 32px rgba(0,0,0,0.3),
          0 32px 64px rgba(0,0,0,0.25),
          inset 0 1px 0 ${item.accent}10,
          inset 0 -2px 4px rgba(0,0,0,0.3)
        `,
      }}
      className="relative group p-6 sm:p-8 lg:p-10 overflow-hidden"
    >
      {/* Soft ambient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at 50% 0%, ${item.accent}10, transparent 60%)`,
        }}
      />

      {/* Number with glow */}
      <div
        className="relative z-10 text-5xl sm:text-6xl lg:text-7xl font-black mb-4 tracking-tighter select-none transition-all duration-500"
        style={{
          color: item.accent,
          opacity: isHovered ? 0.9 : 0.1,
          textShadow: isHovered ? `0 0 40px ${item.accent}, 0 0 80px ${item.accent}60, 0 0 120px ${item.accent}30` : 'none',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        {item.num}
      </div>

      {/* Title */}
      <h3 className="relative z-10 text-lg sm:text-xl lg:text-2xl font-black mb-3 tracking-tight text-[#f0e8dc]">
        {item.title}
      </h3>

      {/* Description */}
      <p className="relative z-10 text-sm sm:text-base leading-relaxed text-[#a89880]">
        {item.desc}
      </p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-[2px] transition-all duration-500 group-hover:w-full"
        style={{
          width: '0%',
          background: `linear-gradient(90deg, ${item.accent}, transparent)`,
        }}
      />
    </motion.div>
  );
}

/* ===========================================================
   MODERN TYPEWRITER — animated placeholder for modern form
=========================================================== */
function ModernTypewriter({ servizio, t }) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const getPlaceholders = () => {
    // Build a locale-aware lookup from translated service display name -> key.
    const serviceKeyMap = {
      [t('contact.form.step2.services.siti')]: 'siti',
      [t('contact.form.step2.services.marketing')]: 'marketing',
      [t('contact.form.step2.services.foto')]: 'foto',
      [t('contact.form.step2.services.grafica')]: 'grafica',
      [t('contact.form.step2.services.software')]: 'software',
      [t('contact.form.step2.services.casa')]: 'casa',
      [t('contact.form.step2.services.altro')]: 'altro',
    };

    // `servizio` may also be a service title or title + package (e.g. "Siti Web - Landing"),
    // so we match via startsWith against the known display names.
    const match = Object.keys(serviceKeyMap).find(name => name && servizio && servizio.startsWith(name));
    const key = match ? serviceKeyMap[match] : null;
    if (key) {
      const placeholders = [
        t(`contact.form.step3.placeholders.${key}.0`),
        t(`contact.form.step3.placeholders.${key}.1`),
        t(`contact.form.step3.placeholders.${key}.2`),
      ];
      return placeholders;
    }
    return [t('contact.form.step3.placeholderDefault')];
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
   MODERN SITE — CLAYMORPHISM MODE (COMPLETE LANDING PAGE)
   NOTE: Only use REAL data from https://backsoftware.it
   NEVER invent information, stats, or claims not present on the official site.
=========================================================== */

export default function ModernSite({ onSwitchToTerminal }) {
  const { t } = useI18n();
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showFooter, setShowFooter] = useState(false);
  const [isMockupMode, setIsMockupMode] = useState(false);
  const contactSectionRef = useRef(null);
  const footerCardRef = useRef(null);
  const footerTextRef = useRef(null);
  const footerTitleRef = useRef(null);
  const footerContentRef = useRef(null);
  const footerDescRef = useRef(null);
  const [footerStrokeActive, setFooterStrokeActive] = useState(false);

  // ── Hero scroll-driven typography refs ──
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  // Orbiting text around header — pixel-perfect (mobile & desktop refs)
  const headerRefMobile = useRef(null);
  const headerRefDesktop = useRef(null);
  const headerBrandMobileRef = useRef(null);
  const headerBrandDesktopRef = useRef(null);
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
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [spotlightColor, setSpotlightColor] = useState('rgba(34,211,238,0.10)');
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

  // Detect if viewed inside iframe mockup preview
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isMockup = urlParams.has('mockup') || urlParams.has('preview');
      setIsMockupMode(isMockup);
    }
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
    setSelectedService(null);
    setTimeout(() => {
      document.getElementById('servizi')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const services = useMemo(() => getServices(t), [t]);

  // Per-project static metadata (not translated). Localized name, desc, and tags come from the messages file.
  const projectMetaStatic = useMemo(() => projectMeta, []);

  const projects = useMemo(() => buildProjects(projectMetaStatic, t), [t]);

  const footerServiceLinks = useMemo(() => ([
    { label: t('footer.links.web'), href: '#servizi' },
    { label: t('footer.links.marketing'), href: '#servizi' },
    { label: t('footer.links.grafica'), href: '#servizi' },
    { label: t('footer.links.video'), href: '#servizi' },
  ]), [t]);

  const footerCompanyLinks = useMemo(() => ([
    { label: t('footer.links.howWeWork'), href: '#come-lavoriamo' },
    { label: t('footer.links.contacts'), href: '#contatti' },
    { label: t('footer.links.pricing'), href: '#servizi' },
  ]), [t]);

  // Contact form state
  const initialFormData = {
    nome: '',
    azienda: '',
    email: '',
    prefissoTelefono: '+39',
    telefono: '',
    servizio: '',
    descrizione: '',
    website: ''
  };

  const [formData, setFormData] = useState({
    ...initialFormData
  });

  useEffect(() => {
    try {
      const draft = sessionStorage.getItem('contact_draft');
      if (draft) setFormData(JSON.parse(draft));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('contact_draft', JSON.stringify(formData));
    } catch {}
  }, [formData]);

  const [formStep, setFormStep] = useState(1);
  const [formDirection, setFormDirection] = useState(1);
  const stackLayers = [1, 2, 3];

  const serviziOptions = [
    t('contact.form.step2.services.siti'),
    t('contact.form.step2.services.marketing'),
    t('contact.form.step2.services.foto'),
    t('contact.form.step2.services.grafica'),
    t('contact.form.step2.services.software'),
    t('contact.form.step2.services.casa'),
    t('contact.form.step2.services.altro'),
  ];

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
      t('contactMessage.header'),
      '',
      t('contactMessage.contactSection'),
      `${t('contactMessage.nameLabel')}: ${formData.nome.trim()}`,
      `${t('contactMessage.companyLabel')}: ${formData.azienda.trim() || t('contactMessage.companyNotSpecified')}`,
      `${t('contactMessage.emailLabel')}: ${normalizedEmail}`,
      `${t('contactMessage.phoneLabel')}: ${fullPhoneNumber}`,
      '',
      t('contactMessage.requestSection'),
      `${t('contactMessage.serviceLabel')}: ${formData.servizio}`,
      '',
      t('contactMessage.descriptionSection'),
      formData.descrizione.trim(),
    ];

    return lines.join('\n');
  };

  const generateWhatsAppMessage = () => {
    return encodeURIComponent(buildContactMessage());
  };

  const sendViaWhatsApp = () => {
    if (formData.website) return;
    window.dataLayer?.push({ event: 'lead_submit', channel: 'whatsapp' });
    window.open(`https://wa.me/393513052627?text=${generateWhatsAppMessage()}`, '_blank', 'noopener,noreferrer');
  };

  const sendViaEmail = () => {
    if (formData.website) return;
    window.dataLayer?.push({ event: 'lead_submit', channel: 'email' });
    const subject = encodeURIComponent(
      t('contactMessage.subject', { service: formData.servizio, name: formData.nome.trim() })
    );
    const body = encodeURIComponent(buildContactMessage());
    window.open(`mailto:info@backsoftware.it?subject=${subject}&body=${body}`, '_blank', 'noopener,noreferrer');
  };

  /* ===========================================================
     LENIS — smooth scroll with section snap (JS-based)
     Replaces CSS scroll-snap for GSAP/ScrollTrigger compatibility.
  =========================================================== */
  useEffect(() => {
    if (isMockupMode) return;

    const scroller = scrollContainerRef.current;
    if (!scroller) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      wrapper: scroller,
      smoothWheel: !prefersReducedMotion,
      syncTouch: false,
    });

    // ScrollTrigger proxy → all ST instances share this Lenis-powered scroller
    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        if (arguments.length) { scroller.scrollTop = value; }
        return scroller.scrollTop;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: scroller.clientWidth, height: scroller.clientHeight };
      },
      pinType: 'transform',
    });

    // Lenis snap module: replicates CSS scroll-snap in JS
    const snap = new Snap(lenis, {
      type: 'proximity',
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    const removeSnapEls = snap.addElements(scroller.querySelectorAll('.modern-snap-section'));

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    // Let the header become the destination for the hero logo transfer.
    const checkHeaderVisibility = () => {
      const hero = heroRef.current;
      if (hero) {
        setHeaderVisible(scroller.scrollTop > Math.min(hero.offsetHeight * 0.08, 96));
      }
    };
    lenis.on('scroll', checkHeaderVisibility);
    checkHeaderVisibility();

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(500, 33);

    // Handle anchor links (#servizi, #contatti, etc.)
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 0.8 });
      }
    };
    scroller.addEventListener('click', handleAnchorClick);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off('scroll', onScroll);
      lenis.off('scroll', checkHeaderVisibility);
      removeSnapEls();
      snap.destroy();
      lenis.destroy();
      ScrollTrigger.getAll().forEach(st => st.kill());
      scroller.removeEventListener('click', handleAnchorClick);
    };
  }, [isMockupMode]);

  /* ===========================================================
     HERO — SplitType + GSAP ScrollTrigger scrub animation
     Phase 1: h1 chars fly in from scattered 3D positions
              subtitle & CTA fly in from random positions
     Phase 2: "BACK SOFTWARE" chars explode apart
  =========================================================== */
  useEffect(() => {
    const heroSection = heroRef.current;
    const titleEl = heroTitleRef.current;
    const subtitleEl = heroSubtitleRef.current;
    const scroller = scrollContainerRef.current;
    if (!heroSection || !titleEl || !scroller) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;

    const heroH1 = heroSection.querySelector('.hero-content-h1');
    let bgSplit = null;
    let h1Split = null;
    let subSplit = null;
    let headerBrandSplit = null;
    let ctx = null;
    let destroyed = false;
    let mouseRaf = null;
    let latestMouse = null;
    let handleBgMouseMove = null;
    let handleBgMouseLeave = null;

    const timeout = setTimeout(() => {
      if (destroyed) return;

      // Split the background "BACK SOFTWARE"
      bgSplit = new SplitType(titleEl, { types: 'chars' });
      const bgChars = bgSplit.chars;
      if (!bgChars || bgChars.length === 0) return;

      const activeHeaderBrand = isMobile ? headerBrandMobileRef.current : headerBrandDesktopRef.current;
      let headerBrandChars = [];

      if (activeHeaderBrand) {
        headerBrandSplit = new SplitType(activeHeaderBrand, { types: 'chars' });
        headerBrandChars = headerBrandSplit.chars || [];
        gsap.set(activeHeaderBrand, { opacity: 1 });
        gsap.set(headerBrandChars, {
          opacity: 0,
          filter: 'blur(5px)',
          display: 'inline-block',
          transformOrigin: 'center center',
          willChange: 'transform, opacity, filter',
        });
      }

      const getHeaderTargetChar = (index) => {
        if (!headerBrandChars.length) return null;
        return headerBrandChars[Math.min(index, headerBrandChars.length - 1)];
      };

      const transferToHeaderVars = {
        x: (index, char) => {
          const target = getHeaderTargetChar(index);
          if (!target) return -200;
          const sourceRect = char.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          return (targetRect.left + targetRect.width / 2) - (sourceRect.left + sourceRect.width / 2);
        },
        y: (index, char) => {
          const target = getHeaderTargetChar(index);
          if (!target) return isMobile ? -70 : -140;
          const sourceRect = char.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          return (targetRect.top + targetRect.height / 2) - (sourceRect.top + sourceRect.height / 2);
        },
        scale: (index, char) => {
          const target = getHeaderTargetChar(index);
          if (!target) return isMobile ? 0.5 : 0.4;
          const sourceRect = char.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          if (!sourceRect.height || !targetRect.height) return isMobile ? 0.5 : 0.4;
          return gsap.utils.clamp(0.16, 0.56, targetRect.height / sourceRect.height);
        },
        opacity: headerBrandChars.length ? 0.82 : 0,
        rotationX: (index) => gsap.utils.random(-10, 10) + (index % 2 === 0 ? -8 : 8),
        rotationY: (index) => gsap.utils.random(-18, 18),
        rotationZ: (index) => (index - bgChars.length / 2) * (isMobile ? 0.45 : 0.28),
        transformPerspective: 900,
        transformOrigin: 'center center',
        ease: 'power3.inOut',
        stagger: { amount: isMobile ? 0.24 : 0.44, from: 'center' },
      };

      const bgHoverChars = bgChars.map((char) => {
        char.style.display = 'inline-block';
        char.style.willChange = 'transform, opacity';
        char.style.transformStyle = 'preserve-3d';

        let inner = char.querySelector(':scope > .hero-bg-letter-hover');
        if (!inner) {
          inner = document.createElement('span');
          inner.className = 'hero-bg-letter-hover';
          while (char.firstChild) {
            inner.appendChild(char.firstChild);
          }
          char.appendChild(inner);
        }

        return inner;
      });

      // Mouse micro-shift lives on the inner span so it never fights ScrollTrigger.
      handleBgMouseMove = (e) => {
        latestMouse = { x: e.clientX, y: e.clientY };
        if (mouseRaf) return;

        mouseRaf = requestAnimationFrame(() => {
          mouseRaf = null;
          if (!latestMouse) return;

          const heroRect = heroSection.getBoundingClientRect();
          const mouseX = latestMouse.x - heroRect.left;
          const mouseY = latestMouse.y - heroRect.top;
          const influenceRadius = Math.min(Math.max(heroRect.width * 0.18, 170), 320);

          bgChars.forEach((char, index) => {
            const charRect = char.getBoundingClientRect();
            const charCenterX = charRect.left + charRect.width / 2 - heroRect.left;
            const charCenterY = charRect.top + charRect.height / 2 - heroRect.top;
            const dx = charCenterX - mouseX;
            const dy = charCenterY - mouseY;
            const distance = Math.hypot(dx, dy);
            const strength = Math.max(0, 1 - distance / influenceRadius);
            const directionX = distance ? dx / distance : 0;
            const directionY = distance ? dy / distance : 0;
            const target = bgHoverChars[index];

            gsap.to(target, {
              x: directionX * strength * 18,
              y: directionY * strength * 9,
              rotationZ: -directionX * strength * 3.5,
              duration: 0.28,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          });
        });
      };
      handleBgMouseLeave = () => {
        if (mouseRaf) cancelAnimationFrame(mouseRaf);
        mouseRaf = null;
        latestMouse = null;
        bgHoverChars.forEach((char) => {
          gsap.to(char, {
            x: 0,
            y: 0,
            rotationZ: 0,
            duration: 0.55,
            ease: 'elastic.out(1, 0.55)',
            overwrite: 'auto',
          });
        });
      };
      heroSection.addEventListener('mousemove', handleBgMouseMove);
      heroSection.addEventListener('mouseleave', handleBgMouseLeave);

      // Split the h1
      let h1Chars = null;
      if (heroH1) {
        h1Split = new SplitType(heroH1, { types: 'chars' });
        h1Chars = h1Split.chars;
        if (h1Chars && h1Chars.length > 0) {
          h1Chars.forEach((char) => {
            char.style.display = 'inline-block';
            char.style.willChange = 'transform, opacity';
          });
        }
      }

      // Split the subtitle too
      let subChars = null;
      if (subtitleEl) {
        subSplit = new SplitType(subtitleEl, { types: 'chars' });
        subChars = subSplit.chars;
        if (subChars && subChars.length > 0) {
          subChars.forEach((char) => {
            char.style.display = 'inline-block';
            char.style.willChange = 'transform, opacity';
          });
        }
      }

      ctx = gsap.context(() => {
        if (isMobile) {
          const introTl = gsap.timeline({ delay: 0.2 });

          if (h1Chars && h1Chars.length > 0) {
            introTl.from(h1Chars, {
              opacity: 0, y: 30, scale: 1.05,
              transformOrigin: 'center center',
              ease: 'power2.out',
              stagger: { amount: 0.3, from: 'start' },
            }, 0);
          }

          if (subChars && subChars.length > 0) {
            introTl.from(subChars, {
              opacity: 0, y: 20,
              ease: 'power2.out',
              stagger: { amount: 0.2, from: 'start' },
            }, 0.15);
          }

          const transferTl = gsap.timeline({
            scrollTrigger: {
              trigger: heroSection,
              scroller,
              start: 'top top',
              end: 'bottom 45%',
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          });

          transferTl.to(bgChars, transferToHeaderVars, 0);

          if (headerBrandChars.length) {
            transferTl.to(bgChars, {
              opacity: 0,
              filter: 'blur(4px)',
              duration: 0.16,
              ease: 'power2.in',
              stagger: { amount: 0.08, from: 'center' },
            }, 0.78);

            transferTl.to(headerBrandChars, {
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.18,
              ease: 'power2.out',
              stagger: { amount: 0.08, from: 'center' },
            }, 0.76);
          }

          introTl.eventCallback('onComplete', () => {
            if (h1Chars) h1Chars.forEach((char) => { char.style.willChange = 'auto'; });
            if (subChars) subChars.forEach((char) => { char.style.willChange = 'auto'; });
          });
        } else {
          // Desktop: ScrollTrigger pin + scrub animation (original)
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: heroSection,
              scroller,
              start: 'top top',
              end: '+=200%',
              pin: true,
              scrub: 0.5,
              invalidateOnRefresh: true,
              snap: {
                snapTo: [0, 0.5, 1],
                duration: 0.35,
                ease: 'power2.out',
              },
            },
          });

          // h1 chars: alternate flying in from above / below
          if (h1Chars && h1Chars.length > 0) {
            tl.from(h1Chars, {
              opacity: 0,
              y: (i) => i % 2 === 0 ? -80 : 80,
              scale: 1.2,
              rotationZ: (i) => i % 2 === 0 ? gsap.utils.random(-6, -2) : gsap.utils.random(2, 6),
              transformOrigin: 'center center',
              ease: 'power2.out',
              stagger: { amount: 0.45, from: 'start' },
            }, 0);
          }

          // Subtitle chars: alternate flying in from above / below
          if (subChars && subChars.length > 0) {
            tl.from(subChars, {
              opacity: 0,
              y: (i) => i % 2 === 0 ? -50 : 50,
              scale: 1.1,
              rotationZ: (i) => i % 2 === 0 ? gsap.utils.random(-4, -1) : gsap.utils.random(1, 4),
              transformOrigin: 'center center',
              ease: 'power2.out',
              stagger: { amount: 0.35, from: 'start' },
            }, 0.1);
          }

          // "BACK SOFTWARE" migrates into the header watermark letter by letter.
          tl.to(bgChars, transferToHeaderVars, 0.35);

          if (headerBrandChars.length) {
            tl.to(bgChars, {
              opacity: 0,
              filter: 'blur(4px)',
              duration: 0.12,
              ease: 'power2.in',
              stagger: { amount: 0.08, from: 'center' },
            }, 0.86);

            tl.to(headerBrandChars, {
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.16,
              ease: 'power2.out',
              stagger: { amount: 0.08, from: 'center' },
            }, 0.84);
          }

          ScrollTrigger.create({
            trigger: heroSection,
            scroller,
            start: 'top top',
            end: '+=200%',
            onLeave: () => {
              bgChars.forEach((char) => { char.style.willChange = 'auto'; });
              headerBrandChars.forEach((char) => { char.style.willChange = 'auto'; });
              if (h1Chars) h1Chars.forEach((char) => { char.style.willChange = 'auto'; });
              if (subChars) subChars.forEach((char) => { char.style.willChange = 'auto'; });
            },
          });
        }
      }, heroSection);
    }, 100);

    return () => {
      destroyed = true;
      clearTimeout(timeout);
      if (heroSection) {
        if (handleBgMouseMove) heroSection.removeEventListener('mousemove', handleBgMouseMove);
        if (handleBgMouseLeave) heroSection.removeEventListener('mouseleave', handleBgMouseLeave);
      }
      if (mouseRaf) cancelAnimationFrame(mouseRaf);
      if (ctx) ctx.revert();
      if (bgSplit?.chars) gsap.killTweensOf(bgSplit.chars);
      if (headerBrandSplit?.chars) gsap.killTweensOf(headerBrandSplit.chars);
      if (bgSplit) bgSplit.revert();
      if (headerBrandSplit) headerBrandSplit.revert();
      if (h1Split) h1Split.revert();
      if (subSplit) subSplit.revert();
    };
  }, [t]);

  /* ===========================================================
     SECTIONS — GSAP ScrollTrigger scrub reveals via Lenis
     Scrub-driven: animations map to scroll position for fluidity
     Cada sección cresce in intensità — Why Us gentile, Contatti grandioso
     =========================================================== */
  useEffect(() => {
    if (isMockupMode) return;
    const scroller = scrollContainerRef.current;
    if (!scroller) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx = null;
    const timeout = setTimeout(() => {
      ctx = gsap.context(() => {

        /* ─── WHY US — gentle entrance, cards grow from below ─── */
        {
          const trigger = document.querySelector('#come-lavoriamo');
          if (trigger) {
            const cards = trigger.querySelectorAll('.clay-card-dark');
            const numbers = trigger.querySelectorAll('.clay-card-dark [class*="text-4xl"], .clay-card-dark [class*="text-6xl"]');
            const accents = trigger.querySelectorAll('.clay-card-dark > .absolute.top-0');

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger,
                scroller,
                start: 'top 80%',
                end: 'top 30%',
                scrub: 0.5,
              },
            });

            tl.fromTo(cards,
              { opacity: 0, y: 100, scale: 0.92, clipPath: 'inset(0% 0% 100% 0%)' },
              {
                opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)',
                stagger: 0.22,
                ease: 'power2.out',
              },
              0
            );

            if (accents.length) {
              tl.fromTo(accents,
                { scaleX: 0, transformOrigin: 'left center' },
                { scaleX: 1, stagger: 0.22, ease: 'power2.inOut' },
                0.1
              );
            }

            if (numbers.length) {
              tl.fromTo(numbers,
                { opacity: 0, scale: 0, y: 20 },
                { opacity: 1, scale: 1, y: 0, stagger: 0.22, ease: 'power2.out' },
                0.2
              );
            }
          }
        }

        /* ─── SERVIZI — building momentum, wider wave ─── */
        {
          const trigger = document.querySelector('#servizi');
          if (trigger) {
            const cards = trigger.querySelectorAll('.clay-card');
            const icons = trigger.querySelectorAll('.clay-card .clay-pill');

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger,
                scroller,
                start: 'top 78%',
                end: 'top 22%',
                scrub: 0.6,
              },
            });

            tl.fromTo(cards,
              { opacity: 0, y: 100, scale: 0.88, clipPath: 'inset(0% 0% 100% 0%)' },
              {
                opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)',
                stagger: { each: 0.18, from: 'start' },
                ease: 'power3.out',
              },
              0
            );

            if (icons.length) {
              tl.fromTo(icons,
                { opacity: 0, scale: 0, rotateY: 110, transformOrigin: 'center center' },
                {
                  opacity: 1, scale: 1, rotateY: 0,
                  stagger: { each: 0.16, from: 'start' },
                  ease: 'power2.out',
                },
                0.25
              );
            }
          }
        }

        /* ─── PROGETTI — full impact, dramatic sweep ─── */
        {
          const trigger = document.querySelector('#progetti');
          if (trigger) {
            const pills = trigger.querySelectorAll('button');
            const grid = trigger.querySelector('.grid');
            const gridCards = grid ? gsap.utils.toArray(grid.children) : [];

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger,
                scroller,
                start: 'top 82%',
                end: 'top 15%',
                scrub: 0.65,
              },
            });

            if (pills.length) {
              tl.fromTo(pills,
                { opacity: 0, y: -35, scale: 0.82 },
                {
                  opacity: 1, y: 0, scale: 1,
                  stagger: { each: 0.08, from: 'start' },
                  ease: 'power2.out',
                },
                0
              );
            }

            if (gridCards.length) {
              tl.fromTo(gridCards,
                { opacity: 0, y: 80, scale: 0.88, rotationX: 4, transformOrigin: 'center 150%' },
                {
                  opacity: 1, y: 0, scale: 1, rotationX: 0,
                  stagger: { each: 0.14, from: 'start' },
                  ease: 'power3.out',
                },
                0.12
              );
            }
          }
        }

        /* ─── CONTATTI — crescendo finale ─── */
        {
          const trigger = document.querySelector('#contatti');
          if (trigger) {
            const card = trigger.querySelector('.clay-card');
            if (card) {
              const ctas = card.querySelectorAll('.shiny-cta, .clay-btn, a[href^="tel"]');

              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger,
                  scroller,
                  start: 'top 80%',
                  end: 'top 15%',
                  scrub: 0.7,
                },
              });

              tl.fromTo(card,
                { opacity: 0, scale: 0.78, y: 80 },
                { opacity: 1, scale: 1, y: 0, ease: 'power3.out' },
                0
              );

              if (ctas.length) {
                tl.fromTo(ctas,
                  { opacity: 0, y: 30, scale: 0.85 },
                  {
                    opacity: 1, y: 0, scale: 1,
                    stagger: 0.2,
                    ease: 'power2.out',
                  },
                  0.35
                );
              }
            }
          }
        }

      }, scroller);
    }, 250);

    return () => {
      clearTimeout(timeout);
      if (ctx) ctx.revert();
    };
  }, [isMockupMode]);

  /* ─── FOOTER TEXT — all chars fly in from top/bottom on open ─── */
  useEffect(() => {
    if (!showFooter) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const splits = [];
    const timeouts = [];

    const animateText = (el, delay, stagger = 0.05) => {
      if (!el) return;
      const split = new SplitType(el, { types: 'chars' });
      splits.push(split);
      const chars = split.chars;
      if (!chars || chars.length === 0) return;
      chars.forEach((c) => {
        c.style.display = 'inline-block';
        c.style.willChange = 'transform, opacity';
      });
      gsap.fromTo(chars,
        { opacity: 0, y: (i) => i % 2 === 0 ? -22 : 22, scale: 0.75, rotationZ: (i) => i % 2 === 0 ? -3 : 3 },
        {
          opacity: 1, y: 0, scale: 1, rotationZ: 0,
          duration: 0.6,
          stagger: { each: stagger, from: 'start' },
          ease: 'power3.out',
          delay,
        }
      );
    };

    timeouts.push(setTimeout(() => {
      // 1. Center title
      animateText(footerTitleRef.current, 0, 0.06);

      // 2. Description
      animateText(footerDescRef.current, 0.25, 0.025);

      // 3. Section headings
      const headings = footerContentRef.current?.querySelectorAll('h5');
      if (headings) {
        headings.forEach((h, i) => animateText(h, 0.4 + i * 0.1, 0.04));
      }

      // 4. Links
      const links = footerContentRef.current?.querySelectorAll('a, p');
      if (links) {
        links.forEach((l, i) => animateText(l, 0.6 + i * 0.04, 0.02));
      }
    }, 200));

    return () => {
      timeouts.forEach(clearTimeout);
      splits.forEach((s) => s.revert());
    };
  }, [showFooter]);

  // Service detail modal
  if (selectedService) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="w-full pt-4 sm:pt-6 lg:pt-10 pb-6 sm:pb-10 lg:pb-20 px-4 sm:px-10 lg:px-20 h-[100dvh] flex flex-col font-sans modern-mode relative overflow-y-auto overflow-x-hidden overscroll-y-contain"
        style={{ background: '#f5f2ec' }}>
        <div className="absolute inset-0 crt-glitch-overlay" />
        <div className="modern-crt-flicker max-w-6xl mx-auto w-full">
          <motion.button onClick={handleCloseService}
            className="clay-btn px-6 py-3 mb-6 text-sm font-bold !rounded-xl text-[#3d3828] flex items-center gap-2"
            whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            {t('serviceModal.backToServices')}
          </motion.button>
          
<motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            
            {/* Content */}
            <div>
              <div className="clay-card p-10 sm:p-16 lg:p-20 mb-8">
                <div className="text-5xl mb-4">{selectedService.icon}</div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#2d2818] mb-4 tracking-tight">{selectedService.title}</h2>
                <p className="text-lg leading-relaxed text-[#6a6050] font-medium">{selectedService.details}</p>
              </div>
              
              {/* Packages */}
              {selectedService.packages && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#2d2818] mb-4 px-2">{t('serviceModal.choosePackage')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedService.packages.map((pkg, idx) => (
                      <motion.div
                        key={idx}
                        className="clay-card p-6 cursor-pointer group hover:scale-[1.02] transition-transform"
                        onClick={() => { handleCloseService(); setFormData(prev => ({ ...prev, servizio: `${selectedService.title} - ${pkg.name}` })); setShowContactForm(true); }}
                        whileTap={{ scale: 0.98 }}>
                        <h4 className="text-lg font-black text-[#2d2818] mb-2 group-hover:text-[#7c6f5b] transition-colors">{pkg.name}</h4>
                        <p className="text-sm text-[#6a6050] leading-relaxed">{pkg.desc}</p>
                        <div className="mt-4 text-xs font-bold text-[#7c6f5b] opacity-0 group-hover:opacity-100 transition-opacity">
                          {t('serviceModal.requestQuote')}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-1 sm:px-2 mt-4">
                <button onClick={() => { handleCloseService(); setShowContactForm(true); setFormData(prev => ({ ...prev, servizio: selectedService.title })); }}
                  className="clay-btn w-full sm:w-auto px-6 py-3.5 text-[15px] sm:text-base font-bold !rounded-2xl text-[#3d3828] bg-[#fdfcf9] hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  {t('serviceModal.requestInfo')} <span>→</span>
                </button>
                <button onClick={handleCloseService}
                  className="clay-btn w-full sm:w-auto px-6 py-3.5 text-[15px] sm:text-base font-bold !rounded-2xl text-[#6a6050] flex items-center justify-center">
                  {t('serviceModal.otherServices')}
                </button>
              </div>
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
        className="w-full p-4 sm:p-10 lg:p-20 h-[100dvh] flex flex-col font-sans modern-mode relative overflow-y-auto overflow-x-hidden overscroll-y-contain"
        style={{ background: '#f5f2ec' }}>
        <div className="absolute inset-0 crt-glitch-overlay" />
        <div className="modern-crt-flicker max-w-3xl mx-auto w-full">
          <motion.button onClick={() => { setShowContactForm(false); setFormStep(1); setFormDirection(1); setFormData({ ...initialFormData }); }}
            className="clay-btn px-6 py-3 mb-8 text-sm font-bold !rounded-xl text-[#3d3828] flex items-center gap-2"
            whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            {t('serviceModal.backToHome')}
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
              className="relative z-20 clay-card p-6 sm:p-10 lg:p-14 overflow-hidden"
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
            <h2 className="text-3xl sm:text-4xl font-black text-[#2d2818] mb-1 tracking-tight">{t('contact.form.title')}</h2>
            <p className="text-[#6a6050] mb-8 text-sm">{t('contact.form.subtitle')}</p>

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
                <h3 className="text-xl font-black text-[#2d2818]">{t('contact.form.step1.title')}</h3>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="absolute opacity-0 w-0 h-0 pointer-events-none"
                  aria-hidden="true"
                />
                <input type="text" placeholder={t('contact.form.step1.name')} value={formData.nome} onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]" />
                <input type="text" placeholder={t('contact.form.step1.company')} value={formData.azienda} onChange={(e) => handleInputChange('azienda', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]" />
                <input type="email" placeholder={t('contact.form.step1.email')} value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]" />

                {!isEmailValid && formData.email.length > 0 && (
                  <p className="text-xs font-semibold text-[#b94242]">{t('contact.form.step1.emailError')}</p>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder={t('contact.form.step1.prefix')}
                    value={formData.prefissoTelefono}
                    onChange={(e) => handleInputChange('prefissoTelefono', e.target.value)}
                    className="p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]"
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder={t('contact.form.step1.phone')}
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value.replace(/[^\d\s]/g, ''))}
                    className="col-span-2 p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]"
                  />
                </div>

                {!isPhonePrefixValid && formData.prefissoTelefono.length > 0 && (
                  <p className="text-xs font-semibold text-[#b94242]">{t('contact.form.step1.prefixError')}</p>
                )}
                {!isPhoneValid && formData.telefono.length > 0 && (
                  <p className="text-xs font-semibold text-[#b94242]">{t('contact.form.step1.phoneError')}</p>
                )}
                <p className="text-xs text-[#8a856f]">{t('contact.form.step1.phoneRequired')}</p>
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
                <h3 className="text-xl font-black text-[#2d2818]">{t('contact.form.step2.title')}</h3>
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
                <h3 className="text-xl font-black text-[#2d2818]">{t('contact.form.step3.title')}</h3>
                <div className="relative">
                  <textarea
                    value={formData.descrizione}
                    onChange={(e) => handleInputChange('descrizione', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors min-h-[120px] resize-none text-[#2d2818]" />
                  {!formData.descrizione && (
                    <ModernTypewriter servizio={formData.servizio} t={t} />
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
                <h3 className="text-xl font-black text-[#2d2818]">{t('contact.form.step4.title')}</h3>
                <p className="text-sm text-[#6a6050]">{t('contact.form.step4.subtitle')}</p>

                <div className="p-5 sm:p-6 rounded-3xl bg-[linear-gradient(145deg,#fffdf9_0%,#f8f4ec_100%)] border-2 border-[#d4cfc5] space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-[#2d2818]">{t('contact.form.step4.contactCard')}</p>
                    <span className="text-[11px] font-black tracking-wide px-3 py-1 rounded-full bg-[#e9e3d7] text-[#5a5041]">{t('contact.form.step4.ready')}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <p className="rounded-xl bg-[#fdfcf9] px-3 py-2 border border-[#e8e2d6]"><span className="font-bold text-[#8a856f]">{t('contact.form.step4.nameLabel')}</span> {formData.nome}</p>
                    <p className="rounded-xl bg-[#fdfcf9] px-3 py-2 border border-[#e8e2d6]"><span className="font-bold text-[#8a856f]">{t('contact.form.step4.companyLabel')}</span> {formData.azienda || t('contact.form.step4.notSpecified')}</p>
                    <p className="rounded-xl bg-[#fdfcf9] px-3 py-2 border border-[#e8e2d6]"><span className="font-bold text-[#8a856f]">{t('contact.form.step4.emailLabel')}</span> {normalizedEmail}</p>
                    <p className="rounded-xl bg-[#fdfcf9] px-3 py-2 border border-[#e8e2d6]"><span className="font-bold text-[#8a856f]">{t('contact.form.step4.phoneLabel')}</span> {fullPhoneNumber}</p>
                  </div>
                  <p className="rounded-xl bg-[#fdfcf9] px-3 py-2 border border-[#e8e2d6]"><span className="font-bold text-[#8a856f]">{t('contact.form.step4.serviceLabel')}</span> {formData.servizio}</p>
                  <div className="rounded-xl bg-[#fdfcf9] px-3 py-3 border border-[#e8e2d6]">
                    <p className="font-bold text-[#8a856f] mb-1">{t('contact.form.step4.descriptionLabel')}</p>
                    <p className="text-[#6a6050] whitespace-pre-wrap">{formData.descrizione}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <button onClick={sendViaWhatsApp}
                    className="w-full p-4 rounded-2xl text-white font-bold bg-[linear-gradient(135deg,#1fbf62_0%,#128c7e_100%)] shadow-[0_10px_24px_rgba(18,140,126,0.25)] hover:translate-y-[-1px] hover:shadow-[0_14px_28px_rgba(18,140,126,0.35)] transition-all">
                    {t('contact.form.step4.sendWhatsApp')}
                  </button>
                  <button onClick={sendViaEmail}
                    className="w-full p-4 rounded-2xl text-white font-bold bg-[linear-gradient(135deg,#4a4234_0%,#2f2a1d_100%)] shadow-[0_10px_24px_rgba(47,42,29,0.25)] hover:translate-y-[-1px] hover:shadow-[0_14px_28px_rgba(47,42,29,0.35)] transition-all">
                    {t('contact.form.step4.sendEmail')}
                  </button>
                </div>
              </motion.div>
            )}
            </AnimatePresence>

            {/* Navigation */}
            {formStep >= 1 && formStep <= 3 && (
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#e4dfd4]">
                <button onClick={goToPrevStep}
                  className="clay-btn w-full sm:w-auto px-6 py-3 sm:py-4 font-bold text-[#6a6050]">
                  {t('contact.form.back')}
                </button>
                <button onClick={goToNextStep}
                  disabled={(formStep === 1 && !isStep1Valid) || (formStep === 2 && !isStep2Valid) || (formStep === 3 && !isStep3Valid)}
                  className="flex-1 w-full clay-btn px-6 py-3 sm:py-4 font-bold !rounded-2xl text-[#3d3828] bg-[#fdfcf9] disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform">
                  {formStep === 3 ? t('contact.form.confirm') : t('contact.form.next')}
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
    <motion.div ref={scrollContainerRef} initial="hidden" animate="visible" variants={containerVariants}
      className={`h-[100dvh] w-full overflow-x-hidden overflow-y-auto font-sans modern-mode modern-snap-container selection:bg-[#7c6f5b]/20 relative overscroll-y-contain ${isMockupMode ? 'mockup-mode' : ''}`}
      style={{ background: 'linear-gradient(180deg, #f5f2ec 0%, #f2eee7 100%)' }}>
      {/* CRT Glitch Effect */}
      <div className="absolute inset-0 crt-glitch-overlay pointer-events-none" />
      
      {/* ── HEADER ── */}
      <motion.nav variants={itemVariants}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ pointerEvents: 'none' }}
      >
        <div style={{ opacity: headerVisible ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: headerVisible ? 'auto' : 'none' }}>
        {/* Mobile Header - Compact WITH animation */}
        <div className="sm:hidden mx-auto mt-8 w-[calc(100%-2.5rem)] max-w-md">
          <div 
            ref={headerRefMobile}
            className="flex items-center justify-between gap-2 py-1 px-2.5 rounded-[1.5rem] pointer-events-auto relative overflow-visible"
            style={{
              background: 'linear-gradient(145deg, rgba(248, 245, 239, 0.70) 0%, rgba(242, 237, 228, 0.60) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
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
                      style={{ fontSize: '6px', fontWeight: 700, letterSpacing: '0', opacity: 0.32, transition: 'fill 0.4s ease', textRendering: 'geometricPrecision' }}
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

            {/* Giant watermark behind mobile header — full-height immersive */}
            <span className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{ padding: '0 40% 0 3%' }}>
              <span
                ref={headerBrandMobileRef}
                className="header-brand-transfer-target text-[6vw] font-black tracking-tighter leading-[0.8] whitespace-nowrap text-[#2d2818]/[0.128]"
                style={{ opacity: 0, transform: 'scaleY(1.2) scaleX(0.90) translateX(-6%)' }}
              >
                {t('nav.brandName').toUpperCase()}
              </span>
            </span>

            {/* Logo Mobile */}
            <div className="flex items-center min-w-0 relative z-10">
              <p className="text-[9px] font-bold text-[#4a4336] tracking-[0.14em] uppercase truncate">{t('nav.brandTagline')}</p>
            </div>

            {/* Actions Mobile */}
            <div className="flex items-center gap-1.5 shrink-0 relative z-10">
              <LanguageSwitcher />
              <button 
                onClick={onSwitchToTerminal}
                className="grid place-items-center w-7 h-7 rounded-full text-[#746a57] bg-[#f8f4ec] border border-[#dbd3c6]/70 active:scale-95 transition-transform"
              >
                <span className="text-[10px] leading-none -translate-y-[1px]" aria-label="Apri arcade retro">🎮</span>
              </button>
              <ShinyButton
                href="#contatti"
                tone="espresso"
                size="sm"
                intensity="strong"
                className="font-bold !text-[10px] !px-2 !py-1"
              >
                {t('nav.writeUs')}
              </ShinyButton>
            </div>
          </div>
        </div>

        {/* Desktop Header - With animation */}
        <div 
          ref={headerRefDesktop}
          className="hidden sm:flex max-w-6xl mx-auto mt-5 items-center justify-between gap-3 py-2.5 px-4 lg:px-5 rounded-2xl lg:rounded-[1.75rem] pointer-events-auto relative"
          style={{
            background: 'linear-gradient(145deg, rgba(248, 245, 239, 0.30) 0%, rgba(242, 237, 228, 0.20) 100%)',
            backdropFilter: 'blur(32px) saturate(120%)',
            WebkitBackdropFilter: 'blur(32px) saturate(120%)',
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
                      style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '1.2px', opacity: 0.35, transition: 'fill 0.4s ease', textRendering: 'geometricPrecision' }}
                    >
                      <textPath ref={orbitRef1Desktop} href="#header-orbit-path-desktop" startOffset="0" textLength={pathLenDesktop} lengthAdjust="spacing">
                        {orbitTextDesktop}
                      </textPath>
                    </text>
                    <text
                      fill={orbitColor}
                      style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '1.2px', opacity: 0.35, transition: 'fill 0.4s ease', textRendering: 'geometricPrecision' }}
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

          {/* Giant watermark behind desktop header — full-height immersive */}
          <span className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{ padding: '0 45% 0 3%' }}>
            <span
              ref={headerBrandDesktopRef}
              className="header-brand-transfer-target text-[3.8rem] lg:text-[4.6rem] xl:text-[5.2rem] font-black tracking-tighter leading-[0.78] whitespace-nowrap text-[#2d2818]/[0.128]"
              style={{ opacity: 0, transform: 'scaleY(1.22) scaleX(0.90) translateX(-5%)' }}
            >
              {t('nav.brandName').toUpperCase()}
            </span>
          </span>

          {/* Logo Desktop */}
          <div className="flex items-center gap-3 min-w-0 relative z-10">
            <div className="min-w-0">
              <p className="text-[9px] lg:text-[11px] font-bold text-[#4a4336] tracking-[0.14em] uppercase truncate">{t('nav.brandTagline')}</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <div className="hidden md:flex items-center gap-1 rounded-full bg-[#f8f4ec]/30 backdrop-blur-sm p-1 border border-[#d8d0c1]/50">
              {[
                { label: t('nav.services'), href: '#servizi' },
                { label: t('nav.projects'), href: '#progetti' },
                { label: t('nav.contact'), href: '#contatti' }
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

            <LanguageSwitcher />

            <button 
              onClick={onSwitchToTerminal}
              className="grid place-items-center w-8 h-8 rounded-full text-[#746a57] hover:text-[#3d3528] bg-[#f8f4ec] border border-[#dbd3c6]/70 hover:bg-[#f1e9dc] transition-all active:scale-95 text-xs"
              aria-label={t('nav.arcade')}
            >
              <span className="leading-none -translate-y-[1px]">🎮</span>
            </button>
            
            <ShinyButton
              href="#contatti"
              tone="espresso"
              size="md"
              intensity="strong"
              className="font-bold !text-sm !px-5 !py-3"
            >
              {t('nav.writeUs')}
            </ShinyButton>
          </div>
        </div>
        </div>
      </motion.nav>


      {/* ── HERO ── */}
      <motion.section ref={heroRef} variants={itemVariants} className="hero-snap-anchor flex items-center justify-center relative px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ minHeight: '100dvh', height: '100dvh' }}>
        {/* Floating Accents - Hidden on mobile */}
        <div className="hidden sm:block absolute -top-10 left-10 w-24 h-24 clay-pill opacity-10 animate-float pointer-events-none" />
        <div className="hidden sm:block absolute top-40 right-10 w-32 h-32 clay-pill opacity-10 animate-float-delayed pointer-events-none" />

        {/* Giant background watermark — "Back Software" only */}
        <h2
          ref={heroTitleRef}
          className="hero-animated-title absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <span className="block text-[17vw] sm:text-[14vw] md:text-[13vw] lg:text-[12vw] font-black tracking-tighter text-[#2d2818]/[0.20] leading-none whitespace-nowrap text-center">
            {t('nav.brandName')}
          </span>
        </h2>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1">
              <h1
                className="hero-content-h1 text-[2.25rem] sm:text-[3rem] md:text-6xl lg:text-6xl xl:text-7xl font-black leading-[1.12] sm:leading-[1.05] mb-6 sm:mb-8 tracking-tight text-[#2d2818]">
                <span className="block mb-2">{t('hero.title1')}</span>
                <span className="block mb-2">{t('hero.title2')}</span>
                <span className="text-[#8a7f6a] drop-shadow-sm block">{t('hero.title3')}<span className="whitespace-nowrap hero-highlight-glow cursor-default">{t('hero.title3Highlight')}</span>.</span>
              </h1>
              <p
                ref={heroSubtitleRef}
                className="text-base sm:text-base lg:text-xl xl:text-2xl leading-relaxed max-w-xl font-medium mb-10 text-[#6a6050] whitespace-pre-line">
                {t('hero.subtitle')}
              </p>
            </div>

          </div>

          <motion.a
            href="#come-lavoriamo"
            className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 group cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#b8ad98]/70 group-hover:text-[#8a7f6a] transition-colors">scrolla e scopri</span>
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: [0.4, 0, 0.6, 1] }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#b8ad98] group-hover:text-[#6a6050] transition-colors">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.a>
        </div>
      </motion.section>

      {/* ── DARK SECTION: Why Us ── */}
      <motion.section
        id="come-lavoriamo"
        data-dark-section
        variants={itemVariants}
        className="modern-snap-section snap-scroll-inner relative flex flex-col justify-start overflow-hidden px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 pb-12 sm:py-20"
        style={{
          background: 'linear-gradient(160deg, #080c14 0%, #0a0f1c 40%, #05070a 100%)',
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setSpotlightPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }}
      >
        {/* Interactive mouse background */}
        <InteractiveBackground />

        {/* Mouse-following spotlight overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(900px circle at ${spotlightPos.x}% ${spotlightPos.y}%, ${spotlightColor}, transparent 50%)`,
          }}
        />

        {/* Cool ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 50%, rgba(34,211,238,0.08) 0%, transparent 70%)',
        }} />
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }} />
        {/* Ambient cool glow - hidden on mobile */}
        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] rounded-full opacity-[0.07] pointer-events-none" style={{ background: 'radial-gradient(ellipse, #22d3ee 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <motion.div variants={itemVariants} className="mb-4 sm:mb-12 space-y-2 sm:space-y-4">
            <motion.h2 {...sectionTitleReveal} className={`${sectionTitleClass} text-[#f0e8dc]`}>
              {t('whyUs.title')}
            </motion.h2>
            <motion.p {...sectionSubtitleReveal} className="text-xs sm:text-lg leading-relaxed max-w-2xl font-medium" style={{ color: '#a89880' }}>
              {t('whyUs.subtitle')}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {[
              { num: '01', title: t('whyUs.cards.01.title'), desc: t('whyUs.cards.01.desc'), accent: '#22d3ee' },
              { num: '02', title: t('whyUs.cards.02.title'), desc: t('whyUs.cards.02.desc'), accent: '#a78bfa' },
              { num: '03', title: t('whyUs.cards.03.title'), desc: t('whyUs.cards.03.desc'), accent: '#fb923c' }
            ].map((item, i) => (
              <TiltCard key={i} item={item} onCardHover={(color) => setSpotlightColor(color || 'rgba(34,211,238,0.10)')} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── SERVIZI Section ── */}
      <motion.section id="servizi" variants={itemVariants} className="modern-snap-section snap-scroll-inner flex flex-col justify-start px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24 pb-10 sm:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div variants={itemVariants} className="mb-4 sm:mb-8 space-y-1 sm:space-y-4">
            <motion.h2 {...sectionTitleReveal} className={`${sectionTitleClass} text-[#2d2818]`}>{t('services.title')}</motion.h2>
            <motion.p {...sectionSubtitleReveal} className="text-sm sm:text-lg text-[#6a6050] font-medium">
              {t('services.subtitle')}
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {services.map((s, i) => (
              <motion.div key={i} variants={itemVariants}
                onClick={() => setSelectedService(s)}
                className={`clay-card py-3 sm:py-5 px-4 sm:px-6 flex items-center gap-3 sm:gap-5 cursor-pointer group min-h-[72px] sm:min-h-[108px] ${s.span}`}>
                <span className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-lg sm:text-xl clay-pill bg-[#f5f2ec] shadow-sm group-hover:scale-110 transition-transform shrink-0">{s.icon}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-black text-[#2d2818] group-hover:text-[#7c6f5b] transition-colors leading-tight">{s.title}</h3>
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
        className="modern-snap-section snap-scroll-inner relative flex min-h-0 flex-col px-3 sm:px-6 lg:px-10 pt-20 pb-10 sm:pb-20 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #080c14 0%, #0a0f1c 40%, #05070a 100%)',
        }}
      >
        {/* Cool ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 100% 70% at 50% 60%, rgba(34,211,238,0.06) 0%, transparent 70%)',
        }} />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }} />
        
        {/* Project ring gallery */}
        <div className="relative z-10 max-w-6xl mx-auto w-full flex-1 min-h-0">
          <ProjectGallery3D projects={projects} t={t} />
        </div>
      </motion.section>

      {/* ── CONTATTI Section ── */}
      <motion.section ref={contactSectionRef} id="contatti" variants={itemVariants} className="modern-snap-section snap-scroll-inner flex flex-col justify-start px-4 sm:px-6 lg:px-10 pt-16 pb-10 sm:py-20 relative" style={{ background: '#f5f2ec' }}>
        {/* Contact content — shifts up when footer appears */}
        <motion.div
          className="max-w-6xl mx-auto w-full relative z-10"
          animate={showFooter ? { y: '-18%', scale: 0.92, opacity: 0.4, filter: 'blur(6px)' } : { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div variants={itemVariants} className="mb-8 text-center space-y-4">
            <motion.h2 {...sectionTitleReveal} className={`${sectionTitleClass} text-[#2d2818]`}>{t('contact.title')}</motion.h2>
            <motion.p {...sectionSubtitleReveal} className="text-base sm:text-lg text-[#6a6050] font-medium max-w-2xl mx-auto">
              {t('contact.subtitle')}
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
              {t('contact.formCta')}
            </ShinyButton>
            <a href="mailto:info@backsoftware.it" className="clay-btn px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-bold !rounded-2xl text-[#6a6050] hover:text-[#3d3828] transition-colors flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">✉</span> {t('contact.email')}
            </a>
            <a href="tel:+393513052627" className="group flex flex-col items-start gap-1">
              <span className="text-xs sm:text-sm font-black text-[#8a856f] uppercase tracking-widest opacity-60">{t('contact.callUs')}</span>
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
            {/* Close button */}
            <button
              onClick={() => setShowFooter(false)}
              aria-label={t('footer.close')}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#6a6050] hover:text-[#3d3828] hover:bg-[#e8e2d8]/60 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[22px] sm:h-[22px]">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
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
<text fill="#4f4637" className="text-[12px] font-black tracking-[2px] uppercase" opacity={0.28}>
                        <textPath ref={footerTextRef} href="#modern-footer-circle-path" startOffset="0%" textLength="490" lengthAdjust="spacing">
backsoftware • backsoftware • backsoftware •
                        </textPath>
                      </text>
                    </motion.svg>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span ref={footerTitleRef} className="text-[11px] sm:text-xs font-black tracking-[0.16em] uppercase text-[#2d2818] text-center leading-tight">
                        Back<br/>Software
                      </span>
                    </div>
                  </div>
                <div className="sm:flex-1 lg:flex-none">
                  <p ref={footerDescRef} className="text-xs sm:text-sm text-[#6a6050] leading-relaxed">
                    {t('footer.description')}
                  </p>
                </div>
              </div>

              <div ref={footerContentRef} className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5 sm:gap-6 lg:gap-8">
                <div>
                  <h5 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#8a7f6a] mb-2 sm:mb-3">{t('footer.services')}</h5>
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
                  <h5 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#8a7f6a] mb-2 sm:mb-3">{t('footer.company')}</h5>
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
                  <h5 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#8a7f6a] mb-2 sm:mb-3">{t('footer.contacts')}</h5>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-[#4b4336]">
                    <a href="mailto:info@backsoftware.it" className="block font-semibold hover:text-[#2d2818] transition-colors">
                      info@backsoftware.it
                    </a>
                    <a href="mailto:julian.rovera@pec.it" className="block font-semibold hover:text-[#2d2818] transition-colors truncate">
                      {t('footer.pec')} julian.rovera@pec.it
                    </a>
                    <a href="tel:+393513052627" className="block font-semibold hover:text-[#2d2818] transition-colors">
                      +39 351 305 2627
                    </a>
                    <p className="font-medium text-[#7a705d]">{t('footer.address')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 lg:mt-8 pt-4 sm:pt-5 border-t border-[#b8ad98]/30 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-between text-[10px] sm:text-xs text-[#7a705d]">
              <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
              <div className="flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-1">
                <span>{t('footer.vat')}</span>
                <span aria-hidden="true" className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">{t('footer.cf')}</span>
                <span aria-hidden="true">|</span>
                <span className="hidden sm:inline">{t('footer.privacy')}</span>
                <span aria-hidden="true" className="hidden sm:inline">|</span>
                <a href="https://www.backsoftware.it/cookies" target="_blank" rel="noreferrer" className="hover:text-[#5e5444] transition-colors">
                  {t('footer.cookies')}
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
