import React, { useState } from 'react'


import { TextTag } from './api/text'
import ThemeText from './themeComponents/themeText'
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

  return isOnlyText
    ? <ThemeText
      showHoover
      noSelection
      noWrap
      textTag={TextTag.P}
      style={style}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {name}
    </ThemeText>
    : <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...styles.tagContainer, borderColor: tagColor, backgroundColor: backColor }}
      onClick={onClick}
    >
      <ThemeText
        textTag={TextTag.P}
        style={styles.categoryTitle}
        color={isLight(backColor) ? '#000' : '#FFF'}
        disabled
        noSelection
      >
        {name}
      </ThemeText>
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
