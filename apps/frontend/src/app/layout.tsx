import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

// Plus Jakarta Sans: Display & Headlines (Stitch spec)
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
})

// Inter: Body & Labels (Stitch spec)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Gestão Confeitaria | O Ateliê Digital',
  description: 'Sistema artesanal de gestão para confeitarias premium. Pedidos e receitas em um só lugar.',
  keywords: ['confeitaria', 'gestão', 'pedidos', 'receitas'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" className={`${jakartaSans.variable} ${inter.variable}`}>
        <body style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
