'use client'

import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa"

export default function Home() {
  const [value, setValue] = useState<number>(0)
  const [valueList, setValueList] = useState<number[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed: number = parseFloat(e.target.value)

    if (!isNaN(parsed))
      setValue(parsed)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setValueList([...valueList, value])
  }

  return <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
    <h1>Minhas Contas</h1>
    <h3>Despesas</h3>

    <div style={styles.flexRow}>
      <input
        type="number"
        step="any"
        value={value}
        onChange={handleChange}
        placeholder="Ex: 3.14"
        style={styles.input}
      />

      <button
        onClick={handleClick}
        style={styles.button}
      >
        <FaPlus />
      </button>
    </div>

    {valueList != null && valueList.map((value, index) => {
      return <div style={styles.card} key={index}>
        <div style={styles.content}>
          <h6 style={styles.title}>{value}</h6>
          <p style={styles.description}>date</p>
        </div>
      </div>
    })}
  </main>
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: '2rem',
    fontFamily: 'sans-serif',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
  },
  flexRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '350px',
    boxSizing: 'border-box',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    marginRight: '1rem',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxWidth: '350px',
    marginTop: '2rem',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  content: {
    padding: '1rem',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.25rem',
  },
  description: {
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    color: '#555',
  },
  button: {
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};