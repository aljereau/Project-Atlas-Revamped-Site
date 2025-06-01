import type { Metadata } from 'next'
import { Inter, Crimson_Text } from 'next/font/google'
import './globals.css'
import { ModalProvider } from '@/components/modals/ModalProvider'
import Navigation from '@/components/navigation/Navigation'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const crimsonText = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson'
})

export const metadata: Metadata = {
  title: 'Atlas - Real Estate Intelligence Lab',
  description: 'Building tools for real estate intelligence and market analysis. Dashboard-style interface for the Atlas product lab.',
  keywords: ['real estate', 'intelligence', 'tools', 'analytics', 'dashboard'],
  authors: [{ name: 'Atlas Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable}`}>
      <body className="font-sans bg-paper-cream text-text-primary antialiased">
        <ModalProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </ModalProvider>
      </body>
    </html>
  )
} 