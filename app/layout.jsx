import './globals.css';

export const metadata = {
  title: 'Back Software - Soluzioni Digitali su Misura',
  description: 'Back Software offre soluzioni digitali complete e personalizzate. Siti web, applicazioni, marketing digitale e molto altro. Studio digitale a Ivrea (TO).',
  keywords: ['siti web', 'marketing digitale', 'software su misura', 'Back Software', 'Ivrea', 'sviluppo web', 'grafica', 'video'],
  authors: [{ name: 'Back Software' }],
  creator: 'Back Software',
  metadataBase: new URL('https://backsoftware.it'),
  openGraph: {
    title: 'Back Software - Soluzioni Digitali su Misura',
    description: 'Tecnologia che semplifica, non complica. Costruiamo il tuo progetto come se fosse il nostro.',
    url: 'https://backsoftware.it',
    siteName: 'Back Software',
    locale: 'it_IT',
    type: 'website',
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
              '@type': 'ProfessionalService',
              name: 'Back Software',
              description: 'Soluzioni digitali su misura: siti web, marketing, grafica, video e software personalizzato.',
              url: 'https://backsoftware.it',
              telephone: '+393513052627',
              email: 'info@backsoftware.it',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Ivrea',
                addressRegion: 'TO',
                addressCountry: 'IT',
              },
              sameAs: [],
              serviceType: ['Web Development', 'Digital Marketing', 'Graphic Design', 'Video Production', 'Custom Software'],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
