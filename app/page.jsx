'use client';

import { useEffect } from 'react';
import { defaultLocale, locales } from '../lib/i18n';

export default function RootPage() {
  useEffect(() => {
    try {
      const preferred = (navigator.languages || [navigator.language || ''])
        .map((l) => l.toLowerCase().split('-')[0])
        .find((l) => locales.includes(l));
      const target = preferred || defaultLocale;
      window.location.replace(`/${target}/`);
    } catch {
      window.location.replace(`/${defaultLocale}/`);
    }
  }, []);

  return (
    <meta httpEquiv="refresh" content={`0;url=/${defaultLocale}/`} />
  );
}
