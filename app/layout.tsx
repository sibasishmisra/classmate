import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SessionProvider, SettingsProvider } from '@/contexts';
import ErrorBoundary from '@/components/ErrorBoundary';
import SoundInitializer from '@/components/SoundInitializer';

export const metadata: Metadata = {
  title: 'Explain Like I\'m in 5th Grade - Simple AI Explanations | ClassMate.info',
  description:
    'Get any topic explained in simple, easy-to-understand language - just like you\'re in 5th grade! AI-powered explanations for students, adults, and curious minds. Free educational tool with instant answers.',
  keywords: [
    'explain like I\'m 5',
    'ELI5',
    'simple explanations',
    '5th grade level',
    'easy to understand',
    'AI tutor',
    'educational tool',
    'learn anything',
    'simple learning',
    'explain simply',
    'student help',
    'homework help',
    'AI teacher',
    'free education',
    'understand topics',
  ],
  authors: [{ name: 'ClassMate.info' }],
  openGraph: {
    title: 'Explain Like I\'m in 5th Grade - Simple AI Explanations',
    description: 'Get any topic explained in simple, easy-to-understand language. AI-powered explanations for everyone.',
    url: 'https://www.classmate.info',
    siteName: 'ClassMate.info',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explain Like I\'m in 5th Grade',
    description: 'Get any topic explained in simple, easy-to-understand language.',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a1a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <SettingsProvider>
            <SessionProvider>
              <SoundInitializer />
              {children}
            </SessionProvider>
          </SettingsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
