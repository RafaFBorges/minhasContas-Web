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
}

export default function Text({ children, textTag = TextTag.P }: TextProps) {
  const { config } = useTheme()

  return React.createElement(textTag, { style: { color: config.fontColor } }, children)
}
