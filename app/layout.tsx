import type { Metadata } from 'next';
import './globals.css'; // or whatever your global styles file is called

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.reedstar.store'),
  title: {
    default: 'Reedstar',
    template: '%s | Reedstar',
  },
  description:
    'Research, intelligence and ideas about how businesses are represented across the public web.',
  openGraph: {
    type: 'website',
    siteName: 'Reedstar',
    title: 'Reedstar',
    description:
      'Research, intelligence and ideas about the public web.',
    url: 'https://blog.reedstar.store',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourhandle', // optional: replace with your X handle if you have one
  },
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
