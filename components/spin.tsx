
import React from 'react'

import { FaChevronUp as UpIcon, FaChevronDown as DownIcon } from 'react-icons/fa'

import StyledInput from './input'
import ThemeButton from './themeButton'
import { MAX_VALUE, MIN_VALUE } from '../utils/DataConstants'

interface SpinProps {
  name: string;
  value: number | string;
  placeholder?: string;
  changeHandle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clickHandle?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties | null;
  max?: number;
  min?: number;
  setValueHandle?: (newValue: number) => void;
  height?: number;
}

export default function Spin({
  name,
  value,
  placeholder,
  changeHandle,
  clickHandle,
  style = null,
  max = MAX_VALUE,
  min = MIN_VALUE,
  setValueHandle = () => { },
  height = 36
}: SpinProps) {
  let spinStyle: React.CSSProperties = { ...styles.spin, height: height }
  if (style != null)
    spinStyle = { ...spinStyle, ...style }

  function IconClick(increment: number) {
    if (typeof value !== 'number')
      return

    const newValue: number = Number(value) + increment
    if (newValue < min || max < newValue)
      return

    setValueHandle(newValue)
  }

  return <div style={spinStyle}>
    <StyledInput
      type={'number'}
      name={name}
      value={value}
      changeHandle={changeHandle}
      placeholder={placeholder}
      style={style}
      max={max}
      min={min}
      height={height}
    />
    <div style={{ ...styles.buttonArea, top: (height - 34) / 2 }}>
      <ThemeButton
        clickHandle={() => IconClick(1)}
        Icon={UpIcon}
        isClickableIcon
      />
      <ThemeButton
        clickHandle={() => IconClick(-1)}
        Icon={DownIcon}
        isClickableIcon
      />
    </div>
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  spin: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    border: 'none',
    borderRadius: '8px',
    boxSizing: 'border-box',
  },
  buttonArea: {
    position: 'absolute',
    display: 'flex',
    gap: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    right: 4,
    zIndex: 10,
  }
}
