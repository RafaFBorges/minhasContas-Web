"use client"

import { LanguageOption, useTranslate } from './translateHook'
import { useTheme } from './themeHook'
import { UsePaginationProps } from '@rafafborges/componentes'

export type PaginationThemeProps = Pick<UsePaginationProps, 'nextLabel' | 'previousLabel' | 'color' | 'iconColor' | 'disabledColor'>

export function usePaginationTheme(): PaginationThemeProps {
  const NEXT_KEY = 'Pagination.Next'
  const PREVIOUS_KEY = 'Pagination.Previous'

  const { config } = useTheme()
  const { addKeys } = useTranslate()

  return {
    nextLabel: addKeys(NEXT_KEY, [{ value: 'Próximo', lang: LanguageOption.PT_BR }, { value: 'Next', lang: LanguageOption.EN },]),
    previousLabel: addKeys(PREVIOUS_KEY, [{ value: 'Voltar', lang: LanguageOption.PT_BR }, { value: 'Previous', lang: LanguageOption.EN },]),
    color: config.color,
    iconColor: config.iconColor,
    disabledColor: config.disabledColor,
  }
}
