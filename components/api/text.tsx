import React, { useState } from 'react'
import { lightenCor } from '../../utils/colors'


export enum TextTag {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  P = 'p',
}

export interface TextProps<T> {
  children: React.ReactNode;
  textTag?: TextTag;
  style?: React.CSSProperties | null;
  disabled?: boolean;
  noWrap?: boolean;
  noSelection?: boolean;
  showHoover?: boolean;
  color?: string;
  fontColor?: string;
  disabledFontColor?: string;
  onClick?: (item: T) => void;
  onMouseEnter?: (item: T | null) => void;
  onMouseLeave?: (item: T | null) => void;
}

export default function Text<T>({
  children,
  textTag = TextTag.P,
  style = null,
  disabled = false,
  noWrap = false,
  noSelection = false,
  color = '',
  disabledFontColor = '',
  fontColor = '',
  showHoover = false,
  onClick = () => { },
  onMouseEnter = () => { },
  onMouseLeave = () => { }
}: TextProps<T>) {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isEnabled, setIsEnabled] = useState<boolean>(!disabled)

  let textStyle: React.CSSProperties = (style != null) ? style : {}
  textStyle = (isHovered)
    ? { ...textStyle, color: lightenCor('#000', 60) }
    : (color != '')
      ? { ...textStyle, color: color }
      : { ...textStyle, color: (!isEnabled) ? disabledFontColor : fontColor }

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

  return React.createElement(
    textTag,
    {
      style: textStyle,
      onClick: onClick,
      onMouseEnter: onTextMouseEnter,
      onMouseLeave: onTextMouseLeave
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
