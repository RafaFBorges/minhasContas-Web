import React, { useState } from 'react'


import Text, { TextTag } from './api/text'
import { isLight, lightenCor } from '../utils/colors'
import { useTheme } from '../utils/hook/themeHook'

export interface TagItemProps {
  style?: React.CSSProperties | null;
  name: string;
  isDisabled: boolean;
  color?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  isOnlyText?: boolean;
  DisabledHover?: boolean;
}

export default function TagItem({
  style,
  name,
  isDisabled,
  color = '',
  onClick = () => { },
  isOnlyText = false,
  DisabledHover = false
}: TagItemProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const { config } = useTheme()

  const handleMouseEnter = () => { setIsHovered(!DisabledHover) }
  const handleMouseLeave = () => { setIsHovered(false) }

  const tagColor: string = isDisabled
    ? config.disabledFontColor
    : color == ''
      ? config.tagDefaultColor
      : color

  const backColor: string = isHovered ? lightenCor(tagColor, 23) : lightenCor(tagColor, 35)
  let textColor: string = isLight(backColor)
    ? '#000'
    : '#FFF'

  if (isOnlyText && isHovered)
    textColor = lightenCor(textColor, 60)

  return isOnlyText
    ? <Text
      noSelection
      noWrap
      textTag={TextTag.P}
      style={style}
      color={isHovered ? textColor : config.fontColor}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {name}
    </Text>
    : <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...styles.tagContainer, borderColor: tagColor, backgroundColor: backColor }}
      onClick={onClick}
    >
      <Text
        textTag={TextTag.P}
        style={styles.categoryTitle}
        color={textColor}
        disabled
        noSelection
      >
        {name}
      </Text>
    </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  tagContainer: {
    whiteSpace: 'noWrap',
    border: '1px solid red',
    borderRadius: '8px',
    padding: '2px 4px',
  }
}
