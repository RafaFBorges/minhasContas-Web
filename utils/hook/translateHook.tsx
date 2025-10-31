"use client"

import { createContext, useContext, ReactNode, useState, useRef } from 'react'


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

export function TranslateProvider({ children }: { children: ReactNode }) {
  const dictionary = useRef<TranslateType>({})
  const [language, setLanguage] = useState<LanguageOption>(LanguageOption.PT_BR)
  const validValues = Object.values(LanguageOption)

  function addKey(key: string, value: string, lang: string = '') {
    if (key == '')
      throw new Error('Key is empty')

    if (dictionary.current[key] != undefined)
      throw new Error('Key has already setted.')

    const aLang: string = lang != '' ? lang : language
    let newDict : TranslateType = { ...dictionary.current }
    newDict[`${aLang}_${key}`] = value

    dictionary.current = newDict
  }

  function getValue(key: string): string {
    if (key == '')
      throw new Error('Key is empty')

    if (dictionary.current[key] != undefined)
      throw new Error('Key has never been setted.')
    console.log(JSON.stringify(dictionary, null, 2))
    return dictionary.current[`${language}_${key}`]
  }

  function setLang(newLanguage: LanguageOption) {
    if (!validValues.includes(newLanguage))
      throw new Error('newLanguage is not in options.')

    setLanguage(newLanguage)
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
