'use client'

import React, { useEffect, useRef, useState } from 'react'
import StyledButton, { StyledButtonProps } from './api/button'
import { useTheme } from '../utils/hook/themeHook'

export default function WindowButton({
  children,
  Icon = null,
  isClickableIcon = false,
  width = '',
  enabled = true,
  iconSize = '16',
  isSecondary = false,
  borderRadius = '4px',
}: StyledButtonProps) {
  const { config } = useTheme()

  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [coords, setCoords] = useState({ top: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const clickHandle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()

      setCoords({
        top: rect.bottom + window.scrollY,
      })
    }

    setIsHovered(true)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node))
        setIsHovered(false)
    }

    if (isHovered)
      document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isHovered])

  return <div style={styles.position}>
    <StyledButton
      ref={buttonRef}
      clickHandle={clickHandle}
      Icon={Icon}
      isClickableIcon={isClickableIcon}
      width={width}
      enabled={enabled}
      iconSize={iconSize}
      isSecondary={isSecondary}
      borderRadius={borderRadius}
      color={config.color}
    >
      {children}
    </StyledButton>
    {isHovered &&
      <div
        ref={modalRef}
        style={{
          ...styles.modal,
          top: `${coords.top}px`,
          right: '0px',
          backgroundColor: config.cardBackground
        }}>

      </div>
    }
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  position: {
    position: 'relative',
  },
  modal: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
    padding: '0.4em',
    backgroundColor: '#323245',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
}
