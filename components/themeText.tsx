import React from 'react'
import { useTheme } from '../utils/hook/themeHook'
import Text, { TextTag } from './api/text'


export interface ThemeTextProps<T> {
  children: React.ReactNode;
  textTag?: TextTag;
  style?: React.CSSProperties | null;
  disabled?: boolean;
  noWrap?: boolean;
  noSelection?: boolean;
  showHoover?: boolean;
  color?: string;
  onClick?: (item: T) => void;
  onMouseEnter?: (item: T | null) => void;
  onMouseLeave?: (item: T | null) => void;
}

export default function ThemeText<T>({
  children,
  textTag = TextTag.P,
  style = null,
  disabled = false,
  noWrap = false,
  noSelection = false,
  color = '',
  showHoover= false,
  onClick = () => { },
  onMouseEnter = () => { },
  onMouseLeave = () => { }
}: ThemeTextProps<T>) {
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

  function onTextMouseEnter() {
    showHoover;

    if (onMouseEnter != null)
      onMouseEnter(null)
  }

  function onTextMouseLeave() {

    if (onMouseLeave != null)
      onMouseLeave(null)
  }

  return <Text
    textTag={textTag}
    style={textStyle}
    onClick={disabled ? () => { } : onClick}
    onMouseEnter={onTextMouseEnter}
    onMouseLeave={onTextMouseLeave}
  >
    {children}
  </Text>
}

const styles: { [key: string]: React.CSSProperties } = {
  notSelectable: {
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  }
}
