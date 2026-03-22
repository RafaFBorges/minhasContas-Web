import React from 'react'
import { useTheme } from '../../utils/hook/themeHook'
import Text, { TextProps, TextTag } from '../api/text'


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
}: TextProps<T>) {
  const { config } = useTheme()

  return <Text
    textTag={textTag}
    style={style}
    onClick={disabled ? () => { } : onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    disabled={disabled}
    noWrap={noWrap}
    noSelection={noSelection}
    showHoover={showHoover}
    color={color}
    fontColor={config.fontColor}
    disabledFontColor={config.disabledFontColor}
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
