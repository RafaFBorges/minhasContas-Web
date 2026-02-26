'use client'

import React, { useState } from 'react'
import { lightenCor } from '../utils/colors'
import Text, { TextTag } from './api/text'
import { useTheme } from '../utils/hook/themeHook';

export interface StyledButtonProps {
  clickHandle?: () => void;
  width?: string;
  enabled?: boolean;
  color?: string;
  name?: string;
}

export default function Toggle({
  name,
  clickHandle,
  width = '',
  enabled = true,
  color = '#0070f3'
}: StyledButtonProps) {
  const toogleSize = 20
  const padding = 2
  const borderColor = '#000'
  const borderWidth = 1
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isEnabled, setIsEnabled] = useState<boolean>(enabled)

  const { config } = useTheme()

  const handleMouseEnter = () => { setIsHovered(true) }
  const handleMouseLeave = () => { setIsHovered(false) }
  const handleClick = () => {
    setIsEnabled(!isEnabled)

    if (clickHandle != null)
      clickHandle()
  }

  return <div style={styles.container}  >
    {name != '' && <Text noWrap textTag={TextTag.P} style={styles.title}>{name}</Text>}
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={isEnabled
        ? {
          ...styles.toogleContainer,
          height: `${toogleSize + 2 * padding + 2 * borderWidth}px`,
          width: `${2 * toogleSize + 2 * padding + 2 * borderWidth}px`,
          padding: `${padding}px`,
          border: `${borderWidth}px solid ${borderColor}`,
        }
        : {
          ...styles.toogleContainer,
          height: `${toogleSize + 2 * padding + 2 * borderWidth}px`,
          width: `${2 * toogleSize + 2 * padding + 2 * borderWidth}px`,
          padding: `${padding}px`,
          border: `${borderWidth}px solid ${borderColor}`,
          ...styles.enabled
        }
      }
    >
      <div
        style={{
          ...styles.toogle,
          height: `${toogleSize}px`,
          width: `${toogleSize}px`,
          backgroundColor: isEnabled
            ? isHovered ? lightenCor(color, 15) : color
            : config.disabledFontColor
        }}
      />
    </div>
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toogleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: '8px',
    height: '20px',
    width: '50px',
  },
  toogle: {
    backgroundColor: '#000',
    borderRadius: '100%',
  },
  enabled: {
    justifyContent: 'flex-start',
  },
}
