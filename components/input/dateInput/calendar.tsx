import React, { useEffect, useRef, useState } from 'react'
import { DateValue } from './dateInput'


interface CalendarProps {
  date: DateValue
  show: boolean
  setShow: (show: boolean) => void
  top: number
}

export default function Calendar({
  date,
  show,
  setShow,
  top
}: CalendarProps) {
  const clendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!show)
      return

    const handleMouseDown = (e: MouseEvent) => {
      if (clendarRef.current && !clendarRef.current.contains(e.target as Node))
        setShow(false)
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [show])

  if (!show)
    return null

  return <div ref={clendarRef} style={{ ...styles.calendar, top: top }}>
    Calendar
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  calendar: {
    width: '200px',
    height: '150px',
    right: 0,
    position: 'absolute',
    backgroundColor: 'grey',
    borderRadius: '8px',
    zIndex: 9999,
  },
}
