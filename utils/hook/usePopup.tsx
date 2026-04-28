"use client"

import { createContext, useContext, ReactNode, useState, useRef } from 'react'
import Popup from '../../components/popup'
import { PopupContextType, PopupInfo, PopupType } from '@/types/popupTypes'


let nextId = 0

const PopupContext = createContext<PopupContextType | undefined>(undefined)

export function usePopup() {
  const context = useContext(PopupContext)
  if (!context)
    throw new Error('usePopup must be used within a PopupProvider')

  return context
}

export function PopupProvider({ children }: { children: ReactNode }) {
  const [update, setUpdate] = useState<boolean>(false)
  const popupList = useRef<PopupInfo[]>([])
  const popupPosition = useRef<Record<number, PopupInfo>>({})
  const nextPopupQueue = useRef<number[]>(Array.from({ length: getMaxPopups() }, (_, i) => i))
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const removeQueue = useRef<number[]>([])

  function getMaxPopups(): number {
    const popupHeight = 90
    const gap = 12
    const margin = 24
    const availableHeight = window.innerHeight - 2 * margin

    return Math.floor(availableHeight / (popupHeight + gap))
  }

  function removePopup(id: number) {
    for (const popup of popupList.current)
      if (popup.id === id) {
        if (!popup.exiting) {
          popup.exit()
          setUpdate(prev => !prev)

          if (timerRef.current != null)
            clearTimeout(timerRef.current)

          removeQueue.current.push(id)
          timerRef.current = setTimeout(() => {
            popupList.current = popupList.current.filter(popup => {
              const position = removeQueue.current.indexOf(popup.id)
              const result = position === -1 && 0 < position && position < removeQueue.current.length && removeQueue.current[position] === id
              if (!result) {
                nextPopupQueue.current?.push(popup.positionIndex)
                removeQueue.current.splice(position, 1)
              }

              return result
            })

            setUpdate(prev => !prev)
          }, 3000)
        }

        break
      }
  }

  function addPopup(title: string, message: string, type: PopupType = PopupType.ERROR, duration: number = 4000) {
    if (getMaxPopups() <= popupList.current.length || nextPopupQueue == undefined || nextPopupQueue.current == undefined || nextPopupQueue.current.length === 0)
      return

    const index = nextPopupQueue.current.shift()
    if (index == null)
      return

    const id = nextId++
    const newPopup: PopupInfo = new PopupInfo(id, title, message, type, duration, index)

    popupPosition.current[index] = newPopup
    popupList.current = [newPopup, ...popupList.current]
    setUpdate(prev => !prev)
    setTimeout(() => removePopup(id), duration)
  }

  return (
    <PopupContext.Provider value={{ addPopup }}>
      {children}
      <div style={styles.container}>
        {(update || true) && popupList.current.map(popup => <Popup
          key={popup.id}
          title={popup.title}
          message={popup.message}
          type={popup.type}
          onClose={() => removePopup(popup.id)}
          exiting={popup.exiting}
        />
        )}
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
