import { LanguageOption } from './hook/translateHook'

export function getRealString(value: number, format: LanguageOption = LanguageOption.PT_BR): string {
  return `R$ ${value.toLocaleString(format, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}