import React, { useRef } from 'react'
import StyledInput, { StyledInputProps } from './input'

interface PhoneInputProps extends StyledInputProps { }

export default function PhoneInput({ changeHandle, ...ret }: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const ALLOWED_CHARACTER = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End']

  function countDigitsUntil(str: string, pos: number): number {
    return str.slice(0, pos).replace(/\D/g, '').length
  }

  function findCursorInMasked(masked: string, digitIndex: number): number {
    let count = 0
    for (let i = 0; i < masked.length; i++) {
      if (count === digitIndex)
        return i

      if (/\d/.test(masked[i]))
        count++
    }

    return masked.length
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const cursorPos = e.target.selectionStart ?? raw.length

    const digitsBeforeCursor = countDigitsUntil(raw, cursorPos)
    const digits = raw.replace(/\D/g, '').slice(0, 13)
    const masked = applyPhoneMask(digits)
    const newCursor = findCursorInMasked(masked, digitsBeforeCursor)

    e.target.value = masked

    requestAnimationFrame(() => inputRef.current?.setSelectionRange(newCursor, newCursor))

    if (changeHandle)
      changeHandle(e)
  }

  function deleteCaracter(input: HTMLInputElement, value: string, i: number, end: number) {
    if (i < 0 || value.length <= i)
      return

    const digits = (value.slice(0, i) + value.slice(i + 1)).replace(/\D/g, '').slice(0, 13)
    const masked = applyPhoneMask(digits)
    const newCursor = findCursorInMasked(masked, countDigitsUntil(value, end))

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
    nativeInputValueSetter?.call(input, masked)
    input.dispatchEvent(new Event('input', { bubbles: true }))

    requestAnimationFrame(() => input.setSelectionRange(newCursor, newCursor))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!inputRef.current)
      return

    let i = inputRef.current.selectionStart ?? 0
    const val = inputRef.current.value

    if (e.key === 'Backspace') {
      e.preventDefault()

      i = i - 1
      while (0 <= i && !/\d/.test(val[i]))
        i--

      deleteCaracter(inputRef.current, val, i, i)
    } else if (e.key === 'Delete') {
      e.preventDefault()

      const cursor = i
      while (i < val.length && !/\d/.test(val[i]))
        i++

      deleteCaracter(inputRef.current, val, i, cursor)
    } else if (!ALLOWED_CHARACTER.includes(e.key) && !e.ctrlKey && !e.metaKey && !/^\d$/.test(e.key))
      e.preventDefault()
  }

  function applyPhoneMask(digits: string): string {
    if (digits.length <= 2)
      return digits

    if (digits.length <= 4)
      return `${digits.slice(0, 2)} (${digits.slice(2)}`

    const rest = digits.slice(4)

    const part1Length = (rest.length <= 8) ? 4 : 5
    const part2 = rest.slice(part1Length)
    return `${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${rest.slice(0, part1Length)}${part2 ? ` - ${part2}` : ''}`
  }

  return <StyledInput
    {...ret}

    ref={inputRef}
    type={'tel'}
    changeHandle={handleChange}
    onKeyDown={handleKeyDown}
  />
}
