import type { Metadata } from 'next'
import './globals.css'
import { ModalProvider } from '../../utils/hook/modalHook'
import { ThemeProvider } from '../../utils/hook/themeHook'

export const metadata: Metadata = {
  title: "Minhas Contas",
  description: "Visualize, organize e controle de seus gastos",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </ThemeProvider>
    </html>
  )
}
