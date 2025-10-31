'use client'

import React from 'react'
import { IconType } from 'react-icons'

export interface StyledButtonProps {
  children?: React.ReactNode;
  clickHandle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  Icon?: IconType | null;
  isClickableIcon?: boolean;
  width?: string;
  enabled?: boolean;
  iconSize?: string;
  isSecondary?: boolean;
  borderRadius?: string;
  color?: string;
}

export default function StyledButton({
  children,
  clickHandle,
  Icon = null,
  isClickableIcon = false,
  width = '',
  enabled = true,
  iconSize = '16',
  isSecondary = false,
  borderRadius = '4px',
  color = '#0070f3'
}: StyledButtonProps) {
  let style = isClickableIcon
    ? { ...styles.clickableIcon, color: color }
    : isSecondary
      ? { ...styles.buttonSecondary, border: 'solid ' + color + ' 2px' }
      : { ...styles.button, backgroundColor: color }

  style = { ...style, borderRadius: borderRadius }
  if (width != '')
    style = { ...style, width: width }

  if (!enabled) {
    if (isClickableIcon)
      style = { ...style, color: '#696969ff' } 
    else
      style = { ...style, backgroundColor: '#696969ff' }
  }

  return <button
    onClick={enabled ? clickHandle : () => { }}
    style={style}
  >
    {children}
    {Icon != null &&
      <Icon
        color={isSecondary && !isClickableIcon ? color : undefined}
        size={iconSize}
      />
    }
  </button>
}

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    color: '#fff',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondary: {
    padding: '0.3rem',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clickableIcon: {
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}