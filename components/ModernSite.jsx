'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      }, 30);
      return () => clearTimeout(timer);
    }

    if (isTyping && idx >= currentText.length) {
      setIsTyping(false);
      const timer = setTimeout(() => {
        setIdx(prev => prev - 1);
      }, 2500);
      return () => clearTimeout(timer);
    }

    if (!isTyping && idx > 0) {
      const timer = setTimeout(() => {
        setText(currentText.slice(0, idx - 1));
        setIdx(prev => prev - 1);
      }, 18);
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
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [showFooter, setShowFooter] = useState(false);
  const contactSectionRef = useRef(null);

  // Orbiting text around header — pixel-perfect
  const headerRef = useRef(null);
  const orbitSvgRef = useRef(null);
  const orbitRef1 = useRef(null);
  const orbitRef2 = useRef(null);
  const [headerPath, setHeaderPath] = useState('');
  const [orbitText, setOrbitText] = useState('');
  const [pathLen, setPathLen] = useState(0);
  const UNIT = 'BACKSOFTWARE \u2022 ';

  useEffect(() => {
    const recalc = () => {
      const el = headerRef.current;
      const svg = orbitSvgRef.current;
      if (!el || !svg) return;

      // 1. Build rounded-rect path just outside the header pill
      const { width: w, height: h } = el.getBoundingClientRect();
      const out = 4;
      const rx = 32;
      const x1 = -out, y1 = -out, x2 = w + out, y2 = h + out;
      const d = `M ${x1 + rx},${y1} H ${x2 - rx} Q ${x2},${y1} ${x2},${y1 + rx} V ${y2 - rx} Q ${x2},${y2} ${x2 - rx},${y2} H ${x1 + rx} Q ${x1},${y2} ${x1},${y2 - rx} V ${y1 + rx} Q ${x1},${y1} ${x1 + rx},${y1} Z`;
      setHeaderPath(d);

      // 2. Measure perimeter + one text unit (next frame so the path DOM is ready)
      requestAnimationFrame(() => {
        const pathEl = svg.querySelector('#header-orbit-path');
        if (!pathEl) return;
        const perimeter = pathEl.getTotalLength();
        setPathLen(perimeter);

        // Measure one "BACKSOFTWARE • " unit
        const ns = 'http://www.w3.org/2000/svg';
        const tmp = document.createElementNS(ns, 'text');
        tmp.setAttribute('font-size', '8');
        tmp.setAttribute('font-weight', '800');
        tmp.setAttribute('letter-spacing', '2');
        tmp.textContent = UNIT;
        svg.appendChild(tmp);
        const unitW = tmp.getComputedTextLength();
        svg.removeChild(tmp);

        if (unitW <= 0) return;

        // 3. Repeat to fill exactly one perimeter
        //    textLength on textPath will stretch/compress to exactly pathLen
        const count = Math.round(perimeter / unitW);
        setOrbitText(UNIT.repeat(Math.max(count, 1)));
      });
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, []);

  // Detect dark/light background under header
  const [orbitOnDark, setOrbitOnDark] = useState(false);

  useEffect(() => {
    const check = () => {
      const header = headerRef.current;
      if (!header) return;
      const mid = header.getBoundingClientRect().top + header.getBoundingClientRect().height / 2;
      const darkSections = document.querySelectorAll('[data-dark-section]');
      let dark = false;
      darkSections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (mid >= r.top && mid <= r.bottom) dark = true;
      });
      setOrbitOnDark(dark);
    };
    const container = document.querySelector('.modern-snap-container');
    if (container) container.addEventListener('scroll', check, { passive: true });
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => {
      if (container) container.removeEventListener('scroll', check);
      window.removeEventListener('scroll', check);
    };
  }, []);

  // Animate orbit with rAF
  useEffect(() => {
    let offset = 0;
    let raf;
    const step = () => {
      offset = (offset + 0.02) % 100;
      if (orbitRef1.current) orbitRef1.current.setAttribute('startOffset', `${offset}%`);
      if (orbitRef2.current) orbitRef2.current.setAttribute('startOffset', `${offset - 100}%`);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Orbit color: brownish on light, warm beige on dark
  const orbitColor = orbitOnDark ? '#d4cabb' : '#5a5244';

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
      span: 'md:col-span-2'
    },
    {
      icon: <IconSitiLanding />,
      title: 'Siti e Landing',
      desc: 'Siti web professionali e landing page ottimizzate per conversioni.',
      details: 'Siti web professionali e landing page ottimizzate per le conversioni. Dal sito aziendale completo alla landing page mirata, tutto responsive e pronto per Google.',
      packages: [
        { name: 'Sito 5-10 Pagine', desc: 'Sito web completo con 5-10 pagine, responsive e ottimizzato' },
        { name: 'Landing Page', desc: 'Landing page ottimizzata per conversioni e lead generation' }
      ],
      span: ''
    },
    {
      icon: <IconMarketing />,
      title: 'Marketing & ADS',
      desc: 'Analisi, Meta Ads e Google Ads. Strategie che portano risultati.',
      details: 'Strategie di marketing digitale e campagne pubblicitarie mirate. Analisi, pianificazione e gestione completa delle tue campagne su Meta e Google.',
      packages: [
        { name: 'Analisi Marketing', desc: 'Analisi completa per campagne pubblicitarie efficaci' },
        { name: 'Meta Ads', desc: 'Campagne su Meta e altri canali social' },
        { name: 'Google Ads', desc: 'Campagne pubblicitarie su Google Search e Display' }
      ],
      span: ''
    },
    {
      icon: <IconFotoVideo />,
      title: 'Foto & Video',
      desc: 'Servizi fotografici e video professionali per la tua azienda.',
      details: 'Servizi professionali di fotografia e video per la tua azienda. Shooting fotografici, riprese con drone, video corporate e contenuti per i social.',
      packages: [
        { name: 'Servizio Fotografico', desc: 'Servizi fotografici professionali per aziende e prodotti' },
        { name: 'Video Drone', desc: 'Riprese video aeree con drone professionale' },
        { name: 'Video Staff', desc: 'Riprese video con staff professionale' }
      ],
      span: ''
    },
    {
      icon: <IconGraficaCopy />,
      title: 'Grafica & Copy',
      desc: 'Design grafico e copywriting per la tua comunicazione.',
      details: 'Servizi di design grafico e copywriting per la tua comunicazione. Loghi, identità visiva, materiali grafici e testi che parlano al tuo pubblico.',
      packages: [
        { name: 'Grafica', desc: 'Servizi di design grafico, visual e brand identity' },
        { name: 'Copywriting', desc: 'Servizi di scrittura, comunicazione e testi SEO' }
      ],
      span: ''
    },
    {
      icon: <IconDigitali />,
      title: 'Software su Misura',
      desc: 'Gestionali, applicazioni e integrazioni API su misura.',
      details: 'Soluzioni digitali avanzate per la gestione aziendale. Software su misura, gestionali, applicazioni web/mobile e integrazioni API.',
      packages: [
        { name: 'Gestionali', desc: 'Sistemi gestionali personalizzati per la tua azienda' },
        { name: 'Applicazioni', desc: 'Applicazioni web e mobile su misura' },
        { name: 'Collegamento API', desc: 'Integrazioni e collegamenti API con altri servizi' }
      ],
      span: 'md:col-span-2'
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
  const groupedModernProjects = modernCategories.map(cat => ({
    name: cat,
    projects: projects.filter(p => p.category === cat)
  })).filter(g => g.projects.length > 0);

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
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    servizio: '',
    descrizione: ''
  });
  const [formStep, setFormStep] = useState(1);

  const serviziOptions = ['Siti Web', 'Marketing', 'Foto & Video', 'Grafica & Brand', 'Software su Misura', 'Case Famiglia', 'Altro'];

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const generateWhatsAppMessage = () => {
    return `*Nuova Richiesta Contatto*%0A%0A*Nome:* ${formData.nome}%0A*Email:* ${formData.email}%0A*Telefono:* ${formData.telefono}%0A%0A*Servizio:* ${formData.servizio}%0A%0A*Descrizione:*%0A${formData.descrizione}`;
  };

  const sendViaWhatsApp = () => {
    window.open(`https://wa.me/393513052627?text=${generateWhatsAppMessage()}`, '_blank');
  };

  const sendViaEmail = () => {
    window.open(`mailto:info@backsoftware.it?subject=Richiesta preventivo - ${formData.servizio} - ${formData.nome}&body=Nome: ${formData.nome}%0AEmail: ${formData.email}%0ATelefono: ${formData.telefono}%0A%0AServizio: ${formData.servizio}%0A%0ADescrizione:%0A${formData.descrizione}`, '_blank');
  };

  // Service detail modal
  if (selectedService) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="p-6 sm:p-10 lg:p-20 h-full flex flex-col font-sans modern-mode relative overflow-y-auto overflow-x-hidden"
        style={{ background: '#f5f2ec' }}>
        <div className="absolute inset-0 crt-glitch-overlay" />
        <div className="modern-crt-flicker max-w-4xl mx-auto w-full">
          <motion.button onClick={() => setSelectedService(null)}
            className="clay-btn px-6 py-3 mb-8 text-sm font-bold !rounded-xl text-[#3d3828] flex items-center gap-2"
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
                    onClick={() => { setSelectedService(null); setFormData(prev => ({ ...prev, servizio: `${selectedService.title} - ${pkg.name}` })); setShowContactForm(true); }}
                    whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
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
              <button onClick={() => { setSelectedService(null); setShowContactForm(true); setFormData(prev => ({ ...prev, servizio: selectedService.title })); }}
                className="clay-btn px-6 py-3 text-base font-bold !rounded-2xl text-[#3d3828] bg-[#fdfcf9] hover:scale-105 transition-transform">
                Richiedi info generale →
              </button>
              <button onClick={() => setSelectedService(null)}
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
          <motion.button onClick={() => { setShowContactForm(false); setFormStep(1); setFormData({ nome: '', email: '', telefono: '', servizio: '', descrizione: '' }); }}
            className="clay-btn px-6 py-3 mb-8 text-sm font-bold !rounded-xl text-[#3d3828] flex items-center gap-2"
            whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            ← Torna alla home
          </motion.button>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
            className="clay-card p-10 sm:p-14">
            <h2 className="text-3xl sm:text-4xl font-black text-[#2d2818] mb-1 tracking-tight">Scrivici</h2>
            <p className="text-[#6a6050] mb-8 text-sm">Ti rispondiamo entro 24 ore.</p>

            {/* Progress */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= formStep ? 'bg-[#7c6f5b]' : 'bg-[#e4dfd4]'}`} />
              ))}
            </div>

            {/* Step 1: Dati */}
            {formStep === 1 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                <h3 className="text-xl font-black text-[#2d2818]">I tuoi dati</h3>
                <input type="text" placeholder="Nome" value={formData.nome} onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]" />
                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]" />
                <input type="tel" placeholder="Telefono (opzionale)" value={formData.telefono} onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors text-[#2d2818]" />
              </motion.div>
            )}

            {/* Step 2: Servizio */}
            {formStep === 2 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
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
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
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
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-5">
                <h3 className="text-xl font-black text-[#2d2818]">Riepilogo</h3>
                <div className="p-5 rounded-2xl bg-[#fdfcf9] border-2 border-[#d4cfc5] space-y-2 text-sm">
                  <p><span className="font-bold text-[#8a856f]">Nome:</span> {formData.nome}</p>
                  <p><span className="font-bold text-[#8a856f]">Email:</span> {formData.email}</p>
                  {formData.telefono && <p><span className="font-bold text-[#8a856f]">Telefono:</span> {formData.telefono}</p>}
                  <p><span className="font-bold text-[#8a856f]">Servizio:</span> {formData.servizio}</p>
                  {formData.descrizione && (
                    <div className="border-t border-[#e4dfd4] pt-2 mt-2">
                      <p className="font-bold text-[#8a856f] mb-1">Descrizione:</p>
                      <p className="text-[#6a6050]">{formData.descrizione}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <button onClick={sendViaWhatsApp}
                    className="w-full p-4 rounded-2xl bg-[#25D366] text-white font-bold hover:bg-[#128C7E] transition-colors">
                    WhatsApp
                  </button>
                  <button onClick={sendViaEmail}
                    className="w-full p-4 rounded-2xl bg-white border-2 border-[#7c6f5b] text-[#3d3828] font-bold hover:bg-[#7c6f5b] hover:text-white transition-all">
                    Email
                  </button>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            {formStep >= 1 && formStep <= 3 && (
              <div className="flex gap-4 mt-8 pt-6 border-t border-[#e4dfd4]">
                <button onClick={() => setFormStep(p => p - 1)}
                  className="clay-btn px-6 py-4 font-bold text-[#6a6050]">
                  ← Indietro
                </button>
                <button onClick={() => setFormStep(p => p + 1)}
                  disabled={(formStep === 1 && (!formData.nome || !formData.email)) || (formStep === 2 && !formData.servizio) || (formStep === 3 && !formData.descrizione)}
                  className="flex-1 clay-btn px-6 py-4 font-bold !rounded-2xl text-[#3d3828] bg-[#fdfcf9] disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform">
                  {formStep === 3 ? 'Riepilogo →' : 'Avanti →'}
                </button>
              </div>
            )}
          </motion.div>
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
      
      {/* ── DIVINE FLOATING HEADER ── */}
      <motion.nav variants={itemVariants}
        className="fixed top-3 inset-x-3 sm:top-4 sm:inset-x-6 lg:inset-x-10 z-50"
        style={{ pointerEvents: 'none' }}
      >
        <div 
          ref={headerRef}
          className="max-w-6xl mx-auto flex items-center justify-between gap-3 py-2.5 sm:py-3 px-3 sm:px-5 rounded-2xl sm:rounded-[1.75rem] pointer-events-auto relative"
          style={{
            background: 'linear-gradient(145deg, rgba(248, 245, 239, 0.84) 0%, rgba(242, 237, 228, 0.78) 100%)',
            backdropFilter: 'blur(22px) saturate(170%)',
            WebkitBackdropFilter: 'blur(22px) saturate(170%)',
            boxShadow: `
              0 14px 34px rgba(60, 48, 34, 0.12),
              0 4px 10px rgba(60, 48, 34, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.72)
            `
          }}
        >
          {/* Orbiting text border */}
          <svg
            ref={orbitSvgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0, overflow: 'visible' }}
            overflow="visible"
            aria-hidden="true"
          >
            {headerPath && (
              <>
                <defs>
                  <path id="header-orbit-path" d={headerPath} fill="none" />
                </defs>
                {orbitText && (
                  <>
                    {/* Layer 1 */}
                    <text
                      fill={orbitColor}
                      style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '2px', opacity: 0.55, transition: 'fill 0.4s ease' }}
                    >
                      <textPath ref={orbitRef1} href="#header-orbit-path" startOffset="0%" textLength={pathLen} lengthAdjust="spacing">
                        {orbitText}
                      </textPath>
                    </text>
                    {/* Layer 2 — offset by -100% for seamless loop */}
                    <text
                      fill={orbitColor}
                      style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '2px', opacity: 0.55, transition: 'fill 0.4s ease' }}
                    >
                      <textPath ref={orbitRef2} href="#header-orbit-path" startOffset="-100%" textLength={pathLen} lengthAdjust="spacing">
                        {orbitText}
                      </textPath>
                    </text>
                  </>
                )}
              </>
            )}
          </svg>

          {/* Logo */}
          <div className="flex items-center gap-3 min-w-0 relative z-10">
            <div className="min-w-0">
              <h1 className="text-[18px] sm:text-[20px] font-black tracking-tight text-[#2f2a1d] leading-none truncate">Back Software</h1>
              <p className="text-[10px] sm:text-[11px] font-bold text-[#807865] opacity-75 tracking-[0.14em] uppercase truncate">Studio digitale su misura</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0 relative z-10">
            <div className="hidden md:flex items-center gap-1 rounded-full bg-[#f8f4ec]/70 p-1 border border-[#d8d0c1]/65">
              {[
                { label: 'Servizi', href: '#servizi' },
                { label: 'Progetti', href: '#progetti' },
                { label: 'Contatti', href: '#contatti' }
              ].map((item) => (
                <a 
                  key={item.label}
                  href={item.href}
                  className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-[#665d4c] hover:text-[#2f2a1d] rounded-full hover:bg-[#ebe3d7] transition-all"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mode Toggle */}
            <button 
              onClick={onSwitchToTerminal}
              className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold rounded-full text-[#746a57] hover:text-[#3d3528] bg-[#f8f4ec]/70 border border-[#dbd3c6]/70 hover:bg-[#f1e9dc] transition-all"
            >
              <span className="hidden sm:inline">Vista Retrò</span>
              <span className="sm:hidden">Retro</span>
            </button>
            
            {/* CTA */}
            <a 
              href="#contatti"
              className="px-4 sm:px-5 py-2 text-[11px] sm:text-sm font-bold rounded-full text-[#f6f2eb] transition-all shadow-[0_8px_20px_rgba(66,50,31,0.22)] hover:shadow-[0_10px_24px_rgba(66,50,31,0.28)]"
              style={{ background: 'linear-gradient(135deg, #3d3325 0%, #2b251a 100%)' }}
            >
              <span className="hidden sm:inline">Scrivici</span>
              <span className="sm:hidden">Contatti</span>
            </a>
          </div>
        </div>
      </motion.nav>


      {/* ── HERO ── */}
      <motion.section variants={itemVariants} className="modern-snap-section flex items-center relative px-6 sm:px-8 pt-24">
        {/* Floating Accents */}
        <div className="absolute -top-10 left-10 w-24 h-24 clay-pill opacity-10 animate-float pointer-events-none" />
        <div className="absolute top-40 right-10 w-32 h-32 clay-pill opacity-10 animate-float-delayed pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block px-5 py-2 mb-8 text-xs font-black tracking-[3px] uppercase clay-pill text-[#6a6050] border border-[#d4cfc5]/40">
            Design & Tecnologia
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.05] mb-8 tracking-tighter text-[#2d2818]">
            Software che funziona.<br/>
            <span className="text-[#8a7f6a] drop-shadow-sm">Fatto da persone reali.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl sm:text-2xl lg:text-3xl leading-relaxed max-w-3xl font-medium mb-12 text-[#6a6050]">
            Tecnologia che semplifica, non complica. Costruiamo il tuo progetto come se fosse il nostro.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-8 items-center">
            <a href="#contatti" className="clay-btn px-10 py-5 text-lg font-bold !rounded-2xl text-[#3d3828] bg-[#f8f6f2] hover:scale-105 active:scale-95 transition-transform">
              Parlaci del tuo progetto →
            </a>
          </motion.div>

          <motion.a
            href="#come-lavoriamo"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 px-4 py-2 rounded-full bg-[#f8f4ec]/80 border border-[#d9d1c2] text-[#615746]"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Scorri</span>
            <span className="text-base leading-none">↓</span>
          </motion.a>
        </div>
      </motion.section>

      {/* ── DARK SECTION: Why Us ── */}
      <motion.section id="come-lavoriamo" data-dark-section variants={itemVariants} className="modern-snap-section flex flex-col justify-center relative px-4 sm:px-6 lg:px-10 pt-24 pb-16 sm:py-20 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1a1810 0%, #1c1917 50%, #1a1810 100%)',
      }}>
        {/* Subtle dark texture overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }} />
        {/* Ambient warm glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] rounded-full opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(ellipse, #b8a88a 0%, transparent 70%)' }} />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none" style={{ background: 'radial-gradient(circle, #c4a76c 0%, transparent 60%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <motion.div variants={itemVariants} className="mb-10 sm:mb-12 space-y-4">
            <motion.h3 {...sectionTitleReveal} className={`${sectionTitleClass} text-[#f5f2ec]`}>
              Perché Back Software.
            </motion.h3>
            <motion.p {...sectionSubtitleReveal} className="text-base sm:text-lg leading-relaxed max-w-2xl font-medium" style={{ color: '#a09a88' }}>
              Non siamo solo sviluppatori. Siamo partner che capiscono il tuo business.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { num: '01', title: 'Ascolto', desc: 'Prima di scrivere codice, ascoltiamo. Capire il problema è più importante della soluzione tecnica.' },
              { num: '02', title: 'Chiarezza', desc: 'Niente gergo incomprensibile. Ti spieghiamo tutto in modo semplice, senza sorprese.' },
              { num: '03', title: 'Risultati', desc: 'Non vendiamo progetti, vendiamo soluzioni che funzionano davvero nel mondo reale.' }
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants}
                className="clay-card-dark p-6 sm:p-8 relative group transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                {/* Top accent line — glows on hover */}
                <div className="absolute top-0 left-8 right-8 h-px transition-all duration-500 group-hover:left-6 group-hover:right-6" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196, 180, 148, 0.25) 50%, transparent 100%)' }} />
                <div className="absolute top-0 left-12 right-12 h-px opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-500" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196, 180, 148, 0.4) 50%, transparent 100%)' }} />
                <div className="text-5xl sm:text-6xl font-black mb-4 tracking-tighter opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500 select-none" style={{ color: '#d4cabb', WebkitTextStroke: '1px rgba(212, 202, 187, 0.15)' }}>
                  {item.num}
                </div>
                <h4 className="text-xl sm:text-2xl font-black mb-3 tracking-tight text-[#ede8de] group-hover:text-[#f5f2ec] transition-colors duration-300">
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
      <motion.section id="servizi" variants={itemVariants} className="modern-snap-section flex flex-col justify-center px-4 sm:px-6 lg:px-10 pt-24 pb-16 sm:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div variants={itemVariants} className="mb-8 space-y-4">
            <motion.h3 {...sectionTitleReveal} className={`${sectionTitleClass} text-[#2d2818]`}>Cosa facciamo.</motion.h3>
            <motion.p {...sectionSubtitleReveal} className="text-base sm:text-lg text-[#6a6050] font-medium">
              Soluzioni concrete per problemi reali.
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <motion.div key={i} variants={itemVariants}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedService(s)}
                className={`clay-card py-4 sm:py-5 px-5 sm:px-6 flex items-center gap-4 sm:gap-5 cursor-pointer group min-h-[96px] sm:min-h-[108px] ${s.span}`}>
                <span className="w-11 h-11 flex items-center justify-center text-xl clay-pill bg-[#f5f2ec] shadow-sm group-hover:scale-110 transition-transform shrink-0">{s.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-black text-[#2d2818] group-hover:text-[#7c6f5b] transition-colors leading-tight">{s.title}</h4>
                  <p className="text-xs text-[#6a6050] opacity-80 line-clamp-2">{s.desc}</p>
                </div>
                <span className="w-8 h-8 flex items-center justify-center rounded-full text-sm transition-transform group-hover:rotate-45 bg-[#f5f2ec] border border-[#d4cfc5] text-[#3d3828] shrink-0" aria-hidden="true">
                  ↗
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── PROGETTI Section (DARK) ── */}
      <motion.section id="progetti" data-dark-section variants={itemVariants}
        className="modern-snap-section flex flex-col px-4 sm:px-6 lg:px-10 pt-24 pb-16 sm:pb-20 overflow-hidden"
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
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
            <div className="space-y-4">
              <motion.h3 className={`${sectionTitleClass} text-[#f5f2ec]`}>Galleria Progetti.</motion.h3>
              <p className="text-base sm:text-lg font-medium" style={{ color: '#a09a88' }}>{projects.length} Successi Reali</p>
            </div>

            {/* Category Selector - Raycast Style */}
            <div className="self-start lg:self-auto w-full lg:w-auto">
              <div className="w-full lg:w-auto overflow-x-auto pb-1">
                <div className="inline-flex min-w-max p-1.5 rounded-[2rem]" style={{
                  background: 'linear-gradient(145deg, rgba(43, 39, 32, 0.9) 0%, rgba(31, 29, 24, 0.95) 100%)',
                  border: '1px solid rgba(255, 248, 230, 0.08)',
                  borderTopColor: 'rgba(255, 248, 230, 0.12)',
                }}>
                  {['Tutti', ...modernCategories].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`relative px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold transition-all duration-200 rounded-[1.5rem] ${
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
        <div className="relative z-10 max-w-6xl mx-auto w-full flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedCategory === 'Tutti' ? (
              /* Compact cards for "Tutti" */
              <motion.div
                key="tutti"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4"
              >
                {groupedModernProjects.flatMap(g => g.projects).map((p, i) => (
                  <motion.div
                    key={p.n}
                    initial={{ opacity: 0, y: 32, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85, y: -12 }}
                    transition={{
                      opacity: { duration: 0.25 },
                      scale: { type: 'spring', stiffness: 350, damping: 20, mass: 1.0 },
                      y: { type: 'spring', stiffness: 350, damping: 20, mass: 1.0 },
                      delay: i * 0.035
                    }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => setSelectedService({ title: p.n, icon: '', details: p.desc })}
                    className="p-3 sm:p-4 cursor-pointer group overflow-hidden relative hover:scale-[1.02] transition-transform clay-card-dark flex flex-col justify-between min-h-[104px]"
                  >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-px transition-all duration-500 group-hover:left-4 group-hover:right-4" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196, 180, 148, 0.2) 50%, transparent 100%)' }} />
                    <div className="absolute top-0 right-0 p-2 opacity-[0.06] text-2xl sm:text-3xl font-black tracking-tighter transition-opacity duration-500 group-hover:opacity-[0.14] text-[#d4cabb] select-none">{p.year}</div>
                    <h4 className="text-sm font-black leading-tight transition-colors duration-300 text-[#ede8de] group-hover:text-[#f5f2ec] pr-8">{p.n}</h4>
                    <div className="mt-auto pt-2 flex justify-between items-end">
                      <span className="text-xs text-[#7a7568] font-bold">{p.year}</span>
                      <div className="w-6 h-6 flex items-center justify-center rounded-full text-xs transition-all duration-300 group-hover:rotate-45 clay-pill-dark text-[#b8ad98] group-hover:text-[#ede8de]">↗</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Full cards for specific categories — EXPAND animation */
              <motion.div
                key={selectedCategory}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-7"
              >
                {groupedModernProjects.find(g => g.name === selectedCategory)?.projects.map((p, i) => (
                  <motion.div
                    key={p.n}
                    initial={{ opacity: 0, y: 65, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85, y: -12 }}
                    transition={{
                      opacity: { duration: 0.3 },
                      scale: { type: 'spring', stiffness: 200, damping: 12, mass: 1.6 },
                      y: { type: 'spring', stiffness: 200, damping: 12, mass: 1.6 },
                      delay: i * 0.09
                    }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => setSelectedService({ title: p.n, icon: '', details: p.desc })}
                    className="p-5 sm:p-6 cursor-pointer group overflow-hidden relative hover:scale-[1.02] transition-transform clay-card-dark min-h-[196px]"
                  >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-8 right-8 h-px transition-all duration-500 group-hover:left-6 group-hover:right-6" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196, 180, 148, 0.25) 50%, transparent 100%)' }} />
                    <div className="absolute top-0 left-12 right-12 h-px opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-500" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196, 180, 148, 0.4) 50%, transparent 100%)' }} />
                    <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-[0.04] text-4xl sm:text-5xl font-black tracking-tighter transition-opacity duration-500 group-hover:opacity-[0.1] text-[#d4cabb] select-none">{p.year}</div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-base sm:text-lg font-black leading-tight max-w-[80%] transition-colors duration-300 text-[#ede8de] group-hover:text-[#f5f2ec]">{p.n}</h4>
                      <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all duration-300 group-hover:rotate-45 clay-pill-dark text-[#b8ad98] group-hover:text-[#ede8de]">↗</div>
                    </div>
                    <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: '#9a9484' }}>{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 3).map((t, ti) => (
                        <motion.span
                          key={t}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.09 + 0.25 + ti * 0.07, type: 'spring', stiffness: 300, damping: 15 }}
                          className="px-2 py-1 text-[10px] font-black uppercase tracking-wider clay-pill-dark text-[#8a7f6a]"
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
            <motion.h3 {...sectionTitleReveal} className={`${sectionTitleClass} text-[#2d2818]`}>Parliamo del tuo futuro.</motion.h3>
            <motion.p {...sectionSubtitleReveal} className="text-base sm:text-lg text-[#6a6050] font-medium max-w-2xl mx-auto">
              Parlaci del tuo progetto. Prima analizziamo, poi ti diciamo cosa serve davvero.
            </motion.p>
          </motion.div>
          <div className="clay-card p-6 sm:p-12 lg:p-20 text-center relative overflow-hidden bg-gradient-to-br from-[#f8f6f2] to-[#eeeae0] border-2 border-[#d4cfc5]/40">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 clay-pill opacity-10 blur-3xl" />
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <button onClick={() => setShowContactForm(true)} className="clay-btn px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-black !rounded-2xl text-[#3d3828] bg-[#fdfcf9] hover:scale-105 transition-transform flex items-center justify-center gap-2 sm:gap-3">
              Compila il form
            </button>
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
          className="absolute inset-x-4 sm:inset-x-6 lg:inset-x-10 bottom-0 z-20 pb-6 sm:pb-10"
          initial={false}
          animate={showFooter ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: showFooter ? 'auto' : 'none' }}
        >
          <div className="max-w-6xl mx-auto w-full">
          <footer className="clay-card p-7 sm:p-10 lg:p-12 border border-[#d4cfc5]/50 bg-gradient-to-br from-[#f7f4ee] via-[#f3efe7] to-[#ece5d8]">
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 sm:gap-10 lg:gap-14">
              <div className="flex flex-col items-start gap-4">
                <div className="relative w-36 h-36 sm:w-40 sm:h-40">
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
                <div>
                  <p className="text-sm text-[#6a6050] leading-relaxed">
                    Progettiamo e sviluppiamo soluzioni digitali con obiettivi chiari, tempi definiti e supporto continuo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-[0.2em] text-[#8a7f6a] mb-3">Servizi</h5>
                  <div className="space-y-2">
                    {footerServiceLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="block text-sm font-semibold text-[#4b4336] hover:text-[#2d2818] transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-black uppercase tracking-[0.2em] text-[#8a7f6a] mb-3">Azienda</h5>
                  <div className="space-y-2">
                    {footerCompanyLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="block text-sm font-semibold text-[#4b4336] hover:text-[#2d2818] transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-black uppercase tracking-[0.2em] text-[#8a7f6a] mb-3">Contatti</h5>
                  <div className="space-y-2 text-sm text-[#4b4336]">
                    <a href="mailto:info@backsoftware.it" className="block font-semibold hover:text-[#2d2818] transition-colors">
                      info@backsoftware.it
                    </a>
                    <a href="mailto:julian.rovera@pec.it" className="block font-semibold hover:text-[#2d2818] transition-colors">
                      julian.rovera@pec.it (PEC)
                    </a>
                    <a href="tel:+393513052627" className="block font-semibold hover:text-[#2d2818] transition-colors">
                      +39 351 305 2627
                    </a>
                    <p className="font-medium text-[#7a705d]">Ivrea (TO)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#b8ad98]/30 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-[#7a705d]">
              <p>© {new Date().getFullYear()} Back Software. Tutti i diritti riservati.</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <span>P.IVA: IT13227980011</span>
                <span aria-hidden="true">|</span>
                <span>C.F.: RVRJLN05E26B455T</span>
                <span aria-hidden="true">|</span>
                <span>Privacy Policy</span>
                <span aria-hidden="true">|</span>
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
