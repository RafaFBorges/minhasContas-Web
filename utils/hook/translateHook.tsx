"use client"

import { createContext, useContext, ReactNode, useState, useRef } from 'react'
import { saveCookie } from '@/app/actions/cookiesManager'

import { LANG_KEY } from '../DataConstants'

type TranslateType = {
  [key: string]: string;
}

export enum LanguageOption {
  PT_BR = 'pt-BR',
  EN = 'en',
}

interface TranslateContextType {
  addKey: (key: string, value: string, lang?: string) => void;
  getValue: (key: string) => string;
  language: LanguageOption;
  setLang: (newLanguage: LanguageOption) => void;
}

const TranslateContext = createContext<TranslateContextType | undefined>(undefined)

export function useTranslate() {
  const context = useContext(TranslateContext)
  if (!context)
    throw new Error('useTranslate must be used within a TranslateProvider')

  return context
}

export function TranslateProvider({ children, lang }: { children: ReactNode, lang: string | undefined }) {
  const dictionary = useRef<TranslateType>({})
  const [language, setLanguage] = useState<LanguageOption>(loadLanguage(lang))
  const validValues = Object.values(LanguageOption)

  function addKey(key: string, value: string, lang: string = '') {
    if (key == '')
      throw new Error('Key is empty')

    if (dictionary.current[key] != undefined)
      throw new Error('Key has already setted.')

    const aLang: string = lang != '' ? lang : language
    const newDict: TranslateType = { ...dictionary.current }
    newDict[`${aLang}_${key}`] = value

    dictionary.current = newDict
  }

  function getValue(key: string): string {
    if (key == '')
      throw new Error('Key is empty')

    if (dictionary.current[key] != undefined)
      throw new Error('Key has never been setted.')

    return dictionary.current[`${language}_${key}`]
  }

  async function setLang(newLanguage: LanguageOption) {
    if (!validValues.includes(newLanguage))
      throw new Error('newLanguage is not in options.')

    setLanguage(newLanguage)
    localStorage.setItem(LANG_KEY, newLanguage)
    await saveCookie(LANG_KEY, newLanguage)
  }

  function isValidLanguage(theme: string): boolean {
    return Object.values(LanguageOption).includes(theme as LanguageOption)
  }

  function loadLanguage(lastValue: string | undefined): LanguageOption {
    if (lastValue != null && isValidLanguage(lastValue)) {
      console.log('TranslateProvider.loadLanguage > [LOADED] theme=' + lastValue)

      return lastValue as LanguageOption
    }

    console.log('TranslateProvider.loadLanguage > [INVALID] theme=' + lastValue)

    return LanguageOption.PT_BR
  }

  return <TranslateContext.Provider
    value={{
      addKey,
      getValue,
      language,
      setLang,
    }}
  >
    <html lang={language}>
      {children}
    </html>
  </TranslateContext.Provider>
}
