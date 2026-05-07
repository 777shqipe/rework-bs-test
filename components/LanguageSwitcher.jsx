'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { locales } from '../lib/i18n';

const localeLabels = {
  it: 'IT',
  en: 'EN',
  es: 'ES',
  fr: 'FR',
};

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = params.locale || 'it';

  const handleLocaleChange = (newLocale) => {
    if (newLocale === currentLocale) return;
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex items-center rounded-full bg-[#f8f4ec]/60 p-0.5 border border-[#d8d0c1]/50">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLocaleChange(locale)}
          className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full transition-all duration-200 ${
            currentLocale === locale
              ? 'bg-[#3d38281a] text-[#3d3828] shadow-sm'
              : 'text-[#8a7f6a] hover:text-[#3d3828]'
          }`}
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  );
}
