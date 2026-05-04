"use client"

import { createContext, useContext, ReactNode, useState, useRef } from 'react'
import Popup from '../../components/popup'
import { PopupContextType, PopupInfo, PopupType } from '@/types/popupTypes'


let nextId: number = 0

interface WaitingPopup {
  title: string;
  message: string;
  type: PopupType;
  duration: number,
  id: number
}

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
  const pausedAt = useRef<Record<number, number>>({})
  const remainingTime = useRef<Record<number, number>>({})
  const waitingQueue = useRef<Array<WaitingPopup>>([])

  function getActivePopupKey(title: string, message: string, type: PopupType): string {
    return `${type}:${title}:${message}`
  }

  function getMaxPopups(): number {
    if (typeof window === 'undefined')
      return 0

    const popupHeight = 90
    const gap = 12
    const margin = 24
    const availableHeight = window.innerHeight - 2 * margin

    return Math.floor(availableHeight / (popupHeight + gap))
  }

  function processWaitingQueue() {
    if (waitingQueue.current.length === 0)
      return

    const activeCount = popupList.current.filter(p => !p.exiting).length
    const hasExitingSlot = popupList.current.some(p => p.exiting)
    const hasEmptySlot = nextPopupQueue.current.length > 0 && getMaxPopups() > activeCount

    if (!hasExitingSlot && !hasEmptySlot)
      return

    const next = waitingQueue.current.shift()!
    addPopup(next.title, next.message, next.type, next.duration, next.id)
  }

  function pausePopup(id: number) {
    if (durationTimers.current[id]) {
      clearTimeout(durationTimers.current[id])
      pausedAt.current[id] = Date.now()
      remainingTime.current[id] = remainingTime.current[id] - (Date.now() - (pausedAt.current[id] ?? Date.now()))
    }
  }

  function resumePopup(id: number) {
    if (pausedAt.current[id]) {
      const elapsed = Date.now() - pausedAt.current[id]
      const remaining = (remainingTime.current[id] ?? 4000) - elapsed

      durationTimers.current[id] = setTimeout(() => removePopup(id), Math.max(remaining, 0))
      delete pausedAt.current[id]
    }
  }

  function wasUpdated(key: string, duration: number): boolean {
    if (activePopups.current.has(key)) {
      const existingId = activePopups.current.get(key)!
      clearTimeout(durationTimers.current[existingId])
      durationTimers.current[existingId] = setTimeout(() => removePopup(existingId), duration)

      return true
    }

    return false
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
            processWaitingQueue()
          }, 500)

          setTimeout(() => processWaitingQueue(), 500)
        }

        break
      }
  }

  function addPopup(title: string, message: string, type: PopupType = PopupType.ERROR, duration: number = 4000, id: number = -1) {
    if (nextPopupQueue == undefined || nextPopupQueue.current == undefined)
      return

    const key = getActivePopupKey(title, message, type)
    if (wasUpdated(key, duration))
      return

    const popupId: number = id !== -1 ? id : nextId++
    if (id === -1 && 0 < waitingQueue.current.length) {
      waitingQueue.current.push({
        title: title,
        message: message,
        type: type,
        duration: duration,
        id: popupId
      })

      return
    }

    const exitingPopup: PopupInfo | undefined = [...popupList.current].reverse().find(p => p.exiting)
    let index: number | undefined

    if (exitingPopup) {
      if (timerRef.current != null)
        clearTimeout(timerRef.current)

      index = exitingPopup.positionIndex
      const position: number = removeQueue.current.indexOf(exitingPopup.id)
      if (position !== -1)
        removeQueue.current.splice(position, 1)
    } else {
      const activeCount: number = popupList.current.filter(p => !p.exiting).length
      if (getMaxPopups() <= activeCount || nextPopupQueue.current.length === 0) {
        waitingQueue.current.push({
          title: title,
          message: message,
          type: type,
          duration: duration,
          id: popupId
        })

        return
      }

      index = nextPopupQueue.current.shift()
      if (index == null)
        return
    }

    const newPopup: PopupInfo = new PopupInfo(popupId, title + ` ${popupId}`, message, type, duration, index)

    popupPosition.current[index] = newPopup
    activePopups.current.set(key, popupId)

    if (exitingPopup)
      popupList.current = popupList.current.map(p => p.id === exitingPopup.id ? newPopup : p)
    else
      popupList.current = [newPopup, ...popupList.current]

    setUpdate(prev => !prev)
    remainingTime.current[popupId] = duration
    durationTimers.current[popupId] = setTimeout(() => removePopup(popupId), remainingTime.current[popupId])
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
          onPause={() => pausePopup(popup.id)}
          onResume={() => resumePopup(popup.id)}
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
