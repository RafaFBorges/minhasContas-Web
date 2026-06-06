import React, { forwardRef, useState } from 'react'


export interface StyledInputProps {
  type?: string
  name: string
  value: number | string
  placeholder?: string
  changeHandle?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  style?: React.CSSProperties | null
  hasAutocomplete?: boolean
  height?: number
  borderErrorColor?: string
  borderSuccessColor?: string
  borderNormalColor?: string
  validate?: ((value: string) => boolean) | undefined
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  isValid?: boolean | null
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}

const StyledInput = forwardRef<HTMLInputElement, StyledInputProps>(({
  type = 'text',
  name,
  value,
  placeholder,
  changeHandle,
  style = null,
  hasAutocomplete = false,
  height = 36,
  borderErrorColor = '#e24b4a',
  borderSuccessColor = '#639922',
  borderNormalColor = '#d1d5db',
  validate = undefined,
  onKeyDown = undefined,
  onFocus = undefined,
  onBlur = undefined,
  isValid = undefined,
  inputMode = undefined,
}: StyledInputProps, ref) => {
  const [isValidState, setIsValid] = useState<boolean | null>(null)
  const [touched, setTouched] = useState(false)
  const [focused, setFocused] = useState(false)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true)

    if (onFocus)
      onFocus(e)
  }

  const handleBlur = () => {
    setFocused(false)
    setTouched(true)

    if (validate !== undefined)
      setIsValid(validate(String(value)))

    if (onBlur)
      onBlur()
  }

  const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    if (validate !== undefined)
      setIsValid(null)

    if (changeHandle)
      changeHandle(e)
  }

  const validValue = focused
    ? null
    : validate !== undefined
      ? isValidState
      : touched ? isValid : null

  const borderColor = validValue === false
    ? borderErrorColor
    : validValue === true
      ? borderSuccessColor
      : borderNormalColor

  const inputStyle: React.CSSProperties = {
    ...styles.input,
    height,
    border: `1.5px solid ${borderColor}`,
    ...style,
    transition: 'border-color 0.2s',
  }

  return <input
    ref={ref}
    autoComplete={hasAutocomplete ? 'on' : 'one-time-code'}
    type={type}
    name={name}
    value={value}
    onChange={handleChange}
    onBlur={handleBlur}
    placeholder={placeholder}
    style={inputStyle}
    onKeyDown={onKeyDown}
    onFocus={handleFocus}
    inputMode={inputMode}
  />
})

const styles: { [key: string]: React.CSSProperties } = {
  input: {
    width: '100%',
    outline: 'none',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '8px',
    boxSizing: 'border-box',
  },
}

export default StyledInput
