import React, { useState } from 'react'


import Text, { TextTag } from './text'
import { isLight, lightenCor } from '../utils/colors'
import { useTheme } from '../utils/hook/themeHook'

export interface TagItemProps {
  name: string;
  key: number;
  isDisabled: boolean;
  color?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function TagItem({
  name,
  key,
  isDisabled,
  color = '',
  onClick = () => { }
}: TagItemProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const { config } = useTheme()

  const handleMouseEnter = () => { setIsHovered(true) }
  const handleMouseLeave = () => { setIsHovered(false) }

  const tagColor: string = isDisabled
    ? config.disabledFontColor
    : color == ''
      ? config.tagDefaultColor
      : color

  const backColor: string = isHovered ? lightenCor(tagColor, 23) : lightenCor(tagColor, 35)
  const textColor: string = isLight(backColor)
    ? '#000'
    : '#FFF'

  return <div
    key={key}
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
