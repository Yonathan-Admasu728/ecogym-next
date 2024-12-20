import './globals.css'
import { Inter } from 'next/font/google'
import Image from 'next/image'

import Footer from './components/Footer'
import Header from './components/Header'
import { metadata } from './metadata'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen">
            <div className="fixed inset-0 -z-10">
              <Image
                src="/images/pattern.svg"
                alt="Background pattern"
                fill
                priority
                style={{ objectFit: "cover" }}
                className="opacity-5"
              />
            </div>
            <Header />
            <main className="pb-16">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
