import React, { useState } from 'react'
import { useTheme } from '../../utils/hook/themeHook'
import Text, { TextTag } from '../api/text'
import { isLight, lightenCor } from '../../utils/colors';


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
  showHoover = false,
  onClick = () => { },
  onMouseEnter = () => { },
  onMouseLeave = () => { }
}: ThemeTextProps<T>) {
  const { config } = useTheme()

  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isEnabled, setIsEnabled] = useState<boolean>(!disabled)

  let textStyle: React.CSSProperties = (style != null) ? style : {}

  textStyle = (isHovered)
    ? { ...textStyle, color: lightenCor('#000', 60) }
    : (color != '')
      ? { ...textStyle, color: color }
      : { ...textStyle, color: (!isEnabled) ? config.disabledFontColor : config.fontColor }

  if (noWrap)
    textStyle = { ...textStyle, whiteSpace: 'nowrap' }

  if (noSelection)
    textStyle = { ...textStyle, ...styles.notSelectable }

  function onTextMouseEnter() {
    if (showHoover)
      setIsHovered(true)

    if (onMouseEnter != null)
      onMouseEnter(null)
  }

  function onTextMouseLeave() {
    if (isHovered)
      setIsHovered(false)

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
