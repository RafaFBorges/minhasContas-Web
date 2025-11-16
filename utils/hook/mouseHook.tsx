"use client"

import { createContext, useContext, ReactNode, useState, useRef, useEffect, useLayoutEffect } from 'react'

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
    if ('getCurrentPoint' in navigator) {
      console.log('MouseProvider.useEffect > setting with navigator')

      // @ts-ignore
      navigator.getCurrentPoint('mouse').then((point: any) => setPosition({ X: point.x, Y: point.y }))
    }

    const updateMousePosition = (e: globalThis.MouseEvent) => setPosition({ X: e.clientX, Y: e.clientY })
    const handleDocumentClick = (e: globalThis.MouseEvent) => {
      let elementInfo = 'Elemento Desconhecido'

      console.log('Clicado > elementInfo=' + e.target)

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

      console.log(`MouseProvider.handleDocumentClick > X=${e.clientX} Y=${e.clientY} element=${elementInfo}`)
      // dont call e.preventDefault() or e.stopPropagation()
    }

    document.addEventListener('mousemove', updateMousePosition)
    document.addEventListener('click', handleDocumentClick)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  return <MouseContext.Provider value={{ position }} >
    {children}
  </MouseContext.Provider>
}
