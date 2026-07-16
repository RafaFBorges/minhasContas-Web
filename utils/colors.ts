import tinycolor from 'tinycolor2'
import { ThemeStyleProps } from './hook/themeHook'

export function lightenCor(colorHex: string | number, porcentagem: number): string {
  const color = typeof colorHex === 'number'
    ? `#${colorHex.toString(16).padStart(6, '0')}`
    : colorHex

  return tinycolor(color).lighten(porcentagem).toHexString()
}

export function isLight(colorHex: string | number): boolean {
  const color = typeof colorHex === 'number'
    ? `#${colorHex.toString(16).padStart(6, '0')}`
    : colorHex

  return tinycolor(color).isLight()
    ? true
    : false
}

export function getSideColor(value: number, config: ThemeStyleProps): string {
  if (value < 0)
    return config.LossSideColor
  else if (0 < value)
    return config.GainSideColor
  else
    return config.NeutralSidedColor
}