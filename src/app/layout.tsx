import '@/app/globals.css';
import { Inter } from 'next/font/google'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { Providers } from './providers'
import type { Metadata } from 'next'
import CustomToaster from '@/components/common/CustomToaster'

export const metadata: Metadata = {
  title: {
    template: '%s | Ole Emil Øygarden',
    default: 'Ole Emil Øygarden - Fullstack Utvikler'
  },
  description: 'Fullstack utvikler med fokus på moderne webutvikling og brukeropplevelse.',
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    url: 'https://oleemil.no',
    siteName: 'Ole Emil Øygarden',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ole Emil Øygarden'
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body className="antialiased">
        <Providers>
          <Header />
          <div className="min-h-screen">
            {children}
          </div>
          <Footer />
        </Providers>
        <CustomToaster />
      </body>
    </html>
  );
}