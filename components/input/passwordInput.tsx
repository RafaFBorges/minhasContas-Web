import React, { useEffect, useState } from 'react'

import StyledInput, { StyledInputProps } from './input'
import { FaEye as ShowIcon, FaEyeSlash as HideIcon } from 'react-icons/fa'


interface PasswordInputProps extends StyledInputProps {
  iconColor?: string;
}

export default function PasswordInput({
  style = null,
  height = 36,
  iconColor = '#6b7280',

  ...ret
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
      {...ret}

      type={show ? 'text' : 'password'}
      style={{ ...styles.input, ...style }}
      height={height}
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
