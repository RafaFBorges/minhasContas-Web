import React from 'react'

interface StyledInputProps {
  type: string;
  name: string;
  value: number | string;
  placeholder?: string;
  changeHandle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clickHandle?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function StyledInput({ type, name, value, placeholder, changeHandle, clickHandle }: StyledInputProps) {
  return <input
    type={type}
    name={name}
    step="any"
    value={value}
    onChange={changeHandle}
    placeholder={placeholder}
    style={styles.input}
  />
}

const styles: { [key: string]: React.CSSProperties } = {
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    marginRight: '1rem',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
}
