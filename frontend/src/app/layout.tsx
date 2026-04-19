import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/auth';
import CrisisBanner from '../components/layout/CrisisBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Whisper - Your Safe Space',
  description:
    'A companion app for teens to journal, check in, and find support.',
  keywords: ['mental health', 'teen support', 'journal', 'crisis support'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <AuthProvider>
          <CrisisBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
