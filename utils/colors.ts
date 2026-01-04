import tinycolor from 'tinycolor2'

export function lightenCor(colorHex: string, porcentagem: number): string {
  return tinycolor(colorHex).lighten(porcentagem).toHexString()
}

export function isLight(color: string): boolean {
  return tinycolor(color).isLight()
    ? true
    : false
}
