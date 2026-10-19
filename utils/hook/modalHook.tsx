"use client"

import { ReactNode } from 'react'

import { useTheme } from './themeHook'
import { LanguageOption, useTranslate } from './translateHook'
import { ModalProvider as ModalProviderBase } from '@rafafborges/componentes'

export { useModal } from '@rafafborges/componentes'

export function ModalProvider({ children }: { children: ReactNode }) {
  const SAVE_KEY = 'Modal.Save'
  const CANCEL_KEY = 'Modal.Cancel'

  const { config } = useTheme()
  const { addKeys } = useTranslate()

  const saveLabel = addKeys(SAVE_KEY, [{ value: 'Salvar', lang: LanguageOption.PT_BR }, { value: 'Save', lang: LanguageOption.EN },])
  const cancelLabel = addKeys(CANCEL_KEY, [{ value: 'Cancelar', lang: LanguageOption.PT_BR }, { value: 'Cancel', lang: LanguageOption.EN },])

  return <ModalProviderBase
    theme={{
      saveLabel,
      cancelLabel,
      backgroundColor: config.cardBackground,
      color: config.color,
      fontColor: config.fontColor,
      disabledFontColor: config.disabledFontColor,
    }}
  >
    {children}
  </ModalProviderBase>
}
