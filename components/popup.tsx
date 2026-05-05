"use client"

import { FaTimes as CloseIcon } from 'react-icons/fa'

import { PopupType } from '@/types/popupTypes'
import React, { useEffect, useRef, useState } from 'react'
import ThemeText from './themeComponents/themeText'
import { TextTag } from './api/text'
import StyledButton from './api/button'
import { lightenCor } from '../utils/colors'
import { PopupPositionType } from '../utils/hook/usePopup'


export const popupIcon: Record<PopupType, string> = {
  [PopupType.SUCCESS]: '✓',
  [PopupType.ERROR]: '✕',
  [PopupType.WARNING]: '⚠',
}

interface PopupProps {
  title: string;
  message: string;
  type: PopupType;
  position: PopupPositionType;
  height: number
  onClose: () => void;
  exiting: boolean;
  invisible: boolean;
  onPause: () => void;
  onResume: () => void;
}

export default function Popup({ title, message, type, position, height, onClose, exiting, invisible, onPause, onResume }: PopupProps) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const animId = useRef(`popup-${Math.random().toString(36).slice(2)}`)
  const LIGHTEN_FACTOR = 15

  const slideInFrom = position === PopupPositionType.TOP_RIGHT || position === PopupPositionType.TOP_LEFT
    ? 'translateY(-100%)'
    : 'translateY(100%)'
  const slideOutTo = position === PopupPositionType.TOP_LEFT || position === PopupPositionType.BOTTOM_LEFT
    ? 'translateX(-110%)'
    : 'translateX(110%)'

  let style: React.CSSProperties = {
    ...styles.popupContainer,
    height: height,
    background: styles[type] != null
      ? hovered && styles[type].background != null ? lightenCor(styles[type].background, LIGHTEN_FACTOR) : styles[type].background
      : undefined,
    ...invisible ? styles.invisible : undefined,
    pointerEvents: exiting ? 'none' : 'all',
    opacity: visible || exiting ? undefined : 0,
    transform: visible || exiting ? undefined : slideInFrom,
    animation: exiting
      ? `${animId.current}-out 0.5s ease forwards`
      : visible
        ? `${animId.current}-in 0.5s ease forwards`
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
      @keyframes ${animId.current}-in {
        from { transform: ${slideInFrom}; opacity: 0; }
        to   { transform: translateY(0);  opacity: 1; }
      }

      @keyframes ${animId.current}-out {
        from { transform: translateX(0);      opacity: 1; }
        to   { transform: ${slideOutTo};      opacity: 0; }
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
  invisible: {
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
