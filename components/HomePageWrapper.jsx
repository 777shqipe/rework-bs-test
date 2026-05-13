'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ModernSite from './ModernSite';
import CinematicReveal from './CinematicReveal';

const TerminalExperience = dynamic(
  () => import('./TerminalExperience'),
  { ssr: false }
);

export default function HomePageWrapper() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [curtainDone, setCurtainDone] = useState(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem('curtainShown') === '1';
  });

  const handleCurtainComplete = () => {
    sessionStorage.setItem('curtainShown', '1');
    setCurtainDone(true);
  };

  return (
    <>
      {!curtainDone && <CinematicReveal onComplete={handleCurtainComplete} />}
      <ModernSite onSwitchToTerminal={() => setShowTerminal(true)} />
      {showTerminal && (
        <TerminalExperience onSwitchToModern={() => setShowTerminal(false)} />
      )}
    </>
  );
}
