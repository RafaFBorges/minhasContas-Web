import React from "react"

import { FaTimes as CloseIcon } from 'react-icons/fa'

import StyledButton from "./button"

interface CardProps {
  children?: React.ReactNode;
  title: string;
  isOpen: boolean;
  setIsOpen: (mewValue: boolean) => void;
}

export default function Modal({ children, isOpen, setIsOpen, title }: CardProps) {
  if (!isOpen)
    return null

  return <div style={styles.overlay}>
    <div style={styles.modal}>
      <div style={styles.titleRow}>
        <h6 style={styles.title}>{title}</h6>
        <StyledButton
          clickHandle={(e: React.MouseEvent<HTMLButtonElement>) => setIsOpen(false)}
          Icon={CloseIcon}
          isClickableIcon
        />
      </div>
      {children}
    </div>
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    position: 'absolute',
    width: '300px',
    height: '200px',
    padding: '0.4em',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginTop: '2rem',
  },
  content: {
    padding: '1rem',
  },
  titleRow: {
    display: 'flex',
    margin: '0 0 0.5rem 0',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '1.25rem',
  },
  buttonsArea: {
    display: 'flex',
    gap: '0.4em',
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    color: '#555',
  },
}
