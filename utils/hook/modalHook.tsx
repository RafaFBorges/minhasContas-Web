"use client"

import { createContext, useContext, useState, ReactNode, useRef } from 'react'
import Modal from '../../components/modal'

interface ModalContextType {
  isOpen: boolean;
  openModal: (title: string, content?: (() => ReactNode) | null, onAccept?: (((item: unknown) => void) | null), hasEnabledVerify?: boolean) => void;
  closeModal: () => void;
  setEnabledSave: (newState: boolean) => void;

  title: string;
  setTitle: (title: string) => void;
  setData: (key: string, value: unknown) => void
}

interface ModalStateType {
  content: (() => ReactNode) | null;
  onAccept: (((item: unknown) => void) | null);
  data: Record<string, unknown>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function useModal() {
  const context = useContext(ModalContext)
  if (!context)
    throw new Error('useModal must be used within a ModalProvider')

  return context
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('Título Padrão')
  const [enabledSave, setEnabledSave] = useState<boolean>(true)
  const contentRef = useRef<ModalStateType | null>(null)

  function closeModal() {
    setIsOpen(false)
  }

  function setData(key: string, value: unknown) {
    if (contentRef != null && contentRef.current != null && contentRef.current.data != null)
      contentRef.current.data[key] = value
  }

  function openModal(title: string, content: ((() => ReactNode) | null) = null, onAccept: (((item: unknown) => void) | null) = null, hasEnabledVerify = false) {
    setTitle(title)
    setIsOpen(true)
    contentRef.current = {
      content: content,
      onAccept: onAccept,
      data: {}
    }

    if (hasEnabledVerify)
      setEnabledSave(false)
    else
      setEnabledSave(true)
  }

  return <ModalContext.Provider
    value={{
      isOpen,
      openModal,
      closeModal,
      title,
      setTitle,
      setEnabledSave,
      setData
    }}
  >
    {isOpen &&
      <Modal
        closeModal={closeModal}
        title={title}
        enabledVerify={enabledSave}
        onAccept={contentRef != null && contentRef.current != null ? contentRef.current.onAccept : null}
        data={contentRef != null && contentRef.current != null ? contentRef.current.data : {}}
      >
        {contentRef != null && contentRef.current != null && contentRef.current.content != null && contentRef.current.content()}
      </Modal>
    }
    {children}
  </ModalContext.Provider>
}
