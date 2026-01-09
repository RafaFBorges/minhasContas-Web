import type { Metadata } from 'next'

import './globals.css'
import getCookie from './actions/cookiesManager'

import { ModalProvider } from '../../utils/hook/modalHook'
import { ThemeProvider } from '../../utils/hook/themeHook'
import { TranslateProvider } from '../../utils/hook/translateHook'
import { LANG_KEY, THEME_KEY } from '../../utils/DataConstants'
import { UserProvider } from '../../utils/hook/userHook'

export const metadata: Metadata = {
  title: { default: 'Minhas Contas', template: '%s | Minhas Contas' },
  description: "Visualize, organize e controle de seus gastos",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await getCookie(THEME_KEY)
  const initialLanguage = await getCookie(LANG_KEY)

  return <TranslateProvider lang={initialLanguage}>
    <ThemeProvider theme={initialTheme}>
      <UserProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </UserProvider>
    </ThemeProvider>
  </TranslateProvider>
}
