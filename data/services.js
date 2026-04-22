import React from 'react';

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

export function getServices(t) {
  return [
    {
      key: 'caseFamiglia',
      icon: <IconCasaFamiglia />,
      title: t('services.caseFamiglia.title'),
      desc: t('services.caseFamiglia.desc'),
      details: t('services.caseFamiglia.details'),
      packages: [
        { key: '6mesi', name: t('services.caseFamiglia.packages.6mesi.name'), desc: t('services.caseFamiglia.packages.6mesi.desc') },
        { key: '3mesi', name: t('services.caseFamiglia.packages.3mesi.name'), desc: t('services.caseFamiglia.packages.3mesi.desc') },
        { key: 'spot', name: t('services.caseFamiglia.packages.spot.name'), desc: t('services.caseFamiglia.packages.spot.desc') }
      ],
      span: 'md:col-span-2',
      source: 'servizi'
    },
    {
      key: 'sitiLanding',
      icon: <IconSitiLanding />,
      title: t('services.sitiLanding.title'),
      source: 'servizi',
      desc: t('services.sitiLanding.desc'),
      details: t('services.sitiLanding.details'),
      packages: [
        { key: '5-10', name: t('services.sitiLanding.packages.5-10.name'), desc: t('services.sitiLanding.packages.5-10.desc') },
        { key: 'landing', name: t('services.sitiLanding.packages.landing.name'), desc: t('services.sitiLanding.packages.landing.desc') }
      ],
      span: ''
    },
    {
      key: 'marketing',
      icon: <IconMarketing />,
      title: t('services.marketing.title'),
      source: 'servizi',
      desc: t('services.marketing.desc'),
      details: t('services.marketing.details'),
      packages: [
        { key: 'analisi', name: t('services.marketing.packages.analisi.name'), desc: t('services.marketing.packages.analisi.desc') },
        { key: 'meta', name: t('services.marketing.packages.meta.name'), desc: t('services.marketing.packages.meta.desc') },
        { key: 'google', name: t('services.marketing.packages.google.name'), desc: t('services.marketing.packages.google.desc') }
      ],
      span: ''
    },
    {
      key: 'fotoVideo',
      icon: <IconFotoVideo />,
      title: t('services.fotoVideo.title'),
      source: 'servizi',
      desc: t('services.fotoVideo.desc'),
      details: t('services.fotoVideo.details'),
      packages: [
        { key: 'foto', name: t('services.fotoVideo.packages.foto.name'), desc: t('services.fotoVideo.packages.foto.desc') },
        { key: 'drone', name: t('services.fotoVideo.packages.drone.name'), desc: t('services.fotoVideo.packages.drone.desc') },
        { key: 'staff', name: t('services.fotoVideo.packages.staff.name'), desc: t('services.fotoVideo.packages.staff.desc') }
      ],
      span: ''
    },
    {
      key: 'graficaCopy',
      icon: <IconGraficaCopy />,
      title: t('services.graficaCopy.title'),
      source: 'servizi',
      desc: t('services.graficaCopy.desc'),
      details: t('services.graficaCopy.details'),
      packages: [
        { key: 'grafica', name: t('services.graficaCopy.packages.grafica.name'), desc: t('services.graficaCopy.packages.grafica.desc') },
        { key: 'copy', name: t('services.graficaCopy.packages.copy.name'), desc: t('services.graficaCopy.packages.copy.desc') }
      ],
      span: ''
    },
    {
      key: 'software',
      icon: <IconDigitali />,
      title: t('services.software.title'),
      source: 'servizi',
      desc: t('services.software.desc'),
      details: t('services.software.details'),
      packages: [
        { key: 'gestionali', name: t('services.software.packages.gestionali.name'), desc: t('services.software.packages.gestionali.desc') },
        { key: 'app', name: t('services.software.packages.app.name'), desc: t('services.software.packages.app.desc') },
        { key: 'api', name: t('services.software.packages.api.name'), desc: t('services.software.packages.api.desc') }
      ],
      span: 'md:col-span-2'
    },
  ];
}
