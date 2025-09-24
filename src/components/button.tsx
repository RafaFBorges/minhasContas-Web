'use client'

import React from 'react'
import { IconType } from 'react-icons';

interface StyledButtonProps {
  children?: React.ReactNode;
  clickHandle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  Icon: IconType | null;
  isClickableIcon?: boolean;
}

export default function StyledButton({ children, clickHandle, Icon = null, isClickableIcon = false }: StyledButtonProps) {
  return (
    <button
      onClick={clickHandle}
      style={isClickableIcon ? styles.clickableIcon : styles.button}
    >
      {children}
      {Icon != null && <Icon />}
    </button>
  )
}


const styles: { [key: string]: React.CSSProperties } = {
  button: {
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clickableIcon: {
    color: '#0070f3',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}