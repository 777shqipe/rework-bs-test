'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const catColors = {
  management: { accent: '#22d3ee', wash: '#0a0f1c' },
  website: { accent: '#a78bfa', wash: '#120b1e' },
  marketing: { accent: '#fb923c', wash: '#1a0a00' },
  crm: { accent: '#34d399', wash: '#051a14' },
};

const projectImages = [
  '/img1_.jpg',
  '/img2_.jpg',
  '/img3_.jpg',
  '/img4_.jpg',
  '/img5_.jpg',
  '/img6_.jpg',
  '/img7_.jpg',
  '/img8_.jpg',
];

function clampValue(min, value, max) {
  return Math.min(max, Math.max(min, value));
}

function getCardWidth(viewportWidth) {
  if (viewportWidth >= 768) return clampValue(170, viewportWidth * 0.18, 242);
  return clampValue(138, viewportWidth * 0.44, 168);
}

export default function ProjectGallery3D({ projects, t }) {
  const scrollRef = useRef(null);
  const stageRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0.08);
  const frameRef = useRef(null);
  const dragRef = useRef({ active: false, x: 0, scrollLeft: 0, mode: 'ring' });
  const reducedMotionRef = useRef(false);
  const [isListMode, setIsListMode] = useState(false);
  const [transitionState, setTransitionState] = useState('idle');
  const [viewportWidth, setViewportWidth] = useState(1280);

  const items = useMemo(() => (
    (projects || []).map((project, index) => ({
      ...project,
      image: project.images?.[0] || projectImages[index % projectImages.length],
      color: catColors[project.categoryKey] || catColors.website,
    }))
  ), [projects]);

  const setRotationValue = (value) => {
    rotationRef.current = value;
    if (stageRef.current && !isListMode) {
      stageRef.current.style.transform = `rotateY(${value}deg)`;
    }
  };

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      window.removeEventListener('resize', syncViewport);
    };
  }, []);

  useEffect(() => {
    if (reducedMotionRef.current || isListMode || transitionState !== 'idle') {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (stageRef.current && isListMode) stageRef.current.style.transform = 'rotateY(0deg)';
      if (stageRef.current && !isListMode && transitionState === 'to-ring') {
        stageRef.current.style.transform = 'rotateY(0deg)';
      }
      return undefined;
    }

    if (stageRef.current) {
      stageRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
    }

    const animate = () => {
      if (!dragRef.current.active) {
        velocityRef.current += (0.08 - velocityRef.current) * 0.025;
        setRotationValue(rotationRef.current + velocityRef.current);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isListMode, transitionState]);

  const cardWidth = Math.round(getCardWidth(viewportWidth));
  const listStep = Math.round(cardWidth * (viewportWidth < 768 ? 0.9 : 0.86));
  const trackPadding = Math.round(cardWidth * (viewportWidth < 768 ? 0.9 : 1.18));
  const spreadWidth = cardWidth + Math.max(0, items.length - 1) * listStep;
  const trackWidth = Math.max(viewportWidth, spreadWidth + (trackPadding * 2));
  const listStart = Math.round((trackWidth - spreadWidth) / 2);

  useEffect(() => {
    if (!isListMode || !scrollRef.current) return undefined;

    const frame = requestAnimationFrame(() => {
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = maxScroll > 0 ? maxScroll / 2 : 0;
    });

    return () => cancelAnimationFrame(frame);
  }, [isListMode, trackWidth]);

  const handlePointerDown = (event) => {
    if (isListMode) {
      dragRef.current = {
        active: true,
        x: event.clientX,
        scrollLeft: scrollRef.current?.scrollLeft ?? 0,
        mode: 'list',
      };
      event.currentTarget.setPointerCapture?.(event.pointerId);
      return;
    }
    if (event.target.closest('.project-ring-toggle')) return;
    dragRef.current = { active: true, x: event.clientX, scrollLeft: 0, mode: 'ring' };
    velocityRef.current = 0;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.active) return;

    if (dragRef.current.mode === 'list') {
      if (scrollRef.current) {
        const delta = event.clientX - dragRef.current.x;
        scrollRef.current.scrollLeft = dragRef.current.scrollLeft - delta;
      }
      return;
    }

    const delta = event.clientX - dragRef.current.x;
    dragRef.current.x = event.clientX;
    velocityRef.current = delta * 0.08;
    setRotationValue(rotationRef.current + delta * 0.18);
  };

  const handlePointerUp = (event) => {
    dragRef.current.active = false;
    dragRef.current.mode = 'ring';
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handleWheel = (event) => {
    if (isListMode) {
      if (scrollRef.current) {
        event.preventDefault();
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        scrollRef.current.scrollLeft += delta;
      }
      return;
    }
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    velocityRef.current += Math.max(-1.2, Math.min(1.2, event.deltaY * 0.002));
  };

  const toggleListMode = () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);

    if (!isListMode) {
      setIsListMode(true);
      setTransitionState('to-list');
      transitionTimerRef.current = setTimeout(() => {
        rotationRef.current = 0;
        setTransitionState('idle');
        transitionTimerRef.current = null;
      }, 820);
      return;
    }

    setTransitionState('to-ring');
    setIsListMode(false);
    transitionTimerRef.current = setTimeout(() => {
      setTransitionState('idle');
      transitionTimerRef.current = null;
    }, 820);
  };

  if (!items.length) return null;

  const angleStep = 360 / items.length;
  const centerIndex = (items.length - 1) / 2;
  const shellClasses = [
    'project-ring-shell',
    isListMode ? 'is-list-mode' : '',
    transitionState !== 'idle' ? 'is-transitioning' : '',
    transitionState === 'to-list' ? 'is-unfurling' : '',
    transitionState === 'to-ring' ? 'is-refolding' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={shellClasses}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      <div className={`project-ring-center${isListMode || transitionState !== 'idle' ? ' is-hidden' : ''}`} aria-hidden="true">
        <span className="project-ring-kicker">{t('projects.subtitle', { count: items.length })}</span>
        <h2>{t('projects.title')}</h2>
      </div>

      <button
        type="button"
        className={`project-ring-toggle${isListMode ? ' is-active' : ''}`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={toggleListMode}
      >
        {isListMode ? 'Torna al Ring' : 'Esplora in Lista'}
      </button>

      <div ref={scrollRef} className={`project-ring-viewport${isListMode ? ' is-list-mode' : ''}`}>
        <div
          ref={stageRef}
          className={`project-ring-stage${isListMode ? ' is-list-mode' : ''}`}
          style={isListMode ? { width: `${trackWidth}px` } : undefined}
        >
          {items.map((project, index) => {
          const baseAngle = index * angleStep;
          const category = t(`projects.categories.${project.categoryKey}`);
          const offsetFromCenter = index - centerIndex;
          const distanceFromCenter = Math.abs(offsetFromCenter);
          const spreadOrder = Math.max(0, Math.ceil(distanceFromCenter - 0.5));
          const listLeft = listStart + (cardWidth / 2) + (index * listStep);
          const fanDepth = 118 - (distanceFromCenter * 2.1);
          const ringTransform = `rotateY(${baseAngle}deg) translateZ(var(--project-ring-radius))`;
          const fanTransform = `translate3d(0, 0, ${fanDepth}px) rotateZ(0deg)`;

          return (
            <article
              key={project.key}
              className={`project-ring-card${isListMode ? ' is-list-item' : ''}`}
              style={{
                '--accent': project.color.accent,
                '--wash': project.color.wash,
                '--list-left': `${listLeft}px`,
                '--deal-order': spreadOrder,
                zIndex: String(200 - Math.round(distanceFromCenter)),
                transform: isListMode ? fanTransform : ringTransform,
              }}
              >
                <div className="project-ring-card-media">
                  <img src={project.image} alt="" loading="lazy" draggable="false" />
                  <span>{project.year}</span>
                </div>

                <div className="project-ring-card-body">
                  <div className="project-ring-card-meta">
                    <span>{category}</span>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3>{project.n}</h3>
                  <p>{project.desc}</p>
                  <div className="project-ring-tags">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {!isListMode && transitionState === 'idle' && <div className="project-ring-orbit-line" aria-hidden="true" />}
    </div>
  );
}
