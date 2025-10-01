import React from "react"

import { FaTimes as CloseIcon } from 'react-icons/fa'

import StyledButton from './button'
import { ModalFormProps } from '@/app/ModalPagePropsInterface'

interface ModalProps extends ModalFormProps {
  children: React.ReactNode;
  closeModal: () => void;
  title: string;
  data: object;
}

export default function Modal({ children, closeModal, title, enabledVerify = true, onAccept = null, data = {} }: ModalProps) {
  return <div style={styles.overlay}>
    <div style={styles.modal}>
      <div style={{ ...styles.titleRow, margin: '0 0 0.5rem 0' }}>
        <h6 style={styles.title}>{title}</h6>
        <StyledButton
          clickHandle={(e: React.MouseEvent<HTMLButtonElement>) => closeModal()}
          Icon={CloseIcon}
          isClickableIcon
        />
      </div>
      <div style={styles.content}>
        {children}
      </div>
      <div style={{ ...styles.titleRow, margin: '0.5rem 0 0 0' }}>
        <StyledButton
          clickHandle={(e: React.MouseEvent<HTMLButtonElement>) => closeModal()}
          width='40%'
        >
          Cancelar
        </StyledButton>
        <StyledButton
          clickHandle={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (onAccept != null)
              onAccept(data)

            closeModal()
          }}
          width='40%'
          enabled={enabledVerify}
        >
          Salvar
        </StyledButton>
      </div>
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
    padding: '0.4em',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  content: {
    flexGrow: '1',
    width: '100%',
  },
  titleRow: {
    display: 'flex',
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
