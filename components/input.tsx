import React from 'react'
import { MAX_VALUE, MIN_VALUE } from '../utils/DataConstants'

interface StyledInputProps {
  type: string;
  name: string;
  value: number | string;
  placeholder?: string;
  changeHandle?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties | null;
  step?: number | null;
  max?: number;
  min?: number;
  height?: number;
}

export default function StyledInput({
  type,
  name,
  value,
  placeholder,
  changeHandle,
  style = null,
  step = null,
  max = MAX_VALUE,
  min = MIN_VALUE,
  height = 36
}: StyledInputProps) {
  let inputStyle: React.CSSProperties = { ...styles.input, height: height }
  if (style != null)
    inputStyle = { ...inputStyle, ...style }

  if (type == 'number') {
    return <input
      type={type}
      name={name}
      step={step != null ? step : 1}
      value={value}
      max={max}
      min={min = Number.MAX_VALUE ? MIN_VALUE : min}
      onChange={changeHandle}
      placeholder={placeholder}
      style={inputStyle}
    />
  }

  return <input
    type={type}
    name={name}
    value={value}
    onChange={changeHandle}
    placeholder={placeholder}
    style={inputStyle}
  />
}

const styles: { [key: string]: React.CSSProperties } = {
  input: {
    width: '100%',
    outline: 'none',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    boxSizing: 'border-box',
  },
}
