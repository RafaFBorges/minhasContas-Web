"use client"

import { createContext, useContext, ReactNode, useState } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { FaPaintBrush as ThemeIcon, FaGlobe as LanguageIcon } from 'react-icons/fa'

import ThemeButton from '../../components/themeButton'
import { LanguageOption, useTranslate } from './translateHook'
import { saveCookie } from '@/app/actions/cookiesManager'
import { THEME_KEY } from '../DataConstants'

export enum ThemeOptions {
  LIGHT = 'light',
  DARK = 'dark',
}

const LIGHT_CONFIG = {
  color: '#0070f3',
  backgroundColor: '#fff',
  fontSize: '16',
  fontColor: '#121212ff',
  disabledFontColor: '#555',
  cardBackground: '#fff',
  tagDefaultColor: '#1439dcff',
  GainSideColor: '#00D84C',
  NeutralSidedColor: '#727272ff',
  LossSideColor: '#ff0839ff',
}

const DARK_CONFIG = {
  color: '#328f16ff',
  backgroundColor: '#121212ff',
  fontSize: '16',
  fontColor: '#fff',
  disabledFontColor: '#808080',
  cardBackground: '#1d1d1d',
  tagDefaultColor: '#dc143cff',
  GainSideColor: '#54f523ff',
  NeutralSidedColor: '#727272ff',
  LossSideColor: '#ff4757ff',
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

interface ThemeContextType {
  setTheme: (newTheme: ThemeOptions) => Promise<void>;
  config: ThemeStyleProps;
}

export interface ThemeStyleProps {
  color: string;
  backgroundColor: string;
  fontSize: string | number;
  fontColor: string;
  disabledFontColor: string;
  cardBackground: string;
  tagDefaultColor: string;
  LossSideColor: string;
  NeutralSidedColor: string;
  GainSideColor: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

export function ThemeProvider({ children, theme }: { children: ReactNode, theme: string | undefined }) {
  const [settedTheme, setSettedTheme] = useState<ThemeOptions>(() => loadTheme(theme, true))
  const [config, setConfig] = useState<ThemeStyleProps>(() => loadConfig(theme))
  const { language, setLang } = useTranslate()

  function setLightTheme() {
    setConfig(LIGHT_CONFIG)
  }

  function setDarkTheme() {
    setConfig(DARK_CONFIG)
  }

  function isValidTheme(theme: string): boolean {
    return Object.values(ThemeOptions).includes(theme as ThemeOptions)
  }

  async function setTheme(newTheme: ThemeOptions) {
    if (!isValidTheme(newTheme) || newTheme == settedTheme) {
      console.log('ThemeProvider.setTheme > [ERROR] setted=' + settedTheme + ' new=' + newTheme)
      return
    }

    setSettedTheme(newTheme)
    localStorage.setItem(THEME_KEY, newTheme)
    await saveCookie(THEME_KEY, newTheme)

    if (newTheme == ThemeOptions.LIGHT)
      setLightTheme()
    else if (newTheme == ThemeOptions.DARK)
      setDarkTheme()

    console.log('ThemeProvider.setTheme > [CHANGED] setted=' + settedTheme + ' new=' + newTheme)
  }

  function themeToConfig(themeOption: ThemeOptions): ThemeStyleProps {
    switch (themeOption) {
      case ThemeOptions.LIGHT: return LIGHT_CONFIG
      case ThemeOptions.DARK: return DARK_CONFIG
      default: return LIGHT_CONFIG
    }
  }

  function loadTheme(lastValue: string | undefined, log: boolean = false): ThemeOptions {
    if (lastValue != null && isValidTheme(lastValue)) {
      if (log)
        console.log('ThemeProvider.loadTheme > [LOADED] theme=' + lastValue)

      return lastValue as ThemeOptions
    } else if (log) {
      console.log('ThemeProvider.loadTheme > [INVALID] theme=' + lastValue)
    }

    return ThemeOptions.LIGHT
  }

  function loadConfig(lastValue: string | undefined): ThemeStyleProps {
    return themeToConfig(loadTheme(lastValue))
  }

  return <ThemeContext.Provider
    value={{
      setTheme,
      config,
    }}
  >
    <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ ...styles.body, backgroundColor: config.backgroundColor }}>
      <div style={styles.row}>
        <ThemeButton
          isSecondary
          borderRadius='8px'
          iconSize='16'
          clickHandle={async () => {
            if (language == LanguageOption.PT_BR)
              await setLang(LanguageOption.EN)
            else
              await setLang(LanguageOption.PT_BR)
          }}
          Icon={LanguageIcon}
        />
        <ThemeButton
          isSecondary
          borderRadius='8px'
          iconSize='16'
          clickHandle={async () => {
            if (settedTheme == ThemeOptions.LIGHT)
              await setTheme(ThemeOptions.DARK)
            else
              await setTheme(ThemeOptions.LIGHT)
          }}
          Icon={ThemeIcon}
        />
      </div>
      {children}
    </body>
  </ThemeContext.Provider>
}

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  row: {
    flexGrow: 0,
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    gap: '0.5em',
    padding: '0.4em 1em',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}
