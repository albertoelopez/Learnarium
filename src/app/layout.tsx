import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vizloci - Memory Palace Learning',
  description: 'Learn faster using AI-powered memory palaces',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
