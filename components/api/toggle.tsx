'use client'

import React, { useState } from 'react'
import Image, { StaticImageData } from 'next/image'

import { lightenCor } from '../../utils/colors'
import Text, { TextTag } from './text'


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
  isImagePriority?: boolean;
  enableImage?: StaticImageData | null;
  disableImage?: StaticImageData | null;
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
  enableImage = null,
  disableImage = null,
  isImagePriority = false,
}: ToogleProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isEnabled, setIsEnabled] = useState<boolean>(enabled)

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
          border: `${borderWidth}px solid ${isHovered ? lightenCor(borderColor, 15) : borderColor}`,
        }
        : {
          ...styles.toogleContainer,
          height: `${toogleSize + 2 * padding + 2 * borderWidth}px`,
          width: `${2 * toogleSize + 2 * padding + 2 * borderWidth}px`,
          padding: `${padding}px`,
          border: `${borderWidth}px solid ${isHovered ? lightenCor(borderColor, 15) : borderColor}`,
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
      >
        {isEnabled && enableImage != null &&
          <Image
            src={enableImage}
            alt="toggle enabled"
            style={styles.image}
            priority={isImagePriority}
          />
        }
        {!isEnabled && disableImage != null &&
          <Image
            src={disableImage}
            alt="toggle disabled"
            style={styles.image}
            priority={isImagePriority}
          />
        }
      </div>
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
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enabled: {
    justifyContent: 'flex-start',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
}
