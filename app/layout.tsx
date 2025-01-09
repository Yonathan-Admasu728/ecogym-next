import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import Image from 'next/image'

import Footer from './components/Footer'
import Header from './components/Header'
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
          <div className="flex flex-col min-h-screen">
            <div className="fixed inset-0 -z-10 bg-[#0B1120]">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent"></div>
              <Image
                src="/images/pattern.svg"
                alt="Background pattern"
                fill
                priority
                style={{ objectFit: "cover" }}
                className="opacity-[0.02] mix-blend-screen"
              />
            </div>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
