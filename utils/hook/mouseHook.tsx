"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { logger } from '../log/logger'

// API experimental, só existe em alguns navegadores (por isso não está no tipo Navigator)
type NavigatorWithPointer = Navigator & {
  getCurrentPoint?: (device: 'mouse') => Promise<{ x: number, y: number }>
}

export interface MousePosition {
  X: number;
  Y: number;
}

interface MouseContextType {
  position: MousePosition;
}

const MouseContext = createContext<MouseContextType | undefined>(undefined)

export function useMouse() {
  const context = useContext(MouseContext)
  if (!context)
    throw new Error('useMouse must be used within a MouseProvider')

  return context
}

export function MouseProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState<MousePosition>({ X: 0, Y: 0 })

  function isTextElement(tag: string) {
    return /^([Hh][1-6]|[Pp])$/.test(tag)
  }

  useEffect(() => {
    // Método experimental, disponível apenas em alguns browsers
    const experimental = navigator as NavigatorWithPointer
    if (typeof experimental.getCurrentPoint === 'function') {
      logger.debug('mouse.initialPosition', { source: 'navigator.getCurrentPoint' })

      experimental.getCurrentPoint('mouse').then(point => setPosition({ X: point.x, Y: point.y }))
    }

    const updateMousePosition = (e: globalThis.MouseEvent) => setPosition({ X: e.clientX, Y: e.clientY })
    const handleDocumentClick = (e: globalThis.MouseEvent) => {
      let elementInfo = 'Elemento Desconhecido'

      if (e.target instanceof HTMLElement) {
        const tagName = e.target.tagName
        const id = e.target.id ? `#${e.target.id}` : 'none'
        const classes = e.target.className ? `.${e.target.className.split(' ').join('.')}` : 'none'

        elementInfo = `${tagName}.${id}.${classes}`
        if (isTextElement(tagName)) {
          const text = !e.target.textContent
            ? ''
            : 25 < e.target.textContent.length
              ? `'${e.target.textContent.trim().substring(0, 25) + '...'}'`
              : `'${e.target.textContent}'`

          elementInfo = elementInfo + '_' + text
        }
      } else if (e.target instanceof SVGSVGElement || e.target instanceof SVGPathElement) {
        elementInfo = 'SVG.' + e.target.tagName
      }

      logger.info('click', { x: e.clientX, y: e.clientY, element: elementInfo })
      // dont call e.preventDefault() or e.stopPropagation()
    }

    document.addEventListener('mousemove', updateMousePosition)
    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  return <MouseContext.Provider value={{ position }} >
    {children}
  </MouseContext.Provider>
}
