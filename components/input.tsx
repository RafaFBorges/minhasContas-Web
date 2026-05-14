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
  hasAutocomplete?: boolean;
  max?: number;
  min?: number;
  height?: number;
}

type SpecificInputProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'step' | 'max' | 'min'>

export default function StyledInput({
  type,
  name,
  value,
  placeholder,
  changeHandle,
  style = null,
  step = null,
  hasAutocomplete = false,
  max = MAX_VALUE,
  min = MIN_VALUE,
  height = 36
}: StyledInputProps) {
  let inputStyle: React.CSSProperties = { ...styles.input, height: height }
  if (style != null)
    inputStyle = { ...inputStyle, height, ...style }

  const specificInputProps: SpecificInputProps = type === 'number' ? {
    step: step != null ? step : 1,
    max: max,
    min: min === Number.MAX_VALUE ? MIN_VALUE : min
  } : {};

  return <input
    autoComplete={hasAutocomplete ? 'on' : 'one-time-code'}
    type={type}
    name={name}
    value={value}
    onChange={changeHandle}
    placeholder={placeholder}
    style={inputStyle}

    {...specificInputProps}
  />
}

const styles: { [key: string]: React.CSSProperties } = {
  input: {
    width: '100%',
    outline: 'none',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1.5px solid #d1d5db',
    boxSizing: 'border-box',
  },
}
