'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const INITIAL_SPEED = 140;
const MIN_SPEED = 55;
const POWERUP_DURATION = 8000;

export default function SnakeGame({ color }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 360, height: 360 });
  const [isReady, setIsReady] = useState(false);
  
  const GRID_SIZE = 20;
  const cellSize = Math.floor(dimensions.width / GRID_SIZE);
  
  const [combo, setCombo] = useState(0);
  const [powerUp, setPowerUp] = useState(null); // 'speed', 'score', 'ghost'
  const [powerUpTimer, setPowerUpTimer] = useState(0);
  
  const gameState = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    foodType: 'normal', // 'normal', 'bonus', 'speed', 'ghost'
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 },
    speed: INITIAL_SPEED,
    lastMoveTime: 0,
    particles: [],
    glowIntensity: 0,
  });

  const resetGame = useCallback(() => {
    gameState.current = {
      snake: [{ x: 10, y: 10 }],
      food: generateFood([{ x: 10, y: 10 }]),
      foodType: 'normal',
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      speed: INITIAL_SPEED,
      lastMoveTime: 0,
      particles: [],
      glowIntensity: 0,
    };
    setScore(0);
    setCombo(0);
    setPowerUp(null);
    setPowerUpTimer(0);
    setGameOver(false);
    setIsPaused(false);
  }, []);

  function generateFood(snake) {
    let food;
    do {
      food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
  }
  
  function generateFoodType() {
    const rand = Math.random();
    if (rand < 0.15) return 'bonus'; // Gold food, 5x points
    if (rand < 0.25) return 'speed'; // Blue food, speed boost
    if (rand < 0.30) return 'ghost'; // Purple food, wall pass
    return 'normal';
  }
  
  function addParticles(x, y, color, count = 6) {
    const state = gameState.current;
    for (let i = 0; i < count; i++) {
      state.particles.push({
        x: x * cellSize + cellSize / 2,
        y: y * cellSize + cellSize / 2,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        color,
        size: Math.random() * 3 + 1,
      });
    }
  }

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.max(200, Math.min(rect.width, rect.height));
        if (size > 0) {
          setDimensions({ width: size, height: size });
          setIsReady(true);
        }
      }
    };
    // Delay slightly to ensure container is rendered
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver && e.key === ' ') {
        resetGame();
        return;
      }
      
      if (e.key === 'p' || e.key === 'P') {
        setIsPaused(prev => !prev);
        return;
      }

      const { direction } = gameState.current;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) gameState.current.nextDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (direction.y === 0) gameState.current.nextDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (direction.x === 0) gameState.current.nextDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.x === 0) gameState.current.nextDirection = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;

    const gameLoop = (timestamp) => {
      if (gameOver || isPaused) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      const state = gameState.current;
      
      if (timestamp - state.lastMoveTime > state.speed) {
        state.lastMoveTime = timestamp;
        
        // Update direction
        state.direction = state.nextDirection;
        
        // Calculate new head
        const head = state.snake[0];
        const newHead = {
          x: head.x + state.direction.x,
          y: head.y + state.direction.y,
        };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return;
        }

        // Check self collision
        if (state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return;
        }

        // Move snake
        state.snake.unshift(newHead);

        // Check food collision
        if (newHead.x === state.food.x && newHead.y === state.food.y) {
          let points = 10;
          let newCombo = combo + 1;
          
          if (state.foodType === 'bonus') {
            points = 50;
            addParticles(state.food.x, state.food.y, '#ffd700', 12);
            state.glowIntensity = 20;
          } else if (state.foodType === 'speed') {
            points = 15;
            setPowerUp('speed');
            setPowerUpTimer(POWERUP_DURATION);
            state.speed = Math.max(MIN_SPEED - 30, state.speed - 30);
            addParticles(state.food.x, state.food.y, '#00bfff', 10);
          } else if (state.foodType === 'ghost') {
            points = 20;
            setPowerUp('ghost');
            setPowerUpTimer(POWERUP_DURATION);
            addParticles(state.food.x, state.food.y, '#ff00ff', 10);
          } else {
            points = 10 + Math.floor(newCombo / 3) * 5; // Combo bonus
            addParticles(state.food.x, state.food.y, color, 6);
          }
          
          setCombo(newCombo);
          setScore(prev => prev + points);
          state.food = generateFood(state.snake);
          state.foodType = generateFoodType();
          if (!powerUp) {
            state.speed = Math.max(MIN_SPEED, state.speed - 1.5);
          }
        } else {
          state.snake.pop();
          if (combo > 0) setCombo(0);
        }
      }

      // Clear and draw
      ctx.fillStyle = '#070b07';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw grid (subtle)
      ctx.strokeStyle = `${color}15`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, dimensions.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(dimensions.width, i * cellSize);
        ctx.stroke();
      }

      // Draw food with pulsing effect
      const pulse = Math.sin(state.frameCount * 0.15) * 0.3 + 0.7;
      
      if (state.foodType === 'bonus') {
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
      } else if (state.foodType === 'speed') {
        ctx.fillStyle = '#00bfff';
        ctx.shadowColor = '#00bfff';
      } else if (state.foodType === 'ghost') {
        ctx.fillStyle = '#ff00ff';
        ctx.shadowColor = '#ff00ff';
      } else {
        ctx.fillStyle = color;
        ctx.shadowColor = color;
      }
      
      ctx.shadowBlur = 15 * pulse;
      const size = (cellSize - 4) * pulse;
      const offset = (cellSize - size) / 2;
      ctx.fillRect(
        state.food.x * cellSize + offset,
        state.food.y * cellSize + offset,
        size,
        size
      );
      ctx.shadowBlur = 0;
      
      // Draw food type indicator
      if (state.foodType !== 'normal') {
        ctx.fillStyle = '#fff';
        ctx.font = `${cellSize * 0.5}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const emoji = state.foodType === 'bonus' ? '★' : state.foodType === 'speed' ? '⚡' : '👻';
        ctx.fillText(emoji, state.food.x * cellSize + cellSize / 2, state.food.y * cellSize + cellSize / 2);
      }

      // Draw snake with enhanced effects
      state.snake.forEach((segment, i) => {
        const isHead = i === 0;
        const alpha = isHead ? 1 : Math.max(0.6, 1 - (i / state.snake.length) * 0.4);
        
        // Power-up effects
        if (powerUp === 'ghost') {
          ctx.fillStyle = isHead ? '#ff00ff' : `rgba(255, 0, 255, ${alpha * 0.7})`;
          ctx.shadowColor = '#ff00ff';
          ctx.globalAlpha = 0.7 + Math.sin(state.frameCount * 0.2) * 0.3;
        } else {
          ctx.fillStyle = isHead ? color : color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
          ctx.shadowColor = color;
          ctx.globalAlpha = alpha;
        }
        
        ctx.shadowBlur = isHead ? (10 + state.glowIntensity * 0.5) : 4;
        
        // Draw rounded snake body
        const padding = isHead ? 0 : 1;
        ctx.fillRect(
          segment.x * cellSize + padding,
          segment.y * cellSize + padding,
          cellSize - padding * 2,
          cellSize - padding * 2
        );
        
        // Draw eyes on head
        if (isHead) {
          ctx.fillStyle = '#070b07';
          ctx.globalAlpha = 1;
          const eyeSize = cellSize * 0.2;
          const eyeOffset = cellSize * 0.25;
          ctx.fillRect(segment.x * cellSize + eyeOffset, segment.y * cellSize + eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset - eyeSize, segment.y * cellSize + eyeOffset, eyeSize, eyeSize);
        }
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });
      
      // Draw particles
      state.particles = state.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life -= 0.03;
        
        if (p.life > 0) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          ctx.globalAlpha = 1;
          return true;
        }
        return false;
      });
      
      // Decay glow intensity
      if (state.glowIntensity > 0) state.glowIntensity -= 0.5;

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [color, gameOver, isPaused, score, combo, powerUp, dimensions, cellSize]);

  // Power-up timer
  useEffect(() => {
    if (powerUpTimer > 0 && powerUp) {
      const timer = setInterval(() => {
        setPowerUpTimer(prev => {
          if (prev <= 100) {
            setPowerUp(null);
            return 0;
          }
          return prev - 100;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [powerUp, powerUpTimer]);

  return (
    <div className="flex flex-col items-center h-full w-full">
      {/* Score Display with combo and power-up */}
      <div className="flex justify-between w-full px-2 mb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0"
        style={{ color, fontFamily: 'system-ui, sans-serif' }}>
        <div className="flex items-center gap-3">
          <span>Score: {score}</span>
          {combo > 1 && (
            <span className="text-[#ffaa00] animate-pulse">x{combo} COMBO!</span>
          )}
          {powerUp && (
            <span className={powerUp === 'ghost' ? 'text-[#ff00ff]' : 'text-[#00bfff]'}>
              {powerUp === 'speed' ? '⚡ SPEED' : powerUp === 'ghost' ? '👻 GHOST' : ''}
            </span>
          )}
        </div>
        <span>High: {highScore}</span>
      </div>

      {/* Game Canvas with enhanced CRT effects */}
      <div ref={containerRef} className="relative border-2 border-[var(--t-color)] opacity-70 flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden" style={{ boxShadow: `0 0 30px ${color}20, inset 0 0 60px ${color}10` }}>
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
          <div className="text-xs font-bold animate-pulse z-20" style={{ color }}>LOADING...</div>
        ) : (
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="block relative z-0"
          style={{ maxWidth: '100%', maxHeight: '100%', imageRendering: 'pixelated' }}
        />
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
              Score: {score}
            </div>
            <div className="text-[10px] sm:text-xs animate-pulse" style={{ color }}>
              [SPACE] to restart
            </div>
          </motion.div>
        )}

        {/* Pause Overlay */}
        {isPaused && !gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-[#070b07]/70"
          >
            <div className="text-xl sm:text-2xl font-black animate-pulse" style={{ color }}>
              PAUSED
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-3 text-[9px] sm:text-[10px] text-center opacity-60 uppercase tracking-wider"
        style={{ color, fontFamily: 'system-ui, sans-serif' }}>
        <div className="flex items-center justify-center gap-4">
          <span>↑↓←→ Move</span>
          <span>P Pause</span>
        </div>
      </div>
    </div>
  );
}
