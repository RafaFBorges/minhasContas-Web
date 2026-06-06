import React, { useEffect, useState } from 'react'

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
  hasAutocomplete = false,
  height = 36,
  borderErrorColor = '#e24b4a',
  borderSuccessColor = '#639922',
  borderNormalColor = '#d1d5db',
  validate = undefined,
  onKeyDown = undefined,
  iconColor = '#6b7280',
  isValid = null,
  onBlur = undefined,
}: PasswordInputProps) {
  const [show, setShow] = useState<boolean>(false)
  const Icon = show ? HideIcon : ShowIcon

  useEffect(() => {
    if (!show) return

    const handleMouseUp = () => setShow(false)
    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [show])

  const iconSize = 22
  const iconTop = height / 2 - iconSize / 2

  return <div style={styles.container}>
    <StyledInput
      type={show ? 'text' : 'password'}
      isValid={isValid}
      name={name}
      value={value}
      placeholder={placeholder}
      changeHandle={changeHandle}
      style={{ ...styles.input, ...style }}
      hasAutocomplete={hasAutocomplete}
      height={height}
      borderErrorColor={borderErrorColor}
      borderSuccessColor={borderSuccessColor}
      borderNormalColor={borderNormalColor}
      validate={validate}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
    <Icon
      color={iconColor}
      size={iconSize}
      style={{ ...styles.icon, top: iconTop }}
      onMouseDown={() => setShow(true)}
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
