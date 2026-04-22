import { useCallback, useRef, useEffect } from 'react';

let audioCtx = null;

export function useRetroAudio() {
  const isEnabled = useRef(true);

  const initCtx = useCallback(() => {
    if (!audioCtx) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      } catch (e) {
        console.warn('Web Audio API not supported');
        isEnabled.current = false;
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }, []);

  const playTone = useCallback((frequency, type, duration, vol = 0.08, slideToFreq = null, delay = 0) => {
    if (!isEnabled.current) return;
    initCtx();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime + delay);
      
      if (slideToFreq) {
        osc.frequency.exponentialRampToValueAtTime(slideToFreq, audioCtx.currentTime + delay + duration);
      }

      gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + delay);
      osc.stop(audioCtx.currentTime + delay + duration);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }, [initCtx]);

  const playNoise = useCallback((duration, vol = 0.25, type = 'lowpass') => {
    if (!isEnabled.current) return;
    initCtx();
    if (!audioCtx) return;

    try {
      const bufferSize = audioCtx.sampleRate * duration;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = type;
      filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + duration);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noiseSource.start();
    } catch (e) {
      console.warn("Audio noise error", e);
    }
  }, [initCtx]);

  const playSequence = useCallback((notes) => {
    if (!isEnabled.current) return;
    initCtx();
    if (!audioCtx) return;
    notes.forEach(({ freq, type, duration, vol, slide, delay }) => {
      playTone(freq, type || 'square', duration || 0.1, vol || 0.08, slide, delay || 0);
    });
  }, [initCtx, playTone]);

  return {
    playShoot: useCallback(() => {
      // Classic laser pew-pew with quick slide
      playSequence([
        { freq: 1200, type: 'sawtooth', duration: 0.08, vol: 0.06, slide: 200, delay: 0 },
      ]);
    }, [playSequence]),

    playLaser: useCallback(() => {
      // Enemy laser - lower and meaner
      playSequence([
        { freq: 500, type: 'sawtooth', duration: 0.12, vol: 0.06, slide: 80, delay: 0 },
      ]);
    }, [playSequence]),

    playExplosion: useCallback(() => {
      // Big boom: noise + low rumble
      playNoise(0.5, 0.35, 'lowpass');
      playTone(120, 'sawtooth', 0.5, 0.2, 40);
    }, [playNoise, playTone]),

    playEat: useCallback(() => {
      // Happy 8-bit chime (Pac-Man style)
      playSequence([
        { freq: 880, type: 'square', duration: 0.06, vol: 0.07, delay: 0 },
        { freq: 1100, type: 'square', duration: 0.08, vol: 0.07, delay: 0.05 },
        { freq: 1320, type: 'square', duration: 0.1, vol: 0.07, delay: 0.1 },
      ]);
    }, [playSequence]),

    playPowerup: useCallback(() => {
      // Major arpeggio fanfare
      playSequence([
        { freq: 523, type: 'square', duration: 0.12, vol: 0.08, delay: 0 },
        { freq: 659, type: 'square', duration: 0.12, vol: 0.08, delay: 0.1 },
        { freq: 784, type: 'square', duration: 0.12, vol: 0.08, delay: 0.2 },
        { freq: 1047, type: 'square', duration: 0.25, vol: 0.1, delay: 0.3 },
      ]);
    }, [playSequence]),

    playJump: useCallback(() => {
      // Springy jump slide
      playSequence([
        { freq: 200, type: 'sine', duration: 0.18, vol: 0.12, slide: 600, delay: 0 },
      ]);
    }, [playSequence]),

    playHit: useCallback(() => {
      // Crash sound: noise burst + descending tone
      playNoise(0.15, 0.25, 'bandpass');
      playSequence([
        { freq: 300, type: 'sawtooth', duration: 0.2, vol: 0.15, slide: 60, delay: 0.02 },
      ]);
    }, [playNoise, playSequence]),

    playGameOver: useCallback(() => {
      // Classic arcade descending death jingle
      playSequence([
        { freq: 400, type: 'square', duration: 0.2, vol: 0.1, delay: 0 },
        { freq: 350, type: 'square', duration: 0.2, vol: 0.1, delay: 0.2 },
        { freq: 300, type: 'square', duration: 0.2, vol: 0.1, delay: 0.4 },
        { freq: 250, type: 'square', duration: 0.2, vol: 0.1, delay: 0.6 },
        { freq: 200, type: 'square', duration: 0.4, vol: 0.12, slide: 60, delay: 0.8 },
      ]);
    }, [playSequence]),

    playStart: useCallback(() => {
      // Quick ready-up ascending ping
      playSequence([
        { freq: 600, type: 'square', duration: 0.08, vol: 0.07, delay: 0 },
        { freq: 800, type: 'square', duration: 0.08, vol: 0.07, delay: 0.08 },
        { freq: 1000, type: 'square', duration: 0.15, vol: 0.09, delay: 0.16 },
      ]);
    }, [playSequence]),

    playLevelUp: useCallback(() => {
      // Stage clear fanfare
      playSequence([
        { freq: 440, type: 'square', duration: 0.1, vol: 0.08, delay: 0 },
        { freq: 554, type: 'square', duration: 0.1, vol: 0.08, delay: 0.1 },
        { freq: 659, type: 'square', duration: 0.1, vol: 0.08, delay: 0.2 },
        { freq: 880, type: 'square', duration: 0.35, vol: 0.1, delay: 0.3 },
      ]);
    }, [playSequence]),
  };
}
