import './globals.css'
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { AuthProvider } from './context/AuthContext'
import { ProgramProvider } from './context/ProgramContext'
import { ToastContainer } from 'react-toastify'
import Header from './components/Header'
import Footer from './components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'EcoGym - Transform Your Mind and Body',
  description: 'EcoGym offers expert-led meditation, mindfulness, and home workout programs to help you achieve holistic wellness, anytime and anywhere.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-darkBlue-900 text-white`}>
        <AuthProvider>
          <ProgramProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </ProgramProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
