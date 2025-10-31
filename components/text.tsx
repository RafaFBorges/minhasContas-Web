import React from 'react'
import { useTheme } from '../utils/hook/themeHook'


export enum TextTag {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  P = 'p',
}

interface TextProps {
  children: React.ReactNode;
  textTag?: TextTag;
  style?: React.CSSProperties | null;
  disabled?: boolean;
}

export default function Text({ children, textTag = TextTag.P, style = null, disabled = false }: TextProps) {
  const { config } = useTheme()

  let textStyle: React.CSSProperties = (style != null)
    ? style
    : {}

  textStyle = (disabled)
    ? { ...textStyle, color: config.disabledFontColor }
    : { ...textStyle, color: config.fontColor }

  return React.createElement(textTag, { style: textStyle }, children)
}
