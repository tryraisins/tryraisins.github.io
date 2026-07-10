import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { PersonSchema, WebsiteSchema, CollectionSchema } from '@/components/schema';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = 'https://tryraisins.dev';
const TITLE = 'Seun Sowemimo (TryRaisins) — Fullstack Web Developer';
const DESCRIPTION =
  'Portfolio of Seun (Oluwaseun) Sowemimo — TryRaisins — a Fullstack Web Developer in Lagos, Nigeria with 5+ years of experience in React, TypeScript, Node.js, and Python.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s — TryRaisins',
  },
  description: DESCRIPTION,
  keywords: [
    'Seun Sowemimo',
    'Oluwaseun Sowemimo',
    'TryRaisins',
    'Fullstack Developer',
    'Web Developer',
    'React Developer',
    'TypeScript',
    'Node.js',
    'Python',
    'Frontend Developer',
    'Backend Developer',
    'JavaScript',
    'Portfolio',
    'Lagos Nigeria Developer',
  ],
  authors: [{ name: 'Seun Sowemimo', url: SITE_URL }],
  creator: 'Seun Sowemimo',
  publisher: 'Seun Sowemimo',
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'TryRaisins Portfolio',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Seun Sowemimo — Fullstack Web Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@tryraisins',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  manifest: '/manifest.webmanifest',
  other: {
    'geo.region': 'NG',
    'geo.placename': 'Lagos, Nigeria',
    'format-detection': 'telephone=no',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <PersonSchema />
        <WebsiteSchema />
        <CollectionSchema />
      </head>
      <body className="font-sans bg-ink-950 text-bone-50 antialiased selection:bg-coral-500/30 selection:text-bone-50">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-coral-500 focus:text-ink-950 focus:rounded"
        >
          Skip to main content
        </a>
        {children}

        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "vgp526jgr5");`}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YMCW9KY30X"
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YMCW9KY30X');`}
        </Script>
      </body>
    </html>
  );
}
