'use client'

import React, { useState } from 'react'
import { lightenCor } from '../../utils/colors'
import Text, { TextTag } from './text'
import { useTheme } from '../../utils/hook/themeHook'

export interface ToogleProps {
  clickHandle?: () => void;
  width?: string;
  enabled?: boolean;
  color?: string;
  name?: string;
  toogleSize?: number;
  padding?: number;
  borderColor?: string;
  borderWidth?: number;
  disabledColor?: string;
}

export default function Toggle({
  name,
  clickHandle,
  enabled = true,
  color = '#00D84C',
  toogleSize = 20,
  padding = 2,
  borderColor = '#555',
  borderWidth = 1,
  disabledColor = '#727272ff',
}: ToogleProps) {
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
    {name != '' && <Text noSelection noWrap textTag={TextTag.P} style={styles.title}>{name}</Text>}
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
            : isHovered ? lightenCor(disabledColor, 15) : disabledColor
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
    borderRadius: '12px',
    height: '20px',
    width: '50px',
  },
  toogle: {
    borderRadius: '100%',
  },
  enabled: {
    justifyContent: 'flex-start',
  },
}
