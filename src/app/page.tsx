'use client'

import StyledButton from '@/components/button'
import Card from '@/components/card'
import StyledInput from '@/components/input'
import { ExpenseResponse } from '@/comunication/expense'
import { Expense } from '@/domain/Expense'
import React, { useEffect, useState } from 'react'
import { FaPlus as AddIcon } from 'react-icons/fa'


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

export async function handlePOST(endpoint: string, body: object) {
  try {
    console.log("handlePOST : [start] endpoint=" + SERVER_PATH + endpoint)

    const response = await fetch(SERVER_PATH + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })

    if (!response.ok)
      throw new Error("Erro HTTP: " + response.status)

    const data = await response.json()

    let logMessage = "handlePOST : [request send]"
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
    return Response.json({ error: "Erro ao processar" }, { status: 400 });
  }
}

export async function handleDELETE(endpoint: string) {
  try {
    console.log("handleDELETE : [start] endpoint=" + SERVER_PATH + endpoint)

    const response = await fetch(SERVER_PATH + endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })

    console.log('handleDELETE : status=' + response.status)

    if (!response.ok)
      throw new Error("Erro HTTP: " + response.status)

    return response.status == 204
  } catch (err) {
    return Response.json({ error: "Erro ao processar" }, { status: 400 });
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

  const handleAddNewClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const response = await handlePOST(EXPENSES_ENDPOINT, {
      "value": value,
      "date": new Date()
    })

    if (response != null)
      setValueList([...valueList, new Expense(response.id, response.value, response.dates)])
  }

  const handleDeleteClick = async (index: number) => {
    if (await handleDELETE(EXPENSES_ENDPOINT + '/' + index))
      setValueList(valueList.filter(expense => {
        return expense.id !== index;
      }))
  }

  async function SyncExpenses() {
    try {
      console.log("HOME.useEffect : [initial load] fetching expenses")

      const serverExpensesList: Promise<ExpenseResponse[]> = await handleGET(EXPENSES_ENDPOINT)

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
      <StyledInput
        type={'number'}
        name={'expenseValue'}
        value={value}
        changeHandle={handleChange}
      />

      <StyledButton
        clickHandle={handleAddNewClick}
        Icon={AddIcon}
      />
    </div>

    {valueList != null && valueList.map(item => {
      return <Card
        key={item.id}
        id={item.id}
        title={item.value}
        deleteClickHandle={handleDeleteClick}
        date={item.lastDate}
      />
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
}