import './globals.css';

export const metadata = {
  title: {
    default: 'Back Software | Siti Web, Marketing & Software su Misura - Ivrea (TO)',
    template: '%s | Back Software',
  },
  description: 'Agenzia digitale a Ivrea (Torino). Realizziamo siti web professionali, campagne marketing Meta/Google Ads, software gestionali su misura, servizi foto e video. Soluzioni concrete per far crescere il tuo business.',
  keywords: [
    'siti web Ivrea', 'agenzia web Torino', 'marketing digitale',
    'software su misura', 'siti web aziendali', 'Meta Ads', 'Google Ads',
    'realizzazione siti web', 'gestionali personalizzati', 'foto video aziendale',
    'sviluppo web Piemonte', 'web agency Canavese'
  ],
  authors: [{ name: 'Back Software', url: 'https://backsoftware.it' }],
  creator: 'Back Software',
  publisher: 'Back Software',
  metadataBase: new URL('https://backsoftware.it'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Back Software | Siti Web, Marketing & Software su Misura',
    description: 'Tecnologia che semplifica, non complica. Costruiamo il tuo progetto come se fosse il nostro. Agenzia digitale a Ivrea, Torino.',
    url: 'https://backsoftware.it',
    siteName: 'Back Software',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Back Software - Soluzioni Digitali su Misura',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Back Software | Siti Web, Marketing & Software su Misura',
    description: 'Agenzia digitale a Ivrea (Torino). Siti web, marketing, software su misura.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'business',
  classification: 'Web Agency, Digital Marketing, Software Development',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=VT323&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'LocalBusiness',
                  '@id': 'https://backsoftware.it/#business',
                  name: 'Back Software',
                  description: 'Agenzia digitale specializzata in siti web, marketing digitale, software su misura, foto e video. Soluzioni concrete per far crescere il tuo business a Ivrea e in tutto il Piemonte.',
                  url: 'https://backsoftware.it',
                  telephone: '+393513052627',
                  email: 'info@backsoftware.it',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Via Ivrea, 10015 Ivrea',
                    addressLocality: 'Ivrea',
                    addressRegion: 'TO',
                    postalCode: '10015',
                    addressCountry: 'IT',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: '45.4668',
                    longitude: '7.8742',
                  },
                  sameAs: [
                    'https://www.instagram.com/backsoftware/',
                    'https://www.linkedin.com/company/backsoftware',
                    'https://www.facebook.com/backsoftware',
                  ],
                  serviceType: [
                    'Realizzazione Siti Web',
                    'Marketing Digitale e Meta/Google Ads',
                    'Software e Gestionali su Misura',
                    'Servizi Foto e Video',
                    'Grafica e Brand Identity',
                  ],
                  areaServed: {
                    '@type': 'GeoCircle',
                    geoMidpoint: {
                      '@type': 'GeoCoordinates',
                      latitude: '45.4668',
                      longitude: '7.8742',
                    },
                    geoRadius: '50000',
                  },
                  priceRange: '€€',
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                      opens: '09:00',
                      closes: '18:00',
                    },
                  ],
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Servizi Digitali',
                    itemListElement: [
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Siti Web e Landing Page',
                          description: 'Siti web professionali e landing page ottimizzate per conversioni',
                        },
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Marketing e Pubblicità Online',
                          description: 'Campagne Meta Ads, Google Ads e strategie marketing digitale',
                        },
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Software su Misura',
                          description: 'Gestionali personalizzati, applicazioni web e integrazioni API',
                        },
                      },
                    ],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://backsoftware.it/#website',
                  url: 'https://backsoftware.it',
                  name: 'Back Software',
                  publisher: {
                    '@id': 'https://backsoftware.it/#business',
                  },
                },
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Home',
                      item: 'https://backsoftware.it',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Servizi',
                      item: 'https://backsoftware.it/#servizi',
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: 'Progetti',
                      item: 'https://backsoftware.it/#progetti',
                    },
                    {
                      '@type': 'ListItem',
                      position: 4,
                      name: 'Contatti',
                      item: 'https://backsoftware.it/#contatti',
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
