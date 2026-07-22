import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { encrypt, decrypt } from '../../utils/crypto'

import StyledInput, { StyledInputProps } from './input'
import { FaEye as ShowIcon, FaEyeSlash as HideIcon } from 'react-icons/fa'


interface PasswordInputProps extends StyledInputProps {
  iconColor?: string;
}

export default function PasswordInput({
  style = null,
  height = 36,
  iconColor = '#6b7280',
  value,
  changeHandle,

  ...rest
}: PasswordInputProps) {
  const [show, setShow] = useState<boolean>(false)
  const [length, setLength] = useState<number>(0)
  const [visiblePlain, setVisiblePlain] = useState<string>('')

  const selectionRef: React.RefObject<{ start: number; end: number }> = useRef<{ start: number; end: number }>({ start: 0, end: 0 })
  const requestId: React.RefObject<number> = useRef<number>(0)
  const inputElRef: React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement | null>(null)
  const pendingCursorRef: React.RefObject<number | null> = useRef<number | null>(null)

  const Icon = show ? HideIcon : ShowIcon

  useEffect(() => {
    const currentId: number = ++requestId.current

    if (!value) {
      setLength(0)
      return
    }

    decrypt(String(value))
      .then((plain) => {
        if (requestId.current !== currentId)
          return

        setLength(plain.length)
      })
      .catch((err) => console.error('PasswordInput: [decrypt error]', err))
  }, [value])

  useEffect(() => {
    if (!show)
      return

    let active: boolean = true
    const currentEncrypted: string = String(value ?? '')

    if (currentEncrypted)
      decrypt(currentEncrypted)
        .then((plain) => {
          if (active)
            setVisiblePlain(plain)
        })
        .catch((err) => console.error('PasswordInput: [decrypt error]', err))

    return () => {
      active = false
      setVisiblePlain('')
    }
  }, [show, value])

  useEffect(() => {
    if (!show)
      return

    const hide = () => setShow(false)

    document.addEventListener('mouseup', hide)
    window.addEventListener('blur', hide)

    return () => {
      document.removeEventListener('mouseup', hide)
      window.removeEventListener('blur', hide)
    }
  }, [show])

  useLayoutEffect(() => {
    if (pendingCursorRef.current === null)
      return

    const pos: number = pendingCursorRef.current
    pendingCursorRef.current = null

    const el: HTMLInputElement | null = inputElRef.current
    if (el)
      el.setSelectionRange(pos, pos)
  }, [length, visiblePlain])

  const captureSelection = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target: HTMLInputElement = e.target as HTMLInputElement
    inputElRef.current = target
    selectionRef.current = {
      start: target.selectionStart ?? target.value.length,
      end: target.selectionEnd ?? target.value.length,
    }
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      let newPlain: string
      let cursorPos: number

      if (show) {
        newPlain = e.target.value
        cursorPos = e.target.selectionStart ?? newPlain.length
      } else {
        const currentEncrypted: string = String(value ?? '')
        const currentPlain: string = currentEncrypted ? await decrypt(currentEncrypted) : ''

        const nativeEvent: InputEvent = e.nativeEvent as InputEvent
        const { start, end } = selectionRef.current
        const inserted: string = nativeEvent.data ?? ''
        const inputType: string = nativeEvent.inputType

        let deleteStart: number = start
        let deleteEnd: number = end

        if (start === end && inserted === '') {
          if (inputType === 'deleteContentBackward')
            deleteStart = Math.max(0, start - 1)
          else if (inputType === 'deleteContentForward')
            deleteEnd = Math.min(currentPlain.length, end + 1)
        }

        newPlain = currentPlain.slice(0, deleteStart) + inserted + currentPlain.slice(deleteEnd)
        cursorPos = inserted !== '' ? deleteStart + inserted.length : deleteStart
      }

      const encrypted: string = await encrypt(newPlain)

      pendingCursorRef.current = cursorPos
      setLength(newPlain.length)

      if (show)
        setVisiblePlain(newPlain)

      if (changeHandle != null) {
        e.target.value = encrypted
        changeHandle(e)
      }
    } catch (err) {
      console.error('PasswordInput: [encrypt error]', err)
    }
  }

  function handleShow() {
    setShow(true)
  }

  const iconSize: number = 22
  const iconTop: number = height / 2 - iconSize / 2
  const displayedValue: string = show ? visiblePlain : '*'.repeat(length)

  return <div style={styles.container}>
    <StyledInput
      {...rest}

      ref={inputElRef}
      value={displayedValue}
      changeHandle={handleChange}
      onKeyDown={captureSelection}
      onPaste={captureSelection}
      type={show ? 'text' : 'password'}
      style={{ ...styles.input, ...style }}
      height={height}
    />
    <Icon
      color={iconColor}
      size={iconSize}
      style={{ ...styles.icon, top: iconTop }}
      onMouseDown={handleShow}
    />
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    paddingRight: '2.5rem',
    width: '100%',
  },
  icon: {
    position: 'absolute',
    right: '1rem',
    cursor: 'pointer',
  },
}
