"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { FaUser as UserIcon } from 'react-icons/fa'
import { FiMoon as DarkTheme, FiSun as LightTheme } from 'react-icons/fi'

import ptImage from '../../src/assets/ptBr.png'
import engImage from '../../src/assets/en.png'

import { LanguageOption, useTranslate } from './translateHook'
import { saveCookie, saveObjectCookie } from '@/app/actions/cookiesManager'
import { THEME_KEY, USER_COOKIE_KEY } from '../DataConstants'
import { getSideColor } from '../colors'
import WindowButton from '../../components/windowButton'
import ThemeToggle from '../../components/themeComponents/themeToggle'
import ThemeText from '../../components/themeComponents/themeText'
import { useUser } from './userHook'
import { useRouter } from 'next/navigation'

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
  borderColor: '#555',
  enabledColor: '#00D84C',
  disabledColor: '#727272ff',
  iconColor: '#999999',
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
  borderColor: '#808080',
  enabledColor: '#00D84C',
  disabledColor: '#727272ff',
  iconColor: '#eed7b8',
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
  sideColor: (value: number) => string;
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
  borderColor: string;
  enabledColor: string;
  disabledColor: string;
  iconColor: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

export function ThemeProvider({ children, theme }: { children: ReactNode, theme: string | undefined }) {
  const TR_LANGUAGE_KEY = 'TR.ThemeProvider.Language'
  const TR_THEME_KEY = 'TR.ThemeProvider.Theme'
  const TR_LOGOUT_KEY = 'TR.ThemeProvider.Logout'


  const { language, setLang, addKey, getValue } = useTranslate()
  const { userInfo, logout } = useUser()
  const router = useRouter()

  const [settedTheme, setSettedTheme] = useState<ThemeOptions>(() => loadTheme(theme, true))
  const [config, setConfig] = useState<ThemeStyleProps>(() => loadConfig(theme))

  function translate() {
    addKey(TR_THEME_KEY, 'tema', LanguageOption.PT_BR)
    addKey(TR_THEME_KEY, 'theme', LanguageOption.EN)
    addKey(TR_LANGUAGE_KEY, 'idioma', LanguageOption.PT_BR)
    addKey(TR_LANGUAGE_KEY, 'language', LanguageOption.EN)
    addKey(TR_LOGOUT_KEY, 'Logout', LanguageOption.PT_BR)
    addKey(TR_LOGOUT_KEY, 'Logout', LanguageOption.EN)
  }

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

  function sideColor(value: number) {
    return getSideColor(value, config)
  }

  async function doLogout() {
    await logout()
    console.log('Logout > [sucesses]')

    router.push('/home')
  }

  useEffect(() => {
    translate()
  }, [])

  return <ThemeContext.Provider
    value={{
      setTheme,
      config,
      sideColor,
    }}
  >
    <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ ...styles.body, backgroundColor: config.backgroundColor }}>
      <div style={styles.row}>
        <WindowButton
          isSecondary
          borderRadius='8px'
          iconSize='16'
          Icon={UserIcon}
          Menu={() => {
            return <div style={styles.menuContainer}>
              {userInfo.user && <ThemeText>{userInfo.user}</ThemeText>}
              <ThemeToggle
                name={getValue(TR_LANGUAGE_KEY)}
                enabled={language == LanguageOption.PT_BR}
                clickHandle={async () => {
                  if (language == LanguageOption.PT_BR)
                    await setLang(LanguageOption.EN)
                  else
                    await setLang(LanguageOption.PT_BR)
                }}
                enableImage={ptImage}
                disableImage={engImage}
                isImagePriority
              />
              <ThemeToggle
                name={getValue(TR_THEME_KEY)}
                enabled={settedTheme == ThemeOptions.LIGHT}
                clickHandle={async () => {
                  if (settedTheme == ThemeOptions.LIGHT)
                    await setTheme(ThemeOptions.DARK)
                  else
                    await setTheme(ThemeOptions.LIGHT)
                }}
                EnableIcon={LightTheme}
                DisableIcon={DarkTheme}
                disabledColor={'#3f3f3f'}
                color={'#e1eb5b'}
                enableIconColor={'#1d1d1d'}
              />
              {userInfo.user && <ThemeText showHoover noWrap onClick={doLogout}>{getValue(TR_LOGOUT_KEY)}</ThemeText>}
            </div>
          }}
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
  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }
}
