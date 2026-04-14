import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pages = { HOME: 'HOME', PROGETTI: 'PROGETTI', SERVIZI: 'SERVIZI', CONTATTI: 'CONTATTI' };

/* ===========================================================
   APP
=========================================================== */
export default function App() {
  const [bootPhase, setBootPhase] = useState('intro'); // intro, off, boot, awaiting_input, ready
  const [hasBootedBefore, setHasBootedBefore] = useState(false); // Track if boot happened once
  const [currentPage, setCurrentPage] = useState(pages.HOME);
  const [bootLog, setBootLog] = useState([]);
  const [screenAnim, setScreenAnim] = useState(''); // '', 'screen-on', 'screen-off'
  const [autoProceeding, setAutoProceeding] = useState(false);
  const [terminalColor, setTerminalColor] = useState('amber');
  const [showModernHint, setShowModernHint] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showGlitchOverlay, setShowGlitchOverlay] = useState(false);
  const [introText, setIntroText] = useState('');
  const [introIndex, setIntroIndex] = useState(0);

  const COLOR_PROFILES = useMemo(() => ({
    amber: { main: '#ffcc00', glow: 'rgba(255,204,0,0.35)', glowStrong: 'rgba(255,204,0,0.6)', beam: 'rgba(255,204,0,0.02)', beamStrong: 'rgba(255,204,0,0.05)' },
    green: { main: '#00ff66', glow: 'rgba(0,255,102,0.35)', glowStrong: 'rgba(0,255,102,0.6)', beam: 'rgba(0,255,102,0.02)', beamStrong: 'rgba(0,255,102,0.05)' },
    pink: { main: '#ff33dd', glow: 'rgba(255,51,221,0.35)', glowStrong: 'rgba(255,51,221,0.6)', beam: 'rgba(255,51,221,0.02)', beamStrong: 'rgba(255,51,221,0.05)' },
  }), []);

  // Intro sequence - typewriter effect for BACK SOFTWARE
  useEffect(() => {
    if (bootPhase === 'intro') {
      const text = 'BACK SOFTWARE';
      if (introIndex < text.length) {
        const timer = setTimeout(() => {
          setIntroText(prev => prev + text[introIndex]);
          setIntroIndex(prev => prev + 1);
        }, 150);
        return () => clearTimeout(timer);
      } else {
        // After typing completes, wait a moment then start boot
        const bootTimer = setTimeout(() => {
          setBootPhase('boot');
        }, 800);
        return () => clearTimeout(bootTimer);
      }
    }
  }, [bootPhase, introIndex]);

  // Boot sequence - only runs on first load
  useEffect(() => {
    // Skip boot if already booted before (user just toggles power)
    if (bootPhase === 'boot' && hasBootedBefore) {
      setScreenAnim('screen-on');
      setBootPhase('ready');
      return;
    }
    // Skip intro if already booted before
    if (bootPhase === 'intro' && hasBootedBefore) {
      setBootPhase('boot');
      return;
    }

    const seq = [
      { t: 'BACK SOFTWARE TERMINAL v4.01a', d: 300 },
      { t: 'Copyright (C) 2024-2026, BackSoftware Corp. Ivrea, IT', d: 400 },
      { t: '', d: 100 },
      { t: 'Caricamento creatività......  OK', d: 500 },
      { t: 'Accensione pixel............  OK', d: 400 },
      { t: 'Installazione passione......  OK', d: 450 },
      { t: 'Livelli di caffeina.........  ALTO ☕', d: 550 },
      { t: '', d: 100 },
    ];
    let timer;
    if (bootPhase === 'boot') {
      setScreenAnim('screen-on');
      let idx = 0;
      const run = () => {
        if (idx < seq.length) {
          const currentText = seq[idx].t;
          const currentDelay = seq[idx].d;
          setBootLog(prev => [...prev, currentText]);
          timer = setTimeout(run, currentDelay);
          idx++;
        } else {
          setHasBootedBefore(true);
          setBootPhase('awaiting_input');
        }
      };
      timer = setTimeout(run, 600);
    }
    return () => clearTimeout(timer);
  }, [bootPhase]);

  // Show modern mode hint after terminal is ready
  useEffect(() => {
    if (bootPhase === 'ready') {
      const hintTimer = setTimeout(() => {
        setShowModernHint(true);
      }, 2500);
      return () => clearTimeout(hintTimer);
    }
  }, [bootPhase]);

  // Handle Enter key for awaiting_input
  useEffect(() => {
    if (bootPhase !== 'awaiting_input') return;

    let finalTimer;
    const autoProceed = setTimeout(() => {
      setAutoProceeding(true);
      setBootLog([]);
      setBootLog(prev => [...prev, 'Nessuna interazione rilevata.']);
      finalTimer = setTimeout(() => {
        setBootLog(prev => [...prev, 'Avvio automatico in 3...']);
      }, 400);
      setTimeout(() => {
        setBootLog(prev => [...prev, '2...']);
      }, 800);
      setTimeout(() => {
        setBootLog(prev => [...prev, '1...']);
      }, 1200);
      setTimeout(() => {
        setBootPhase('ready');
      }, 1600);
    }, 5000);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setBootPhase('ready');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(autoProceed);
      clearTimeout(finalTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [bootPhase]);

  const [selectedService, setSelectedService] = useState(null); // Service pre-selected from Servizi page

  const togglePower = useCallback(() => {
    if (bootPhase === 'off') {
      setBootPhase('boot');
      setBootLog([]);
      setAutoProceeding(false);
      // Se ha già fatto il boot, salta l'animazione e va direto a ready
    } else {
      // Avvia la transizione epica CRT → Modern
      setIsTransitioning(true);
      setShowGlitchOverlay(true);
      setScreenAnim('crt-turn-off');
      
      // Dopo l'animazione CRT turn-off, mostra la vista moderna
      setTimeout(() => {
        setBootPhase('off');
        setScreenAnim('');
        setBootLog([]);
        setAutoProceeding(false);
        setSelectedService(null);
        setShowGlitchOverlay(false);
      }, 600);
      
      // Resetta lo stato di transizione dopo che tutto è finito
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1400);
    }
  }, [bootPhase]);

  const renderPage = useCallback(() => {
    switch (currentPage) {
      case pages.PROGETTI: return <Progetti setCurrentPage={setCurrentPage} />;
      case pages.SERVIZI: return <Servizi setCurrentPage={setCurrentPage} onSelectService={setSelectedService} />;
      case pages.CONTATTI: return <Contatti setCurrentPage={setCurrentPage} prefillService={selectedService} />;
      default: return <Home setCurrentPage={setCurrentPage} />;
    }
  }, [currentPage, selectedService]);

  const isOn = bootPhase !== 'off';
  const profile = COLOR_PROFILES[terminalColor];

  return (
    <div className="w-[100dvw] h-[100dvh] overflow-hidden select-none flex items-center justify-center p-0"
      style={{ 
        background: bootPhase === 'intro' ? '#fdfcf9' : '#0a0a0a',
        '--t-color': profile.main,
        '--t-color-glow': profile.glow,
        '--t-color-glow-strong': profile.glowStrong,
        '--t-color-beam': profile.beam,
        '--t-color-beam-strong': profile.beamStrong,
        color: profile.main, // Direct inheritance fallback
      }}>

      {/* ========== INTRO SCREEN ========== */}
      {bootPhase === 'intro' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-[#fdfcf9]"
        >
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-[#2d2818]">
              {introText}<span className="animate-pulse">|</span>
            </h1>
          </div>
        </motion.div>
      )}

      {/* ========== VINTAGE MONITOR ========== */}
      {bootPhase !== 'intro' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center">

        {/* MONITOR BODY - Ultra-realistic plastic casing */}
        <div className="w-full h-full relative flex flex-col overflow-hidden"
          style={{
            background: 'linear-gradient(175deg, #ddd9cb 0%, #d6d2c4 8%, #ccc8b8 20%, #c8c4b2 35%, #c0bca8 50%, #b8b4a0 65%, #b0ab95 80%, #a8a38d 92%, #9a9580 100%)',
            boxShadow: bootPhase === 'off'
              ? '0 0 0 1px rgba(0,0,0,0.15)'
              : `
              inset 0 2px 0 rgba(255,255,255,0.7),
              inset 0 -2px 3px rgba(0,0,0,0.15),
              inset 2px 0 0 rgba(255,255,255,0.4),
              inset -2px 0 0 rgba(0,0,0,0.08),
              inset 0 0 40px rgba(0,0,0,0.03),
              0 30px 100px -20px rgba(0,0,0,0.8),
              0 10px 40px -10px rgba(0,0,0,0.5),
              0 0 0 1px rgba(0,0,0,0.15)
            `,
          }}>
          {/* Subtle plastic grain texture overlay - only when terminal is ON */}
          {bootPhase !== 'off' && (
            <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '256px 256px',
              }} />
          )}

          {/* Edge highlights and reflections - only when terminal is ON */}
          {bootPhase !== 'off' && (
            <>
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <div className="absolute top-[2px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/15 to-transparent" />

              {/* Corner wear marks */}
              <div className="absolute top-0 left-0 w-20 h-20 opacity-10"
                style={{
                  background: 'radial-gradient(ellipse at 0% 0%, rgba(0,0,0,0.3), transparent 70%)',
                }} />
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10"
                style={{
                  background: 'radial-gradient(ellipse at 100% 0%, rgba(0,0,0,0.3), transparent 70%)',
                }} />
            </>
          )}

          {/* ── TOP BEZEL ── */}
          <div className={`flex items-center justify-center px-4 sm:px-8 shrink-0 relative ${bootPhase === 'off' ? 'h-5 sm:h-6' : 'h-6 sm:h-8'}`}>
            {/* Top edge highlight - only when ON */}
            {bootPhase !== 'off' && (
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            )}

            {/* Brand logo area */}
            <div className="flex items-center gap-3 relative">
              {/* Small LED indicator - only when ON */}
              {bootPhase !== 'off' && (
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isOn ? 'bg-[#33ff33] shadow-[0_0_6px_#33ff33,0_0_12px_rgba(51,255,51,0.4)]' : 'bg-[#5a5540] opacity-40'}`} />
              )}
              <span className={`font-black uppercase ${bootPhase === 'off' ? 'text-[8px] sm:text-[9px] tracking-[0.3em] opacity-30' : 'text-[10px] sm:text-[12px] tracking-[0.5em]'}`}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  color: '#3d3828',
                  textShadow: '0 1px 0 rgba(255,255,255,0.4), 0 -0.5px 0 rgba(0,0,0,0.1)',
                }}>
                BACK SOFTWARE
              </span>
            </div>
          </div>

          {/* ── SCREEN AREA ── */}
          <div className="flex-1 relative" style={{ minHeight: 0, marginLeft: bootPhase === 'off' ? 0 : '8px', marginRight: bootPhase === 'off' ? 0 : '8px' }}>
            
            {/* Glitch Overlay - appears during transition - INTENSE */}
            {showGlitchOverlay && (
              <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">
                {/* Flash effects */}
                <div className="crt-flash" />
                <div className="crt-flash-color" style={{ '--t-color': profile.main }} />
                {/* Animated glitch lines - many more for intensity */}
                <div className="glitch-line glitch-line-fast" style={{ top: '10%', animationDelay: '0.02s', height: '4px' }} />
                <div className="glitch-line" style={{ top: '25%', animationDelay: '0.05s', height: '3px' }} />
                <div className="glitch-line glitch-line-fast" style={{ top: '40%', animationDelay: '0.08s' }} />
                <div className="glitch-line" style={{ top: '55%', animationDelay: '0.12s', height: '5px' }} />
                <div className="glitch-line glitch-line-fast" style={{ top: '68%', animationDelay: '0.16s', height: '2px' }} />
                <div className="glitch-line" style={{ top: '80%', animationDelay: '0.20s', height: '3px' }} />
                <div className="glitch-line glitch-line-fast" style={{ top: '15%', animationDelay: '0.25s' }} />
                <div className="glitch-line" style={{ top: '92%', animationDelay: '0.30s', height: '4px' }} />
                <div className="glitch-line glitch-line-fast" style={{ top: '33%', animationDelay: '0.35s', height: '2px' }} />
                <div className="glitch-line" style={{ top: '48%', animationDelay: '0.40s', height: '6px' }} />
                {/* Horizontal noise bars */}
                <div className="absolute left-0 right-0 h-8 opacity-60"
                  style={{ 
                    top: '30%', 
                    background: `linear-gradient(90deg, transparent, ${profile.main}66, transparent)`,
                    animation: 'glitchLines 0.3s ease-out forwards',
                    animationDelay: '0.1s'
                  }} />
                <div className="absolute left-0 right-0 h-6 opacity-50"
                  style={{ 
                    top: '60%', 
                    background: `linear-gradient(90deg, transparent, ${profile.main}44, transparent)`,
                    animation: 'glitchLines 0.35s ease-out forwards',
                    animationDelay: '0.22s'
                  }} />
                {/* Digital noise overlay */}
                <div className="absolute inset-0 opacity-50"
                  style={{
                    background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${profile.main}33 2px, ${profile.main}33 4px)`,
                    animation: 'scanCollapse 0.4s ease-out forwards'
                  }} />
                {/* Vignette darkening */}
                <div className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)',
                    animation: 'scanCollapse 0.5s ease-out forwards'
                  }} />
              </div>
            )}
            
            {/* OFF STATE: claymorphism site — fills entire screen area, no bezel */}
            {bootPhase === 'off' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className={`absolute inset-0 overflow-y-auto modern-mode ${isTransitioning ? 'digital-emerge' : ''}`}
                style={{ background: '#f5f2ec' }}>
                <ModernSite togglePower={togglePower} currentPage={currentPage} setCurrentPage={setCurrentPage} />
              </motion.div>
            )}

            {/* Outer screen bezel — deep inset frame - only when terminal is ON */}
            {bootPhase !== 'off' && (
              <div className="absolute inset-0 overflow-hidden"
                style={{
                  background: 'linear-gradient(160deg, #4a4840 0%, #3d3b30 15%, #2e2c22 40%, #252318 60%, #1e1c14 80%, #1a1810 100%)',
                  boxShadow: `
                  inset 0 4px 12px rgba(0,0,0,0.95),
                  inset 0 -3px 6px rgba(0,0,0,0.6),
                  inset 4px 0 8px rgba(0,0,0,0.5),
                  inset -4px 0 8px rgba(0,0,0,0.5),
                  0 2px 0 rgba(255,255,255,0.12),
                  0 -1px 0 rgba(0,0,0,0.4)
                `,
                }}>
                {/* Bevel edge highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-white/15 via-transparent to-transparent" />

                {/* Inner bezel ring — simulates rubber gasket */}
                <div className="absolute inset-[3px] sm:inset-[5px] lg:inset-[6px] overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #1a1a18 0%, #0d0d0c 100%)',
                    boxShadow: `
                    inset 0 0 6px rgba(0,0,0,0.9),
                    inset 0 1px 0 rgba(255,255,255,0.05),
                    0 0 1px rgba(255,255,255,0.08)
                  `,
                  }}>
                  {/* Screen glass */}
                  <div className={`w-full h-full overflow-hidden relative bg-[#070b07] ${isOn ? 'crt-screen' : ''}`} style={{
                    boxShadow: 'inset 0 0 120px rgba(0,0,0,0.98), inset 0 0 40px rgba(0,12,0,0.6)',
                  }}>

                  {/* Vignette - Only visible when terminal is ON */}
                  {isOn && <div className="absolute inset-0 z-10 crt-vignette" />}

                  {/* Glare reflection — Only visible when terminal is ON */}
                  {isOn && <div className="absolute inset-0 z-10 pointer-events-none" style={{
                    background: 'linear-gradient(125deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 20%, transparent 40%, transparent 80%, rgba(255,255,255,0.01) 100%)',
                  }} />}

                  {/* Screen content wrapper with on/off animation */}
                  <div className={`absolute inset-0 ${screenAnim}`}>

                    {/* BOOT + READY */}
                    {(bootPhase === 'boot' || bootPhase === 'awaiting_input' || bootPhase === 'ready') && (
                      <div className="absolute inset-0 p-4 sm:p-8 lg:p-12 text-glow flex flex-col z-[1]" style={{ color: 'var(--t-color)' }}>
                        {(bootPhase === 'boot' || bootPhase === 'awaiting_input') ? (
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="space-y-1">
                              {bootLog.map((log, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                                  className={log.startsWith('>') ? 'text-[var(--t-color)] text-glow-strong font-bold text-xl sm:text-2xl lg:text-3xl mt-4' : 'text-[var(--t-color)] opacity-70 text-lg sm:text-xl lg:text-2xl'}
                                >
                                  {log}
                                </motion.div>
                              ))}
                              {bootPhase === 'awaiting_input' && !autoProceeding && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                                  className="mt-8 pt-4"
                                >
                                  <motion.div
                                    className="text-[var(--t-color)] text-glow-strong font-bold text-2xl sm:text-3xl lg:text-4xl cursor-pointer hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all inline-block px-6 py-3 border-2 border-transparent hover:border-[var(--t-color)] uppercase"
                                    onClick={() => setBootPhase('ready')}
                                    animate={{ scale: [1, 1.02, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    [ PREMI INVIO PER ENTRARE ]
                                  </motion.div>
                                </motion.div>
                              )}
                              {(bootPhase === 'boot' || autoProceeding) && <motion.div className="w-4 h-6 sm:h-8 lg:h-10 bg-[var(--t-color)] inline-block mt-2" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.75, repeat: Infinity }} />}
                            </div>
                          </div>
                        ) : (
                          <AnimatePresence mode="wait">
                            <motion.div key={currentPage} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.2 }} className="flex-1 flex flex-col h-full min-h-0">
                              {renderPage()}
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* ── BOTTOM BEZEL — hidden in modern view ── */}
          {bootPhase !== 'off' && (
          <div className="h-12 sm:h-[56px] shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4 relative">
            {/* Top inner lip — slight ridge where screen meets bezel */}
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.12) 10%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.12) 90%, transparent)',
              }} />
            {/* Subtle highlight below top ridge */}
            <div className="absolute top-[3px] left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.08) 50%, transparent)',
              }} />
            {/* Bottom edge — floor shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.25) 50%, transparent)',
              }} />
            {/* Bottom inner highlight */}
            <div className="absolute bottom-[2px] left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, transparent)',
              }} />

            {/* ── LEFT: screw + speaker grille ── */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Screw />
              {/* Speaker grille — realistic horizontal slotted pattern */}
              <div className="hidden sm:block relative p-[3px] pr-2"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.03))',
                  borderRadius: '2px',
                  boxShadow: `
                    inset 0 1px 3px rgba(0,0,0,0.35),
                    inset 0 -0.5px 0 rgba(255,255,255,0.1),
                    0 0.5px 0 rgba(255,255,255,0.15)
                  `,
                }}>
                {/* Horizontal slots */}
                <div className="flex flex-col gap-[2px]">
                  {[...Array(5)].map((_, row) => (
                    <div key={row} className="h-[1.5px] rounded-full"
                      style={{
                        width: `${16 + Math.random() * 6}px`,
                        background: 'linear-gradient(90deg, #4a4535, #5a5540, #4a4535)',
                        boxShadow: 'inset 0 0.5px 1px rgba(0,0,0,0.6)',
                      }} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── CENTER: model badge ── */}
            <div className="hidden lg:flex items-center relative px-3 py-1"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))',
                borderRadius: '2px',
                boxShadow: 'inset 0 0.5px 1px rgba(0,0,0,0.15)',
              }}>
              <span className="text-[7px] sm:text-[8px] font-black tracking-[0.35em] text-[#5a5540] uppercase"
                style={{ textShadow: '0 0.5px 0 rgba(255,255,255,0.25)' }}>
                BS-1984 · CRT TERMINAL
              </span>
            </div>

            {/* ── RIGHT: Color LEDs + Power rocker ── */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Terminal Color LED buttons */}
              <div className="hidden md:flex items-center gap-2.5">
                <span className="text-[8px] sm:text-[9px] font-black tracking-[0.2em] text-[#5a5540] uppercase"
                  style={{ textShadow: '0 0.5px 0 rgba(255,255,255,0.2)' }}>CH</span>
                <div className="flex gap-2">
                  {[
                    { id: 'amber', color: '#ffb000', label: 'A' },
                    { id: 'green', color: '#33ff33', label: 'G' },
                    { id: 'pink', color: '#ff00cc', label: 'P' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setTerminalColor(preset.id)}
                      className="relative w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 active:scale-95 group"
                      title={preset.label}>
                      {/* LED housing — recessed circular well */}
                      <div className="absolute inset-0 rounded-full"
                        style={{
                          background: 'linear-gradient(145deg, #9a9580, #7a7560)',
                          boxShadow: `
                            inset 0 1px 3px rgba(0,0,0,0.6),
                            inset 0 -0.5px 0 rgba(255,255,255,0.15),
                            0 0.5px 0 rgba(255,255,255,0.2)
                          `,
                        }} />
                      {/* LED lens */}
                      <div className={`absolute inset-[2px] rounded-full transition-all duration-300 ${terminalColor === preset.id ? 'scale-100' : 'scale-[0.85] opacity-40'}`}
                        style={{
                          background: `radial-gradient(circle at 38% 32%, ${preset.color}, rgba(0,0,0,0.7))`,
                          boxShadow: terminalColor === preset.id
                            ? `0 0 6px ${preset.color}80, 0 0 12px ${preset.color}30, inset 0 1px 2px rgba(255,255,255,0.35)`
                            : 'inset 0 1px 2px rgba(0,0,0,0.5)',
                        }} />
                      {/* Glass highlight dot */}
                      <div className="absolute top-[2px] left-[2px] w-[2px] h-[2px] rounded-full bg-white/25" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Power rocker + labels */}
              <div className="flex items-center gap-2.5 relative">
                <div className="hidden sm:flex flex-col items-end leading-none">
                  <span className="text-[8px] sm:text-[9px] font-black text-[#5a5540] tracking-wider uppercase"
                    style={{ textShadow: '0 0.5px 0 rgba(255,255,255,0.25)' }}>Modern Mode</span>
                </div>

                {/* Vintage popup hint */}
                <AnimatePresence>
                  {showModernHint && bootPhase !== 'off' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute bottom-full mb-3 left-auto right-0 z-50"
                      style={{ transform: 'translateX(calc(50% - 21px))' }}
                    >
                      <div className="relative bg-[#1a1814] border-2 border-[#ffb000] rounded-lg px-4 py-3 shadow-lg"
                        style={{
                          boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,176,0,0.3), inset 0 0 20px rgba(255,176,0,0.05), 0 0 15px rgba(255,176,0,0.15)',
                          minWidth: '200px'
                        }}>
                        {/* Arrow pointing down */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1a1814] border-r-2 border-b-2 border-[#ffb000] rotate-45" />
                        {/* CRT scanline effect */}
                        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                          <div className="w-full h-full opacity-20"
                            style={{
                              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,176,0,0.1) 2px, rgba(255,176,0,0.1) 4px)'
                            }} />
                        </div>
                        {/* Content */}
                        <div className="relative">
                          <div className="text-[#ffb000] text-[11px] font-bold uppercase tracking-wider mb-2 opacity-80">► Suggerimento</div>
                          <div className="text-[#ffb000] text-[13px] font-bold leading-snug">
                            Clicca qui per la<br/>modalità pulita ✨
                          </div>
                        </div>
                        {/* Close button */}
                        <button
                          onClick={() => setShowModernHint(false)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ffb000] text-[#1a1814] rounded-full text-[10px] font-black flex items-center justify-center hover:bg-[#ffc533] transition-colors shadow-md"
                        >
                          ×
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Rocker switch */}
                <button onClick={togglePower}
                  className="relative transition-all duration-150 active:translate-y-[1px] group"
                  style={{
                    width: '42px',
                    height: '24px',
                  }}>
                  {/* Outer housing — recessed frame */}
                  <div className="absolute inset-0 rounded-[3px]"
                    style={{
                      background: 'linear-gradient(180deg, #b0ab95, #9a9580)',
                      boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.2),
                        inset 0 -1px 2px rgba(0,0,0,0.15),
                        0 1px 0 rgba(255,255,255,0.3),
                        0 0 0 0.5px rgba(0,0,0,0.12)
                      `,
                    }} />
                  {/* Rocker paddle */}
                  <div className="absolute inset-[2px] rounded-[2px] overflow-hidden"
                    style={{
                      background: isOn
                        ? 'linear-gradient(180deg, #a8a395 0%, #95908a 50%, #8a8580 100%)'
                        : 'linear-gradient(180deg, #95908a 0%, #8a8580 50%, #7a7570 100%)',
                      boxShadow: isOn
                        ? 'inset 0 2px 4px rgba(0,0,0,0.3), 0 0.5px 0 rgba(255,255,255,0.25)'
                        : 'inset 0 -1px 3px rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.3)',
                    }}>
                    {/* ON/OFF micro labels */}
                    <div className="absolute top-[2px] left-0 right-0 text-center">
                      <span className={`text-[5px] font-black tracking-wider ${isOn ? 'text-[#2d2818]' : 'text-[#8a856f] opacity-40'}`}>I</span>
                    </div>
                    <div className="absolute bottom-[2px] left-0 right-0 text-center">
                      <span className={`text-[5px] font-black tracking-wider ${!isOn ? 'text-[#2d2818]' : 'text-[#8a856f] opacity-40'}`}>O</span>
                    </div>
                    {/* Center ridge */}
                    <div className="absolute top-1/2 left-1 right-1 h-[0.5px] bg-black/15 -translate-y-1/2" />
                  </div>
                </button>
              </div>
            </div>
            <Screw />
          </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

/* ===========================================================
   SCREW COMPONENT — Ultra-realistic Phillips-head screw
=========================================================== */
function Screw() {
  return (
    <div className="relative shrink-0" style={{ width: '18px', height: '18px' }}>
      {/* Outer ring - screw head */}
      <div className="absolute inset-0 rounded-full" style={{
        background: 'conic-gradient(from 0deg, #c8c4b4, #ddd9cb, #c8c4b4, #b0ab95, #c8c4b4, #ddd9cb, #c8c4b4)',
        boxShadow: `
          inset 0 1.5px 3px rgba(0,0,0,0.35),
          0 1px 1.5px rgba(255,255,255,0.4),
          0 0 0 0.5px rgba(0,0,0,0.15),
          0 2px 4px rgba(0,0,0,0.2)
        `,
      }}>
        {/* Inner recessed area */}
        <div className="absolute inset-[2.5px] rounded-full" style={{
          background: 'conic-gradient(from 45deg, #a8a490, #c0bca8, #a8a490, #959080, #a8a490)',
          boxShadow: 'inset 0 0.5px 1.5px rgba(0,0,0,0.3), 0 0 0.5px rgba(255,255,255,0.15)',
        }}>
          {/* Phillips cross slot - horizontal */}
          <div className="absolute top-1/2 left-[2px] right-[2px] h-[1.5px] -translate-y-1/2"
            style={{
              background: 'linear-gradient(90deg, transparent 5%, #4a4535 20%, #3a3525 50%, #4a4535 80%, transparent 95%)',
              boxShadow: 'inset 0 0.5px 1px rgba(0,0,0,0.5)',
            }} />
          {/* Phillips cross slot - vertical */}
          <div className="absolute left-1/2 top-[2px] bottom-[2px] w-[1.5px] -translate-x-1/2"
            style={{
              background: 'linear-gradient(180deg, transparent 5%, #4a4535 20%, #3a3525 50%, #4a4535 80%, transparent 95%)',
              boxShadow: 'inset 0.5px 0 1px rgba(0,0,0,0.5)',
            }} />
        </div>
      </div>
      {/* Highlight dot */}
      <div className="absolute top-[4px] left-[4px] w-[3px] h-[3px] rounded-full bg-white/20" />
    </div>
  );
}

/* ===========================================================
   TERMINAL REUSABLE COMPONENTS
=========================================================== */
function MenuBox({ title, options, onSelect }) {
  const [hoverIdx, setHoverIdx] = useState(-1);
  return (
    <div className="border-2 border-[var(--t-color)] opacity-70 p-3 sm:p-6 lg:p-8 flex-1 flex flex-col justify-center">
      <div className="border-b-2 border-[var(--t-color)] opacity-70 pb-2 mb-3 sm:mb-4 font-bold uppercase tracking-[0.15em] text-[var(--t-color)] text-xs sm:text-lg lg:text-xl animate-gentle-pulse">{title}</div>
      <div className="space-y-2 sm:space-y-5">
        {options.map((opt, i) => (
          <motion.div 
            key={i} 
            className="flex items-center cursor-pointer group"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(-1)}
            onClick={() => onSelect(opt.action)}
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.span 
              className="w-6 sm:w-8 text-[var(--t-color)] text-lg sm:text-2xl"
              animate={{ rotate: hoverIdx === i ? [0, -10, 10, 0] : 0 }}
              transition={{ duration: 0.4 }}
            >
              {hoverIdx === i ? '▸' : '›'}
            </motion.span>
            <motion.span 
              className={`px-2 sm:px-3 py-1 text-sm sm:text-xl lg:text-2xl transition-all duration-200 inline-block ${hoverIdx === i ? 'bg-[var(--t-color)] text-[#080c08] font-bold scale-105 ml-1 sm:ml-2' : 'text-[var(--t-color)]'}`}
              animate={hoverIdx === i ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              [{i + 1}] {opt.label}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <div className="mt-auto pt-2 sm:pt-3">
      <motion.span
        onClick={onClick}
        className="cursor-pointer text-xs sm:text-sm lg:text-lg font-bold text-[var(--t-color)] opacity-70 hover:opacity-100 transition-opacity inline-block"
        whileHover={{ x: -5, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ◂ TORNA AL MENU
      </motion.span>
    </div>
  );
}

/* ===========================================================
   TERMINAL PAGES (ENLARGED TYPOGRAPHY)
=========================================================== */
function Home({ setCurrentPage }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 flex-1 min-h-0">
        <div className="flex-1 flex flex-col justify-center pr-0 lg:pr-8 lg:border-r-2 border-[var(--t-color)] opacity-70 shrink-0">
          <pre className="text-[6px] sm:text-[9px] md:text-[11px] lg:text-[14px] font-bold leading-[1.2] mb-4 sm:mb-6 select-none text-[var(--t-color)] text-glow-strong whitespace-pre overflow-x-hidden">
{`██████╗  █████╗  ██████╗██╗  ██╗    ███████╗ ██████╗ ███████╗████████╗
██╔══██╗██╔══██╗██╔════╝██║ ██╔╝    ██╔════╝██╔═══██╗██╔════╝╚══██╔══╝
██████╔╝███████║██║     █████╔╝     ███████╗██║   ██║█████╗     ██║
██╔══██╗██╔══██║██║     ██╔═██╗     ╚════██║██║   ██║██╔══╝     ██║
██████╔╝██║  ██║╚██████╗██║  ██╗    ███████║╚██████╔╝██║        ██║
╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝ ╚═╝        ╚═╝`}
          </pre>
          <div className="text-base sm:text-xl lg:text-2xl border-l-4 border-[var(--t-color)] opacity-70 pl-3 sm:pl-5 space-y-3 sm:space-y-4">
            <p className="text-[var(--t-color)] leading-relaxed font-bold">Costruiamo il tuo software<br/>come se fosse il nostro.</p>
            <p className="text-[var(--t-color)] opacity-70 leading-relaxed text-sm sm:text-base lg:text-xl font-medium">Tecnologia che semplifica, non complica.<br/>Parlaci del tuo progetto.</p>
          </div>
        </div>
        <div className="flex-1 flex mt-4 lg:mt-0">
          <MenuBox title="COSA VUOI FARE?" options={[
            { label: 'I NOSTRI LAVORI', action: pages.PROGETTI },
            { label: 'I NOSTRI SERVIZI', action: pages.SERVIZI },
            { label: 'CONTATTACI', action: pages.CONTATTI },
          ]} onSelect={setCurrentPage} />
        </div>
      </div>
      <div className="pt-2 sm:pt-3 mt-auto flex justify-between text-xs sm:text-sm lg:text-lg font-bold text-[var(--t-color)] opacity-70 border-t-2 border-[var(--t-color)] opacity-70 shrink-0 uppercase tracking-widest">
        <span>⚡ Operativo</span>
        <span>Risposta {'<'} 24h</span>
      </div>
    </div>
  );
}

function Progetti({ setCurrentPage }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    { 
      n: 'Sistema Gestione Cantina', 
      t: 'Gestionale', 
      y: '2025',
      desc: 'Sistema di gestione vitivinicolo completo per cantina con vendita online di esperienze, gestione coupon regali e spedizioni internazionali.'
    },
    { 
      n: 'CRM Magazzino', 
      t: 'Gestionale', 
      y: '2024',
      desc: 'Sistema gestionale su misura per gestione magazzino, stoccaggio e spedizioni con ottimizzazione logistica avanzata.'
    },
    { 
      n: 'BPres Presenze', 
      t: 'Gestionale', 
      y: '2024',
      desc: 'Sistema presenze completo per gestire ingressi, uscite, pause. Calcolo permessi automatici e richiesta ferie/malattia con approvazione via email.'
    },
    { 
      n: 'Sistema Autodemolizioni', 
      t: 'CRM', 
      y: '2024',
      desc: 'CRM completo per pratiche bonifica, registrazione portali statali, API Rentri, vendita componenti, gestione serbatoi e controllo codici CER.'
    },
    { 
      n: '7Lakes Aparthotel', 
      t: 'Sito Web', 
      y: '2024',
      desc: 'Sito web con shooting drone per tour virtuale, collegamento Octorate per booking engine centralizzato con Booking.com e Airbnb.'
    },
    { 
      n: 'Salute a Domicilio', 
      t: 'Sito Web', 
      y: '2024',
      desc: 'Sito web, analisi marketing intelligence con Sunlight Marketing, landing page pubblicitarie e campagne Google Search + retargeting social.'
    },
    { 
      n: 'CRM Task e Progetti', 
      t: 'Gestionale', 
      y: '2024',
      desc: 'Sistema gestionale per progetti, task e andamento lavorazioni aziendali. Gestione clienti e collaboratori con integrazione AI tramite API.'
    },
    { 
      n: 'My Place Malpensa', 
      t: 'Sito Web', 
      y: '2024',
      desc: 'Sito web multilingua con collegamento a Octorate per booking engine centralizzato e gestione prenotazioni automatizzata.'
    },
    { 
      n: 'Marazzato Moto', 
      t: 'Sito Web', 
      y: '2024',
      desc: 'Sito web vetrina con caricamento dinamico prodotti da pannello dedicato e vetrina online per vendita moto e accessori.'
    },
    { 
      n: 'Casa Famiglia Villa Katia', 
      t: 'Marketing', 
      y: '2024',
      desc: 'Soluzione completa: sito web, landing page e sponsorizzazioni Meta Ads con focus su Facebook e target di riferimento specifico.'
    },
    { 
      n: 'Casa Famiglia Quercia', 
      t: 'Marketing', 
      y: '2024',
      desc: 'Sito web, landing page e campagne sponsorizzate Meta Ads per casa famiglia con strategia marketing mirata.'
    },
    { 
      n: 'Casa Famiglia Gramsci', 
      t: 'Marketing', 
      y: '2024',
      desc: 'Progetto completo con sito web istituzionale, landing page dedicate e campagne pubblicitarie social mirate.'
    },
    { 
      n: 'Casa Famiglia Benissimo', 
      t: 'Marketing', 
      y: '2024',
      desc: 'Sviluppo sito web, landing page ottimizzate e strategia marketing digitale con campagne Facebook Ads mirate.'
    },
    { 
      n: 'Casa Alloggio Sociale Anziani', 
      t: 'Marketing', 
      y: '2024',
      desc: 'Casa alloggio sociale per anziani ad Abbiategrasso: sito web istituzionale, landing page e campagne marketing dedicate.'
    },
  ];
  if (selectedProject) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b-2 border-double border-[var(--t-color)] opacity-70 mb-4 pb-2 text-xl sm:text-3xl font-bold shrink-0 tracking-wider flex justify-between items-center uppercase">
          <span>/PROGETTO — {selectedProject.n}</span>
          <motion.button
            onClick={() => setSelectedProject(null)}
            className="text-sm sm:text-lg hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-3 py-1 border border-[var(--t-color)]"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            ◂ INDIETRO
          </motion.button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="text-2xl sm:text-3xl font-bold text-[var(--t-color)] text-glow-strong mb-4 uppercase">
            {selectedProject.n}
          </div>
          <div className="flex gap-4 mb-4 text-base sm:text-lg text-[var(--t-color)] opacity-70 uppercase">
            <span className="border border-[var(--t-color)] px-3 py-1">{selectedProject.t}</span>
            <span className="border border-[var(--t-color)] px-3 py-1">{selectedProject.y}</span>
          </div>
          <div className="p-4 sm:p-6 border-2 border-[var(--t-color)] opacity-70 flex-1 overflow-y-auto">
            <p className="text-base sm:text-xl text-[var(--t-color)] leading-relaxed normal-case">
              {selectedProject.desc}
            </p>
          </div>
          <motion.button
            onClick={() => { setCurrentPage(pages.CONTATTI); }}
            className="mt-4 text-[var(--t-color)] text-glow-strong font-bold text-lg sm:text-xl cursor-pointer hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-6 py-4 border-2 border-[var(--t-color)] uppercase"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            ▸ HO UN PROGETTO SIMILE
          </motion.button>
        </motion.div>
        <BackButton onClick={() => setCurrentPage(pages.HOME)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full uppercase">
      <div className="border-b-2 border-double border-[var(--t-color)] opacity-70 mb-3 sm:mb-4 pb-2 text-lg sm:text-3xl font-bold shrink-0 tracking-wider">
        /PROGETTI — {projects.length}
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 pr-4">
        {/* Table header */}
        <div className="flex border-b-2 border-[var(--t-color)] opacity-70 pb-2 mb-2 sm:mb-3 text-[var(--t-color)] opacity-70 text-sm sm:text-xl font-bold tracking-widest">
          <div className="w-[50%]">PROGETTO</div>
          <div className="w-[30%]">TIPO</div>
          <div className="w-[20%] text-right">ANNO</div>
        </div>
        {/* Table body */}
        <div className="space-y-1">
          {projects.map((p, i) => (
            <motion.div 
              key={i} 
              className="flex hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all duration-150 py-2 sm:py-2 px-2 sm:px-1 text-sm sm:text-2xl font-medium group cursor-pointer"
              onClick={() => setSelectedProject(p)}
              whileHover={{ x: 4 }} whileTap={{ scale: 0.99 }}
            >
              <div className="w-[50%] truncate font-bold text-sm sm:text-base">{p.n}</div>
              <div className="w-[30%] truncate opacity-80 group-hover:opacity-100 text-xs sm:text-sm">{p.t}</div>
              <div className="w-[20%] text-right opacity-60 group-hover:opacity-100 text-xs sm:text-sm">{p.y}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="text-[var(--t-color)] opacity-70 text-sm sm:text-lg mt-4 font-bold border-l-4 border-[var(--t-color)] opacity-70 pl-3">
        * Clicca un progetto per i dettagli
      </div>
      <BackButton onClick={() => setCurrentPage(pages.HOME)} />
    </div>
  );
}

function Servizi({ setCurrentPage, onSelectService }) {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const servizi = [
    { 
      id: '01', 
      title: 'Case Famiglia', 
      subtitle: 'Pacchetti completi',
      items: ['6 Mesi', '3 Mesi', 'Campagna Spot'],
      packages: [
        { name: 'Pacchetto Completo 6 Mesi', desc: 'Soluzione completa per 6 mesi: sito, social, campagne e prenotazioni' },
        { name: 'Pacchetto Completo 3 Mesi', desc: 'Soluzione completa per 3 mesi: sito, social, campagne e prenotazioni' },
        { name: 'Pacchetto Campagna Spot 6 Mesi', desc: 'Campagna spot per 6 mesi con gestione completa' }
      ],
      details: 'Servizio dedicato alle strutture che ospitano famiglie in difficoltà. Gestiamo tutto: sito web, social media, campagne pubblicitarie mirate e sistema di prenotazioni. Pacchetti flessibili da 3 o 6 mesi.' 
    },
    { 
      id: '02', 
      title: 'Siti e Landing', 
      subtitle: 'Web professionali',
      items: ['Sito 5-10 Pagine', 'Landing Page'],
      packages: [
        { name: 'Sito Web (5-10 pagine)', desc: 'Sito web completo con 5-10 pagine, responsive e ottimizzato' },
        { name: 'Landing Page (1 pagina)', desc: 'Landing page ottimizzata per conversioni e lead generation' }
      ],
      details: 'Siti web professionali e landing page ottimizzate per le conversioni. Dal sito aziendale completo alla landing page mirata, tutto responsive e pronto per Google.' 
    },
    { 
      id: '03', 
      title: 'Marketing & ADS', 
      subtitle: 'Campagne mirate',
      items: ['Analisi Marketing', 'Meta Ads', 'Google Ads'],
      packages: [
        { name: 'Analisi Marketing ADS', desc: 'Analisi completa per campagne pubblicitarie efficaci' },
        { name: 'Meta Ads / Altri Canali', desc: 'Campagne su Meta e altri canali social' },
        { name: 'Google Ads', desc: 'Campagne pubblicitarie su Google Search e Display' }
      ],
      details: 'Strategie di marketing digitale e campagne pubblicitarie mirate. Analisi, pianificazione e gestione completa delle tue campagne su Meta e Google.' 
    },
    { 
      id: '04', 
      title: 'Foto & Video', 
      subtitle: 'Contenuti professionali',
      items: ['Fotografico', 'Video Drone', 'Video Staff'],
      packages: [
        { name: 'Servizio Fotografico', desc: 'Servizi fotografici professionali per aziende e prodotti' },
        { name: 'Video - Drone', desc: 'Riprese video aeree con drone professionale' },
        { name: 'Video - Staff', desc: 'Riprese video con staff professionale' }
      ],
      details: 'Servizi professionali di fotografia e video per la tua azienda. Shooting fotografici, riprese con drone, video corporate e contenuti per i social.' 
    },
    { 
      id: '05', 
      title: 'Grafica & Copy', 
      subtitle: 'Design e testi',
      items: ['Grafica', 'Copywriting'],
      packages: [
        { name: 'Grafica', desc: 'Servizi di design grafico, visual e brand identity' },
        { name: 'Copywriting', desc: 'Servizi di scrittura, comunicazione e testi SEO' }
      ],
      details: 'Servizi di design grafico e copywriting per la tua comunicazione. Loghi, identità visiva, materiali grafici e testi che parlano al tuo pubblico.' 
    },
    { 
      id: '06', 
      title: 'Digitali Avanzati', 
      subtitle: 'Soluzioni custom',
      items: ['Gestionali', 'Applicazioni', 'API'],
      packages: [
        { name: 'Gestionali', desc: 'Sistemi gestionali personalizzati per la tua azienda' },
        { name: 'Applicazioni', desc: 'Applicazioni web e mobile su misura' },
        { name: 'Collegamento API', desc: 'Integrazioni e collegamenti API con altri servizi' }
      ],
      details: 'Soluzioni digitali avanzate per la gestione aziendale. Software su misura, gestionali, applicazioni web/mobile e integrazioni API.' 
    },
  ];

  if (selectedService) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b-2 border-double border-[var(--t-color)] opacity-70 mb-3 sm:mb-4 pb-2 text-lg sm:text-3xl font-bold shrink-0 tracking-wider flex justify-between items-center">
          <span className="text-sm sm:text-base lg:text-xl">{selectedService.id} — {selectedService.title}</span>
          <motion.button
            onClick={() => { setSelectedService(null); setSelectedPackage(null); }}
            className="text-xs sm:text-sm lg:text-lg hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-2 sm:px-3 py-1 border border-[var(--t-color)]"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            ◂ INDIETRO
          </motion.button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {!selectedPackage ? (
            <>
              <div className="text-lg sm:text-2xl font-bold text-[var(--t-color)] text-glow-strong mb-3 sm:mb-4">
                {selectedService.subtitle}
              </div>
              <div className="p-3 sm:p-6 border-2 border-[var(--t-color)] opacity-70 mb-3 sm:mb-4">
                <p className="text-sm sm:text-base lg:text-lg text-[var(--t-color)] leading-relaxed">
                  {selectedService.details}
                </p>
              </div>
              <div className="text-xs sm:text-base lg:text-lg text-[var(--t-color)] opacity-70 uppercase font-bold mb-2 sm:mb-3">
                Scegli un pacchetto:
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {selectedService.packages.map((pkg, idx) => (
                  <motion.div
                    key={idx}
                    className="border-2 border-[var(--t-color)] opacity-70 p-3 sm:p-4 cursor-pointer hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all group"
                    onClick={() => setSelectedPackage(pkg)}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base lg:text-lg font-bold">{pkg.name}</span>
                      <span className="text-[10px] sm:text-xs opacity-0 group-hover:opacity-100 transition-opacity">▸ Seleziona</span>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm opacity-70 mt-1 group-hover:opacity-100">{pkg.desc}</p>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-xl sm:text-2xl font-bold text-[var(--t-color)] text-glow-strong mb-4">
                {selectedPackage.name}
              </div>
              <div className="p-4 sm:p-6 border-2 border-[var(--t-color)] opacity-70 mb-4 flex-1">
                <p className="text-base sm:text-lg text-[var(--t-color)] leading-relaxed">
                  {selectedPackage.desc}
                </p>
                <div className="mt-6 pt-4 border-t border-[var(--t-color)] opacity-50">
                  <p className="text-sm text-[var(--t-color)] opacity-70">
                    Contattaci per un preventivo personalizzato su questo pacchetto.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setSelectedPackage(null)}
                  className="text-[var(--t-color)] font-bold text-base cursor-pointer hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-4 py-3 border-2 border-[var(--t-color)]"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  ◂ Altri pacchetti
                </motion.button>
                <motion.button
                  onClick={() => { onSelectService(selectedPackage.name); setCurrentPage(pages.CONTATTI); }}
                  className="flex-1 text-[var(--t-color)] text-glow-strong font-bold text-base cursor-pointer hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-4 py-3 border-2 border-[var(--t-color)] uppercase"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  ▸ Richiedi preventivo
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
        <BackButton onClick={() => setCurrentPage(pages.HOME)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[var(--t-color)] text-[#080c08] font-bold px-3 sm:px-4 py-1 mb-4 sm:mb-6 w-max uppercase text-lg sm:text-3xl tracking-widest shrink-0">
        SERVIZI
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 flex-1 overflow-y-auto min-h-0 pr-2">
        {servizi.map((s) => (
          <motion.div 
            key={s.id} 
            className="border-2 border-[var(--t-color)] opacity-70 p-3 sm:p-5 relative group hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedService(s)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-0 right-0 bg-[var(--t-color)] text-[#080c08] text-xs sm:text-lg px-1.5 sm:px-2 font-black leading-tight border-b-2 border-l-2 border-[var(--t-color)]">{s.id}</div>
            <h3 className="text-sm sm:text-xl font-black text-[var(--t-color)] text-glow uppercase mt-2 mb-2 sm:mb-3 group-hover:text-[#080c08]">{s.title}</h3>
            <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-lg text-[var(--t-color)] opacity-70 group-hover:opacity-100">
              {s.items.map((item, j) => <li key={j} className="flex gap-2"><span>·</span> <span>{item}</span></li>)}
            </ul>
            <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-[var(--t-color)] opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase">
              Clicca per scoprire di più ▸
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-[var(--t-color)] opacity-70 text-base sm:text-xl mt-4 font-bold border-l-4 border-[var(--t-color)] opacity-70 pl-3 uppercase">
        * Preventivi chiari, zero sorprese.
      </div>
      <BackButton onClick={() => setCurrentPage(pages.HOME)} />
    </div>
  );
}

function Contatti({ setCurrentPage, prefillService }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    servizio: prefillService || '',
    descrizione: ''
  });
  const [step, setStep] = useState(1); // Start at step 1 (not 0)
  const [showForm, setShowForm] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIdx, setTypewriterIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [pauseTimer, setPauseTimer] = useState(null);

  const serviziOptions = [
    'Siti Web',
    'Marketing & ADS',
    'Foto & Video',
    'Grafica & Brand',
    'Software su Misura',
    'Case Famiglia',
    'Più servizi'
  ];

  const suggestions = {
    'Siti Web': [
      'Ho un\'attività e mi serve un sito vetrina per farmi conoscere...',
      'Vorrei un e-commerce per vendere i miei prodotti online...',
      'Mi serve una landing page per promuovere un servizio specifico...',
    ],
    'Marketing & ADS': [
      'Vorrei più clienti e penso che la pubblicità online possa aiutare...',
      'Ho bisogno di una strategia social per far crescere il mio brand...',
      'Voglio promuovere un\'offerta specifica su Google e Facebook...',
    ],
    'Foto & Video': [
      'Mi servono foto professionali per il mio sito e i social...',
      'Vorrei un video aziendale per presentare la mia attività...',
      'Devo fotografare prodotti o servizi per il catalogo...',
    ],
    'Grafica & Brand': [
      'Non ho ancora un logo e vorrei partire da zero...',
      'Il mio marchio è vecchio e vorrei rinnovarlo completamente...',
      'Mi serve un\'identità visiva coordinata per tutto il brand...',
    ],
    'Software su Misura': [
      'Gestisco tutto con fogli di calcolo e vorrei automatizzare...',
      'Mi serve un gestionale interno su misura per la mia azienda...',
      'Ho bisogno di un\'app web per gestire prenotazioni o ordini...',
    ],
    'Case Famiglia': [
      'Gestisco una struttura ricettiva e mi serve un sistema di booking...',
      'Vorrei un sito per la mia casa vacanze con prenotazioni online...',
      'Mi serve aiuto per digitalizzare la gestione della mia struttura...',
    ],
    'Più servizi': [
      'Ho bisogno di più cose e vorrei un preventivo completo...',
      'Non so esattamente cosa mi serva, vorrei un confronto...',
      'Vorrei un pacchetto completo: sito, social e materiale visivo...',
    ],
  };

  const getPlaceholders = () => {
    return suggestions[formData.servizio] || ['Raccontaci brevemente cosa ti serve...'];
  };

  // Typewriter effect with rotation
  useEffect(() => {
    if (step !== 3 || formData.descrizione) {
      setTypewriterText('');
      setTypewriterIdx(0);
      setIsTyping(true);
      setCurrentSuggestion(0);
      return;
    }

    const placeholders = getPlaceholders();
    const currentText = placeholders[currentSuggestion];

    if (isTyping && typewriterIdx < currentText.length) {
      const timer = setTimeout(() => {
        setTypewriterText(currentText.slice(0, typewriterIdx + 1));
        setTypewriterIdx(prev => prev + 1);
      }, 35);
      return () => clearTimeout(timer);
    }

    // Finished typing, pause then delete
    if (isTyping && typewriterIdx >= currentText.length) {
      setIsTyping(false);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setTypewriterIdx(prev => prev - 1);
      }, 2500);
      setPauseTimer(timer);
      return () => clearTimeout(timer);
    }

    // Delete text (backspace effect)
    if (!isTyping && typewriterIdx > 0) {
      const timer = setTimeout(() => {
        setTypewriterText(currentText.slice(0, typewriterIdx - 1));
        setTypewriterIdx(prev => prev - 1);
      }, 18);
      return () => clearTimeout(timer);
    }

    // Deleted all, move to next suggestion
    if (!isTyping && typewriterIdx === 0) {
      setCurrentSuggestion(prev => (prev + 1) % placeholders.length);
      setIsTyping(true);
    }
  }, [step, typewriterIdx, formData.servizio, formData.descrizione, currentSuggestion, isTyping]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  // Cleanup pauseTimer on unmount
  useEffect(() => {
    return () => { if (pauseTimer) clearTimeout(pauseTimer); };
  }, [pauseTimer]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const generateWhatsAppMessage = () => {
    const message = `*Nuova Richiesta Contatto*%0A%0A` +
      `*Nome:* ${formData.nome}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Telefono:* ${formData.telefono}%0A%0A` +
      `*Servizio Richiesto:* ${formData.servizio}%0A%0A` +
      `*Descrizione Progetto:*%0A${formData.descrizione}`;
    return message;
  };

  const generateEmailSubject = () => {
    return `Richiesta preventivo - ${formData.servizio} - ${formData.nome}`;
  };

  const generateEmailBody = () => {
    return `Nome: ${formData.nome}%0A` +
      `Email: ${formData.email}%0A` +
      `Telefono: ${formData.telefono}%0A%0A` +
      `Servizio: ${formData.servizio}%0A%0A` +
      `Descrizione:%0A${formData.descrizione}`;
  };

  const sendViaWhatsApp = () => {
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/393513052627?text=${message}`, '_blank');
  };

  const sendViaEmail = () => {
    const subject = generateEmailSubject();
    const body = generateEmailBody();
    window.open(`mailto:info@backsoftware.it?subject=${subject}&body=${body}`, '_blank');
  };

  if (!showForm) {
    return (
      <div className="flex flex-col h-full">
        <div className="text-lg sm:text-2xl text-[var(--t-color)] opacity-70 mb-6 border-b-2 border-[var(--t-color)] opacity-70 pb-4 shrink-0 font-bold uppercase tracking-widest">
          {'> '}CONTATTO DIRETTO
        </div>
        <div className="flex-1 flex flex-col justify-center max-w-3xl space-y-6 sm:space-y-8">
          <p className="text-xl sm:text-3xl font-bold leading-relaxed">
            Hai un progetto?<br/>
            <span className="text-[var(--t-color)] opacity-70">Raccontacelo.</span>
          </p>

          <div className="p-6 sm:p-8 border-l-4 border-[var(--t-color)] space-y-4 text-lg sm:text-2xl uppercase">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <span className="w-24 sm:w-36 text-[var(--t-color)] font-bold tracking-widest shrink-0 opacity-70">EMAIL:</span>
              <a href="mailto:info@backsoftware.it" className="hover:bg-[var(--t-color)] hover:text-[#080c08] transition-colors px-2 -ml-2 font-black text-[var(--t-color)]">INFO@BACKSOFTWARE.IT</a>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <span className="w-24 sm:w-36 text-[var(--t-color)] font-bold tracking-widest shrink-0 opacity-70">TEL:</span>
              <span className="select-all font-black text-[var(--t-color)]">+39 351 305 2627</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <span className="w-24 sm:w-36 text-[var(--t-color)] font-bold tracking-widest shrink-0 opacity-70">SEDE:</span>
              <span className="font-bold text-[var(--t-color)]">IVREA (TO)</span>
            </div>
          </div>

          <motion.button
            onClick={() => { setShowForm(true); setStep(1); setFormData(prev => ({ ...prev, servizio: prefillService || '' })); }}
            className="text-[var(--t-color)] text-glow-strong font-bold text-xl sm:text-2xl cursor-pointer hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-6 py-4 border-2 border-[var(--t-color)] uppercase mt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ▸ COMPILA IL FORM RICHIESTA
          </motion.button>

          <div className="text-[var(--t-color)] opacity-70 text-base sm:text-xl font-bold tracking-widest uppercase">
            [ RISPOSTA 24H ] [ CONSULENZA GRATIS ]
          </div>
        </div>
        <BackButton onClick={() => setCurrentPage(pages.HOME)} />
      </div>
    );
  }

  // Form view
  return (
    <div className="flex flex-col h-full">
      {/* Header — compact */}
      <div className="text-sm sm:text-lg text-[var(--t-color)] opacity-70 mb-3 border-b-2 border-[var(--t-color)] opacity-70 pb-2 shrink-0 font-bold uppercase tracking-widest flex justify-between items-center">
        <span>{'> '}FORM CONTATTO</span>
        <motion.button
          onClick={() => { setShowForm(false); setStep(1); }}
          className="text-xs sm:text-sm hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-3 py-1 border border-[var(--t-color)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ◂ INDIETRO
        </motion.button>
      </div>

      {/* Progress bar */}
      <div className="mb-3 shrink-0">
        <div className="flex gap-2 mb-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 flex-1 transition-all ${i <= step ? 'bg-[var(--t-color)]' : 'bg-[var(--t-color)] opacity-20'}`} />
          ))}
        </div>
        <div className="text-xs text-[var(--t-color)] opacity-70 uppercase">
          Step {step} di 4
        </div>
      </div>

      {/* Content area — fills remaining space, no scroll */}
      <div className="flex-1 min-h-0 overflow-hidden">

        {/* Step 1: Nome e Email */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="space-y-3 h-full flex flex-col justify-center"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--t-color)] text-glow-strong uppercase mb-3">Chi sei?</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[var(--t-color)] uppercase mb-1">Come ti chiami? *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full p-2 sm:p-3 bg-transparent border-2 border-[var(--t-color)] text-[var(--t-color)] placeholder:text-[var(--t-color)] placeholder:opacity-40 focus:outline-none focus:bg-[var(--t-color)] focus:text-[#080c08] focus:placeholder:text-[#080c08] transition-all font-bold text-sm sm:text-base"
                  placeholder="Mario Rossi"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[var(--t-color)] uppercase mb-1">La tua email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-2 sm:p-3 bg-transparent border-2 border-[var(--t-color)] text-[var(--t-color)] placeholder:text-[var(--t-color)] placeholder:opacity-40 focus:outline-none focus:bg-[var(--t-color)] focus:text-[#080c08] focus:placeholder:text-[#080c08] transition-all font-bold text-sm sm:text-base"
                  placeholder="mario@esempio.it"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[var(--t-color)] uppercase mb-1">Telefono? (opzionale)</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className="w-full p-2 sm:p-3 bg-transparent border-2 border-[var(--t-color)] text-[var(--t-color)] placeholder:text-[var(--t-color)] placeholder:opacity-40 focus:outline-none focus:bg-[var(--t-color)] focus:text-[#080c08] focus:placeholder:text-[#080c08] transition-all font-bold text-sm sm:text-base"
                  placeholder="+39 123 456 7890"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Servizio */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="space-y-3 h-full flex flex-col justify-center"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--t-color)] text-glow-strong uppercase mb-2">Cosa ti serve?</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {serviziOptions.map((servizio) => (
                <motion.button
                  key={servizio}
                  onClick={() => handleInputChange('servizio', servizio)}
                  className={`p-3 sm:p-4 border-2 border-[var(--t-color)] text-center text-sm sm:text-base font-bold transition-all ${formData.servizio === servizio ? 'bg-[var(--t-color)] text-[#080c08]' : 'opacity-70 hover:opacity-100 hover:bg-[var(--t-color)] hover:text-[#080c08]'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {servizio}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Descrizione */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="space-y-3 h-full flex flex-col justify-center"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--t-color)] text-glow-strong uppercase mb-2">Raccontaci la tua idea</h3>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[var(--t-color)] uppercase mb-2">Di cosa si tratta?</label>
              <div className="relative">
                <textarea
                  value={formData.descrizione}
                  onChange={(e) => handleInputChange('descrizione', e.target.value)}
                  className="w-full p-3 sm:p-4 bg-transparent border-2 border-[var(--t-color)] text-[var(--t-color)] focus:outline-none focus:bg-[var(--t-color)] focus:text-[#080c08] transition-all min-h-[60px] max-h-[100px] resize-none font-bold text-sm sm:text-base"
                  style={{ background: 'transparent' }}
                />
                {!formData.descrizione && typewriterText && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 p-3 sm:p-4 pointer-events-none flex items-start whitespace-pre-wrap font-bold text-sm sm:text-base"
                    style={{ color: 'var(--t-color)', opacity: 0.4 }}>
                    {typewriterText}{showCursor && <span className="inline-block w-2 h-4 sm:h-5 bg-[var(--t-color)] ml-0.5 animate-pulse" />}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="space-y-3 h-full flex flex-col justify-center"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--t-color)] text-glow-strong uppercase mb-2">Ci siamo quasi!</h3>
            <div className="space-y-1.5 border-2 border-[var(--t-color)] opacity-70 p-3 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs">Nome:</span>
                <span className="text-[var(--t-color)] font-bold">{formData.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs">Email:</span>
                <span className="text-[var(--t-color)] font-bold">{formData.email}</span>
              </div>
              {formData.telefono && (
                <div className="flex justify-between">
                  <span className="text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs">Tel:</span>
                  <span className="text-[var(--t-color)] font-bold">{formData.telefono}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs">Servizio:</span>
                <span className="text-[var(--t-color)] font-bold">{formData.servizio}</span>
              </div>
              {formData.descrizione && (
                <div className="border-t border-[var(--t-color)] opacity-70 pt-1.5 mt-1.5">
                  <span className="text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs block mb-1">Nota:</span>
                  <p className="text-[var(--t-color)] text-xs">{formData.descrizione}</p>
                </div>
              )}
            </div>

            <div className="space-y-2 mt-1">
              <div className="text-center text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs mb-1">Come contattarci?</div>
              <motion.button
                onClick={sendViaWhatsApp}
                className="w-full p-2.5 sm:p-3 border-2 border-[var(--t-color)] bg-[#25D366] text-white font-bold uppercase text-xs sm:text-sm hover:bg-[#128C7E] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📱 Scrivici su WhatsApp
              </motion.button>
              <motion.button
                onClick={sendViaEmail}
                className="w-full p-2.5 sm:p-3 border-2 border-[var(--t-color)] hover:bg-[var(--t-color)] hover:text-[#080c08] font-bold uppercase text-xs sm:text-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ✉️ Mandaci una Email
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation buttons — compact, fixed at bottom */}
      {step >= 1 && step <= 4 && (
        <div className="flex gap-3 mt-3 pt-3 border-t-2 border-[var(--t-color)] opacity-70 shrink-0">
          <motion.button
            onClick={prevStep}
            className="px-5 py-2 border-2 border-[var(--t-color)] hover:bg-[var(--t-color)] hover:text-[#080c08] font-bold uppercase text-xs sm:text-sm transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ◂ Indietro
          </motion.button>
          {step < 4 && (
            <motion.button
              onClick={nextStep}
              disabled={(step === 1 && (!formData.nome || !formData.email)) ||
                       (step === 2 && !formData.servizio) ||
                       (step === 3 && !formData.descrizione)}
              className="flex-1 px-5 py-2 border-2 border-[var(--t-color)] hover:bg-[var(--t-color)] hover:text-[#080c08] font-bold uppercase text-xs sm:text-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--t-color)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Avanti ▸
            </motion.button>
          )}
        </div>
      )}

      <div className="text-[var(--t-color)] opacity-70 text-xs sm:text-sm font-bold tracking-widest uppercase mt-3 shrink-0">
        [ RISPOSTA 24H ] [ CONSULENZA GRATIS ]
      </div>
      <BackButton onClick={() => { setShowForm(false); setStep(1); setCurrentPage(pages.HOME); }} />
    </div>
  );
}

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

  useEffect(() => {
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

  useEffect(() => {
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

function ModernSite({ togglePower, currentPage, setCurrentPage }) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    }
  };

  // Clean SVG icon components
  const IconWeb = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
  const IconCode = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
  const IconChart = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
  const IconCamera = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );

  const services = useMemo(() => [
    {
      icon: <IconWeb />,
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
      icon: <IconWeb />,
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
      icon: <IconChart />,
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
      icon: <IconCamera />,
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
      icon: <IconCode />,
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
      icon: <IconCode />,
      title: 'Digitali Avanzati',
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
      tags: ['Gestionale', 'PWA', 'E-commerce'], 
      year: '2025',
      desc: 'Sistema di gestione vitivinicolo completo per cantina con vendita online di esperienze, gestione coupon regali e spedizioni internazionali.'
    },
    { 
      n: 'CRM Magazzino', 
      tags: ['Gestionale', 'Logistica'], 
      year: '2024',
      desc: 'Sistema gestionale su misura per gestione magazzino, stoccaggio e spedizioni con ottimizzazione logistica avanzata.'
    },
    { 
      n: 'BPres Presenze', 
      tags: ['Gestionale', 'HR'], 
      year: '2024',
      desc: 'Sistema presenze completo per gestire ingressi, uscite, pause. Calcolo permessi automatici e richiesta ferie/malattia con approvazione via email.'
    },
    { 
      n: 'Sistema Autodemolizioni', 
      tags: ['CRM', 'API', 'Compliance'], 
      year: '2024',
      desc: 'CRM completo per pratiche bonifica, registrazione portali statali, API Rentri, vendita componenti, gestione serbatoi e controllo codici CER.'
    },
    { 
      n: '7Lakes Aparthotel', 
      tags: ['Sito Web', 'Booking', 'Drone'], 
      year: '2024',
      desc: 'Sito web con shooting drone per tour virtuale, collegamento Octorate per booking engine centralizzato con Booking.com e Airbnb.'
    },
    { 
      n: 'Salute a Domicilio', 
      tags: ['Sito Web', 'Marketing', 'ADS'], 
      year: '2024',
      desc: 'Sito web, analisi marketing intelligence, landing page pubblicitarie e campagne Google Search + retargeting social.'
    },
    { 
      n: 'CRM Task e Progetti', 
      tags: ['Gestionale', 'AI', 'Project'], 
      year: '2024',
      desc: 'Sistema gestionale per progetti, task e andamento lavorazioni. Gestione clienti e collaboratori con integrazione AI tramite API.'
    },
    { 
      n: 'My Place Malpensa', 
      tags: ['Sito Web', 'Booking', 'Multilingua'], 
      year: '2024',
      desc: 'Sito web multilingua con collegamento a Octorate per booking engine centralizzato e gestione prenotazioni automatizzata.'
    },
    { 
      n: 'Marazzato Moto', 
      tags: ['Sito Web', 'Vetrina', 'E-commerce'], 
      year: '2024',
      desc: 'Sito web vetrina con caricamento dinamico prodotti da pannello dedicato e vetrina online per vendita moto e accessori.'
    },
    { 
      n: 'Casa Famiglia Villa Katia', 
      tags: ['Marketing', 'Meta Ads', 'Landing'], 
      year: '2024',
      desc: 'Soluzione completa: sito web, landing page e sponsorizzazioni Meta Ads con focus su Facebook e target di riferimento specifico.'
    },
    { 
      n: 'Casa Famiglia Quercia', 
      tags: ['Marketing', 'Meta Ads', 'Social'], 
      year: '2024',
      desc: 'Sito web, landing page e campagne sponsorizzate Meta Ads per casa famiglia con strategia marketing mirata.'
    },
    { 
      n: 'Casa Famiglia Gramsci', 
      tags: ['Marketing', 'Social', 'Landing'], 
      year: '2024',
      desc: 'Progetto completo con sito web istituzionale, landing page dedicate e campagne pubblicitarie social mirate.'
    },
    { 
      n: 'Casa Famiglia Benissimo', 
      tags: ['Marketing', 'Facebook Ads', 'Web'], 
      year: '2024',
      desc: 'Sviluppo sito web, landing page ottimizzate e strategia marketing digitale con campagne Facebook Ads mirate.'
    },
    { 
      n: 'Casa Alloggio Sociale Anziani', 
      tags: ['Marketing', 'Web', 'Social'], 
      year: '2024',
      desc: 'Casa alloggio sociale per anziani ad Abbiategrasso: sito web istituzionale, landing page e campagne marketing dedicate.'
    },
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
        className="p-6 sm:p-10 lg:p-20 h-full flex flex-col font-sans modern-mode relative overflow-y-auto"
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
        className="p-6 sm:p-10 lg:p-20 h-full flex flex-col font-sans modern-mode relative overflow-y-auto"
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
                    placeholder="Descrivi il tuo progetto..."
                    value={formData.descrizione}
                    onChange={(e) => handleInputChange('descrizione', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-[#d4cfc5] bg-[#fdfcf9] focus:border-[#7c6f5b] focus:outline-none focus:bg-[#f8f6f2] transition-colors min-h-[120px] resize-none text-[#2d2818] placeholder:text-[#8a856f]/50" />
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
      className="px-6 sm:px-10 lg:px-20 pt-2 sm:pt-3 lg:pt-4 pb-6 sm:pb-10 lg:pb-20 h-full flex flex-col font-sans modern-mode selection:bg-[#7c6f5b]/20 relative"
      style={{ background: '#f5f2ec' }}>
      {/* CRT Glitch Effect */}
      <div className="absolute inset-0 crt-glitch-overlay" />
      <div className="modern-crt-flicker">
      
      {/* ── HEADER ── */}
      <motion.nav variants={itemVariants}
        className="flex items-center justify-between mb-4 sm:mb-6 shrink-0 sticky top-0 z-50 py-3 px-6 sm:px-10 -mx-6 sm:-mx-10 rounded-2xl bg-[#f5f2ec]/60 backdrop-blur-xl border border-[#d4cfc5]/40 shadow-sm shadow-[#a69f93]/5">
        <div className="flex items-center gap-4">
          <div className="clay-btn w-12 h-12 flex items-center justify-center !rounded-[16px] shadow-md">
            <span className="text-2xl font-black text-[#5a5040]">B.</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#2d2818]">Back Software</h1>
            <p className="text-[10px] sm:text-xs font-bold text-[#8a856f] opacity-70">Software su misura</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-[#6a6050]">
            <a href="#servizi" className="hover:text-[#2d2818] transition-colors relative group">
              Servizi
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#7c6f5b] transition-all group-hover:w-full" />
            </a>
            <a href="#progetti" className="hover:text-[#2d2818] transition-colors relative group">
              Portfolio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#7c6f5b] transition-all group-hover:w-full" />
            </a>
          </div>
          <button onClick={togglePower} className="px-4 py-2 text-xs font-bold !rounded-xl text-[#7c6f5b] border-2 border-[#d4cfc5] hover:border-[#7c6f5b] hover:text-[#3d3828] transition-colors whitespace-nowrap">
            Vista Retrò
          </button>
          <a href="#contatti" className="clay-btn px-6 py-3 text-sm font-bold !rounded-xl text-[#3d3828] hidden sm:block">
            Scrivici
          </a>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <motion.section variants={itemVariants} className="mb-16 sm:mb-24 px-2 lg:px-8 shrink-0 relative">
        {/* Floating Accents */}
        <div className="absolute -top-10 -left-10 w-24 h-24 clay-pill opacity-10 animate-float pointer-events-none" />
        <div className="absolute top-40 -right-10 w-32 h-32 clay-pill opacity-10 animate-float-delayed pointer-events-none" />

        <div className="max-w-5xl">
          <motion.div variants={itemVariants} className="inline-block px-5 py-2 mb-8 text-xs font-black tracking-[3px] uppercase clay-pill text-[#6a6050] border border-[#d4cfc5]/40">
            Design & Tecnologia
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.05] mb-8 tracking-tighter text-[#2d2818]">
            Software che funziona.<br/>
            <span className="text-[#8a7f6a] drop-shadow-sm">Fatto da persone reali.</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl sm:text-2xl lg:text-3xl leading-relaxed max-w-3xl font-medium mb-12 text-[#6a6050]">
            Tecnologia che semplifica, non complica. Costruiamo il tuo progetto come se fosse il nostro.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-8 items-center">
            <a href="#contatti" className="clay-btn px-10 py-5 text-lg font-bold !rounded-2xl text-[#3d3828] bg-[#f8f6f2] hover:scale-105 active:scale-95 transition-transform">
              Parlaci del tuo progetto →
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ── SERVIZI Section (Bento Grid) ── */}
      <motion.section id="servizi" variants={itemVariants} className="mb-32 sm:mb-48 scroll-mt-32 px-2 lg:px-8 shrink-0">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-4xl sm:text-5xl font-black text-[#2d2818] mb-6 tracking-tight">Cosa facciamo.</h3>
            <p className="text-lg sm:text-xl text-[#6a6050] font-medium leading-relaxed border-l-4 border-[#7c6f5b] pl-6">
              Niente fronzoli. Solo soluzioni concrete che risolvono problemi reali.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div key={i} variants={itemVariants}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedService(s)}
              className={`clay-card p-10 flex flex-col items-start bg-[#fdfcf9]/30 cursor-pointer group ${s.span}`}>
              <span className="w-16 h-16 flex items-center justify-center text-4xl mb-8 clay-pill bg-[#f5f2ec] shadow-md group-hover:scale-110 transition-transform">{s.icon}</span>
              <h4 className="text-2xl lg:text-3xl font-black mb-4 text-[#2d2818] tracking-tight group-hover:text-[#7c6f5b] transition-colors">{s.title}</h4>
              <p className="text-base lg:text-lg leading-relaxed text-[#6a6050] font-medium opacity-90 max-w-sm">
                {s.desc}
              </p>
              <div className="mt-6 text-sm font-bold text-[#7c6f5b] opacity-0 group-hover:opacity-100 transition-opacity">
                Scopri di più →
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── PROGETTI Section ── */}
      <motion.section id="progetti" variants={itemVariants} className="mb-32 sm:mb-48 scroll-mt-32 px-2 lg:px-8 shrink-0">
        <div className="mb-12 sm:mb-16 border-b border-[#a09a88]/20 pb-8 sm:pb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          <div>
            <h3 className="text-3xl sm:text-5xl font-black text-[#2d2818] mb-3 sm:mb-4 tracking-tight">Galleria Progetti</h3>
            <p className="text-base sm:text-lg text-[#6a6050] font-bold uppercase tracking-[4px] opacity-60">{projects.length} Successi Reali</p>
          </div>
          <p className="text-sm sm:text-base text-[#8a7f6a] max-w-xs font-medium text-right italic">
            Clicca per i dettagli
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {projects.map((p, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ y: -6 }}
              onClick={() => setSelectedService({ title: p.n, icon: '', details: p.desc })}
              className="clay-card p-5 sm:p-6 lg:p-8 cursor-pointer group overflow-hidden relative hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-5 text-5xl sm:text-6xl font-black tracking-tighter transition-opacity group-hover:opacity-10">{p.year}</div>
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-[#2d2818] leading-tight max-w-[80%] group-hover:text-[#7c6f5b] transition-colors">{p.n}</h4>
                <div className="clay-btn w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-sm text-base sm:text-lg transition-transform group-hover:rotate-45">↗</div>
              </div>
              <p className="text-xs sm:text-sm text-[#6a6050] leading-relaxed mb-3 sm:mb-4 line-clamp-2">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {p.tags.slice(0, 3).map(t => (
                  <span key={t} className="clay-pill px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-black text-[#8a7f6a] border border-[#d4cfc5]/40 uppercase tracking-wider">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs font-bold text-[#7c6f5b] opacity-0 group-hover:opacity-100 transition-opacity">
                Scopri di più →
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── CONTATTI Section ── */}
      <motion.section id="contatti" variants={itemVariants} className="mb-16 sm:mb-20 scroll-mt-32 px-2 lg:px-8 shrink-0">
        <div className="clay-card p-6 sm:p-12 lg:p-20 text-center relative overflow-hidden bg-gradient-to-br from-[#f8f6f2] to-[#eeeae0] border-2 border-[#d4cfc5]/40">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 clay-pill opacity-10 blur-3xl" />
          <h3 className="text-3xl sm:text-6xl lg:text-7xl font-black text-[#2d2818] mb-6 sm:mb-8 tracking-tighter">Parliamo del<br/>tuo futuro.</h3>
          <p className="text-base sm:text-2xl text-[#6a6050] max-w-2xl mx-auto font-bold mb-10 sm:mb-16 leading-relaxed">
            Parlaci del tuo progetto. Prima analizziamo, poi ti diciamo cosa serve davvero.
          </p>
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
      </motion.section>

      {/* ── FOOTER ── */}
      <motion.footer variants={itemVariants} className="mt-20 pt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-black px-2 lg:px-8 shrink-0 pb-12 border-t border-[#a09a88]/15"
        style={{ color: '#8a7f6a', letterSpacing: '2px' }}>
        <div className="uppercase">© {new Date().getFullYear()} Back Software</div>
      </motion.footer>
      </div>
    </motion.div>
  );
}

