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

interface TextProps<T> {
  children: React.ReactNode;
  textTag?: TextTag;
  style?: React.CSSProperties | null;
  disabled?: boolean;
  noWrap?: boolean;
  noSelection?: boolean;
  color?: string;
  onClick?: (item: T) => void;
  onMouseEnter?: (item: T) => void;
  onMouseLeave?: (item: T) => void;
}

export default function Text<T>({
  children,
  textTag = TextTag.P,
  style = null,
  disabled = false,
  noWrap = false,
  noSelection = false,
  color = '',
  onClick = () => { },
  onMouseEnter = () => { },
  onMouseLeave = () => { }
}: TextProps<T>) {
  const { config } = useTheme()

  let textStyle: React.CSSProperties = (style != null)
    ? style
    : {}

  textStyle = (color != '')
    ? { ...textStyle, color: color }
    : (disabled)
      ? { ...textStyle, color: config.disabledFontColor }
      : { ...textStyle, color: config.fontColor }

  if (noWrap)
    textStyle = { ...textStyle, whiteSpace: 'nowrap' }

  if (noSelection)
    textStyle = { ...textStyle, ...styles.notSelectable }

  return React.createElement(
    textTag,
    {
      style: textStyle,
      onClick: onClick,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave
    },
    children
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  notSelectable: {
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  }
}
