"use client"

import { createContext, useContext, ReactNode, useState } from 'react'
import Popup from '../../components/popup'
import { PopupContextType, PopupInfoType, PopupType } from '@/types/popupTypes'

let nextId = 0

const PopupContext = createContext<PopupContextType | undefined>(undefined)

export function usePopup() {
  const context = useContext(PopupContext)
  if (!context)
    throw new Error('usePopup must be used within a PopupProvider')

  return context
}

export function PopupProvider({ children }: { children: ReactNode }) {
  const [popupList, setPopupList] = useState<PopupInfoType[]>([])

  function addPopup(title: string, message: string, type: PopupType = PopupType.ERROR, duration: number = 2000) {
    const id = nextId++
    setPopupList(prev => [...prev, { id, title, message, type, duration }])
    setTimeout(() => setPopupList(prev => prev.filter(p => p.id !== id)), duration)
  }

  return (
    <PopupContext.Provider value={{ addPopup }}>
      {children}
      <div style={styles.container}>
        {popupList.map(popup => (
          <Popup
            key={popup.id}
            title={popup.title}
            message={popup.message}
            type={popup.type}
            onClose={() => setPopupList(prev => prev.filter(p => p.id !== popup.id))}
          />
        ))}
      </div>
    </PopupContext.Provider>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    alignItems: 'flex-end',
    pointerEvents: 'none',
  },
}
