import tinycolor from 'tinycolor2'
import { ThemeStyleProps } from './hook/themeHook'

export function lightenCor(colorHex: string, porcentagem: number): string {
  return tinycolor(colorHex).lighten(porcentagem).toHexString()
}

export function isLight(color: string): boolean {
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