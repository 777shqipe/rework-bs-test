'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRetroAudio } from './useRetroAudio';

const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 16;
const BULLET_WIDTH = 3;
const BULLET_HEIGHT = 8;
const INVADER_WIDTH = 24;
const INVADER_HEIGHT = 18;
const BARRIER_WIDTH = 40;
const BARRIER_HEIGHT = 30;
const UFO_WIDTH = 40;
const UFO_HEIGHT = 16;

const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const INVADER_BULLET_SPEED = 3;
const INVADER_DROP_SPEED = 8;
const INVADER_START_SPEED = 0.8;
const UFO_SPEED = 2;

const INVADER_ROWS = 5;
const INVADER_COLS = 10;

export default function SpaceInvadersGame({ color }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 600, height: 450 });
  const [isReady, setIsReady] = useState(false);
  const [ufoActive, setUfoActive] = useState(false);

  const gameState = useRef({
    player: { x: 0, y: 0, flashTimer: 0 },
    bullets: [],
    invaderBullets: [],
    invaders: [],
    barriers: [],
    particles: [],
    starLayers: [],
    planet: null,
    nebulae: [],
    ufo: null,
    invaderDirection: 1,
    invaderSpeed: INVADER_START_SPEED,
    lastPlayerShot: 0,
    lastInvaderShot: 0,
    ufoTimer: 0,
    diveTimer: 0,
    frameCount: 0,
    playerLives: 3,
    screenShake: 0,
    floatingTexts: [],
    powerUps: [],
    powerUpActive: null,
    shieldActive: false,
    shieldTimer: 0,
    slowTimeActive: false,
    slowTimeTimer: 0,
    streak: 0,
    maxStreak: 0,
  });

  const { playShoot, playLaser, playExplosion, playGameOver, playHit, playPowerup } = useRetroAudio();

  const resetGame = useCallback(() => {
    const { width, height } = dimensions;
    const groundY = height - 30;
    
    // Create invaders grid
    const invaders = [];
    const startX = (width - (INVADER_COLS * (INVADER_WIDTH + 10))) / 2;
    const startY = 60;
    
    for (let row = 0; row < INVADER_ROWS; row++) {
      for (let col = 0; col < INVADER_COLS; col++) {
        const types = ['squid', 'crab', 'crab', 'octopus', 'octopus'];
        const points = [30, 20, 20, 10, 10];
        invaders.push({
          x: startX + col * (INVADER_WIDTH + 10),
          y: startY + row * (INVADER_HEIGHT + 12),
          type: types[row],
          points: points[row],
          alive: true,
          animFrame: 0,
        });
      }
    }

    // Create pixel-art barriers (grid of blocks 8x5)
    const barriers = [];
    const barrierSpacing = width / 5;
    const BARRIER_COLS = 8;
    const BARRIER_ROWS = 5;
    for (let i = 1; i <= 4; i++) {
      const blocks = [];
      const bx = i * barrierSpacing - BARRIER_WIDTH / 2;
      const by = groundY - 70;
      for (let r = 0; r < BARRIER_ROWS; r++) {
        for (let c = 0; c < BARRIER_COLS; c++) {
          // Skip corners for rounded look
          if ((r === 0 && (c === 0 || c === BARRIER_COLS - 1)) ||
              (r === BARRIER_ROWS - 1 && (c === 0 || c === BARRIER_COLS - 1))) continue;
          blocks.push({ c, r, alive: true });
        }
      }
      barriers.push({
        x: bx,
        y: by,
        blocks,
        blockW: BARRIER_WIDTH / BARRIER_COLS,
        blockH: BARRIER_HEIGHT / BARRIER_ROWS,
      });
    }

    // Create multi-layer starfield (parallax)
    const starLayers = [
      { stars: Array.from({ length: 50 }, () => ({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 1 + 0.5, brightness: Math.random() * 0.5 + 0.3 })), speed: 0.05 },
      { stars: Array.from({ length: 30 }, () => ({ x: Math.random() * width, y: Math.random() * height * 0.8, size: Math.random() * 1.5 + 0.5, brightness: Math.random() * 0.5 + 0.4 })), speed: 0.15 },
      { stars: Array.from({ length: 10 }, () => ({ x: Math.random() * width, y: Math.random() * height * 0.6, size: Math.random() * 2 + 1, brightness: Math.random() * 0.5 + 0.5 })), speed: 0.3 },
    ];

    // Planet
    const planet = {
      x: width * 0.15,
      y: height * 0.25,
      radius: Math.min(width, height) * 0.12,
      color: color,
    };

    // Nebulae (large colored fog)
    const nebulae = Array.from({ length: 3 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 80 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
    }));

    gameState.current = {
      player: { x: width / 2 - PLAYER_WIDTH / 2, y: groundY, flashTimer: 0 },
      bullets: [],
      invaderBullets: [],
      invaders,
      barriers,
      particles: [],
      starLayers,
      planet,
      nebulae,
      ufo: null,
      invaderDirection: 1,
      invaderSpeed: INVADER_START_SPEED + (level - 1) * 0.15,
      lastPlayerShot: 0,
      lastInvaderShot: 0,
      ufoTimer: 0,
      diveTimer: 0,
      frameCount: 0,
      playerLives: 3,
      screenShake: 0,
      floatingTexts: [],
      powerUps: [],
      powerUpActive: null,
      shieldActive: false,
      shieldTimer: 0,
      slowTimeActive: false,
      slowTimeTimer: 0,
      streak: 0,
      maxStreak: 0,
    };
    setScore(0);
    setGameOver(false);
    setIsStarted(false);
    setUfoActive(false);
    setLevel(1);
  }, [dimensions, level]);

  const shoot = useCallback(() => {
    if (gameOver) {
      resetGame();
      return;
    }
    if (!isStarted) {
      setIsStarted(true);
      return;
    }

    const state = gameState.current;
    const now = Date.now();
    const shootDelay = state.powerUpActive?.type === 'rapid' ? 120 : 300;

    if (now - state.lastPlayerShot > shootDelay) {
      state.lastPlayerShot = now;
      playShoot();
      if (state.powerUpActive?.type === 'spread') {
        state.bullets.push(
          { x: state.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: state.player.y - BULLET_HEIGHT, dx: 0 },
          { x: state.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: state.player.y - BULLET_HEIGHT, dx: -1.2 },
          { x: state.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: state.player.y - BULLET_HEIGHT, dx: 1.2 }
        );
      } else {
        state.bullets.push({
          x: state.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
          y: state.player.y - BULLET_HEIGHT,
          dx: 0,
        });
      }
    }
  }, [gameOver, isStarted, resetGame]);

  // Handle high score persistence
  useEffect(() => {
    const savedHighScore = localStorage.getItem('invaders_high_score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (highScore > 0) {
      localStorage.setItem('invaders_high_score', highScore.toString());
    }
  }, [highScore]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.max(400, rect.width);
        const height = Math.max(350, rect.height);
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
          setIsReady(true);
        }
      }
    };
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Keyboard controls
  const keys = useRef({ left: false, right: false, space: false });
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft') keys.current.left = true;
      if (e.code === 'ArrowRight') keys.current.right = true;
      if (e.code === 'Space') {
        keys.current.space = true;
        e.preventDefault();
        shoot();
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'ArrowLeft') keys.current.left = false;
      if (e.code === 'ArrowRight') keys.current.right = false;
      if (e.code === 'Space') keys.current.space = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shoot]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width: GAME_WIDTH, height: GAME_HEIGHT } = dimensions;

    let animationId;

    const gameLoop = () => {
      const state = gameState.current;
      state.frameCount++;

      if (isStarted && !gameOver) {
        state.frameCount++;
        
        // Screen shake decay
        if (state.screenShake > 0) {
          state.screenShake *= 0.9;
          if (state.screenShake < 0.5) state.screenShake = 0;
        }
        
        // UFO spawn logic
        state.ufoTimer++;
        if (!state.ufo && state.ufoTimer > 600 + Math.random() * 800) {
          state.ufoTimer = 0;
          const direction = Math.random() > 0.5 ? 1 : -1;
          state.ufo = {
            x: direction === 1 ? -UFO_WIDTH : GAME_WIDTH + UFO_WIDTH,
            y: 25,
            direction,
            points: [50, 100, 150, 200, 300][Math.floor(Math.random() * 5)],
          };
          setUfoActive(true);
        }
        
        // Update UFO
        if (state.ufo) {
          state.ufo.x += UFO_SPEED * state.ufo.direction;
          if (state.ufo.x < -UFO_WIDTH - 50 || state.ufo.x > GAME_WIDTH + UFO_WIDTH + 50) {
            state.ufo = null;
            setUfoActive(false);
          }
        }

        // Move player
        if (keys.current.left && state.player.x > 10) {
          state.player.x -= PLAYER_SPEED;
        }
        if (keys.current.right && state.player.x < GAME_WIDTH - PLAYER_WIDTH - 10) {
          state.player.x += PLAYER_SPEED;
        }

        // Update bullets
        state.bullets = state.bullets.filter(bullet => {
          bullet.y -= BULLET_SPEED;
          if (bullet.dx) bullet.x += bullet.dx;

          // Check collision with UFO
          let hit = false;
          if (state.ufo &&
              bullet.x < state.ufo.x + UFO_WIDTH &&
              bullet.x + BULLET_WIDTH > state.ufo.x &&
              bullet.y < state.ufo.y + UFO_HEIGHT &&
              bullet.y + BULLET_HEIGHT > state.ufo.y) {
            hit = true;
            playExplosion();
            state.screenShake = 20;
            const pointsToAward = state.ufo.points;
            setScore(prev => prev + pointsToAward);
            
            // UFO explosion particles
            for (let i = 0; i < 30; i++) {
              state.particles.push({
                x: state.ufo.x + UFO_WIDTH / 2,
                y: state.ufo.y + UFO_HEIGHT / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 50,
                color: '#ff0000',
                size: Math.random() * 5 + 2,
              });
            }
            
            state.floatingTexts.push({
              x: state.ufo.x + UFO_WIDTH / 2,
              y: state.ufo.y,
              text: `+${pointsToAward}`,
              color: '#ff0000',
              life: 1,
            });
            
            // Random power-up drop from UFO (~60% chance, better loot)
            if (Math.random() > 0.35) {
              const types = ['spread', 'rapid', 'life', 'shield', 'slow'];
              state.powerUps.push({
                x: state.ufo.x + UFO_WIDTH / 2 - 9,
                y: state.ufo.y,
                type: types[Math.floor(Math.random() * types.length)],
              });
            }
            
            state.ufo = null;
            setUfoActive(false);
          }
          
          // Check collision with invaders
          state.invaders.forEach(invader => {
            if (!hit && invader.alive &&
                bullet.x < invader.x + INVADER_WIDTH &&
                bullet.x + BULLET_WIDTH > invader.x &&
                bullet.y < invader.y + INVADER_HEIGHT &&
                bullet.y + BULLET_HEIGHT > invader.y) {
              invader.alive = false;
              hit = true;
              playHit();
              state.screenShake = 5;
              state.streak++;
              if (state.streak > state.maxStreak) state.maxStreak = state.streak;
              const streakBonus = Math.floor(state.streak / 5) * 10;
              const points = invader.points + streakBonus;
              setScore(prev => prev + points);

              // Streak floating text
              if (state.streak > 0 && state.streak % 5 === 0) {
                state.floatingTexts.push({
                  x: state.player.x + PLAYER_WIDTH / 2,
                  y: state.player.y - 10,
                  text: `${state.streak} STREAK!`,
                  color: '#ffaa00',
                  life: 1.2,
                });
              }

              // Create explosion particles
              for (let i = 0; i < 15; i++) {
                state.particles.push({
                  x: invader.x + INVADER_WIDTH / 2,
                  y: invader.y + INVADER_HEIGHT / 2,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 30,
                  color,
                  size: Math.random() * 3 + 1.5,
                });
              }

              // Random power-up drop from invaders (~8% chance)
              if (Math.random() < 0.08) {
                const types = ['spread', 'rapid', 'shield', 'slow'];
                state.powerUps.push({
                  x: invader.x + INVADER_WIDTH / 2 - 9,
                  y: invader.y + INVADER_HEIGHT / 2,
                  type: types[Math.floor(Math.random() * types.length)],
                });
              }
            }
          });
          
          // Check collision with barrier blocks
          state.barriers.forEach(barrier => {
            barrier.blocks.forEach(block => {
              if (!hit && block.alive) {
                const bx = barrier.x + block.c * barrier.blockW;
                const by = barrier.y + block.r * barrier.blockH;
                if (bullet.x < bx + barrier.blockW &&
                    bullet.x + BULLET_WIDTH > bx &&
                    bullet.y < by + barrier.blockH &&
                    bullet.y + BULLET_HEIGHT > by) {
                  block.alive = false;
                  hit = true;
                  // Tiny debris particles
                  for (let i = 0; i < 3; i++) {
                    state.particles.push({
                      x: bx + barrier.blockW / 2,
                      y: by + barrier.blockH / 2,
                      vx: (Math.random() - 0.5) * 3,
                      vy: (Math.random() - 0.5) * 3,
                      life: 12,
                      color,
                      size: Math.random() * 2 + 1,
                    });
                  }
                }
              }
            });
          });

          return bullet.y > -10 && !hit && bullet.x > -5 && bullet.x < GAME_WIDTH + 5;
        });

        // Update invader bullets
        state.invaderBullets = state.invaderBullets.filter(bullet => {
          const speed = state.slowTimeActive ? INVADER_BULLET_SPEED * 0.4 : INVADER_BULLET_SPEED;
          bullet.y += speed;
          if (bullet.dx) bullet.x += bullet.dx;

          // Check collision with player
          if (bullet.x < state.player.x + PLAYER_WIDTH &&
              bullet.x + (bullet.w || BULLET_WIDTH) > state.player.x &&
              bullet.y < state.player.y + PLAYER_HEIGHT &&
              bullet.y + (bullet.h || BULLET_HEIGHT) > state.player.y) {
            if (state.shieldActive) {
              state.shieldTimer = Math.max(0, state.shieldTimer - 60);
              if (state.shieldTimer <= 0) state.shieldActive = false;
              // Shield hit particles
              for (let i = 0; i < 8; i++) {
                state.particles.push({
                  x: bullet.x, y: bullet.y,
                  vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                  life: 15, color: '#00ffff', size: Math.random() * 3 + 1,
                });
              }
              return false;
            }
            state.playerLives--;
            state.screenShake = 15;
            state.streak = 0;
            playExplosion();
            
            for (let i = 0; i < 20; i++) {
              state.particles.push({
                x: state.player.x + PLAYER_WIDTH / 2,
                y: state.player.y + PLAYER_HEIGHT / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 40,
                color: '#fff',
                size: Math.random() * 4 + 2,
              });
            }

            if (state.playerLives <= 0) {
              playGameOver();
              setGameOver(true);
              setHighScore(prev => Math.max(prev, score));
            }
            return false;
          }
          
          // Check collision with barriers
          let hit = false;
          state.barriers.forEach(barrier => {
            barrier.blocks.forEach(block => {
              if (!hit && block.alive) {
                const bx = barrier.x + block.c * barrier.blockW;
                const by = barrier.y + block.r * barrier.blockH;
                if (bullet.x < bx + barrier.blockW &&
                    bullet.x + (bullet.w || BULLET_WIDTH) > bx &&
                    bullet.y < by + barrier.blockH &&
                    bullet.y + (bullet.h || BULLET_HEIGHT) > by) {
                  block.alive = false;
                  hit = true;
                  for (let i = 0; i < 3; i++) {
                    state.particles.push({
                      x: bx + barrier.blockW / 2,
                      y: by + barrier.blockH / 2,
                      vx: (Math.random() - 0.5) * 3,
                      vy: (Math.random() - 0.5) * 3,
                      life: 10,
                      color: '#ff4444',
                      size: Math.random() * 2 + 1,
                    });
                  }
                }
              }
            });
          });

          return bullet.y < GAME_HEIGHT + 10 && !hit;
        });

        // Move invaders
        let shouldDrop = false;
        let aliveInvaders = 0;
        let rightmost = 0;
        let leftmost = GAME_WIDTH;
        let lowestInvaderY = 0;

        state.invaders.forEach(invader => {
          if (invader.alive) {
            aliveInvaders++;
            rightmost = Math.max(rightmost, invader.x + INVADER_WIDTH);
            leftmost = Math.min(leftmost, invader.x);
            lowestInvaderY = Math.max(lowestInvaderY, invader.y + INVADER_HEIGHT);

            if (!invader.diveMode && invader.y + INVADER_HEIGHT >= state.player.y) {
              setGameOver(true);
              setHighScore(prev => Math.max(prev, score));
            }
          }
        });

        if (aliveInvaders === 0) {
          setLevel(prev => prev + 1);
          resetGame();
          return;
        }

        // Speed ramps up as fewer invaders remain
        const speedMult = 1 + (1 - aliveInvaders / (INVADER_ROWS * INVADER_COLS)) * 2.5;
        const currentSpeed = state.invaderSpeed * speedMult * (state.slowTimeActive ? 0.4 : 1);

        if (state.invaderDirection === 1 && rightmost >= GAME_WIDTH - 10) {
          shouldDrop = true;
          state.invaderDirection = -1;
        } else if (state.invaderDirection === -1 && leftmost <= 10) {
          shouldDrop = true;
          state.invaderDirection = 1;
        }

        // Dive bombing logic
        state.diveTimer++;
        if (state.diveTimer > 400 + Math.random() * 400 && aliveInvaders > 3) {
          state.diveTimer = 0;
          const divers = state.invaders.filter(i => i.alive && !i.diveMode);
          if (divers.length > 0) {
            const diver = divers[Math.floor(Math.random() * divers.length)];
            diver.diveMode = true;
            diver.diveOriginX = diver.x;
            diver.diveOriginY = diver.y;
            diver.divePhase = 0;
            diver.diveDir = Math.random() > 0.5 ? 1 : -1;
          }
        }

        state.invaders.forEach(invader => {
          if (invader.alive) {
            if (invader.diveMode) {
              invader.divePhase += 0.025;
              // Figure-8 / loop dive path
              invader.x = invader.diveOriginX + Math.sin(invader.divePhase * 3) * 60 * invader.diveDir;
              invader.y = invader.diveOriginY + invader.divePhase * 120;
              if (invader.y > GAME_HEIGHT + 30 || invader.divePhase > 3.5) {
                invader.diveMode = false;
                invader.y = invader.diveOriginY;
                invader.x = invader.diveOriginX;
              }
            } else {
              invader.x += currentSpeed * state.invaderDirection;
              // Subtle wave motion
              invader.y += Math.sin(state.frameCount * 0.05 + invader.x * 0.02) * 0.4;
              if (shouldDrop) {
                invader.y += INVADER_DROP_SPEED;
              }
              // Clamp back into formation area
              if (invader.y > GAME_HEIGHT - 100) invader.y = GAME_HEIGHT - 100;
            }
            // Animate
            if (state.frameCount % 30 === 0) {
              invader.animFrame = 1 - invader.animFrame;
            }
          }
        });

        // Invaders shoot
        const now = Date.now();
        const baseShotDelay = state.slowTimeActive ? 1800 : 800;
        if (now - state.lastInvaderShot > baseShotDelay + Math.random() * 600) {
          state.lastInvaderShot = now;
          const shooters = state.invaders.filter(i => i.alive && i.y > 50 && !i.diveMode);
          if (shooters.length > 0) {
            playLaser();
            const shooter = shooters[Math.floor(Math.random() * shooters.length)];
            if (shooter.type === 'octopus') {
              // Octopus: double wide shot
              state.invaderBullets.push({
                x: shooter.x + INVADER_WIDTH / 2,
                y: shooter.y + INVADER_HEIGHT,
                w: 5, h: 6,
              });
            } else if (shooter.type === 'crab') {
              // Crab: zig-zag shot
              state.invaderBullets.push({
                x: shooter.x + INVADER_WIDTH / 2,
                y: shooter.y + INVADER_HEIGHT,
                dx: Math.sin(state.frameCount * 0.1) * 1.5,
              });
            } else {
              // Squid: fast straight shot
              state.invaderBullets.push({
                x: shooter.x + INVADER_WIDTH / 2,
                y: shooter.y + INVADER_HEIGHT,
              });
            }
          }
        }

        // Update particles
        state.particles = state.particles.filter(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          return p.life > 0;
        });

        // Update floating texts
        state.floatingTexts = state.floatingTexts.filter(ft => {
          ft.y -= 0.5;
          ft.life -= 0.02;
          return ft.life > 0;
        });

        // Update power-ups
        state.powerUps = state.powerUps.filter(p => {
          p.y += 1.5;
          if (p.x < state.player.x + PLAYER_WIDTH &&
              p.x + 18 > state.player.x &&
              p.y < state.player.y + PLAYER_HEIGHT &&
              p.y + 18 > state.player.y) {
            playPowerup();
            if (p.type === 'life') {
              state.playerLives = Math.min(5, state.playerLives + 1);
              state.floatingTexts.push({ x: state.player.x + PLAYER_WIDTH/2, y: state.player.y - 15, text: '+♥', color: '#00ff00', life: 1 });
            } else if (p.type === 'shield') {
              state.shieldActive = true;
              state.shieldTimer = 900;
              state.floatingTexts.push({ x: state.player.x + PLAYER_WIDTH/2, y: state.player.y - 15, text: 'SHIELD!', color: '#00ffff', life: 1 });
            } else if (p.type === 'slow') {
              state.slowTimeActive = true;
              state.slowTimeTimer = 600;
              state.floatingTexts.push({ x: state.player.x + PLAYER_WIDTH/2, y: state.player.y - 15, text: 'SLOW-MO!', color: '#ff66ff', life: 1 });
            } else {
              state.powerUpActive = { type: p.type, timer: 600 };
              const label = p.type === 'spread' ? 'SPREAD!' : p.type === 'rapid' ? 'RAPID!' : 'POWER!';
              state.floatingTexts.push({ x: state.player.x + PLAYER_WIDTH/2, y: state.player.y - 15, text: label, color: '#ffff00', life: 1 });
            }
            return false;
          }
          return p.y < GAME_HEIGHT;
        });

        if (state.powerUpActive) {
          state.powerUpActive.timer--;
          if (state.powerUpActive.timer <= 0) state.powerUpActive = null;
        }
        if (state.shieldActive) {
          state.shieldTimer--;
          if (state.shieldTimer <= 0) state.shieldActive = false;
        }
        if (state.slowTimeActive) {
          state.slowTimeTimer--;
          if (state.slowTimeTimer <= 0) state.slowTimeActive = false;
        }
      }

      // Screen shake
      ctx.save();
      if (state.screenShake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * state.screenShake,
          (Math.random() - 0.5) * state.screenShake
        );
      }

      // Deep space radial gradient background
      const spaceGradient = ctx.createRadialGradient(GAME_WIDTH/2, GAME_HEIGHT/2, 0, GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH);
      spaceGradient.addColorStop(0, '#0a1020');
      spaceGradient.addColorStop(0.5, '#050810');
      spaceGradient.addColorStop(1, '#020408');
      ctx.fillStyle = spaceGradient;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw nebulae
      state.nebulae.forEach(neb => {
        neb.x += neb.vx;
        neb.y += neb.vy;
        const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.radius);
        grad.addColorStop(0, color + '08');
        grad.addColorStop(0.5, color + '03');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw multi-layer parallax starfield
      state.starLayers.forEach(layer => {
        layer.stars.forEach(star => {
          star.x -= layer.speed;
          if (star.x < 0) star.x = GAME_WIDTH;
          const twinkle = Math.sin(state.frameCount * 0.05 + star.brightness * 10) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`;
          ctx.fillRect(star.x, star.y, star.size, star.size);
        });
      });

      // Draw planet
      if (state.planet) {
        const p = state.planet;
        const glow = ctx.createRadialGradient(p.x, p.y, p.radius * 0.8, p.x, p.y, p.radius * 1.4);
        glow.addColorStop(0, p.color + '18');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 1.4, 0, Math.PI * 2);
        ctx.fill();
        const body = ctx.createRadialGradient(p.x - p.radius*0.3, p.y - p.radius*0.3, 0, p.x, p.y, p.radius);
        body.addColorStop(0, p.color + '40');
        body.addColorStop(0.6, p.color + '20');
        body.addColorStop(1, '#000');
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        // Craters
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.arc(p.x + p.radius*0.2, p.y + p.radius*0.1, p.radius*0.15, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x - p.radius*0.3, p.y - p.radius*0.2, p.radius*0.1, 0, Math.PI*2);
        ctx.fill();
      }

      // Draw barriers (pixel block style)
      state.barriers.forEach(barrier => {
        ctx.fillStyle = color + 'cc';
        ctx.strokeStyle = color + '44';
        ctx.lineWidth = 0.5;
        barrier.blocks.forEach(block => {
          if (block.alive) {
            const bx = barrier.x + block.c * barrier.blockW;
            const by = barrier.y + block.r * barrier.blockH;
            ctx.fillRect(bx + 1, by + 1, barrier.blockW - 2, barrier.blockH - 2);
            ctx.strokeRect(bx, by, barrier.blockW, barrier.blockH);
          }
        });
      });

      // Draw player
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillRect(state.player.x, state.player.y + 6, PLAYER_WIDTH, 10);
      ctx.fillRect(state.player.x + PLAYER_WIDTH / 2 - 3, state.player.y, 6, 10);
      ctx.shadowBlur = 0;

      // Draw shield around player
      if (state.shieldActive) {
        const shieldPulse = 0.5 + Math.sin(state.frameCount * 0.1) * 0.25;
        ctx.strokeStyle = `rgba(0,255,255,${shieldPulse})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(state.player.x + PLAYER_WIDTH / 2, state.player.y + PLAYER_HEIGHT / 2, 22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw player bullets
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      state.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
      });

      // Draw invader bullets
      ctx.fillStyle = '#ff4444';
      ctx.shadowColor = '#ff4444';
      state.invaderBullets.forEach(bullet => {
        const bw = bullet.w || BULLET_WIDTH;
        const bh = bullet.h || BULLET_HEIGHT;
        ctx.fillRect(bullet.x, bullet.y, bw, bh);
      });
      ctx.shadowBlur = 0;

      // Draw UFO
      if (state.ufo) {
        ctx.fillStyle = '#ff0000';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 15;
        
        // UFO body
        ctx.beginPath();
        ctx.ellipse(state.ufo.x + UFO_WIDTH / 2, state.ufo.y + 8, UFO_WIDTH / 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // UFO dome
        ctx.fillStyle = '#ff6666';
        ctx.beginPath();
        ctx.ellipse(state.ufo.x + UFO_WIDTH / 2, state.ufo.y + 4, UFO_WIDTH / 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Blinking lights
        if (state.frameCount % 10 < 5) {
          ctx.fillStyle = '#ffff00';
          ctx.fillRect(state.ufo.x + 5, state.ufo.y + 10, 4, 3);
          ctx.fillRect(state.ufo.x + UFO_WIDTH - 9, state.ufo.y + 10, 4, 3);
          ctx.fillRect(state.ufo.x + UFO_WIDTH / 2 - 2, state.ufo.y + 12, 4, 3);
        }
        
        ctx.shadowBlur = 0;
      }

      // Draw invaders
      state.invaders.forEach(invader => {
        if (invader.alive) {
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 6;
          
          const frame = invader.animFrame;
          const x = invader.x;
          const y = invader.y;
          const w = INVADER_WIDTH;
          const h = INVADER_HEIGHT;
          
          // Simple pixel art invaders
          if (invader.type === 'squid') {
            // Top row - squid
            ctx.fillRect(x + 8, y, 6, 3);
            ctx.fillRect(x + 4, y + 3, 14, 3);
            ctx.fillRect(x, y + 6, w, 4);
            ctx.fillRect(x + 4, y + 10, 4, 4);
            ctx.fillRect(x + 14, y + 10, 4, 4);
            if (frame === 0) {
              ctx.fillRect(x, y + 14, 4, 2);
              ctx.fillRect(x + 18, y + 14, 4, 2);
            } else {
              ctx.fillRect(x + 4, y + 14, 4, 2);
              ctx.fillRect(x + 14, y + 14, 4, 2);
            }
          } else if (invader.type === 'crab') {
            // Middle rows - crab
            ctx.fillRect(x + 2, y, 4, 3);
            ctx.fillRect(x + 16, y, 4, 3);
            ctx.fillRect(x, y + 3, w, 4);
            ctx.fillRect(x + 4, y + 7, 4, 3);
            ctx.fillRect(x + 14, y + 7, 4, 3);
            ctx.fillRect(x + 2, y + 10, 18, 3);
            if (frame === 0) {
              ctx.fillRect(x, y + 13, 4, 3);
              ctx.fillRect(x + 18, y + 13, 4, 3);
            } else {
              ctx.fillRect(x + 2, y + 13, 3, 3);
              ctx.fillRect(x + 17, y + 13, 3, 3);
            }
          } else {
            // Bottom rows - octopus
            ctx.fillRect(x + 4, y, 14, 3);
            ctx.fillRect(x, y + 3, w, 5);
            ctx.fillRect(x + 2, y + 8, 4, 3);
            ctx.fillRect(x + 16, y + 8, 4, 3);
            if (frame === 0) {
              ctx.fillRect(x, y + 11, 4, 5);
              ctx.fillRect(x + 18, y + 11, 4, 5);
              ctx.fillRect(x + 6, y + 11, 4, 3);
              ctx.fillRect(x + 12, y + 11, 4, 3);
            } else {
              ctx.fillRect(x + 2, y + 11, 4, 5);
              ctx.fillRect(x + 16, y + 11, 4, 5);
              ctx.fillRect(x + 6, y + 11, 3, 3);
              ctx.fillRect(x + 13, y + 11, 3, 3);
            }
          }
          ctx.shadowBlur = 0;
        }
      });

      // Draw particles with fade
      state.particles.forEach(p => {
        ctx.fillStyle = p.color || color;
        ctx.globalAlpha = Math.max(0, p.life / 30);
        const size = p.size || 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw floating texts
      state.floatingTexts.forEach(ft => {
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = ft.life;
        ctx.font = `bold 12px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1;
      });

      // Draw Powerups
      const powerupColors = {
        rapid: '#ffff00',
        spread: '#ff8800',
        life: '#00ff00',
        shield: '#00ffff',
        slow: '#ff66ff',
      };
      const powerupIcons = {
        rapid: '⚡',
        spread: '✦',
        life: '♥',
        shield: '🛡',
        slow: '⏳',
      };
      state.powerUps.forEach(p => {
        const pc = powerupColors[p.type] || '#ffff00';
        ctx.fillStyle = pc;
        ctx.shadowColor = pc;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x + 9, p.y + 9, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(powerupIcons[p.type] || '?', p.x + 9, p.y + 10);
        ctx.shadowBlur = 0;
      });
      
      // Restore context from screen shake
      ctx.restore();

      // Chromatic Aberration / Glitch Effect
      if (state.screenShake > 8) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.7;
        ctx.drawImage(canvas, 4, 0);
        ctx.drawImage(canvas, -4, 0);
        ctx.restore();
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [color, isStarted, gameOver, score, dimensions, level, resetGame]);

  return (
    <div className="flex flex-col items-center h-full w-full">
      {/* Score Display */}
      <div className="flex justify-between w-full px-2 mb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0"
        style={{ color, fontFamily: 'system-ui, sans-serif' }}>
        <div className="flex gap-3 items-center flex-wrap">
          <span>Score: {score}</span>
          <span>♥ {gameState.current.playerLives}</span>
          <span>Lvl: {level}</span>
          {gameState.current.streak >= 5 && (
            <span className="text-[#ffaa00] animate-pulse">🔥 {gameState.current.streak}</span>
          )}
          {gameState.current.shieldActive && (
            <span className="text-[#00ffff]">🛡</span>
          )}
          {gameState.current.slowTimeActive && (
            <span className="text-[#ff66ff] animate-pulse">⏳</span>
          )}
          {gameState.current.powerUpActive?.type === 'spread' && (
            <span className="text-[#ff8800]">✦</span>
          )}
          {gameState.current.powerUpActive?.type === 'rapid' && (
            <span className="text-[#ffff00]">⚡</span>
          )}
          {ufoActive && (
            <span className="text-[#ff0000] animate-pulse text-[9px]">🛸 UFO!</span>
          )}
        </div>
        <span>High: {highScore}</span>
      </div>

      {/* Game Canvas with enhanced CRT effects */}
      <div ref={containerRef} className="relative border-2 border-[var(--t-color)] opacity-70 flex-1 w-full min-h-0 overflow-hidden" style={{ boxShadow: `0 0 30px ${color}20, inset 0 0 60px ${color}10` }}>
        {/* CRT Scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${color}03 2px, ${color}03 4px)`,
          mixBlendMode: 'overlay'
        }} />
        {/* CRT Flicker */}
        <div className="absolute inset-0 pointer-events-none z-10 animate-pulse" style={{
          background: `linear-gradient(180deg, ${color}02 0%, transparent 50%, ${color}02 100%)`,
          animationDuration: '4s'
        }} />
        {/* Screen curvature vignette */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.8)'
        }} />
        
        {!isReady ? (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-xs font-bold animate-pulse" style={{ color }}>LOADING...</div>
          </div>
        ) : (
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="block w-full h-full relative z-0"
          style={{ imageRendering: 'pixelated' }}
        />
        )}

        {/* Start Overlay */}
        {!isStarted && !gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#070b07]/70"
          >
            <div className="text-sm sm:text-base font-black mb-2 animate-pulse" style={{ color }}>
              SPACE INVADERS
            </div>
            <div className="text-[10px] sm:text-xs" style={{ color, opacity: 0.7 }}>
              [← →] Move • [SPACE] Shoot
            </div>
          </motion.div>
        )}
        
        {/* Game Over Overlay */}
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#070b07]/90"
          >
            <div className="text-2xl sm:text-3xl font-black mb-2" style={{ color }}>
              GAME OVER
            </div>
            <div className="text-xs sm:text-sm mb-4" style={{ color, opacity: 0.7 }}>
              Score: {score} • Level: {level}
            </div>
            <div className="text-[10px] sm:text-xs animate-pulse" style={{ color }}>
              [SPACE] to restart
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-3 text-[9px] sm:text-[10px] text-center opacity-60 uppercase tracking-wider shrink-0"
        style={{ color, fontFamily: 'system-ui, sans-serif' }}>
        <div className="flex items-center justify-center gap-4">
          <span>← → Move</span>
          <span>SPACE Shoot</span>
        </div>
      </div>

      {/* Mobile Touch Controls */}
      <div className="mt-3 flex items-center justify-center gap-3 select-none">
        <button
          className="w-14 h-14 rounded-lg border-2 active:scale-95 flex items-center justify-center text-xl"
          style={{ borderColor: color, color }}
          onTouchStart={(e) => { e.preventDefault(); keys.current.left = true; }}
          onTouchEnd={(e) => { e.preventDefault(); keys.current.left = false; }}
          onMouseDown={() => keys.current.left = true}
          onMouseUp={() => keys.current.left = false}
          onMouseLeave={() => keys.current.left = false}
        >
          ◀
        </button>
        <button
          className="w-16 h-14 rounded-lg border-2 active:scale-95 flex items-center justify-center text-xl"
          style={{ borderColor: color, color }}
          onTouchStart={(e) => { e.preventDefault(); shoot(); }}
          onClick={shoot}
        >
          🔥
        </button>
        <button
          className="w-14 h-14 rounded-lg border-2 active:scale-95 flex items-center justify-center text-xl"
          style={{ borderColor: color, color }}
          onTouchStart={(e) => { e.preventDefault(); keys.current.right = true; }}
          onTouchEnd={(e) => { e.preventDefault(); keys.current.right = false; }}
          onMouseDown={() => keys.current.right = true}
          onMouseUp={() => keys.current.right = false}
          onMouseLeave={() => keys.current.right = false}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
