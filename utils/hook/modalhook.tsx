"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import Modal from '../../components/modal';

interface ModalContextType {
  isOpen: boolean;
  openModal: (title: string) => void;
  closeModal: () => void;

  title: string;
  setTitle: (title: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function useModal() {
  const context = useContext(ModalContext)
  if (!context)
    throw new Error('useModal must be used within a ModalProvider')

  return context
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('Título Padrão')

  const closeModal = () => setIsOpen(false)
  const openModal = (title: string) => {
    setTitle(title)
    setIsOpen(true)
  }

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        title,
        setTitle,
      }}
    >
      {isOpen &&
        <Modal
          closeModal={closeModal}
          title={title}
        />
      }
      {children}
    </ModalContext.Provider>
  )
}
