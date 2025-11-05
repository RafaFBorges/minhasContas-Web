import type { Metadata } from 'next'
import './globals.css'
import { ModalProvider } from '../../utils/hook/modalHook'
import { ThemeProvider } from '../../utils/hook/themeHook'
import { TranslateProvider } from '../../utils/hook/translateHook'

export const metadata: Metadata = {
  title: { default: 'Minhas Contas', template: '%s | Minhas Contas' },
  description: "Visualize, organize e controle de seus gastos",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TranslateProvider>
    <ThemeProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </ThemeProvider>
  </TranslateProvider>
}
