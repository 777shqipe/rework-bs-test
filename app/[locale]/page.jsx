import { locales } from '../../lib/i18n';
import HomePageWrapper from '../../components/HomePageWrapper';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function HomePage() {
  return <HomePageWrapper />;
}
