'use client'

import { Expense } from '@/domain/Expense'
import React, { useEffect, useState } from 'react'
import { FaPlus } from "react-icons/fa"

const SERVER_PATH = 'https://minhascontas-server.onrender.com/'
const EXPENSES_ENDPOINT = 'expense'

export async function handleGET(endpoint: string) {
  try {
    console.log("handleGET : [start] endpoint=" + SERVER_PATH + endpoint)

    const response = await fetch(SERVER_PATH + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if (!response.ok)
      throw new Error("Erro HTTP: " + response.status)

    const data = await response.json()

    let logMessage = "handleGET : [request send]"
    if (!data)
      logMessage += 'empty data'
    else if (Array.isArray(data))
      logMessage += 'Count=' + data.length
    else if (typeof data === "object")
      logMessage += 'ObjectKeysCount=' + Object.keys(data).length
    else
      logMessage += 'Unexpected response type'
    console.log(logMessage)

    return data
  } catch (err) {
    return Response.json({ error: "Falha ao buscar dados" }, { status: 500 })
  }
}

export default function Home() {
  const [value, setValue] = useState<number>(0)
  const [valueList, setValueList] = useState<Expense[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed: number = parseFloat(e.target.value)

    if (!isNaN(parsed))
      setValue(parsed)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setValueList([...valueList, new Expense(0, value, [new Date()])])
  }

  async function SyncExpenses() {
    try {
      console.log("HOME.useEffect : [initial load] fetching expenses")

      const serverExpensesList: Promise<any[]> = await handleGET(EXPENSES_ENDPOINT)

      if (!(serverExpensesList != null) || !Array.isArray(serverExpensesList))
        throw Error('Invalid Expense response')

      const expensesList: Expense[] = []
      serverExpensesList.forEach(expense => expensesList.push(new Expense(expense.id, expense.value, expense.dates)))
      setValueList(expensesList)
    } catch (err) {
      console.error("HOME.useEffect : [Error] erro=", err)
    }
  }

  useEffect(() => {
    SyncExpenses()
  }, [])

  return <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
    <h1>Minhas Contas</h1>
    <h3>Despesas</h3>

    <div style={styles.flexRow}>
      <input
        type="number"
        name="expenseValue"
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

    {valueList != null && valueList.map((item, index) => {
      return <div style={styles.card} key={index}>
        <div style={styles.content}>
          <h6 style={styles.title}>{item.value}</h6>
          <p style={styles.description}>{item.lastDate}</p>
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