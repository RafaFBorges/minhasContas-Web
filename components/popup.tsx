"use client"

import { FaTimes as CloseIcon } from 'react-icons/fa'

import { PopupType } from '@/types/popupTypes'
import React, { useEffect, useState } from 'react'
import ThemeText from './themeComponents/themeText'
import { TextTag } from './api/text'
import StyledButton from './api/button'

interface PopupProps {
  title: string;
  message: string;
  type: PopupType;
  onClose: () => void;
}

export default function Popup({ title, message, type, onClose }: PopupProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <>
      <div style={{
        ...styles.popupContainer,
        ...styles[type],
        animation: visible ? 'slideIn 0.3s ease forwards' : 'slideOut 0.3s ease forwards',
        pointerEvents: 'all',
      }}>

        <div style={styles.header}>
          <div style={styles.headerTitleSpan}>
            <span style={{ ...styles.icon, color: styles[type].color }}>{popupIcon[type]}</span>
            <ThemeText textTag={TextTag.H6} color={styles[type].color} style={styles.title}>{title}</ThemeText>
          </div>
          <StyledButton
            color={styles[type].color}
            clickHandle={handleClose}
            Icon={CloseIcon}
            isClickableIcon
          />
        </div>

        <ThemeText textTag={TextTag.P} color={styles[type].color} style={styles.message}>{message}</ThemeText>
      </div>
    </>
  )
}

export const popupIcon: Record<PopupType, string> = {
  [PopupType.SUCCESS]: '✓',
  [PopupType.ERROR]: '✕',
  [PopupType.WARNING]: '⚠',
}

const styles: Record<string, React.CSSProperties> = {
  popupContainer: {
    width: '320px',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleSpan: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  icon: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  title: {
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  message: {
    color: '#444',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#888',
    padding: '0 0.25rem',
    lineHeight: 1,
  },
  [PopupType.SUCCESS]: {
    color: '#f0fdf4',
    background: '#166534',
  },
  [PopupType.ERROR]: {
    color: '#fef2f2',
    background: '#991b1b',
  },
  [PopupType.WARNING]: {
    color: '#fffbeb',
    background: '#92400e',
  },
}
