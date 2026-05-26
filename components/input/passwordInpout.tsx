import React, { useEffect, useState } from 'react'

import { MAX_VALUE, MIN_VALUE } from '../../utils/DataConstants'
import StyledInput, { StyledInputProps } from './input'
import { FaEye as ShowIcon, FaEyeSlash as HideIcon } from 'react-icons/fa'


interface PasswordInputProps extends StyledInputProps {
  iconColor?: string;
}

export default function PasswordInput({
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
  iconColor = '#6b7280',
  isValid = null,
}: PasswordInputProps) {
  const [show, setShow] = useState<boolean>(false)
  const Icon = show ? HideIcon : ShowIcon

  useEffect(() => {
    if (!show) return

    const handleMouseUp = () => setShow(false)
    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [show])

  return <div style={styles.container}>
    <StyledInput
      type={show ? 'text' : 'password'}
      isValid={isValid}
      name={name}
      value={value}
      placeholder={placeholder}
      changeHandle={changeHandle}
      style={{ ...styles.input, ...style }}
      step={step}
      hasAutocomplete={hasAutocomplete}
      max={max}
      min={min}
      height={height}
      borderErrorColor={borderErrorColor}
      borderSuccessColor={borderSuccessColor}
      borderNormalColor={borderNormalColor}
      validate={validate}
      onKeyDown={onKeyDown}
    />
    <Icon
      color={iconColor}
      size={24}
      style={styles.icon}
      onMouseDown={() => setShow(true)}
    />
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    paddingRight: '2.5em',
  },
  icon: {
    position: 'absolute',
    right: '1em',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
  },
}
