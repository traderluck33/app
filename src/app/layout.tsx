import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CreatureQuest',
  description: 'Explore your city, catch creatures, find treasure!',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#1a1a2e] text-white h-[100dvh] flex flex-col overflow-hidden">
        {children}
      </body>
    </html>
  );
}
