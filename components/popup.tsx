"use client"

import { FaTimes as CloseIcon } from 'react-icons/fa'

import { PopupType } from '@/types/popupTypes'
import React, { useEffect, useState } from 'react'
import ThemeText from './themeComponents/themeText'
import { TextTag } from './api/text'
import StyledButton from './api/button'
import { lightenCor } from '../utils/colors'


export const popupIcon: Record<PopupType, string> = {
  [PopupType.SUCCESS]: '✓',
  [PopupType.ERROR]: '✕',
  [PopupType.WARNING]: '⚠',
}

interface PopupProps {
  title: string;
  message: string;
  type: PopupType;
  onClose: () => void;
  exiting: boolean;
  onPause: () => void;
  onResume: () => void;
}

export default function Popup({ title, message, type, onClose, exiting, onPause, onResume }: PopupProps) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const LIGHTEN_FACTOR = 15

  let style: React.CSSProperties = {
    ...styles.popupContainer,
    background: styles[type] != null
      ? hovered && styles[type].background != null ? lightenCor(styles[type].background, LIGHTEN_FACTOR) : styles[type].background
      : undefined,
    pointerEvents: exiting ? 'none' : 'all',
    opacity: visible || exiting ? undefined : 0,
    transform: visible || exiting ? undefined : 'translateY(100%)',
    animation: exiting
      ? 'slideOut 0.5s ease forwards'
      : visible
        ? 'slideIn 0.5s ease forwards'
        : 'none',
  }

  const handleMouseEnter = () => {
    setHovered(true)
    onPause()
  }

  const handleMouseLeave = () => {
    setHovered(false)
    onResume()
  }

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  return <>
    <style>{`
      @keyframes slideIn {
        from { transform: translateY(100%); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0);   opacity: 1; }
        to   { transform: translateX(110%); opacity: 0; }
      }
    `}</style>

    <div
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={styles.header}>
        <div style={styles.headerTitleSpan}>
          <span style={{ ...styles.icon, color: styles[type].color }}>{popupIcon[type]}</span>
          <ThemeText textTag={TextTag.H6} color={styles[type].color} style={styles.title}>{title}</ThemeText>
        </div>
        <StyledButton
          color={styles[type].color}
          clickHandle={onClose}
          Icon={CloseIcon}
          isClickableIcon
        />
      </div>

      <ThemeText textTag={TextTag.P} color={styles[type].color} style={styles.message}>{message}</ThemeText>
    </div>
  </>
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
  exiting: {
    visibility: 'hidden'
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
