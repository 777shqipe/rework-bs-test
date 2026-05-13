# Mobile Scroll & Section Fix Plan

## 1. CSS: `app/globals.css`

### 1a. Snap fallback — change mandatory→proximity, always→normal, add hero-snap-anchor

Find block at ~line 293:
```css
@media (hover: none) and (pointer: coarse) {
  .modern-snap-container {
    scroll-snap-type: y mandatory;
  }
  .modern-snap-section {
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
}
```

Replace with:
```css
@media (hover: none) and (pointer: coarse) {
  .modern-snap-container {
    scroll-snap-type: y proximity;
  }
  .modern-snap-section {
    scroll-snap-align: start;
    scroll-snap-stop: normal;
  }
  .hero-snap-anchor {
    scroll-snap-align: start;
    scroll-snap-stop: normal;
  }
}
```

### 1b. Add hero-snap-anchor rule (after `.modern-snap-section` block, before `.modern-snap-section.snap-scroll-inner`)

```css
.hero-snap-anchor {
  min-height: 100dvh;
  height: 100dvh;
  flex-shrink: 0;
  overflow: hidden;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

---

## 2. Hero JSX: `components/ModernSite.jsx` (~line 1685)

### 2a. Add hero-snap-anchor class

Find:
```jsx
<motion.section ref={heroRef} variants={itemVariants} className="flex items-center justify-center relative px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ minHeight: '100dvh', height: '100dvh' }}>
```

Replace with:
```jsx
<motion.section ref={heroRef} variants={itemVariants} className="hero-snap-anchor flex items-center justify-center relative px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ minHeight: '100dvh', height: '100dvh' }}>
```

---

## 3. Hero useEffect: No pin on mobile

Find the entire Hero useEffect block starting with:
```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;
```

And the `ctx = gsap.context(() => {` block that creates the ScrollTrigger timeline.

Replace the entire `gsap.context(() => { ... }, heroSection)` block to have conditional logic:

If mobile → simple fade-in timeline WITHOUT pin/ScrollTrigger
If desktop → existing pin + scrub ScrollTrigger

The mobile animation:
```js
if (isMobile) {
  // Mobile: simple fade-in, no pin
  const tl = gsap.timeline({ delay: 0.2 });

  if (h1Chars && h1Chars.length > 0) {
    tl.from(h1Chars, {
      opacity: 0, y: 30, scale: 1.05,
      transformOrigin: 'center center',
      ease: 'power2.out',
      stagger: { amount: 0.3, from: 'start' },
    }, 0);
  }

  if (subChars && subChars.length > 0) {
    tl.from(subChars, {
      opacity: 0, y: 20,
      ease: 'power2.out',
      stagger: { amount: 0.2, from: 'start' },
    }, 0.15);
  }

  tl.to(bgChars, {
    opacity: 0, x: -60, rotationY: -20, scale: 0.6,
    transformPerspective: 600, transformOrigin: 'left center',
    ease: 'power2.in',
    stagger: { amount: 0.3, from: 'end' },
  }, 0.2);

} else {
  // Desktop: existing ScrollTrigger pin + scrub animation (UNCHANGED)
  const pinDistance = '+=200%';
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection, scroller,
      start: 'top top', end: pinDistance,
      pin: true, scrub: 0.5,
      snap: { snapTo: [0, 0.5, 1], duration: 0.35, ease: 'power2.out' },
    },
  });

  if (h1Chars && h1Chars.length > 0) {
    tl.from(h1Chars, {
      opacity: 0, y: (i) => i % 2 === 0 ? -80 : 80,
      scale: 1.2,
      rotationZ: (i) => i % 2 === 0 ? gsap.utils.random(-6, -2) : gsap.utils.random(2, 6),
      transformOrigin: 'center center',
      ease: 'power2.out',
      stagger: { amount: 0.45, from: 'start' },
    }, 0);
  }

  if (subChars && subChars.length > 0) {
    tl.from(subChars, {
      opacity: 0, y: (i) => i % 2 === 0 ? -50 : 50,
      scale: 1.1,
      rotationZ: (i) => i % 2 === 0 ? gsap.utils.random(-4, -1) : gsap.utils.random(1, 4),
      transformOrigin: 'center center',
      ease: 'power2.out',
      stagger: { amount: 0.35, from: 'start' },
    }, 0.1);
  }

  tl.to(bgChars, {
    opacity: 0, x: -200, rotationY: -55, scale: 0.4,
    transformPerspective: 600, transformOrigin: 'left center',
    ease: 'power2.in',
    stagger: { amount: 0.4, from: 'end' },
  }, 0.35);

  ScrollTrigger.create({
    trigger: heroSection, scroller,
    start: 'top top', end: pinDistance,
    onLeave: () => {
      bgChars.forEach((char) => { char.style.willChange = 'auto'; });
      if (h1Chars) h1Chars.forEach((char) => { char.style.willChange = 'auto'; });
      if (subChars) subChars.forEach((char) => { char.style.willChange = 'auto'; });
    },
  });
}
```

---

## 4. Sections: Add snap-scroll-inner

### 4a. Progetti section (~line 1829)

Find:
```
className="modern-snap-section flex min-h-0 flex-col px-3 sm:px-6 lg:px-10 pt-20 pb-10 sm:pb-20"
```

Replace with:
```
className="modern-snap-section snap-scroll-inner flex min-h-0 flex-col px-3 sm:px-6 lg:px-10 pt-20 pb-10 sm:pb-20"
```

### 4b. Contatti section (~line 1860)

Find:
```
className="modern-snap-section flex flex-col justify-center px-4 sm:px-6 lg:px-10 pt-16 pb-10 sm:py-20 relative"
```

Replace with:
```
className="modern-snap-section snap-scroll-inner flex flex-col justify-start px-4 sm:px-6 lg:px-10 pt-16 pb-10 sm:py-20 relative"
```

---

## 5. ThreeDCarousel: Increase radius cap

In `components/ThreeDCarousel.jsx`, find:
```js
return isMobile ? Math.min(base, vw * 0.46) : base;
```

Replace with:
```js
return isMobile ? Math.min(base, vw * 0.50) : base;
```

---

## 6. Build & verify

Run `npx next build` to verify.