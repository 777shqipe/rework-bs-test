'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pages = { HOME: 'HOME', PROGETTI: 'PROGETTI', SERVIZI: 'SERVIZI', CONTATTI: 'CONTATTI' };

/* ===========================================================
   TERMINAL EXPERIENCE — Full CRT Monitor + Terminal Mode
   Loaded lazily via next/dynamic with ssr: false
=========================================================== */
export default function TerminalExperience({ onSwitchToModern }) {
  const [bootPhase, setBootPhase] = useState('boot'); // boot, awaiting_input, ready
  const [hasBootedBefore, setHasBootedBefore] = useState(false);
  const [currentPage, setCurrentPage] = useState(pages.HOME);
  const [bootLog, setBootLog] = useState([]);
  const [screenAnim, setScreenAnim] = useState('');
  const [autoProceeding, setAutoProceeding] = useState(false);
  const [terminalColor, setTerminalColor] = useState('amber');
  const [showModernHint, setShowModernHint] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const COLOR_PROFILES = useMemo(() => ({
    amber: { main: '#ffcc00', glow: 'rgba(255,204,0,0.35)', glowStrong: 'rgba(255,204,0,0.6)', beam: 'rgba(255,204,0,0.02)', beamStrong: 'rgba(255,204,0,0.05)' },
    green: { main: '#00ff66', glow: 'rgba(0,255,102,0.35)', glowStrong: 'rgba(0,255,102,0.6)', beam: 'rgba(0,255,102,0.02)', beamStrong: 'rgba(0,255,102,0.05)' },
    pink: { main: '#ff33dd', glow: 'rgba(255,51,221,0.35)', glowStrong: 'rgba(255,51,221,0.6)', beam: 'rgba(255,51,221,0.02)', beamStrong: 'rgba(255,51,221,0.05)' },
  }), []);

  // Boot sequence
  useEffect(() => {
    if (bootPhase === 'boot' && hasBootedBefore) {
      setScreenAnim('screen-on');
      setBootPhase('ready');
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

  const handleTogglePower = useCallback(() => {
    // Switch back to modern view
    onSwitchToModern();
  }, [onSwitchToModern]);

  const renderPage = useCallback(() => {
    switch (currentPage) {
      case pages.PROGETTI: return <Progetti setCurrentPage={setCurrentPage} />;
      case pages.SERVIZI: return <Servizi setCurrentPage={setCurrentPage} onSelectService={setSelectedService} />;
      case pages.CONTATTI: return <Contatti setCurrentPage={setCurrentPage} prefillService={selectedService} />;
      default: return <Home setCurrentPage={setCurrentPage} />;
    }
  }, [currentPage, selectedService]);

  const isOn = true;
  const profile = COLOR_PROFILES[terminalColor];

  return (
    <div className="w-[100dvw] h-[100dvh] overflow-hidden select-none flex items-center justify-center p-0 fixed inset-0 z-[9999]"
      style={{ 
        background: '#0a0a0a',
        '--t-color': profile.main,
        '--t-color-glow': profile.glow,
        '--t-color-glow-strong': profile.glowStrong,
        '--t-color-beam': profile.beam,
        '--t-color-beam-strong': profile.beamStrong,
        color: profile.main,
      }}>

      <div className="relative w-full h-full flex flex-col items-center justify-center">

        {/* MONITOR BODY - Ultra-realistic plastic casing */}
        <div className="w-full h-full relative flex flex-col overflow-hidden"
          style={{
            background: 'linear-gradient(175deg, #ddd9cb 0%, #d6d2c4 8%, #ccc8b8 20%, #c8c4b2 35%, #c0bca8 50%, #b8b4a0 65%, #b0ab95 80%, #a8a38d 92%, #9a9580 100%)',
            boxShadow: `
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
          {/* Subtle plastic grain texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: '256px 256px',
            }} />

          {/* Edge highlights and reflections */}
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

          {/* ── TOP BEZEL ── */}
          <div className={`flex items-center justify-center px-4 sm:px-8 shrink-0 relative h-6 sm:h-8`}>
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Brand logo area */}
            <div className="flex items-center gap-3 relative">
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 bg-[#33ff33] shadow-[0_0_6px_#33ff33,0_0_12px_rgba(51,255,51,0.4)]`} />
              <span className="font-black uppercase text-[10px] sm:text-[12px] tracking-[0.5em]"
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
          <div className="flex-1 relative" style={{ minHeight: 0, marginLeft: '8px', marginRight: '8px' }}>
            
            {/* Outer screen bezel */}
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

              {/* Inner bezel ring */}
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
                <div className={`w-full h-full overflow-hidden relative bg-[#070b07] crt-screen`} style={{
                  boxShadow: 'inset 0 0 120px rgba(0,0,0,0.98), inset 0 0 40px rgba(0,12,0,0.6)',
                }}>

                {/* Vignette */}
                <div className="absolute inset-0 z-10 crt-vignette" />

                {/* Glare reflection */}
                <div className="absolute inset-0 z-10 pointer-events-none" style={{
                  background: 'linear-gradient(125deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 20%, transparent 40%, transparent 80%, rgba(255,255,255,0.01) 100%)',
                }} />

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
          </div>

          {/* ── BOTTOM BEZEL ── */}
          <div className="h-12 sm:h-[56px] shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4 relative">
            {/* Top inner lip */}
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.12) 10%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.12) 90%, transparent)',
              }} />
            <div className="absolute top-[3px] left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.08) 50%, transparent)',
              }} />
            <div className="absolute bottom-0 left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.25) 50%, transparent)',
              }} />
            <div className="absolute bottom-[2px] left-0 right-0 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, transparent)',
              }} />

            {/* ── LEFT: screw + speaker grille ── */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Screw />
              <div className="hidden sm:block relative p-[3px] pr-2"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.03))',
                  borderRadius: '2px',
                  boxShadow: `
                    inset 0 0.5px 0 rgba(255,255,255,0.15),
                    inset 0 -0.5px 0 rgba(0,0,0,0.1)
                  `,
                }}>
                <div className="flex gap-[1.5px]">
                  {[...Array(18)].map((_, i) => (
                    <div key={i} className="w-[2.5px] h-5 rounded-full"
                      style={{
                        background: 'linear-gradient(180deg, #7a7565, #6a655a, #7a7565)',
                        boxShadow: 'inset 0 0 1px rgba(0,0,0,0.3), 0 0 0.5px rgba(255,255,255,0.1)',
                      }} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── CENTER: Model plate ── */}
            <div className="relative hidden lg:block">
              <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-center leading-tight"
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  color: '#7a7565',
                  textShadow: '0 0.5px 0 rgba(255,255,255,0.2)',
                }}>
                <div>MODEL BS-CRT4</div>
                <div className="opacity-60">MADE IN IVREA, IT</div>
              </div>
            </div>

            {/* ── RIGHT: Color selector + Power + Screw ── */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Color selector */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {showModernHint && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={handleTogglePower}
                    className="mr-2 px-2 sm:px-3 py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-wider border border-[var(--t-color)] text-[var(--t-color)] hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  >
                    Vista Moderna →
                  </motion.button>
                )}
                {Object.entries(COLOR_PROFILES).map(([name, p]) => (
                  <button key={name}
                    onClick={() => setTerminalColor(name)}
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-200 relative"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${p.main}cc, ${p.main}66)`,
                      boxShadow: terminalColor === name
                        ? `0 0 6px ${p.main}, 0 0 12px ${p.glow}, inset 0 1px 2px rgba(255,255,255,0.5)`
                        : `inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 1px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.15)`,
                      border: terminalColor === name ? `1.5px solid ${p.main}` : '1px solid rgba(0,0,0,0.2)',
                    }}
                    title={name}
                  />
                ))}
              </div>
              
              {/* Power switch */}
              <div className="relative">
                <div className="text-[5px] sm:text-[6px] font-black uppercase tracking-wider text-center mb-0.5 opacity-40"
                  style={{ fontFamily: 'system-ui, sans-serif', color: '#6a655a' }}>
                  POWER
                </div>
                <button onClick={handleTogglePower}
                  className="relative w-5 h-7 sm:w-6 sm:h-8 overflow-hidden cursor-pointer"
                  style={{
                    background: 'linear-gradient(180deg, #8a8580 0%, #7a7570 50%, #6a655a 100%)',
                    borderRadius: '3px',
                    boxShadow: `
                      inset 0 1px 2px rgba(0,0,0,0.4),
                      inset 0 -1px 1px rgba(255,255,255,0.15),
                      0 0 0 0.5px rgba(0,0,0,0.3),
                      0 2px 4px rgba(0,0,0,0.3)
                    `,
                  }}>
                  <div className="absolute inset-[2px] rounded-[2px] overflow-hidden"
                    style={{
                      background: 'linear-gradient(180deg, #95908a 0%, #8a8580 50%, #7a7570 100%)',
                      boxShadow: 'inset 0 -1px 3px rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.3)',
                    }}>
                    <div className="absolute top-[2px] left-0 right-0 text-center">
                      <span className="text-[5px] font-black tracking-wider text-[#2d2818]" style={{ fontFamily: 'system-ui, sans-serif' }}>I</span>
                    </div>
                    <div className="absolute bottom-[2px] left-0 right-0 text-center">
                      <span className="text-[5px] font-black tracking-wider text-[#8a856f] opacity-40" style={{ fontFamily: 'system-ui, sans-serif' }}>O</span>
                    </div>
                    <div className="absolute top-1/2 left-1 right-1 h-[0.5px] bg-black/15 -translate-y-1/2" />
                  </div>
                </button>
              </div>
            </div>
            <Screw />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   SCREW COMPONENT — Ultra-realistic Phillips-head screw
=========================================================== */
function Screw() {
  return (
    <div className="relative shrink-0" style={{ width: '18px', height: '18px' }}>
      <div className="absolute inset-0 rounded-full" style={{
        background: 'conic-gradient(from 0deg, #c8c4b4, #ddd9cb, #c8c4b4, #b0ab95, #c8c4b4, #ddd9cb, #c8c4b4)',
        boxShadow: `
          inset 0 1.5px 3px rgba(0,0,0,0.35),
          0 1px 1.5px rgba(255,255,255,0.4),
          0 0 0 0.5px rgba(0,0,0,0.15),
          0 2px 4px rgba(0,0,0,0.2)
        `,
      }}>
        <div className="absolute inset-[2.5px] rounded-full" style={{
          background: 'conic-gradient(from 45deg, #a8a490, #c0bca8, #a8a490, #959080, #a8a490)',
          boxShadow: 'inset 0 0.5px 1.5px rgba(0,0,0,0.3), 0 0 0.5px rgba(255,255,255,0.15)',
        }}>
          <div className="absolute top-1/2 left-[2px] right-[2px] h-[1.5px] -translate-y-1/2"
            style={{
              background: 'linear-gradient(90deg, transparent 5%, #4a4535 20%, #3a3525 50%, #4a4535 80%, transparent 95%)',
              boxShadow: 'inset 0 0.5px 1px rgba(0,0,0,0.5)',
            }} />
          <div className="absolute left-1/2 top-[2px] bottom-[2px] w-[1.5px] -translate-x-1/2"
            style={{
              background: 'linear-gradient(180deg, transparent 5%, #4a4535 20%, #3a3525 50%, #4a4535 80%, transparent 95%)',
              boxShadow: 'inset 0.5px 0 1px rgba(0,0,0,0.5)',
            }} />
        </div>
      </div>
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
    { n: 'Sistema Gestione Cantina', t: 'Gestionale', y: '2025', desc: 'Sistema di gestione vitivinicolo completo per cantina con vendita online di esperienze, gestione coupon regali e spedizioni internazionali.' },
    { n: 'CRM Magazzino', t: 'Gestionale', y: '2024', desc: 'Sistema gestionale su misura per gestione magazzino, stoccaggio e spedizioni con ottimizzazione logistica avanzata.' },
    { n: 'BPres Presenze', t: 'Gestionale', y: '2024', desc: 'Sistema presenze completo per gestire ingressi, uscite, pause. Calcolo permessi automatici e richiesta ferie/malattia con approvazione via email.' },
    { n: 'Sistema Autodemolizioni', t: 'CRM', y: '2024', desc: 'CRM completo per pratiche bonifica, registrazione portali statali, API Rentri, vendita componenti, gestione serbatoi e controllo codici CER.' },
    { n: '7Lakes Aparthotel', t: 'Sito Web', y: '2024', desc: 'Sito web con shooting drone per tour virtuale, collegamento Octorate per booking engine centralizzato con Booking.com e Airbnb.' },
    { n: 'Salute a Domicilio', t: 'Sito Web', y: '2024', desc: 'Sito web, analisi marketing intelligence, landing page pubblicitarie e campagne Google Search + retargeting social.' },
    { n: 'CRM Task e Progetti', t: 'Gestionale', y: '2024', desc: 'Sistema gestionale per progetti, task e andamento lavorazioni aziendali. Gestione clienti e collaboratori con integrazione AI tramite API.' },
    { n: 'My Place Malpensa', t: 'Sito Web', y: '2024', desc: 'Sito web multilingua con collegamento a Octorate per booking engine centralizzato e gestione prenotazioni automatizzata.' },
    { n: 'Marazzato Moto', t: 'Sito Web', y: '2024', desc: 'Sito web vetrina con caricamento dinamico prodotti da pannello dedicato e vetrina online per vendita moto e accessori.' },
    { n: 'Casa Famiglia Villa Katia', t: 'Marketing', y: '2024', desc: 'Soluzione completa: sito web, landing page e sponsorizzazioni Meta Ads con focus su Facebook e target di riferimento specifico.' },
    { n: 'Casa Famiglia Quercia', t: 'Marketing', y: '2024', desc: 'Sito web, landing page e campagne sponsorizzate Meta Ads per casa famiglia con strategia marketing mirata.' },
    { n: 'Casa Famiglia Gramsci', t: 'Marketing', y: '2024', desc: 'Progetto completo con sito web istituzionale, landing page dedicate e campagne pubblicitarie social mirate.' },
    { n: 'Casa Famiglia Benissimo', t: 'Marketing', y: '2024', desc: 'Sviluppo sito web, landing page ottimizzate e strategia marketing digitale con campagne Facebook Ads mirate.' },
    { n: 'Casa Alloggio Sociale Anziani', t: 'Marketing', y: '2024', desc: 'Casa alloggio sociale per anziani ad Abbiategrasso: sito web istituzionale, landing page e campagne marketing dedicate.' },
  ];

  const categories = ['Gestionale', 'Sito Web', 'Marketing', 'CRM'];
  const groupedProjects = categories.map(cat => ({
    name: cat,
    projects: projects.filter(p => p.t === cat)
  })).filter(g => g.projects.length > 0);

  if (selectedProject) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b-2 border-double border-[var(--t-color)] opacity-70 mb-4 pb-2 text-xl sm:text-3xl font-bold shrink-0 tracking-wider flex justify-between items-center uppercase">
          <span>/PROGETTO — {selectedProject.n}</span>
          <motion.button onClick={() => setSelectedProject(null)}
            className="text-sm sm:text-lg hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-3 py-1 border border-[var(--t-color)]"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            ◂ INDIETRO
          </motion.button>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200 }}
          className="flex-1 flex flex-col overflow-hidden">
          <div className="text-2xl sm:text-3xl font-bold text-[var(--t-color)] text-glow-strong mb-4 uppercase">{selectedProject.n}</div>
          <div className="flex gap-4 mb-4 text-base sm:text-lg text-[var(--t-color)] opacity-70 uppercase">
            <span className="border border-[var(--t-color)] px-3 py-1">{selectedProject.t}</span>
            <span className="border border-[var(--t-color)] px-3 py-1">{selectedProject.y}</span>
          </div>
          <div className="p-4 sm:p-6 border-2 border-[var(--t-color)] opacity-70 flex-1 overflow-y-auto">
            <p className="text-base sm:text-xl text-[var(--t-color)] leading-relaxed normal-case">{selectedProject.desc}</p>
          </div>
          <motion.button onClick={() => { setCurrentPage(pages.CONTATTI); }}
            className="mt-4 text-[var(--t-color)] text-glow-strong font-bold text-lg sm:text-xl cursor-pointer hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-6 py-4 border-2 border-[var(--t-color)] uppercase"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
        <div className="flex border-b-2 border-[var(--t-color)] opacity-70 pb-2 mb-2 sm:mb-3 text-[var(--t-color)] opacity-70 text-sm sm:text-xl font-bold tracking-widest">
          <div className="w-[50%]">PROGETTO</div>
          <div className="w-[30%]">TIPO</div>
          <div className="w-[20%] text-right">ANNO</div>
        </div>
        <div className="space-y-4">
          {groupedProjects.map((group, groupIdx) => (
            <div key={groupIdx}>
              <div className="text-[var(--t-color)] text-glow-strong font-bold text-base sm:text-lg mb-2 mt-4 first:mt-0 tracking-widest opacity-90">
                ▸ {group.name.toUpperCase()}
              </div>
              <div className="space-y-1">
                {group.projects.map((p, i) => (
                  <motion.div key={`${groupIdx}-${i}`}
                    className="flex hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all duration-150 py-2 sm:py-2 px-2 sm:px-1 text-sm sm:text-2xl font-medium group cursor-pointer"
                    onClick={() => setSelectedProject(p)}
                    whileHover={{ x: 4 }} whileTap={{ scale: 0.99 }}>
                    <div className="w-[50%] truncate font-bold text-sm sm:text-base">{p.n}</div>
                    <div className="w-[30%] truncate opacity-80 group-hover:opacity-100 text-xs sm:text-sm">{p.t}</div>
                    <div className="w-[20%] text-right opacity-60 group-hover:opacity-100 text-xs sm:text-sm">{p.y}</div>
                  </motion.div>
                ))}
              </div>
            </div>
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
    { id: '01', title: 'Case Famiglia', subtitle: 'Pacchetti completi', items: ['6 Mesi', '3 Mesi', 'Campagna Spot'],
      packages: [
        { name: 'Pacchetto Completo 6 Mesi', desc: 'Soluzione completa per 6 mesi: sito, social, campagne e prenotazioni' },
        { name: 'Pacchetto Completo 3 Mesi', desc: 'Soluzione completa per 3 mesi: sito, social, campagne e prenotazioni' },
        { name: 'Pacchetto Campagna Spot 6 Mesi', desc: 'Campagna spot per 6 mesi con gestione completa' }
      ],
      details: 'Servizio dedicato alle strutture che ospitano famiglie in difficoltà. Gestiamo tutto: sito web, social media, campagne pubblicitarie mirate e sistema di prenotazioni. Pacchetti flessibili da 3 o 6 mesi.' },
    { id: '02', title: 'Siti e Landing', subtitle: 'Web professionali', items: ['Sito 5-10 Pagine', 'Landing Page'],
      packages: [
        { name: 'Sito Web (5-10 pagine)', desc: 'Sito web completo con 5-10 pagine, responsive e ottimizzato' },
        { name: 'Landing Page (1 pagina)', desc: 'Landing page ottimizzata per conversioni e lead generation' }
      ],
      details: 'Siti web professionali e landing page ottimizzate per le conversioni. Dal sito aziendale completo alla landing page mirata, tutto responsive e pronto per Google.' },
    { id: '03', title: 'Marketing & ADS', subtitle: 'Campagne mirate', items: ['Analisi Marketing', 'Meta Ads', 'Google Ads'],
      packages: [
        { name: 'Analisi Marketing ADS', desc: 'Analisi completa per campagne pubblicitarie efficaci' },
        { name: 'Meta Ads / Altri Canali', desc: 'Campagne su Meta e altri canali social' },
        { name: 'Google Ads', desc: 'Campagne pubblicitarie su Google Search e Display' }
      ],
      details: 'Strategie di marketing digitale e campagne pubblicitarie mirate. Analisi, pianificazione e gestione completa delle tue campagne su Meta e Google.' },
    { id: '04', title: 'Foto & Video', subtitle: 'Contenuti professionali', items: ['Fotografico', 'Video Drone', 'Video Staff'],
      packages: [
        { name: 'Servizio Fotografico', desc: 'Servizi fotografici professionali per aziende e prodotti' },
        { name: 'Video - Drone', desc: 'Riprese video aeree con drone professionale' },
        { name: 'Video - Staff', desc: 'Riprese video con staff professionale' }
      ],
      details: 'Servizi professionali di fotografia e video per la tua azienda. Shooting fotografici, riprese con drone, video corporate e contenuti per i social.' },
    { id: '05', title: 'Grafica & Copy', subtitle: 'Design e testi', items: ['Grafica', 'Copywriting'],
      packages: [
        { name: 'Grafica', desc: 'Servizi di design grafico, visual e brand identity' },
        { name: 'Copywriting', desc: 'Servizi di scrittura, comunicazione e testi SEO' }
      ],
      details: 'Servizi di design grafico e copywriting per la tua comunicazione. Loghi, identità visiva, materiali grafici e testi che parlano al tuo pubblico.' },
    { id: '06', title: 'Digitali Avanzati', subtitle: 'Soluzioni custom', items: ['Gestionali', 'Applicazioni', 'API'],
      packages: [
        { name: 'Gestionali', desc: 'Sistemi gestionali personalizzati per la tua azienda' },
        { name: 'Applicazioni', desc: 'Applicazioni web e mobile su misura' },
        { name: 'Collegamento API', desc: 'Integrazioni e collegamenti API con altri servizi' }
      ],
      details: 'Soluzioni digitali avanzate per la gestione aziendale. Software su misura, gestionali, applicazioni web/mobile e integrazioni API.' },
  ];

  if (selectedService) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b-2 border-double border-[var(--t-color)] opacity-70 mb-3 sm:mb-4 pb-2 text-lg sm:text-3xl font-bold shrink-0 tracking-wider flex justify-between items-center">
          <span className="text-sm sm:text-base lg:text-xl">{selectedService.id} — {selectedService.title}</span>
          <motion.button onClick={() => { setSelectedService(null); setSelectedPackage(null); }}
            className="text-xs sm:text-sm lg:text-lg hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-2 sm:px-3 py-1 border border-[var(--t-color)]"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            ◂ INDIETRO
          </motion.button>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200 }}
          className="flex-1 flex flex-col overflow-hidden">
          {!selectedPackage ? (
            <>
              <div className="text-lg sm:text-2xl font-bold text-[var(--t-color)] text-glow-strong mb-3 sm:mb-4">{selectedService.subtitle}</div>
              <div className="p-3 sm:p-6 border-2 border-[var(--t-color)] opacity-70 mb-3 sm:mb-4">
                <p className="text-sm sm:text-base lg:text-lg text-[var(--t-color)] leading-relaxed">{selectedService.details}</p>
              </div>
              <div className="text-xs sm:text-base lg:text-lg text-[var(--t-color)] opacity-70 uppercase font-bold mb-2 sm:mb-3">Scegli un pacchetto:</div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {selectedService.packages.map((pkg, idx) => (
                  <motion.div key={idx}
                    className="border-2 border-[var(--t-color)] opacity-70 p-3 sm:p-4 cursor-pointer hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all group"
                    onClick={() => setSelectedPackage(pkg)}
                    whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.99 }}>
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
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
              <div className="text-xl sm:text-2xl font-bold text-[var(--t-color)] text-glow-strong mb-4">{selectedPackage.name}</div>
              <div className="p-4 sm:p-6 border-2 border-[var(--t-color)] opacity-70 mb-4 flex-1">
                <p className="text-base sm:text-lg text-[var(--t-color)] leading-relaxed">{selectedPackage.desc}</p>
                <div className="mt-6 pt-4 border-t border-[var(--t-color)] opacity-50">
                  <p className="text-sm text-[var(--t-color)] opacity-70">Contattaci per un preventivo personalizzato su questo pacchetto.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button onClick={() => setSelectedPackage(null)}
                  className="text-[var(--t-color)] font-bold text-base cursor-pointer hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-4 py-3 border-2 border-[var(--t-color)]"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  ◂ Altri pacchetti
                </motion.button>
                <motion.button onClick={() => { onSelectService(selectedPackage.name); setCurrentPage(pages.CONTATTI); }}
                  className="flex-1 text-[var(--t-color)] text-glow-strong font-bold text-base cursor-pointer hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-4 py-3 border-2 border-[var(--t-color)] uppercase"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
          <motion.div key={s.id}
            className="border-2 border-[var(--t-color)] opacity-70 p-3 sm:p-5 relative group hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedService(s)}
            whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
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
  const [formData, setFormData] = useState({ nome: '', email: '', telefono: '', servizio: prefillService || '', descrizione: '' });
  const [step, setStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIdx, setTypewriterIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [pauseTimer, setPauseTimer] = useState(null);

  const serviziOptions = ['Siti Web', 'Marketing & ADS', 'Foto & Video', 'Grafica & Brand', 'Software su Misura', 'Case Famiglia', 'Più servizi'];

  const suggestions = {
    'Siti Web': ['Ho un\'attività e mi serve un sito vetrina per farmi conoscere...', 'Vorrei un e-commerce per vendere i miei prodotti online...', 'Mi serve una landing page per promuovere un servizio specifico...'],
    'Marketing & ADS': ['Vorrei più clienti e penso che la pubblicità online possa aiutare...', 'Ho bisogno di una strategia social per far crescere il mio brand...', 'Voglio promuovere un\'offerta specifica su Google e Facebook...'],
    'Foto & Video': ['Mi servono foto professionali per il mio sito e i social...', 'Vorrei un video aziendale per presentare la mia attività...', 'Devo fotografare prodotti o servizi per il catalogo...'],
    'Grafica & Brand': ['Non ho ancora un logo e vorrei partire da zero...', 'Il mio marchio è vecchio e vorrei rinnovarlo completamente...', 'Mi serve un\'identità visiva coordinata per tutto il brand...'],
    'Software su Misura': ['Gestisco tutto con fogli di calcolo e vorrei automatizzare...', 'Mi serve un gestionale interno su misura per la mia azienda...', 'Ho bisogno di un\'app web per gestire prenotazioni o ordini...'],
    'Case Famiglia': ['Gestisco una struttura ricettiva e mi serve un sistema di booking...', 'Vorrei un sito per la mia casa vacanze con prenotazioni online...', 'Mi serve aiuto per digitalizzare la gestione della mia struttura...'],
    'Più servizi': ['Ho bisogno di più cose e vorrei un preventivo completo...', 'Non so esattamente cosa mi serva, vorrei un confronto...', 'Vorrei un pacchetto completo: sito, social e materiale visivo...'],
  };

  const getPlaceholders = () => suggestions[formData.servizio] || ['Raccontaci brevemente cosa ti serve...'];

  useEffect(() => {
    if (step !== 3 || formData.descrizione) { setTypewriterText(''); setTypewriterIdx(0); setIsTyping(true); setCurrentSuggestion(0); return; }
    const placeholders = getPlaceholders();
    const currentText = placeholders[currentSuggestion];
    if (isTyping && typewriterIdx < currentText.length) {
      const timer = setTimeout(() => { setTypewriterText(currentText.slice(0, typewriterIdx + 1)); setTypewriterIdx(prev => prev + 1); }, 35);
      return () => clearTimeout(timer);
    }
    if (isTyping && typewriterIdx >= currentText.length) {
      setIsTyping(false);
      const timer = setTimeout(() => { setIsTyping(false); setTypewriterIdx(prev => prev - 1); }, 2500);
      setPauseTimer(timer);
      return () => clearTimeout(timer);
    }
    if (!isTyping && typewriterIdx > 0) {
      const timer = setTimeout(() => { setTypewriterText(currentText.slice(0, typewriterIdx - 1)); setTypewriterIdx(prev => prev - 1); }, 18);
      return () => clearTimeout(timer);
    }
    if (!isTyping && typewriterIdx === 0) { setCurrentSuggestion(prev => (prev + 1) % placeholders.length); setIsTyping(true); }
  }, [step, typewriterIdx, formData.servizio, formData.descrizione, currentSuggestion, isTyping]);

  useEffect(() => { const interval = setInterval(() => setShowCursor(prev => !prev), 530); return () => clearInterval(interval); }, []);
  useEffect(() => { return () => { if (pauseTimer) clearTimeout(pauseTimer); }; }, [pauseTimer]);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const sendViaWhatsApp = () => {
    const message = `*Nuova Richiesta Contatto*%0A%0A*Nome:* ${formData.nome}%0A*Email:* ${formData.email}%0A*Telefono:* ${formData.telefono}%0A%0A*Servizio Richiesto:* ${formData.servizio}%0A%0A*Descrizione Progetto:*%0A${formData.descrizione}`;
    window.open(`https://wa.me/393513052627?text=${message}`, '_blank');
  };

  const sendViaEmail = () => {
    const subject = `Richiesta preventivo - ${formData.servizio} - ${formData.nome}`;
    const body = `Nome: ${formData.nome}%0AEmail: ${formData.email}%0ATelefono: ${formData.telefono}%0A%0AServizio: ${formData.servizio}%0A%0ADescrizione:%0A${formData.descrizione}`;
    window.open(`mailto:info@backsoftware.it?subject=${subject}&body=${body}`, '_blank');
  };

  if (!showForm) {
    return (
      <div className="flex flex-col h-full">
        <div className="text-lg sm:text-2xl text-[var(--t-color)] opacity-70 mb-6 border-b-2 border-[var(--t-color)] opacity-70 pb-4 shrink-0 font-bold uppercase tracking-widest">{'> '}CONTATTO DIRETTO</div>
        <div className="flex-1 flex flex-col justify-center max-w-3xl space-y-6 sm:space-y-8">
          <p className="text-xl sm:text-3xl font-bold leading-relaxed">Hai un progetto?<br/><span className="text-[var(--t-color)] opacity-70">Raccontacelo.</span></p>
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
          <motion.button onClick={() => { setShowForm(true); setStep(1); setFormData(prev => ({ ...prev, servizio: prefillService || '' })); }}
            className="text-[var(--t-color)] text-glow-strong font-bold text-xl sm:text-2xl cursor-pointer hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-6 py-4 border-2 border-[var(--t-color)] uppercase mt-4"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            ▸ COMPILA IL FORM RICHIESTA
          </motion.button>
          <div className="text-[var(--t-color)] opacity-70 text-base sm:text-xl font-bold tracking-widest uppercase">[ RISPOSTA 24H ] [ CONSULENZA GRATIS ]</div>
        </div>
        <BackButton onClick={() => setCurrentPage(pages.HOME)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="text-sm sm:text-lg text-[var(--t-color)] opacity-70 mb-3 border-b-2 border-[var(--t-color)] opacity-70 pb-2 shrink-0 font-bold uppercase tracking-widest flex justify-between items-center">
        <span>{'> '}FORM CONTATTO</span>
        <motion.button onClick={() => { setShowForm(false); setStep(1); }}
          className="text-xs sm:text-sm hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all px-3 py-1 border border-[var(--t-color)]"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          ◂ INDIETRO
        </motion.button>
      </div>
      <div className="mb-3 shrink-0">
        <div className="flex gap-2 mb-1">
          {[1, 2, 3, 4].map(i => (<div key={i} className={`h-1.5 flex-1 transition-all ${i <= step ? 'bg-[var(--t-color)]' : 'bg-[var(--t-color)] opacity-20'}`} />))}
        </div>
        <div className="text-xs text-[var(--t-color)] opacity-70 uppercase">Step {step} di 4</div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200 }} className="space-y-3 h-full flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--t-color)] text-glow-strong uppercase mb-3">Chi sei?</h3>
            <div className="space-y-2">
              <div><label className="block text-xs sm:text-sm font-bold text-[var(--t-color)] uppercase mb-1">Come ti chiami? *</label>
                <input type="text" value={formData.nome} onChange={(e) => handleInputChange('nome', e.target.value)} className="w-full p-2 sm:p-3 bg-transparent border-2 border-[var(--t-color)] text-[var(--t-color)] placeholder:text-[var(--t-color)] placeholder:opacity-40 focus:outline-none focus:bg-[var(--t-color)] focus:text-[#080c08] transition-all font-bold text-sm sm:text-base" placeholder="Mario Rossi" /></div>
              <div><label className="block text-xs sm:text-sm font-bold text-[var(--t-color)] uppercase mb-1">La tua email *</label>
                <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full p-2 sm:p-3 bg-transparent border-2 border-[var(--t-color)] text-[var(--t-color)] placeholder:text-[var(--t-color)] placeholder:opacity-40 focus:outline-none focus:bg-[var(--t-color)] focus:text-[#080c08] transition-all font-bold text-sm sm:text-base" placeholder="mario@esempio.it" /></div>
              <div><label className="block text-xs sm:text-sm font-bold text-[var(--t-color)] uppercase mb-1">Telefono? (opzionale)</label>
                <input type="tel" value={formData.telefono} onChange={(e) => handleInputChange('telefono', e.target.value)} className="w-full p-2 sm:p-3 bg-transparent border-2 border-[var(--t-color)] text-[var(--t-color)] placeholder:text-[var(--t-color)] placeholder:opacity-40 focus:outline-none focus:bg-[var(--t-color)] focus:text-[#080c08] transition-all font-bold text-sm sm:text-base" placeholder="+39 123 456 7890" /></div>
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200 }} className="space-y-3 h-full flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--t-color)] text-glow-strong uppercase mb-2">Cosa ti serve?</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {serviziOptions.map((servizio) => (
                <motion.button key={servizio} onClick={() => handleInputChange('servizio', servizio)}
                  className={`p-3 sm:p-4 border-2 border-[var(--t-color)] text-center text-sm sm:text-base font-bold transition-all ${formData.servizio === servizio ? 'bg-[var(--t-color)] text-[#080c08]' : 'opacity-70 hover:opacity-100 hover:bg-[var(--t-color)] hover:text-[#080c08]'}`}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {servizio}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200 }} className="space-y-3 h-full flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--t-color)] text-glow-strong uppercase mb-2">Raccontaci la tua idea</h3>
            <div><label className="block text-xs sm:text-sm font-bold text-[var(--t-color)] uppercase mb-2">Di cosa si tratta?</label>
              <div className="relative">
                <textarea value={formData.descrizione} onChange={(e) => handleInputChange('descrizione', e.target.value)}
                  className="w-full p-3 sm:p-4 bg-transparent border-2 border-[var(--t-color)] text-[var(--t-color)] focus:outline-none focus:bg-[var(--t-color)] focus:text-[#080c08] transition-all min-h-[60px] max-h-[100px] resize-none font-bold text-sm sm:text-base" style={{ background: 'transparent' }} />
                {!formData.descrizione && typewriterText && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 p-3 sm:p-4 pointer-events-none flex items-start whitespace-pre-wrap font-bold text-sm sm:text-base" style={{ color: 'var(--t-color)', opacity: 0.4 }}>
                    {typewriterText}{showCursor && <span className="inline-block w-2 h-4 sm:h-5 bg-[var(--t-color)] ml-0.5 animate-pulse" />}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200 }} className="space-y-3 h-full flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--t-color)] text-glow-strong uppercase mb-2">Ci siamo quasi!</h3>
            <div className="space-y-1.5 border-2 border-[var(--t-color)] opacity-70 p-3 text-xs sm:text-sm">
              <div className="flex justify-between"><span className="text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs">Nome:</span><span className="text-[var(--t-color)] font-bold">{formData.nome}</span></div>
              <div className="flex justify-between"><span className="text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs">Email:</span><span className="text-[var(--t-color)] font-bold">{formData.email}</span></div>
              {formData.telefono && <div className="flex justify-between"><span className="text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs">Tel:</span><span className="text-[var(--t-color)] font-bold">{formData.telefono}</span></div>}
              <div className="flex justify-between"><span className="text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs">Servizio:</span><span className="text-[var(--t-color)] font-bold">{formData.servizio}</span></div>
              {formData.descrizione && <div className="border-t border-[var(--t-color)] opacity-70 pt-1.5 mt-1.5"><span className="text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs block mb-1">Nota:</span><p className="text-[var(--t-color)] text-xs">{formData.descrizione}</p></div>}
            </div>
            <div className="space-y-2 mt-1">
              <div className="text-center text-[var(--t-color)] opacity-70 uppercase text-[10px] sm:text-xs mb-1">Come contattarci?</div>
              <motion.button onClick={sendViaWhatsApp} className="w-full p-2.5 sm:p-3 border-2 border-[var(--t-color)] bg-[#25D366] text-white font-bold uppercase text-xs sm:text-sm hover:bg-[#128C7E] transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>📱 Scrivici su WhatsApp</motion.button>
              <motion.button onClick={sendViaEmail} className="w-full p-2.5 sm:p-3 border-2 border-[var(--t-color)] hover:bg-[var(--t-color)] hover:text-[#080c08] font-bold uppercase text-xs sm:text-sm transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>✉️ Mandaci una Email</motion.button>
            </div>
          </motion.div>
        )}
      </div>
      {step >= 1 && step <= 4 && (
        <div className="flex gap-3 mt-3 pt-3 border-t-2 border-[var(--t-color)] opacity-70 shrink-0">
          <motion.button onClick={prevStep} className="px-5 py-2 border-2 border-[var(--t-color)] hover:bg-[var(--t-color)] hover:text-[#080c08] font-bold uppercase text-xs sm:text-sm transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>◂ Indietro</motion.button>
          {step < 4 && (
            <motion.button onClick={nextStep}
              disabled={(step === 1 && (!formData.nome || !formData.email)) || (step === 2 && !formData.servizio) || (step === 3 && !formData.descrizione)}
              className="flex-1 px-5 py-2 border-2 border-[var(--t-color)] hover:bg-[var(--t-color)] hover:text-[#080c08] font-bold uppercase text-xs sm:text-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--t-color)]"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Avanti ▸
            </motion.button>
          )}
        </div>
      )}
      <div className="text-[var(--t-color)] opacity-70 text-xs sm:text-sm font-bold tracking-widest uppercase mt-3 shrink-0">[ RISPOSTA 24H ] [ CONSULENZA GRATIS ]</div>
      <BackButton onClick={() => { setShowForm(false); setStep(1); setCurrentPage(pages.HOME); }} />
    </div>
  );
}
