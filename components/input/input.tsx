import React, { forwardRef, useState } from 'react'
import { MAX_VALUE, MIN_VALUE } from '../../utils/DataConstants'


export interface StyledInputProps {
  type?: string;
  name: string;
  value: number | string;
  placeholder?: string;
  changeHandle?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties | null;
  step?: number | null;
  hasAutocomplete?: boolean;
  max?: number;
  min?: number;
  height?: number;
  borderErrorColor?: string;
  borderSuccessColor?: string;
  borderNormalColor?: string;
  validate?: ((value: string) => boolean) | undefined;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isValid?: boolean | null;
}

type SpecificInputProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'step' | 'max' | 'min'>

const StyledInput = forwardRef<HTMLInputElement, StyledInputProps>(({
  type = 'text',
  name,
  value,
  placeholder,
  changeHandle,
  style = null,
  step = null,
  hasAutocomplete = false,
  max = MAX_VALUE,
  min = MIN_VALUE,
  height = 36,
  borderErrorColor = '#e24b4a',
  borderSuccessColor = '#639922',
  borderNormalColor = '#d1d5db',
  validate = undefined,
  onKeyDown = undefined,
  isValid = undefined,
}: StyledInputProps, ref) => {
  const [isValidState, setIsValid] = useState<boolean | null>(null)
  const [touched, setTouched] = useState(false)
  const [focused, setFocused] = useState(false)

  const handleFocus = () => setFocused(true)

  const handleBlur = () => {
    setFocused(false)
    setTouched(true)

    if (validate !== undefined)
      setIsValid(validate(String(value)))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    ...style,
    border: `1.5px solid ${borderColor}`,
    transition: 'border-color 0.2s',
  }

  const specificInputProps: SpecificInputProps = type === 'number'
    ? { step: step ?? 1, max, min: min === Number.MAX_VALUE ? MIN_VALUE : min }
    : {}

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

    {...specificInputProps}
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
