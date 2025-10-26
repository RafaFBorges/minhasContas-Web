"use client"

import { createContext, useContext, ReactNode, useState } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { FaPaintBrush } from 'react-icons/fa'

import ThemeButton from '../../components/themeButton'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

interface ThemeContextType {
  setTheme: (newTheme: ThemeOptions) => void;
  config: ThemeStyleProps;
}

export interface ThemeStyleProps {
  color: string;
  backgroundColor: string;
  fontSize: string | number;
  fontColor: string;
}

export enum ThemeOptions {
  LIGHT = 'light',
  DARK = 'dark',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

const LIGHT_CONFIG = {
  color: '#0070f3',
  backgroundColor: '#fff',
  fontSize: '16',
  fontColor: '#121212ff',
}

const DARK_CONFIG = {
  color: '#328f16ff',
  backgroundColor: '#121212ff',
  fontSize: '16',
  fontColor: '#fff',
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settedTheme, setSettedTheme] = useState<ThemeOptions>(ThemeOptions.LIGHT)
  const [config, setConfig] = useState<ThemeStyleProps>(LIGHT_CONFIG)

  function setLightTheme() {
    setConfig(LIGHT_CONFIG)
  }

  function setDarkTheme() {
    setConfig(DARK_CONFIG)
  }

  function setTheme(newTheme: ThemeOptions) {
    console.log('ThemeProvider.setTheme: setted=' + settedTheme + ' new=' + newTheme)

    setSettedTheme(newTheme)

    if (newTheme == ThemeOptions.LIGHT)
      setLightTheme()
    else if (newTheme == ThemeOptions.DARK)
      setDarkTheme()
  }

  return <ThemeContext.Provider
    value={{
      setTheme,
      config,
    }}
  >
    <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ backgroundColor: config.backgroundColor }}>
      <div style={styles.row}>
        <ThemeButton
          isSecondary
          borderRadius='8px'
          iconSize='16'
          clickHandle={() => {
            if (settedTheme == ThemeOptions.LIGHT)
              setTheme(ThemeOptions.DARK)
            else
              setTheme(ThemeOptions.LIGHT)
          }}
          Icon={FaPaintBrush}
        />
      </div>
      {children}
    </body>
  </ThemeContext.Provider>
}

const styles: { [key: string]: React.CSSProperties } = {
  row: {
    width: '100%',
    display: 'flex',
    padding: '0.4em',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}
