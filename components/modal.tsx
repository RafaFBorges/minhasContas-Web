import React, { useEffect, useState } from 'react'

import { FaTimes as CloseIcon } from 'react-icons/fa'

import { ModalFormProps } from '@/modalPages/ModalPagePropsInterface'
import ThemeButton from './themeComponents/themeButton'
import { useTheme } from '../utils/hook/themeHook'
import { TextTag } from './api/text'
import { LanguageOption, useTranslate } from '../utils/hook/translateHook'
import ThemeText from './themeComponents/themeText'


interface ModalProps extends ModalFormProps {
  children: React.ReactNode;
  closeModal: () => void;
  title: string;
  data: object;
}

export default function Modal({ children, closeModal, title, enabledVerify = true, onAccept = null, data = {} }: ModalProps) {
  const SAVE_KEY = 'Modal.Save'
  const CANCEL_KEY = 'Modal.Cancel'

  const { config } = useTheme()
  const { language, addKeys, getValue } = useTranslate()

  const [saveButton, setSaveButton] = useState<string>(addKeys(SAVE_KEY, [{ value: 'Salvar', lang: LanguageOption.PT_BR }, { value: 'Save', lang: LanguageOption.EN },]))
  const [cancelButton, setCancelButton] = useState<string>(addKeys(CANCEL_KEY, [{ value: 'Cancelar', lang: LanguageOption.PT_BR }, { value: 'Cancel', lang: LanguageOption.EN },]))

  useEffect(() => {
    setSaveButton(getValue(SAVE_KEY))
    setCancelButton(getValue(CANCEL_KEY))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  return <div style={styles.overlay}>
    <div style={{ ...styles.modal, backgroundColor: config.cardBackground }}>
      <div style={{ ...styles.titleRow, margin: '0 0 0.5rem 0' }}>
        <ThemeText textTag={TextTag.H6} style={styles.title}>{title}</ThemeText>
        <ThemeButton
          clickHandle={() => closeModal()}
          Icon={CloseIcon}
          isClickableIcon
        />
      </div>
      <div style={styles.content}>
        {children}
      </div>
      <div style={{ ...styles.titleRow, margin: '0.5rem 0 0 0' }}>
        <ThemeButton
          clickHandle={() => closeModal()}
          width='40%'
        >
          {cancelButton}
        </ThemeButton>
        <ThemeButton
          clickHandle={() => {
            if (onAccept != null)
              onAccept(data)

            closeModal()
          }}
          width='40%'
          enabled={enabledVerify}
        >
          {saveButton}
        </ThemeButton>
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
