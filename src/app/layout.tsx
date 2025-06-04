import type { Metadata } from 'next'
import { Inter, Crimson_Text } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const crimsonText = Crimson_Text({ 
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-crimson'
})

export const metadata: Metadata = {
  title: 'Atlas Real Estate Intelligence Lab',
  description: 'Advanced analytics and intelligence tools for real estate professionals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${crimsonText.variable}`}>
            {children}
      </body>
    </html>
  )
} 