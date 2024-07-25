// app/layout.tsx
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { ProgramProvider } from './context/ProgramContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ecogym.space'),
  title: {
    default: 'Eco Gym',
    template: '%s | Eco Gym'
  },
  description: 'Eco Gym: Elevate your fitness journey with top-rated coaches and curated guided meditations.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ecogym.space',
    siteName: 'Eco Gym',
    title: 'Eco Gym',
    description: 'Elevate your fitness journey with top-rated coaches and curated guided meditations. Discover a space for self-care and transformation.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Eco Gym',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eco Gym',
    description: 'Elevate your fitness journey with top-rated coaches and curated guided meditations. Discover a space for self-care and transformation.',
    images: ['/og-image.jpg'],
    creator: '@ecogym',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProgramProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <ToastContainer />
          </ProgramProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
