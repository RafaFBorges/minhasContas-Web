"use client"

import { LanguageOption, useTranslate } from './translateHook'
import { useTheme } from './themeHook'
import {
  usePagination as usePaginationBase,
  UsePaginationProps as UsePaginationBaseProps,
  UsePaginationReturn,
  PaginationItem,
} from '@rafafborges/componentes'

export type { UsePaginationReturn, PaginationItem }

export type UsePaginationProps = Omit<UsePaginationBaseProps, 'nextLabel' | 'previousLabel' | 'color' | 'iconColor' | 'disabledColor'>

export function usePagination(props: UsePaginationProps): UsePaginationReturn {
  const NEXT_KEY = 'Pagination.Next'
  const PREVIOUS_KEY = 'Pagination.Previous'

  const { config } = useTheme()
  const { addKeys } = useTranslate()

  const nextLabel = addKeys(NEXT_KEY, [{ value: 'Próximo', lang: LanguageOption.PT_BR }, { value: 'Next', lang: LanguageOption.EN },])
  const previousLabel = addKeys(PREVIOUS_KEY, [{ value: 'Voltar', lang: LanguageOption.PT_BR }, { value: 'Previous', lang: LanguageOption.EN },])

  return usePaginationBase({
    ...props,
    nextLabel,
    previousLabel,
    color: config.color,
    iconColor: config.iconColor,
    disabledColor: config.disabledColor,
  })
}
