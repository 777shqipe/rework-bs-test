export const locales = ['it', 'en', 'es', 'fr'];
export const defaultLocale = 'it';

export function isValidLocale(locale) {
  return locales.includes(locale);
}
