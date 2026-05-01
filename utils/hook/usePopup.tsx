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
  const activePopups = useRef<Map<string, number>>(new Map())
  const durationTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})

  function getActivePopupKey(title: string, message: string, type: PopupType): string {
    return `${type}:${title}:${message}`
  }

  function getMaxPopups(): number {
    const popupHeight = 90
    const gap = 12
    const margin = 24
    const availableHeight = window.innerHeight - 2 * margin

    return Math.floor(availableHeight / (popupHeight + gap))
  }

  function removePopup(id: number) {
    clearTimeout(durationTimers.current[id])
    delete durationTimers.current[id]

    for (const [key, activeId] of activePopups.current.entries())
      if (activeId === id) {
        activePopups.current.delete(key)
        break
      }

    for (const popup of popupList.current)
      if (popup.id === id) {
        if (!popup.exiting) {
          popup.exit()
          setUpdate(prev => !prev)

          if (timerRef.current != null)
            clearTimeout(timerRef.current)

          removeQueue.current.push(id)
          timerRef.current = setTimeout(() => {
            const allExiting = popupList.current.every(p => removeQueue.current.includes(p.id))
            if (!allExiting)
              return

            popupList.current = popupList.current.filter(popup => {
              const position = removeQueue.current.indexOf(popup.id)
              const shouldRemove = position !== -1
              if (shouldRemove) {
                nextPopupQueue.current?.push(popup.positionIndex)
                removeQueue.current.splice(position, 1)
              }

              return !shouldRemove
            })

            setUpdate(prev => !prev)
          }, 500)
        }

        break
      }
  }

  function addPopup(title: string, message: string, type: PopupType = PopupType.ERROR, duration: number = 4000) {
    if (nextPopupQueue == undefined || nextPopupQueue.current == undefined)
      return

    const key = getActivePopupKey(title, message, type)
    if (activePopups.current.has(key)) {
      const existingId = activePopups.current.get(key)!
      clearTimeout(durationTimers.current[existingId])
      durationTimers.current[existingId] = setTimeout(() => removePopup(existingId), duration)  // ✅ novo timer
      return
    }

    const id = nextId++

    const exitingPopup = [...popupList.current].reverse().find(p => p.exiting)

    let index: number | undefined

    if (exitingPopup) {
      if (timerRef.current != null)
        clearTimeout(timerRef.current)

      index = exitingPopup.positionIndex
      const position = removeQueue.current.indexOf(exitingPopup.id)
      if (position !== -1)
        removeQueue.current.splice(position, 1)
    } else {
      if (getMaxPopups() <= popupList.current.length || nextPopupQueue.current.length === 0)
        return

      index = nextPopupQueue.current.shift()
      if (index == null)
        return
    }

    const newPopup = new PopupInfo(id, title + ` ${id}`, message, type, duration, index)

    popupPosition.current[index] = newPopup
    activePopups.current.set(key, id)

    if (exitingPopup)
      popupList.current = popupList.current.map(p => p.id === exitingPopup.id ? newPopup : p)
    else
      popupList.current = [newPopup, ...popupList.current]

    setUpdate(prev => !prev)
    durationTimers.current[id] = setTimeout(() => removePopup(id), duration)
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
