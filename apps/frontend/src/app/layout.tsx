import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Gestão Confeitaria',
  description: 'Sistema de gestão para confeitaria artesanal',
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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
