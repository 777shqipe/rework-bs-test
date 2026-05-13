import { Inter, VT323, Share_Tech_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const vt323 = VT323({ subsets: ['latin'], weight: '400', display: 'swap' });
const shareTechMono = Share_Tech_Mono({ subsets: ['latin'], weight: '400', display: 'swap' });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Locale-agnostic root metadata. Per-locale metadata is generated in app/[locale]/layout.jsx.
export const metadata = {
  metadataBase: new URL('https://backsoftware.it'),
  authors: [{ name: 'Back Software', url: 'https://backsoftware.it' }],
  creator: 'Back Software',
  publisher: 'Back Software',
  category: 'business',
  classification: 'Web Agency, Digital Marketing, Software Development',
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'GOOGLE_SEARCH_CONSOLE_CODE_HERE',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.className} ${vt323.className} ${shareTechMono.className}`} suppressHydrationWarning>
        <Script src="/sync-lang.js" strategy="beforeInteractive" />
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}`} />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
