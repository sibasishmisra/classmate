import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SessionProvider, SettingsProvider } from '@/contexts';
import ErrorBoundary from '@/components/ErrorBoundary';
import SoundInitializer from '@/components/SoundInitializer';

export const metadata: Metadata = {
  title: 'ClassMate.info - Learn Anything, Simply Explained',
  description:
    'AI-powered educational explanations for students ages 9-14. Get clear, age-appropriate answers to any topic.',
  keywords: [
    'education',
    'learning',
    'AI tutor',
    'student help',
    'homework help',
  ],
  authors: [{ name: 'ClassMate.info' }],
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
