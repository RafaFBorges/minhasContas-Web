"use client"

import { createContext, useContext, ReactNode, useState } from 'react'

import { FaPaintBrush } from 'react-icons/fa'
import ThemeButton from '../../components/themeButton'

interface ThemeContextType {
  setTheme: (newTheme: ThemeOptions) => void;
  config: ThemeStyleProps;
}

export interface ThemeStyleProps {
  color: string;
  backgroundColor: string;
  fontSize: string | number;
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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settedTheme, setSettedTheme] = useState<ThemeOptions>(ThemeOptions.LIGHT)
  const [config, setConfig] = useState<ThemeStyleProps>({
    color: '#328f16ff',
    backgroundColor: '#0070f3',
    fontSize: '16',
  })

  function setLightTheme() {
    setConfig({
      color: '#0070f3',
      backgroundColor: '#fff',
      fontSize: '16',
    })
  }

  function setDarkTheme() {
    setConfig({
      color: '#328f16ff',
      backgroundColor: '#3a3a3aff',
      fontSize: '16',
    })
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
