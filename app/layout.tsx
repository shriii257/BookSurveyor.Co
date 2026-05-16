import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Booksurveyor.co',
  description: 'Find verified land surveyors near you across India.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
