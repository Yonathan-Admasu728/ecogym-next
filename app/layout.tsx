import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import Image from 'next/image'

import Footer from './components/Footer'
import HeaderWrapper from './components/HeaderWrapper'
import { metadata } from './metadata'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
})

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-body`}>
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
            <HeaderWrapper />
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
