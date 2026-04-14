'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SnakeGame from './games/SnakeGame';
import FlappyGame from './games/FlappyGame';
import DinoGame from './games/DinoGame';
import SpaceInvadersGame from './games/SpaceInvadersGame';

const GAMES = {
  SNAKE: 'SNAKE',
  FLAPPY: 'FLAPPY',
  DINO: 'DINO',
  SPACE: 'SPACE',
};

const GAME_TITLES = {
  [GAMES.SNAKE]: 'SNAKE',
  [GAMES.FLAPPY]: 'FLAPPY',
  [GAMES.DINO]: 'DINO RUN',
  [GAMES.SPACE]: 'INVADERS',
};

/* ===========================================================
   RETRO ARCADE — CRT Monitor + 4 Mini Games
   Snake, Flappy Bird, Dino Run, Space Invaders
=========================================================== */
export default function TerminalExperience({ onSwitchToModern }) {
  const [bootPhase, setBootPhase] = useState('boot');
  const [screenAnim, setScreenAnim] = useState('');
  const [terminalColor, setTerminalColor] = useState('amber');
  const [currentGame, setCurrentGame] = useState(GAMES.SNAKE);

  const COLOR_PROFILES = useMemo(() => ({
    amber: { main: '#ffcc00', glow: 'rgba(255,204,0,0.35)', glowStrong: 'rgba(255,204,0,0.6)', beam: 'rgba(255,204,0,0.02)', beamStrong: 'rgba(255,204,0,0.05)' },
    green: { main: '#00ff66', glow: 'rgba(0,255,102,0.35)', glowStrong: 'rgba(0,255,102,0.6)', beam: 'rgba(0,255,102,0.02)', beamStrong: 'rgba(0,255,102,0.05)' },
    pink: { main: '#ff33dd', glow: 'rgba(255,51,221,0.35)', glowStrong: 'rgba(255,51,221,0.6)', beam: 'rgba(255,51,221,0.02)', beamStrong: 'rgba(255,51,221,0.05)' },
  }), []);

  // Quick boot sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreenAnim('screen-on');
      setBootPhase('ready');
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleTogglePower = useCallback(() => {
    onSwitchToModern();
  }, [onSwitchToModern]);

  const handleGameChange = (game) => {
    setCurrentGame(game);
  };

  const renderGame = useCallback(() => {
    const color = COLOR_PROFILES[terminalColor].main;
    switch (currentGame) {
      case GAMES.SNAKE: return <SnakeGame color={color} />;
      case GAMES.FLAPPY: return <FlappyGame color={color} />;
      case GAMES.DINO: return <DinoGame color={color} />;
      case GAMES.SPACE: return <SpaceInvadersGame color={color} />;
      default: return <SnakeGame color={color} />;
    }
  }, [currentGame, terminalColor]);

  const profile = COLOR_PROFILES[terminalColor];

  return (
    <div className="w-full h-full overflow-hidden select-none flex items-center justify-center p-0 fixed inset-0 z-[9999]"
      style={{ 
        background: '#0a0a0a',
        '--t-color': profile.main,
        '--t-color-glow': profile.glow,
        '--t-color-glow-strong': profile.glowStrong,
        '--t-color-beam': profile.beam,
        '--t-color-beam-strong': profile.beamStrong,
        color: profile.main,
      }}>

      <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-3 md:p-4">

        {/* MONITOR BODY - Ultra-realistic plastic casing */}
        <div className="w-full h-full relative flex flex-col overflow-hidden rounded-lg sm:rounded-xl"
          style={{
            background: 'linear-gradient(175deg, #ddd9cb 0%, #d6d2c4 8%, #ccc8b8 20%, #c8c4b2 35%, #c0bca8 50%, #b8b4a0 65%, #b0ab95 80%, #a8a38d 92%, #9a9580 100%)',
            boxShadow: `
              inset 0 2px 0 rgba(255,255,255,0.7),
              inset 0 -2px 3px rgba(0,0,0,0.15),
              inset 2px 0 0 rgba(255,255,255,0.4),
              inset -2px 0 0 rgba(0,0,0,0.08),
              inset 0 0 40px rgba(0,0,0,0.03),
              0 20px 60px -20px rgba(0,0,0,0.8),
              0 8px 30px -10px rgba(0,0,0,0.5),
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
          <div className={`flex items-center justify-center px-3 sm:px-6 lg:px-8 shrink-0 relative h-5 sm:h-8 md:h-10`}>
            <div className="absolute top-0 left-4 sm:left-6 right-4 sm:right-6 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Brand logo area */}
            <div className="flex items-center gap-2 sm:gap-3 relative">
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 bg-[#33ff33] shadow-[0_0_6px_#33ff33,0_0_12px_rgba(51,255,51,0.4)]`} />
              <span className="font-black uppercase text-[8px] xs:text-[10px] sm:text-[12px] md:text-[14px] tracking-[0.3em] sm:tracking-[0.5em]"
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
          <div className="flex-1 relative" style={{ minHeight: 0, marginLeft: '4px', marginRight: '4px', marginTop: '2px', marginBottom: '2px' }}>
            
            {/* Outer screen bezel */}
            <div className="absolute inset-0 overflow-hidden rounded-sm sm:rounded-md"
              style={{
                background: 'linear-gradient(160deg, #4a4840 0%, #3d3b30 15%, #2e2c22 40%, #252318 60%, #1e1c14 80%, #1a1810 100%)',
                boxShadow: `
                inset 0 3px 8px rgba(0,0,0,0.95),
                inset 0 -2px 5px rgba(0,0,0,0.6),
                inset 3px 0 6px rgba(0,0,0,0.5),
                inset -3px 0 6px rgba(0,0,0,0.5),
                0 2px 0 rgba(255,255,255,0.12),
                0 -1px 0 rgba(0,0,0,0.4)
              `,
              }}>
              {/* Bevel edge highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-white/15 via-transparent to-transparent" />

              {/* Inner bezel ring */}
              <div className="absolute inset-[2px] xs:inset-[3px] sm:inset-[4px] lg:inset-[6px] overflow-hidden rounded-sm"
                style={{
                  background: 'linear-gradient(180deg, #1a1a18 0%, #0d0d0c 100%)',
                  boxShadow: `
                  inset 0 0 6px rgba(0,0,0,0.9),
                  inset 0 1px 0 rgba(255,255,255,0.05),
                  0 0 1px rgba(255,255,255,0.08)
                `,
                }}>
                {/* Screen glass */}
                <div className={`w-full h-full overflow-hidden relative bg-[#070b07] crt-screen flex flex-col`} style={{
                  boxShadow: 'inset 0 0 120px rgba(0,0,0,0.98), inset 0 0 40px rgba(0,12,0,0.6)',
                }}>

                {/* Vignette */}
                <div className="absolute inset-0 z-10 crt-vignette" />

                {/* Glare reflection */}
                <div className="absolute inset-0 z-10 pointer-events-none" style={{
                  background: 'linear-gradient(125deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 20%, transparent 40%, transparent 80%, rgba(255,255,255,0.01) 100%)',
                }} />

                {/* Screen content wrapper */}
                <div className={`absolute inset-0 ${screenAnim} flex flex-col`}>

                  {/* GAME SELECTOR TABS - Top */}
                  {bootPhase === 'ready' && (
                    <div className="flex items-center justify-center gap-2 p-2 border-b border-[var(--t-color)] border-opacity-30 z-20">
                      {Object.values(GAMES).map((game) => (
                        <motion.button
                          key={game}
                          onClick={() => handleGameChange(game)}
                          className={`px-3 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all border ${
                            currentGame === game 
                              ? 'bg-[var(--t-color)] text-[#070b07] border-[var(--t-color)]' 
                              : 'text-[var(--t-color)] border-[var(--t-color)] border-opacity-50 hover:border-opacity-100'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {GAME_TITLES[game]}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* BOOT SCREEN */}
                  {bootPhase === 'boot' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--t-color)] z-30">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg sm:text-xl font-black tracking-widest animate-pulse"
                      >
                        ARCADE SYSTEM
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[10px] sm:text-xs mt-2 opacity-70"
                      >
                        LOADING GAMES...
                      </motion.div>
                    </div>
                  )}

                  {/* GAME AREA */}
                  {bootPhase === 'ready' && (
                    <div className="flex-1 flex items-center justify-center overflow-hidden p-2">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentGame}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          {renderGame()}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* ── BOTTOM BEZEL ── */}
          <div className="h-10 xs:h-12 sm:h-[52px] md:h-[56px] shrink-0 flex items-center justify-between px-3 xs:px-4 sm:px-6 lg:px-8 gap-2 xs:gap-3 sm:gap-4 relative">
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
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
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
                    <div key={i} className="w-[2.5px] h-4 sm:h-5 rounded-full"
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
                <div>ARCADE-3 CRT</div>
                <div className="opacity-60">MADE IN IVREA, IT</div>
              </div>
            </div>

            {/* ── RIGHT: Color selector + Power + Screw ── */}
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
              {/* Color selector */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {bootPhase === 'ready' && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={handleTogglePower}
                    className="mr-1 xs:mr-2 px-2 sm:px-3 py-1 text-[7px] xs:text-[8px] sm:text-[10px] font-black uppercase tracking-wider border border-[var(--t-color)] text-[var(--t-color)] hover:bg-[var(--t-color)] hover:text-[#080c08] transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  >
                    <span className="hidden xs:inline">Exit →</span>
                    <span className="xs:hidden">Exit</span>
                  </motion.button>
                )}
                {Object.entries(COLOR_PROFILES).map(([name, p]) => (
                  <button key={name}
                    onClick={() => setTerminalColor(name)}
                    className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-200 relative"
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
                <div className="text-[4px] xs:text-[5px] sm:text-[6px] font-black uppercase tracking-wider text-center mb-0.5 opacity-40"
                  style={{ fontFamily: 'system-ui, sans-serif', color: '#6a655a' }}>
                  POWER
                </div>
                <button onClick={handleTogglePower}
                  className="relative w-5 h-6 xs:w-5 xs:h-7 sm:w-6 sm:h-8 overflow-hidden cursor-pointer"
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
                      <span className="text-[4px] xs:text-[5px] font-black tracking-wider text-[#2d2818]" style={{ fontFamily: 'system-ui, sans-serif' }}>I</span>
                    </div>
                    <div className="absolute bottom-[2px] left-0 right-0 text-center">
                      <span className="text-[4px] xs:text-[5px] font-black tracking-wider text-[#8a856f] opacity-40" style={{ fontFamily: 'system-ui, sans-serif' }}>O</span>
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
